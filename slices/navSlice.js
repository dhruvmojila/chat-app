import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInfromation: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state) => {
      state.destination = action.payload;
    },
    setTravelTimeInfromation: (state, action) => {
      state.travelTimeInfromation = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInfromation } =
  navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInfromation = (state) =>
  state.nav.travelTimeInfromation;

export default navSlice.reducer;
