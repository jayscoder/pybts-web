import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";

export const useConfigStore = defineStore({
  id: "config",
  state: () => ({
    title: "",
    update_interval: 1,
    projects: [],
  }),
  actions: {
    async fetchConfig() {
      try {
        const response = await fetch("/api/get_config");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        this.title = result.title;
        this.update_interval = result.update_interval;
        this.projects = result.projects;
      } catch (e) {
        console.error(e);
        ElMessage.error(e.message);
      }
    },
    setConfig(config) {
      this.title = config.title;
      this.update_interval = config.update_interval;
      this.projects = config.projects;
    },
    // 获取 title
    getTitle() {
      return this.title;
    },
    // 获取 update_interval
    getUpdateInterval() {
      return this.update_interval;
    },
    // 获取 projects
    getProjects() {
      return this.projects;
    },
  },
});
