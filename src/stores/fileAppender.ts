import {ref} from "vue";
import { defineStore } from "pinia";
import fileToBase64 from "@/components/composables/fromFiletoBase64";
import { useGloblalLocalStorageHandler } from "./globalLocalStorageHandler";
import base64ToFile from "@/components/composables/fromBase64toFile";

interface archive {
  fileName: string
  fileInBase64: string
}

export const useFileAppenderStore = defineStore("fileAppenderStore", () => {
  const handleLocalStorage = useGloblalLocalStorageHandler()
  const filesAppended = ref <Array<File>>([])

  const appendFile = (file: File) => {
    if (filesAppended.value.find(fileAppended => fileAppended.name === file.name)) return
    filesAppended.value.push(file)
    saveArchives();
  }

  const hasFileAppended = (): boolean=>{
    if (filesAppended.value.length === 0) {
      return false
    }
    return true
  }

  const cleanAppendedFiles = (key: string, input?: HTMLInputElement | null) =>{
    if (input){
      input.value = '';
    }
    filesAppended.value = [];
    handleLocalStorage.clearItem('global-files');
    handleLocalStorage.clearItem(key)
  }

  const saveArchives = async () =>{
    const archives = Array<archive>();
    for (const file of filesAppended.value){
      try{
        const fileInBase64 = await fileToBase64(file)
        archives.push({fileName: file.name, fileInBase64})
      } catch (e){
        console.log(e)
      }
    }
    if (archives.length > 0){
      handleLocalStorage.saveChanges('global-files', JSON.stringify(archives))
    }
  }

  /**
   * Função que pega os arquivos salvos e os carrega no pinia
   *
   *  USAR SOMENTE EM ONMOUNTED
   */
  const loadStore = () => {
    //importa os arquivos salvos
    const savedArchives = handleLocalStorage.getItem('global-files')
    if (savedArchives){ //checar se há arquivos salvos
      //nesse caso há arquivo(s) salvos, convertemos a string para um array de arquivos com nome e o arquivo de fato em base64
      const arrayArchives: Array<archive> = JSON.parse(savedArchives);
      //agora precisamos converter cada um dos archive em File
      const arrayFiles: Array<File> = arrayArchives.map(archive=> base64ToFile(archive.fileInBase64, archive.fileName))
      //agora temos o array de arquivos, apenas importamos no pinia
      filesAppended.value = arrayFiles;
    }
  }

  return { filesAppended, appendFile, hasFileAppended, cleanAppendedFiles, loadStore };
});
