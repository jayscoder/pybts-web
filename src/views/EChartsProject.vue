<script setup lang="ts">
import { watch, computed, ref, onMounted, onUnmounted, nextTick } from "vue";
const props = defineProps(["project"]);
import * as echarts from "echarts";
import { ElMessage, ElMessageBox } from "element-plus";
import { useConfigStore } from "@/stores/config";
import pauseIcon from "@/assets/pause.png";
import playIcon from "@/assets/play.png";
import xmlIcon from "@/assets/xml.png";

// import Prism Editor
import Prism from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css"; // import syntax highlighting styles

const chartDiv = ref(null); // ECharts instance div view
const chart = ref(null); // ECharts instance
const currentStage = ref("");
const historyStages = ref([]);
const currentPage = ref(1);
const currentProject = computed(() => props.project);
const configStore = useConfigStore();
const isPaused = ref(false);
const currentTree = ref({});
let intervalId = null;
const drawerOpen = ref(false);
const selectedId = ref("");
const selectedData = computed(() => {
  return findNodeByDataIndex(currentTree.value, selectedId.value);
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
  chart.value.dispatchAction({
    type: "unselect",
    seriesIndex: 0,
    name: selectedId.value,
  });
  drawerOpen.value = false; // 确保抽屉的状态是关闭的
};

onMounted(async () => {
  await nextTick();
  chart.value = echarts.init(chartDiv.value);
  await fetchOption();
  await fetchData();
  await configStore.fetchConfig();
  console.log("EchartsCurrent updateInterval", configStore.getUpdateInterval());
  intervalId = setInterval(() => {
    fetchData();
  }, (configStore.getUpdateInterval() || 1) * 1000);

  chart.value.on("selectchanged", "series", (params) => {
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

const getToolboxOption = () => {
  return {
    show: true,
    itemSize: 30,
    itemGap: 16,
    feature: {
      // dataView: { readOnly: false },
      myTool1: {
        show: true,
        title: isPaused.value ? "播放" : "暂停",
        icon: `image://${isPaused.value ? playIcon : pauseIcon}`,
        onclick: () => {
          isPaused.value = !isPaused.value;
          chart.value.setOption(
            {
              toolbox: getToolboxOption(),
            },
            false
          );
        },
      },
      myTool2: {
        show: true,
        title: "下载XML",
        icon: `image://${xmlIcon}`,
        onclick: () => {
          downloadXML();
        },
      },
      saveAsImage: {},
    },
  };
};

const downloadXML = () => {
  try {
    console.log("downloadXML");
    // 从后端下载XML文件 url = `/api/get_xml_data?project=${currentProject.value}&step=${currentStage.value}`
    const url = `/api/get_xml_data?project=${currentProject.value}&stage=${currentStage.value}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject.value}__${currentStage.value}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error(e);
    ElMessage.error(e.message);
  }
};

const fetchData = async () => {
  if (isPaused.value) {
    // 处于暂停状态下，根据currentPage来请求数据
    const needFetchStage = historyStages.value[currentPage.value - 1];
    if (needFetchStage != currentStage.value) {
      fetchTree(needFetchStage);
    }
  } else {
    fetchTree(""); // -1表示不指定step，由后端自己决定
  }
};

const fetchOption = async () => {
  try {
    const response = await fetch(`/api/get_option`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const option = await response.json();
    option.toolbox = getToolboxOption();
    option.tooltip.formatter = (params) => {
      let code = Prism.highlight(params.value, Prism.languages.yaml, "yaml");
      return "<pre>" + code + "</pre>";
    };
    option.series[0].label.formatter = (params) => {
      return params.data.label;
    };
    chart.value.setOption(option);
  } catch (e) {
    console.error(e);
    ElMessage.error(e.message);
  }
};

const fetchTree = async (stage) => {
  try {
    const response = await fetch(
      `/api/get_echarts_data?project=${currentProject.value}&stage=${stage}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result["stage"] == currentStage.value) {
      return;
    }
    currentStage.value = result["stage"];
    historyStages.value = result["history"];
    currentTree.value = result["tree"];
    currentPage.value = result["page"];
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
  } catch (e) {
    console.error(e);
    ElMessage.error(e.message);
  }
};

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  fetchData();
};

// 定义一个函数来递归搜索节点
function findNodeByDataIndex(data, dataId) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
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

const copySelectedCode = () => {
  // 使用浏览器的 Clipboard API 来复制内容
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(selectedData.value["value"])
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
    textarea.value = selectedData.value["value"];
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log("内容已复制");
    ElMessage.success("内容已复制");
  }
};
</script>
<template>
  <div class="container">
    <div ref="chartDiv" class="chart-container"></div>
    <el-pagination
      v-model:current-page="currentPage"
      :small="false"
      :page-size="1"
      :background="false"
      layout="total, prev, pager, next, jumper"
      :total="historyStages.length"
      @current-change="handleCurrentChange"
      class="pagination"
    >
    </el-pagination>
    <el-drawer
      v-model="drawerOpen"
      :title="selectedTitle"
      direction="rtl"
      size="30%"
      @close="onDrawerClose"
    >
      <pre
        @dblclick="copySelectedCode"
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
