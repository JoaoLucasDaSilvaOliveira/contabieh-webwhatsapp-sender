<script setup lang="ts">
    import { ref } from 'vue';
    const optionGlobalFile = ref<boolean>(false);
</script>

<template>
    <label>Adicione arquivo(s) ao envio (opcional)</label>
        <input type="file" name="files-to-send" id="f-appender" />

        <div class="global-file-option">
          <span>Usar o(s) mesmo(s) arquivo(s) para todos os contatos?</span>
          <input
            type="radio"
            v-model="optionGlobalFile"
            id="global-file-radio-no"
            :value="false"
          />
          <label for="global-file-radio-no">Não</label>
          <input
            type="radio"
            v-model="optionGlobalFile"
            id="global-file-radio-yes"
            :value="true"
          />
          <label for="global-file-radio-yes">Sim</label>
        </div>
</template>