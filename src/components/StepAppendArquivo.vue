<script setup lang="ts">
import { ref, onMounted } from "vue";
import fileSelector from "@/assets/imgs/folder.png";
import { useFileAppenderStore } from "@/stores/fileAppender";
import trashCan from "@/assets/imgs/lixeira.png";
import mGlass from "@/assets/imgs/lupa.png";

const fileAppender = useFileAppenderStore();
const showArchives = ref<boolean>(false);

const handleChangeFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    const filesArray = Array.from(target.files!);
    filesArray.forEach((file) => {
      fileAppender.appendFile(file);
    });
  }
};

const toggleShowArchives = () => {
  showArchives.value = !showArchives.value;
};

onMounted(() => {
  fileAppender.loadStore();
});
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
        '*:truncate block w-100 border-2 rounded-lg p-2 transition-all duration-200 border-gray-300 hover:border-[#F9B02E] mt-20 max-h-20',
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
</template>
