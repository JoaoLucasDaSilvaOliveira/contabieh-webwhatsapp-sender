<script setup lang="ts">
import { onMounted, ref} from "vue";
import { useFileSelectedStore } from "@/stores/fileSelected";
import trashCan from "@/assets/imgs/lixeira.png";
import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";

const optionMessage = ref<boolean>(true);
const fileStoreSelected = useFileSelectedStore();
const personalizatedMessage = ref<string | null>(null);
const handleLocalStorage = useGloblalLocalStorageHandler();

const toggleOptionMessage = () => {
  handleLocalStorage.saveChanges("option-message", String(optionMessage.value));
  if (((personalizatedMessage.value !== '' && personalizatedMessage.value !== null) && optionMessage.value === false) || optionMessage.value === true){
    handleLocalStorage.handleCanClick(true); 
  } else { 
    handleLocalStorage.handleCanClick(false); 
  }
  //se tiver mensagem e for não: pode passar
};

onMounted(() => {
  //inicia bloqueando a prox parte
  handleLocalStorage.handleCanClick(false)
  if (!fileStoreSelected.fileSelected) {
    optionMessage.value = false;
    if (personalizatedMessage.value === null || personalizatedMessage.value === ''){
    }
  }
  const savedMessage = handleLocalStorage.getItem("personalizatedMessage");
  if (savedMessage) {
    personalizatedMessage.value = savedMessage;
  }
  const stateOfOptionMessage = handleLocalStorage.getItem("option-message");
  if (stateOfOptionMessage) {
    optionMessage.value = JSON.parse(stateOfOptionMessage) as boolean;
  } else if(fileStoreSelected.fileSelected) {
    handleLocalStorage.saveChanges("option-message", String(optionMessage.value));
  }
  //regra pra liberação do clique
  if ((fileStoreSelected.fileSelected && optionMessage.value === true) || personalizatedMessage.value !== null){
    handleLocalStorage.handleCanClick(true);
  }
});

const a = () => {
  console.log(fileStoreSelected.fileSelected === null)
}

const handlePersonalizatedMessage = () => {
  if (personalizatedMessage.value === "" || personalizatedMessage.value === null) {
    handleLocalStorage.clearItem("personalizatedMessage");
    if ((fileStoreSelected.fileSelected && optionMessage.value === false) || fileStoreSelected.fileSelected === null){
      //se não tiver mensagem, tiver arquvio e a opção por mensagem do arquvio for não  
      handleLocalStorage.handleCanClick(false);
    }
  } else {
    handleLocalStorage.saveChanges(
      "personalizatedMessage",
      personalizatedMessage.value ?? ""
    );
    handleLocalStorage.handleCanClick(true);
  }
};

const cleanMessage = () => {
  personalizatedMessage.value = "";
  handlePersonalizatedMessage();
};
</script>

<template>
  <div :class="['flex flex-col items-center', fileStoreSelected.fileSelected ? 'mt-10' : 'mt-25']">
    <div v-if="fileStoreSelected.fileSelected">
      <p class="mb-4 font-medium text-gray-700">
        Usar mensagem da tabela de contatos?
      </p>

      <div class="flex w-full justify-center gap-8 mb-6">
        <div class="flex items-center">
          <input
            type="radio"
            v-model="optionMessage"
            id="table-message-radio-no"
            :value="false"
            class="peer hidden"
            @change="toggleOptionMessage"
          />
          <label
            for="table-message-radio-no"
            class="flex items-center gap-2 cursor-pointer text-gray-600 peer-checked:text-[#F9B02E] font-semibold transition-all"
          >
            <span
              class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-[#F9B02E]"
            >
              <span
                :class="[
                  'w-2.5 h-2.5 bg-[#F9B02E] rounded-full transition-transform duration-200',
                  optionMessage ? 'scale-0' : 'scale-100',
                ]"
              ></span>
            </span>
            Não
          </label>
        </div>

        <div class="flex items-center">
          <input
            type="radio"
            v-model="optionMessage"
            id="table-message-radio-yes"
            :value="true"
            class="peer hidden"
            @change="toggleOptionMessage"
          />
          <label
            for="table-message-radio-yes"
            class="flex items-center gap-2 cursor-pointer text-gray-600 peer-checked:text-[#F9B02E] font-semibold transition-all"
          >
            <span
              class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-[#F9B02E]"
            >
              <span
                :class="[
                  'w-2.5 h-2.5 bg-[#F9B02E] rounded-full transition-transform duration-200',
                  optionMessage ? 'scale-100' : 'scale-0',
                ]"
              ></span>
            </span>
            Sim
          </label>
        </div>
      </div>
    </div>

    <fieldset
      :class="[
        'w-100 border-2 rounded-lg p-2 transition-all duration-200 overflow-hidden relative',
        !optionMessage
          ? 'border-gray-300 focus-within:border-[#F9B02E]'
          : 'border-gray-100 opacity-50 pointer-events-none grayscale',
      ]"
    >
      <legend
        :class="
          !optionMessage ? 'px-2 text-sm font-medium text-gray-600' : 'hidden'
        "
      >
        Digite sua mensagem
      </legend>
      <textarea
        :disabled="optionMessage"
        :class="[
          'w-full p-3 outline-none transition-all duration-200 placeholder:text-gray-400 field-sizing-content resize-none  block break-all overflow-hidden min-h-[100px] overflow-y-scroll',
          fileStoreSelected.fileSelected ? 'max-h-20' : 'max-h-40',
        ]"
        name="custom-message"
        id="message-input"
        :placeholder="!optionMessage ? 'Olá prezado, bom dia! ...' : ''"
        v-model="personalizatedMessage"
        @keyup="handlePersonalizatedMessage"
      />
      <img
        :src="trashCan"
        title="Excluir mensagem"
        alt="Excluir mensagem"
        class="cursor-pointer"
        @click="cleanMessage"
      />
    </fieldset>
  </div>
</template>
