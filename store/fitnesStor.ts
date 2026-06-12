import {create} from 'zustand'
type fitnesState = {
    steps:number,
    km:number,
    kcal:number,
    updateState:(steps:number) => void
};


export const FitnesStor = create<fitnesState>((set)=>({
    steps:0,
    km :0,
    kcal : 0,

    updateState:(steps) =>set({
        steps,
        km:steps * 0.0008,
        kcal:steps * 0.04
    }),
}));




