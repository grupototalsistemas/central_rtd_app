import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from './rootReducer';

// Função para pegar storage dependendo do ambiente (client/server)
const getStorage = () => {
  if (typeof window !== 'undefined') {
    // importação dinâmica para não quebrar no SSR
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const storage = require('redux-persist/lib/storage').default;
    return storage;
  }
  // noop storage para SSR
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

const persistConfig = {
  key: 'root',
  storage: getStorage(),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck:
        process.env.NODE_ENV === 'production'
          ? false
          : {
              warnAfter: 64, // aumenta limite antes do warning
              ignoredPaths: [],
            },
      serializableCheck: {
        // Ignora ações do redux-persist que possuem funções e não são serializáveis
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
