<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useConfigStore } from "@/stores/config";

const route = useRoute();
const router = useRouter(); // 获取路由实例
const menus = ref([]);
const configStore = useConfigStore();
const fetchConfig = async () => {
  await configStore.fetchConfig();
  const projects = configStore.getProjects();
  if (projects.length === 0) {
    ElMessage.error("No projects found");
    return;
  }

  menus.value = configStore.getProjects().map((it, index) => {
    return {
      name: it,
      index: `/echarts/${it}`,
    };
  });
};

let intervalId = null;

onMounted(async () => {
  await fetchConfig();

  // 设置定时器，例如每 5 分钟执行一次
  intervalId = setInterval(fetchConfig, 3000); // 每隔3s刷新一次项目

  // 如果当前路由不在menus中，则跳转到第一个menu
  if (!menus.value.some((menu) => route.path === menu.index)) {
    router.push(menus.value[0].index);
  }
});

onUnmounted(() => {
  // 清除定时器
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <el-container style="width: 100vw; height: 100vh">
    <el-aside width="200px">
      <el-menu :router="true">
        <el-menu-item
          v-for="menu in menus"
          :index="menu.index"
          :route="menu.index"
          :key="menu.index"
        >
          {{ menu.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view> </router-view>
    </el-main>
  </el-container>
</template>
