<template>
  <div class="tags-container">
    <scroll-pane ref="scrollPaneRef">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
        @contextmenu.prevent="openTagMenu(tag, $event)"
        @click.middle="!isAffix(tag) ? closeSelectedTag : ''"
      >
        {{ tag.meta?.title }}
        <span
          v-if="!isAffix(tag)"
          class="tags-item-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <i-ep-close class="text-[10px]"></i-ep-close>
        </span>
      </router-link>
    </scroll-pane>

    <ul
      v-show="tagMenuVisible"
      class="tag-menu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh"></svg-icon>刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close"></svg-icon>关闭
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other"></svg-icon>关闭其他
      </li>
      <li @click="closeLeftTags" v-if="!isFirstView()">
        <svg-icon icon-class="close_left"></svg-icon>关闭左侧
      </li>
      <li @click="closeRightTags" v-if="!isLastView()">
        <svg-icon icon-class="close_right"></svg-icon>关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="close_all"></svg-icon>关闭所有
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import ScrollPane from "./ScrollPane.vue";
import { getCurrentInstance, ComponentInternalInstance } from "vue";
import { useTagsViewStore } from "@/store/modules/tagView";
import { storeToRefs } from "pinia";
import path from "path-browserify";
import { TagView } from "@/store/modules/tagView";
import { usePermissionStore } from "@/store/modules/permission";
const affixTags = ref<TagView[]>([]);
const tagsViewStore = useTagsViewStore();
const permissionStore = usePermissionStore();
const { visitedViews } = storeToRefs(tagsViewStore) as any;
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const router = useRouter();
// 标签操作菜单显示状态
const selectedTag = ref({});
const tagMenuVisible = ref(false);
const left = ref(0);
const top = ref(0);

watch(tagMenuVisible, (newVal) => {
  if (newVal) {
    document.body.addEventListener("click", closeTagMenu);
  } else {
    // document.body.removeEventListener("click", closeTagMenu);
  }
});

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  { immediate: true }
);

/**
 * 过滤出来有要固定的tag
 */

function filterAffixTags(routes: any[], basePath = "/"): any {
  let tags: TagView[] = [];
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags?.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

// 初始化标签
function initTags() {
  const tags: TagView[] = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

// 增加标签
function addTags() {
  if (route.name) {
    tagsViewStore.addView(route);
  }
}
/**
 * 刷新标签
 */
function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  const { fullPath } = view;
  nextTick(() => {
    router.replace({ path: "/redirect" + fullPath }).catch((err) => {
      console.warn(err);
    });
  });
}

/**
 * 判断是不是第一个标签
 */
function isFirstView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath === "/dashboard" ||
      (selectedTag.value as TagView).fullPath ===
        tagsViewStore.visitedViews[1].fullPath
    );
  } catch (err) {
    return false;
  }
}

/**
 * 判断是不是最后一个标签
 */

function isLastView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

/**
 * 判断是否为固定标签
 * @param tag
 */
function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

/**
 * 判断是否为当前路由
 * @param tag
 */
function isActive(tag: TagView) {
  return route.path === tag.path;
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of tagsViewStore.visitedViews) {
      if (r.path === route.path) {
        if (r.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route);
        }
      }
    }
  });
}

/**
 * 打开右键菜单栏
 * @param tag
 * @param e
 */
function openTagMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;
  // $el为tag-container组件
  const offsetLeft = proxy?.$el.getBoundingClientRect().left;
  // tag-container的宽度
  const offsetWidth = proxy?.$el.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  // 15为margin-right
  const l = e.clientX - offsetLeft + 15;
  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }
  top.value = e.clientY;
  tagMenuVisible.value = true;
  selectedTag.value = tag;
}

// 关闭选择的标签
function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view).then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

// 关闭左侧所有标签
function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}

// 关闭右侧所有标签
// 分两种情况: 1.选中的标签和当前路由的标签 2.选中的标签和当前路由的标签不相等
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}
function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllViews().then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

// 跳转到最后一个标签(在删除其他标签后,直接跳转到最后一个)
// view就是当前的元素标签??
function toLastView(visitedViews: TagView[], view?: any) {
  // slice(-1)[0]就是取数组中最后一个元素, slice(-1)就是只取最后一个元素作为数组
  const lastView = visitedViews.slice(-1)[0];
  if (lastView && lastView.fullPath) {
    router.push(lastView.fullPath);
  } else {
    if (lastView.name === "Dashboard") {
      router.replace({ path: "/redirect" + view.fillPath });
    } else {
      router.push("/");
    }
  }
}
function closeTagMenu() {
  tagMenuVisible.value = false;
}

onMounted(() => {
  initTags();
});
</script>
<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);

  .tags-item {
    display: inline-block;
    padding: 3px 8px;
    margin: 4px 0 0 5px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    &:hover {
      color: var(--el-color-primary);
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        content: "";
        background: #fff;
        border-radius: 50%;
      }
    }

    &-close {
      border-radius: 100%;

      &:hover {
        color: #fff;
        background: rgb(0 0 0 / 16%);
      }
    }
  }
}

.tag-menu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style>
