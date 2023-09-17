<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      id="toolbar-container"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    >
    </Toolbar>
    <!-- 编辑器 -->
    <Editor
      id="editor-container"
      v-model="modelValue"
      :default-config="editorConfig"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    ></Editor>
  </div>
</template>

<script lang="ts" setup>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadFileApi } from "@/api/file";
const props = defineProps({
  modelValue: {
    type: [String],
    default: "",
  },
});
const editorRef = shallowRef();
//编辑器实例,必须用shallowRef,用于创建一个浅的响应式引用。
//使用 shallowRef 创建的引用可以存储任何 JavaScript 值，并在其引用的值发生更改时自动触发更新。

const emit = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emit);
const mode = ref("default");
const toolbarConfig = ref({}); //工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: any, insertFn: any) {
        uploadFileApi(file).then((response: any) => {
          const url = response.data.url;
          insertFn(url);
        });
      },
    },
  },
});
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
function handleChange(editor: any) {
  modelValue.value = editor.getHtml();
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
