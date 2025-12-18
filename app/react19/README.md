# React 19 新 Hooks 学习指南

## 📁 文件夹结构

```
app/react19/
├── page.tsx                          # 主页面（Tab 切换器）
├── useActionState/
│   └── UseActionStateDemo.tsx       # useActionState 演示
├── useOptimistic/
│   └── UseOptimisticDemo.tsx        # useOptimistic 演示
├── useDeferredValue/
│   └── UseDeferredValueDemo.tsx     # useDeferredValue 演示
└── useTransition/
    └── UseTransitionDemo.tsx         # useTransition 演示
```

## 🎯 各个 Hook 的说明

### 1. useActionState 📝
**位置**: `app/react19/useActionState/UseActionStateDemo.tsx`

**用途**: 简化 Server Action 与 UI 状态的绑定
- 自动管理表单提交的 pending 状态
- 接收 Server Action 的返回值作为状态
- 无需手动设置 loading、error 等状态

**API**: 
```typescript
const [state, formAction, isPending] = useActionState(action, initialState);
```

**特点**:
- ✅ form action 属性直接指向 formAction
- ✅ 无需 preventDefault
- ✅ 自动处理 FormData
- ✅ 支持渐进式增强

---

### 2. useOptimistic ⚡
**位置**: `app/react19/useOptimistic/UseOptimisticDemo.tsx`

**用途**: 乐观更新，提升用户体验
- 立即更新 UI（不等待 server 响应）
- 失败时自动回退
- 结合 Server Action 使用

**API**: 
```typescript
const [state, optimisticState, dispatch] = useOptimistic(initialState, action);
```

**使用场景**:
- 添加/删除列表项（Todo、评论等）
- 点赞/取消点赞
- 收藏/取消收藏
- 任何快速反馈的操作

---

### 3. useDeferredValue 🔍
**位置**: `app/react19/useDeferredValue/UseDeferredValueDemo.tsx`

**用途**: 延迟更新某个值（低优先级）
- 保持 UI 高优先级交互流畅
- 用延迟值进行昂贵计算
- 避免输入卡顿

**API**: 
```typescript
const deferredQuery = useDeferredValue(query);
```

**优先级对比**:
| 值 | 优先级 | 用途 |
|---|---|---|
| query | 🔴 高 | 输入框显示、输入响应 |
| deferredQuery | 🔵 低 | 搜索过滤、列表重新渲染 |

---

### 4. useTransition 🚀
**位置**: `app/react19/useTransition/UseTransitionDemo.tsx`

**用途**: 将状态更新标记为"低优先级"
- 保持高优先级交互流畅
- 获取待处理状态（isPending）
- 可中断长时间渲染

**API**: 
```typescript
const [isPending, startTransition] = useTransition();
```

**适用场景**:
- 切换大型列表/数据展示
- 复杂过滤、排序操作
- 任何昂贵的 re-render
- 保持按钮、输入框响应

---

## 🚀 快速开始

1. 打开浏览器访问 `/react19` 路径
2. 点击顶部的 Tab 标签切换不同的 Hook
3. 每个 Hook 都有详细的演示和说明

## 💡 学习建议

1. **按顺序学习**：useActionState → useOptimistic → useDeferredValue → useTransition
2. **实际操作**：与每个示例互动，观察 UI 行为变化
3. **理解优先级**：React 19 的核心是优先级调度（Scheduling）
4. **回退实现**：查看源代码理解 Hook 的工作原理

## 🔗 相关资源

- [React 19 官方文档](https://react.dev)
- [Server Actions](https://react.dev/reference/rsc/server-actions)
- [并发特性](https://react.dev/reference/react/useTransition)

---

**最后更新**: 2025-12-17
