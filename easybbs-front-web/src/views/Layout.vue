<template>
  <div id="basicLayout">
    <div class="header" v-if="showHeader">
      <div
        class="header-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <!--logo-->
        <router-link to="/" class="logo">
          <span v-for="item in logoInfo" :style="{ color: item.color }">{{
            item.letter
          }}</span>
        </router-link>
        <!--板块信息-->
        <div class="menu-panel">
          <router-link
            :class="[
              'menu-item home',
              activePboardId == undefined ? 'active' : '',
            ]"
            to="/"
            >首页
          </router-link>
          <template v-for="board in boardList">
            <el-popover
              placement="bottom-start"
              :width="300"
              trigger="hover"
              v-if="board.children.length > 0"
            >
              <template #reference>
                <span
                  :class="[
                    'menu-item',
                    board.boardId == activePboardId ? 'active' : '',
                  ]"
                  @click="boardClickHandler(board)"
                  >{{ board.boardName }}</span
                >
              </template>
              <div class="sub-board-list">
                <span
                  :class="[
                    'sub-board',
                    subBoard.boardId == activeBoardId ? 'active' : '',
                  ]"
                  v-for="subBoard in board.children"
                  @click="subBoardClickHandler(subBoard)"
                  >{{ subBoard.boardName }}
                </span>
              </div>
            </el-popover>
            <span
              :class="[
                'menu-item',
                board.boardId == activePboardId ? 'active' : '',
              ]"
              v-else
              @click="boardClickHandler(board)"
              >{{ board.boardName }}</span
            >
          </template>
        </div>
        <!--登录，注册 用户信息-->
        <div class="user-info-panel">
          <div class="op-btn">
            <el-button type="primary" class="op-btn" @click="newPost">
              发帖<span class="iconfont icon-add"></span>
            </el-button>
            <el-button type="primary" class="op-btn" @click="goSearch">
              搜索<span class="iconfont icon-search"></span>
            </el-button>
          </div>
          <!--显示用户信息-->
          <template v-if="userInfo.userId">
            <div class="message-info">
              <el-dropdown>
                <el-badge
                  :value="messageCountInfo.total"
                  class="item"
                  :hidden="
                    messageCountInfo.total == null ||
                    messageCountInfo.total == 0
                  "
                >
                  <div class="iconfont icon-message"></div>
                </el-badge>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="gotoMessage('reply')"
                      class="message-item"
                    >
                      <span class="text">回复我的</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.reply > 0"
                        >{{
                          messageCountInfo.reply > 99
                            ? "99+"
                            : messageCountInfo.reply
                        }}</span
                      >
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('likePost')"
                      class="message-item"
                    >
                      <span class="text">赞了我的文章</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.likePost > 0"
                        >{{
                          messageCountInfo.likePost > 99
                            ? "99+"
                            : messageCountInfo.likePost
                        }}</span
                      >
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('downloadAttachment')"
                      class="message-item"
                    >
                      <span class="text">下载了我的附件</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.downloadAttachment > 0"
                        >{{
                          messageCountInfo.downloadAttachment > 99
                            ? "99+"
                            : messageCountInfo.downloadAttachment
                        }}</span
                      >
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('likeComment')"
                      class="message-item"
                    >
                      <span class="text">赞了我的评论</span>
                      <span
                        class="count-tag"
                        v-if="messageCountInfo.likeComment > 0"
                        >{{
                          messageCountInfo.likeComment > 99
                            ? "99+"
                            : messageCountInfo.likeComment
                        }}</span
                      >
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('sys')"
                      class="message-item"
                    >
                      <span class="text">系统消息</span>
                      <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                        messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                      }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="user-info">
              <el-dropdown>
                <avatar
                  :userId="userInfo.userId"
                  :width="50"
                  :addLink="false"
                ></avatar>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="gotoUcenter(userInfo.userId)"
                      >我的主页</el-dropdown-item
                    >
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <el-button-group :style="{ 'margin-left': '10px' }" v-else>
            <el-button type="primary" plain @click="loginAndRegister(1)"
              >登录</el-button
            >
            <el-button type="primary" plain @click="loginAndRegister(0)"
              >注册</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="body-content">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition name="fade" mode="out-in" appear>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <div class="footer" v-if="showFooter">
      <div
        class="footer-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <el-row>
          <el-col :span="6" class="item">
            <div class="logo">
              <div class="logo-letter">
                <span v-for="item in logoInfo" :style="{ color: item.color }">{{
                  item.letter
                }}</span>
              </div>
              <div class="info">一个干货满满的编程社区</div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">网站相关</div>
            <div>
              <a href="####">网站相关</a>
            </div>
            <div><a href="####">网站相关</a></div>
            <div><a href="####">网站相关</a></div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">友情链接</div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">关注站长</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--登录 注册-->
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    <!--回到顶部-->
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script setup>
import LoginAndRegister from "./LoginAndRegister.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  loadMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
};

const logoInfo = ref([
  {
    letter: "E",
    color: "#3285FF",
  },
  {
    letter: "a",
    color: "#FB3624",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
  {
    letter: "y",
    color: "#3285FF",
  },
  {
    letter: "b",
    color: "#25B24E",
  },
  {
    letter: "b",
    color: "#FD3224",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
]);

const showHeader = ref(true);

//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      //往下滚动
      scrollType = 1;
    } else {
      //往上滚动
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType == 1 && currentScrollTop > 100) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};

//登录注册
const loginRegisterRef = ref();
const loginAndRegister = (type) => {
  loginRegisterRef.value.showPanel(type);
};
onMounted(() => {
  initScroll();
  getUserInfo();
  loadSysSetting();
});

//获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};

//获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.commit("saveBoardList", result.data);
};
loadBoard();

//监听 登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);
//监听是否展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndRegister(1);
    }
  },
  { immediate: true, deep: true }
);

//板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};

//二级板块
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pboardId}/${subBoard.boardId}`);
};

//当前选中的板块
const activePboardId = ref(0);
watch(
  () => store.state.activePboardId,
  (newVal, oldVal) => {
    if (newVal !== 0) {
      activePboardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);

const activeBoardId = ref(0);
watch(
  () => store.state.activeBoardId,
  (newVal, oldVal) => {
    activeBoardId.value = newVal;
  },
  { immediate: true, deep: true }
);

//发帖
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndRegister(1);
  } else {
    router.push("/newPost");
  }
};

const gotoUcenter = (userId) => {
  router.push(`/user/${userId}`);
};

//消息相关
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};

const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: api.loadMessageCount,
  });
  if (!result) {
    return;
  }
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);

//退出
const logout = () => {
  proxy.Confirm("确定要退出吗?", async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
  });
};

//获取系统配置
const loadSysSetting = async () => {
  let result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  store.commit("saveSysSetting", result.data);
};

const goSearch = () => {
  router.push("/search");
};

//是否展示底部
const showFooter = ref(true);
watch(
  () => route.path,
  (newVal, oldVal) => {
    if (newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1) {
      showFooter.value = false;
    } else {
      showFooter.value = true;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">

.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.header {
  top: 0px;
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  background: #fff;
  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    align-items: center;
    .logo {
      display: block;
      text-decoration: none;
      margin-right: 5px;
      span {
        font-size: 35px;
      }
    }
    .menu-panel {
      flex: 1;
      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
      .home {
        text-decoration: none;
        color: #000;
      }
      .active {
        color: var(--link);
      }
    }
    .user-info-panel {
      width: 300px;
      display: flex;
      align-items: center;
      .op-btn {
        .iconfont {
          margin-left: 5px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      .message-info {
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
        .icon-message {
          font-size: 25px;
          color: rgb(147, 147, 147);
        }
      }
    }
  }
}

.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: rgb(239, 239, 239);
    border: 1px solid #ddd;
    color: rgb(119, 118, 118);
    margin-top: 10px;
    cursor: pointer;
  }

  .sub-board:hover {
    color: var(--link);
  }
  .active {
    background: var(--link);
    color: #fff;
  }
  .active:hover {
    color: #fff;
  }
}

.body-content {
  margin-top: 60px;
  position: relative;
  min-height: calc(100vh - 210px);
}

.message-item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .count-tag {
    height: 15px;
    line-height: 15px;
    min-width: 20px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}

.footer {
  background: #e9e9e9;
  height: 140px;
  margin-top: 10px;
  .footer-content {
    margin: 0px auto;
    padding-top: 10px;
    .item {
      text-align: left;
      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      a {
        font-size: 14px;
        text-decoration: none;
        color: var(--text2);
        line-height: 25px;
      }
    }

    .logo {
      .logo-letter {
        font-size: 30px;
      }
      .info {
        margin-top: 10px;
        color: rgb(93, 91, 91);
      }
    }
  }
}
</style>