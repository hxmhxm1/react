'use client'
import { useState } from 'react';
import { TTask, useTasks, useTasksDispatch } from './TasksContext';
import { Button } from '@mui/base/Button';

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
        <Button onClick={() => setIsEditing(false)}>
          Save
        </Button>
      </>
    );
  } else {
    taskContent = (
      <>
        <div className='mx-[1rem] leading-8 my-[0.2rem]'>
          {task.text}
        </div>
        <Button onClick={() => setIsEditing(true)} className="mr-[1rem]" >
          Edit
        </Button>
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
      <Button onClick={() => {
        dispatch?.({
          type: 'deleted',
          id: task.id
        });
       }}
      >
        Delete
      </Button>
    </label>
  );
}
