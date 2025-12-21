<script setup lang="ts">
    import { useMultiStepFormStore } from '@/stores/multiStepForm';
    const multiStepForm = useMultiStepFormStore()
</script>

<template>
    <button @click="multiStepForm.voltarAoInicio">Alterar informações</button>
    <button @click="multiStepForm.nextStep">Enviar</button>
</template>