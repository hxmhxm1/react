# Shadcn/UI MCP 配置规则

## 项目配置
- **UI库**: shadcn/ui
- **样式**: new-york
- **组件路径**: `@/components/ui`
- **工具函数路径**: `@/lib/utils`
- **图标库**: lucide

## 组件使用规范

### 基础组件导入
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
```

### 样式变量使用
- 使用 CSS 变量进行主题配置
- 基础颜色: neutral
- 支持暗色模式

### 组件开发规范
1. 所有 UI 组件必须放在 `components/ui/` 目录下
2. 使用 TypeScript 和 TSX
3. 遵循现有的组件结构和命名约定
4. 使用 `cn()` 工具函数进行类名合并

## 项目结构
```
components/
├── ui/           # shadcn/ui 组件
├── SJButton/     # 自定义组件
├── SJIcon/       # 自定义图标组件
├── SJRadio/      # 自定义单选组件
└── SJSlider/     # 自定义滑块组件
```

## 开发命令
```bash
npm run dev      # 开发服务器
npm run build    # 构建项目
npm run lint     # 代码检查
```