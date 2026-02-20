import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface PageSliceAction{
    pageName: string        //lolAccount , valorantBoost gibi
    pageData: number    
}


interface PageState{
    page: Record<string,number>  // page: {'LolAccount': 2, 'LolBoost': 1}
}

const initialState: PageState = {
    page: {}
}

const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        editPage: (state, action: PayloadAction<PageSliceAction>) => {
            const { pageName, pageData } = action.payload

            state.page = {...state.page, [pageName] : pageData}  
        },
    }
})


export const { editPage} = pageSlice.actions

export default pageSlice.reducer