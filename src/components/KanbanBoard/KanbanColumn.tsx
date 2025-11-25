import React from 'react';
import { KanbanColumnProps, Task } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onTaskMove,
  className = '',
}) => {
  const columnTasks = tasks.filter((task) => column.taskIds.includes(task.id));

  const wipWarning = column.wipLimit && columnTasks.length >= column.wipLimit;

  return (
    <div
      className={`
        flex
        flex-col
        w-80
        bg-gray-50
        rounded-lg
        p-4
        h-fit
        max-h-full
        ${column.isCollapsed ? 'min-w-0' : ''}
        ${className}
      `}
      role="region"
      aria-label={`Column: ${column.title}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2
            className="font-semibold text-gray-900 text-lg"
            id={`column-${column.id}-title`}
          >
            {column.title}
          </h2>
          <span
            className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full"
            aria-label={`${columnTasks.length} tasks in ${column.title}`}
          >
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* WIP Limit Warning */}
      {column.wipLimit && (
        <div
          className={`
            mb-3
            text-xs
            font-medium
            px-2
            py-1
            rounded
            ${wipWarning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
          `}
          role="alert"
          aria-live="polite"
        >
          {wipWarning
            ? `⚠ WIP Limit Reached (${columnTasks.length}/${column.wipLimit})`
            : `WIP: ${columnTasks.length}/${column.wipLimit}`}
        </div>
      )}

      {/* Task List */}
      {!column.isCollapsed && (
        <div
          className="flex flex-col gap-3 min-h-0"
          role="list"
          aria-labelledby={`column-${column.id}-title`}
        >
          {columnTasks.length === 0 ? (
            <div
              className="text-center text-gray-400 text-sm py-8"
              role="status"
              aria-label="No tasks in this column"
            >
              No tasks
            </div>
          ) : (
            columnTasks.map((task) => (
              <div key={task.id} role="listitem">
                <KanbanCard
                  task={task}
                  onClick={onTaskClick}
                />
              </div>
            ))
          )}
        </div>
      )}

      {column.isCollapsed && (
        <div className="text-xs text-gray-500 text-center">
          Collapsed ({columnTasks.length} tasks)
        </div>
      )}
    </div>
  );
};
