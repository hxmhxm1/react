'use client';
import React, { useState } from 'react';
import { GetAllNotesDemo } from './getAllNotes/GetAllNotesDemo';
// import { UseActionStateDemo } from './useActionState/UseActionStateDemo';
// import { UseOptimisticDemo } from './useOptimistic/UseOptimisticDemo';
// import { UseDeferredValueDemo } from './useDeferredValue/UseDeferredValueDemo';
// import { UseTransitionDemo } from './useTransition/UseTransitionDemo';
// import { GetAllNotesDemo } from './getAllNotes/GetAllNotesDemo';

type TabType = 'useActionState' | 'useOptimistic' | 'useDeferredValue' | 'useTransition' | 'getAllNotes';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'useActionState', label: 'useActionState', icon: '📝' },
  { id: 'useOptimistic', label: 'useOptimistic', icon: '⚡' },
  { id: 'useDeferredValue', label: 'useDeferredValue', icon: '🔍' },
  { id: 'useTransition', label: 'useTransition', icon: '🚀' },
  { id: 'getAllNotes', label: 'getAllNotes', icon: '📋' },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('useActionState');

  const tabStyle = (isActive: boolean) => ({
    padding: '10px 16px',
    border: 'none',
    borderBottom: isActive ? '3px solid #0070f3' : '1px solid #eee',
    background: isActive ? '#f0f7ff' : 'transparent',
    cursor: 'pointer' as const,
    fontSize: 14,
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#0070f3' : '#666',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* 头部 */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '20px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: 28 }}>React 19 新 Hooks 学习</h1>
        <p style={{ margin: 0, color: '#666' }}>点击下方 Tab 选择不同的 Hook 进行学习</p>
      </div>

      {/* Tab 标签 */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', display: 'flex' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabStyle(activeTab === tab.id)}
          >
            <span style={{ marginRight: 6 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      {/* <div style={{ background: 'white', minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'useActionState' && <UseActionStateDemo />}
        {activeTab === 'useOptimistic' && <UseOptimisticDemo />}
        {activeTab === 'useDeferredValue' && <UseDeferredValueDemo />}
        {activeTab === 'useTransition' && <UseTransitionDemo />}
        {activeTab === 'getAllNotes' && <GetAllNotesDemo />}
      </div> */}
  <GetAllNotesDemo />
      {/* 页脚 */}
      <div style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center', color: '#666', fontSize: 12 }}>
        <p>
          💡 提示：这些示例旨在教学并演示思路；在真实生产中，请按官方 API 使用并处理边界情况。
        </p>
      </div>
    </div>
  );
}