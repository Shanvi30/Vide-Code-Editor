<template>
  <div style="font-family: sans-serif; padding: 2rem; text-align: center">
    <h1 style="color: #42b883">💚 Vue 3 + TypeScript</h1>
    <p style="color: #555">Start editing <code>src/App.vue</code></p>
    <p>Count: {{ count }}</p>
    <button @click="count++" style="padding: 0.5rem 1rem; cursor: pointer">
      Click me
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>