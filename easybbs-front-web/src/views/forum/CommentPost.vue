<template>
  <div class="post-comment-panel">
    <Avatar :width="avatarWidth" :userId="userId"></Avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!--textarea输入-->
        <el-form-item prop="content">
          <el-input
            clearable
            :placeholder="placeholderInfo"
            type="textarea"
            :maxlength="800"
            resize="none"
            show-word-limit
            v-model="formData.content"
          ></el-input>
          <div class="insert-img" v-if="showInsertImg">
            <div class="pre-img" v-if="commentImg">
              <CommentImage :src="commentImg"></CommentImage>
              <span
                class="iconfont icon-remove"
                @click="removeCommentImg"
              ></span>
            </div>
            <el-upload
              v-else
              name="file"
              :show-file-list="false"
              accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
              :multiple="false"
              :http-request="selectImg"
            >
              <span class="iconfont icon-image"></span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="send-btn" @click="postCommentDo">发表</div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();

const api = {
  postComment: "/comment/postComment",
};

const props = defineProps({
  articleId: {
    type: String,
  },
  pCommentId: {
    type: Number,
  },
  replyUserId: {
    type: String,
  },
  avatarWidth: {
    type: Number,
  },
  userId: {
    type: String,
  },
  showInsertImg: {
    type: Boolean,
  },
  placeholderInfo: {
    type: String,
    default: "请文明发言，做一个棒棒的程序员",
  },
});

//form信息

const checkPostComment = (rule, value, callback) => {
  if (value == null && formData.value.image == null) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容", validator: checkPostComment },
    { min: 5, message: "评论至少5个字" },
  ],
};

const emit = defineEmits(["postCommentFinish"]);
const postCommentDo = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.articleId = props.articleId;
    params.pCommentId = props.pCommentId;
    params.replyUserId = props.replyUserId;
    let result = await proxy.Request({
      url: api.postComment,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("评论发表成功");
    formDataRef.value.resetFields();
    removeCommentImg();
    emit("postCommentFinish", result.data);
  });
};

//选择图片
const commentImg = ref(null);
const selectImg = (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    let imgData = target.result;
    commentImg.value = imgData;
    formData.value.image = file;
  };
};

const removeCommentImg = () => {
  commentImg.value = null;
  formData.value.image = null;
};
</script>

<style lang="scss">
.post-comment-panel {
  display: flex;
  align-items:center;
  .comment-form {
    flex: 1;
    margin: 0px 10px;
    .el-textarea__inner {
      height: 60px;
    }
    .insert-img {
      line-height: normal;
      .iconfont {
        margin-top: 3px;
        font-size: 20px;
        color: #3f3f3f;
      }
      .pre-img {
        margin-top: 10px;
        position: relative;
        .iconfont {
          cursor: pointer;
          position: absolute;
          top: -10px;
          right: -10px;
          color: rgb(121, 121, 121);
        }
      }
    }
  }
  .send-btn {
    cursor: pointer;
    width: 60px;
    height: 60px;
    background: var(--link);
    color: #fff;
    text-align: center;
    line-height: 60px;
    border-radius: 5px;
  }
}
</style>