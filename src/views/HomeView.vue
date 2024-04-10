<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import type { Ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useConfigStore } from "@/stores/config";
import { Sort } from "@element-plus/icons-vue";
import { computed } from "@vue/reactivity";

const route = useRoute();
const router = useRouter(); // 获取路由实例

const menus: Ref<
  {
    name: string;
    index: string;
    unread: number;
    total: number;
    desc: string;
  }[]
> = ref([]);
const order = ref("正序");
const search = ref("");
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
      // @ts-ignore
      name: it.name,
      // @ts-ignore
      unread: it.unread,
      // @ts-ignore
      index: `/bt?project=${it.name}`,
      // @ts-ignore
      total: it.total,
      // @ts-ignore
      desc: `${it.name} (${it.total})`,
    };
  });
};

let intervalId: any = null;

onMounted(async () => {
  await fetchConfig();

  // 设置定时器，例如每 5 分钟执行一次
  intervalId = setInterval(fetchConfig, 1500); // 每隔3s刷新一次项目列表

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

const onOrderClick = () => {
  order.value = order.value === "正序" ? "倒序" : "正序";
};

const computedMenu = computed(() => {
  const orderMenus =
    order.value === "正序" ? menus.value : menus.value.slice().reverse();

  const searchSp = search.value.split(" ");
  return orderMenus.filter((it) => {
    return searchSp.every((sp) => {
      return it.desc.includes(sp);
    });
  });
});
</script>

<template>
  <el-container style="width: 100vw; height: 100vh">
    <el-aside width="250px" style="height: 100%; border-right: 1px solid #ccc">
      <div
        style="
          padding: 10px;
          border-bottom: 1px solid #ccc;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        "
      >
        <h1 style="margin-right: 8px">
          <a
            href="https://github.com/wangtong2015/pybts/"
            target="_blank"
            style="text-decoration: none; color: black"
            >PYBTS</a
          >
          ({{ computedMenu.length }})
        </h1>
        <el-button type="primary" :icon="Sort" text @click="onOrderClick">{{
          order
        }}</el-button>
      </div>
      <el-input v-model="search" placeholder="搜索" clearable></el-input>
      <el-menu :router="true" v-if="menus.length > 0">
        <el-menu-item
          v-for="menu in computedMenu"
          :index="menu.index"
          :route="menu.index"
          :key="menu.index"
        >
          <template #title>
            <el-tooltip :content="menu.desc" placement="right">
              <span>
                {{ menu.desc }}
              </span>
            </el-tooltip>
          </template>
        </el-menu-item>
      </el-menu>
      <div v-else style="padding: 10px; text-align: center">
        <p>用 PYBTS 来生成行为树运行数据</p>
        <p>Use PYBTS to generate behavior tree running data</p>
      </div>
    </el-aside>
    <el-main>
      <router-view> </router-view>
    </el-main>
  </el-container>
</template>

<style scoped>
.badge {
  margin-top: 12px;
  margin-right: 12px;
}
</style>
