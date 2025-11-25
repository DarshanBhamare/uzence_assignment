import React from 'react';
import { Task, Priority } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';

export interface KanbanCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-200 border-gray-300',
  medium: 'bg-blue-200 border-blue-300',
  high: 'bg-orange-200 border-orange-400',
  urgent: 'bg-red-200 border-red-400',
};

const priorityIndicators: Record<Priority, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue ${Math.abs(diffDays)}d`;
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return 'Due tomorrow';
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays}d`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(task);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(task);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        bg-white
        rounded-lg
        border
        ${priorityColors[task.priority]}
        p-3
        shadow-sm
        hover:shadow-md
        transition-shadow
        cursor-pointer
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        ${className}
      `}
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority Indicator */}
      <div className="flex items-start justify-between mb-2">
        <div
          className={`w-1 h-6 rounded-full ${priorityIndicators[task.priority]}`}
          aria-label={`Priority: ${task.priority}`}
        />
        {task.dueDate && (
          <span
            className={`text-xs font-medium ${
              new Date(task.dueDate) < new Date()
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
              style={tag.color ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Footer with Assignee */}
      <div className="flex items-center justify-between mt-2">
        {task.assignee ? (
          <Avatar
            initials={task.assignee.initials}
            name={task.assignee.name}
            size="sm"
          />
        ) : (
          <div className="w-6 h-6" />
        )}
        <div className={`w-2 h-2 rounded-full ${priorityIndicators[task.priority]}`} />
      </div>
    </div>
  );
};
