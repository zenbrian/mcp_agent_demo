# 開發環境 Dockerfile for React
FROM node:16-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有原始碼
COPY . .

# 暴露端口
EXPOSE 3000

# 開發模式啟動命令
CMD ["npm", "start"]