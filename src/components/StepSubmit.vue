<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMultiStepFormStore } from "@/stores/multiStepForm";
import { type Store } from "pinia";
import { useFileAppenderStore } from "@/stores/fileAppender";
import { useFileSelectedStore } from "@/stores/fileSelected";
import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";

const multiStepForm = useMultiStepFormStore();
const fileSelectedStore = useFileSelectedStore();
const fileAppenderStore = useFileAppenderStore();
const handleLocalStorage = useGloblalLocalStorageHandler();

const fileSelected = ref<File | null>(null);
const filesAppended = ref<Array<File> | null>(null);
const messageToSend = ref<string>("");
const manualContacts = ref<string>("");
const intervalBetweenContacts = ref<number>(5)


interface LoadbleStore extends Store {
  loadStore: () => void;
}

const loadStoresFromLocalStorage = (stores: LoadbleStore[]) => {
  stores.forEach((store) => {
    store.loadStore();
  });
};

const handleIntervalBetweenContacts = () =>{
  handleLocalStorage.saveChanges('interval-bet-messages', String(intervalBetweenContacts.value))
}

onMounted(() => {
  const intervalBetMsg = handleLocalStorage.getItem('interval-bet-messages');
  if (intervalBetMsg){
    intervalBetweenContacts.value = JSON.parse(intervalBetMsg);
  } else {
    handleIntervalBetweenContacts();
  }
  loadStoresFromLocalStorage([fileAppenderStore, fileSelectedStore]);
  fileSelected.value = fileSelectedStore.fileSelected;
  filesAppended.value = fileAppenderStore.filesAppended;
  messageToSend.value = JSON.parse(localStorage.getItem("option-message")!)
    ? "Será usada a mensagem definida na planilha de contatos"
    : localStorage.getItem("personalizatedMessage") ??
      "Ocorreu um erro inesperado";
  if (!fileSelected.value) {
    manualContacts.value = localStorage.getItem("manual-contacts")!;
  }
});
</script>

<template>
  <div class="flex flex-col items-center w-full mt-10">
    <div class="w-full flex flex-col gap-">
<!-- op1 -->
      <fieldset
        v-if="fileSelected"
        class="w-full min-w-0 border-2 border-gray-300 rounded-lg p-1 hover:border-[#F9B02E] transition-all duration-200  h-20"
      >
        <legend class="px-2 text-sm font-medium text-gray-600">
          Arquivo de contatos
        </legend>
        <div
          class="w-full p-3 outline-none transition-all duration-200 min-h-15 block break-word overflow-hidden max-h-40"
        >
          <p>{{ fileSelected.name }}</p>
        </div>
      </fieldset>
<!-- op1 -->
<!-- op2 -->
      <fieldset
        v-else
        class="w-full min-w-0 border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-y-scroll h-20"
      >
        <legend class="px-2 text-sm font-medium text-gray-600">
          Contatos a enviar
        </legend>
        <div class="w-full p-3 break-word">
          <p>{{ manualContacts }}</p>
        </div>
      </fieldset>
<!-- op2 -->
      <fieldset
        class="w-full border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-hidden h-25 flex items-center"
      >
        <legend class="px-2 text-sm font-medium text-gray-600">Mensagem</legend>
        <div
          class="w-full px-3 py-1 outline-none transition-all duration-200 field-sizing-content resize-none min-h-auto block break-word overflow-y-scroll max-h-20"
        >
          <p>{{ messageToSend }}</p>
        </div>
      </fieldset>

      <fieldset
        class="w-full border-2 border-gray-300 rounded-lg p-2 hover:border-[#F9B02E] transition-all duration-200 overflow-hidden"
      >
        <legend class="px-2 text-sm font-medium text-gray-600">
          Arquivo(s) globais
        </legend>
        <div
          :class="[
            'w-full px-3 py-1 outline-none transition-all duration-200 field-sizing-content resize-none break-all overflow-y-scroll h-20',
            filesAppended && filesAppended.length < 2 
            ? 'flex flex-col justify-center'
            : 'block'
          ]"
        >
          <p v-for="file in filesAppended" v-if="fileAppenderStore.hasFileAppended()">{{ file.name }}</p>
          <p v-else class="flex items-center w-full min-h-15">Nenhum arquivo selecionado</p>
        </div>
      </fieldset>
      <div class="flex gap-6 mt-5 justify-center">
        <p>Intervalo entre os envios:</p>
        <input @change="handleIntervalBetweenContacts" class="w-20" type="range" v-model="intervalBetweenContacts" name="intervalo" min="5" max="30" value="5" step="5">
        <p class="w-23">{{ intervalBetweenContacts }} segundos</p>
      </div>
    </div>
    <div>
      <div class="flex flex-row gap-25 mt-4">
        <button
          @click="multiStepForm.backToBeginning"
          class="cursor-pointer inline p-2 hover:bg-red-500 hover:text-white rounded-2xl border-2 border-red-300 transition-all ease duration-300 hover:border-red-500"
        >
          Alterar informações
        </button>
        <button
          @click="multiStepForm.nextStep"
          class="cursor-pointer inline p-2 bg-green-500 rounded-2xl border-2  text-white border-green-500 transition-all ease duration-300 w-35"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>
