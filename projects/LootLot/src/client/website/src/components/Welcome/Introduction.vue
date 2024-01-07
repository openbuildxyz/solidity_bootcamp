<template>
  <div class="welcome-module">
    <div class="image">
      <a-image
          width="70%"
          height="70%"
          :src="require('../../assets/welcome/logo_lotloot_welcome.png')" :preview="false"/>
    </div>
    <div class="content">
      <h2 class="gradient-color">Welcome to LotLoot !</h2>
      <p>
        LotLoot is a classic parking space grabbing game that combines the dual attributes of SocialFi and GameFi.
        Players can log in through social accounts, own multiple cars and 5 parking spaces, and interact with other
        players to earn token revenue.
      </p>
      <a-divider class="divider"/>
      <div class="small-images">
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 1" width="100" height="auto"/>
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 2" width="100" height="auto"/>
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 3" width="100" height="auto"/>
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 4" width="100" height="auto"/>
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 5" width="100" height="auto"/>
        <img :src="require('../../assets/erc20_llt.jpg')" alt="Small Image 6" width="100" height="auto"/>
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 1"/>-->
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 2"/>-->
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 3"/>-->
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 4"/>-->
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 5"/>-->
        <!--        <img src="https://via.placeholder.com/100x100" alt="Small Image 6"/>-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>


.gradient-color {
  background: linear-gradient(to right, #007bff, #19be6b);
  -webkit-background-clip: text;
  color: transparent;
}

.welcome-module {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
  background-color: rgba(240, 240, 240, 0.6);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.image {
  flex: 1;
  padding: 1rem;
}

.image img {
  max-width: 100%;
  height: auto;
}

.content {
  flex: 2;
  padding: 1rem 2rem;
}

h2 {
  font-size: 28px;
  margin-bottom: 1rem;
  font-weight: bold;
}

p {
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.small-images {
  margin-left: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.small-images img {
  max-width: 100px;
  height: auto;
  margin-right: 1rem;
}

.divider {
  height: 2px;
  background: transparent linear-gradient(to right, #2db7f5, #19be6b);
}

</style>
