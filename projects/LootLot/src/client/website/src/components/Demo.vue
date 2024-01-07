<template>
  <div class="demo">
    <h1>DataValue = {{ DataValue }}</h1>
    <a-button @click="changeDataValue">Change DataValue</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onUnmounted } from "vue";
import { EventBus } from "../plugins/EventBus";

export default defineComponent({
  name: "Demo",
  setup() {
    const DataValue = ref("111");

    const changeDataValue = () => {
      DataValue.value = "222!";
    };

    const onTestEvent = (p1: any, p2: any, p3: any) => {
      console.log("test event params", p1, p2, p3);
    };

    // beforeMount hook
    // 生命周期: onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted
    onBeforeMount(() => {
      console.log("DemoComponents beforeMount hook");

      EventBus.instance.on("This is a test Event", onTestEvent);

      setTimeout(() => {
        EventBus.instance.emit(
          "This is a test Event",
          "param1",
          2,
          new Object()
        );
      }, 3000);
    });

    onUnmounted(() => {
      EventBus.instance.off("This is a test Event", onTestEvent);
    });

    return {
      DataValue,
      changeDataValue,
    };
  },
});
</script>

<style scoped></style>
