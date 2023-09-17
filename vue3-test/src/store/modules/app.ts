import { defineStore } from "pinia";
import defaultSettings from "@/settings";
// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

export const useAppStore = defineStore("app", () => {
  const device = useStorage("device", "desktop");
  const size = useStorage<any>("size", defaultSettings.size);
  const language = useStorage("language", defaultSettings.language);
  const sidebarStatus = useStorage("sidebarStatus", "closed");
  const sidebar = reactive({
    opened: sidebarStatus.value !== "closed",
    withoutAnimation: false,
  });
  /**
   * 根据语言标识读取对应的语言包
   */
  const locale = computed(() => {
    if (language?.value == "en") {
      return en;
    } else {
      return zhCn;
    }
  });

  // actions

  /**
   * 切换侧边栏
   */
  function toggleSidebar(withoutAnimation: boolean) {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
    if (sidebar.opened) {
      sidebarStatus.value = "opened";
    } else {
      sidebarStatus.value = "closed";
    }
  }

  /**
   * 关闭侧边栏
   */
  function closeSideBar(withoutAnimation: boolean) {
    sidebar.withoutAnimation = withoutAnimation;
    sidebar.opened = false;
    sidebarStatus.value = "closed";
  }

  /**
   * 开启侧边栏
   */
  function openSideBar(withoutAnimation: boolean) {
    sidebar.withoutAnimation = withoutAnimation;
    sidebar.opened = true;
    sidebarStatus.value = "opened";
  }
  /**
   * 切换语言
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val;
  }

  /**
   * 切换设备
   */
  function toggleDevice(val: string) {
    device.value = val;
  }

  /**
   * 切换尺寸
   */
  function changeSize(val: string) {
    console.log(val);

    size.value = val;
  }

  return {
    device,
    sidebar,
    locale,
    language,
    size,
    toggleDevice,
    changeSize,
    toggleSidebar,
    closeSideBar,
    openSideBar,
    changeLanguage,
  };
});
