import { defineStore } from "pinia";


export const useMinorStates = defineStore("minorStates", () => {

  const saveMinorState = (key: string, state: any) =>{
    localStorage.setItem(key, String(state))
  }

  const getMinorState = (key: string): string | null => {
    return localStorage.getItem(key)
  }

  return { saveMinorState, getMinorState }
});
