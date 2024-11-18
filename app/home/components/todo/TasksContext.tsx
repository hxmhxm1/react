'use client'
import { createContext, useContext, useReducer } from 'react';
export type TTask = {
  id: number,
  text: string,
  done: boolean
}

export enum EAction{
  'ADD' = 'added',
  'CHANGED' = 'changed',
  'DELETE' = 'deleted'
}

const TasksContext = createContext<TTask[] | null>(null);

const TasksDispatchContext = createContext<Function|null>(null);

export function TasksProvider(props: { children: any }) {
  const { children } = props
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext) as TTask[];
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks: any[], action: { type: string; id: any; text: any; task: { id: any; }; }) {
  switch (action.type) {
    case EAction.ADD: {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case EAction.CHANGED: {
      return tasks.map((t: { id: any; }) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case EAction.DELETE: {
      return tasks.filter((t: { id: any; }) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
