'use client';
import { useState, useMemo, useTransition } from 'react';

export function UseTransitionDemo() {
  const [showLarge, setShowLarge] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 将状态更新放在 transition 中（低优先级）
    startTransition(() => {
      setShowLarge((s) => !s);
    });
  };

  const smallList = useMemo(() => ['项目 A', '项目 B', '项目 C'], []);

  const largeList = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < 20000; i++) {
      arr.push(`项目 ${i}`);
    }
    return arr;
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>useTransition 详解</h2>

      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>什么是 useTransition？</h3>
        <p>useTransition 是 React Hook，用于：</p>
        <ul>
          <li>将状态更新标记为&quot;低优先级&quot;</li>
          <li>保持高优先级交互（输入、点击）流畅</li>
          <li>获取待处理状态（isPending）</li>
          <li>可中断长时间渲染</li>
        </ul>
      </div>

      <div style={{ background: '#fff3e0', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>适用场景</h3>
        <ul>
          <li>✅ 切换大型列表/数据展示</li>
          <li>✅ 复杂过滤、排序操作</li>
          <li>✅ 任何昂贵的 re-render</li>
          <li>✅ 保持按钮、输入框响应</li>
        </ul>
      </div>

      <h3>对比演示</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* 没有 transition 的切换 */}
        <section style={{ padding: 12, border: '1px solid #ff6b6b', borderRadius: 8, background: '#ffe6e6' }}>
          <h4>❌ 没有 useTransition</h4>
          <p style={{ fontSize: 12, color: '#666' }}>直接 setState，可能卡顿：</p>
          <button
            onClick={() => setShowLarge((s) => !s)}
            style={{
              padding: '8px 16px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            切换列表（直接）
          </button>
          <p style={{ fontSize: 12, marginTop: 8, color: '#666' }}>
            ⚠️ 如果列表很大，UI 会冻结
          </p>
        </section>

        {/* 使用 transition 的切换 */}
        <section style={{ padding: 12, border: '1px solid #0070f3', borderRadius: 8, background: '#e6f7ff' }}>
          <h4>✅ 使用 useTransition</h4>
          <p style={{ fontSize: 12, color: '#666' }}>
            startTransition 包装，保持流畅：
          </p>
          <button
            onClick={handleToggle}
            disabled={isPending}
            style={{
              padding: '8px 16px',
              background: isPending ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: isPending ? 'not-allowed' : 'pointer',
              width: '100%',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? '切换中... ⏳' : '切换列表（Transition）'}
          </button>
          <p style={{ fontSize: 12, marginTop: 8, color: '#0070f3' }}>
            ✨ 即使渲染大列表，按钮仍可点击
          </p>
        </section>
      </div>

      <h3>当前状态</h3>
      <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ background: '#f0f0f0', padding: 8, borderRadius: 4 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 12, color: '#666' }}>showLarge</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>{showLarge ? '大列表' : '小列表'}</p>
          </div>
          <div style={{ background: isPending ? '#fff3cd' : '#e6f7e6', padding: 8, borderRadius: 4 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 12, color: '#666' }}>isPending</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
              {isPending ? '⏳ 渲染中' : '✅ 完成'}
            </p>
          </div>
        </div>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
            列表项数：{showLarge ? largeList.length : smallList.length}
          </p>
          <div style={{ maxHeight: 150, overflow: 'auto', border: '1px solid #eee', borderRadius: 4 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(showLarge ? largeList : smallList).slice(0, 50).map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: 6,
                    borderBottom: '1px solid #eee',
                    fontSize: 12,
                  }}
                >
                  {item}
                </li>
              ))}
              {(showLarge ? largeList : smallList).length > 50 && (
                <li style={{ padding: 8, textAlign: 'center', color: '#999', fontSize: 12 }}>
                  ... 还有{' '}
                  {(showLarge ? largeList : smallList).length - 50} 项
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
        <h3>工作原理</h3>
        <ol>
          <li>点击按钮触发 handleToggle</li>
          <li>startTransition 将 setState 标记为低优先级</li>
          <li>React 继续处理高优先级更新（如用户输入）</li>
          <li>isPending = true，可显示加载状态</li>
          <li>渲染完成后 isPending = false</li>
          <li>即使有 20000 项，UI 也不会卡顿 ✨</li>
        </ol>
      </div>
    </div>
  );
}
