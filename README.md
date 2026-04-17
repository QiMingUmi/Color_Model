# Color_Model

这是一个智能色彩方案生成与推荐系统

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Vue 3 + TypeScript + Vite + Tailwind CSS |
| **后端** | Python 3.10+ + FastAPI + SQLAlchemy |
| **数据库** | MySQL 8.0+ |
| **图像处理** | OpenCV + scikit-learn (K-Means 色彩提取) |

## 项目结构

```
Color_Model/
├── backend/                 # 后端 (Python FastAPI)
│   ├── app/
│   │   ├── api/v1/          # API 路由
│   │   ├── core/            # 配置、数据库连接
│   │   ├── models/          # SQLAlchemy 数据模型
│   │   ├── schemas/         # Pydantic 数据校验
│   │   ├── services/        # 业务逻辑服务
│   │   └── main.py          # FastAPI 应用入口
│   ├── alembic/             # 数据库迁移
│   ├── uploads/             # 上传文件存储
│   └── requirements.txt     # Python 依赖
├── frontend/                # 前端 (Vue 3)
│   ├── src/
│   │   ├── api/             # API 调用封装
│   │   ├── components/      # Vue 组件
│   │   ├── router/          # 路由配置
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── types/           # TypeScript 类型定义
│   │   └── views/           # 页面视图
│   └── package.json         # Node 依赖
└── docs/                    # 项目文档
    ├── requirements_analysis.md
    └── tech_feasibility.md
```

## 快速开始

### 前置条件

- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### 1. 数据库配置

```sql
CREATE DATABASE color_model CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 后端启动

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量 (复制并修改 .env)
cp .env.example .env
# 编辑 .env 中的 DATABASE_URL

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端启动后访问 http://localhost:8000/docs 查看 API 文档 (Swagger UI)。

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问 http://localhost:5173

## 功能模块

### 已实现 (MVP)

- **色彩提取**: 上传图片，使用 K-Means 聚类提取主要颜色
- **方案管理**: 保存、查看、搜索、删除、导出色彩方案
- **线稿上色**: 自动上色 / 基于色彩方案引导上色（MVP 占位实现）
- **色彩推荐**: 基于色彩理论的配色推荐 + 场景预置推荐
- **色彩分析**: WCAG 对比度分析、色调分析、和谐度评分

### API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/images/upload` | 上传图片 |
| POST | `/api/v1/colors/extract` | 提取色彩 |
| CRUD | `/api/v1/palettes` | 色彩方案管理 |
| POST | `/api/v1/colorize/auto` | 自动上色 |
| POST | `/api/v1/colorize/guided` | 引导上色 |
| POST | `/api/v1/recommend/theory` | 色彩理论推荐 |
| GET | `/api/v1/recommend/scene` | 场景推荐 |
| POST | `/api/v1/analyze` | 色彩分析 |
