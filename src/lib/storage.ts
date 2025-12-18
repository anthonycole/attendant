// Local storage utilities for persisting data

const STORAGE_KEYS = {
  TASKS: 'attendant_tasks',
  CUSTOMERS: 'attendant_customers', 
  COMMUNICATIONS: 'attendant_communications',
} as const;

// Generic storage utilities
export function saveToStorage<T>(key: string, data: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function getFromStorage<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.warn('Failed to get from localStorage:', error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

// Specific storage functions
export function saveTasks(tasks: any[]): void {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

export function getTasks(): any[] | null {
  return getFromStorage(STORAGE_KEYS.TASKS);
}

export function saveCustomers(customers: any[]): void {
  saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
}

export function getCustomers(): any[] | null {
  return getFromStorage(STORAGE_KEYS.CUSTOMERS);
}

export function saveCommunications(communications: any[]): void {
  saveToStorage(STORAGE_KEYS.COMMUNICATIONS, communications);
}

export function getCommunications(): any[] | null {
  return getFromStorage(STORAGE_KEYS.COMMUNICATIONS);
}

// Helper functions for adding new items
export function addTask(newTask: any): any[] {
  const tasks = getTasks() || [];
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function addCommunication(newCommunication: any): any[] {
  const communications = getCommunications() || [];
  const updatedCommunications = [...communications, newCommunication];
  saveCommunications(updatedCommunications);
  return updatedCommunications;
}

export function updateTask(taskId: string, updates: Partial<any>): any[] {
  const tasks = getTasks() || [];
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
}

// Initialize storage with default data
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Only initialize if storage is empty
  if (!getTasks()) {
    // Will be populated by the data hooks
    saveTasks([]);
  }
  if (!getCustomers()) {
    saveCustomers([]);
  }
  if (!getCommunications()) {
    saveCommunications([]);
  }
}