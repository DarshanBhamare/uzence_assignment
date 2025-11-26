import React from 'react';
import type { KanbanColumnProps, Task } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onTaskMove,
  onAddTask,
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
        min-w-[320px]
        bg-gradient-to-b from-gray-50 to-white
        rounded-2xl
        p-5
        shadow-lg
        border border-gray-200
        backdrop-blur-sm
        h-fit
        max-h-full
        transition-all
        duration-300
        hover:shadow-xl
        ${column.isCollapsed ? 'min-w-0' : ''}
        ${className}
      `}
      role="region"
      aria-label={`Column: ${column.title}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-md" />
          <h2
            className="font-bold text-gray-900 text-lg tracking-tight"
            id={`column-${column.id}-title`}
          >
            {column.title}
          </h2>
        </div>
        <span
          className="
            inline-flex items-center justify-center
            min-w-[28px] h-7
            text-sm font-bold
            text-gray-700
            bg-white
            px-2.5
            rounded-full
            shadow-sm
            border border-gray-200
            ring-1 ring-gray-100
          "
          aria-label={`${columnTasks.length} tasks in ${column.title}`}
        >
          {columnTasks.length}
        </span>
      </div>

      {/* WIP Limit Warning */}
      {column.wipLimit && (
        <div
          className={`
            mb-4
            flex items-center gap-2
            text-xs
            font-semibold
            px-3
            py-2
            rounded-lg
            transition-all
            duration-300
            shadow-sm
            backdrop-blur-sm
            ${wipWarning 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200 ring-1 ring-red-100' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
            }
          `}
          role="alert"
          aria-live="polite"
        >
          <svg 
            className={`w-4 h-4 ${wipWarning ? 'text-red-600' : 'text-blue-600'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {wipWarning
              ? `⚠ Limit Reached (${columnTasks.length}/${column.wipLimit})`
              : `WIP: ${columnTasks.length}/${column.wipLimit}`}
          </span>
        </div>
      )}

      {/* Task List */}
      {!column.isCollapsed && (
        <>
          <div
            className="flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            role="list"
            aria-labelledby={`column-${column.id}-title`}
          >
            {columnTasks.length === 0 ? (
              <div
                className="
                  flex flex-col items-center justify-center
                  text-center
                  text-gray-400
                  text-sm
                  py-12
                  px-4
                  rounded-xl
                  bg-gray-50
                  border-2 border-dashed border-gray-300
                "
                role="status"
                aria-label="No tasks in this column"
              >
                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">No tasks</p>
                <p className="text-xs mt-1">Drag tasks here or add new ones</p>
              </div>
            ) : (
              columnTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  role="listitem"
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <KanbanCard
                    task={task}
                    onClick={onTaskClick}
                  />
                </div>
              ))
            )}
          </div>

          {/* Add Task Button */}
          {onAddTask && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddTask(column.id)}
                className="w-full"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add Task
              </Button>
            </div>
          )}
        </>
      )}

      {column.isCollapsed && (
        <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
          Collapsed ({columnTasks.length} tasks)
        </div>
      )}
    </div>
  );
};
