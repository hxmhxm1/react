'use client';
import React, { useState } from 'react';
import { getAllNotes } from '@/lib/prisma';

export function GetAllNotesDemo() {
  const [notes, setNotes] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllNotes();
      setNotes(result as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>getAllNotes 示例</h2>
      
      <button
        onClick={handleGetAllNotes}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '14px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? '加载中...' : '获取所有笔记'}
      </button>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #fcc',
        }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: '12px' }}>笔记列表 ({Object.keys(notes).length})</h3>
        {Object.keys(notes).length === 0 ? (
          <p style={{ color: '#999' }}>暂无笔记或未获取数据</p>
        ) : (
          <div>
            {Object.entries(notes).map(([id, note]) => {
              const parsedNote = typeof note === 'string' ? JSON.parse(note) : note;
              return (
                <div
                  key={id}
                  style={{
                    padding: '12px',
                    marginBottom: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>标题:</strong> {parsedNote.title}
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>内容:</strong> {parsedNote.content}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    <strong>更新时间:</strong> {new Date(parsedNote.updateTime).toLocaleString()}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                    <strong>ID:</strong> {id}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 代码示例 */}
      <div style={{ marginTop: '30px' }}>
        <h3>代码示例</h3>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '12px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px',
        }}>
{`import { getAllNotes } from '@/lib/prisma';

async function fetchNotes() {
  const notes = await getAllNotes();
  // notes 是一个对象，key 为笔记 ID，value 为 JSON 字符串
  console.log(notes);
}`}
        </pre>
      </div>
    </div>
  );
}
