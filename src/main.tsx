import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import type { Task } from './components/KanbanBoard/KanbanBoard.types';
import { getSampleColumns, getSampleTasks } from './data/sampleBoard';

const App = () => {
  const [columns, setColumns] = useState(getSampleColumns());
  const [tasks, setTasks] = useState(getSampleTasks());

  const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
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
        col.id === taskData.columnId ? { ...col, taskIds: [...col.taskIds, newTask.id] } : col
      )
    );
  };

  const handleTaskEdit = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...task, updatedAt: new Date() } : t))
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }))
    );
  };

  return (
    <div className="h-screen w-full">
      <div className="relative h-full">
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Kanban Board</h1>
                <p className="text-blue-100 text-sm">
                  Manage your tasks efficiently with our modern Kanban interface
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                  <div className="text-xs text-blue-100 mb-1">Total Tasks</div>
                  <div className="text-xl font-bold text-white">{tasks.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-24 h-full">
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
};

const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

