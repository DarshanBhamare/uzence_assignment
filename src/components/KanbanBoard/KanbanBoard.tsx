import React, { useState } from 'react';
import type { KanbanBoardProps, Task } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedColumnId(undefined);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setSelectedTask(undefined);
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
    setSelectedColumnId(undefined);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      // Edit mode
      if (onTaskEdit) {
        onTaskEdit({
          ...selectedTask,
          ...taskData,
          updatedAt: new Date(),
        });
      }
    } else {
      // Create mode
      if (onTaskAdd) {
        onTaskAdd(taskData);
      }
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  // Sample assignees and tags for the modal (in a real app, these would come from props or context)
  const availableAssignees = [
    { id: '1', name: 'John Doe', initials: 'JD' },
    { id: '2', name: 'Jane Smith', initials: 'JS' },
    { id: '3', name: 'Bob Wilson', initials: 'BW' },
  ];

  const availableTags = [
    { id: '1', label: 'Frontend', color: '#3b82f6' },
    { id: '2', label: 'Backend', color: '#10b981' },
    { id: '3', label: 'Design', color: '#8b5cf6' },
    { id: '4', label: 'Bug', color: '#ef4444' },
  ];

  return (
    <>
      <div
        className={`
          w-full
          h-full
          min-h-screen
          overflow-x-auto
          overflow-y-hidden
          bg-gradient-to-br
          from-gray-50
          via-blue-50/30
          to-purple-50/20
          p-6
          ${className}
        `}
        role="main"
        aria-label="Kanban Board"
        style={{
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(147, 51, 234, 0.05) 0px, transparent 50%)',
        }}
      >
        <div
          className="flex gap-5 min-w-fit items-start h-full pb-4"
          role="group"
          aria-label="Kanban columns"
        >
          {columns.map((column, index) => (
            <div
              key={column.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <KanbanColumn
                column={column}
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onTaskMove={onTaskMove}
                onAddTask={handleAddTask}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        columnId={selectedColumnId}
        availableAssignees={availableAssignees}
        availableTags={availableTags}
      />
    </>
  );
};
