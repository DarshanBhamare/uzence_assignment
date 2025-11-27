import { useState, useCallback, useRef } from 'react';

export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: string | null;
  dragOverColumnId: string | null;
}

export interface UseDragAndDropReturn {
  dragState: DragState;
  handleDragStart: (taskId: string, columnId: string, e: React.DragEvent) => void;
  handleDragOver: (columnId: string, e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (columnId: string, e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  onTaskMove: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  resetDragState: () => void;
}

export const useDragAndDrop = (
  onTaskMove: (taskId: string, fromColumnId: string, toColumnId: string) => void,
): UseDragAndDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    sourceColumnId: null,
    dragOverColumnId: null,
  });

  const dragCounterRef = useRef(0);

  const handleDragStart = useCallback((taskId: string, columnId: string, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    // Set custom drag image with semi-transparent effect
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.opacity = '0.7';
    dragImage.style.backgroundColor = '#3b82f6';
    dragImage.style.color = '#fff';
    dragImage.style.padding = '8px 12px';
    dragImage.style.borderRadius = '8px';
    dragImage.style.fontSize = '14px';
    dragImage.textContent = 'Moving task...';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);

    setDragState({
      isDragging: true,
      draggedTaskId: taskId,
      sourceColumnId: columnId,
      dragOverColumnId: null,
    });
  }, []);

  const handleDragOver = useCallback((columnId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDragState((prev) => ({
      ...prev,
      dragOverColumnId: columnId,
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only update if we're actually leaving the drop zone
    if ((e.target as HTMLElement).classList.contains('drop-zone')) {
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setDragState((prev) => ({
          ...prev,
          dragOverColumnId: null,
        }));
      }
    }
  }, []);

  const handleDrop = useCallback((columnId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = dragState.sourceColumnId;

    if (sourceColumnId && taskId && sourceColumnId !== columnId) {
      onTaskMove(taskId, sourceColumnId, columnId);
    }

    dragCounterRef.current = 0;
    setDragState({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  }, [dragState.sourceColumnId, onTaskMove]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setDragState({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  }, []);

  const resetDragState = useCallback(() => {
    dragCounterRef.current = 0;
    setDragState({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      dragOverColumnId: null,
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    onTaskMove,
    resetDragState,
  };
};
