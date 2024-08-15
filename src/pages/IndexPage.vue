<template>
  <q-page class="page-full">
    <div class="fit column" :class="{'q-px-md':$q.screen.lt.md}">
      <div class="col-1 row justify-center">
        <div class="col col-md-8">
          <MenuPrincipal />
        </div>
      </div>
      <div class="col">
        <VivaGraph />
      </div>
      <div class="col-auto row justify-center">
        <div class="col col-md-8">
          <SmartSearchField @search="onSearch"></SmartSearchField>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import SmartSearchField from "src/components/SmartSearchField.vue";
import MenuPrincipal from "src/components/MenuPrincipal.vue";
import { useGraphStore } from 'src/stores/graph.store.js'
import VivaGraph from "src/components/VivaGraph.vue";
import { useQuasar } from 'quasar';

const graphStore = useGraphStore();
const $q = useQuasar();
defineOptions({
  name: "IndexPage",
});

function onSearch(palavraChave) {
  const camada = "1";
  graphStore.buscar(camada, palavraChave);
}
</script>
<style scoped>
.page-full {
  height: calc(100vh - 50px);
}
</style>