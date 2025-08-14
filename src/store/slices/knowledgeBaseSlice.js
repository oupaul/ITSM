import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	articles: [
		{ id: 1, title: '無法連線網路怎麼辦？', category: 'network', keywords: ['網路','連線','斷線'], content: '請先檢查網路線、重啟路由器，若仍無法請回報工單。', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 12 },
		{ id: 2, title: '印表機列印條紋', category: 'printer', keywords: ['印表機','列印','條紋'], content: '請清潔感光鼓、檢查碳粉匣，或更換碳粉。', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 7 },
	],
	filters: { search: '', category: 'all' },
	loading: false,
	error: null,
};

const knowledgeBaseSlice = createSlice({
	name: 'knowledgeBase',
	initialState,
	reducers: {
		setFilters: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		createArticle: (state, action) => {
			const nextId = Math.max(0, ...state.articles.map(a => a.id)) + 1;
			state.articles.unshift({ ...action.payload, id: nextId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0 });
		},
		updateArticle: (state, action) => {
			const idx = state.articles.findIndex(a => a.id === action.payload.id);
			if (idx !== -1) {
				state.articles[idx] = { ...state.articles[idx], ...action.payload, updatedAt: new Date().toISOString() };
			}
		},
		deleteArticle: (state, action) => {
			state.articles = state.articles.filter(a => a.id !== action.payload);
		},
		addView: (state, action) => {
			const idx = state.articles.findIndex(a => a.id === action.payload);
			if (idx !== -1) state.articles[idx].views = (state.articles[idx].views || 0) + 1;
		},
	},
});

export const { setFilters, createArticle, updateArticle, deleteArticle, addView } = knowledgeBaseSlice.actions;
export default knowledgeBaseSlice.reducer;
