import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface FilterSliceAction{
    filterName: string
    filterData: string    //SearchFilters
}

// type SearchFilters = 
//      Record<string, string | number | any[] | undefined | null | object>


interface FilterState{
    filter: Record<string,string>  // filter: {'LolAccount': 'stringified filter datası var içinde', 'LolBoost': '...'}
}

const initialState: FilterState = {
    filter: {}
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        editFilter: (state, action: PayloadAction<FilterSliceAction>) => {
            const { filterName, filterData } = action.payload

            state.filter = {...state.filter, [filterName] : filterData}  //state filter için ayrılan bütün alan, state.filter demenin sebebi filter:{lolaccount:{...},lolBoost:{...},...} olması
        },
    }
})


export const { editFilter} = filterSlice.actions

export default filterSlice.reducer