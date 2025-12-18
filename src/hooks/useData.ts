import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Task,
  TaskWithDetails,
  Customer,
  Communication,
  CommunicationWithDetails,
  CommunicationFilters,
  TaskCategory,
  TaskCategoryOption,
  CreateTaskData,
  CreateCommunicationData,
  TaskFilters,
  SLA
} from '@/types/schema';
import { 
  getTasks as getTasksFromStorage,
  getCustomers as getCustomersFromStorage,
  getCommunications as getCommunicationsFromStorage,
  addTask as addTaskToStorage,
  addCommunication as addCommunicationToStorage,
  updateTask as updateTaskInStorage,
  saveTasks,
  saveCustomers,
  saveCommunications
} from '@/lib/storage';

// Import JSON data
import tasksData from '@/data/tasks.json';
import customersData from '@/data/customers.json';
import communicationsData from '@/data/communications.json';
import slasData from '@/data/slas.json';

// Query keys
export const queryKeys = {
  tasks: (schemeId: string) => ['tasks', schemeId] as const,
  task: (schemeId: string, id: string) => ['tasks', schemeId, id] as const,
  tasksByCategory: (schemeId: string, category: TaskCategory | 'all') => ['tasks', schemeId, 'category', category] as const,
  customers: (schemeId: string) => ['customers', schemeId] as const,
  customer: (schemeId: string, id: string) => ['customers', schemeId, id] as const,
  communications: (schemeId: string) => ['communications', schemeId] as const,
  communicationsByTask: (schemeId: string, taskId: string) => ['communications', schemeId, 'task', taskId] as const,
  taskCategories: (schemeId: string) => ['task-categories', schemeId] as const,
  slas: (schemeId: string) => ['slas', schemeId] as const,
};

// API simulation functions
async function fetchTasks(): Promise<Task[]> {
  const storedTasks = getTasksFromStorage();
  if (storedTasks && storedTasks.length > 0) {
    return storedTasks;
  }

  // Initialize with JSON data - add strata_scheme_id to legacy data
  const tasksWithScheme = tasksData.map(task => ({
    ...task,
    strata_scheme_id: task.strata_scheme_id || 'strata-scheme-1' // Use existing or default to first scheme
  })) as Task[];
  saveTasks(tasksWithScheme);
  return tasksWithScheme;
}

async function fetchCustomers(): Promise<Customer[]> {
  const storedCustomers = getCustomersFromStorage();
  if (storedCustomers && storedCustomers.length > 0) {
    return storedCustomers;
  }
  
  saveCustomers(customersData as Customer[]);
  return customersData as Customer[];
}

async function fetchCommunications(): Promise<Communication[]> {
  const storedComms = getCommunicationsFromStorage();
  if (storedComms && storedComms.length > 0) {
    return storedComms;
  }

  // Communications data already has strata_scheme_id in the JSON
  const comms = communicationsData as Communication[];
  saveCommunications(comms);
  return comms;
}

async function fetchTaskById(id: string, schemeId?: string): Promise<TaskWithDetails | null> {
  const tasks = await fetchTasks();
  const customers = await fetchCustomers();
  const communications = await fetchCommunications();
  
  // Only filter by scheme if specifically provided, otherwise find by ID only
  const task = tasks.find(t => t.id === id && (!schemeId || t.strata_scheme_id === schemeId));
  if (!task) return null;
  
  const customer = customers.find(c => c.id === task.customer_id);
  const taskCommunications = communications.filter(c => c.task_id === id);
  
  return {
    ...task,
    customer,
    communications: taskCommunications,
    communication_count: taskCommunications.length,
    latest_communication: taskCommunications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0]
  };
}

async function fetchTasksByCategory(category: TaskCategory | 'all', schemeId?: string): Promise<TaskWithDetails[]> {
  const tasks = await fetchTasks();
  const customers = await fetchCustomers();
  const communications = await fetchCommunications();

  let filteredTasks = category === 'all' ? tasks : tasks.filter(task => task.category === category);

  // Filter by scheme if provided
  if (schemeId) {
    filteredTasks = filteredTasks.filter(task => task.strata_scheme_id === schemeId);
  }
  
  return filteredTasks.map(task => {
    const customer = customers.find(c => c.id === task.customer_id);
    const taskCommunications = communications.filter(c => c.task_id === task.id);
    
    return {
      ...task,
      customer,
      communications: taskCommunications,
      communication_count: taskCommunications.length,
      latest_communication: taskCommunications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function fetchTaskCategories(): Promise<TaskCategoryOption[]> {
  const tasks = await fetchTasks();

  const categoryCounts = tasks.reduce((acc, task) => {
    const category = task.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<TaskCategory, string> = {
    maintenance: 'Maintenance',
    repairs: 'Repairs',
    noise_complaint: 'Noise Complaint',
    parking: 'Parking',
    pets: 'Pets',
    common_property: 'Common Property',
    levy_inquiry: 'Levy Inquiry',
    insurance: 'Insurance',
    by_laws: 'By-Laws',
    meeting_inquiry: 'Meeting Inquiry',
    other: 'Other',
  };

  const categories: TaskCategoryOption[] = [
    { value: 'all', label: 'All Tasks', count: tasks.length }
  ];

  Object.entries(categoryLabels).forEach(([key, label]) => {
    const count = categoryCounts[key] || 0;
    if (count > 0) {
      categories.push({
        value: key as TaskCategory,
        label,
        count
      });
    }
  });

  return categories;
}

async function fetchCommunicationsWithDetails(
  schemeId: string,
  filters?: CommunicationFilters
): Promise<CommunicationWithDetails[]> {
  const communications = await fetchCommunications();
  const customers = await fetchCustomers();
  const tasks = await fetchTasks();

  let filtered = communications.filter(c => c.strata_scheme_id === schemeId);

  // Apply filters
  if (filters) {
    if (filters.channel && filters.channel !== 'all') {
      filtered = filtered.filter(c => c.channel === filters.channel);
    }
    if (filters.direction && filters.direction !== 'all') {
      filtered = filtered.filter(c => c.direction === filters.direction);
    }
    if (filters.triaged !== undefined && filters.triaged !== 'all') {
      filtered = filtered.filter(c => c.triaged === filters.triaged);
    }
    if (filters.needs_response) {
      // Inbound communications without a task or not triaged
      filtered = filtered.filter(c =>
        c.direction === 'inbound' && (!c.task_id || !c.triaged)
      );
    }
    if (filters.date_from) {
      filtered = filtered.filter(c =>
        new Date(c.timestamp) >= new Date(filters.date_from!)
      );
    }
    if (filters.date_to) {
      filtered = filtered.filter(c =>
        new Date(c.timestamp) <= new Date(filters.date_to!)
      );
    }
  }

  // Map to CommunicationWithDetails
  return filtered.map(comm => ({
    ...comm,
    customer: customers.find(c => c.id === comm.customer_id),
    task: comm.task_id ? tasks.find(t => t.id === comm.task_id) : undefined
  })).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

async function updateCommunication(
  id: string,
  updates: Partial<Communication>
): Promise<Communication[]> {
  const communications = await fetchCommunications();
  const updated = communications.map(comm =>
    comm.id === id ? { ...comm, ...updates } : comm
  );
  saveCommunications(updated);
  return updated;
}

async function fetchSLAs(schemeId?: string): Promise<SLA[]> {
  const slas = slasData as SLA[];

  if (schemeId) {
    return slas.filter(sla => sla.strata_scheme_id === schemeId);
  }

  return slas;
}

// Hooks
export function useTasks(schemeId: string | null) {
  return useQuery({
    queryKey: schemeId ? queryKeys.tasks(schemeId) : ['tasks', 'disabled'],
    queryFn: fetchTasks,
    enabled: !!schemeId,
  });
}

export function useTask(schemeId: string | null, id: string | null) {
  return useQuery({
    queryKey: queryKeys.task(schemeId || 'all', id || 'none'),
    queryFn: () => fetchTaskById(id!, schemeId || undefined),
    enabled: !!id, // Only require task ID, not scheme ID
  });
}

export function useTasksByCategory(schemeId: string | null, category: TaskCategory | 'all' = 'all') {
  return useQuery({
    queryKey: ['tasks', 'category', category, schemeId || 'all'],
    queryFn: () => fetchTasksByCategory(category, schemeId || undefined),
    staleTime: 0, // Always refetch to see latest data
  });
}

export function useCustomers(schemeId: string | null) {
  return useQuery({
    queryKey: schemeId ? queryKeys.customers(schemeId) : ['customers', 'disabled'],
    queryFn: fetchCustomers,
    enabled: !!schemeId,
  });
}

export function useCommunications(schemeId: string | null) {
  return useQuery({
    queryKey: schemeId ? queryKeys.communications(schemeId) : ['communications', 'disabled'],
    queryFn: fetchCommunications,
    enabled: !!schemeId,
  });
}

export function useCommunicationsByTask(schemeId: string | null, taskId: string | null) {
  return useQuery({
    queryKey: schemeId && taskId ? queryKeys.communicationsByTask(schemeId, taskId) : ['communications', 'disabled'],
    queryFn: async () => {
      const communications = await fetchCommunications();
      return communications.filter(c => c.task_id === taskId);
    },
    enabled: !!taskId && !!schemeId,
  });
}

export function useTaskCategories(schemeId: string | null) {
  return useQuery({
    queryKey: schemeId ? queryKeys.taskCategories(schemeId) : ['task-categories', 'disabled'],
    queryFn: fetchTaskCategories,
    enabled: !!schemeId,
  });
}

export function useSLAs(schemeId: string | null) {
  return useQuery({
    queryKey: schemeId ? queryKeys.slas(schemeId) : ['slas', 'disabled'],
    queryFn: () => fetchSLAs(schemeId || undefined),
    enabled: !!schemeId,
  });
}

// Mutations
export function useCreateTask(schemeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTaskData): Promise<Task> => {
      const customers = await fetchCustomers();
      let customer = customers.find(c => c.email === data.customer_email);
      
      // Create customer if doesn't exist
      if (!customer) {
        customer = {
          id: `cust-${Date.now()}`,
          email: data.customer_email,
          first_name: data.customer_name?.split(' ')[0],
          last_name: data.customer_name?.split(' ').slice(1).join(' '),
          unit_number: data.customer_unit,
          customer_type: 'owner',
          strata_scheme_id: schemeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const updatedCustomers = [...customers, customer];
        saveCustomers(updatedCustomers);
      }
      
      const newTask: Task = {
        id: `task-${Date.now()}`,
        customer_id: customer.id,
        subject: data.subject,
        description: data.description,
        status: 'open',
        priority: data.priority,
        category: data.category,
        strata_scheme_id: schemeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      addTaskToStorage(newTask);
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(schemeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskCategories(schemeId) });
    },
  });
}

export function useCreateCommunication(schemeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCommunicationData): Promise<Communication> => {
      const newCommunication: Communication = {
        id: `comm-${Date.now()}`,
        ...data,
        strata_scheme_id: schemeId,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        created_by: 'current-user',
      };
      
      addCommunicationToStorage(newCommunication);
      return newCommunication;
    },
    onSuccess: (newComm) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communications(schemeId) });
      if (newComm.task_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.communicationsByTask(schemeId, newComm.task_id)
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.task(schemeId, newComm.task_id)
        });
      }
    },
  });
}

export function useUpdateTask(schemeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }): Promise<Task[]> => {
      return updateTaskInStorage(id, updates);
    },
    onSuccess: (updatedTasks, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(schemeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.task(schemeId, id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskCategories(schemeId) });
    },
  });
}

// Communications hooks with filtering
export function useCommunicationsWithDetails(
  schemeId: string | null,
  filters?: CommunicationFilters
) {
  return useQuery({
    queryKey: ['communications', 'details', schemeId || 'disabled', filters],
    queryFn: () => fetchCommunicationsWithDetails(schemeId!, filters),
    enabled: !!schemeId,
  });
}

export function useUpdateCommunication(schemeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Communication> }): Promise<Communication[]> => {
      return updateCommunication(id, updates);
    },
    onSuccess: (updatedComms, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communications(schemeId) });
      queryClient.invalidateQueries({ queryKey: ['communications', 'details', schemeId] });

      // Find the communication and invalidate its task if it has one
      const comm = updatedComms.find(c => c.id === id);
      if (comm?.task_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.task(schemeId, comm.task_id)
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.communicationsByTask(schemeId, comm.task_id)
        });
      }
    },
  });
}