import { ref } from "vue";
import { defineStore } from "pinia";

export const useFileSelectedStore = defineStore("fileSelected", () => {

  const fileSelected = ref<File | null>(null);

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement; //pega do evento, o input como um elemento html
    if (target.files && target.files.length > 0) {
      fileSelected.value = target.files[0]!;
    }
  };

  return { fileSelected, handleFileChange };
});
