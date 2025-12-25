export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  updatedAt: string
}

export const POSTS: BlogPost[] = [
  {
    id: 'react-19-hooks',
    title: 'React 19 新特性与 Hooks',
    excerpt: '概览 React 19 的新 API 与 Hooks 使用场景',
    content: 'React 19 引入了 useActionState、useOptimistic、useTransition 等新特性。\n具体示例与最佳实践详解。',
    updatedAt: '2025-12-17T10:00:00Z',
  },
  {
    id: 'theme-switching',
    title: '组件主题切换实践',
    excerpt: 'CSS 变量、SCSS mixin 与 CSS-in-JS 的优缺点',
    content: '对比多种主题切换方案，展示示例与性能考量。',
    updatedAt: '2025-12-15T09:00:00Z',
  },
  {
    id: 'frontend-performance',
    title: '前端性能优化清单',
    excerpt: '从代码分割、缓存策略到渲染优化',
    content: '系统梳理项目中的性能瓶颈与优化策略。',
    updatedAt: '2025-12-10T08:30:00Z',
  },
]