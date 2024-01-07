<template>
  <div class="roadmap-activations-module">
    <h2 class="gradient-color">Roadmap & Activations</h2>
    <div class="steps-content">
      <div class="steps">
        <a-steps :current="current" :direction="direction" @change="onChange" class="custom-steps">
          <a-step v-for="(item, index) in steps" :key="index" :title="item.title"
                  :description="item.description"></a-step>
        </a-steps>
      </div>
      <div class="step-description">
        <a-divider class="divider"/>
        <p>{{ steps[current].content01 }}</p>
        <p>{{ steps[current].content02 }}</p>
        <p>{{ steps[current].content03 }}</p>
      </div>
      <div class="step-image">
        <a-image
            width="70%"
            height="70%"
            :src="require('../../assets/welcome/roadmap.png')" :preview="false"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const current = ref(0);
const direction = ref('vertical');

const steps = [
  {
    title: 'Product development and market research',
    description: '2023 Q4',
    content01: '1. Develop and release a basic version of the LotLot platform, including but not limited to auction, trading, community interaction, and other function;',
    content02: '2. Conduct in-depth market research to understand target user needs and industry trends, and optimize products to meet market demands;',
    content03: '3. Establish and improve a network of partners to lay the foundation for expanding market share in the future.',
  },
  {
    title: 'Market promotion and community construction',
    description: '2024 Q1',
    content01: '1. Promote the LotLoot platform through online, offline activities, and social media channels. Get more media exposure;',
    content02: '2. Establish and operate the LotLoot community, attract more users to participate, and improve brand awareness;',
    content03: '3. To enhance LotLoot\'s influence in the industry through cooperation and sponsorship, we need strategic partnerships.',
  },
  {
    title: 'Product Upgrade and Business Expansion',
    description: '2024 Q2',
    content01: '1. Based on user feedback and market trends, upgrade the LotLot platform to add new features or optimize existing ones;',
    content02: '2. Expand business areas, such as introducing more types of digital assets, conducting digital collection auctions, etc;',
    content03: '3. Collaborate with more industry enterprises to jointly promote the development of the digital collectible market',
  },
  {
    title: 'Continuous optimization & strategic cooperation',
    description: '2024 Q3',
    content01: '1. Continuously monitor market dynamics and user needs, and conduct long-term optimization and updates on the LotLot platform;',
    content02: '2. Deeply cooperate with more strategic partners to jointly promote the growth of the digital collectible market;',
    content03: '3. At the appropriate time, consider expanding LotLot to the international market and providing digital collectible services to global users.',
  }
];

const onChange = (newCurrent: number) => {
  current.value = newCurrent;
};
</script>

<style scoped>
.roadmap-activations-module {
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(240, 240, 240, 0.6);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

h2 {
  font-size: 28px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.steps-content {
  display: flex;
  align-items: center;
}

.steps {
  flex: 1;
  text-align: center;
}

.custom-steps {
  width: 100%;
  max-width: 600px;
}

.step-description {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-description p {
  font-size: 18px;
  color: #333;
  text-align: left;
}

.step-image {
  flex: 1;
  text-align: center;
}

.step-image img {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
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