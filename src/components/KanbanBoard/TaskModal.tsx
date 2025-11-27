import React, { useEffect, useState } from 'react';
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
    priority: PRIORITY_LEVELS[1] as Priority,
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
        tagIds: task.tags?.map((t) => t.id) || [],
        columnId: task.columnId || columnId || '',
      });
    } else {
      setFormData((s) => ({ ...s, columnId: columnId || s.columnId }));
    }
  }, [task, columnId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

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
      tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Task' : 'New Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Title</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            rows={4}
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {PRIORITY_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {availableAssignees.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700">Assignee</label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Unassigned</option>
              {availableAssignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const active = formData.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      active ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                    }`}
                    style={
                      active && tag.color
                        ? { backgroundColor: tag.color + '20', borderColor: tag.color, color: tag.color }
                        : undefined
                    }
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div>
            {isEditMode && onDelete && (
              <Button type="button" variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
