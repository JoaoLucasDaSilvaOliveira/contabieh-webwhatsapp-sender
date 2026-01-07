<script setup lang="ts">
import { onMounted, ref } from "vue";
import hamburguer from "@/assets/imgs/hamburguer.png";
import logo from "@/assets/imgs/logo-contabiehl.png";
import { useMultiStepFormStore } from "@/stores/multiStepForm";
import {useGloblalLocalStorageHandler} from "@/stores/globalLocalStorageHandler";
import { useMinorStates } from "@/stores/minorStates";

const isAsideOpen = ref<boolean>(true);
const multiStepForm = useMultiStepFormStore();
const handleLocalStorage = useGloblalLocalStorageHandler();
const handleMinorStates = useMinorStates()

const toggleAside = () => {
  isAsideOpen.value = !isAsideOpen.value;
  handleMinorStates.saveMinorState("aside-state", isAsideOpen.value);
};

onMounted(() => {
  const asideState = handleLocalStorage.getItem("aside-state");
  if (asideState === null) {
    //salva estado atual caso não tenha estado ainda
    handleMinorStates.saveMinorState("aside-state", isAsideOpen.value);
  } else {
    //caso ja tenha estado, o usamos
    isAsideOpen.value = asideState === "true";
  }
  multiStepForm.checkStep();
});
</script>

<template>
  <div class="flex min-h-screen">
    <aside
      :class="[
        'transition-all duration-500 ease-in-out overflow-hidden shrink-0 bg-[rgb(25,25,112)] border-r flex flex-col items-center text-white',
        isAsideOpen ? 'w-90 pl-10 pt-8 pr-4' : 'w-20 pl-5 pt-5',
      ]"
    >
      <header class="w-full flex justify-between items-center mb-10">
        <div v-show="isAsideOpen" class="transition-opacity duration-300">
          <img :src="logo" class="w-48 drop-shadow-[0px_0px_10px_rgba(255,70,200)]" />
        </div>

        <button class="cursor-pointer" @click="toggleAside">
          <img :src="hamburguer" class="w-10" />
        </button>
      </header>

      <div v-show="isAsideOpen" class="aside-content w-full space-y-4">
        <p>Como usar?</p>
        <p>Passo 1</p>
        <p>Passo 2</p>
        <p>Resumo dos envios</p>
      </div>
    </aside>

    <main class="grow p-6 flex items-center flex-col overflow-visible mt-5">
      <header class="mb-20 text-center">
        <h1 class="text-2xl font-bold mb-1">Contabiehl WhatsApp</h1>
        <p>Enviador de mensagens em massa</p>
      </header>

      <div class="w-full max-w-2xl overflow-visible">
        <component :is="multiStepForm.currentStep.content" />
        <div class="mt-6 flex justify-center gap-4 relative">
          <div
            v-if="multiStepForm.currentStep.position < 3"
            class="flex gap-31 justify-center w-full absolute top-20"
          >
            <button
              @click="multiStepForm.previousStep()"
              class="px-4 py-2 bg-gray-200 rounded"
            >
              Passo anterior
            </button>
            <button
              @click="multiStepForm.nextStep()"
              class="px-4 py-2 bg-yellow-400 font-bold rounded"
            >
              Proximo passo
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
