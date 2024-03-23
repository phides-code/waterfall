import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RandomObject } from '../../app/types';

interface FetchResponseType {
    data?: RandomObject;
    error?: string;
}

export interface ObjectState {
    value: FetchResponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: ObjectState = {
    value: {},
    status: 'idle',
};

export const fetchObject = createAsyncThunk(
    'object/fetchObject',

    async (objectId: number) => {
        const SERVICE_URL = process.env.REACT_APP_SERVICE_URL as string;
        const rawFetchResponse = await fetch(`${SERVICE_URL}/${objectId}`);
        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const objectSlice = createSlice({
    name: 'object',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchObject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchObject.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchObject.fulfilled, (state, action) => {
                const { error, data } = action.payload;
                state.status = 'idle';
                state.value = {
                    error,
                    data,
                };
            });
    },
});

export const selectObject = (state: RootState) => state.object;

export default objectSlice.reducer;
