<script setup lang="ts">
    //TODO:
    // implementar lógica
    import { onMounted, ref } from "vue";
    import { useMultiStepFormStore } from "@/stores/multiStepForm";

    const aviso = ref<string>("");
    const multiStepForm = useMultiStepFormStore();

    const voltarHomePage = () => {
        setTimeout(() => {
            aviso.value= '';
            multiStepForm.backToBeginning();
        }, 1000);
    };

    onMounted(() => {
        aviso.value = 'Redirecionando para a pagina principal';
        voltarHomePage();
    });
</script>

<template>
    <p>Enviando mensagem para: contato.nome</p>
    <p>Erro ao enviar mensagem para: contato.nome</p>
    <p>Envio finalizado!</p>
    <p>{{ aviso }}</p>
</template>