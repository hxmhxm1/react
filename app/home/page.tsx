'use client'
import TabItem from "./components/TabItem"
import TodoList from "./components/todo/index"
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const Home = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: <TodoList></TodoList>,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ];
  return (
    <div className="flex justify-center items-center h-lvh">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default Home