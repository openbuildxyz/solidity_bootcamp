<template>
  <div class="carList">
    <div class="list-div">
      <a-divider orientation="left" orientation-margin="10px"
        >My Cars</a-divider
      >

      <a-row justify="left">
        <a-col :span="4" v-if="userCarList.length < 5">
          <a-row justify="space-around" align="middle" class="car-0">
            <a-button size="large" @click="funcFreeMintCar">Buy Car</a-button>
          </a-row>
        </a-col>
        <a-col
          :span="4"
          v-for="item in userCarList"
          :index="item.tokenId"
          class="car-0"
        >
          <a-row justify="left" align="middle">
            <a-col :offset="2" :span="8">
              <div class="car-img">
                <a-image
                  width="50px"
                  height="73px"
                  :src="require('../assets/car.jpg')"
                  :preview="false"
                />
              </div>
            </a-col>
            <a-col :offset="2" :span="8">
              <a-button
                v-if="item.ParkingAddress === 'IDLE'"
                size="large"
                type="primary"
                danger
                @click="onUpgrade(item.tokenId)"
                >Upgrade
              </a-button>
              <a-button
                v-else
                size="large"
                type="primary"
                @click="onUnPackClick(item.tokenId)"
                >Leave
              </a-button>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="2" :span="20">
              <div class="car-info">
                <a-row justify="left" align="middle">
                  <a-col :offset="4" :span="5">
                    <a-image
                      :src="require('../assets/id.png')"
                      :preview="false"
                    />
                  </a-col>
                  <a-col :offset="1" :span="5">
                    <span class="font-color">{{ item.tokenId }}</span>
                  </a-col>
                </a-row>
                <a-row justify="left" align="middle">
                  <a-col :offset="4" :span="5">
                    <a-image
                      :src="require('../assets/erc20_llt_mini.png')"
                      :preview="false"
                    />
                  </a-col>
                  <a-col :offset="1" :span="5">
                    <span class="font-color">{{
                      item.ProspectiveEarnings
                    }}</span>
                  </a-col>
                </a-row>
                <a-row justify="left" align="middle">
                  <a-col :offset="4" :span="5">
                    <a-image
                      :width="25"
                      :height="24"
                      :src="require('../assets/parking.jpg')"
                      :preview="false"
                    />
                  </a-col>
                  <a-col :offset="1" :span="5">
                    <span class="font-color">{{ item.ParkingAddress }}</span>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onUnmounted } from "vue";
import { contractData } from "../data/ContractData";
import { homeData } from "../data/HomeData";
import { playerData } from "../data/PlayerData";
import { walletData } from "../data/WalletData";
import { GameEventBuyCar } from "../events/GameEventBuyCar";
import { GameEventGoFriendHome } from "../events/GameEventGoFriendHome";
import { GameEventUnParkCar } from "../events/GameEventUnParkCar";
import { GameEventWalletAccountChanged } from "../events/GameEventWalletAccountChanged";
import { GameEventWalletConnected } from "../events/GameEventWalletConnected";
import { EventBus } from "../plugins/EventBus";
import { Loading } from "../plugins/Loading";
import { Toast } from "../plugins/Toast";

export default defineComponent({
  name: "CarList",
  setup() {
    onBeforeMount(() => {
      EventBus.instance.on(GameEventGoFriendHome.eventAsync, refreshCar);
      EventBus.instance.on(GameEventWalletConnected.eventAsync, refreshCar);
      EventBus.instance.on(GameEventBuyCar.eventAsync, onCarBought);
      EventBus.instance.on(
        GameEventWalletAccountChanged.eventAsync,
        refreshCar
      );
      EventBus.instance.on(GameEventUnParkCar.eventAsync, onUnPackCar);
    });

    onUnmounted(() => {
      EventBus.instance.off(GameEventGoFriendHome.eventAsync, refreshCar);
      EventBus.instance.off(GameEventWalletConnected.eventAsync, refreshCar);
      EventBus.instance.off(GameEventBuyCar.eventAsync, onCarBought);
      EventBus.instance.off(
        GameEventWalletAccountChanged.eventAsync,
        refreshCar
      );
      EventBus.instance.off(GameEventUnParkCar.eventAsync, onUnPackCar);
    });

    const isHome = ref(true);

    const onCarBought = async ()=>{
      await refreshCar();
      Toast.success(`mint car success.`)
    }

    const refreshCar = async () => {
      const player = await playerData.getPlayerData(walletData.address);
      isHome.value = homeData.isInHome;
      let cars = player
        ? player.cars.map((car) => {
            return {
              tokenId: car.tokenId,
              status: car.status,
              ParkingAddress:
                car.parkingTokenId === 0 ? "IDLE" : car.parkingTokenId,
              url: "0",
              ProspectiveEarnings: 999,
            };
          })
        : [];
      //@ts-ignore
      userCarList.value = cars;
      Loading.close();
    };

    const userCarList = ref([]);

    const funcFreeMintCar = async () => {
      Loading.open();
      try {
        await contractData.carStoreContract.buyCar();
      } catch (e) {
        Loading.close();
        console.error(e);
        Toast.error("Buy car failed");
      }
    };

    const onUnPackClick = async (tokenId: number) => {
      if (!homeData.isInHome) {
        return Promise.resolve();
      }

      try {
        await contractData.lotLootContract.unPark(tokenId);
      } catch (e) {
        console.error(e);
        Loading.close();
        Toast.error(`UnPark failed.`);
      }
    };

    const onUnPackCar = async () => {
      Loading.close();
      await refreshCar();
    };

    const onUpgrade = async () => {
      Toast.warn(`Coming soon`);
      return Promise.resolve();
    };

    return {
      userCarList,
      funcFreeMintCar,
      isHome,
      onUnPackClick,
      onUpgrade,
    };
  },
});
</script>

<style scoped>
.list-div {
  padding: 0.5rem 0.5rem 2rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
  box-sizing: content-box;
  border: 1px solid #8ce6b0;
  background-color: #edfff3;
  /*border: 1px solid black;*/
  /*background-color: #9fe080;*/
}

.list-item-margin {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}

.list-item-text-align {
  text-align: left;
}

.car-img {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border: 1px solid #abdcff;
  border-radius: 0.5rem;
  box-sizing: content-box;
  background-color: #f0faff;
}

.car-0 {
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  padding-bottom: 2.2rem;
  border: 1px solid #8ce6b0;
  border-radius: 0.5rem;
  height: 8rem;
  box-sizing: content-box;
  background-color: #edfff3;
}

.car-info {
  /*left: 15%;*/
  /*width: 70%;*/
  padding: 0.1rem;
  border: 1px solid #ffd77a;
  border-radius: 0.5rem;
  box-sizing: content-box;
  background-color: #fff9e6;
  text-align: left;
}

.car-1 {
  border: 1px solid #abdcff;
  border-radius: 0.5rem;
  height: 8rem;
  box-sizing: content-box;
  background-color: #f0faff;
}

.car-2 {
  border: 1px solid #ffd77a;
  border-radius: 0.5rem;
  height: 8rem;
  box-sizing: content-box;
  background-color: #fff9e6;
}

.carMargin {
  margin: 0.25rem 0.5rem;
}

.test01 {
  background-color: red;
}
</style>
