<template>
  <div
    class="container-body search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
      class="search-panel"
      :style="{ 'padding-top': startSearch ? '0px' : searchPanelHeight + 'px' }"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            placeholder="输入你想要查找的关键词"
            v-model="formData.keyword"
            @keyup.enter="search"
            @focus="startSearchHandler"
            @change="changeInput"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
                @blur="formData.keyword = $event.target.value.trim()"
              ></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list">
      <DataList
        :loading="loading"
        :dataSource="articleListInfo"
        @loadData="search"
        noDataMsg="没有发现帖子，赶紧发布一个吧"
      >
        <template #default="{ data }">
          <ArticleListItem
            :data="data"
            :showComment="showComment"
            :htmlTitle="true"
          ></ArticleListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  loadArticle: "/forum/search",
};

const searchPanelHeight = (window.innerHeight - 60 - 140 - 60) / 2;

//开始搜索
const startSearch = ref(false);
const startSearchHandler = () => {
  startSearch.value = true;
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [
    { required: true, message: "请输入关键字" },
    { min: 3, message: "关键字太少，至少三个字" },
  ],
};

const loading = ref(false);
const articleListInfo = ref({});
const search = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    let params = {
      pageNo: articleListInfo.value.pageNo,
      keyword: formData.value.keyword,
    };
    let result = await proxy.Request({
      url: api.loadArticle,
      params: params,
      showLoading: false,
    });
    loading.value = false;
    if (!result) {
      return;
    }
    let list = result.data.list;
    list.forEach((element) => {
      element.title = element.title.replace(
        params.keyword,
        "<span style='color:red'>" + params.keyword + "</span>"
      );
    });
    articleListInfo.value = result.data;
  });
};

const changeInput = () => {
  if (formData.value.keyword == "") {
    articleListInfo.value = {};
  }
};

const showComment = ref(false);
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 210px);
  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>