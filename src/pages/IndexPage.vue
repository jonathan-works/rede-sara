<template>
  <q-page class="page-full">
    <viva-graph />
  </q-page>
</template>

<script setup>
import VivaGraph from 'components/VivaGraph.vue';

defineOptions({
  name: 'IndexPage'
});

</script>
<style scoped>
.page-full{
  height: calc(100vh - 50px);
}
</style>