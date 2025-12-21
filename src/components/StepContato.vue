<script setup lang="ts">
    import { useFileSelectedStore } from "@/stores/fileSelected";
    import fileSelector from "@/assets/imgs/folder.png";
    const fileSelected = useFileSelectedStore();
</script>

<template>
    <span class="mr-1">Tabela de contatos enviar (.csv):</span>
    <label for="files-input">
        <img class="w-7 inline cursor-pointer" :src="fileSelector"/>
    </label>
    <span v-show="fileSelected.fileSelected">{{
        fileSelected.fileSelected?.name.split(".csv")[0]
    }}</span>
    <input
        type="file"
        name="file-contacts"
        id="files-input"
        class="hidden"
        @change="fileSelected.handleFileChange"
        accept=".csv"
    />
    <p>ou</p>
    <label for="numbers-input"
        >Digite os números (separados por vírgula):</label
    >
    <input type="text" name="numbers" id="numbers-input" />
</template>