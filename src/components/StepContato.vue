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
  fileSelected.recuperateFileSaved();
});
</script>

<template>
  <div class="text-center w-full flex flex-col items-center">
    <span class="mr-1">
      Tabela de contatos enviar (.csv):
      <label for="files-input" class="inline">
        <img class="w-7 inline cursor-pointer" :src="fileSelector" />
      </label>
      <img
        :src="trashCan"
        class="inline cursor-pointer"
        alt="Deletar arquivos"
        title="Deletar arquivos"
        @click="handleCleanSelectedFile"
      />
    </span>
    <span v-show="fileSelected.fileSelected"
      >{{ fileSelected.fileSelected?.name.split(".csv")[0] }}
    </span>
    <input
      type="file"
      name="file-contacts"
      id="files-input"
      class="hidden"
      @change="fileSelected.handleFileChange"
      accept=""
    />
    <p>ou</p>
    <fieldset
      class="w-100 border-2 border-gray-300 rounded-lg p-2 focus-within:border-[#F9B02E] transition-all duration-200 overflow-hidden"
    >
      <legend class="px-2 text-sm font-medium text-gray-600">
        Digite os números (separados por vírgula):
      </legend>
      <textarea
        class="w-full p-3 outline-none transition-all duration-200 placeholder:text-gray-400 field-sizing-content resize-none min-h-25 block break-all overflow-hidden max-h-40"
        name="numbers"
        id="numbers-input"
        placeholder="Ex.: 5551991620409, 5551963215478"
        v-model="manualContacts"
        @keyup="handleContacts"
      />
    </fieldset>
  </div>
</template>
