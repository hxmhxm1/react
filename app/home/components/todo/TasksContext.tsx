'use client'

import React, { createContext, ReactElement, useContext, useReducer } from "react"

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

const TasksContext = createContext<TTask[] | null>(null)
const TaskDispatchContext = createContext<Function | null>(null)
const Provider = (props: {children: any}) => {
  const { children } = props
  const [tasks, disptach] = useReducer(tasksReducer, initialTask)
  return (
    <TasksContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={disptach}>
      {children}
      </TaskDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  return useContext(TasksContext) as TTask[]
}
export const useTasksDispatch = () => {
  return useContext(TaskDispatchContext)
}

const initialTask = [
  {
    id: 0, text: '待完成一', done: false
  },
  {
    id: 1, text: '待完成二', done: false
  },
  {
    id: 2, text: '待完成三', done: false
  },
]

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

export default Provider