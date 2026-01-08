# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 prisma schema，这是正确安装的前提
COPY package*.json ./
COPY prisma ./prisma

# 安装所有依赖 (包括 devDependencies 以获取 Prisma CLI)
RUN npm install

# 复制剩余的源代码
COPY . .

# 明确地运行 prisma generate，确保所有引擎都被创建
RUN npx prisma generate

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
COPY --from=builder /app/prisma ./prisma

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 更改 /app 目录的所有权
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV production

# 启动应用
CMD ["npm", "start"]
