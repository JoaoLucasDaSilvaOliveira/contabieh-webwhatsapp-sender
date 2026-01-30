import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * serve para persistir e resgatar dados do localStorage
 */
export const useGloblalLocalStorageHandler = defineStore(
  "global-local-storage",
  () => {
    const keysUseds = ref<Array<string>>([]);
    const DEFAULT_KEY = "keys-useds";
    const canClick = ref<boolean>(false);

    const saveChanges = (key: string, content: string) => {
      //pegar as chaves salvas
      const keysSaveds = localStorage.getItem(DEFAULT_KEY); // retorna um array em formato JSON ou null
      if (keysSaveds) {
        //se já tem chaves salvas, importa
        keysUseds.value = JSON.parse(keysSaveds);
      }

      //se não tem nenhuma chave, continuamos o codigo normal
      localStorage.setItem(key, content); //salva no localStorage a chave e o conteudo

      //precisamos conferir se a chave fornecida já consta no array de chaves
      if (keysUseds.value.length > 0) {
        // se tem chave no array
        const isKeyUsed = keysUseds.value.find((keyUsed) => keyUsed === key); //true se tem a chave e false se não tem a chave
        if (!isKeyUsed) {
          keysUseds.value.push(key); //se não temos a chave no array de chaves, a inserimos no array de chaves
          localStorage.setItem(DEFAULT_KEY, JSON.stringify(keysUseds.value));
        }
        // se a chave já foi usada, significa que ela já estava salva no localStorage, não precisa salvar dnv
      } else {
        //nesse caso não temos nenhuma chave cadastrada ainda
        keysUseds.value.push(key);
        localStorage.setItem(DEFAULT_KEY, JSON.stringify(keysUseds.value));
      }
    };

    const getItem = (key: string) => {
      return localStorage.getItem(key);
    };

    const clearItem = (key: string, input?: HTMLInputElement) => {
      //nesse caso de exclusão, é pq já teve um salvamento, então não precisa verificar a chave fornecida (em tese)
      localStorage.removeItem(key);
      //remove a chave do array de chaves
      keysUseds.value = keysUseds.value.filter((keyUsed) => keyUsed !== key);
      if (keysUseds.value.length > 0) {
        localStorage.setItem("keys-useds", JSON.stringify(keysUseds.value));
      } else {
        localStorage.removeItem("keys-useds");
      }
      if (input) {
        input.value = "";
      }
    };

    /**
     * Limpa todas as chaves criadas e usadas por esse programa, sem afetar outros
     */
    const clearAll = () => {
      const keysSaveds = localStorage.getItem(DEFAULT_KEY); // retorna um array em formato JSON ou null
      if (keysSaveds) {
        keysUseds.value = JSON.parse(keysSaveds);
        keysUseds.value.forEach(key => localStorage.removeItem(key))
        localStorage.removeItem(DEFAULT_KEY)
      }
    };

    const handleCanClick = (bool: boolean) => {
      canClick.value = bool;
      saveChanges('can-click', String(canClick.value))
    }

    return { saveChanges, getItem, clearItem, clearAll, canClick, handleCanClick };
  }
);
