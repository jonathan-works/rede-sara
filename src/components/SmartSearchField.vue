<template>
    <q-input outlined v-model="param" bottom-slots :label="label" :dense="dense" @keydown.enter="search" placeholder="CNPJ, Razão Social, Nome Fantasia, CPF de sócio ou Nome de sócio">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-icon name="search" class="cursor-pointer" @click="search"/>
        </template>
      </q-input>
</template>
<script setup>
import { ref } from "vue";

defineProps(['label','dense'])
const emit = defineEmits(['search'])
const param = ref(null);

function search(){
    emit('search', param)
}

</script>
