<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMultiStepFormStore } from "@/stores/multiStepForm";
import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";
import {type itemObject} from "@/stores/globalLocalStorageHandler";

const multiStepForm = useMultiStepFormStore();
const handleLocalStorage = useGloblalLocalStorageHandler();
const savedInfos = ref<Array<itemObject>>([]);

onMounted(() => {
  savedInfos.value = handleLocalStorage.getAllItems();
});

</script>

<template>
  <div class="flex flex-col items-center">
    <div>
      <ul>
        <li v-for="objeto in savedInfos">{{ objeto.itemName }}: {{ objeto.item }}</li>  
      </ul>
    </div>
    <div class="flex flex-row gap-10">
      <button
        @click="multiStepForm.backToBeginning"
        class="inline p-2 hover:bg-red-500 hover:text-white rounded-2xl border-2 border-red-300 transition-all ease duration-300 hover:border-red-500"
      >
        Alterar informações
      </button>
      <button
        @click="multiStepForm.nextStep"
        class="inline p-2 hover:bg-green-500 rounded-2xl border-2 border-green-300 hover:text-white hover:border-green-500 transition-all ease duration-300"
      >
        Enviar
      </button>
    </div>
  </div>
</template>
