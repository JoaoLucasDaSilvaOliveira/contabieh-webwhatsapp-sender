<script setup lang="ts">
  import { ref } from 'vue';

  const optionMessage = ref<boolean>(true)
  const optionGlobalFile = ref<boolean>(false)
</script>

<template>
  <aside>
    <header class="aside-header">
      <div class="logo-header">
        Logo
      </div>
      <button>Hamburguer</button>
    </header>

    <div class="aside-content">
      <p>Como usar?</p>
      <p>Passo 1</p>
      <p>Passo 2</p>
      <p>Resumo dos envios</p>
      <p>Desenvolvido por: @GitHub <a href="https://github.com/JoaoLucasDaSilvaOliveira">JoaoLucasDaSilvaOliveira</a></p>
    </div>
  </aside>

  <main>
    <header>
      <h1>Contabiehl WhatsApp</h1>
      <p>Enviador de mensagens em massa</p>
    </header>

    <div class="main-content">
      <label for="files-input">Tabela de contatos enviar (.csv):</label>
      <input type="file" name="file-contacts" id="files-input">
      <p>ou</p>
      <label for="numbers-input">Digite os números (separados por vírgula):</label>
      <input type="text" name="numbers" id="numbers-input">

      <div class="table-message-option">
        <span>Usar mensagem da tabela de contatos?</span>
        <input type="radio" v-model="optionMessage" id="table-message-radio-no" :value="false">
        <label for="table-message-radio-no">Não</label>
        <input type="radio" v-model="optionMessage" id="table-message-radio-yes" :value="true">
        <label for="table-message-radio-yes">Sim</label>
      </div>
      
      <div class="text-area" v-if="optionMessage">
        <p>Digite a mensagem:</p>
        <textarea name="mensagem-a-enviar" id="textArea"></textarea>
      </div>

      <label for="">Adicione arquivo(s) ao envio (opcional)</label>
      <input type="file" name="files-to-send" id="f-appender">

      <div class="global-file-option">
        <span>Usar o(s) mesmo(s) arquivo(s) para todos os contatos?</span>
        <input type="radio" v-model="optionGlobalFile" id="global-file-radio-no" :value="false">
        <label for="global-file-radio-no">Não</label>
        <input type="radio" v-model="optionGlobalFile" id="global-file-radio-yes" :value="true">
        <label for="global-file-radio-yes">Sim</label>
      </div>

      <button>Enviar</button>

      <p>Enviando mensagem para: contato.nome</p>
      <p>Erro ao enviar mensagem para: contato.nome</p>
      <p>Envio finalizado!</p>
    </div>
  </main>
</template>

<style scoped></style>
