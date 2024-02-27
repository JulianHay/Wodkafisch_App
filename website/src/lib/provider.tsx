"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { injectStore } from "../../components/client";

export function StateProvider({ children }: { children: React.ReactNode }) {
  injectStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
