import { ref } from "vue";
import { defineStore } from "pinia";
import { dbService } from "@/services/Storage/IndexedDbService";

export const useFileAppenderStore = defineStore("fileAppenderStore", () => {
  const filesAppended = ref<Array<File>>([]);
  const appendedFiles = ref<HTMLInputElement | null>(null);

  const appendFile = async (file: File) => {
    // Evita arquivos duplicados pelo nome
    if (filesAppended.value.find((f) => f.name === file.name)) return;
    
    filesAppended.value.push(file);
    
    // Salva direto no IndexedDB sem Base64
    try {
      await dbService.saveFile(file);
    } catch (e) {
      console.error("Erro ao salvar no IndexedDB:", e);
    }
  };

  const hasFileAppended = (): boolean => {
    return filesAppended.value.length > 0;
  };

  const cleanAppendedFiles = async () => {
    if (appendedFiles.value) {
      appendedFiles.value.value = '';
    }
    filesAppended.value = [];
    
    // Limpa o banco de dados
    try {
      await dbService.clearAll();
    } catch (e) {
      console.error("Erro ao limpar IndexedDB:", e);
    }
  };

  const loadStore = async () => {
    try {
      const files = await dbService.getAllFiles();
      if (files && files.length > 0) {
        filesAppended.value = files;
      }
    } catch (e) {
      console.error("Erro ao carregar do IndexedDB:", e);
    }
  };

  return {
    filesAppended,
    appendFile,
    hasFileAppended,
    cleanAppendedFiles,
    loadStore,
    appendedFiles,
  };
});