import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  technicians: [
    { id: 1, name: '張工程師', speciality: 'hardware', phone: '0912-000-001', email: 'tech1@example.com', workload: 3, status: 'active', skills: ['Server', 'Disk'], region: '台北' },
    { id: 2, name: '李工程師', speciality: 'software', phone: '0912-000-002', email: 'tech2@example.com', workload: 2, status: 'active', skills: ['Windows', 'Office'], region: '新北' },
    { id: 3, name: '王技術員', speciality: 'network', phone: '0912-000-003', email: 'tech3@example.com', workload: 4, status: 'active', skills: ['Cisco', 'Routing'], region: '桃園' },
    { id: 4, name: '陳技術員', speciality: 'hardware', phone: '0912-000-004', email: 'tech4@example.com', workload: 1, status: 'inactive', skills: ['Printer'], region: '台中' },
  ],
};

const technicianSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    addTechnician: {
      reducer(state, action) {
        state.technicians.push(action.payload);
      },
      prepare(technician) {
        return { payload: { id: nanoid(), status: 'active', workload: 0, skills: [], region: '', ...technician } };
      },
    },
    updateTechnician(state, action) {
      const { id, changes } = action.payload;
      const idx = state.technicians.findIndex(t => String(t.id) === String(id));
      if (idx !== -1) state.technicians[idx] = { ...state.technicians[idx], ...changes };
    },
    deleteTechnician(state, action) {
      const id = action.payload;
      state.technicians = state.technicians.filter(t => String(t.id) !== String(id));
    },
  },
});

export const { addTechnician, updateTechnician, deleteTechnician } = technicianSlice.actions;
export default technicianSlice.reducer;
