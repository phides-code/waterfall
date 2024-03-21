import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import categoryReducer from '../features/category/categorySlice';
import randomObjectsReducer from '../features/randomObjects/randomObjectsSlice';
import objectReducer from '../features/object/objectSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        category: categoryReducer,
        randomObjects: randomObjectsReducer,
        object: objectReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
