<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="600px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" ref="formDataRef" label-width="40px">
      <!--input输入-->
      <el-form-item label="日期" prop="createTimeRange">
        <el-date-picker
          v-model="formData.createTimeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="loadRecord"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="data-item">
      <div class="record-type">类型</div>
      <div class="integral">积分</div>
      <div class="create-time">时间</div>
    </div>
    <DataList
      :loading="loading"
      :dataSource="recordInfo"
      @loadData="loadRecord"
      noDataMsg="暂无相关记录"
    >
      <template #default="{ data }">
        <div class="data-item">
          <div class="record-type">{{ data.operTypeName }}</div>
          <div :class="['integral', data.integral > 0 ? 'add' : 'reduce']">
            {{ data.integral }}
          </div>
          <div class="create-time">{{ data.createTime }}</div>
        </div>
      </template>
    </DataList>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadUserIntegralRecord: "/ucenter/loadUserIntegralRecord",
};

const dialogConfig = reactive({
  show: false,
  title: "查看用户积分记录",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const showRecord = () => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    loadRecord();
  });
};
defineExpose({ showRecord });

const loading = ref(false);
const recordInfo = ref({});
const loadRecord = async () => {
  loading.value = true;
  let params = {
    pageNo: recordInfo.value.pageNo,
  };

  if (formData.value.createTimeRange) {
    params.createTimeStart = formData.value.createTimeRange[0];
    params.createTimeEnd = formData.value.createTimeRange[1];
  }

  let result = await proxy.Request({
    url: api.loadUserIntegralRecord,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  recordInfo.value = result.data;
};
</script>

<style lang="scss">
.data-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 8px 0px;
  .add {
    color: red;
  }
  .reduce {
    color: green;
  }
  .record-type {
    width: 120px;
  }
  .integral {
    width: 120px;
  }
  .create-time {
    text-align: center;
    flex: 1;
  }
}
</style>