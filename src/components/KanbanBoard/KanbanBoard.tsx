import React from 'react';
import { KanbanBoardProps } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  onTaskMove,
  className = '',
}) => {
  const handleTaskClick = (task: React.ComponentProps<typeof KanbanColumn>['tasks'][0]) => {
    // Task click will be handled by the story/consumer
    // This is a placeholder for future modal functionality
  };

  return (
    <div
      className={`
        w-full
        h-full
        overflow-x-auto
        overflow-y-hidden
        p-6
        bg-gray-100
        ${className}
      `}
      role="main"
      aria-label="Kanban Board"
    >
      <div
        className="flex gap-4 min-w-fit items-start"
        role="group"
        aria-label="Kanban columns"
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onTaskMove={onTaskMove}
          />
        ))}
      </div>
    </div>
  );
};
