'use client'
import * as React from 'react';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList, TabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel, TabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, Tab, tabClasses } from '@mui/base/Tab';
import TodoList from './components/todo/index'

export default function UnstyledTabsIntroduction() {
  return (
    <div className='flex justify-center items-center'>
      <Tabs defaultValue={1}>
        <TabsList>
          <Tab value={1}>One</Tab>
          <Tab value={2}>Two</Tab>
          <Tab value={3}>Three</Tab>
        </TabsList>
        <TabPanel value={1}><TodoList></TodoList></TabPanel>
        <TabPanel value={2}>Second page</TabPanel>
        <TabPanel value={3}>Third page</TabPanel>
      </Tabs>
    </div>  
  );
}