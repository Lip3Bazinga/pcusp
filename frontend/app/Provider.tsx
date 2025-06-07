import React, { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "../redux/strore"

interface ProviderProps {
  children: ReactNode
  // children: any
}

export function Providers({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>
}