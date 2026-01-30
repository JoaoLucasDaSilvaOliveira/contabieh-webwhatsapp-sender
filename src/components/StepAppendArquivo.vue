<script setup lang="ts">
import { ref, onMounted } from "vue";
import fileSelector from "@/assets/imgs/folder.png";
import { useFileAppenderStore } from "@/stores/fileAppender";
import trashCan from "@/assets/imgs/lixeira.png";

const fileAppender = useFileAppenderStore();
const showArchives = ref<boolean>(true);
const appendedFiles = ref <HTMLInputElement | null> (null);

const handleChangeFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    const filesArray = Array.from(target.files!);
    filesArray.forEach((file) => {
      fileAppender.appendFile(file);
    });
  }
};

const handleClearAppendedFiles = () =>{
  fileAppender.cleanAppendedFiles('global-file-option', appendedFiles.value)
}


onMounted(() => {
  fileAppender.loadStore();
});
</script>

<template>
  <div class="flex items-center flex-col overflow-visible w-full mt-15">
    <span>
      Adicionar arquivo(s)?
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
        :src="trashCan"
        class="inline cursor-pointer ml-3"
        alt="Deletar arquivos"
        title="Deletar arquivos"
        @click="handleClearAppendedFiles()"
      />
    </span>
    <div
      :class="[
        '*:truncate w-100 border-2 rounded-lg border-gray-300 hover:border-[#F9B02E] mt-10 max-h-35 ',
        fileAppender.filesAppended.length > 3
          ? 'overflow-y-auto'
          : 'overflow-hidden',
        fileAppender.hasFileAppended() ? 'p-3 px-4 pb-1':''
      ]"
    >
      <p v-if="fileAppender.hasFileAppended()"
        v-for="(file, index) in fileAppender.filesAppended"
        :key="index"
        class="mb-2"
      >
        {{ file.name }}
      </p>
      <p v-else class="flex items-center justify-center text-center w-full min-h-30">Nenhum arquivo adicionado</p>
    </div>
    <input
      ref="appendedFiles"
      type="file"
      name="file-contacts"
      id="files-input"
      class="hidden"
      @change="handleChangeFile"
      multiple
    />
  </div>
</template>
