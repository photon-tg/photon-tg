import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';
import createSagaMiddleware from '@redux-saga/core';
import rootSaga from '@/store/rootSaga';

export const createStore = () => {
	const sagaMiddleware = createSagaMiddleware();

	const store = configureStore({
		reducer: rootReducer,
		devTools: true,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware()
				.concat(sagaMiddleware)
	});

	sagaMiddleware.run(rootSaga);

	return store;
}

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'];
