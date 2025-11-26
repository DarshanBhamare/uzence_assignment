import React, { useState, useEffect } from 'react';
import type { Task, Priority, Assignee, Tag } from './KanbanBoard.types';
import { PRIORITY_LEVELS } from './KanbanBoard.types';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
  columnId?: string;
  availableAssignees?: Assignee[];
  availableTags?: Tag[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  columnId,
  availableAssignees = [],
  availableTags = [],
}) => {
  const isEditMode = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: PRIORITY_LEVELS[1] as Priority, // medium
    dueDate: '',
    assigneeId: '',
    tagIds: [] as string[],
    columnId: columnId || '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate
          ? typeof task.dueDate === 'string'
            ? task.dueDate.split('T')[0]
            : new Date(task.dueDate).toISOString().split('T')[0]
          : '',
        assigneeId: task.assignee?.id || '',
        tagIds: task.tags?.map((tag) => tag.id) || [],
        columnId: task.columnId,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: PRIORITY_LEVELS[1] as Priority,
        dueDate: '',
        assigneeId: '',
        tagIds: [],
        columnId: columnId || '',
      });
    }
  }, [task, columnId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    const assignee = availableAssignees.find((a) => a.id === formData.assigneeId);
    const tags = availableTags.filter((t) => formData.tagIds.includes(t.id));

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      assignee,
      tags,
      columnId: formData.columnId,
    });

    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                outline-none
                transition-all
              "
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                outline-none
                transition-all
                resize-none
              "
              placeholder="Enter task description"
            />
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition-all
                  bg-white
                "
              >
                {PRIORITY_LEVELS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition-all
                "
              />
            </div>
          </div>

          {/* Assignee */}
          {availableAssignees.length > 0 && (
            <div>
              <label
                htmlFor="assignee"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Assignee
              </label>
              <select
                id="assignee"
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition-all
                  bg-white
                "
              >
                <option value="">Unassigned</option>
                {availableAssignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      px-3
                      py-1.5
                      rounded-lg
                      text-sm
                      font-medium
                      transition-all
                      border-2
                      ${
                        formData.tagIds.includes(tag.id)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                      }
                    `}
                    style={
                      formData.tagIds.includes(tag.id) && tag.color
                        ? {
                            backgroundColor: tag.color + '20',
                            borderColor: tag.color,
                            color: tag.color,
                          }
                        : {}
                    }
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {isEditMode && onDelete && (
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleDelete}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                >
                  Delete Task
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
