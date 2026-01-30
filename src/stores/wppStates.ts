import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useWppStatesStore = defineStore("wppStates", () => {
    const error = ref<string | null>(null);
    const actualAction = ref<string[]>([]);
    const actualFile = ref<string[]>([]);
    const contatosFaltantes = ref<number>(0)
    const totalContatos = ref<number>(0);
    const arquivosFaltantes = ref<number>(0)
    const totalArquivos = ref<number>(0);
    const sec = ref<number | null>(null)

    const actionProgressBarWidth = computed<string | null>(() => {
        if (totalContatos.value === 0) return null;
        
        const concluidos = totalContatos.value - contatosFaltantes.value;
        const porcentagem = (concluidos / totalContatos.value) * 100;
        
        return `${porcentagem}%`;
    });

    const actualFileProgressBarWidth = computed<string | null>(() => {
        if (totalArquivos.value === 0) return null;
        
        const concluidos = totalArquivos.value - arquivosFaltantes.value;
        const porcentagem = (concluidos / totalArquivos.value) * 100;
        
        return `${porcentagem}%`;
    });
    
    const popupMessage = ref<string|null>(null)

    const handleError = async (errorMessage: string) =>{
        return new Promise<void>((res)=>{
            error.value = errorMessage;
            setTimeout (()=>{
                error.value = null;
                res()
            }, 5000)//mostra o erro por 5 seg
        })
    }

    const handleActualAction = (action: string) =>{
        actualAction.value.push(action)
    }

    const cleanActualAction = () => {
        actualAction.value = []
    }

    const handleActualFile = (file: string) =>{
        actualFile.value.push(file)
    }

    const cleanActualFile = () => {
        actualFile.value = []
    }


    const handlePopupMessage = (message:string, time: number) => {
        return new Promise<void>((res)=>{
            popupMessage.value = message;
            sec.value = time/1000;
            const inteval = setInterval(()=> {
                if (sec.value! > 0) {
                    sec.value!--;
                }
            }, 1000)
            setTimeout(()=>{
                popupMessage.value = null
                sec.value = null
                clearInterval(inteval)
                res()
            }, time+1000)
        })
    }

    const dynamicPopupMessage = computed(() => {
        if (!popupMessage.value) return null;
        return popupMessage.value.replace('{sec}', String(sec.value ?? 0));
    });

    return {handleError, handleActualAction, handlePopupMessage, error, actualAction, popupMessage, cleanActualAction, handleActualFile, cleanActualFile, actualFile, contatosFaltantes, totalContatos, actionProgressBarWidth, actualFileProgressBarWidth, totalArquivos, arquivosFaltantes, sec,dynamicPopupMessage}
})