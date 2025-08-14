import React, { useMemo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/common/DataTable';
import SearchFilter from '../../components/common/SearchFilter';
import FormDialog from '../../components/common/FormDialog';
import { setFilters, createArticle, updateArticle, deleteArticle } from '../../store/slices/knowledgeBaseSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const KnowledgeBaseAdmin = () => {
	const dispatch = useDispatch();
	const { articles, filters } = useSelector(s => s.knowledgeBase);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [formData, setFormData] = useState({ title: '', category: 'general', keywords: '', content: '' });

	const localFilters = filters;
	const handleFilterChange = (f) => dispatch(setFilters(f));
	const handleReset = () => dispatch(setFilters({ search: '', category: 'all' }));

	const rows = useMemo(() => {
		const q = (localFilters.search || '').toLowerCase();
		return articles
			.filter(a => localFilters.category === 'all' || a.category === localFilters.category)
			.filter(a => !q || a.title.toLowerCase().includes(q) || (a.content || '').toLowerCase().includes(q) || (a.keywords || []).join(',').toLowerCase().includes(q))
			.map(a => ({ id: a.id, title: a.title, category: a.category, views: a.views, updatedAt: a.updatedAt }));
	}, [articles, localFilters]);

	const columns = [
		{ field: 'title', header: '標題' },
		{ field: 'category', header: '分類' },
		{ field: 'views', header: '瀏覽' },
		{ field: 'updatedAt', header: '最後更新' },
	];

	const filterOptions = [
		{ field: 'category', label: '分類', defaultValue: 'all', options: [
			{ value: 'all', label: '全部' },
			{ value: 'network', label: '網路' },
			{ value: 'printer', label: '印表機' },
			{ value: 'software', label: '軟體' },
			{ value: 'general', label: '一般' },
		]},
	];

	const fields = [
		{ name: 'title', label: '標題', required: true, width: 12 },
		{ name: 'category', label: '分類', type: 'select', width: 6, options: [
			{ value: 'network', label: '網路' },
			{ value: 'printer', label: '印表機' },
			{ value: 'software', label: '軟體' },
			{ value: 'general', label: '一般' },
		]},
		{ name: 'keywords', label: '關鍵字（逗號分隔）', width: 12 },
		{ name: 'content', label: '內容', multiline: true, rows: 6, width: 12 },
	];

	const onAdd = () => { setEditing(null); setFormData({ title: '', category: 'general', keywords: '', content: '' }); setOpen(true); };
	const onEdit = (row) => {
		const target = articles.find(a => a.id === row.id);
		if (target) {
			setEditing(target);
			setFormData({ ...target, keywords: Array.isArray(target.keywords) ? target.keywords.join(',') : (target.keywords || '') });
			setOpen(true);
		}
	};
	const onDelete = (row) => {
		if (window.confirm('確定刪除這篇文章？')) {
			dispatch(deleteArticle(row.id));
			dispatch(showSnackbar({ message: '刪除成功', severity: 'success' }));
		}
	};
	const actions = (row) => (
		<Box>
			<Button size="small" onClick={() => onEdit(row)}>編輯</Button>
			<Button size="small" color="error" onClick={() => onDelete(row)}>刪除</Button>
		</Box>
	);

	const onSubmit = () => {
		if (editing) {
			dispatch(updateArticle({ ...editing, ...formData, keywords: String(formData.keywords || '').split(',').map(s => s.trim()).filter(Boolean) }));
			dispatch(showSnackbar({ message: '更新成功', severity: 'success' }));
		} else {
			dispatch(createArticle({ ...formData, keywords: String(formData.keywords || '').split(',').map(s => s.trim()).filter(Boolean) }));
			dispatch(showSnackbar({ message: '建立成功', severity: 'success' }));
		}
		setOpen(false);
		setEditing(null);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h4">知識庫管理</Typography>
				<Button variant="contained" onClick={onAdd}>新增文章</Button>
			</Box>
			<SearchFilter
				filters={localFilters}
				onFilterChange={handleFilterChange}
				onReset={handleReset}
				searchPlaceholder="搜尋標題/內容/關鍵字"
				filterOptions={filterOptions}
			/>
			<DataTable columns={[...columns]} data={rows} actions={actions} emptyMessage="目前沒有文章" />
			<FormDialog open={open} onClose={() => setOpen(false)} title={editing ? '編輯文章' : '新增文章'} formData={formData} onFormChange={setFormData} onSubmit={onSubmit} fields={fields} loading={false} submitText={editing ? '更新' : '建立'} />
		</Box>
	);
};

export default KnowledgeBaseAdmin;
