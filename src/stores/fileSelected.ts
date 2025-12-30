import { ref } from "vue";
import { defineStore } from "pinia";
import {useGloblalLocalStorageHandler} from "@/stores/globalLocalStorageHandler";
import fromBase64toFileComposable from "@/components/composables/fromBase64toFile";


export const useFileSelectedStore = defineStore("fileSelected", () => {
  const handleLocalStorage = useGloblalLocalStorageHandler();
  const fileSelected = ref<File | null>(null);
  const DEFAULT_KEY = "contacts-file";
  const DEFAULT_FILE_NAME_KEY = "file-name";

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement; //pega do evento, o input como um elemento html
    if (target.files && target.files.length > 0) {
      fileSelected.value = target.files[0]!;
    }
    //salva o arquivo no localStorage em base64
    const base64Maker = new FileReader();
    base64Maker.onload = (file) => {
      const base64File = file.target?.result as string;
      handleLocalStorage.saveChanges(DEFAULT_KEY, base64File);
    };
    base64Maker.readAsDataURL(fileSelected.value as Blob);
    handleLocalStorage.saveChanges(
      DEFAULT_FILE_NAME_KEY,
      fileSelected.value?.name!
    );
  };

  const cleanSelectedFile = (input: HTMLInputElement) => {
    fileSelected.value = null;
    handleLocalStorage.clearItem(DEFAULT_KEY, input);
    handleLocalStorage.clearItem(DEFAULT_FILE_NAME_KEY);
  };

  const recuperateFileSaved = () => {
    const fileSaved = handleLocalStorage.getItem(DEFAULT_KEY);
    const fileName = handleLocalStorage.getItem(DEFAULT_FILE_NAME_KEY);
    if (fileSaved && fileName) {
      const fileFromBase64 = fromBase64toFileComposable(fileSaved, fileName);
      fileSelected.value = fileFromBase64;
    }
  };

  return {
    fileSelected,
    handleFileChange,
    cleanSelectedFile,
    recuperateFileSaved,
  };
});
