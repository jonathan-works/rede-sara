import { defineStore } from 'pinia';
import { useGraphStore } from 'src/stores/graph.store.js';

import useNotify from 'src/composable/UseNotify.js';
import { ref } from 'vue';

const notify = useNotify();
// export const useMenuStore = defineStore('menu', {
//   state: () => ({
//     menu: null,
//   }),
//   actions: {
//     menu_botao(event) {
//         event.preventDefault();
//         // menu funciona no chrome do android mas não no firefox (não fecha o menu)
//         if (graphStore.mobile) {
//             graphStore.showMenu(7,80);
//         } else {
//             graphStore.showMenu(7,30);
//         }
//         setTimeout(function(){
//             document.addEventListener(graphStore.eventclick, menuOnClick, false);
//         },1000);
//         event.preventDefault();
//         return false;
//     },
//     menu_rendererAtivarParar(bAtivar, bMostraMensagem){
//       return graphStore.menu_rendererAtivarParar(bAtivar, bMostraMensagem)
//     },
//     menu_zoomin(event) {
//       const { shiftKey, ctrlKey } = event;
//       const teclaShift = shiftKey;
//       const teclaCtrl = ctrlKey;
//       //this.menuOnClick(); //firefox no android, não está fechando o menu
//       if (teclaCtrl) {
//         return;
//       }
//       if (teclaShift) {
//         return this.menu_configurar_springLength(1);
//       }
//       var vezes = graphStore.mobile?6:3;
//       var escalamax = graphStore.mobile?8:2;
//       if (graphStore.renderer.getTransform().scale>escalamax) {
//         return;
//       }
//       for(var k=0; k<vezes; k++) {
//         var escala = graphStore.renderer.zoomIn();
//         if (escala>escalamax) {
//           break;
//         }
//       }
//     },
//     menu_zoomout(event) {
//       const { shiftKey, ctrlKey } = event;
//       const teclaShift = shiftKey;
//       const teclaCtrl = ctrlKey;
//       //menuStore.menuOnClick(); //firefox no android, não está fechando o menu
//       if (teclaCtrl) {
//         return;
//       }
//       if (teclaShift) {
//         return menuStore.menu_configurar_springLength(-1);
//       }
//       var vezes = graphStore.mobile?6:2;
//       for(var k=0; k<vezes; k++) {
//         var escala = graphStore.renderer.zoomOut();
//       }
//     },
//     menuOnClick(e){
//       //devido a inconsistência no firefox e chrome no android, foi colocado menuOnClick(); antes de todos os comandos do menu
//       this.hideMenu();
//       document.removeEventListener(graphStore.eventclick, menuOnClick);
//       //window.scrollTo(0,0); //ttt
//     },
//     hideMenu(){
//       //menu.classList.contains('show-menu') //para verificar
//         this.menu.classList.remove('show-menu');
//     },
//     menu_configurar_springLength(zoomInOut) {
//       var tamanho = graphStore.layout.simulator.springLength();
//       if (zoomInOut==-1) {
//         graphStore.layout.simulator.springLength(tamanho*0.9);
//         graphStore.springLength = tamanho*0.9;
//       } else if (zoomInOut==1) {
//         graphStore.layout.simulator.springLength(tamanho*1.1);
//         graphStore.springLength = tamanho*1.1;
//       } else {
//         var parametro = prompt('Digite o comprimento da ligação (valor padrão ' + graphStore.springLength + ')', tamanho);
//         if (parametro) {
//           graphStore.layout.simulator.springLength(parametro);
//           graphStore.springLength = parametro;
//         }
//       }
//       graphStore.menu_rendererAtivarParar(true, false); //para atualizar tela
//     },
//     reset(){
//       graphStore.gparam.renderer.reset();
//     },
//     menu_inserirDesfazer(){
//       graphStore.menu_inserirDesfazer();
//     },
//     menu_inserir(textoDefault, teclaShift, teclaCtrl){
//       graphStore.menu_inserir(textoDefault, teclaShift, teclaCtrl);
//     },
//     menu_dados(bNovaJanela, idNo){
//       graphStore.menu_dados(bNovaJanela, idNo);
//     },
//     menu_incluir1Camada(){
//       graphStore.menu_incluir1Camada();
//     },
//     menu_botao_caminhos() {
//       if (graphStore.idNosSelecionados.size<2) {
//         notify.error('Para usar a rotina de caminhos, deve haver ao menos dois itens selecionados. Faça shift+click para selecionar mais itens.');
//         return false;
//       }
//       var camada = prompt('Digite a camada a procurar. A camada é a partir de cada item, por isso pode encontrar caminhos até o dobro de camada. O valor máximo é 5. Se não encontrar caminho com os itens no gráfico, procura mais dados no servidor.', 3);
//       if (camada===null) {
//         return false;
//       }
//       camada = parseInt(camada); 
//       if (!camada) {
//         return
//       }
//       if (camada>5) {
//         alert('Utilize camada abaixo de 5');
//         return false;
//       }
//       graphStore.menu_caminhos(camada, '', false);
//     },
//     menu_botaoAbre(bshift) {
//       this.menu_carregaJSONNavegador(bshift ? '': 'salvo_pelo_botao');
//     },
//     menu_carregaJSONNavegador(nomeIn) {
//       var jsonDados;
//       var arquivosLocais = JSON.parse(localStorage.getItem('jsons'));
//       if (!arquivosLocais || (Object.keys(arquivosLocais).length==0)) {
//         //arquivosLocais = {};
//         alert('Nâo há arquivos tipo JSON salvos no navegador!');
//         return;
//       }
//       var ultimoNome = '';
//       var tmensagem = 'Digite um nome para carregar. Os seguintes grupos estão na memória: \n';
      
//       if (nomeIn) {
//         idArquivo = nomeIn;
//       } else {
//         for (let nome of Object.keys(arquivosLocais))  {
//           tmensagem += nome + '\n';
//           ultimoNome = nome;
//         }
//         idArquivo =  prompt(tmensagem, ultimoNome);
//         if (!idArquivo) {
//           return;
//         }
//       }
    
//       var data = arquivosLocais[idArquivo];
//       if (!data) {
//         notify.error('Não localizou '+ idArquivo + ' no navegador.');
//         return;
//       }
//       graphStore.inserirJson(data, ' Carregou no navegador: ' + idArquivo + '. ', true);
//     },
//     menu_botaoSalva(bshift) { //xxx
//       var r = this.menu_salvaJSONNavegador(bshift? '': 'salvo_pelo_botao');
//       if (r) {
//         notify.success('Os itens foram salvos no navegador.');
//       }
//     },
//     menu_salvaJSONNavegador(nomeIn) { //xx5
//       var jsonDados;
//       var ultimoNome = ''
//       jsonDados = graphStore.getRedeNosLigacoes();
//       if (jsonDados.no.length==0) {
//         alertify.error('Não há itens para exportar.');
//         return false;
//       }
//       var arquivosLocais = JSON.parse(localStorage.getItem('jsons'));
      
//       if (nomeIn) {
//         idArquivo = nomeIn;
//       } else {
//         var tmensagem = 'Digite um nome para salvar no navegador.';
//         if (arquivosLocais) {
//           tmensagem += 'Os seguintes já estão na memória: \n';
//           for (let nome of Object.keys(arquivosLocais))  {
//             tmensagem += nome + '\n';
//             ultimoNome = nome;
//           }
//         }
//         if (!ultimoNome) {
//           ultimoNome = 'rede_local';
//         }	
//         idArquivo = prompt(tmensagem, ultimoNome);
//         if (!idArquivo) {
//           return false;
//         } else if (Object.keys(arquivosLocais).includes(idArquivo)) {
//           var resp = confirm('O nome ' + idArquivo + ' já está sendo usado. Deseja reescrever?');
//           if (!resp) {
//             return false;
//           }
//         }	
//       }
        
//       if (!arquivosLocais) {
//         arquivosLocais = {};
//         arquivosLocais[idArquivo] = JSON.parse(JSON.stringify(jsonDados));
//       } else {
//         arquivosLocais[idArquivo] = JSON.parse(JSON.stringify(jsonDados));
//       }
//       localStorage.setItem('jsons', JSON.stringify(arquivosLocais));
//       return true;
//     },
//     menu_exportaExcel(bSoSelecionados) {
//       menu_exportaArquivo(bSoSelecionados, 'xlsx');
//     },
//     menu_exportaArquivo(bSoSelecionados, tipo, jsonIn) {
//       //jsonIn - se informado, ignora o parametro bSoSelecionados
//       var jsonDados, url;
//       if (jsonIn){ 
//         jsonDados = jsonIn;
//       } else {
//         jsonDados = graphStore.getRedeNosLigacoes(bSoSelecionados);
//       }
//       if (jsonDados['no'].length==0) {
//         notify.error('Não há itens para exportar.');
//         return;
//       }
//       if (tipo=='xlsx') {
//         url = 'dadosemarquivo/xlsx';
//       } else if (tipo=='anx') {
//         url = 'dadosemarquivo/anx';
//       } else if (tipo=='osm') {
//         if (jsonDados['no'].length>10) {
//           alert('Se houver mais de ' + graphStore.inicio.geocode_max + ' endereços, serão utilizados somente as coordenadas do município dos cnpjs. A api de geolocalização de endereço só é usada com poucos itens, devido à lentidão. Se quiser um mapa com localização precisa, use a rotina com um gráfico menor.');
//         } else {
//           notify.warning('A rotina de geolocalização usa a api do OpenStreetMaps e irá demorar (1 segundo por endereço).'); 
//         }
//         //url = 'dadosemarquivo/osm';
//         url = 'mapa'
//       } else if (tipo=='json') {
//         url = ''; //'selecao_de_itens';
//       } else {
//         return;
//       }
//       graphStore.openWindowWithPost(jsonDados, url);
//       //iframeAuxiliar.exportaSoSelecionados = bSoSelecionados;
//     },
//     menu_colaClip(){
//       graphStore.menu_colaClip();
//     },
//     drag_handler(ev) {
//       ev.dataTransfer.setData("rede_json", JSON.stringify(graphStore.getRedeNosLigacoes(true, null, true))); //terceiro parametro true=bsemposicao
//       var texto = [...graphStore.idNosSelecionados].join('\n');
//       ev.dataTransfer.setData("text/plain", texto);
      
//       var linksArray = [];
//       for (let item of graphStore.idNosSelecionados) {
//         if (item.startsWith('LI_')) { 
//           linksArray.push(item.substr(3));
//         }
//       }
//       if (linksArray.length>0) {
//         ev.dataTransfer.setData("text/x-moz-url", linksArray.join('\n'));
//         ev.dataTransfer.setData("text/uri-list", linksArray.join('\n'));	
//       } else {
//         ev.dataTransfer.setData("text/uri-list", base + 'grafico/1/'+ texto.replaceAll('\n', ';')); //arrastando para uma outra aba que não seja da redecnpj, abre o gráfico dos itens selecionados
//       }
//       return;
//       /*
//       if (graphStore.idnoSelecionado.startsWith('LI_')) { 
//         texto = graphStore.idnoSelecionado.substr(3);
//         ev.dataTransfer.setData("text/x-moz-url", texto);
//         ev.dataTransfer.setData("text/uri-list", texto);
//       } else {
//         ev.dataTransfer.setData("text/uri-list", base + 'grafico/1/'+ texto.replaceAll('\n', ';')); //arrastando para uma outra aba que não seja da redecnpj, abre o gráfico dos itens selecionados
//       } 
//       */
//     },
//     menu_copiaClip(){
//       graphStore.menu_copiaClip();
//     },
//     menu_copiaItensParaOutraAba(bNovaJanela, bFocusNoDestino) { 
//       //cria nova aba (ou não) para copiar itens selecionados. Se não criar nova aba, copia para a última aba selecionada
//       //quando cria uma aba nova (filha), o focus necessariamente fica na aba filha. O parâmetro bFocusNoDestino só funciona quando a aba filha já existe
//       var jsonDados = graphStore.getRedeNosLigacoes(true, null, true);
//       if (!bNovaJanela) {
//         if (!graphStore.abaFilha || !graphStore.abaFilha.inserirJson || graphStore.abaFilha.closed ) {
//           if (!confirm('Não encontrou uma Aba "Filha" aberta. Deseja abrir uma nova aba com os itens selecionados?')) {
//             return;
//           }
//           bNovaJanela = true;
//         }
//       }
//       if (bNovaJanela) {
//         graphStore.abaFilha = window.open(base); 
//       }
//       var tempo = bNovaJanela ? 500 : 10;
//       //graphStore.abaFilha.graphStore.inserirJson(jsonDados, 'itens copiados'); //neste momento a função ainda não foi criada... precisa de um delay
//       setTimeout(() => {
//             copiarItemSelecionadosParaAbaFilha(bNovaJanela, bFocusNoDestino)
//           }, tempo
//       );
//     },
//     copiarItemSelecionadosParaAbaFilha(bNovaJanela, bFocusNoDestino) { 
//       //ativado por duplo click no botão drag 
//       //copia itens selecionados para nova janela aberta por SHIFT+A
//       if (!graphStore.abaFilha || graphStore.abaFilha.closed || !graphStore.abaFilha.inserirJson  ) { //esta checagem é redundante??
//         notify.error('Não há outra janela aberta recentemente. Use SHIFT+DUPLO CLICK no botão COPY ou a tecla SHIFT+A para criar uma nova ABA VAZIA ou a tecla A para criar nova aba com os itens selecionados.');
//         return;
//       }
//       var jsonDados = graphStore.getRedeNosLigacoes(true, null, true); //pega itens selecionados
//       try {
//         graphStore.abaFilha.graphStore.inserirJson(jsonDados, 'itens copiados da Aba "Mãe"', true); 
//         if (bNovaJanela) {
//           graphStore.abaFilha.notify.warning('Pressionando o botão COPY na Aba "Mãe" copiará outros itens para esta Aba "Filha".');
//         }
//         notify.success('Os itens selecionados foram copiados para a outra aba.');
//         if (bFocusNoDestino) {
//           graphStore.abaFilha.focus();
//         }
//       } catch (error) {
//         notify.error('Erro. Nâo copiou itens para outra aba.');
//         if (bNovaJanela) {
//           graphStore.abaFilha.close();
//           graphStore.abaFilha = null;		
//         }
//       }
//     },
//     menu_excluirTudo(){
//       graphStore.menu_excluirTudo();
//     }
//   },
// });
export const useMenuStore = defineStore('menu', () => {
    const graphStore = useGraphStore();
    const menu = ref(null);

    function menu_botao(event) {
        event.preventDefault();
        // menu funciona no chrome do android mas não no firefox (não fecha o menu)
        if (graphStore.mobile) {
            graphStore.showMenu(7,80);
        } else {
            graphStore.showMenu(7,30);
        }
        setTimeout(function(){
            document.addEventListener(graphStore.eventclick, menuOnClick, false);
        },1000);
        event.preventDefault();
        return false;
    };
    function menu_rendererAtivarParar(bAtivar, bMostraMensagem){
      return graphStore.menu_rendererAtivarParar(bAtivar, bMostraMensagem)
    };
    function menu_zoomin(event) {
      const { shiftKey, ctrlKey } = event;
      const teclaShift = shiftKey;
      const teclaCtrl = ctrlKey;
      //this.menuOnClick(); //firefox no android, não está fechando o menu
      if (teclaCtrl) {
        return;
      }
      if (teclaShift) {
        return this.menu_configurar_springLength(1);
      }
      var vezes = graphStore.mobile?6:3;
      var escalamax = graphStore.mobile?8:2;
      if (graphStore.renderer.getTransform().scale>escalamax) {
        return;
      }
      for(var k=0; k<vezes; k++) {
        var escala = graphStore.renderer.zoomIn();
        if (escala>escalamax) {
          break;
        }
      }
    };
    function menu_zoomout(event) {
      const { shiftKey, ctrlKey } = event;
      const teclaShift = shiftKey;
      const teclaCtrl = ctrlKey;
      //menuStore.menuOnClick(); //firefox no android, não está fechando o menu
      if (teclaCtrl) {
        return;
      }
      if (teclaShift) {
        return menuStore.menu_configurar_springLength(-1);
      }
      var vezes = graphStore.mobile?6:2;
      for(var k=0; k<vezes; k++) {
        var escala = graphStore.renderer.zoomOut();
      }
    };
    function menuOnClick(e){
      //devido a inconsistência no firefox e chrome no android, foi colocado menuOnClick(); antes de todos os comandos do menu
      this.hideMenu();
      document.removeEventListener(graphStore.eventclick, menuOnClick);
      //window.scrollTo(0,0); //ttt
    };
    function functionhideMenu(){
      //menu.classList.contains('show-menu') //para verificar
        this.menu.value.classList.remove('show-menu');
    };
    function menu_configurar_springLength(zoomInOut) {
      var tamanho = graphStore.layout.simulator.springLength();
      if (zoomInOut==-1) {
        graphStore.layout.simulator.springLength(tamanho*0.9);
        graphStore.springLength = tamanho*0.9;
      } else if (zoomInOut==1) {
        graphStore.layout.simulator.springLength(tamanho*1.1);
        graphStore.springLength = tamanho*1.1;
      } else {
        var parametro = prompt('Digite o comprimento da ligação (valor padrão ' + graphStore.springLength + ')', tamanho);
        if (parametro) {
          graphStore.layout.simulator.springLength(parametro);
          graphStore.springLength = parametro;
        }
      }
      graphStore.menu_rendererAtivarParar(true, false); //para atualizar tela
    };
    function reset(){
      graphStore.gparam.renderer.reset();
    };
    function menu_inserirDesfazer(){
      graphStore.menu_inserirDesfazer();
    };
    function menu_inserir(textoDefault, teclaShift, teclaCtrl){
      graphStore.menu_inserir(textoDefault, teclaShift, teclaCtrl);
    };
    function menu_dados(bNovaJanela, idNo){
      graphStore.menu_dados(bNovaJanela, idNo);
    };
    function menu_incluir1Camada(){
      graphStore.menu_incluir1Camada();
    };
    function menu_botao_caminhos() {
      if (graphStore.idNosSelecionados.size<2) {
        notify.error('Para usar a rotina de caminhos, deve haver ao menos dois itens selecionados. Faça shift+click para selecionar mais itens.');
        return false;
      }
      var camada = prompt('Digite a camada a procurar. A camada é a partir de cada item, por isso pode encontrar caminhos até o dobro de camada. O valor máximo é 5. Se não encontrar caminho com os itens no gráfico, procura mais dados no servidor.', 3);
      if (camada===null) {
        return false;
      }
      camada = parseInt(camada); 
      if (!camada) {
        return
      }
      if (camada>5) {
        alert('Utilize camada abaixo de 5');
        return false;
      }
      graphStore.menu_caminhos(camada, '', false);
    };
    function menu_botaoAbre(bshift) {
      this.menu_carregaJSONNavegador(bshift ? '': 'salvo_pelo_botao');
    };
    function menu_carregaJSONNavegador(nomeIn) {
      var jsonDados;
      var arquivosLocais = JSON.parse(localStorage.getItem('jsons'));
      if (!arquivosLocais || (Object.keys(arquivosLocais).length==0)) {
        //arquivosLocais = {};
        alert('Nâo há arquivos tipo JSON salvos no navegador!');
        return;
      }
      var ultimoNome = '';
      var tmensagem = 'Digite um nome para carregar. Os seguintes grupos estão na memória: \n';
      
      if (nomeIn) {
        idArquivo = nomeIn;
      } else {
        for (let nome of Object.keys(arquivosLocais))  {
          tmensagem += nome + '\n';
          ultimoNome = nome;
        }
        idArquivo =  prompt(tmensagem, ultimoNome);
        if (!idArquivo) {
          return;
        }
      }
    
      var data = arquivosLocais[idArquivo];
      if (!data) {
        notify.error('Não localizou '+ idArquivo + ' no navegador.');
        return;
      }
      graphStore.inserirJson(data, ' Carregou no navegador: ' + idArquivo + '. ', true);
    };
    function menu_botaoSalva(bshift) { //xxx
      var r = this.menu_salvaJSONNavegador(bshift? '': 'salvo_pelo_botao');
      if (r) {
        notify.success('Os itens foram salvos no navegador.');
      }
    };
    function menu_salvaJSONNavegador(nomeIn) { //xx5
      var jsonDados;
      var ultimoNome = ''
      jsonDados = graphStore.getRedeNosLigacoes();
      if (jsonDados.no.length==0) {
        alertify.error('Não há itens para exportar.');
        return false;
      }
      var arquivosLocais = JSON.parse(localStorage.getItem('jsons'));
      
      if (nomeIn) {
        idArquivo = nomeIn;
      } else {
        var tmensagem = 'Digite um nome para salvar no navegador.';
        if (arquivosLocais) {
          tmensagem += 'Os seguintes já estão na memória: \n';
          for (let nome of Object.keys(arquivosLocais))  {
            tmensagem += nome + '\n';
            ultimoNome = nome;
          }
        }
        if (!ultimoNome) {
          ultimoNome = 'rede_local';
        }	
        idArquivo = prompt(tmensagem, ultimoNome);
        if (!idArquivo) {
          return false;
        } else if (Object.keys(arquivosLocais).includes(idArquivo)) {
          var resp = confirm('O nome ' + idArquivo + ' já está sendo usado. Deseja reescrever?');
          if (!resp) {
            return false;
          }
        }	
      }
        
      if (!arquivosLocais) {
        arquivosLocais = {};
        arquivosLocais[idArquivo] = JSON.parse(JSON.stringify(jsonDados));
      } else {
        arquivosLocais[idArquivo] = JSON.parse(JSON.stringify(jsonDados));
      }
      localStorage.setItem('jsons', JSON.stringify(arquivosLocais));
      return true;
    };
    function menu_exportaExcel(bSoSelecionados) {
      menu_exportaArquivo(bSoSelecionados, 'xlsx');
    };
    function menu_exportaArquivo(bSoSelecionados, tipo, jsonIn) {
      //jsonIn - se informado, ignora o parametro bSoSelecionados
      var jsonDados, url;
      if (jsonIn){ 
        jsonDados = jsonIn;
      } else {
        jsonDados = graphStore.getRedeNosLigacoes(bSoSelecionados);
      }
      if (jsonDados['no'].length==0) {
        notify.error('Não há itens para exportar.');
        return;
      }
      if (tipo=='xlsx') {
        url = 'dadosemarquivo/xlsx';
      } else if (tipo=='anx') {
        url = 'dadosemarquivo/anx';
      } else if (tipo=='osm') {
        if (jsonDados['no'].length>10) {
          alert('Se houver mais de ' + graphStore.inicio.geocode_max + ' endereços, serão utilizados somente as coordenadas do município dos cnpjs. A api de geolocalização de endereço só é usada com poucos itens, devido à lentidão. Se quiser um mapa com localização precisa, use a rotina com um gráfico menor.');
        } else {
          notify.warning('A rotina de geolocalização usa a api do OpenStreetMaps e irá demorar (1 segundo por endereço).'); 
        }
        //url = 'dadosemarquivo/osm';
        url = 'mapa'
      } else if (tipo=='json') {
        url = ''; //'selecao_de_itens';
      } else {
        return;
      }
      graphStore.openWindowWithPost(jsonDados, url);
      //iframeAuxiliar.exportaSoSelecionados = bSoSelecionados;
    };
    function menu_colaClip(){
      graphStore.menu_colaClip();
    };
    function drag_handler(ev) {
      ev.dataTransfer.setData("rede_json", JSON.stringify(graphStore.getRedeNosLigacoes(true, null, true))); //terceiro parametro true=bsemposicao
      var texto = [...graphStore.idNosSelecionados].join('\n');
      ev.dataTransfer.setData("text/plain", texto);
      
      var linksArray = [];
      for (let item of graphStore.idNosSelecionados) {
        if (item.startsWith('LI_')) { 
          linksArray.push(item.substr(3));
        }
      }
      if (linksArray.length>0) {
        ev.dataTransfer.setData("text/x-moz-url", linksArray.join('\n'));
        ev.dataTransfer.setData("text/uri-list", linksArray.join('\n'));	
      } else {
        ev.dataTransfer.setData("text/uri-list", base + 'grafico/1/'+ texto.replaceAll('\n', ';')); //arrastando para uma outra aba que não seja da redecnpj, abre o gráfico dos itens selecionados
      }
      return;
      /*
      if (graphStore.idnoSelecionado.startsWith('LI_')) { 
        texto = graphStore.idnoSelecionado.substr(3);
        ev.dataTransfer.setData("text/x-moz-url", texto);
        ev.dataTransfer.setData("text/uri-list", texto);
      } else {
        ev.dataTransfer.setData("text/uri-list", base + 'grafico/1/'+ texto.replaceAll('\n', ';')); //arrastando para uma outra aba que não seja da redecnpj, abre o gráfico dos itens selecionados
      } 
      */
    };
    function menu_copiaClip(){
      graphStore.menu_copiaClip();
    };
    function menu_copiaItensParaOutraAba(bNovaJanela, bFocusNoDestino) { 
      //cria nova aba (ou não) para copiar itens selecionados. Se não criar nova aba, copia para a última aba selecionada
      //quando cria uma aba nova (filha), o focus necessariamente fica na aba filha. O parâmetro bFocusNoDestino só funciona quando a aba filha já existe
      var jsonDados = graphStore.getRedeNosLigacoes(true, null, true);
      if (!bNovaJanela) {
        if (!graphStore.abaFilha || !graphStore.abaFilha.inserirJson || graphStore.abaFilha.closed ) {
          if (!confirm('Não encontrou uma Aba "Filha" aberta. Deseja abrir uma nova aba com os itens selecionados?')) {
            return;
          }
          bNovaJanela = true;
        }
      }
      if (bNovaJanela) {
        graphStore.abaFilha = window.open(base); 
      }
      var tempo = bNovaJanela ? 500 : 10;
      //graphStore.abaFilha.graphStore.inserirJson(jsonDados, 'itens copiados'); //neste momento a função ainda não foi criada... precisa de um delay
      setTimeout(() => {
            copiarItemSelecionadosParaAbaFilha(bNovaJanela, bFocusNoDestino)
          }, tempo
      );
    };
    function copiarItemSelecionadosParaAbaFilha(bNovaJanela, bFocusNoDestino) { 
      //ativado por duplo click no botão drag 
      //copia itens selecionados para nova janela aberta por SHIFT+A
      if (!graphStore.abaFilha || graphStore.abaFilha.closed || !graphStore.abaFilha.inserirJson  ) { //esta checagem é redundante??
        notify.error('Não há outra janela aberta recentemente. Use SHIFT+DUPLO CLICK no botão COPY ou a tecla SHIFT+A para criar uma nova ABA VAZIA ou a tecla A para criar nova aba com os itens selecionados.');
        return;
      }
      var jsonDados = graphStore.getRedeNosLigacoes(true, null, true); //pega itens selecionados
      try {
        graphStore.abaFilha.graphStore.inserirJson(jsonDados, 'itens copiados da Aba "Mãe"', true); 
        if (bNovaJanela) {
          graphStore.abaFilha.notify.warning('Pressionando o botão COPY na Aba "Mãe" copiará outros itens para esta Aba "Filha".');
        }
        notify.success('Os itens selecionados foram copiados para a outra aba.');
        if (bFocusNoDestino) {
          graphStore.abaFilha.focus();
        }
      } catch (error) {
        notify.error('Erro. Nâo copiou itens para outra aba.');
        if (bNovaJanela) {
          graphStore.abaFilha.close();
          graphStore.abaFilha = null;		
        }
      }
    };
    function menu_excluirTudo(){
      graphStore.menu_excluirTudo();
    };

    return {
      menu_botao,
      menu_rendererAtivarParar,
      menu_zoomin,
      menu_zoomout,
      reset,
      menu_inserirDesfazer,
      menu_inserir,
      menu_dados,
      menu_incluir1Camada,
      menu_botao_caminhos,
      menu_botaoAbre,
      menu_botaoSalva,
      menu_exportaExcel,
      menu_exportaArquivo,
      menu_colaClip,
      menu_excluirTudo,
    }
  },
);
