import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RandomObject } from '../../../../backend/shared/types';

interface FetchResponseType {
    httpStatus: number;
    data: RandomObject[];
}

export interface RandomObjectsState {
    value: FetchResponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RandomObjectsState = {
    value: { httpStatus: 200, data: [] },
    status: 'idle',
};

export const fetchRandomObjects = createAsyncThunk(
    'randomObjects/fetchRandomObjects',

    async (departmentId: number) => {
        const rawFetchResponse = await fetch(
            `/api/getrandomobjects/${departmentId}`
        );
        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const randomObjectsSlice = createSlice({
    name: 'randomObjects',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRandomObjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRandomObjects.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchRandomObjects.fulfilled, (state, action) => {
                const { httpStatus, data } = action.payload;
                state.status = 'idle';
                state.value = {
                    httpStatus,
                    data,
                };
            });
    },
});

export const selectRandomObjects = (state: RootState) => state.randomObjects;

export default randomObjectsSlice.reducer;
