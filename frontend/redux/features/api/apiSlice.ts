import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1',
  }),
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => "/profile"
    })
  })
})

export const { useLoadUserQuery } = apiSlice