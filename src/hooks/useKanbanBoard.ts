import { useState, useCallback, useEffect } from 'react';
import type { Task, Column } from '../components/KanbanBoard/KanbanBoard.types';

export interface UseKanbanBoardReturn {
  selectedTaskId: string | null;
  selectedColumnIndex: number;
  focusedTaskIndex: number;
  selectTask: (taskId: string, columnIndex: number, taskIndex: number) => void;
  deselectTask: () => void;
  moveTaskWithKeyboard: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    columns: Column[],
    tasks: Task[],
  ) => void;
  navigateWithArrows: (
    key: string,
    columns: Column[],
    tasks: Task[],
    onTaskMove: (taskId: string, fromColumnId: string, toColumnId: string) => void,
  ) => void;
}

export const useKanbanBoard = (): UseKanbanBoardReturn => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [focusedTaskIndex, setFocusedTaskIndex] = useState(0);

  const selectTask = useCallback((taskId: string, columnIndex: number, taskIndex: number) => {
    setSelectedTaskId(taskId);
    setSelectedColumnIndex(columnIndex);
    setFocusedTaskIndex(taskIndex);
  }, []);

  const deselectTask = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  const moveTaskWithKeyboard = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string, columns: Column[], tasks: Task[]) => {
      // Validate move
      const toColumn = columns.find((c) => c.id === toColumnId);
      if (toColumn) {
        const tasksInTargetColumn = tasks.filter((t) => t.columnId === toColumnId);
        if (toColumn.wipLimit && tasksInTargetColumn.length >= toColumn.wipLimit) {
          console.warn(`Cannot move task: WIP limit reached in ${toColumn.title}`);
          return;
        }
      }
    },
    [],
  );

  const navigateWithArrows = useCallback(
    (
      key: string,
      columns: Column[],
      tasks: Task[],
      onTaskMove: (taskId: string, fromColumnId: string, toColumnId: string) => void,
    ) => {
      if (!selectedTaskId) return;

      const currentColumn = columns[selectedColumnIndex];
      if (!currentColumn) return;

      const columnTasks = tasks.filter((t) => t.columnId === currentColumn.id);
      const currentTaskIndex = columnTasks.findIndex((t) => t.id === selectedTaskId);

      if (currentTaskIndex === -1) return;

      switch (key) {
        case 'ArrowUp': {
          // Move focus to previous task in same column
          if (currentTaskIndex > 0) {
            const prevTask = columnTasks[currentTaskIndex - 1];
            setFocusedTaskIndex(currentTaskIndex - 1);
            setSelectedTaskId(prevTask.id);
          }
          break;
        }

        case 'ArrowDown': {
          // Move focus to next task in same column
          if (currentTaskIndex < columnTasks.length - 1) {
            const nextTask = columnTasks[currentTaskIndex + 1];
            setFocusedTaskIndex(currentTaskIndex + 1);
            setSelectedTaskId(nextTask.id);
          }
          break;
        }

        case 'ArrowLeft': {
          // Move task to previous column
          if (selectedColumnIndex > 0) {
            const prevColumn = columns[selectedColumnIndex - 1];
            const currentTask = tasks.find((t) => t.id === selectedTaskId);

            if (currentTask && prevColumn) {
              onTaskMove(selectedTaskId, currentColumn.id, prevColumn.id);
              setSelectedColumnIndex(selectedColumnIndex - 1);
              setFocusedTaskIndex(0);
            }
          }
          break;
        }

        case 'ArrowRight': {
          // Move task to next column
          if (selectedColumnIndex < columns.length - 1) {
            const nextColumn = columns[selectedColumnIndex + 1];
            const currentTask = tasks.find((t) => t.id === selectedTaskId);

            if (currentTask && nextColumn) {
              const tasksInNextColumn = tasks.filter((t) => t.columnId === nextColumn.id);
              if (nextColumn.wipLimit && tasksInNextColumn.length >= nextColumn.wipLimit) {
                console.warn(`Cannot move task: WIP limit reached in ${nextColumn.title}`);
                return;
              }

              onTaskMove(selectedTaskId, currentColumn.id, nextColumn.id);
              setSelectedColumnIndex(selectedColumnIndex + 1);
              setFocusedTaskIndex(0);
            }
          }
          break;
        }

        default:
          break;
      }
    },
    [selectedTaskId, selectedColumnIndex],
  );

  return {
    selectedTaskId,
    selectedColumnIndex,
    focusedTaskIndex,
    selectTask,
    deselectTask,
    moveTaskWithKeyboard,
    navigateWithArrows,
  };
};
