<template>
  <div class="sponsors-module">
    <h2 class="gradient-color">PARTNERS</h2>
    <h4>"Together, we are strong."</h4>
    <div class="sponsor-div">
      <div class="sponsors-carousel">
        <div class="sponsors-list" :style="{ transform: `translateX(${translateX}px)` }">
          <div v-for="(sponsor, index) in sponsors" :key="index" class="sponsor">
            <img :src="sponsor" alt="Sponsor"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

const placeholders = [
  require('../../assets/welcome/ethhk.png'),
  require('../../assets/welcome/bewater.png'),
  require('../../assets/welcome/scroll.png'),
  require('../../assets/welcome/polygon.png'),
]

// 生成40张按顺序重复的图片
const getSequentialImages = () => {
  const sequentialImages = []
  for (let i = 0; i < 40; i++) {
    const index = i % placeholders.length // 计算循环索引
    sequentialImages.push(placeholders[index])
  }
  return sequentialImages
}

const sponsors = ref(getSequentialImages())

const translateX = ref(0)
let intervalId = null
const scrollSpeed = 1

const startScrolling = () => {
  intervalId = setInterval(() => {
    translateX.value -= scrollSpeed
    if (translateX.value < -3000) {
      sponsors.push(sponsors.shift())
      translateX.value = 0
    }
  }, 16)
}

onMounted(() => {
  startScrolling()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.sponsors-module {
  margin-top: 2rem;
  margin-bottom: 1rem;
  background-color: rgba(240, 240, 240, 0.6);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  text-align: center;
}

.sponsor-div {
  background: transparent linear-gradient(to right, rgba(45, 183, 245, 0.6), rgba(25, 190, 107, 0.6));
}

h2 {
  font-size: 28px;
  color: #007bff;
  text-align: center;
  margin-bottom: 1rem;
}

p {
  font-size: 16px;
  margin-bottom: 1rem;
}

.sponsors-carousel {
  overflow: hidden;
}

.sponsors-list {
  display: flex;
  animation: scroll 60s linear infinite;
}

.sponsor {
  flex: 0 0 150px;
  margin: 1rem; /* 添加间距 */
}

.sponsor img {
  max-width: 300px; /* 调整宽度为400px */
  max-height: 112px; /* 调整高度为150px */
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1800px);
  }
}

.divider {
  height: 3px;
  background: transparent linear-gradient(to right, #2db7f5, #19be6b);
}

.gradient-color {
  background: linear-gradient(to right, #007bff, #19be6b);
  -webkit-background-clip: text;
  color: transparent;
}


</style>
