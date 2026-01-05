# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制所有源代码
COPY . .

# 构建应用
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# 只复制必要的文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

ENV NODE_ENV production

# 启动应用
CMD ["npm", "start"]
