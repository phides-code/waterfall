import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { RandomObject } from '../../app/types';

interface FetchResponseType {
    httpStatus: number;
    data: RandomObject | null;
}

export interface ObjectState {
    value: FetchResponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: ObjectState = {
    value: { httpStatus: 200, data: null },
    status: 'idle',
};

export const fetchObject = createAsyncThunk(
    'object/fetchObject',

    async (objectId: number) => {
        const rawFetchResponse = await fetch(`/api/getobject/${objectId}`);
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
                const { httpStatus, data } = action.payload;
                state.status = 'idle';
                state.value = {
                    httpStatus,
                    data,
                };
            });
    },
});

export const selectObject = (state: RootState) => state.object;

export default objectSlice.reducer;
