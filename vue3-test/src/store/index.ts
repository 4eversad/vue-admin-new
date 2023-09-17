import { createPinia } from "pinia";
import type { App } from "vue";

const store = createPinia();

// 全局注册store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
