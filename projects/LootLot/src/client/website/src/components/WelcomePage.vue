<template>
  <Introduction/>
  <OpenSea/>
  <Youtube/>
  <RoadMap/>
  <Team/>
  <Partner/>
  <Link/>
</template>


<script lang="ts">
import {defineComponent} from "vue";
import Introduction from "../components/Welcome/Introduction.vue";
import OpenSea from "../components/Welcome/OpenSea.vue";
import Youtube from "../components/Welcome/Youtube.vue";
import RoadMap from "../components/Welcome/RoadMap.vue";
import Team from "../components/Welcome/Team.vue";
import Partner from "../components/Welcome/Partner.vue";
import Link from "../components/Welcome/Link.vue";

export default defineComponent({
  name: "WelcomePage",
  components: {Link, Partner, Introduction, OpenSea, Youtube, RoadMap, Team},
})
</script>




