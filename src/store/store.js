import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import deviceReducer from './slices/deviceSlice';
import inventoryReducer from './slices/inventorySlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import technicianReducer from './slices/technicianSlice';
import knowledgeBaseReducer from './slices/knowledgeBaseSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		customers: customerReducer,
		devices: deviceReducer,
		inventory: inventoryReducer,
		notifications: notificationReducer,
		ui: uiReducer,
		technicians: technicianReducer,
		knowledgeBase: knowledgeBaseReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
