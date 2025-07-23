import type React from "react"
import type { PropsWithChildren } from "react"
import { render } from "@testing-library/react"
import type { RenderOptions } from "@testing-library/react"
import { configureStore } from "@reduxjs/toolkit"
import type { PreloadedState } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import type { JSX } from "react"

import type { AppStore, RootState } from "../../store"
import patientsReducer from "../../store/patientsSlice"
import prescriptionsReducer from "../../store/prescriptionsSlice"

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        patients: patientsReducer,
        prescriptions: prescriptionsReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
