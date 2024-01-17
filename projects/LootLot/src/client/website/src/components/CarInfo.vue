<template>
  <div class="car-info">
    <a-row justify="left" align="middle">
      <a-col :offset="4" :span="5">
        <a-image
            :src="require('../assets/id.png')"
            :preview="false"
        />
      </a-col>
      <a-col :offset="1" :span="5">
        <span class="font-color">xxx</span>
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
        <span class="font-color">123.001</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "CarInfo"
}
</script>

<style scoped>
.car-info {
  margin-top: 20rem;
  border: 1px solid #ffd77a;
  border-radius: 0.5rem;
  box-sizing: content-box;
  background-color: #fff9e6;
  text-align: left;
}
</style>