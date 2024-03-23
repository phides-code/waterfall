import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RandomObject } from '../../app/types';

interface FetchResponseType {
    data?: RandomObject[];
    error?: string;
}

export interface RandomObjectsState {
    value: FetchResponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RandomObjectsState = {
    value: {},
    status: 'idle',
};

export const fetchRandomObjects = createAsyncThunk(
    'randomObjects/fetchRandomObjects',

    async (departmentId: number) => {
        const SERVICE_URL = process.env.REACT_APP_SERVICE_URL as string;
        const rawFetchResponse = await fetch(
            `${SERVICE_URL}/random/${departmentId}`
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
                const { error, data } = action.payload;
                state.status = 'idle';
                state.value = {
                    error,
                    data,
                };
            });
    },
});

export const selectRandomObjects = (state: RootState) => state.randomObjects;

export default randomObjectsSlice.reducer;
