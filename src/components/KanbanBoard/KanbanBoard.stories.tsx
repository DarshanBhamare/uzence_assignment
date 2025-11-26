import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import type { Column, Task, Priority } from './KanbanBoard.types';
import { PRIORITY_LEVELS } from './KanbanBoard.types';

// Sample data
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

const getSampleTasks = (): Task[] => {
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
      priority: PRIORITY_LEVELS[2], // high
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
      priority: PRIORITY_LEVELS[3], // urgent
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
      priority: PRIORITY_LEVELS[0], // low
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
      priority: PRIORITY_LEVELS[1], // medium
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
      priority: PRIORITY_LEVELS[1], // medium
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
      priority: PRIORITY_LEVELS[2], // high
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
      priority: PRIORITY_LEVELS[0], // low
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
      priority: PRIORITY_LEVELS[2], // high
      dueDate: lastWeek,
      assignee: sampleAssignees[1],
      tags: [sampleTags[3]],
      columnId: 'col-1',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

const getSampleColumns = (): Column[] => {
  return [
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
};

const meta: Meta<typeof KanbanBoard> = {
  title: 'KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A production-grade Kanban Board component with support for tasks, columns, priorities, due dates, assignees, and WIP limits.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => {
    const [columns, setColumns] = React.useState(getSampleColumns());
    const [tasks, setTasks] = React.useState(getSampleTasks());

    const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
      console.log('Task moved:', { taskId, fromColumnId, toColumnId });
      
      // Update columns
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
          }
          if (col.id === toColumnId) {
            return { ...col, taskIds: [...col.taskIds, taskId] };
          }
          return col;
        })
      );

      // Update task columnId
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, columnId: toColumnId, updatedAt: new Date() } : t
        )
      );
    };

    const handleTaskAdd = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTasks((prev) => [...prev, newTask]);
      setColumns((prev) =>
        prev.map((col) =>
          col.id === taskData.columnId
            ? { ...col, taskIds: [...col.taskIds, newTask.id] }
            : col
        )
      );
    };

    const handleTaskEdit = (task: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...task, updatedAt: new Date() } : t))
      );
    };

    const handleTaskDelete = (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          }))
        );
      }
    };
    
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <div className="relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl">
            <div className="max-w-full px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Kanban Board</h1>
                  <p className="text-blue-100 text-sm">Manage your tasks efficiently with our modern Kanban interface</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <div className="text-xs text-blue-100 mb-1">Total Tasks</div>
                    <div className="text-xl font-bold">{tasks.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-24">
            <KanbanBoard
              columns={columns}
              tasks={tasks}
              onTaskMove={handleTaskMove}
              onTaskAdd={handleTaskAdd}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks demonstrating all features including priorities, due dates, assignees, tags, and WIP limits. Features a modern, polished UI with smooth animations and gradients. Click on tasks to edit, or use "Add Task" buttons to create new tasks.',
      },
    },
    layout: 'fullscreen',
  },
};
