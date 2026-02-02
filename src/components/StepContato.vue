<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useFileSelectedStore } from "@/stores/fileSelected";
import fileSelector from "@/assets/imgs/folder.png";
import trashCan from "@/assets/imgs/lixeira.png";
import {useGloblalLocalStorageHandler} from "../stores/globalLocalStorageHandler";
import { phoneValidator } from "./composables/PhoneValidatorComposable";

const fileSelected = useFileSelectedStore();
const manualContacts = ref<string | null>(null);
const handleLocalStorage = useGloblalLocalStorageHandler();
const invalidPhoneNumbers = ref<string[] | null> ();

const handleCleanSelectedFile = () => {
  handleLocalStorage.clearItem('option-message');

  // Acessamos via .value
  fileSelected.cleanSelectedFile();
  handleLocalStorage.handleCanClick(false)
};

const handleContacts = () => {
  handleLocalStorage.handleCanClick(false)
  // Substitui tudo o que NÃO for número (\d), vírgula (,) ou espaço (\s) por nada
  manualContacts.value = manualContacts.value?.replace(/[^\d,\s]/g, '')!
  handleCleanSelectedFile()
  if (
    handleLocalStorage.getItem("manual-contacts") &&
    manualContacts !== null &&
    manualContacts.value === ""
  ) {
    handleLocalStorage.clearItem("manual-contacts");
  } else {
    handleLocalStorage.saveChanges("manual-contacts", manualContacts?.value!);
  }
};

const handleFileSelected = (event: Event) => {
  manualContacts.value = null;
  handleLocalStorage.clearItem('manual-contacts');
  verifyManualContacts();
  fileSelected.handleFileChange(event);
  handleLocalStorage.handleCanClick(true)
}

const verifyManualContacts = () => {
  // Se for null ou undefined, tratamos como string vazia para o split não quebrar
  const value = manualContacts.value || "";
  
  // Criamos o array de números limpando espaços e removendo entradas vazias
  const data = value.split(',').map(number => number.trim()).filter(number => number !== '');

  // 1. Se o campo estiver vazio (após o trim)
  if (data.length === 0) {
    invalidPhoneNumbers.value = null; // Limpa as mensagens de erro
    handleLocalStorage.handleCanClick(false)
    return;
  }

  // 2. Se houver dados, validamos normalmente
  const invalidNumbers = data.filter(number => !phoneValidator(number));
  if (invalidNumbers.length > 0){
    invalidPhoneNumbers.value = invalidNumbers;
    handleLocalStorage.handleCanClick(false)
  } else {
    invalidPhoneNumbers.value = null;
    handleLocalStorage.handleCanClick(true)
  }
};

const verifyCanClick  = () => {
  if (invalidPhoneNumbers.value === null && (fileSelected.fileSelected!== null || (manualContacts.value !== null && manualContacts.value !== ""))){
    handleLocalStorage.handleCanClick(true)
  } else { 
    handleLocalStorage.handleCanClick(false)
  }
}

onMounted(() => {
  fileSelected.loadStore();
  //recuperar os contatos escritos se não tiver arquivo
  //  não teremos uma condicional pois em tese é pra ser impossível colocar um arquivo pq se tiver arquivo adicionado apaga o   texto dos contatos
  manualContacts.value = handleLocalStorage.getItem("manual-contacts"); 
  //verifica os contatos
  verifyManualContacts();
  //verifica se pode passar pra prox parte
  verifyCanClick();
});
</script>

<template>
  <div class="text-center w-full flex flex-col items-center mt-12" v-if="!fileSelected.csvError">
    <span class="mr-1 relative">
      Tabela de contatos enviar (.csv):
      <label for="files-input" class="inline">
        <img class="w-7 inline cursor-pointer" :src="fileSelector" />
      </label>
      <span class="bg-yellow-400 rounded-full w-5 h-5 flex justify-center items-center absolute -top-1 right-8">
        {{ fileSelected.fileSelected ? "1" : "0" }}
      </span>
      <img
        :src="trashCan"
        class="inline cursor-pointer ml-3"
        alt="Deletar arquivos"
        title="Deletar arquivos"
        @click="handleCleanSelectedFile"
      />
    </span>
    <input
      :ref="(el) => fileSelected.fileInput = (el as HTMLInputElement)"
      type="file"
      id="files-input"
      class="hidden"
      @change="handleFileSelected"
      accept=".csv"
    />
    <p class="mt-5">ou</p>
    <fieldset
      class="w-100 border-2 border-gray-300 rounded-lg p-2 focus-within:border-[#F9B02E] transition-all duration-200 overflow-hidden mt-6 min-h-25"
    >
      <legend :class="['px-2 text-sm font-medium', fileSelected.fileSelected ? 'text-gray-300' : 'text-gray-600']">
        Digite os números (separados por vírgula):
      </legend>
      <textarea v-if="fileSelected.fileSelected === null"
        :class="['w-full p-3 outline-none transition-all duration-200 field-sizing-content resize-none h-25 block break-word overflow-y-scroll', fileSelected.fileSelected ? 'placeholder:text-gray-200 text-gray-300' : 'placeholder:text-gray-400 text-gray-600']"
        name="numbers"
        id="numbers-input"
        placeholder="Ex.: 51991620409, 51963215478"
        v-model="manualContacts"
        @input="handleContacts"
        @focusout="verifyManualContacts"
      />
    </fieldset>
    <div v-if="invalidPhoneNumbers" class=" w-full *:truncate mt-2 flex flex-col">
      <span class="text-start">{{ invalidPhoneNumbers.length > 1 ? 'Números incorretos:' : 'Número incorreto:' }} <span class="break-word text-red-600">{{ invalidPhoneNumbers.join(", ") }}</span></span>
      <p class="text-start mt-2"><strong>Dica:</strong> Digite o ddd. Após digite os números <br> com o 9 na frente</p>
    </div>
  </div>
  <div v-show="fileSelected.csvError" class="flex flex-col items-center w-full bg-white h-[40vh] mt-10">
    <p class="text-red-600 mt-35 text-center">
      {{ fileSelected.csvError }}
    </p>
    <button class=" text-white mt-30 bg-red-500 rounded-full w-12 cursor-pointer" 
    @click="fileSelected.cleanCsvPopup">Ok</button>
  </div>
</template>
