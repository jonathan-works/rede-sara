<template>
  <q-page class="page-full">
    <div class="flex justify-center">
      <MenuPrincipal />
    </div>
    <VivaGraph />
  </q-page>
</template>

<script setup>
import VivaGraph from 'src/components/VivaGraph.vue';
import MenuPrincipal from 'src/components/MenuPrincipal.vue';

defineOptions({
  name: 'IndexPage'
});

</script>
<style scoped>
.page-full{
  height: calc(100vh - 50px);
}
</style>