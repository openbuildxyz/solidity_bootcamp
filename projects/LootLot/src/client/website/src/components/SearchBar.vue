<template>
  <div class="search-bar">
    <a-row justify="left" align="middle">
      <a-col :offset="1" :span="1">
        <a-button v-if="showBackButton" @click="funcBack">返回</a-button>
      </a-col>
      <a-col :offset="1" :span="18">
        <a-input-search
          size="large"
          enter-button
          @search="funcOnSearch"
          allowClear
          v-model:value="searchValue"
          placeholder="Input your friend's wallet address and park your car in their parking space"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onUnmounted } from "vue";
import { GameEventGoFriendHome } from "../events/GameEventGoFriendHome";
import { EventBus } from "../plugins/EventBus";
import { walletData } from "../data/WalletData";
import { GO_HOME, REG_ETH_ADDRESS } from "../const/Constants";
import { Toast } from "../plugins/Toast";
import { GameEventWalletAccountChanged } from "../events/GameEventWalletAccountChanged";
import { StringUtil } from "../core/utils/StringUtil";

export default defineComponent({
  name: "SearchBar",

  emits: ["query-and-submit"],

  setup() {
    onBeforeMount(() => {
      EventBus.instance.on(GameEventWalletAccountChanged.eventAsync, onRefresh);
    });

    onUnmounted(() => {
      EventBus.instance.off(
        GameEventWalletAccountChanged.eventAsync,
        onRefresh
      );
    });

    const onRefresh = async () => {
      showBackButton.value = false;
    };

    const searchValue = ref();

    const showBackButton = ref(false);

    const funcBack = () => {
      EventBus.instance.emit(GameEventGoFriendHome.event, GO_HOME);
    };

    const funcOnSearch = async () => {
      let inputValue = "";
      if (StringUtil.isEmpty(searchValue.value)) {
        // Toast.warn("Input nothing");
        // return ;
        inputValue = "0xc8a715389d408A5392A379B5f2dc8DE72154a1aC";
      }
      if (!walletData.isAuth) {
        Toast.warn("SignIn first");
        return;
      }
      if (StringUtil.isEmpty(inputValue)) {
        inputValue = searchValue.value.trim();
      }
      
      if (!REG_ETH_ADDRESS.test(inputValue)) {
        Toast.warn("It's not an address");
        return;
      }

      if (inputValue === walletData.address) {
        Toast.warn(`It's your address.`);
        return;
      }

      showBackButton.value = true;

      EventBus.instance.emit(GameEventGoFriendHome.event, inputValue);
    };

    return {
      showBackButton,
      searchValue,
      funcBack,
      funcOnSearch,
    };
  },
});
</script>

<style scoped>
.search-bar {
  padding: 0.5rem;
  margin-top: 5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border: 1px solid #abdcff;
  border-radius: 0.5rem;
  box-sizing: content-box;
  background-color: #f0faff;
}
</style>
