import { ref } from "vue";
import { defineStore } from "pinia";

export const useWppStatesStore = defineStore("wppStates", () => {
    const error = ref<string | null>();
    const actualAction = ref<string[]|null>(null)

    const handleError = (errorMessage: string) =>{
        alert(errorMessage)
        error.value = errorMessage;
        setTimeout (()=>{
            error.value = null;
        }, 5000)//mostra o erro por 5 seg
    }
    const handleActualAction = (action: string[]) =>{
        actualAction.value = action
    }

    return {handleError, handleActualAction, error, actualAction}
})