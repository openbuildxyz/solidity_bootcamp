<template>
  <div class="index">
    <Header class="margin-top"/>
    <div v-if="!isLogin">
      <a-divider/>
      <a-row>
        <a-col :offset="1" :span="22">
          <WelcomePage/>
        </a-col>
      </a-row>
    </div>
    <div v-else>
      <SearchBar/>
      <ParkingList/>
      <CarList/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  onUnmounted,
  onMounted,
} from "vue";
import Header from "./Header.vue";
import ParkingList from "./ParkingList.vue";
import SearchBar from "./SearchBar.vue";
import CarList from "./CarList.vue";
import WelcomePage from "./WelcomePage.vue";

import {walletData} from "../data/WalletData";
import {EventBus} from "../plugins/EventBus";
import {GameEventWalletDisconnect} from "../events/GameEventWalletDisconnect";
import {GameEventWalletConnected} from "../events/GameEventWalletConnected";
import {GameEventWalletAccountChanged} from "../events/GameEventWalletAccountChanged";

export default defineComponent({
  name: "Index",

  components: {WelcomePage, Header, ParkingList, CarList, SearchBar},
  setup() {
    const isLogin = ref(walletData.isAuth);

    onBeforeMount(() => {
      EventBus.instance.on(GameEventWalletConnected.eventAsync, onSignIn);
      EventBus.instance.on(GameEventWalletDisconnect.eventAsync, onSignOut);
      EventBus.instance.on(
          GameEventWalletAccountChanged.eventAsync,
          onAccountChanged
      );
    });

    onMounted(() => {
      if (isLogin.value) {
        EventBus.instance.emit(
            GameEventWalletConnected.event,
            walletData.address
        );
      }
    });

    onUnmounted(() => {
      EventBus.instance.off(GameEventWalletConnected.eventAsync, onSignIn);
      EventBus.instance.off(GameEventWalletDisconnect.eventAsync, onSignOut);
      EventBus.instance.off(
          GameEventWalletAccountChanged.eventAsync,
          onAccountChanged
      );
    });

    const onSignIn = async () => {
      isLogin.value = true;
    };

    const onSignOut = () => {
      isLogin.value = false;
    };

    const onAccountChanged = () => {
    };

    return {
      isLogin,
    };
  },
});
</script>

<style scoped></style>
