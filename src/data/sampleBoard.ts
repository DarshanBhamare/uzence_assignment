import type { Column, Task } from '../components/KanbanBoard/KanbanBoard.types';
import { PRIORITY_LEVELS } from '../components/KanbanBoard/KanbanBoard.types';

const sampleAssignees = [
  { id: '1', name: 'John Doe', initials: 'JD' },
  { id: '2', name: 'Jane Smith', initials: 'JS' },
  { id: '3', name: 'Bob Wilson', initials: 'BW' },
];

const sampleTags = [
  { id: '1', label: 'Frontend', color: '#3b82f6' },
  { id: '2', label: 'Backend', color: '#10b981' },
  { id: '3', label: 'Design', color: '#8b5cf6' },
  { id: '4', label: 'Bug', color: '#ef4444' },
];

export const getSampleTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: 'task-1',
      title: 'Design new dashboard UI',
      description: 'Create mockups for the new dashboard interface with improved UX',
      priority: PRIORITY_LEVELS[2],
      dueDate: tomorrow,
      assignee: sampleAssignees[0],
      tags: [sampleTags[0], sampleTags[2]],
      columnId: 'col-1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-2',
      title: 'Implement authentication API',
      description: 'Build JWT-based authentication endpoints',
      priority: PRIORITY_LEVELS[3],
      dueDate: now,
      assignee: sampleAssignees[1],
      tags: [sampleTags[1]],
      columnId: 'col-1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-3',
      title: 'Fix login button styling',
      description: 'Button should have proper hover states',
      priority: PRIORITY_LEVELS[0],
      dueDate: nextWeek,
      assignee: sampleAssignees[2],
      tags: [sampleTags[0], sampleTags[3]],
      columnId: 'col-2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-4',
      title: 'Set up database migrations',
      description: 'Create initial migration scripts for user tables',
      priority: PRIORITY_LEVELS[1],
      dueDate: nextWeek,
      assignee: sampleAssignees[1],
      tags: [sampleTags[1]],
      columnId: 'col-2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-5',
      title: 'Write unit tests for utils',
      description: 'Add comprehensive test coverage for utility functions',
      priority: PRIORITY_LEVELS[1],
      dueDate: nextWeek,
      tags: [sampleTags[1]],
      columnId: 'col-3',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-6',
      title: 'Review pull requests',
      description: 'Review and merge pending PRs from the team',
      priority: PRIORITY_LEVELS[2],
      dueDate: tomorrow,
      assignee: sampleAssignees[0],
      tags: [],
      columnId: 'col-4',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-7',
      title: 'Update documentation',
      description: 'Document the new API endpoints and update README',
      priority: PRIORITY_LEVELS[0],
      dueDate: nextWeek,
      assignee: sampleAssignees[2],
      tags: [],
      columnId: 'col-4',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-8',
      title: 'Overdue task example',
      description: 'This task shows how overdue tasks are displayed',
      priority: PRIORITY_LEVELS[2],
      dueDate: lastWeek,
      assignee: sampleAssignees[1],
      tags: [sampleTags[3]],
      columnId: 'col-1',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const getSampleColumns = (): Column[] => [
  {
    id: 'col-1',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-8'],
    wipLimit: 5,
  },
  {
    id: 'col-2',
    title: 'In Progress',
    taskIds: ['task-3', 'task-4'],
    wipLimit: 3,
  },
  {
    id: 'col-3',
    title: 'In Review',
    taskIds: ['task-5'],
    wipLimit: 2,
  },
  {
    id: 'col-4',
    title: 'Done',
    taskIds: ['task-6', 'task-7'],
  },
];

export const sampleBoardMeta = {
  assignees: sampleAssignees,
  tags: sampleTags,
};

