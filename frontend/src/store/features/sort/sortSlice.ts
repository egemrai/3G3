import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// sort{
//     offerspage: "highestprice",
//     manageofferspage: "latestdate"
// } böyle bi data

export interface SortSliceAction{
    sortName:string
    sortData:string
}

interface SortState{
    sort: Record<string,string>  
}

const initialState: SortState = {
    sort: {}
}

const sortSlice = createSlice({
    name: "sort",
    initialState,
    reducers: {
        editSort: (state, action: PayloadAction<SortSliceAction>) => {
            const { sortName, sortData } = action.payload

            state.sort = {...state.sort, [sortName] : sortData}  
        },
    }
})


export const { editSort} = sortSlice.actions

export default sortSlice.reducer