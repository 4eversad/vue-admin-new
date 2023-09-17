import router from "./router";
import { createApp } from "vue";
import App from "./App.vue";
import "uno.css";
import { setupDirective } from "./components/directive/index.ts";
// 本地SVG图标
import "virtual:svg-icons-register";
import "virtual:uno.css";
import "./permission.ts";
import { setupStore } from "./store";
// 导入样式

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import i18n from "./lang/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
setupStore(app);
setupDirective(app);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(i18n);
app.mount("#app");
