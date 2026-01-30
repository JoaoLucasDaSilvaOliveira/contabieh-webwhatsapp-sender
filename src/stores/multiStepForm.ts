import { markRaw, ref, type Component } from "vue";
import { defineStore } from "pinia";
import StepContato from "@/components/StepContato.vue";
import StepMensagem from "@/components/StepMensagem.vue";
import StepAppendArquivo from "@/components/StepAppendArquivo.vue";
import StepResultados from "@/components/StepResultados.vue";
import StepSubmit from "@/components/StepSubmit.vue";
import { useGloblalLocalStorageHandler } from "./globalLocalStorageHandler";


export interface Step {
  position: number;
  label: string;
  content: Component;
}

export const useMultiStepFormStore = defineStore("multiStepForm", () => {
  const handleLocalStorage = useGloblalLocalStorageHandler();
  const steps: Array<Step> = [
    { position: 0, label: "Contatos", content: markRaw(StepContato) },
    { position: 1, label: "Mensagem", content: markRaw(StepMensagem) },
    { position: 2, label: "Arquivos", content: markRaw(StepAppendArquivo) },
    { position: 3, label: "Conferir Dados", content: markRaw(StepSubmit) },
    { position: 4, label: "", content: markRaw(StepResultados) },
  ];
  const firstStep = 0;
  const lastStep = steps.length - 1;
  const currentStep = ref<Step>(steps[firstStep]!);

  const nextStep = () => {
    const nextIndex = currentStep.value.position + 1;
    if (nextIndex <= lastStep) {
      saveStep(nextIndex.toString());
      currentStep.value = steps[nextIndex]!;
    }
  };

  const previousStep = () => {
    const previousIndex = currentStep.value.position - 1;
    if (previousIndex >= firstStep) {
      saveStep(previousIndex.toString());
      currentStep.value = steps[previousIndex]!;
    }
  };

  const backToBeginning = () => {
    saveStep(firstStep.toString());
    currentStep.value = steps[firstStep]!;
  };

  const saveStep = (stepValue: string) => {
    handleLocalStorage.saveChanges("currentStep", stepValue);
  };

  const checkStep = () => {
    const savedStep = handleLocalStorage.getItem("currentStep");
    if (savedStep === null) {
      currentStep.value = steps[0]!;
    } else {
      currentStep.value = steps[parseInt(savedStep!)]!;
    }
  };

  const goTo = (position: number) =>{
    if (position === 0){
      backToBeginning();
      return;
    }
    if (position > 0 && position < steps.length && steps[position]){
      currentStep.value = steps[position];
      saveStep(String(currentStep.value.position))
    }
  }

  return {
    currentStep,
    steps,
    nextStep,
    previousStep,
    backToBeginning,
    checkStep,
    goTo
  };
});
