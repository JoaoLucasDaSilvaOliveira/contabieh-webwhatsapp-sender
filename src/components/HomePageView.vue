<script setup lang="ts">
import { onMounted, ref } from "vue";
import hamburguer from "@/assets/imgs/hamburguer.png";
import logo from "@/assets/imgs/logo-contabiehl.png";
import { useMultiStepFormStore } from "@/stores/multiStepForm";
import {useGloblalLocalStorageHandler} from "@/stores/globalLocalStorageHandler";
import { useFileSelectedStore } from "@/stores/fileSelected";
import defHomeIco from '@/assets/imgs/home.png';
import homeIcoYellow from '@/assets/imgs/home-yellow.png'

const isAsideOpen = ref<boolean>(true);
const multiStepForm = useMultiStepFormStore();
const handleLocalStorage = useGloblalLocalStorageHandler();
const fileSelected = useFileSelectedStore();
const homeIco = ref(defHomeIco);

const toggleAside = () => {
  isAsideOpen.value = !isAsideOpen.value;
  handleLocalStorage.saveChanges("aside-state", String(isAsideOpen.value));
};

onMounted(() => {
  const asideState = handleLocalStorage.getItem("aside-state");
  if (asideState === null) {
    //salva estado atual caso não tenha estado ainda
    handleLocalStorage.saveChanges("aside-state", String(isAsideOpen.value));
  } else {
    //caso ja tenha estado, o usamos
    isAsideOpen.value = asideState === "true";
  }
  const savedCanClick = handleLocalStorage.getItem('can-click')
  if (savedCanClick !== null){
    handleLocalStorage.handleCanClick(savedCanClick === 'true')
  }
  multiStepForm.checkStep();
});
</script>

<template>
  <div class="flex min-h-screen mr-1">
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

    <main class="bg-[url('@/assets/imgs/bg-zap.jpg')] bg-cover bg-center bg-white/35 bg-blend-overlay grow p-6 flex items-center flex-col overflow-visible border-y-5 border-r-5 border-solid border-[#191970] w-113.25">
      <header class="mb-10 text-center flex flex-col justify-center h-25">
        <h1 class="text-2xl font-bold mb-1">Contabiehl WhatsApp</h1>
        <p>Enviador de mensagens em massa</p>
      </header>

      <div class="w-full flex gap-1 justify-start items-center" v-if="multiStepForm.currentStep.position!== 4">
        <div 
          :class="['group flex text-[#191970] gap-1 justify-center items-center cursor-pointer transition-all duration-600 hover:text-[#fdc700]']"
          @click="multiStepForm.backToBeginning"
        >
          <div class="relative w-5 h-5 -mt-0.5">
            <img 
              :src="defHomeIco" 
              class="absolute inset-0 w-full h-full transition-opacity duration-600 group-hover:opacity-0"
            >
            <img 
              :src="homeIcoYellow" 
              class="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-600 group-hover:opacity-100"
            >
          </div>
        </div>
        <p 
          class="group break-normal text-[#191970] transition-all duration-600 hover:text-[#fdc700]" 
          v-for="(step, index) in multiStepForm.steps" 
          :key="index"
        >
          <span :class="['cursor-pointer', index === multiStepForm.currentStep.position ? 'underline' : '']" @click="multiStepForm.goTo(index)">{{ step.position <= multiStepForm.currentStep.position ? step.label : ''}}</span> 
          <span class="text-[#191970]">
            {{ step.position < multiStepForm.currentStep.position ? ' /' :'' }}
          </span>
        </p>
      </div>

      <div class="w-full max-w-2xl overflow-visible grow">
        <component :is="multiStepForm.currentStep.content" />
      </div>
      <div class="flex justify-center gap-4 mb-10" v-if="!fileSelected.csvError">
        <div
          v-if="multiStepForm.currentStep.position < 3"
          class="flex gap-19 justify-center items-center"
        >
          <button
            @click="multiStepForm.currentStep.position !== 0 && multiStepForm.previousStep()"
            :class="['h-12 w-40 px-4 py-2 transition-all duration-500  border-2 border-solid border-gray-200 rounded', multiStepForm.currentStep.position !== 0 ? 'cursor-pointer bg-gray-200' : 'cursor-not-allowed']"
          >
            Passo anterior
          </button>
          <button
            @click="handleLocalStorage.canClick && multiStepForm.nextStep()"
            :class="['h-12 w-40 px-4 py-2 border-2 border-solid border-yellow-400  rounded transition-all duration-500', handleLocalStorage.canClick ? 'cursor-pointer bg-yellow-400 font-bold' : 'cursor-not-allowed']"
          >
            Proximo passo
          </button>
        </div>
      </div>

      <div class="flex gap-2 flex-row relative">
        <div 
        :class="[
          'w-2 h-2 border border-solid border-[#EE2B09] rounded-full transition-all durantion-700 ease', 
          index === multiStepForm.currentStep.position
          ? 'bg-[#EE2B09] '
          : '' 
        ]" 
        v-for="(step, index) in multiStepForm.steps" key="index"></div>
      </div>
    </main>
  </div>
</template>

