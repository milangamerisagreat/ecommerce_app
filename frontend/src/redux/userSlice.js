import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
       name: 'User',
         initialState: {
            user: null,
            accessToken: null

         },
            reducers: {
                //action
                    setUser: (state, action) => {
                        state.user = action.payload
                    },
                    setToken: (state, action) => {
                        state.accessToken = action.payload
                    }
            }
})

export const {setUser, setToken} = userSlice.actions
export default userSlice.reducer