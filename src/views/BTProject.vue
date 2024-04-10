<script setup lang="ts">
import { watch, computed, ref, onMounted, onUnmounted, nextTick } from "vue";
const props = defineProps(["project"]);
import * as echarts from "echarts";
import { ElMessage, ElMessageBox } from "element-plus";
import { useConfigStore } from "@/stores/config";
import pauseIcon from "@/assets/pause.png";
import playIcon from "@/assets/play.png";
import xmlIcon from "@/assets/xml.png";
import infoIcon from "@/assets/info.png";
// import Prism Editor
import Prism from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css"; // import syntax highlighting styles

const chartDiv = ref(null); // ECharts instance div view
const chart = ref(null); // ECharts instance
const totalPages = ref(0);
const currentPage = ref(1);
const currentProject = computed(() => props.project);
const configStore = useConfigStore();
const isPaused = ref(false);
const currentResult = ref({
  tree: {},
  title: "",
  subtitle: "",
});
let intervalId: any = null;
const drawerOpen = ref(false);
const selectedId = ref("");
const selectedData = computed(() => {
  return findNodeByDataIndex(currentResult.value["tree"], selectedId.value);
});

const selectedTitle = computed(() => {
  if (!selectedData.value || !selectedData.value["data"]) {
    return "";
  }
  return selectedData.value["data"]["data"]["name"];
});

const selectedCode = computed(() => {
  if (!selectedData.value || !selectedData.value["value"]) {
    return "";
  }
  return Prism.highlight(
    selectedData.value["value"],
    Prism.languages.yaml,
    "yaml"
  );
});

const onDrawerClose = () => {
  // 关闭抽屉时取消 ECharts 中的选中状态
  // @ts-ignore
  chart.value.dispatchAction({
    type: "unselect",
    seriesIndex: 0,
    name: selectedId.value,
  });
  drawerOpen.value = false; // 确保抽屉的状态是关闭的
};

onMounted(async () => {
  await nextTick();
  // @ts-ignore
  chart.value = echarts.init(chartDiv.value);
  await fetchOption();
  await fetchData();
  await configStore.fetchConfig();
  console.log("EchartsCurrent updateInterval", configStore.getUpdateInterval());
  intervalId = setInterval(() => {
    fetchData();
  }, (configStore.getUpdateInterval() || 1) * 1000);
  // @ts-ignore
  chart.value.on("selectchanged", "series", (params) => {
    // @ts-ignore
    const chartOption = chart.value.getOption();
    const selectedMap = chartOption.series[0].selectedMap;
    if (params.selected.length > 0) {
      // 使用 dataIndex 查找对应的节点数据
      for (let k in selectedMap) {
        if (selectedMap[k]) {
          selectedId.value = k;
          break;
        }
      }
      drawerOpen.value = true;
    } else {
      drawerOpen.value = false;
    }
  });
});

onUnmounted(() => {
  // 清除定时器
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// 路由改变时
watch(
  () => props.project,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currentPage.value = 1;
      await fetchData();
    }
  }
);

const getMyTool1Option = () => {
  return {
    show: true,
    title: isPaused.value ? "播放" : "暂停",
    icon: `image://${isPaused.value ? playIcon : pauseIcon}`,
    onclick: () => {
      isPaused.value = !isPaused.value;
      // @ts-ignore
      chart.value.setOption(
        {
          toolbox: {
            feature: {
              myTool1: getMyTool1Option(),
            },
          },
        },
        false
      );
    },
  };
};

const getMyTool2Option = () => {
  return {
    show: true,
    title: "下载XML",
    icon: `image://${xmlIcon}`,
    onclick: () => {
      downloadXML();
    },
  };
};

const showInfoDrawer = ref(false);

const infoCode = computed(() => {
  if (!currentResult.value || !currentResult.value["subtitle"]) {
    return "";
  }
  return Prism.highlight(
    currentResult.value["subtitle"],
    Prism.languages.yaml,
    "yaml"
  );
});

const getMyTool3Option = () => {
  return {
    show: true,
    title: "展示信息",
    icon: `image://${infoIcon}`,
    onclick: () => {
      showInfoDrawer.value = !showInfoDrawer.value;
    },
  };
};

const downloadXML = () => {
  try {
    console.log("downloadXML");
    // 从后端下载XML文件 url = `/api/get_xml_data?project=${currentProject.value}&step=${currentStage.value}`
    const url = `/api/get_xml_data?project=${currentProject.value}&id=${currentPage.value}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject.value}__${currentPage.value}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e: any) {
    console.error(e);
    ElMessage.error(e.message);
  }
};

const fetchData = async () => {
  if (isPaused.value) {
    // 处于暂停状态下，根据currentPage来请求数据
    fetchTree(currentPage.value);
  } else {
    fetchTree(""); // 空表示不指定页数，由后端自己决定
  }
};

const fetchOption = async () => {
  try {
    const response = await fetch(`/api/get_option`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const option = await response.json();
    option.toolbox.feature.myTool1 = getMyTool1Option();
    option.toolbox.feature.myTool2 = getMyTool2Option();
    option.toolbox.feature.myTool3 = getMyTool3Option();
    option.tooltip.formatter = (params: any) => {
      let code = Prism.highlight(params.value, Prism.languages.yaml, "yaml");
      return "<pre>" + code + "</pre>";
    };
    option.series[0].label.formatter = (params: any) => {
      return params.data.label;
    };
    // @ts-ignore
    chart.value.setOption(option);
  } catch (e: any) {
    console.error(e);
    ElMessage.error(e.message);
  }
};

const fetchTree = async (track_id: any) => {
  try {
    const response = await fetch(
      `/api/get_echarts_data?project=${currentProject.value}&id=${track_id}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    totalPages.value = result["total"];
    currentPage.value = result["page"];
    if (JSON.stringify(result) === JSON.stringify(currentResult.value)) {
      return;
    }
    currentResult.value = result;
    // @ts-ignore
    chart.value.setOption(
      {
        series: [
          {
            data: [result["tree"]],
          },
        ],
        title: {
          text: result["title"],
          subtext: result["subtitle"],
        },
      },
      false
    );
  } catch (e: any) {
    if (track_id != "1") {
      fetchTree("1"); // 重试
    } else {
      console.error(e);
      ElMessage.error(e.message);
    }
  }
};

// 定义一个函数来递归搜索节点
function findNodeByDataIndex(data: any, dataId: any): any {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      // @ts-ignore
      const result = findNodeByDataIndex(data[i], dataId);
      if (result) return result;
    }
  } else {
    if (data.name === dataId) {
      return data;
    }
    if (data.children) {
      return findNodeByDataIndex(data.children, dataId);
    }
  }
  return null;
}

const copyCode = (code: string) => {
  // 使用浏览器的 Clipboard API 来复制内容
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("内容已复制");
        ElMessage.success("内容已复制");
      })
      .catch((err) => {
        console.error("复制失败:", err);
        ElMessage.error("复制失败:", err.message);
      });
  } else {
    // 旧版浏览器的复制方法
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log("内容已复制");
    ElMessage.success("内容已复制");
  }
};

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  isPaused.value = true;
  // @ts-ignore
  chart.value.setOption(
    {
      toolbox: {
        feature: {
          myTool1: getMyTool1Option(),
        },
      },
    },
    false
  );
  currentPage.value = val;
  fetchData();
};
</script>
<template>
  <div class="container">
    <div ref="chartDiv" class="chart-container"></div>
    <el-pagination
      v-model:current-page="currentPage"
      :small="false"
      :page-size="1"
      :background="true"
      layout="total, prev, pager, next, jumper"
      :total="totalPages"
      @current-change="handleCurrentChange"
      class="pagination"
    >
    </el-pagination>
    <el-drawer
      v-model="showInfoDrawer"
      :title="currentResult.title"
      direction="rtl"
      size="35%"
      @close="showInfoDrawer = false"
    >
      <pre
        @dblclick="copyCode(infoCode)"
      ><code class="language-yaml" v-html="infoCode"></code></pre>
    </el-drawer>

    <el-drawer
      v-model="drawerOpen"
      :title="selectedTitle"
      direction="rtl"
      size="35%"
      @close="onDrawerClose"
    >
      <pre
        @dblclick="copyCode(selectedCode)"
      ><code class="language-yaml" v-html="selectedCode"></code></pre>
    </el-drawer>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%; /* 使用视窗高度确保占满整个屏幕的高度 */
  width: 100%; /* 图表容器宽度占满容器宽度 */
  justify-content: center;
  align-items: center;
}

.chart-container {
  flex-grow: 1; /* 图表容器将填充剩余空间 */
  width: 100%; /* 图表容器宽度占满容器宽度 */
  /* 不需要设置 height: 100%; 因为 flex-grow 已经确保了填充 */
}

.pagination {
  margin-top: auto; /* 将分页组件推到底部 */
  margin-bottom: 8px;
}
</style>
