import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export enum Category {
    Culture = 'culture',
    Department = 'department',
    Classification = 'classification',
}

export interface CategoryState {
    value: Category;
}

const initialState: CategoryState = {
    value: Category.Culture,
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<Category>) => {
            state.value = action.payload;
        },
    },
});

export const { setCategory } = categorySlice.actions;

export const selectCategory = (state: RootState) => state.category.value;

export default categorySlice.reducer;
