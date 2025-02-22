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
      borderRadius: '10px',
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
        <a-alert
          title="当前为测试模式，仅供开发人员使用，不实际调用大模型。如需修改请关闭弹窗后点右上角wifi符号"
          style="margin-bottom: 20px; scale: 0.75"
          type="info"
          show-icon
          v-if="isTest"
        />
        <!-- 正常对话 -->
        <div v-for="(item, index) in msgList_Stream" :key="index">
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
                <div>
                  <span v-html="item.msg"> </span>

                  <span
                    class="cursor"
                    v-if="
                      index == msgList_Stream.length - 1 &&
                      forbiddenSend == true &&
                      showLoadMsg == false
                    "
                  ></span>
                </div>
                <div
                  class="toOrderBtn animate__animated animate__fadeIn animate__faster"
                  v-if="
                    hasOrder(item.msg) != null &&
                    (forbiddenSend == false ||
                      (forbiddenSend == true &&
                        index != msgList_Stream.length - 1))
                  "
                  @click="routeToOrder(hasOrder(item.msg))"
                >
                  <div>点击此处，查看订单: {{ hasOrder(item.msg) }}</div>
                  <SvgIcon name="jumpTo" width="18px" />
                </div>
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
          forbiddenSend
            ? 'AI导购正在思考或执行任务...'
            : '请输入你的需求，AI导购将为您解答或提供帮助。'
        "
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-model="inputTextareaMsg"
        :disabled="forbiddenSend || !canUse"
      ></a-textarea>
      <a-button
        class="btn"
        :disabled="forbiddenSend || !canUse"
        :max="100"
        shape="round"
        @click="sendMsgPrepare"
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
import SvgIcon from "@/components/SvgIcon.vue";
// 响应式数据
const visible = ref(false);
const msgList = ref([]); // 消息集
const msgList_Stream = ref([]); // 流式输出已经输出的响应集
const forbiddenSend = ref(false); // 是否禁止发送消息
const showLoadMsg = ref(false); // 是否显示加载图标，用于用户点击发送后，到链接成功之间的时间段
const inputTextareaMsg = ref(""); // 输入框内容
const respondComplete = ref(true); // 是否已经回复完成
const initMsg = ref(false); // 是否是初始化消息
const chatId = ref(null); // 聊天id

// 配置
const canUse = ref(true); // 是否可以使用
const willsendMsg = ref("");

// 图片
const userAvatar = ref(
  new URL("@/assets/avatar/aiChatUserLogo.png", import.meta.url).href
);
const aiAvatar = ref(
  new URL("@/assets/avatar/aiChatAiLogo.png", import.meta.url).href
);

const aiBg = ref(new URL("@/assets/pic/aiBg.png", import.meta.url).href);

/**
 *  判断消息中是否有订单号
 * @param msg  消息
 */
const hasOrder = (msg) => {
  // 如果出现“订单号为12189381830则提取并返回订单号，否则返回null
  let reg = /订单号为(\d+)/;
  let result = reg.exec(msg);
  if (result) {
    return result[1];
  } else {
    return null;
  }
};
/**
 * 获取测试消息
 */
const getTestMsgInLocal = () => {
  setTimeout(() => {
    if (visible.value) {
      msgList.value.push({
        my: false,
        msg: "🔔实现碳中和对发电企业来说，主要挑战包括技术成本、技术难题、系统整合以及经济社会部门联动等。具体如下：<ul><li> <b>1. 技术成本：</b>碳中和技术目前的成本相对较高，这限制了其大规模应用的可能性。为了实现碳中和目标，需要通过技术进步和规模化生产来降低成本。</li><li> <b>2. 捕获难题：</b>碳捕获和封存技术（CCS）是实现碳中和的关键技术之一，但目前还存在一些技术难题，需要加强研究和开发以克服这些难题。</li><li> <b>3. 系统整合：</b>智能电网的建设是实现碳中和的重要环节，但涉及到技术的整合和系统安全问题，需要解决这些技术挑战以保证电网的稳定和安全。</li><li> <b>4. 经济社会部门联动：</b>碳中和目标的实现是一个涉及经济社会各部门联动的长期系统性问题。电力行业作为能源系统最大的碳排放部门，其变革将影响到整个能源和经济体系。</li></ul>综上所述，发电企业在迈向碳中和的过程中，不仅需要关注技术和成本的挑战，还需要考虑到整个经济社会系统的变革。我已经为您成功下单，订单号为12189381830，您可以点击下方按钮跳转查看并完成支付或取消。感谢光临MusiMall，祝您购物愉快！",
      });
      respondComplete.value = false;
      initMsg.value = true;
      forbiddenSend.value = true;
      showLoadMsg.value = false;
      respondComplete.value = true;

      if (!visible.value) return;
      msgList_Stream.value.push({
        my: false,
        msg: "",
      });

      let index = 0;
      let timer = setInterval(() => {
        if (visible.value) {
          if (
            index < msgList.value[msgList_Stream.value.length - 1].msg.length
          ) {
            msgList_Stream.value[msgList_Stream.value.length - 1].msg +=
              msgList.value[msgList_Stream.value.length - 1].msg.charAt(index);
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

/**
 * 流式输出
 */
const StreamLickOut = () => {
  // 如果窗口已经关闭，则不执行
  if (!visible.value) return;
  // 如果当前没有消息，则不执行
  msgList_Stream.value.push({
    my: false,
    msg: "",
  });

  // 流式输出
  let index = 0; // 当前输出的字符索引
  let timer = setInterval(() => {
    // 如果窗口已经关闭，则不执行
    if (visible.value) {
      // 如果当前消息还没有输出完毕
      if (index < msgList.value[msgList_Stream.value.length - 1].msg.length) {
        // 将[当前字符]添加到流式输出的消息中
        msgList_Stream.value[msgList_Stream.value.length - 1].msg +=
          msgList.value[msgList_Stream.value.length - 1].msg.charAt(index);
        index++;
      } else if (!respondComplete.value) {
        // 如果当前消息已经输出完毕，但是还没有收到结束的回复，则不执行，继续等待
      } else {
        // 如果当前消息已经输出完毕，并且已经收到结束的回复，则清除定时器
        clearInterval(timer);
        timer = null;
        if (visible.value) {
          if (!canUse.value) {
            getTestMsgInLocal();
          }
          noSendOver();
        }
      }
    } else {
      clearInterval(timer);
    }
    // 每20毫秒输出一个字符
  }, 20);
};

/**
 * 初始化
 */
const init = () => {
  msgList.value.push({
    my: false,
    msg: "欢迎光临MusiMall，导购员热忱为您服务。请输入你的需求，我们将为您解答或提供帮助。😊",
  });

  initMsg.value = true;
  forbiddenSend.value = true;
  showLoadMsg.value = false;
  StreamLickOut();
};

/**
 * 打开窗口组件
 * @param {string} msgInit 初始化消息（加载到底部输入框）
 */
const open = (msgInit = "") => {
  // 初始化
  forbiddenSend.value = false; // 显示加载图标
  msgList.value = [];
  msgList_Stream.value = [];
  visible.value = true;
  inputTextareaMsg.value = msgInit;
  calculateIsTest(); // 判断是否是测试
  chatId.value = null;

  setTimeout(() => {
    msgList.value = [];
    msgList_Stream.value = [];
    init();
  }, 0);
};

/**
 * 关闭窗口组件
 */
const close = () => {
  msgList.value = [];
  msgList_Stream.value = [];
  visible.value = false;
  forbiddenSend.value = false;
};

/**
 * 设置不能发送消息
 */
const setNoSending = () => {
  if (!forbiddenSend.value) {
    setTimeout(() => {
      forbiddenSend.value = true;
      showLoadMsg.value = true;
    }, 100);
    setTimeout(() => {
      if (visible.value) {
        boxHeightAdjust();
      }
    }, 610);
  } else {
    // Message.warning("请等待当前对话完成");
  }
};

/**
 * 设置可以发送消息
 */
const noSendOver = () => {
  forbiddenSend.value = false;
  showLoadMsg.value = false;
  setTimeout(() => {
    if (visible.value) {
      boxHeightAdjust();
    }
  }, 10);
  initMsg.value = false;
};

/**
 * 调整消息框高度
 */
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

/**
 * 发送消息准备
 */
const sendMsgPrepare = () => {
  // 检验是否为空
  if (inputTextareaMsg.value.trim() === "") {
    Message.warning("请输入内容");
    inputTextareaMsg.value = "";
    return;
  }
  boxHeightAdjust();
  setNoSending();
  // 添加用户端消息
  msgList.value.push({
    my: true,
    msg: inputTextareaMsg.value,
  });
  msgList_Stream.value.push({
    my: true,
    msg: inputTextareaMsg.value,
  });
  // willsendMsg存储将发送消息，然后将inputTextareaMsg清空，清空用户最下方输入回显
  willsendMsg.value = inputTextareaMsg.value;
  inputTextareaMsg.value = "";

  setNoSending();
  setTimeout(() => {
    // getTestMsgInLocal();
    sendMsgNow();
  }, 1000);
};

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { aichat } from "@/api/ai";
import { Message } from "@arco-design/web-vue";
import { useApiStore } from "../../../store/api";
const apiStore = useApiStore();

/**
 * 发送消息
 */
const sendMsgNow = () => {
  apiStore.setInlocalStorage();
  // 发送消息
  fetchEventSource(aichat(isTest.value), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userMessage: willsendMsg.value,
      chatId: chatId.value,
    }),
    onopen(event) {
      // 链接成功
      respondComplete.value = false;
      showLoadMsg.value = false;
      msgList.value.push({
        my: false,
        msg: "",
      });
      StreamLickOut();
    },
    onmessage(event) {
      let result = JSON.parse(event.data);
      // 如果返回的数据为空，则提示模型出现问题
      if (result == null) {
        msgList.value[msgList.value.length - 1].msg =
          "模型出现问题，请稍后再试";
        showLoadMsg.value = false;
        forbiddenSend.value = false;
        msg;
        Message.warning("模型出现问题，请稍后再试");
        return;
      }
      // 如果返回的数据中有chatId，则更新chatId
      if (result.chatId != null) {
        chatId.value = result.chatId;
      }
      // 如果返回的数据中有message，则将message添加到当前消息中
      if (result.message != null) {
        msgList.value[msgList.value.length - 1].msg += result.message;
      }
    },
    onclose(event) {
      // 链接关闭
      respondComplete.value = true;
    },
    onerror(event) {
      // 链接错误
      msgList.value[msgList.value.length - 1].msg = "模型出现问题，请稍后再试";
      showLoadMsg.value = false;
      forbiddenSend.value = false;
      msg;
      Message.warning("模型出现问题，请稍后再试");
    },
  });
};

import router from "@/router";
/**
 * 跳转到订单页面
 * @param orderId 订单号
 */
const routeToOrder = (orderId) => {
  setTimeout(() => {
    if (orderId == null) {
      router.push({ name: "Order" });
    } else {
      router.push({ name: "Order-Detail", params: { id: orderId } });
    }
    setTimeout(() => {
      close();
    }, 1000);
  }, 100);
};

const isTest = ref(false); // 是否是测试模式

const calculateIsTest = () => {
  if (
    localStorage.getItem("aiTest") == "true" ||
    localStorage.getItem("aiTest") == null
  ) {
    isTest.value = true;
  } else if (localStorage.getItem("aiTest") == "false") {
    isTest.value = false;
  }
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
  20% {
    opacity: 1;
  }
  70% {
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

.toOrderBtn {
  text-align: left;
  margin-top: 10px;
  font-size: 12px;
  border-radius: 999px;
  background: linear-gradient(275deg, #ce9ffc, #7367f0);
  color: white;

  padding: 5px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.toOrderBtn:hover {
  padding: 5px 55px;
}
</style>