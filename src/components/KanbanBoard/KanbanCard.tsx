import React from 'react';
import type { Task, Priority } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';

export interface KanbanCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}

const priorityColors: Record<Priority, { border: string; indicator: string; dot: string; bg: string }> = {
  low: {
    border: 'border-l-slate-400',
    indicator: 'bg-gradient-to-r from-slate-400 to-slate-500',
    dot: 'bg-slate-500',
    bg: 'bg-gradient-to-br from-slate-50 to-white',
  },
  medium: {
    border: 'border-l-blue-500',
    indicator: 'bg-gradient-to-r from-blue-500 to-blue-600',
    dot: 'bg-blue-500',
    bg: 'bg-gradient-to-br from-blue-50 to-white',
  },
  high: {
    border: 'border-l-orange-500',
    indicator: 'bg-gradient-to-r from-orange-500 to-orange-600',
    dot: 'bg-orange-500',
    bg: 'bg-gradient-to-br from-orange-50 to-white',
  },
  urgent: {
    border: 'border-l-red-500',
    indicator: 'bg-gradient-to-r from-red-500 to-red-600',
    dot: 'bg-red-500',
    bg: 'bg-gradient-to-br from-red-50 to-white',
  },
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const priorityStyle = priorityColors[task.priority];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        group
        relative
        bg-white
        rounded-xl
        border-l-4
        ${priorityStyle.border}
        border-r
        border-t
        border-b
        border-gray-200
        ${priorityStyle.bg}
        p-4
        shadow-sm
        hover:shadow-xl
        hover:scale-[1.02]
        hover:-translate-y-0.5
        transition-all
        duration-300
        ease-out
        cursor-pointer
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        focus:ring-opacity-50
        backdrop-blur-sm
        ${className}
      `}
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${priorityStyle.indicator} rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex flex-col gap-3">
        {/* Header: Priority and Due Date */}
        <div className="flex items-start justify-between gap-2">
          <div className={`w-1.5 h-8 rounded-full ${priorityStyle.indicator} shadow-sm`} aria-label={`Priority: ${task.priority}`} />
          
          {task.dueDate && (
            <div className={`
              flex items-center gap-1
              text-xs font-semibold
              px-2.5 py-1
              rounded-full
              transition-all
              ${isOverdue 
                ? 'bg-red-100 text-red-700 shadow-sm ring-1 ring-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}>
              <svg className={`w-3 h-3 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="
                  inline-flex items-center
                  text-xs font-medium
                  px-2.5 py-1
                  rounded-md
                  backdrop-blur-sm
                  transition-all
                  hover:scale-105
                  shadow-sm
                "
                style={tag.color 
                  ? { 
                      backgroundColor: tag.color + '15', 
                      color: tag.color,
                      border: `1px solid ${tag.color}30`
                    } 
                  : {
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }
                }
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Assignee and Priority Dot */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <Avatar
                initials={task.assignee.initials}
                name={task.assignee.name}
                size="sm"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {task.assignee && (
              <span className="text-xs text-gray-500 font-medium">{task.assignee.name.split(' ')[0]}</span>
            )}
          </div>
          
          <div className={`
            flex items-center gap-1.5
            px-2 py-0.5
            rounded-full
            text-xs font-semibold
            ${priorityStyle.bg}
            border border-gray-200
            shadow-sm
          `}>
            <div className={`w-2 h-2 rounded-full ${priorityStyle.dot} shadow-sm animate-pulse`} />
            <span className="text-gray-600 capitalize">{task.priority}</span>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-blue-50/0 group-hover:from-white/50 group-hover:to-blue-50/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
};
