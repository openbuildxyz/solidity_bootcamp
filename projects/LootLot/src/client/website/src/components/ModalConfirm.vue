<template>
  <div v-if="showModal">
    <a-modal v-model:open="showModal" :title="modalTitle" @ok="confirm">
      <p>{{ description }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onUnmounted, ref } from "vue";
import { EventBus } from "../plugins/EventBus";
import { GameEventModalOpen } from "../events/GameEventModalOpen";
import { APP_NAME } from "../const/Constants";
import { StringUtil } from "../core/utils/StringUtil";
import { DialogModal } from "../plugins/DialogModal";

export default defineComponent({
  name: "ModalConfirm",

  setup() {
    const showModal = ref(false);
    const modalTitle = ref(APP_NAME);
    const description = ref("");
    let callbackFunc: Function | null = null;

    onBeforeMount(() => {
      EventBus.instance.on(GameEventModalOpen.event, onModalOpen);
    });

    onUnmounted(() => {
      EventBus.instance.off(GameEventModalOpen.event, onModalOpen);
    });

    const onModalOpen = (
      state: boolean,
      title: string,
      desc: string,
      callback: Function
    ) => {
      showModal.value = state;
      if (!StringUtil.isEmpty(title)) modalTitle.value = title;
      if (!StringUtil.isEmpty(desc)) description.value = desc;
      callbackFunc = callback ?? null;
    };

    const confirm = async () => {
      if (callbackFunc) {
        callbackFunc();
      }
      DialogModal.close();
      return Promise.resolve();
    };

    return {
      showModal,
      onModalOpen,
      confirm,
      modalTitle,
      description,
    };
  },
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  color: #1890ff; /* 修改颜色根据需要 */
}
</style>
