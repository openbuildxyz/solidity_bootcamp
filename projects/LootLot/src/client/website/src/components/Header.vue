<template>
  <div class="header">
    <a-row>
      <a-col :offset="1" :span="3">
        <a-image
            class="logo"
            :src="require('../assets/logo.jpg')"
            :preview="false"
        />
      </a-col>
      <a-col v-if="!isLogin" :offset="16" :span="2">
        <a-button @click="connectWallet" type="primary" ghost size="large" class="gradient-color sign-button">
          <wallet-outlined class="sign-button-logo"/>
          <span>Sign In</span>
        </a-button>
      </a-col>
      <a-col v-else :offset="12" :span="8">
        <a-row align="middle">
          <a-col :offset="8" :span="2" class="twitter-logo">
            <a href="https://www.twitter.com">
              <a-image
                  width="70%"
                  height="70%"
                  :src="require('../assets/twitter.png')"
                  :preview="false"
                  @click="onTwitterLogin"
              />
            </a>
          </a-col>
          <a-col
              class="metamask-icon"
              :offset="1"
              :span="2"
              @click="onWalletClicked"
          >
            <IconSvg icon-name="#icon-metamask"/>
          </a-col>
          <a-col class="wallet-address" :span="4" @click="onWalletClicked">
            {{ userAddress }}
          </a-col>
          <a-col :offset="1" :span="2">
            <a-image
                width="70%"
                height="70%"
                :src="require('../assets/erc20_llt.jpg')"
                :preview="false"
            />
          </a-col>
          <a-col :span="3"> {{ balanceOfLLT }} LLT</a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onBeforeMount, onUnmounted} from "vue";
import {StringUtil} from "../core/utils/StringUtil";
import {EventBus} from "../plugins/EventBus";
import {GameEventWalletConnected} from "../events/GameEventWalletConnected";
import {GameEventWalletDisconnect} from "../events/GameEventWalletDisconnect";
import {GameEventWalletChainChanged} from "../events/GameEventWalletChainChanged";
import {ChainID} from "../const/enum/Chain";
import {walletData} from "../data/WalletData";
import {Toast} from "../plugins/Toast";
import {GameEventWalletAccountChanged} from "../events/GameEventWalletAccountChanged";
import IconSvg from "../components/IconSvg.vue";
import {contractData} from "../data/ContractData";
import {playerData} from "../data/PlayerData";
import {ethers} from "ethers";
import {DialogModal} from "../plugins/DialogModal";
import {WalletOutlined} from '@ant-design/icons-vue';
// import { particleData ,SocialLoginType} from "../data/ParticleData";

export default defineComponent({
  name: "Header",

  components: {WalletOutlined, IconSvg},
  setup() {
    const isLogin = ref(walletData.isAuth);
    const balanceOfLLT = ref("0");
    const userAddress = ref(
        !StringUtil.isEmpty(walletData.address)
            ? walletData.shortAddress
            : "Sign In"
    );

    const connectWallet = async () => {
      const isChainValid = await walletData.isChainValid();
      if (!isChainValid) {
        // Toast.error("Please switch to the Scroll Sepolia network");
        // return Promise.resolve();
        return walletData.switchNetwork();
      }
      if (!StringUtil.isEmpty(walletData.address)) {
        Toast.warn("Wallet already connected");
        return Promise.resolve();
      }
      try {
        await walletData.connectWallet();
      } catch (e) {
        Toast.error("Connect wallet failed");
        console.error(e);
      }
    };

    onBeforeMount(() => {
      EventBus.instance.on(
          GameEventWalletConnected.eventAsync,
          onWalletConnect
      );
      EventBus.instance.on(
          GameEventWalletDisconnect.eventAsync,
          onWalletDisConnect
      );
      EventBus.instance.on(
          GameEventWalletChainChanged.eventAsync,
          onChainChanged
      );
      EventBus.instance.on(
          GameEventWalletAccountChanged.eventAsync,
          onAccountChange
      );
    });

    onUnmounted(() => {
      EventBus.instance.off(
          GameEventWalletConnected.eventAsync,
          onWalletConnect
      );
      EventBus.instance.off(
          GameEventWalletDisconnect.eventAsync,
          onWalletDisConnect
      );
      EventBus.instance.off(
          GameEventWalletChainChanged.eventAsync,
          onChainChanged
      );
      EventBus.instance.off(
          GameEventWalletAccountChanged.eventAsync,
          onAccountChange
      );
    });

    const onWalletConnect = async () => {
      userAddress.value = walletData.shortAddress;
      isLogin.value = walletData.isAuth;

      await refreshLLT();
    };

    const onWalletDisConnect = () => {
      userAddress.value = "Sign In";
      isLogin.value = false;
    };

    const onChainChanged = (chainId: any) => {
      // TODO
      if (chainId === ChainID.Mumbai || chainId === ChainID.Scroll) {
        onWalletConnect();
      }
    };

    const onAccountChange = (account: string) => {
      if (!StringUtil.isEmpty(account)) {
        onWalletConnect();
      }
    };

    const refreshLLT = async () => {
      const player = await playerData.getPlayerData(walletData.address);
      let balance = ethers.constants.Zero;
      if (player) {
        try {
          balance = await player.balance();
        } catch (e) {
          console.error(e);
        }
      }

      const token = await contractData.lltTokenContract.balanceOf(
          walletData.address
      );
      balanceOfLLT.value = ethers.utils.formatEther(balance.add(token));
    };

    const onWalletClicked = async () => {
      DialogModal.open("Do your want to sign out?", async () => {
        await walletData.disconnect();
      });
    };

    const onTwitterLogin = async () => {
      // await particleData.loginWithSocialAccount(SocialLoginType.Github);
    }

    return {
      isLogin,
      userAddress,
      connectWallet,
      balanceOfLLT,
      onWalletClicked,
      onTwitterLogin
    };
  },
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 204, 0.9);
  padding: 10px 0;
  text-align: center;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.logo-size {
  /*background-color: #1890ff;*/
  /*width: 50%;*/
  /*height: 50%;*/
}

.logo {
  width: 50%;
  height: 50%;
}

.metamask-icon {
  cursor: pointer;
}

.wallet-address {
  cursor: pointer;
}

.sign-button-logo {
  color: #4096ff;
}

.gradient-color {
  background: linear-gradient(to right, #2db7f5, #19be6b);
  -webkit-background-clip: text;
  color: transparent;
}

.sign-button {
  font-weight: bold;
  border: 2px solid #2db7f5;
}

.twitter-logo{
  cursor: pointer;
}
</style>
