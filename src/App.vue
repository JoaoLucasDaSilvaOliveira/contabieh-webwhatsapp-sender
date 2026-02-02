<script setup lang="ts">
  import { onMounted, ref, onUnmounted } from 'vue';
  import zapLogoRedonda from '@/assets/imgs/whatsapp1.png'
  import xRedondo from '@/assets/imgs/x-vermelho-redondo.png'


  const img = ref<string>(zapLogoRedonda)
  const showExtension = ref<boolean>(true)
  const isOnChatScreen = ref<boolean>(true)
  let screenCheckInterval: any | null = null
  

  const handleShowButton = () =>{
    showExtension.value = !showExtension.value
    img.value = showExtension.value ? xRedondo  :  zapLogoRedonda
  }

  const checkScreen = () =>{
    const chatPanel = document.querySelector('#pane-side') || 
                   document.querySelector('[data-testid="chat-list"]');

    // 2. Verificamos se existe algum "drawer" (gaveta lateral) aberto que cubra a lista.
    // O WhatsApp usa estes IDs e testids para as telas de Definições e Perfil.
    const isSettingsOpen = document.querySelector('[data-testid="drawer-left-inner"]') || 
                                    document.querySelector('.ld9V9'); // Classe comum em menus laterais

    // Se o painel lateral existe, estamos na tela principal
    if (chatPanel && !isSettingsOpen) {
      isOnChatScreen.value = true;
    } else {
      isOnChatScreen.value = false;
      showExtension.value = false; // Fecha a extensão se sair da tela principal
      img.value = zapLogoRedonda;
    }
  }

  // LIFECYCLE
  // onMounted(() => {
  //   // Verifica imediatamente
  //   checkScreen();
  //   screenCheckInterval = setInterval(checkScreen, 1);
  // });

  // onUnmounted(() => {
  //   if (screenCheckInterval) clearInterval(screenCheckInterval);
  // });
</script>

<template>
  <div v-if="isOnChatScreen">
    <div class="fixed top-65 right-333 w-50 align-middle">
      <div class="flex items-center gap-1 text-green-600">
        <button class="w-8 cursor-pointer" @click="handleShowButton">
          <img :src="img" alt="toggle" class="max-w-none w-14 ">
        </button>
      </div>
    </div>
    <RouterView v-show="showExtension"/>
  </div>
</template>


<style scoped>
  *{
    box-sizing: border-box;
  }
  input, button {
    cursor: pointer;
  }

  html {
    overflow: hidden;
  }

  body {
    width: 100%;
    min-height: 100vh;
    background-color: #F8F8FF
  }
  #app{
    overflow: visible;
    width: 100%;
    height: 100%;
  }
</style>
