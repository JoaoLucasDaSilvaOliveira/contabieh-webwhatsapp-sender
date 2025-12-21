import { markRaw, ref, type Component } from "vue";
import { defineStore } from "pinia";
import StepContato from "@/components/StepContato.vue";
import StepMensagem from "@/components/StepMensagem.vue";
import StepAppendArquivo from "@/components/StepAppendArquivo.vue";
import StepResultados from "@/components/StepResultados.vue";
import StepSubmit from "@/components/StepSubmit.vue";

interface Step {
    position: number;
    label: string;
    content: Component;
}

export const useMultiStepFormStore = defineStore("multiStepForm", () => {
    const steps: Array<Step> = [
        {position: 0, label: 'Contatos', content: markRaw(StepContato)},
        {position: 1, label: 'Mensagem', content: markRaw(StepMensagem)},
        {position: 2, label: 'Arquivos', content: markRaw(StepAppendArquivo)},
        {position: 3, label: 'Enviar mensagens', content:markRaw(StepSubmit)},
        {position: 4, label: 'Resultados', content: markRaw(StepResultados)}
    ];
    const firstStep = 0;
    const lastStep = steps.length -1;
    const currentStep = ref<Step>(steps[firstStep]!);

    console.log(steps);

    const nextStep = ()=>{
        const nextIndex = currentStep.value.position + 1;
        if (nextIndex <= lastStep){
            currentStep.value = steps[nextIndex]!;

        }
    }

    const previousStep = ()=>{
        const previousIndex = currentStep.value.position - 1;
        if (previousIndex >= firstStep){
            currentStep.value = steps[previousIndex]!;
        }
    }

    const backToBeginning = () =>{
        currentStep.value = steps[firstStep]!;
    }

  return { currentStep, steps , nextStep, previousStep, backToBeginning};
});
