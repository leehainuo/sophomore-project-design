### 初始化流程
首先安装 Mysql 数据库
端口: 3306 账号: root 密码: root 数据库: demo

### 运行 db.sql
连接上 MySQL 数据库 运行脚本 `db.sql`

### 配置前后端环境变量 (.env)
nest-api:
``` bash
DATABASE_URL=mysql://root:root@localhost:3306/demo

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=demo
```
next-ui:
``` bash
AUTH_SECRET=3a62fed805534284d953fcd2749b9f6a
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_NEST_API_URL=http://localhost:8000
NEST_API_URL=http://localhost:8000
DATABASE_URL=mysql://root:root@localhost:3306/demo
```

### 初始化表
打开后端的终端输入:
``` bash
pnpm drizzle-kit push
```

### 运行 种子 完成初始化
打开后端的终端输入:
``` bash
pnpm tsx src/drizzle/seed/index.ts
```