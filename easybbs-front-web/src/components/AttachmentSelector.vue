<template>
  <div class="attachment-selector">
    <template v-if="modelValue">
      <div class="file-show">
        <div class="file-name" :title="modelValue.name">
          {{ modelValue.name }}
        </div>
        <div class="iconfont icon-del" @click="delFile"></div>
      </div>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      accept=".zip,.rar"
      :multiple="false"
      :http-request="selectFile"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits();
const selectFile = async (file) => {
  emit("update:modelValue", file.file);
};

const delFile = () => {
  emit("update:modelValue", null);
};
</script>

<style lang="scss">
.attachment-selector {
  width: 100%;
  .file-show {
    display: flex;
    justify-content: space-around;
    .file-name {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--link);
    }
    .icon-del {
      width: 20px;
      color: var(--link);
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>