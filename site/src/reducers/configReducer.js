import { createSlice } from '@reduxjs/toolkit'

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    debug:false,
    serverEndpoint:"",
    loaded:false
  },
  reducers: {
    setConfig: (state, action) => {
      console.log(action.payload)
      state.debug = action.payload.debug;
      state.serverEndpoint = action.payload.serverEndpoint;
      state.loaded = true;
    }
  },
})

export const { setConfig} = configSlice.actions;

export default configSlice.reducer;
