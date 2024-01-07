<template>
  <div class="game-rules-module">
    <div class="content">
      <h2 class="gradient-color">Game Rules</h2>
      <a-divider class="divider"/>
      <p>
        Parking Space and Car Rules: Each player has 5 parking spaces, with one parking space for their own use, and the
        remaining 4 parking spaces can be used by other players. When a car is parked in a space, it generates token
        income every second based on the car's quality. The income is capped at 24 hours, after which the car needs to
        be moved to collect the earnings. The car's quality and income rate can be upgraded by spending tokens. </p>
    </div>
    <div class="video">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/WsRujp43jzY" frameborder="0"
              allowfullscreen></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.game-rules-module {
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

.content {
  flex: 1;
  padding: 1rem;
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

.video {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

iframe {
  width: 100%;
  max-width: 560px;
  height: 315px;
}

.gradient-color {
  background: linear-gradient(to right, #007bff, #19be6b);
  -webkit-background-clip: text;
  color: transparent;
}

.divider {
  height: 3px;
  background: transparent linear-gradient(to right, #2db7f5, #19be6b);
}

</style>
