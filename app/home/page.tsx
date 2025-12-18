'use client'
import * as React from 'react';
import TodoList from './components/todo/index'

export default function UnstyledTabsIntroduction() {
  return (
    <div className='flex justify-center items-center'>
      <TodoList></TodoList>
    </div>  
  );
}