<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFileSelectedStore } from "@/stores/fileSelected";
import fileSelector from "@/assets/imgs/folder.png";
import trashCan from "@/assets/imgs/lixeira.png";
import {useGloblalLocalStorageHandler} from "../stores/globalLocalStorageHandler";

const fileSelected = useFileSelectedStore();
const manualContacts = ref<string | null>(null);
const handleLocalStorage = useGloblalLocalStorageHandler();

const handleCleanSelectedFile = () => {
  handleLocalStorage.clearItem('option-message')
  const fileInput = document.getElementById("files-input") as HTMLInputElement;
  fileSelected.cleanSelectedFile(fileInput);
};

const handleContacts = () => {
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

onMounted(() => {
  fileSelected.loadStore();
  //recuperar os contatos escritos se não tiver arquivo
  //  não teremos uma condicional pois em tese é pra ser impossível colocar um arquivo pq se tiver arquivo adicionado apaga o   texto dos contatos
  manualContacts.value = handleLocalStorage.getItem("manual-contacts"); 
});
</script>

<template>
  <div class="text-center w-full flex flex-col items-center">
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
      type="file"
      name="file-contacts"
      id="files-input"
      class="hidden"
      @change="fileSelected.handleFileChange"
      accept=""
    />
    <p class="mt-5">ou</p>
    <fieldset
      class="w-100 border-2 border-gray-300 rounded-lg p-2 focus-within:border-[#F9B02E] transition-all duration-200 overflow-hidden mt-6 min-h-25"
    >
      <legend :class="['px-2 text-sm font-medium', fileSelected.fileSelected ? 'text-gray-300' : 'text-gray-600']">
        Digite os números (separados por vírgula):
      </legend>
      <textarea v-if="fileSelected.fileSelected === null"
        :class="['w-full p-3 outline-none transition-all duration-200 field-sizing-content resize-none min-h-25 block break-word overflow-hidden max-h-40', fileSelected.fileSelected ? 'placeholder:text-gray-200 text-gray-300' : 'placeholder:text-gray-400 text-gray-600']"
        name="numbers"
        id="numbers-input"
        placeholder="Ex.: 5551991620409, 5551963215478"
        v-model="manualContacts"
        @keyup="handleContacts"
      />
    </fieldset>
  </div>
</template>
