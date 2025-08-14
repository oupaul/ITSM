# 客戶設備資訊管理系統

一個現代化的客戶設備資訊管理系統，提供完整的客戶管理、設備追蹤、盤點管理和報告分析功能。

## 🎯 系統特色

- **現代化 UI/UX**: 使用 Material-UI 設計語言，提供響應式佈局
- **完整狀態管理**: Redux Toolkit 管理應用程式狀態
- **模組化架構**: 清晰的目錄結構和可重用元件
- **權限控制**: 支援多角色權限管理
- **即時通知**: 全域通知系統
- **API 整合**: 準備好與後端 API 整合

## 🚀 快速開始

### 前置需求

- Node.js 16+ 
- npm 或 yarn

### 安裝與執行

1. **安裝依賴套件**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm start
   ```

3. **開啟瀏覽器**
   訪問 [http://localhost:3000](http://localhost:3000)

### 測試登入

目前使用模擬登入功能，您可以輸入任意電子郵件和密碼進行登入。

## 📁 專案結構

```
src/
├── components/          # 可重用元件
│   ├── common/         # 通用元件
│   ├── forms/          # 表單元件
│   └── layout/         # 佈局元件
├── pages/              # 頁面元件
│   ├── auth/           # 認證頁面
│   ├── dashboard/      # 儀表板
│   ├── customers/      # 客戶管理
│   ├── devices/        # 設備管理
│   ├── inventory/      # 盤點管理
│   ├── notifications/  # 通知中心
│   ├── reports/        # 報告分析
│   └── settings/       # 系統設定
├── store/              # Redux 狀態管理
│   ├── slices/         # Redux slices
│   └── store.js        # Store 配置
├── services/           # API 服務
├── utils/              # 工具函數
└── hooks/              # 自定義 Hooks
```

## 🛠️ 技術棧

### 前端
- **React 19.1.1** - 使用者介面框架
- **Redux Toolkit** - 狀態管理
- **Material-UI 7.3.1** - UI 元件庫
- **React Router DOM 7.7.1** - 路由管理
- **Axios 1.11.0** - HTTP 請求

### 開發工具
- **Create React App** - 專案腳手架
- **ESLint** - 程式碼品質檢查

## 📋 功能模組

### ✅ 已完成
- [x] 專案架構建立
- [x] 路由配置
- [x] 狀態管理 (Redux)
- [x] 認證系統 (模擬)
- [x] 佈局元件 (Header, Sidebar)
- [x] 儀表板頁面
- [x] 全域通知系統
- [x] API 服務層

### 🚧 開發中
- [ ] 客戶管理 CRUD
- [ ] 設備管理 CRUD
- [ ] 盤點管理流程
- [ ] 通知中心功能
- [ ] 報告分析功能
- [ ] 系統設定頁面

### 📅 計劃中
- [ ] 後端 API 開發
- [ ] 資料庫整合
- [ ] 檔案上傳功能
- [ ] 匯出功能
- [ ] 即時通知
- [ ] 權限控制系統

## 🎨 設計系統

### 色彩主題
- **主色**: #1976d2 (藍色)
- **輔助色**: #dc004e (粉紅色)
- **成功色**: #2e7d32 (綠色)
- **警告色**: #ed6c02 (橙色)
- **錯誤色**: #d32f2f (紅色)

### 響應式斷點
- **xs**: 0px - 600px (手機)
- **sm**: 600px - 960px (平板)
- **md**: 960px - 1280px (小桌面)
- **lg**: 1280px - 1920px (大桌面)
- **xl**: 1920px+ (超大桌面)

## 🔧 開發指南

### 新增頁面
1. 在 `src/pages/` 建立新目錄
2. 建立頁面元件
3. 在 `src/App.js` 新增路由
4. 在 `src/components/layout/Sidebar.js` 新增選單項目

### 新增 Redux Slice
1. 在 `src/store/slices/` 建立新檔案
2. 在 `src/store/store.js` 註冊 reducer
3. 在相關元件中使用

### 新增 API 服務
1. 在 `src/services/` 建立新檔案
2. 使用 `src/services/api.js` 的 axios 實例
3. 在 Redux slice 中整合

## 🚀 部署

### 建置生產版本
```bash
npm run build
```

### 環境變數
建立 `.env` 檔案：
```
REACT_APP_API_URL=http://localhost:3001/api
```

## 📝 開發日誌

### 2025-08-08
- ✅ 建立專案基礎架構
- ✅ 配置 Redux Toolkit
- ✅ 建立佈局元件
- ✅ 實作模擬登入功能
- ✅ 建立儀表板頁面

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

如有任何問題或建議，請聯絡開發團隊。

---

**客戶設備資訊管理系統** - 讓設備管理更簡單、更有效率！
