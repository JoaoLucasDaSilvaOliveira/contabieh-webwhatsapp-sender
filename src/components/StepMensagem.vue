<script setup lang="ts">
    import { ref } from 'vue';
    const optionMessage = ref<boolean>(true);
</script>

<template>
    <div class="table-message-option">
        <span>Usar mensagem da tabela de contatos?</span>
        <input
        type="radio"
        v-model="optionMessage"
        id="table-message-radio-no"
        :value="false"
        />
        <label for="table-message-radio-no">Não</label>
        <input
        type="radio"
        v-model="optionMessage"
        id="table-message-radio-yes"
        :value="true"
        />
        <label for="table-message-radio-yes">Sim</label>
    </div>

    <div class="text-area" v-if="!optionMessage">
        <p>Digite a mensagem:</p>
        <textarea name="mensagem-a-enviar" id="textArea"></textarea>
    </div>  
</template>