<template>
  <a-modal
    :footer="false"
    v-model:visible="visible"
    :width="800"
    @cancel="close"
    title="MusiMall智能导购"
    :unmount-on-close="true"
    :modal-style="{
      background: 'url(' + aiBg + ')',
      backgroundPosition: 'center',
    }"
    :maskClosable="false"
  >
    <a-scrollbar
      style="
        min-height: 500px;
        max-height: 500px;
        margin-bottom: 0px;
        overflow-y: scroll;
        scroll-behavior: smooth;
      "
      id="AImsgbox"
    >
      <div>
        <!-- 正常对话 -->
        <div v-for="(item, index) in msgList_Liushi" :key="index">
          <!-- AI回答 -->
          <transition
            enter-active-class="animate__animated animate__fadeIn animate__animated animate__faster"
            appear
          >
            <a-row
              style="width: 95%; margin: 0 auto; margin-bottom: 30px"
              type="flex"
              v-if="!item.my"
            >
              <a-col :flex="1">
                <a-avatar size="large" :image-url="aiAvatar" />
              </a-col>
              <div
                style="
                  background-color: #f5f5f5;
                  min-width: 92%;
                  max-width: 92%;
                  padding: 20px 30px;
                  border-radius: 10px;
                "
                :flex="100"
                class="left-sanjiao"
              >
                <span v-html="item.msg"> </span>

                <span
                  class="cursor"
                  v-if="
                    index == msgList_Liushi.length - 1 &&
                    noSend == true &&
                    showLoadMsg == false
                  "
                ></span>
              </div>
            </a-row>
          </transition>
          <!-- 人类提问 -->
          <a-row
            style="width: 95%; margin: 0 auto; margin-bottom: 30px"
            type="flex"
            v-if="item.my"
          >
            <div
              style="
                text-align: right;
                min-width: 92%;
                max-width: 92%;
                padding: 10px 20px;
                border-radius: 10px;
              "
              :flex="100"
              class="left-sanjiao"
            >
              {{ item.msg }}
            </div>
            <a-col :flex="1" style="margin-left: 10px">
              <a-avatar size="large" :image-url="userAvatar" />
            </a-col>
          </a-row>
        </div>
        <!-- AI对话加载中 -->
        <a-row
          style="width: 95%; margin: 0 auto; margin-bottom: 30px"
          type="flex"
          v-show="showLoadMsg && !initMsg"
          class="animate__fadeInUp animate__animated animate__faster"
        >
          <a-col :flex="1">
            <a-avatar size="large" :image-url="aiAvatar" />
          </a-col>
          <div
            style="
              background-color: #f5f5f5;
              min-width: 92%;
              max-width: 92%;
              padding: 20px 20px;
              border-radius: 10px;
            "
            :flex="100"
            class="left-sanjiao"
          >
            <a-spin size="large" />
          </div>
        </a-row>
      </div>
    </a-scrollbar>
    <div>
      <a-textarea
        class="inputArea"
        :placeholder="
          noSend
            ? 'AI导购正在思考或执行任务...'
            : '请输入你的需求，AI导购将为您解答或提供帮助。'
        "
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-model="nowMsg"
        :disabled="noSend || !canUse"
      ></a-textarea>
      <a-button
        class="btn"
        :disabled="noSend || !canUse"
        :max="100"
        shape="round"
        @click="sendMsg"
        >发送</a-button
      >
    </div>
  </a-modal>
</template>

  <script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
  defineExpose,
} from "vue";

// 响应式数据
const visible = ref(false);
const msgList = ref([]);
const msgList_Liushi = ref([]);
const noSend = ref(false);
const showLoadMsg = ref(false);
const nowMsg = ref("");
const respondComplete = ref(true);
const initMsg = ref(false);

// 配置
const canUse = ref(true);

const ttsWS = ref(null);
const willsendMsg = ref("");
const template = ref("");

// 图片
const userAvatar = ref(
  new URL("@/assets/avatar/aiChatUserLogo.png", import.meta.url).href
);
const aiAvatar = ref(
  new URL("@/assets/avatar/aiChatAiLogo.png", import.meta.url).href
);

const aiBg = ref(new URL("@/assets/pic/aiBg.png", import.meta.url).href);

// 发送无使用消息
const sendNouse = () => {
  setTimeout(() => {
    if (visible.value) {
      msgList.value.push({
        my: false,
        msg: "🔔实现碳中和对发电企业来说，主要挑战包括技术成本、技术难题、系统整合以及经济社会部门联动等。具体如下：<ul><li> <b>1. 技术成本：</b>碳中和技术目前的成本相对较高，这限制了其大规模应用的可能性。为了实现碳中和目标，需要通过技术进步和规模化生产来降低成本。</li><li> <b>2. 捕获难题：</b>碳捕获和封存技术（CCS）是实现碳中和的关键技术之一，但目前还存在一些技术难题，需要加强研究和开发以克服这些难题。</li><li> <b>3. 系统整合：</b>智能电网的建设是实现碳中和的重要环节，但涉及到技术的整合和系统安全问题，需要解决这些技术挑战以保证电网的稳定和安全。</li><li> <b>4. 经济社会部门联动：</b>碳中和目标的实现是一个涉及经济社会各部门联动的长期系统性问题。电力行业作为能源系统最大的碳排放部门，其变革将影响到整个能源和经济体系。</li></ul>综上所述，发电企业在迈向碳中和的过程中，不仅需要关注技术和成本的挑战，还需要考虑到整个经济社会系统的变革。",
      });
      respondComplete.value = false;
      initMsg.value = true;
      noSend.value = true;
      showLoadMsg.value = false;
      respondComplete.value = true;

      if (!visible.value) return;
      msgList_Liushi.value.push({
        my: false,
        msg: "",
      });

      let index = 0;
      let timer = setInterval(() => {
        if (visible.value) {
          if (
            index < msgList.value[msgList_Liushi.value.length - 1].msg.length
          ) {
            msgList_Liushi.value[msgList_Liushi.value.length - 1].msg +=
              msgList.value[msgList_Liushi.value.length - 1].msg.charAt(index);
            index++;
          } else if (!respondComplete.value) {
          } else {
            clearInterval(timer);
            timer = null;
            if (visible.value) {
              noSendOver();
            }
          }
        } else {
          clearInterval(timer);
        }
      }, 20);
    }
  }, 10);
};

// 打开组件
const open = (msgInit = "") => {
  noSend.value = false;
  msgList.value = [];
  msgList_Liushi.value = [];
  visible.value = true;
  nowMsg.value = msgInit;

  setTimeout(() => {
    msgList.value = [];
    msgList_Liushi.value = [];
    init();
  }, 0);
};

// 流失输出
const liushishuchu = () => {
  if (!visible.value) return;
  msgList_Liushi.value.push({
    my: false,
    msg: "",
  });

  let index = 0;
  let timer = setInterval(() => {
    if (visible.value) {
      if (index < msgList.value[msgList_Liushi.value.length - 1].msg.length) {
        msgList_Liushi.value[msgList_Liushi.value.length - 1].msg +=
          msgList.value[msgList_Liushi.value.length - 1].msg.charAt(index);
        index++;
      } else if (!respondComplete.value) {
      } else {
        clearInterval(timer);
        timer = null;
        if (visible.value) {
          if (!canUse.value) {
            sendNouse();
          }
          noSendOver();
        }
      }
    } else {
      clearInterval(timer);
    }
  }, 20);
};

// 初始化
const init = () => {
  msgList.value.push({
    my: false,
    msg: "欢迎光临MusiMall，导购员热忱为您服务。请输入你的需求，我们将为您解答或提供帮助。😊",
  });

  initMsg.value = true;
  noSend.value = true;
  showLoadMsg.value = false;
  liushishuchu();
};

// 关闭组件
const close = () => {
  console.log("close");
  msgList.value = [];
  msgList_Liushi.value = [];
  visible.value = false;
  noSend.value = false;
};

// 正在发送中
const noSending = () => {
  if (!noSend.value) {
    setTimeout(() => {
      noSend.value = true;
      showLoadMsg.value = true;
    }, 100);
    setTimeout(() => {
      if (visible.value) {
        boxHeightAdjust();
      }
    }, 610);
  } else {
    console.log("请等待当前对话完成");
  }
};

// 发送完成
const noSendOver = () => {
  noSend.value = false;
  showLoadMsg.value = false;
  setTimeout(() => {
    if (visible.value) {
      boxHeightAdjust();
    }
  }, 10);
  initMsg.value = false;
};

// 调整盒子高度
const boxHeightAdjust = () => {
  const box = document.getElementById("AImsgbox");
  if (box) {
    const boxHeight = box.scrollHeight;
    box.scrollTo({
      top: boxHeight,
      behavior: "smooth",
    });
  }
};

// 发送消息
const sendMsg = () => {
  if (nowMsg.value === "") {
    console.log("不能发送空字符串");
    return;
  }
  boxHeightAdjust();
  noSending();
  msgList.value.push({
    my: true,
    msg: nowMsg.value,
  });
  msgList_Liushi.value.push({
    my: true,
    msg: nowMsg.value,
  });
  willsendMsg.value = nowMsg.value;
  nowMsg.value = "";

  noSending();
  setTimeout(() => {
    sendNouse();
  }, 1000);
};

// 发送 WebSocket 消息
const webSocketSend = () => {
  let textArrySend = [];
  textArrySend.push({
    role: "user",
    content: template.value + willsendMsg.value,
  });
  const params = {
    header: {
      app_id: appId.value,
      uid: "fd3f47e4-d",
    },
    parameter: {
      chat: {
        domain: "general",
        temperature: 0.5,
        max_tokens: 1024,
      },
    },
    payload: {
      message: {
        text: textArrySend,
      },
    },
  };
  willsendMsg.value = "";
  ttsWS.value.send(JSON.stringify(params));
  console.log(">模型准备发送数据", params);
};

// 发送过程中
const inSendingProcess = () => {
  getWebsocketUrl().then((url) => {
    let ttsWSInstance;
    if ("WebSocket" in window) {
      ttsWSInstance = new WebSocket(url);
    } else if ("MozWebSocket" in window) {
      ttsWSInstance = new MozWebSocket(url);
    } else {
      alert("浏览器不支持WebSocket");
      return;
    }
    ttsWS.value = ttsWSInstance;

    ttsWSInstance.onopen = (e) => {
      webSocketSend();
      respondComplete.value = false;
      showLoadMsg.value = false;
      msgList.value.push({
        my: false,
        msg: "",
      });
      liushishuchu();
    };

    ttsWSInstance.onmessage = (e) => {
      let result = JSON.parse(e.data);
      let dataArray = result.payload.choices.text;
      console.log(dataArray);
      msgList.value[msgList.value.length - 1].msg += dataArray[0].content;

      let jsonData = JSON.parse(e.data);
      if (jsonData.header.code !== 0) {
        console.log("大模型调用失败，星火服务器原因");
        showLoadMsg.value = false;
        noSend.value = false;
        ttsWSInstance.close();
        return;
      }
      if (jsonData.header.code === 0 && jsonData.header.status === 2) {
        respondComplete.value = true;
        ttsWSInstance.close();
      }
    };

    ttsWSInstance.onerror = (e) => {
      console.log("大模型调用失败，星火服务器原因！");
      showLoadMsg.value = false;
      noSend.value = false;
      respondComplete.value = true;
      console.error(`详情查看：${encodeURI(url.replace("wss:", "https:"))}`);
    };

    ttsWSInstance.onclose = (e) => {
      console.log(e);
    };
  });
};

onMounted(() => {
  // 可以在这里添加挂载后的逻辑
});

defineExpose({
  open,
});
</script>

<style scoped>
.aiChat {
  background: url("https://p1-hera.feishucdn.com/tos-cn-i-jbbdkfciu3/d35b3b8c2a10457a8efe6f397418620f~tplv-jbbdkfciu3-png:0:0.png") !important;
}

.inputArea {
  background: white !important;
  border: none;
  box-shadow: 0 5px 15px 0 rgba(176, 191, 231, 0.95);
  border-radius: 10px;
}

.cursor {
  position: relative;
  display: inline-block;
  left: 10px;
  top: 5px;
  display: inline-block;
  width: 15px;
  height: 15px;
  background-color: #d0bfff;
  border-radius: 10px;
  animation: cursorBlink 0.3s infinite;
}
/* 实现一个闪烁效果的动画 */
@keyframes cursorBlink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.btn {
  border-radius: 999px;
  background-color: #683ef0;
  color: white;
  border-color: #683ef0;
  position: absolute;
  right: 30px;
  bottom: 40px;
  z-index: 99999;
}
/* 如果btn有disabled属性 */
.btn[disabled] {
  border-radius: 999px;
  background-color: #f8f9fa;
  color: grey;
  border-color: #f8f9fa;
  position: absolute;
  right: 30px;
  bottom: 40px;
  cursor: not-allowed;
}
</style>