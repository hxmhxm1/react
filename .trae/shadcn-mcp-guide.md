# Shadcn/UI MCP 配置

这个配置文件帮助 AI 助手更好地理解和使用项目中的 shadcn/ui 组件。

## 配置说明

### 组件路径
- **UI 组件**: `components/ui/` - 所有 shadcn/ui 组件
- **工具函数**: `lib/utils.ts` - 工具函数和 cn() 函数
- **类型定义**: `types/` - TypeScript 类型定义

### 样式配置
- **样式系统**: new-york
- **基础颜色**: neutral
- **CSS 变量**: 启用
- **暗色模式**: 支持

### 使用示例

#### 导入组件
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

#### 使用工具函数
```typescript
import { cn } from "@/lib/utils"

// 合并类名
const className = cn("base-class", conditional && "conditional-class")
```

#### 自定义组件开发
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // 自定义属性
}

const CustomComponent = React.forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("custom-base", className)}
        {...props}
      />
    )
  }
)
CustomComponent.displayName = "CustomComponent"

export { CustomComponent }
```

### 注意事项
1. 保持与现有组件的一致性
2. 使用 TypeScript 进行类型检查
3. 遵循项目的命名约定
4. 使用 Tailwind CSS 进行样式设计
5. 保持组件的可访问性