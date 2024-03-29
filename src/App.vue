<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import HomeView from "./views/HomeView.vue";
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
