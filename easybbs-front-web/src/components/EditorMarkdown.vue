<template>
  <v-md-editor
    :model-value="modelValue"
    :height="height + 'px'"
    :disabled-menus="[]"
    :include-level="[1, 2, 3, 4, 5, 6]"
    @upload-image="uploadImageHandler"
    @change="change"
  >
  </v-md-editor>
</template>

<script setup>
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// highlightjs
import hljs from "highlight.js";

import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 500,
  },
});

const emit = defineEmits();
const change = (markdownContent, htmlContent) => {
  emit("update:modelValue", markdownContent);
  emit("htmlContent", htmlContent);
};

const uploadImageHandler = async (event, insertImage, files) => {
  let result = await proxy.Request({
    url: "file/uploadImage",
    params: {
      file: files[0],
    },
  });
  if (!result) {
    return;
  }
  const url = proxy.globalInfo.imageUrl + result.data.fileName;
  insertImage({
    url: url,
    desc: "图片",
  });
};
</script>

<style lang="scss">
</style>