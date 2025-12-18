import type { Task, SLA, SLATimeUnit } from '@/types/schema';

export interface SLAStatus {
  isBreached: boolean;
  isAtRisk: boolean; // Within 20% of deadline
  remainingTime: number; // in milliseconds
  remainingTimeFormatted: string;
  responseDeadline: Date | null;
  resolutionDeadline: Date | null;
  responseTimeMet: boolean;
  resolutionTimeMet: boolean;
  statusColor: 'green' | 'yellow' | 'orange' | 'red' | 'gray';
  statusLabel: string;
}

export interface ManagerMetrics {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  resolvedTasks: number;
  overdueTasks: number;
  slaBreached: number;
  slaAtRisk: number;
  slaCompliant: number;
  avgResponseTime: number; // in hours
  avgResolutionTime: number; // in hours
  tasksByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  tasksByCategory: Record<string, number>;
}

/**
 * Convert SLA time to milliseconds
 */
export function convertSLATimeToMs(
  time: number,
  unit: SLATimeUnit,
  businessHoursOnly: boolean = false
): number {
  const msPerHour = 1000 * 60 * 60;
  const hoursPerBusinessDay = 8; // 9am-5pm
  const hoursPerCalendarDay = 24;

  switch (unit) {
    case 'hours':
      return time * msPerHour;
    case 'business_days':
      return time * hoursPerBusinessDay * msPerHour;
    case 'calendar_days':
      return time * hoursPerCalendarDay * msPerHour;
    default:
      return 0;
  }
}

/**
 * Calculate SLA deadlines for a task
 */
export function calculateSLADeadlines(
  task: Task,
  sla: SLA | undefined
): { responseDeadline: Date | null; resolutionDeadline: Date | null } {
  if (!sla) {
    return { responseDeadline: null, resolutionDeadline: null };
  }

  const createdAt = new Date(task.created_at);

  // Calculate response deadline
  const responseMs = convertSLATimeToMs(
    sla.response_time,
    sla.response_time_unit,
    sla.business_hours_only
  );
  const responseDeadline = new Date(createdAt.getTime() + responseMs);

  // Calculate resolution deadline
  let resolutionDeadline: Date | null = null;
  if (sla.resolution_time && sla.resolution_time_unit) {
    const resolutionMs = convertSLATimeToMs(
      sla.resolution_time,
      sla.resolution_time_unit,
      sla.business_hours_only
    );
    resolutionDeadline = new Date(createdAt.getTime() + resolutionMs);
  }

  return { responseDeadline, resolutionDeadline };
}

/**
 * Check if task has been responded to
 */
export function hasFirstResponse(task: Task): boolean {
  return !!task.assigned_at || task.status !== 'open';
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(ms: number): string {
  if (ms < 0) {
    const abMs = Math.abs(ms);
    const hours = Math.floor(abMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h overdue`;
    }
    return `${hours}h overdue`;
  }

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h left`;
  }
  if (hours > 0) {
    return `${hours}h left`;
  }
  const minutes = Math.floor(ms / (1000 * 60));
  return `${minutes}m left`;
}

/**
 * Calculate SLA status for a task
 */
export function calculateSLAStatus(task: Task, sla: SLA | undefined): SLAStatus {
  const now = new Date();

  // Default status when no SLA
  if (!sla) {
    return {
      isBreached: false,
      isAtRisk: false,
      remainingTime: 0,
      remainingTimeFormatted: 'No SLA',
      responseDeadline: null,
      resolutionDeadline: null,
      responseTimeMet: true,
      resolutionTimeMet: true,
      statusColor: 'gray',
      statusLabel: 'No SLA'
    };
  }

  const { responseDeadline, resolutionDeadline } = calculateSLADeadlines(task, sla);
  const hasResponse = hasFirstResponse(task);
  const isResolved = task.status === 'resolved' || task.status === 'closed';

  // Check response time
  const responseTimeMet = hasResponse && responseDeadline
    ? new Date(task.assigned_at || task.updated_at) <= responseDeadline
    : !responseDeadline || hasResponse;

  // Check resolution time
  const resolutionTimeMet = isResolved && resolutionDeadline && task.resolved_at
    ? new Date(task.resolved_at) <= resolutionDeadline
    : !resolutionDeadline || !isResolved;

  // Calculate remaining time based on current status
  let remainingTime = 0;
  let activeDeadline: Date | null = null;

  if (!isResolved && resolutionDeadline) {
    // Active tasks track resolution time
    activeDeadline = resolutionDeadline;
    remainingTime = resolutionDeadline.getTime() - now.getTime();
  } else if (!hasResponse && responseDeadline) {
    // Unassigned tasks track response time
    activeDeadline = responseDeadline;
    remainingTime = responseDeadline.getTime() - now.getTime();
  }

  // Determine breach and risk status
  const isBreached = !responseTimeMet || (resolutionDeadline !== null && !isResolved && remainingTime < 0);
  const isAtRisk = !isBreached && activeDeadline !== null && remainingTime > 0 && remainingTime < (convertSLATimeToMs(
    sla.resolution_time || sla.response_time,
    sla.resolution_time_unit || sla.response_time_unit,
    sla.business_hours_only
  ) * 0.2); // Within 20% of deadline

  // Determine status color and label
  let statusColor: 'green' | 'yellow' | 'orange' | 'red' | 'gray' = 'green';
  let statusLabel = 'On Track';

  if (isResolved) {
    if (resolutionTimeMet && responseTimeMet) {
      statusColor = 'green';
      statusLabel = 'Met SLA';
    } else {
      statusColor = 'red';
      statusLabel = 'Breached (Resolved)';
    }
  } else if (isBreached) {
    statusColor = 'red';
    statusLabel = 'Breached';
  } else if (isAtRisk) {
    statusColor = 'orange';
    statusLabel = 'At Risk';
  } else if (!hasResponse) {
    statusColor = 'yellow';
    statusLabel = 'Awaiting Response';
  }

  return {
    isBreached,
    isAtRisk,
    remainingTime,
    remainingTimeFormatted: activeDeadline ? formatTimeRemaining(remainingTime) : 'N/A',
    responseDeadline,
    resolutionDeadline,
    responseTimeMet,
    resolutionTimeMet,
    statusColor,
    statusLabel
  };
}

/**
 * Calculate metrics for a manager based on their tasks
 */
export function calculateManagerMetrics(
  tasks: Task[],
  slas: SLA[]
): ManagerMetrics {
  const slaMap = new Map(slas.map(sla => [sla.id, sla]));

  let totalResponseTime = 0;
  let totalResolutionTime = 0;
  let tasksWithResponse = 0;
  let tasksWithResolution = 0;

  const metrics: ManagerMetrics = {
    totalTasks: tasks.length,
    openTasks: 0,
    inProgressTasks: 0,
    resolvedTasks: 0,
    overdueTasks: 0,
    slaBreached: 0,
    slaAtRisk: 0,
    slaCompliant: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0,
    tasksByPriority: {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    tasksByCategory: {}
  };

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'open':
        metrics.openTasks++;
        break;
      case 'in_progress':
        metrics.inProgressTasks++;
        break;
      case 'resolved':
      case 'closed':
        metrics.resolvedTasks++;
        break;
    }

    // Count by priority
    if (task.priority in metrics.tasksByPriority) {
      metrics.tasksByPriority[task.priority as keyof typeof metrics.tasksByPriority]++;
    }

    // Count by category
    if (task.category) {
      metrics.tasksByCategory[task.category] = (metrics.tasksByCategory[task.category] || 0) + 1;
    }

    // Check if overdue
    if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'resolved' && task.status !== 'closed') {
      metrics.overdueTasks++;
    }

    // Calculate SLA status
    const sla = task.sla_id ? slaMap.get(task.sla_id) : undefined;
    const slaStatus = calculateSLAStatus(task, sla);

    if (slaStatus.isBreached) {
      metrics.slaBreached++;
    } else if (slaStatus.isAtRisk) {
      metrics.slaAtRisk++;
    } else if (sla) {
      metrics.slaCompliant++;
    }

    // Calculate response time
    if (task.assigned_at) {
      const responseTime = new Date(task.assigned_at).getTime() - new Date(task.created_at).getTime();
      totalResponseTime += responseTime;
      tasksWithResponse++;
    }

    // Calculate resolution time
    if (task.resolved_at) {
      const resolutionTime = new Date(task.resolved_at).getTime() - new Date(task.created_at).getTime();
      totalResolutionTime += resolutionTime;
      tasksWithResolution++;
    }
  });

  // Calculate averages in hours
  metrics.avgResponseTime = tasksWithResponse > 0
    ? totalResponseTime / tasksWithResponse / (1000 * 60 * 60)
    : 0;

  metrics.avgResolutionTime = tasksWithResolution > 0
    ? totalResolutionTime / tasksWithResolution / (1000 * 60 * 60)
    : 0;

  return metrics;
}

/**
 * Get SLA for a task based on priority (simplified matching)
 */
export function getSLAForTask(task: Task, slas: SLA[]): SLA | undefined {
  if (task.sla_id) {
    return slas.find(sla => sla.id === task.sla_id);
  }

  // Find matching SLA based on priority and scheme
  return slas.find(
    sla =>
      sla.strata_scheme_id === task.strata_scheme_id &&
      sla.priority_level === task.priority &&
      sla.channel === 'email' && // Default to email
      sla.active
  );
}
