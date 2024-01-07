<template>
  <div class="team-members-module">
    <h2 class="gradient-color">Our Team</h2>
    <p class="team-description">Meet the talented individuals behind our project.</p>
    <a-divider class="divider"/>
    <div class="team-members">
      <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
        <div class="member-image">
          <img :src="member.image" alt="Team Member Image" class="rounded-image"/>
          <div class="member-info">
            <p>{{ member.name }}</p>
            <p class="position">{{ member.position }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const teamMembers = ref([
  {name: "enixlee", position: "Team Leader", image: require('../../assets/welcome/enixlee.jpg')},
  {name: "0x00pluto", position: "Product Manager", image: require('../../assets/welcome/pluto.jpeg')},
  {name: "0xSkipper", position: "Frontend Developer", image: require('../../assets/welcome/Skipper.jpeg')},
  {name: "andor", position: "Blockchain Developer", image: require('../../assets/welcome/andor.jpg')},
  {name: "zzzzzz2004", position: "Blockchain Developer", image: require('../../assets/welcome/zzzzzz2004.jpg')},
  {name: "0xSoren", position: "Designer", image: require('../../assets/welcome/0xSoren.jpg')}
]);
</script>

<style scoped>
.team-members-module {
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

.team-description {
  text-align: center;
  margin-bottom: 1rem;
  color: #555;
}

.team-members {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow: auto;
}

.team-member {
  flex: 0 0 calc(16.666% - 10px);
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
}

.member-image {
  position: relative;
}

.member-image img {
  max-width: 150px;
  height: auto;
  border-radius: 8px;
}

.member-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 10px;
}

.member-info p {
  margin: 0;
}

.position {
  font-size: 14px;
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
