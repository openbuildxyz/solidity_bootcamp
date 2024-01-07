import { createApp } from "vue";
import App from "./App.vue";
// @ts-ignore
import Antd from "ant-design-vue";
import { ethers } from "ethers";
import "ant-design-vue/dist/reset.css";
import { dataModels } from "./data/DataRegister";
import { message } from "ant-design-vue";
import { Toast } from "./plugins/Toast";
import { GameEventManager } from "./events/GameEventManager";

import "./assets/iconfont/iconfont.js";

const app = createApp(App);
app.use(Antd);
app.config.globalProperties.$ethers = ethers;

const startUp = async () => {
  for (let i = 0; i < dataModels.length; i++) {
    let dataModal = dataModels[i];
    await dataModal.init();
  }

  app.config.globalProperties.$gameEventListener =
    GameEventManager.getInstance();
  app.config.globalProperties.$message = message;

  Toast.$app = app;

  app.mount("#app");
};

startUp();
