<template>
  <div class="link-module">

    <div class="content">
      <h2 class="gradient-color">Explore Our NFT Collection</h2>
      <a-divider class="divider"/>
      <p>
        Invest in our unique NFTs crafted by talented artists. Discover our Opensea gallery and buy into the Web3
        revolution. Each NFT is a gateway to a world where art and innovation come together, with ownership
        transparently secured on the blockchain. Explore, acquire, and be part of the future of digital art.
      </p>
      <a href="https://testnets.opensea.io/collection/lotlootcar" class="cta-button" target="_blank">Explore on
        Opensea</a>
    </div>

    <div class="illustration">
      <a-image
          width="70%"
          height="70%"
          :src="require('../../assets/welcome/opensea-car.png')" :preview="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.link-module {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(240, 240, 240, 0.6);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.divider {
  height: 2px;
  background: transparent linear-gradient(to right, #2db7f5, #19be6b);
}

.gradient-color {
  background: linear-gradient(to right, #007bff, #19be6b);
  -webkit-background-clip: text;
  color: transparent;
}

.illustration {
  flex: 1;
  padding: 1rem;
}

.illustration img {
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

.cta-button {

  background: linear-gradient(to right, #007bff, #19be6b);
  /*-webkit-background-clip: text;*/
  /*color: transparent;*/

  display: inline-block;
  padding: 1rem 2rem;
  /*background-color: #007bff;*/
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
</style>
