'use client';
import { useState, useMemo, useDeferredValue } from 'react';

export function UseDeferredValueDemo() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // 模拟大量数据
  const allItems = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < 10000; i++) {
      arr.push(`Item ${i} - 搜索词示例`);
    }
    return arr;
  }, []);

  // 使用 deferredQuery 过滤数据
  const filteredItems = useMemo(() => {
    if (!deferredQuery.trim()) return allItems.slice(0, 50);

    // 模拟耗时搜索
    const startTime = performance.now();
    const result = allItems.filter((item) =>
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
    const endTime = performance.now();

    console.log(`搜索耗时: ${(endTime - startTime).toFixed(2)}ms`);
    return result.slice(0, 200);
  }, [allItems, deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div style={{ padding: 16 }}>
      <h2>useDeferredValue 详解</h2>

      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>什么是 useDeferredValue？</h3>
        <p>useDeferredValue 是 React Hook，用于：</p>
        <ul>
          <li>延迟更新某个值（低优先级）</li>
          <li>保持 UI 高优先级交互流畅</li>
          <li>用延迟值进行昂贵计算（搜索、过滤等）</li>
          <li>避免输入卡顿</li>
        </ul>
      </div>

      <div style={{ background: '#e6f7e6', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>优先级对比</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>值</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>优先级</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>query</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>🔴 高</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>输入框显示、输入响应</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>deferredQuery</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>🔵 低</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>搜索过滤、列表重新渲染</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>实际演示</h3>
      <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <h4>搜索框（输入优先）</h4>

        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入搜索词... (共 10000 项)"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 4,
              border: '1px solid #0070f3',
              fontSize: 16,
            }}
          />
        </div>

          <div style={{ background: '#e6f7ff', padding: 8, borderRadius: 4 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 12, color: '#666' }}>输入框值（高优先级）</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>&quot;{query}&quot;</p>
          </div>
          <div style={{ background: isStale ? '#fff3cd' : '#e6f7e6', padding: 8, borderRadius: 4 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 12, color: '#666' }}>延迟值（低优先级）</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>&quot;{deferredQuery}&quot; {isStale && '⏳'}</p>
          </div>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
            搜索结果：{filteredItems.length} / {allItems.length}
            {isStale && ' (正在搜索...)'}
          </p>
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', borderRadius: 4 }}>
            {filteredItems.length === 0 ? (
              <p style={{ padding: 8, color: '#999' }}>未找到匹配项</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filteredItems.slice(0, 30).map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #eee',
                      fontSize: 12,
                      background: isStale ? '#fff' : '#f9f9f9',
                    }}
                  >
                    {item}
                  </li>
                ))}
                {filteredItems.length > 30 && (
                  <li style={{ padding: 8, textAlign: 'center', color: '#999', fontSize: 12 }}>
                    ... 还有 {filteredItems.length - 30} 项
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
        <h3>学习要点</h3>
        <ul>
          <li>✅ 输入时响应立即显示（高优先级）</li>
          <li>✅ 搜索过滤会延迟进行（低优先级）</li>
          <li>✅ 防止大量数据过滤导致输入卡顿</li>
          <li>✅ 黄色表示值不同步，正在进行延迟更新</li>
          <li>✅ 适用于：搜索、过滤、复杂计算等</li>
        </ul>
      </div>
    </div>
  );
}
