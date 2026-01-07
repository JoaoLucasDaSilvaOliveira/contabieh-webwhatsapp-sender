<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { useMultiStepFormStore } from "@/stores/multiStepForm";
import { type Store } from "pinia";
import { useFileAppenderStore } from "@/stores/fileAppender";
import { useFileSelectedStore } from "@/stores/fileSelected";

const multiStepForm = useMultiStepFormStore();
const fileSelectedStore = useFileSelectedStore();
const fileAppenderStore = useFileAppenderStore();

const fileSelected = ref<File | null>(null);
const filesAppended = ref <Array<File> | null> (null)
const messageToSend = ref<string> ('');
const manualContacts = ref<string> ('');


interface LoadbleStore extends Store {
  loadStore: () => void
}

const loadStoresFromLocalStorage = (stores: LoadbleStore[]) =>{
    stores.forEach((store) =>{
    store.loadStore();
  })
}

onMounted(() => {
  loadStoresFromLocalStorage([fileAppenderStore, fileSelectedStore]);
  fileSelected.value = fileSelectedStore.fileSelected;
  filesAppended.value = fileAppenderStore.filesAppended;
  messageToSend.value = JSON.parse(localStorage.getItem('option-message')!) ? 'Será usada a mensagem definida na planilha de contatos' : localStorage.getItem('personalizatedMessage') ?? 'Ocorreu um erro inesperado';
  if (!fileSelected.value){
    manualContacts.value = localStorage.getItem('manual-contacts')!;
  }
});

</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="w-full">
      <fieldset v-if="fileSelected" class="w-full border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-hidden max-h-1">
        <legend class="px-2 text-sm font-medium text-gray-600">
          Arquivo de contatos
        </legend>
        <div class="w-full p-3 outline-none transition-all duration-200  min-h-15 block break-all overflow-hidden max-h-40">
          <p>{{ fileSelected?.name }}</p>
        </div>
      </fieldset>

      <fieldset v-else class="w-full min-w-0 border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-scroll max-h-20">
        <legend class="px-2 text-sm font-medium text-gray-600">
          Contatos a enviar
        </legend>
        <div class="w-full p-3 break-words">
          <p>{{ manualContacts }}</p>
        </div>
      </fieldset>

      <fieldset class="w-full border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-hidden">
        <legend class="px-2 text-sm font-medium text-gray-600">
          Mensagem
        </legend>
        <div class="w-full px-3 py-1 outline-none transition-all duration-200  field-sizing-content resize-none min-h-auto block break-all overflow-scroll max-h-20">
          <p>{{ messageToSend }}</p>
        </div>
      </fieldset>

      <fieldset v-if="fileAppenderStore.hasFileAppended()" class="w-full border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-hidden">
        <legend class="px-2 text-sm font-medium text-gray-600">
          Arquivo(s) globais
        </legend>
        <div class="w-full px-3 py-1 outline-none transition-all duration-200  field-sizing-content resize-none min-h-auto block break-all overflow-scroll max-h-20">
          <p v-for="file in filesAppended"> {{ file.name }}</p>  
        </div>
      </fieldset>

    </div>
    <div class="flex flex-row gap-31 mt-5">
      <button
        @click="multiStepForm.backToBeginning"
        class="inline p-2 hover:bg-red-500 hover:text-white rounded-2xl border-2 border-red-300 transition-all ease duration-300 hover:border-red-500"
      >
        Alterar informações
      </button>
      <button
        @click="multiStepForm.nextStep"
        class="inline p-2 hover:bg-green-500 rounded-2xl border-2 border-green-300 hover:text-white hover:border-green-500 transition-all ease duration-300 w-35"
      >
        Enviar
      </button>
    </div>
  </div>
</template>
