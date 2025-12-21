<script setup lang="ts">
    import { useFileSelectedStore } from "@/stores/fileSelected";
    import fileSelector from "@/assets/imgs/folder.png";
    const fileSelected = useFileSelectedStore();
</script>

<template>
    <div class="text-center w-full flex flex-col items-center">
        <span class="mr-1">
            Tabela de contatos enviar (.csv):
            <label for="files-input" class="inline">
                <img class="w-7 inline cursor-pointer" :src="fileSelector"/>
            </label>
        </span>
        <span v-show="fileSelected.fileSelected">{{
            fileSelected.fileSelected?.name.split(".csv")[0]
        }}
        </span>
        <input
            type="file"
            name="file-contacts"
            id="files-input"
            class="hidden"
            @change="fileSelected.handleFileChange"
            accept=".csv"
        />
        <p>ou</p>
        <fieldset class="w-100 border-2 border-gray-300 rounded-lg p-2 focus-within:border-[#F9B02E] transition-all duration-200 overflow-hidden">
            <legend class="px-2 text-sm font-medium text-gray-600">
                Digite os números (separados por vírgula):
            </legend>
            <textarea 
                class="w-full p-3 outline-none transition-all duration-200 
                    placeholder:text-gray-400 field-sizing-content resize-none 
                    min-h-[100px] block break-all overflow-hidden max-h-40" 
                name="numbers" 
                id="numbers-input" 
                placeholder="Ex.: 5551991620409, 5551963215478"
            />
        </fieldset>
    </div>
</template>