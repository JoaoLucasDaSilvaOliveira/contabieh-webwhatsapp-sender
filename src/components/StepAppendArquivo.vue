<script setup lang="ts">
import { ref, onMounted } from "vue";
import fileSelector from "@/assets/imgs/folder.png";
import { useFileAppenderStore } from "@/stores/fileAppender";
import trashCan from "@/assets/imgs/lixeira.png";
import mGlass from "@/assets/imgs/lupa.png";
import { useMinorStates } from "@/stores/minorStates";

const optionGlobalFile = ref<boolean>(false);
const fileAppender = useFileAppenderStore();
const showArchives = ref<boolean>(false);
const handleMinorStates = useMinorStates();

const handleChangeFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    handleMinorStates.saveMinorState("global-file-option", optionGlobalFile.value);
    const filesArray = Array.from(target.files!);
    filesArray.forEach((file) => {
      fileAppender.appendFile(file);
    });
  }
};

const toggleShowArchives = () => {
  showArchives.value = !showArchives.value;
};

const toggleOptionMessage = () => {
  handleMinorStates.saveMinorState("global-file-option", optionGlobalFile.value);
};

onMounted(()=>{
  fileAppender.getSavedArchives()
  const stateOfGlobalFileOption = handleMinorStates.getMinorState("global-file-option");
  if (stateOfGlobalFileOption) {
    optionGlobalFile.value = JSON.parse(stateOfGlobalFileOption) as boolean;
  } else if(fileAppender.hasFileAppended()) {
    handleMinorStates.saveMinorState('global-file-option', optionGlobalFile.value)
  }
})
</script>

<template>
  <div class="flex items-center flex-col overflow-visible">
    <span>
      Adicionar arquivo(s)?
      <span class="text-red-500 opacity-50 mr-1">Opcional</span>
      <label for="files-input" class="relative inline">
        <img
          class="w-7 inline cursor-pointer"
          :src="fileSelector"
          alt="Selecionar arquivos"
          title="Selecionar arquivos"
        />
        <span
          class="bg-yellow-400 rounded-full w-5 h-5 flex justify-center items-center absolute -top-1 -right-3"
          >{{ fileAppender.filesAppended.length }}</span
        >
      </label>
      <img
        :src="mGlass"
        class="inline ml-7 mr-3 cursor-pointer"
        alt="Ver arquivos"
        title="Ver arquivos"
        @click="toggleShowArchives"
      />
      <img
        :src="trashCan"
        class="inline cursor-pointer"
        alt="Deletar arquivos"
        title="Deletar arquivos"
        @click="fileAppender.cleanAppendedFiles('global-file-option')"
      />
    </span>
    <div
      v-if="fileAppender.hasFileAppended() && showArchives"
      :class="[
        '*:truncate block w-100 border-2 rounded-lg p-2 transition-all duration-200 border-gray-300 hover:border-[#F9B02E] mt-7 max-h-20',
        fileAppender.filesAppended.length > 1
          ? 'overflow-scroll'
          : 'overflow-hidden',
      ]"
    >
      <p
        v-for="(file, index) in fileAppender.filesAppended"
        :key="index"
        class="my-2"
      >
        {{ file.name }}
      </p>
    </div>
    <input
      type="file"
      name="file-contacts"
      id="files-input"
      class="hidden"
      @change="handleChangeFile"
      multiple
    />
  </div>

  <div
    class="global-file-option flex flex-col items-center mt-7"
    v-if="fileAppender.hasFileAppended()"
  >
    <span>Usar o(s) mesmo(s) arquivo(s) para todos os contatos?</span>
    <div class="flex w-full justify-center gap-8 mb-6">
      <div class="flex items-center mt-5">
        <input
          type="radio"
          v-model="optionGlobalFile"
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
                optionGlobalFile ? 'scale-0' : 'scale-100',
              ]"
            ></span>
          </span>
          Não
        </label>
      </div>

      <div class="flex items-center mt-5">
        <input
          type="radio"
          v-model="optionGlobalFile"
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
                optionGlobalFile ? 'scale-100' : 'scale-0',
              ]"
            ></span>
          </span>
          Sim
        </label>
      </div>
    </div>
  </div>
</template>
