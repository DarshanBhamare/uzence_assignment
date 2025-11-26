// Priority type and values
export const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = typeof PRIORITY_LEVELS[number];

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
}

export interface Tag {
  id: string;
  label: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date | string;
  assignee?: Assignee;
  tags?: Tag[];
  columnId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  wipLimit?: number;
  color?: string;
  isCollapsed?: boolean;
}

export interface KanbanBoardProps {
  columns: Column[];
  tasks: Task[];
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onTaskAdd?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onColumnAdd?: (column: Omit<Column, 'id'>) => void;
  onColumnEdit?: (column: Column) => void;
  onColumnDelete?: (columnId: string) => void;
  className?: string;
}

export interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, targetColumnId: string) => void;
  onAddTask?: (columnId: string) => void;
  className?: string;
}

export interface KanbanCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}
