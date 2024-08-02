<template>
  <div ref="gh" class='graph relative-position fit'></div>
</template>

<script setup>
import Viva from 'vivagraphjs'
import { onMounted, ref } from 'vue'

const gh = ref(null)

var graphGenerator = Viva.Graph.generator();
var graph = graphGenerator.grid(10, 10);

function updateRenderer(graph) {
  var graphics = Viva.Graph.View.webglGraphics()
  var renderer = Viva.Graph.View.renderer(graph, {
    graphics,
    container: gh.value
  });
  renderer.run();
}

onMounted(() => {
  updateRenderer(graph);
})
</script>

<style lang="scss">
.graph {
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>


