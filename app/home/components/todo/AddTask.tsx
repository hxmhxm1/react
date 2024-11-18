'use client'
import { Button } from '@mui/base/Button';
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button onClick={() => {
        setText('');
        dispatch?.({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</Button>
    </>
  );
}

let nextId = 3;
