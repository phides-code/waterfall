import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Department } from '../../../../shared/types';

interface FetchResponseType {
    httpStatus: number;
    data: Department[];
}

export interface DepartmentsState {
    value: FetchResponseType;
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
        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

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

export const selectDepartmentById = (
    state: RootState,
    departmentId: number
) => {
    const departments = state.departments.value.data;
    return departments.find(
        (department) => department.departmentId === departmentId
    )?.displayName;
};

export default departmentsSlice.reducer;
