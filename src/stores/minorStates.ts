import { defineStore } from "pinia";


export const useMinorStates = defineStore("minorStates", () => {

  const saveMinorState = (key: string, state: any) =>{
    localStorage.setItem(key, String(state))
  }

  const getMinorState = (key: string): string | null => {
    return localStorage.getItem(key)
  }

  /**
   * 
   * @param keys Array de chaves do localStorage
   * @returns Um mapa de string, string onde a chave é o nome da chave do localStorage e o valor é o seu estado
   */
  const loadMinorState = (keys: string[]) : Map<string, string> => {
    const minorStatesMap = new Map<string, string>();
    keys.forEach((key) => {
      const recuperatedKey = localStorage.getItem(key)
      if (recuperatedKey){
        minorStatesMap.set(key, recuperatedKey)
      }
    })
    return minorStatesMap
  }

  return { saveMinorState, getMinorState }
});
