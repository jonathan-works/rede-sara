<template>
  <div ref="gh" class='graph relative-position fit'></div>
</template>

<script setup>
import Viva from 'vivagraphjs';
import { onMounted, ref } from 'vue';
import { useGraphStore } from 'src/stores/graph.store.js'

const props = defineProps(['graph', 'graphics']);
const graphStore = useGraphStore();
const gh = ref(null);

const updateRenderer = () => {
  graphStore.layout = Viva.Graph.Layout.forceDirected(graphStore.graph, {
		   springLength : graphStore.springLength, //170, //140, //80,
		   springCoeff : 0.0002, //0.0002,
		   dragCoeff : 0.02, 
		   gravity : -1.0, //-1.2, 
		   theta : 0.8
	});
	graphStore.renderer = Viva.Graph.View.renderer(graphStore.graph, {
			graphics : graphStore.graphics,
			layout: graphStore.layout,
			container  : gh.value
		});
	graphStore.renderer.run();
	graphStore.geom = Viva.Graph.geom();
};

onMounted(() => {
  updateRenderer(props.graph, props.graphics);
});

defineExpose({
  updateRenderer
});

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


