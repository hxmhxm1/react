'use client'
import { useState } from 'react';
import { TTask, useTasks, useTasksDispatch } from './TasksContext';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({task} : { task: TTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch?.({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        <div className='mx-[1rem] leading-8 my-[0.2rem]'>
          {task.text}
        </div>
        <button onClick={() => setIsEditing(true)} className="mr-[1rem]" >
          Edit
        </button>
      </>
    );
  }
  return (
    <label className='flex'>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch?.({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch?.({
          type: 'deleted',
          id: task.id
        });
       }}
      >
        Delete
      </button>
    </label>
  );
}
