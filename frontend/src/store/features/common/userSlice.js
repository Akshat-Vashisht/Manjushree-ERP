import { createSlice} from "@reduxjs/toolkit";

const initialState={
    user:{},
    isLoggedin:false,
    isSessionLoaded:false,
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        addUser: (state, action)=>{
            state.user = action.payload
        },
        setLoggedin:  (state, action)=>{
            state.isLoggedin = action.payload
        },
        setIsSessionLoaded: (state, action)=>{
            state.isSessionLoaded = action.payload
        }
    }
})

export const {addUser, setLoggedin, setIsSessionLoaded} = userSlice.actions;
export default userSlice.reducer