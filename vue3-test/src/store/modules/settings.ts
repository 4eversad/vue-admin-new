import { defineStore } from "pinia";
import defaultSettings from "@/settings";

export const useSettingsStore = defineStore("settings", () => {
  // state
  // 存值
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  const showSettings = ref<boolean>(defaultSettings.showSettings);
  const fixedHeader = ref<boolean>(defaultSettings.fixedHeader);
  const sidebarLogo = ref<boolean>(defaultSettings.sidebarLogo);
  const layout = useStorage<string>("layout", defaultSettings.layout);

  // actions
  function changeSettings(param: { key: string; value: any }) {
    const { key, value } = param;
    switch (key) {
      case "showSettings":
        showSettings.value = value;
        break;
      case "fixedHeader":
        fixedHeader.value = value;
        break;
      case "tagsView":
        tagsView.value = value;
        break;
      case "sidebarLogo":
        sidebarLogo.value = value;
        break;
      case "layout":
        layout.value = value;
        break;
      default:
        break;
    }
  }

  return {
    changeSettings,
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo,
    layout,
  };
});
