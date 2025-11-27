import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import type { Task } from './KanbanBoard.types';
import { getSampleColumns, getSampleTasks } from '../../data/sampleBoard';

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

export const WithDragDrop: Story = {
  render: () => {
    const [columns, setColumns] = React.useState(getSampleColumns());
    const [tasks, setTasks] = React.useState(getSampleTasks());

    const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
      console.log('✨ Task dragged:', { taskId, fromColumnId, toColumnId });
      
      // Prevent moving to same column
      if (fromColumnId === toColumnId) return;

      // Check WIP limit
      const toColumn = columns.find((col) => col.id === toColumnId);
      const tasksInTarget = tasks.filter((t) => t.columnId === toColumnId);
      
      if (toColumn?.wipLimit && tasksInTarget.length >= toColumn.wipLimit) {
        console.warn(`⚠️ Cannot move: WIP limit reached in ${toColumn.title}`);
        return;
      }

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
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
            <div className="max-w-full px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">🎯 Interactive Drag & Drop Demo</h1>
                  <p className="text-green-100 text-sm">Try dragging tasks between columns • Use ← → arrow keys to move tasks • Use ↑ ↓ to navigate</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <div className="text-xs text-green-100 mb-1">Total Tasks</div>
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
        story: '🎯 **Interactive Drag-and-Drop Demo** - Fully functional Kanban board with drag-and-drop support and keyboard navigation. Drag tasks between columns with visual feedback. Use arrow keys: ← → to move tasks left/right between columns, ↑ ↓ to navigate up/down within a column. WIP limits are enforced - tasks cannot be moved to columns that have reached their limit.',
      },
    },
    layout: 'fullscreen',
  },
};
