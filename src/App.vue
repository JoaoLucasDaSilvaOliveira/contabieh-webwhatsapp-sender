<script setup lang="ts"></script>

<template>
  <RouterView/>
</template>


<style>
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
  }
  #app{
    overflow: visible;
    width: 100%;
    height: 100%;
    padding: 30px;
  }
</style>
