<template>
    <div class="row q-py-md justify-center q-gutter-md" :class="{'justify-between q-gutter-sm':$q.screen.gt.lg}">
        <q-btn outline color="white" text-color="grey-10" icon="fa fa-bars" @click="menuStore.menu_botao">
            <q-tooltip>
                Abre Menu com opções
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-play" @click="menuStore.menu_rendererAtivarParar(true, true)">
            <q-tooltip>
                Ativar layout (Barra de Espaço)
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-stop" @click="menuStore.menu_rendererAtivarParar(false, true)">
            <q-tooltip>
                Parar layout (Barra de Espaço)
            </q-tooltip>
        </q-btn>
        <q-btn outline color="white" text-color="grey-10" icon="fa fa-search-plus" @click="menuStore.menu_zoomin">
            <q-tooltip>
                Aumenta visualização. A roda do mouse também faz isso. Pressionando SHIFT+click aumenta apenas o tamanho das ligações.
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-search-minus" @click="menuStore.menu_zoomout">
            <q-tooltip>
                Diminui visualização.  A roda do mouse também faz isso. Pressionando SHIFT+click diminui apenas o tamanho das ligações.
            </q-tooltip>
        </q-btn>
        <q-btn outline color="white" text-color="grey-10" icon="fa fa-compress" @click="menuStore.reset">
            <q-tooltip>
               Reinicia escala de visualização
            </q-tooltip>
        </q-btn>
        <q-btn outline color="white" text-color="grey-10" icon="fa fa-undo" @click="menuStore.menu_inserirDesfazer">
            <q-tooltip>
                Desfaz última inserção de itens (CTRL+Z)
            </q-tooltip>
        </q-btn>
        <q-btn  outline color="white" text-color="grey-10" icon="fa fa-user-plus" @click="menuStore.menu_inserir">
            <q-tooltip>
                Inserir CNPJ ou CPF do Banco de Dados (Tecla I)
            </q-tooltip>
        </q-btn>
        <q-btn  outline color="white" text-color="grey-10" icon="fa fa-newspaper" @click="menuStore.menu_dados">
            <q-tooltip>
                Exibir Dados do Item (D). SHIFT+Click ou SHIFT+D abre os dados de CNPJ em nova aba.
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-layer-group" @click="menuStore.menu_incluir1Camada('')">
            <q-tooltip>
                Expande Vínculos Societários em Camada 1 (Tecla 1)
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" @click="menuStore.menu_botao_caminhos('')">
            <img src="/imagem/code-fork.png" alt="caminhos" class="botaosuperior" width="18" height="18">
            <q-tooltip>
                Procura caminhos entre itens selecionados no gráfico
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-folder-open" @click="menuStore.menu_botaoAbre">
            <q-tooltip>
                Adiciona última visualização salva no navegador com o botão ao lado. Pressionando SHIFT pode se escolher o nome do conjunto.
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-save" @click="menuStore.menu_botaoSalva">
            <q-tooltip>
                Salva a visualização atual no navegador. Pressionando SHIFT pode se definir nome do conjunto.
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-file-excel" @click="menuStore.menu_exportaExcel(false)">
            <q-tooltip>
                Salva arquivo Excel com dados dos itens da tela
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-globe" @click="menuStore.menu_exportaArquivo(false, 'osm')">
            <q-tooltip>
                Abre endereços de cnpjs com OpenStreetMap
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-paste" @click="menuStore.menu_colaClip">
            <q-tooltip>
                (CTRL+V) COLA itens da Área de Transferência da RedeCNPJ de outra aba
            </q-tooltip>
        </q-btn>
        <!-- todo -->
        <!-- <button id="drag_area"  ondragstart="drag_handler(event);" draggable="true" onclick="javascript:menu_copiaClip();" ondblclick="javascript:menu_copiaItensParaOutraAba(event.shiftKey, true);" title="COPY: CLICK SIMPLES para copiar para a Área de Transferência da RedeCNPJ (CTRL+C), para ser colada em outra aba. Dê CLICK DUPLO para COPIAR os itens selecionados para NOVA ABA já aberta por SHIFT+DUPLO CLICK, tecla A ou SHIFT+A; SHIFT+DUPLO CLICK copia os itens para uma NOVA ABA; DRAG: Arraste este botão para outra Aba de Rede para copiar os itens selecionados."><i class="fa fa-copy"></i>/<i class="fa fa-hand-rock" aria-hidden="true"></i></button> -->
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-copy" >
            <q-tooltip>
                COPY: CLICK SIMPLES para copiar para a Área de Transferência da RedeCNPJ (CTRL+C), para ser colada em outra aba. Dê CLICK DUPLO para COPIAR os itens selecionados para NOVA ABA já aberta por SHIFT+DUPLO CLICK, tecla A ou SHIFT+A; SHIFT+DUPLO CLICK copia os itens para uma NOVA ABA; DRAG: Arraste este botão para outra Aba de Rede para copiar os itens selecionados.
            </q-tooltip>
        </q-btn>
        <q-btn v-if="$q.screen.gt.sm" outline color="white" text-color="grey-10" icon="fa fa-trash" @click="menuStore.menu_excluirTudo">
            <q-tooltip>
                Apaga TODOS os itens da tela. Para apagar apenas os itens selecionados, pressione a tecla DELETE. Para desfazer a última inserção, pressione CTRL+Z.
            </q-tooltip>
        </q-btn>
    </div>
</template>
<script setup>
import { useMenuStore } from 'src/stores/menu.store.js';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const menuStore = useMenuStore();
</script>