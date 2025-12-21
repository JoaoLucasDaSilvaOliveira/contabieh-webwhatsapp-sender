<script setup lang="ts"></script>

<template>
  <RouterView/>
</template>


<style>
  *{
    overflow: hidden;
  }
  input, button {
    cursor: pointer;
  }

  body {
    width: 100vw;
    min-height: 100vh;

  }
  #app{
    width: 100%;
    height: 100%;
    padding: 30px;
  }
</style>
