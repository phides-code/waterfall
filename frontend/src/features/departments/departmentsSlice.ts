import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Department {
    departmentId: number;
    displayName: string;
    picture: string;
}

interface FetchReponseType {
    httpStatus: number;
    data: Department[];
}

export interface DepartmentsState {
    value: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: DepartmentsState = {
    value: { httpStatus: 200, data: [] },
    status: 'idle',
};

export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',

    async () => {
        const rawFetchResponse = await fetch('/api/getdepartments');
        const fetchResponse: FetchReponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDepartments.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                const { httpStatus, data } = action.payload;
                state.status = 'idle';
                state.value = {
                    httpStatus,
                    data,
                };
            });
    },
});

export const selectDepartments = (state: RootState) => state.departments;

export default departmentsSlice.reducer;
