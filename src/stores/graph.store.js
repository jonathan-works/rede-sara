import Viva from 'vivagraphjs';
import { defineStore } from 'pinia';
import { LoadingBar, Loading } from 'quasar';
import BuscaService from 'src/service/busca.service.js'
import useNotify from 'src/composable/UseNotify.js';
import useDialog from 'src/composable/UseDialog.js';

const notify = useNotify();
const dialog = useDialog();
export const useGraphStore = defineStore('graph-store', {
  state: () => ({
    graph: null,
    graphics: null,
    markerSeta: null,
    inicio: '',
    counter: 0,
    inicio: '',
    inserirDefault: '',
    listaImagens: [],
    nodeSize: 20,
    tamanhoFonte: 10,
    tamCorteLabel: 20,
    corLigacaoLink: 'gray',
    bMostraLigacao: true,
    kligacoes: 0,
    btextoEmbaixoIcone: true,
    idnoSelecionado: null,
    idNosSelecionados: new Set(),
    listaIdNosInseridos: [],
    confirmaAntesDeInserirNNos: 300, //100,
    renderer: null,
    layout: null,
    geom: null,
    ultimoToque: 0,
    inicioToque: 0,
    mobile: false,
    safari: false,
    eventclick: 'click',
    kTipoRotulo: 0,
    AreaSelecaoRetangular: {},
    springLength: 150,
    bRenderAtivado: true,
    fScale: '',
    paginaBuscaGoogle: {},
    camadaIdExpandido: {},
    termoBuscaGoogle: '',
    itensFlag:[],
    embaralhaRotulo: false,
    abaFilha: null,
    usuarioLocal: null,

    baseImagem:'/imagem/',
    menu: null,
    buscaResponse: null
  }),
  actions: {
    buscar(tipo, camada, palavraChave){
      this.setLoading(true);
      return BuscaService.buscar(tipo, camada, palavraChave).then((mock) => {
        this.buscaResponse = mock;
        this.inserirJson(mock,'');
        this.setLoading(false);
        return mock;
      }).catch((error) => {
        console.log('erro:', error)
        this.setLoading(false);
        throw error;
      });
    },
    inserirJson(jsonIn, texto, bNaoConfirma, bSelecionaCaminho) {
      var no = jsonIn.no;
      var ligacao = jsonIn.ligacao;
      this.json = JSON.parse(JSON.stringify(jsonIn));
      var kn=0, kl=0;
      var idNosInseridos = new Set();
      var idNosCamadaZero = new Set();
      //var fatorTamanhoNovaLigacao = 1.0; //nova ligação sem animação fica desagradável. Quando houver poucos itens, deixa a ligação menor para ter animação
    
      var sNosAInserir = new Set();
      for (let noaux of Object.values(no)) { //verifica quantos nós serão inseridos
        if (!this.graph.hasNode(noaux.id)) { 
          sNosAInserir.add(noaux.id);
        }
      }	
      var kNosAInserir = sNosAInserir.size;
      
      if (!bNaoConfirma) {
        if (kNosAInserir > this.confirmaAntesDeInserirNNos) {
          let mensagem = 'Deseja inserir ' + kNosAInserir + ' itens?\n Depois será possível excluir os itens usando CTRL+Z para desfazer.';
          if (kNosAInserir>1000) mensagem += '\nObs: Com muitos itens a execução ficará muito lenta ou o browser poderá travar. ';  //\nApós carregar o gráfico, utilize a rotina no menu "Visualização>Quebrar o gráfico em partes"';
          var resp = confirm(mensagem);
          if (!resp) {
            // isso pode demorar muito e travar tudo. 
            if (this.usuarioLocal) {
              resp = confirm('Deseja exportar os dados dos itens não exibidos para o Excel? Obs: O processamento pode demorar. Seja paciente...');
              if (resp) {
                menu_exportaArquivo(null, 'xlsx', jsonIn); 
                console.log(JSON.stringify(jsonIn).length); 
              }
            }
            this.camadaIdExpandido = {}; //se cancelar inclusão de itens, zera contador (evitar erro em endereço, telefone e email não inserido, que não aceita inserir camada 2)
            return;
          }
          this.confirmaAntesDeInserirNNos = kNosAInserir;
        }
      }
      if (kNosAInserir>100) { 
        suspendeZoom(Math.sqrt(kNosAInserir)*200); 
        fatorTamanhoNovaLigacao = 1.0;
      } 
    
      //var angulo = 2.0*Math.PI*Math.random();
      //var passoAngulo = 2.0*Math.PI/Math.max(kNosAInserir, 1);
      var abertura;
      if (kNosAInserir<=1) {
        abertura = 0;
      } else if (kNosAInserir<8) { 
        abertura = 0.5*Math.PI; //os nos novos vão ficar em um intervalo de 90 graus
      } else if (kNosAInserir<20) {
        abertura = 1.0*Math.PI;
      } else {
        abertura = 1.5*Math.PI;
      }
      var angulo = this.pegaAnguloLigacaoDoItemSelecionado(true) - abertura/2.0;
      var passoAngulo = abertura/Math.max(kNosAInserir-1, 1);
      
      var posicaoReferencia = {'x':0, 'y':0};
      if (this.idnoSelecionado) { //insere novos em torno do nó selecionado.
        posicaoReferencia = this.layout.getNodePosition(this.idnoSelecionado);
      } else {
        //passoAngulo = 2*Math.PI/Math.max(kNosAInserir-1, 1);
        passoAngulo = 2*Math.PI/Math.max(kNosAInserir, 1);
        angulo = Math.PI/2;
      }
      
      for (let noaux of Object.values(no)) {
        if (!this.graph.hasNode(noaux.id)) { 
          if (!noaux.nota) {
            noaux.nota = ''; //em algumas funções supõe que nota é string
          }
          this.graph.addNode(noaux.id, JSON.parse(JSON.stringify(noaux)));
          
          if (noaux.posicao) { 
            if ((noaux.posicao.x) && (noaux.posicao.y)) {
            this.layout.setNodePosition(noaux.id, noaux.posicao.x, noaux.posicao.y);
            //refreshPosicoes = true;
            }
            this.layout.pinNode(noaux, noaux.pinado); 
          //} else if (posicaoReferencia) { //insere novos em torno do nó selecionado.
          } else { //insere novos em torno do nó selecionado.
            //this.layout.setNodePosition(noaux.id, posicaoReferencia.x + Math.random()*this.springLength-this.springLength/2, posicaoReferencia.y + Math.random()*this.springLength-this.springLength/2);
            //var angulo=Math.PI*(Math.random()-0.5) + Math.atan2(posicaoReferencia.y, posicaoReferencia.y); //teste, colocar itens novos em relação ao centro do gráfico (algum problema)
            //this.layout.setNodePosition(noaux.id, posicaoReferencia.x + Math.cos(angulo)*this.springLength*fatorTamanhoNovaLigacao, posicaoReferencia.y + Math.sin(angulo)*this.springLength*fatorTamanhoNovaLigacao);
            var fatorE = 1.0;
            if ([ 'EN_','TE_', 'EM_'].includes(noaux.id.substr(0,3))) { //coloca endereços mais longe para melhorar visualização
              fatorE = 2.0;
            }
            //fatorE = fatorE * fatorTamanhoNovaLigacao;
            this.layout.setNodePosition(noaux.id, 
              posicaoReferencia.x + Math.cos(angulo)*this.springLength*fatorE, posicaoReferencia.y + Math.sin(angulo)*this.springLength*fatorE);
            angulo += passoAngulo;
          }
          kn += 1;
          idNosInseridos.add(noaux.id);
          //if (!noaux.camada) {
          if ((noaux.camada===0) ||(noaux.camada==='0')) {
            idNosCamadaZero.add(noaux.id);
          }
        } else { //nó já existe. TODO: verificar se precisa atualizar .data 
        
        }
      }
    
      if (idNosInseridos.size) {
        this.listaIdNosInseridos.push(idNosInseridos);
      }
      
      for (let ligaux of Object.values(ligacao)) {
        var nosExistem = ((this.graph.hasNode(ligaux.origem)) && (this.graph.hasNode(ligaux.destino)));
        if (!nosExistem) {
          console.log('erro. Dados de um dos nós da ligação não foi definido');
          console.log('ligacao '+ ligaux.origem + ' para ' + ligaux.destino);
          notify.error('Erro na ligacao '+ ligaux.origem + ' para ' + ligaux.destino);
          continue;
        }
        var ligExistente = this.graph.hasLink(ligaux.origem, ligaux.destino);
        var direcao = '';
        if (!ligExistente) {
          ligExistente = this.graph.hasLink(ligaux.destino, ligaux.origem);
          direcao = '-'; //item novo está na direção contrária da seta, adiciona menos antes do tipo de ligação
        }
        if (ligExistente) { 
          var labelLigacao = ligExistente.data.label ? ligExistente.data.label : '';
          var conjLabel = new Set(labelLigacao.split(';')); //; é separador dos tipos de ligação
          if (direcao) { //se o tipo de ligação novo está em direção contrária da seta existente, adiciona menos
                  //seria necessário tratar as situações em ligações que não há direção (não seria preciso por sinal)
            var laux = ligaux.label ?  ligaux.label.split(';') : ''.split(';');
            if (ligaux.label) {
              laux.forEach((element, index) => {
                laux[index] = '( - )' + element;
              });
            }
            var conjNovo = new Set(laux);
          } else {
            var conjNovo = new Set(ligaux.label ?  ligaux.label.split(';') : ''.split(';'));
          }
          let uniao = new Set([...conjLabel, ...conjNovo]);
          uniao.delete('');
          var labelLigacaoNovo = [...uniao].join(';');
          if (labelLigacaoNovo != labelLigacao) {
            ligExistente.data.label = labelLigacaoNovo;
            var ligacaoElementoAux = document.getElementById('link_label_'+ligExistente.data.id); //ttt
            ligacaoElementoAux.text(this.cortastr(this.filtraTextoLigacao(ligExistente.data.label), 25)); //.attr('title',this.filtraTextoLigacao(ligExistente.data.label)); 
            // && (this.filtraTextoLigacao(labelLigacao).length > 2*20) 
            if (ligacaoElementoAux.hasAttribute('transform')) { //remove rotação (se o texto for longo, não será rotacionado)
              ligacaoElementoAux.removeAttribute('transform');
            }
            ligacaoElementoAux.attr('text-anchor','start');
            //ajusta tooltip
            //talvez não seja necessário //if (ligacaoElementoAux.children[0]) ligacaoElementoAux.children[0].remove();
            ligacaoElementoAux.insertAdjacentHTML('beforeEnd','<title>'+this.filtraTextoLigacao(ligExistente.data.label)+'</title>');
          }
        } else { //ligacao Nova
          ligaux.id = this.kligacoes;
          if (1) { //((this.graph.hasNode(ligaux.origem)) && (this.graph.hasNode(ligaux.destino))) {
            try { //dava erro com a rede de teste
              this.graph.addLink(ligaux.origem, ligaux.destino, JSON.parse(JSON.stringify(ligaux)));
              kl += 1;
              this.kligacoes += 1;
            } catch (e) {
              console.log('erro na ligacao ' + texto);
              console.log('ligacao '+ ligaux.origem + ' para ' + ligaux.destino);
              notify.error('Erro json na ligacao '+ ligaux.origem + ' para ' + ligaux.destino);
            }
          } else {
            console.log('faltando um dos nós da ligação.');
            console.log('ligacao '+ ligaux.origem + ' para ' + ligaux.origem);
          }
        }
      }
      if (idNosCamadaZero.size) {
        this.selecionaNoid(null, false); //desseleciona tudo
        for (let n of idNosCamadaZero) {
          this.selecionaNoid(n, true);
          if ((idNosCamadaZero.size == 1)&&(idNosInseridos.size>1)) { //coloca o único nó em camada1 inserido na variável para expandir com tecla 1
            this.camadaIdExpandido = {}; 
            this.camadaIdExpandido[n] = 1;
          }
        }
      } 
      var textoMensagem = texto;
      if (kn)	textoMensagem += (kn>1) ? ' Inseridos ' + kn + ' itens' : ' Inserido 1 item';
      if (kl) {
        if (kn) {
          textoMensagem += (kn>1) ? ' e ' + kl + ' ligações.' : ' e 1 ligação.';
        } else {
          textoMensagem +=  (kn>1) ? ' Inseridas ' + kl + ' ligações.' : ' Inserida 1 ligação.';
        }
      }
      if ((!kn) && (!kl)) { //sem itens novos
        if (bSelecionaCaminho) { //sem itens novos, mas seleciona o caminho já existente no gráfico
          this.selecionaNoid(null, false); //desseleciona tudo
          // console.log(JSON.stringify(no)); 
          for (let nox of Object.values(no)) {
            if (this.graph.hasNode(nox.id)) { 
              this.selecionaNoid(nox.id, true);
            }
          }
          textoMensagem += ' Não adicionou novos itens, mas os itens do caminho foram selecionados.';
        } else {
          textoMensagem += ' Não adicionou novos itens.';
        }
      }
      this.exibe_mensagem_sucesso_erro(textoMensagem, jsonIn.mensagem); 
      if (kn  && !this.bRenderAtivado) { //ativa leiaute por 1 segundo para exibir novos itens
        this.renderer.resume();
        setTimeout(
          () => { 
            if (!this.bRenderAtivado) {
              this.renderer.pause();
            };
          }, 500
        );	
      }
      return true; 
    },
    pegaAnguloLigacaoDoItemSelecionado(brandom) { 
      //calcula o angulo do noSelecionado com o anterior, se o noSelecionado tiver uma ligação. Se tiver mais de uma ligação e menos de 15, calcula média (faz sentido?), e utiliza o angulo para posicionar o novo nó.
      //brandom = true, retorna randomico se haver nenhuma ou muitas ligações ligação para noSelecionado.
      var angulo = brandom ? 2.0*Math.PI*Math.random() : 0.5*Math.PI;
      if (!this.idnoSelecionado) {
        return angulo;
      }
      var somaX = 0, somaY=0; //para calcular média dos nós ligados ao selecionado.
      var linksDoNo = this.graph.getLinks(this.idnoSelecionado);
      if (!linksDoNo || (linksDoNo.length>50)) { //se houver muitos itens ligados, não faz sentido calcular média dos angulos
        return angulo;
      }
      var posicaoReferencia = this.layout.getNodePosition(this.idnoSelecionado);
      for (var linkNo of linksDoNo) {
      //if (linksDoNo &&  (linksDoNo.length==1)){
        //let linkNo = linksDoNo[0];
        var posicaoItem;
        //var posicaoReferencia = this.layout.getNodePosition(this.idnoSelecionado);
        if (linkNo.fromId == this.idnoSelecionado) {
          posicaoItem = this.layout.getNodePosition(linkNo.toId);
        } else {
          posicaoItem = this.layout.getNodePosition(linkNo.fromId);
        }
        somaX += posicaoItem.x;
        somaY += posicaoItem.y;
      }
      //calcula angulo do itemSelecionado com a média dos ligados a esse item
      return Math.atan2(posicaoReferencia.y - somaY/Math.max(linksDoNo.length, 1), posicaoReferencia.x - somaX/Math.max(linksDoNo.length, 1));
    },
    selecionaNoid(nodeid, shift_pressionado, selecionaRetangular) {
      // ativa retângulo em torno do ícone do nó.
      // se o shift está pressionado, pode ter mais de um nó. Se o nó já estiver selecionado, shift_pressionado inverte estado da seleção para nodeid
      // quando node=null e shift_pressionado=false, remove todos os nós da seleção.
      //selecionaRetangular=true, seleciona, não inverte
      var nodeEstavaSelecionado = false;
      //this.camadaIdExpandido = {}; //reseta memória de camada
      if (nodeid) {
        nodeEstavaSelecionado = this.idNosSelecionados.has(nodeid);
        if (nodeEstavaSelecionado) {
          if (selecionaRetangular) { //se o nó já estava selecionado e com selecao retangular, não há o que fazer.
            return;
            //nodeEstavaSelecionado=false; //fazer isso pode ignorar que o objeto animação já exista e criar outro.
          }
        }
      } else {
        for (let n of this.idNosSelecionados) {
          this.ajustaRetanguloAnimado(n, false);
          //this.graphics.getNodeUI(n).getElementsByTagName('rect')[1].setAttribute('visibility', 'hidden');  //hidden or visible)		
        }
        this.idNosSelecionados = new Set(); 
        this.idnoSelecionado = null;
        return;
      }
      if (shift_pressionado) {
        if (nodeEstavaSelecionado) {
          this.idnoSelecionado = null;
          this.idNosSelecionados.delete(nodeid);
          this.ajustaRetanguloAnimado(nodeid, false);
          //this.graphics.getNodeUI(nodeid).getElementsByTagName('rect')[1].setAttribute('visibility', 'hidden');
        } else {
          this.idnoSelecionado = nodeid;
          this.idNosSelecionados.add(nodeid);
          this.ajustaRetanguloAnimado(nodeid, true);
          //this.graphics.getNodeUI(nodeid).getElementsByTagName('rect')[1].setAttribute('visibility', 'visible');
        }
      } else {
        for (let n of this.idNosSelecionados) {
          this.ajustaRetanguloAnimado(n, false);
          //this.graphics.getNodeUI(n).getElementsByTagName('rect')[1].setAttribute('visibility', 'hidden');  //hidden or visible)		
        }
        this.idNosSelecionados = new Set(); 
        this.idnoSelecionado = nodeid;
        if (nodeid) {
          this.ajustaRetanguloAnimado(nodeid, true);
          //this.graphics.getNodeUI(nodeid).getElementsByTagName('rect')[1].setAttribute('visibility', 'visible');  //hidden or visible)
          this.idNosSelecionados.add(nodeid);
          this.idnoSelecionado = nodeid;
        }
      }
      //ajusta menu contextual
      //ajustaMenuContextual(nodeid);
      return;
    },
    ajustaRetanguloAnimado(nodeid, bSeleciona) {
      //ajusta posicao do retangulo para envolver o texto
      let nodeUI = this.graphics.getNodeUI(nodeid)
      let uirect = nodeUI.getElementsByTagName('rect')[1];
      if (bSeleciona) {
        
        //console.log(textBox);
        
        /* //criar o retangulo depois faz com que o item não aceite duplo clique
        var	uirect = Viva.Graph.svg('rect') //destacar se está selecionado
        //.attr('visibility', 'hidden') //hidden or visible	
        .attr('stroke', 'black') //'crimson'
        .attr('stroke-width', 1.5)	
        .attr('fill', 'transparent') 
        .attr('width', this.nodeSize)
        .attr('height', this.nodeSize)
        .attr('stroke-dasharray', '6, 6')
        .attr('visibility', 'visible');
        if (false) {
          let textBox = nodeUI.getElementsByTagName('text')[0].getBBox();
          //altera retangulo da seleção para envolver o texto
          uirect.attr('x', textBox.x).attr('y', textBox.y).attr('width', textBox.width).attr('height', textBox.height);
        }
        */
        uirect.setAttribute('visibility', 'visible');
        var animateRect = Viva.Graph.svg('animate');
        animateRect.attr('attributeName','stroke-dashoffset').attr('values','0;180;0').attr('dur', '60s').attr('repeatCount','indefinite');
        uirect.appendChild(animateRect);
        
        //uirect.setAttribute('class', 'disabled');
        //var uitexto = nodeUI.getElementsByTagName('text')[0];
        //nodeUI.appendBefore(uirect, uitexto);
        //nodeUI.append(uirect);
        //nodeUI.getElementsByTagName('rect')[1].setAttribute('visibility', 'visible');
      } else {
        uirect.setAttribute('visibility', 'hidden');
        var animateRectList = uirect.getElementsByTagName('animate');
        //this.debug = uirect;
        if (animateRectList.length) {
          uirect.removeChild(animateRectList[0]);
        }
        //var uirect = nodeUI.getElementsByTagName('rect')[1];
        //nodeUI.removeChild(uirect);
      }
    },
    exibe_mensagem_sucesso_erro(textoMensagem, mensagem) {
      if (mensagem) {
        notify.error(mensagem);
      }	
      if (textoMensagem) {
        notify.success(textoMensagem)
      }
    },
    labelsNo(node, tipoResumido) {
      //antes se passava node.data.label, mas era redundante com id e descricao
      var idno = node.data.id;
      var descricao = node.data.descricao;
      var nota = node.data.nota? node.data.nota: '';
      let tamCorte = this.tamCorteLabel;
      if (idno.startsWith('PF_')) {
        idno = idno.substr(3);
        idno = idno.split('-')[0];
      } else if (idno.startsWith('EN_')) {
        var partes = idno.substr(3).split('-');
        idno = partes[0];
        descricao = partes[1] + '/' + partes[2];
      } else if (idno.startsWith('LI_') || idno.startsWith('AR_')) {
        /*
        idno = idno.substr(3);
        if (idno.startsWith('https://')) {
          idno = idno.substr('https://'.length);
          if (idno.startsWith('www.')) {
            idno = idno.substr(4);
          }
          idno = idno.split('/')[0];
          if (idno.endsWith('.com.br')) {
            idno = idno.split('.com.br')[0];
          } else if (idno.endsWith('.com')) {
            idno = idno.split('.com')[0];
          }
        }
        if (idno.length>tamCorte) {
          idno = idno.substr(0,tamCorte) + '...';
          //descricao = idno.substr(-29);
        } */
        idno = this.labelsNo_LI(idno, tamCorte);
        if (nota.length>tamCorte) {
          nota = '...';
        }
      } else if (idno.startsWith('ID_')) {
        idno = idno.substr(3);
        if (idno.includes('__')) {
          idno = idno.substr(idno.indexOf('__')+2); 
        }
      } else if (idno.startsWith('OO_')) {
        idno = '';
      } else {
        idno = idno.substr(3);
        if (idno.includes('__') && !descricao) {
          descricao=idno.substr(idno.indexOf('__')+2); 
          idno = idno.split('__')[0];
          if (descricao.length>tamCorte) {
            descricao = descricao.substr(0,tamCorte) + '...';
          }
        }
      }
      if (this.embaralhaRotulo) {
        descricao = embaralhaTexto(descricao);
        idno = embaralhaTexto(idno);
      }
      if (!tipoResumido) {
        return [idno, descricao, nota]
      } else if (tipoResumido==1) {
        return [descricao, '', nota]
      } else if (tipoResumido==2) {
        return [descricao.split(' ')[0],'', nota]
      } else {
        return ['', '', '']
      }
    },
    labelsNo_LI(idno, tamCorte) {
      idno = idno.substr(3);
      if (idno.startsWith('https://')) {
        idno = idno.substr('https://'.length);
        if (idno.startsWith('www.')) {
          idno = idno.substr(4);
        }
        idno = idno.split('/')[0];
        if (idno.endsWith('.com.br')) {
          idno = idno.split('.com.br')[0];
        } else if (idno.endsWith('.com')) {
          idno = idno.split('.com')[0];
        }
      }
      if (idno.length>tamCorte) {
        idno = idno.substr(0,tamCorte) + '...';
        //descricao = idno.substr(-29);
      }
      return idno;
    },
    textoTooltip(node, todoTexto){ // se todoTexto=false, exibe apenas dados dos marcadores
      let LF = String.fromCharCode(10);
      var texto = node.id;
      var nome_fantasia = this.sv(node.data.nome_fantasia);
      if (nome_fantasia) {
        nome_fantasia = '(' + nome_fantasia + ')' + LF;
      } 
      if (node.id.startsWith('PJ_')) {
        if (node.data.uf=='EX') { 
          texto += LF + node.data.descricao + LF + nome_fantasia + this.sv(node.data.logradouro) + LF + this.junta(node.data.municipio, '/', node.data.pais);
        } else {
          texto += LF + node.data.descricao + LF + nome_fantasia + this.junta(node.data.logradouro,', ',node.data.logradouro_complemento) + LF + this.junta(node.data.municipio, '/', node.data.uf); //this.sv(node.data.municipio) + '/' + this.sv(node.data.uf);
        }
      } else if (node.id.startsWith('PF_')) {	
      
      } else if (node.id.startsWith('LI_')) {
        texto = node.id.substr(3) + (node.data.descricao ? LF +  LF + node.data.descricao :  '') + LF;
      } else if (node.id.startsWith('AR_')) {
        texto = node.id.substr(3) + (node.data.descricao ? LF +  LF + node.data.descricao: '')
        if (this.usuarioLocal) {
          texto += LF +  LF + 'Clique duplo para abrir o documento.';
          if ((node.id.indexOf('\\')==-1) && (node.id.indexOf('/')==-1)) {
            texto += ' Para ser aberto, isso deve estar na pasta arquivos do projeto.';
          }
        } else { //execução não local
          if ((node.id.indexOf('\\')==-1) && (node.id.indexOf('/')==-1)) {
            texto += LF + + LF +'Para ser aberto, isso deve estar na pasta arquivos do projeto no servidor.';
          } else {
            texto +=  LF + LF + 'O arquivo não está disponível.';
          }
        }
      } else if (node.id.startsWith('ID_')) {
        if (node.id.includes('__')) { 
          texto = node.id.split('__')[0] + '...' + LF + node.id.substr(node.id.indexOf('__')+2);
        } 
        if (node.data.descricao) {
          texto += '\r' + node.data.descricao;
        }
      } else { //outros tipos
        if (node.data.descricao) {
          texto += '\r' + node.data.descricao;
        }	
      }
      if (node.data.nota) {
        texto += LF + node.data.nota;
      }
      if (node.id.startsWith('LI_')) {
        texto += LF + LF + 'Clique duplo para abrir o link';
      }
      texto = this.junta(texto, LF+LF, this.textoFlag(node));
      return texto;
    },
    sv(texto) {
      return texto? texto:'';
    },
    junta(a, separador, b) {
      if (a && b) {
        return ''+ a + separador + b;
      } else if (a) {
        return ''+a;
      } else if (b) {
        return ''+b;
      }	
      return ''
    },
    textoFlag(node, bchaveEmNegrito) { 
      var texto = '';
      var textoAJuntar = '';
      //let lista = ['pep', 'ceis', 'cepim', 'cnep', 'acordo_leniência', 'ceaf', 'pgfn-fgts', 'pgfn-sida','pgfn-prev'];
      for (var item of this.itensFlag) {
        if (node.data[item]) {
          //let textoAJuntar = item.toUpperCase() + ': ' + node.data[item];
          if (bchaveEmNegrito) {
            textoAJuntar = '<b>' + item + ': </b>' + node.data[item];
          } else {
            textoAJuntar = item + ': ' + node.data[item];
          }
          texto = junta(texto, LF, textoAJuntar);
        }
      }
      return texto;
    },
    menu_abrirNovaAba(idno, bNosSelecionados) {
      var novaJanela=null;
      if ((!idno)&&(!bNosSelecionados)) {
        novaJanela = window.open(base); // + '?pula_mensagem=sim');
        novaJanela.focus(); 
        this.abaFilha = novaJanela;
        return;
      }
    
      if ((!idno)&&bNosSelecionados) { //abre numa nova aba os nós selecionados
        //se tiver só um nó selecionado, pergunta quantas camadas
        if ((this.idNosSelecionados.size==1) && ([ 'PF_', 'PJ_'].includes(this.idnoSelecionado.substr(0,3)))){ 
          var camada = prompt('Quantidade de camadas para abrir ' + this.idnoSelecionado + ' em uma nova aba:','1');
          if (!camada) return;
          novaJanela = window.open(base + 'grafico/' + String(camada) + '/' + this.idnoSelecionado) ;
          if (novaJanela) {
            novaJanela.focus();
            this.abaFilha = novaJanela;
          }
        } else {	
          menu_copiaItensParaOutraAba(true, true);
        }
        return;
      } 
      if (idno.startsWith('LI_')) {
        novaJanela = window.open(idno.substr(3));
        novaJanela.focus();
        return;
      } else if (idno.startsWith('AR_')) {
        var url = base + 'abrir_arquivo' ; //+ idno.substr(3);
        //novaJanela=window.open(strUrl);
        if (!this.usuarioLocal) {
          if (idno.includes('/') || idno.includes('\\') ) {
            alert('Essa rotina somente abre arquivos se a execução do projeto for local.');
            return;
          }
        }
        let bodyjson = JSON.stringify([idno.substr(3)]); //JSON.stringify([...this.idNosSelecionados]);
        fetch(url, {method: 'post', body: bodyjson, headers: {"Content-type": "application/json"}, cache: "no-store"}) // mode: 'cors',
        .then( 
          (response) => {
            if (response.status !== 200) {
              mensagemErroHttp(response);
              return;
            }
            // Examine the text in the response
            response.json().then((data) => {
            if (data['retorno']) {
              notify.success('O arquivo ' + idno.substr(3) + ' foi aberto.');
            } else {
              notify.error('O arquivo ' + idno.substr(3) + ' não foi aberto. ' + data['mensagem']);
            }
            });
          }
        )
        .catch((err) => {
          notify.error('Aconteceu um erro (Fetch error ' + err + ')');
        });
    
        return;
      };
      
    },
    cortastr(s, tam) {
      if (!s) {
        return '';
      } else if (s.length>tam) {
        return s.substr(0, tam) + '...'; //' (...)';
      } else {
        return s;
      }
    },
    filtraTextoLigacao(texto) {
      //remove texto do link para o gráfico ficar mais limpo
      var palavras = [];
      for (let k of texto.split(';')){
        var pedaco = (k.search(':')!=-1) ? k.split(':')[0] : k
        //if (['endereço','telefone','end','tel','email','link'].includes(pedaco.trim())) {
        if (['endereço','telefone','end','tel','email','google','chave'].includes(pedaco.trim())) {
          continue;
        }
        if (pedaco=='link') {
          palavras.push(k.replaceAll('link:',''));
        } else {
          palavras.push(k);
        }
      }	
      return palavras.join('; ');
    },
    pausarLayout(milissegundos) {
      if (!this.bRenderAtivado) {
        return;
      }
      this.renderer.pause();
      this.layout_suspenso = true;
      setTimeout(
        function() { 
          if (this.bRenderAtivado) {
            this.renderer.resume();
            this.layout_suspenso = false;
          };
        }, milissegundos
      );
    },




    ajustaAmbiente() {
      var alertifyfake = {
        'prompt':(titulo, texto, valor, func1, func2) => {
          menuStore.menuOnClick(); //firefox no android, não está fechando o menu
          var resp = 	prompt(titulo+'\n'+texto.replaceAll('<b>','').replaceAll('</b>',''), valor);
          if (!(resp===null)) {
            func1(null, resp);
          } else {
            func2();
          };
        },
        'confirm':(titulo, texto, func1,func2) => {
          menuStore.menuOnClick();
          var resp = confirm(titulo + '\n' + texto);
          if (resp) {
            func1();
          } else {
            func2();
          }
        },
        'alert':function(titulo, texto, func) {
          menuStore.menuOnClick();
          //texto = texto.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '; ')
          texto = texto.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '\n')
          setTimeout(function(){ alert(titulo + '\n\n' + texto);}, 500);	
          func();
        },
        'success':function(texto) {
          menuStore.menuOnClick();
          setTimeout(function(){ alert(texto);}, 500);
        },
        'warning':function(texto) {
          menuStore.menuOnClick();
          setTimeout(function(){ alert('ATENÇÃO!!! ' + texto); }, 500);
        },
        'error':function(texto) {
          menuStore.menuOnClick();
          setTimeout(function(){ alert('ERRO!!! ' + texto); }, 500);
        }
      } //.alertifyfake
      // var menu = document.querySelector('.menu');
      if (this.mobile) { 
      //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ //mobile
        //alert('Esta página pode não funcionar corretamente no celular ou tablet... Se der erro, abra um issue na página do projeto no github. Tente em um computador com o Firefox, Chrome ou Edge.');
        //mobile. gambiarra, o notify não funciona no ipad, no android fica muito pequeno
        notify.set('notifier','position', 'top-left'); //se fica de lado, os alertas não aparecem no mobile
        //this.mobile = true;
        this.inserirDefault = ''; //'TESTE'; //como é dificil digitar no mobile, coloca um valor padrão
        notify.prompt = alertifyfake.prompt;
        //dialog.confirm = alertifyfake.confirm; //confirm é usado para informar parametros em dlgLink, por isso não pode sobrepor
        notify.alert = alertifyfake.alert; 
        notify.warning = alertifyfake.warning;
        if (/Android/i.test(navigator.userAgent)) { //android
    
        } else 	{ //safari antigo (parou de funcionar). Safari novo no ipad = versão desktop
          this.safari = true;
          //safari, trocar onclick por ontouchend nos botoes
            var botoes = document.getElementsByClassName('botaosuperior');
            for (var i=0; i<botoes.length; i++) { //ipad antigo não aceita let
              botoes[i].ontouchend=botoes[i].onclick;
            } 
          this.eventclick = 'touchend';
            document.querySelectorAll('.menu-btn').forEach( function(element,key) {element.ontouchend = element.onclick;});
        } 
      } else { //desktop
        try {
          document.getElementById('div_referencia').textContent=this.inicio.referenciaBDCurto; //\xa0 espaço não separável
        } catch (e) {;}
        document.addEventListener('contextmenu', this.onContextMenu, false); //menu contextual em toda a tela
        this.ajustaAmbiente_adicionarListaIconesAoMenu();
        try {
          document.getElementById('input_cnpj').value = this.inserirDefault;
        } catch (e) {;};		
      }
    
    },
    ajustaAmbiente_adicionarListaIconesAoMenu() {
      //var menuIcone = document.getElementById('menu_selecao_icone');
      var menuIconeOptions = document.getElementById('menu_selecao_icone_options');
      for (var item of this.listaImagens) {
        /*
        var itemMenu = document.createElement('li');
        itemMenu.innerHTML = '\
          <button type="button" class="menu-btn" onclick="menu_alteraIcone('+item+');"> \
          <i class="fa fa-tags"></i><span class="menu-text">' + item + '</span> \
          </button>	'	
        itemMenu.setAttribute('class', "menu-item"); */
        var itemOption = document.createElement('option');
            //itemOption.onchange = 'menu_alteraIcone("' + item + '");';
        itemOption.text = item;
        itemOption.value = item;
        //todo
        //menuIconeOptions.appendChild(itemOption);
      }
    },
    onContextMenu(e){
      //	Para evitar ativar menu contextual com notify.prompt
      if (document.onkeydown == null) { //teste, quando ativaAtalhos(false), seta-se document.onkeydown=null. Então se onkeydown==null, supõe que os teclados de atalho estão desativados e desativa o menu contextual da rede
        return;
      }
      e.preventDefault();
      showMenu(e.pageX, e.pageY);
        document.addEventListener(this.eventclick, menuOnClick, false);
    },
    showMenu(x, y){
      this.menu.style.left = x + 'px';
      this.menu.style.top = y + 'px';
      this.menu.classList.add('show-menu');
    },
    ajustaRegiaoDrop() {
      //var dropzoneId = "drop_area"; //"div_botoes"; //só esta região vai aceitar drop
      var dropzones = ['drop_area', 'principal_svg'];
      window.addEventListener("dragenter", function(e) {
        //console.log(e.target.id);
        //if (e.target.id != dropzoneId) {
        if (!dropzones.includes(e.target.id)) {
          e.preventDefault();
          e.dataTransfer.effectAllowed = "none";
          e.dataTransfer.dropEffect = "none";
        }
      }, false);
    
      window.addEventListener("dragover", function(e) {
        //if (e.target.id != dropzoneId) {
        if (!dropzones.includes(e.target.id)) {
          e.preventDefault();
          e.dataTransfer.effectAllowed = "none";
          e.dataTransfer.dropEffect = "none";
        }
      });
    
      window.addEventListener("drop", function(e) {
        //if (e.target.id != dropzoneId) {
        if (!dropzones.includes(e.target.id)) {
          e.preventDefault();
          e.dataTransfer.effectAllowed = "none";
          e.dataTransfer.dropEffect = "none";
        }
      });
    },
    ativaAtalhos(bcaptura) {
      // é preciso desativar antes de usar o notify.prompt
      if (this.mobile) {
        return;
      }
      if (bcaptura) {
        document.onkeydown = this.evento_teclasDown;
      } else {
        document.onkeydown = null;
      }
    },
    menu_inserir(textoDefault, teclaShift, teclaCtrl) {
      if (teclaCtrl) {
        return;
      }
      if (teclaShift) {
        return this.menu_ligar_novo();
      }
      if (!this.inicio.bBaseReceita) {
        return this.menu_ligar_novo();
      }
      //var camada = 1;
      this.ativaAtalhos(false);
      //var itensDefault = this.inserirDefault;
      
      if (textoDefault) {
        itensDefault = textoDefault;
      } 
      else {
        try {
          var itensDefault = document.getElementById('input_cnpj').value;
        }  catch (e){ itensDefault = this.inserirDefault; };
      }
      var textoPrompt = 'Para visualizar o gráfico de relacionamentos, digite CNPJ, CNPJs separados por PONTO E VÍRGULA (;) ou ESPAÇO, radical do CNPJ, Razão Social, Nome Fantasia ou Nome de Sócio. ';
      if (!this.mobile) {
        textoPrompt += ' Para realizar busca por sequência exata, utilize * (curinga de palavra). Por ex: FULANO DE *; *DE TAL; EMPRESA* BRASILEIRA; ';
        textoPrompt += ' Utilize @ e um número para obter mais registros, por exemplo, FULANO@20. Para exibir Matriz e 10 filiais, digite  o Radical do CNPJ seguido de @10. Para visualizar um CNPJ aleatório, pressione OK com o campo vazio.';
        // textoPrompt +=  ' <b>ATENÇÃO:</b> A busca por nome está mais flexível. Agora o padrão é a busca por parte nos nomes, não é mais necessário nomes completos.'
      }
      
      //todo
      // notify.prompt( 'RedeCNPJ - Digite CNPJ/CPF/Nome', textoPrompt , itensDefault
      //            , function(evt, cnpjs) {   //quando se pressiona cancel, esta rotina não é chamada. Usando vazio para retornar um cnpj de teste
      // 				this.inserirDefault = cnpjs;
      // 				try {
      // 					document.getElementById('input_cnpj').value = this.inserirDefault;
      // 				} catch (e) {;};
              
      // 				var cn = cnpjs.trim().toUpperCase();
      // 				var cnaux = cn.replaceAll('.', '').replaceAll('-', '').replaceAll('/',''); //cn.replace(/\./g, '').replace(/\-/g, '');
      // 				//console.log(cnaux);
      // 				if ((cn.search(';')==-1) && isNumeric(cnaux.replaceAll(' ','').replaceAll(',',''))) { //se só tiver digitos, considera espaço como separador
      // 					cn = cn.replaceAll(' ',';').replaceAll(',',';');
      // 				}					
      // 				if (1) { //(cn) { 
      // 					if (!cn || (cn=='T')) {
      // 						cn='#TESTE#';
      // 					}
      // 					if (isNumeric(cnaux) && (cnaux.length==11)) { 
      // 						notify.warning('A busca por CPF é feita por apenas 6 digitos e pode apresentar resultados incorretos. A tabela de dados abertos não tem todos os dígitos de CPF.');
      // 					}
      // 					if (!this.mobile) {
      // 						notify.warning('Pressione as teclas 1 a 9 para inserir a camada correspondente ao número.'); //alerta temporario
      // 					}
      // 					//menu_incluirCamada(cn, camada);
      // 					menu_incluir1Camada(cn);
      // 				}
      // 				ativaAtalhos(true);
      // 			}, function() { ativaAtalhos(true);}
      // );
    },
    menu_ligar_novo(idNovo, descricaoNovo, bNaoLigar, bLigarEntre, bInverterLIgacaoPadrao, posicao) {
      //cria novo item (não PJ) e liga com nós selecionados.
      if (idNovo && !bNaoLigar) {
        if (this.graph.hasNode(idNovo) && idNovo.startsWith('LI_')) { //neste caso, só liga com o nó já existente
          var resp = alert('O item já existe no gráfico. Este será selecionado:\n:' + idNovo);
          this.selecionaNoid(idNovo);
          return;
        }
      }
      idNovo = idNovo ? idNovo: ''; //idNovo = idNovo ?? ''
      descricaoNovo = descricaoNovo ? descricaoNovo: '';
      var dlgItemOriginal = document.getElementById('dlgItem');
      var dlgItem = document.getElementById('dlgItem').cloneNode(true); //clone para não mexer no original, soluciona problema de instabilidade (parava de funcionar depois de misturar tipos de consulta, cnpj e link)
      var camposTexto = dlgItem.getElementsByClassName('ajs-input');
      var dados = {};
      camposTexto[0].value= idNovo;
      camposTexto[1].value= descricaoNovo; 
      camposTexto[2].value= '';
      camposTexto[3].value= '';
    
      var campoImagem = camposTexto[4];
      if (1) {
        const img = document.createElement("img");
        img.id = "dlgItemEditar_imagem";
        img.alt = "Cole imagem aqui";
        img.height=100;
        img.width=100;
        img.title = "Para substituir a imagem, Cole (CTRL+V) aqui";
        campoImagem.appendChild(img);
      }
      
      dlgItemOriginal.parentNode.appendChild(dlgItem); // para dlgItem.outerHTML = '' funcionar no chrome
      dlgItem.outerHTML = ''; //receita de bolo para usar o dialog.confirm. sem isso  a linha de cima dava erro no chrome
      this.ativaAtalhos(false);
      this.base64Imagem = null;
      campoImagem.addEventListener('paste', editarIconeColarImagem);	
      
      dialog.confirm(dlgItem)
      //não funciona .set('defaultFocusOff', true)
      //não funciona .set('focus', camposTexto[0])
      .set('onfocus', () => { camposTexto[0].focus(); } )
      .set('onok', (closeevent, value) => { 
        this.ativaAtalhos(true); 
        var camposTexto = dlgItem.getElementsByClassName('ajs-input');
        //idNovo = camposTexto[0].value.toUpperCase().trim();
        idNovo = camposTexto[0].value.trim();
        descricaoNovo = camposTexto[1].value;
        var tnota = camposTexto[2].value;
        var tligacao = camposTexto[3].value;
        if (!idNovo) {
          alert('O Identificador não pode ser nulo. Tente novamente.');
          return;
        }
        if (idNovo.toLowerCase().startsWith('https://') || idNovo.toLowerCase().startsWith('http://')) {
          idNovo = 'LI_' + idNovo;
        } else if (idNovo.startsWith('"') && idNovo.endsWith('"')) { //aspas quando se copia o caminho completo pelo menu contextual no windows. não sei como fica em outros sistemas
          idNovo = 'AR_' + idNovo.slice(1,-1);
        } else if (idNovo.startsWith('C:\\') || idNovo.startsWith('D:\\') || (idNovo.substr(1,2)==':\\')) { //isso só vai funcionar no windows
          idNovo = 'AR_' + idNovo;
        } else if (idNovo.startsWith('LI_') || idNovo.startsWith('AR_')) { //não por em maiuscula, senão link para url não funciona
          //não faz nada
        } else {
          idNovo = idNovo.toUpperCase();
          idNovo = tipoPresumido(idNovo);
          while (this.graph.hasNode(idNovo)) {
            idNovo = prompt('Item novo:\n\nO identificador ' + idNovo + ' já existe no gráfico.\nAltere o novo identificador:', idNovo);
            if (idNovo===null) {
              return;
            }
            idNovo = idNovo.toUpperCase();
            idNovo = tipoPresumido(idNovo);
          }		
        }
        if (this.graph.hasNode(idNovo)) { //caso LI_ AR_
          alert('O identificador ' + idNovo + ' já existe no gráfico. Não será feita a inclusão');
          return;
        }
        /*
        if (idNovo.startsWith('PJ_')) {
          alert('Para inserir um PJ, use a opção Inserir CNPJ ou CPF (I)');
          this.ativaAtalhos(true);
          return;
        }*/
        descricaoNovo = idNovo.startsWith('PF_')?idNovo.substr(15):descricaoNovo;
        if (tligacao) {
          bNaoLigar = false;
        } 
        //dados.camada = bNaoLigar? 0 : 1; //ttt
        this.criarNovoNo(idNovo, descricaoNovo, tnota, tligacao, dados, bNaoLigar, bLigarEntre, bInverterLIgacaoPadrao);
        if (posicao) {
          this.layout.setNodePosition(idNovo, posicao.x, posicao.y);
          //console.log('setnodeposition: ' + posicao.x + ' ; ' +  posicao.y);
        }
        if (this.base64Imagem) {
          this.menu_faviconNosItens(this.base64Imagem);
        }
      }, function() { campoImagem.removeEventListener("paste", editarIconeColarImagem, false); 
        this.ativaAtalhos(true); }
      ).set('oncancel', function() { campoImagem.removeEventListener("paste", editarIconeColarImagem, false); 
                      this.ativaAtalhos(true);  })
      .set('title',"Novo Item (U)");
    
    },
    menu_faviconNosItens(imagemUrl) { 
      //se imageUrl===null, abre prompt para perguntar imagem
      //se !imageUrl ('' por exemplo), coloca favicon nos itens
      //se imageUrl, como essa url como imagem
      var imagemDefault;
      let no = this.graph.getNode(this.idnoSelecionado);
      var imagemDefault = no.data.imagem;	
      if (imagemUrl===null) {
        imagemUrl = prompt('Digite caminho da imagem para alterar os ícones dos itens selecionados. Para usar o favicon do site (caso o item for link), deixe o campo vazio.', imagemDefault);
        if (imagemUrl===null) {
          return;
        }
      }
      for (let noid of this.idNosSelecionados) {
        if (1 || noid.startsWith('LI_')) {
          faviconNoId(noid, imagemUrl, true);
        }
      }	
    },
    criarNovoNo(idNovo, descricaoNovo, nota, nomeLigacao, dados, bNaoLigar, bLigarEntre) {
      /*
      var no = {'id': idNovo,
             'descricao': descricaoNovo,
             'camada': 0,
             'situacao_ativa': true,
             'imagem': this.iconeF(idNovo), //'icone-grafo-id.png',
             'cor': 'yellow',
             'nota': nota}; */
      var nodados = {};
      if (dados) {
        nodados = JSON.parse(JSON.stringify(dados))
      }
      nodados.id = idNovo;
      nodados.descricao = descricaoNovo;
      nodados.nota = nota;
      /* não está colocando mais itens novos como camada=0
      if (nodados.camada) {
        nodados.camada = nodados.camada; // ? nodados.camada : 0; //coloca camada 0 só se for isolado inicialmente
      } */
      //nodados.situacao_ativa = nodados.situacao_ativa ? nodados.situacao_ativa : true;
      nodados.imagem = nodados.imagem ? nodados.imagem : this.iconeF(idNovo);
      //nodados.cor = nodados.cor ? nodados.cor : 'yellow';
      nodados.cor = nodados.cor ? nodados.cor : 'white';
      //console.log(JSON.stringify(nodados)); 
      this.graph.addNode(idNovo, JSON.parse(JSON.stringify(nodados)));
      
      if (idNovo.startsWith('LI_')) { //isto pode dar inconsistência com imagem em base64??
        setTimeout(function(){
           //menu_faviconNosItens(false);
           faviconNoId(idNovo, '');
        },1000);
      }
      
      if (this.idnoSelecionado) {
        var position = this.layout.getNodePosition(this.idnoSelecionado);
        //let angulo=Math.PI*2*Math.random();
        //this.layout.setNodePosition(idNovo, position.x + Math.random()*this.springLength-this.springLength/2, position.y + Math.random()*this.springLength-this.springLength/2);
        //this.layout.setNodePosition(idNovo, position.x, position.y + this.springLength);
        var angulo = this.pegaAnguloLigacaoDoItemSelecionado(false);
        this.layout.setNodePosition(idNovo, position.x + Math.cos(angulo)*this.springLength, position.y + Math.sin(angulo)*this.springLength);
      };
      this.menu_rendererAtivarParar(true, false);
      this.selecionaNoid(idNovo, true, true);
      //trocar ordem da seleção para as setas ficarem saindo do novo item somente quando tiver mais de dois itens
      let ids = [...this.idNosSelecionados];
      //console.log('idnoselecionados');
      //console.log(this.idNosSelecionados);
      if (bLigarEntre) {
        ids.splice(1, 0, idNovo); 
        if (ids.length==2) {
          let links = this.graph.getLinks(ids[0]);
          if (links && links.length==1) {
            ids.push(links[0].toId);
          } 
          /*
          for (linkNo of links) {
            
          } */
        }
        //menu_desligar_selecionados(true); 
      } else if (ids.length>2) {
        ids.pop(idNovo);
        ids.unshift(idNovo);
      }
      this.idNosSelecionados = new Set(ids);
      this.idnoSelecionado = idNovo; 
      this.listaIdNosInseridos.push(new Set([idNovo]));
      if (this.idNosSelecionados.size==1) {
        return;
      }
      //if (!menu_ligar_selecionados(true, nomeLigacao)) { 
      if (bLigarEntre) {
        this.menu_ligar_selecionados(false, nomeLigacao, true);
      } else if (!bNaoLigar && !menu_ligar_selecionados(true, nomeLigacao, true)) {
        this.renderer.moveTo(position.x, position.y);
        this.layout.pinNode(this.graph.getNode(idNovo),true);
        this.menu_rendererAtivarParar(true, false);
      }
      this.selecionaNoid(idNovo, false, false);
    },
    menu_ligar_selecionados(bEstrela, nomeLigacao, bSemMensagem) {
      // se bEstrela, liga o primeiro selecionado com todos os outros
      // se !bEstrela, tipo fila, liga linearmente do primeiro ao segundo, segundo ao terceiro e sucessivamente.
      if (this.idNosSelecionados.size<2) {
        if (!bSemMensagem) {
          notify.alert('Ligar nós selecionados', 'Não há itens selecionados. Selecione e tente novamente.', function(){ ; });
        }
        return;
      }
      //ligação já existe, então edita, apaga a ligação e cria nova.
      if ((this.idNosSelecionados.size==2) && !nomeLigacao) {
        var id1 = [...this.idNosSelecionados][0], 
          id2 = [...this.idNosSelecionados][1];
        var labelLigacao = '';	
        var ligExistente = this.graph.hasLink(id1, id2);
        if (ligExistente) {
          labelLigacao = ligExistente.data.label ? ligExistente.data.label : '';
        } else { 
          ligExistente = this.graph.hasLink(id2, id1);
          if (ligExistente) { 
            labelLigacao = ligExistente.data.label ? ligExistente.data.label : '';
            this.idNosSelecionados = new Set([id2, id1]); //inverte ordem para a direção da seta permanecer a mesma
          }
        } 
        if (ligExistente) {
          nomeLigacao = prompt('Digite o texto da ligação:', labelLigacao);
          if (nomeLigacao===null) return;
          this.menu_desligar_selecionados(false);
        }
      }	
      let label = nomeLigacao?nomeLigacao:'';
      let primeiroNo = [...this.idNosSelecionados][0];
      
      if (!bSemMensagem) {
        var mensagem = bEstrela ? 'Deseja ligar o item ' +  primeiroNo + ' aos itens ' + (this.idNosSelecionados.size-1) + ' selecionados?' : 'Deseja ligar os ' + this.idNosSelecionados.size + ' itens selecionados?';
        //mensagem += '\nDigite o texto da ligaçao (opcional):';
        if (!nomeLigacao) {
          if (nomeLigacao==='') {
            if (!confirm(mensagem)) {
              label = null;
            } 
          } else {
            mensagem += '\nDigite o texto da ligaçao (opcional):';
            label = prompt(mensagem, '');
          }
        }
        if (label===null) {
          return;
        }
      }
      var ligacoes = [];
      var anterior = null;
      var destino = null;
      var inicial = null
      for (let n of this.idNosSelecionados) {
        if (!inicial) {
          anterior = n;
          inicial = n;
        } else {
          destino = n;
          ligacoes.push({'origem': anterior,
                   'destino': destino,
                   'cor': this.corLigacaoLink, //'green',
                   'camada': 1,		   
                   'tipoDescricao': '', //'link',
                   'label': label});
          if (!bEstrela) {
            anterior = destino;
          } 
        }
      }
      /*
      if (!bEstrela) { //isso fecha o círculo
        anterior = destino;
        ligacoes.push({'origem': anterior,
                       'destino': inicial,
                       'cor': this.corLigacaoLink, //'green',
                       'camada': 1,		   
                       'tipoDescricao': '', //'link',
                       'label': label});
      } */ 
      var noLigacoes = {'no':[], 'ligacao':ligacoes, 'mensagem':''};
      this.inserirJson(noLigacoes,' Ligações. ');
      return true;
    },
    menu_desligar_selecionados(bRemoverTodasLigacoes) {
      //se bRemoverTodasLigacoes=false, só remove se a ligação for entre DOIS itens selecionados
      var resp;
      if (!this.idNosSelecionados.size) {
        notify.alert('Remover ligação', 'Não há itens selecionados. Selecione e tente novamente.', function(){ ; });
        return;
      }
      if (bRemoverTodasLigacoes) {
        resp = confirm('Deseja remover TODAS as ligações dos itens selecionados? Não será possível reverter.');
        if (!resp) return;
      }
    
      var slinkIds = new Set();
      while (true) { //loop, primeiro tenta apagar link ENTRE os selecionados, se não achar ligação, tenta apagar todas as ligações dos selecionados
        this.graph.forEachLink(function(link){
          if (link) {
            if ( (this.idNosSelecionados.has(link.fromId) && this.idNosSelecionados.has(link.toId)) ||
               ( bRemoverTodasLigacoes && (this.idNosSelecionados.has(link.fromId) || this.idNosSelecionados.has(link.toId)) ) ) {
                slinkIds.add(link); 
            }
          }
        });
        if (slinkIds.size) {
          break;
        }
        if (bRemoverTodasLigacoes) {
          if (!slinkIds.size) {
            notify.success('Não há ligações a remover.');
            return;
          }
          break;
        } else {
          if (!slinkIds.size) {
            resp = confirm('Não há ligações ENTRE os itens selecionados. Deseja remover TODAS as ligações dos itens selecionados?');
            if (!resp) {
              return;
            }
            bRemoverTodasLigacoes = true;	
          }
        }
      }
      for (let link of slinkIds) {
        var linkUIaux=null;
        try {
          linkUIaux = this.graphics.getLinkUI(link.id);
          element=document.getElementById('link_label_'+linkUIaux.attr('id'));
          element.parentNode.removeChild(element);
          this.graph.removeLink(link);
        } catch (e){; };		
      }
    },
    menu_rendererAtivarParar(bAtivar, bMostraMensagem) {
      var estadoAnterior = this.bRenderAtivado;
      if (!bAtivar) {
        this.renderer.pause();
        if (bMostraMensagem && this.bRenderAtivado) {
          notify.success('O leiaute foi pausado. Para ativar, pressione a Barra de Espaço.');
        }
      } else {
        this.renderer.resume();
        if (bMostraMensagem && !this.bRenderAtivado) {
          notify.success('O leiaute foi reiniciado. Para parar, pressione a Barra de Espaço.');
        }
      }
      this.bRenderAtivado = bAtivar;
      return estadoAnterior;
    },
    evento_teclasDown(e) {
      function testa(keyIn, pressShift, pressCtrl) {
        //não dá para usar alt key, porque isso abre o menu do navegador
        if (keyIn!=e.code) {
          return false;
        } else if (pressShift!=e.shiftKey) {
          return false;
        } else if (pressCtrl!=e.ctrlKey) {
          return false;
        } 
        return true;
      }
      if ((e.code.startsWith('Digit') && (e.code.length==6)) || (e.code.startsWith('Numpad') && (e.code.length==7) && (e.getModifierState('NumLock')))){
        var ns = e.code.substr(-1);
        var tipo = 'cnpj';
        if (e.shiftKey && !e.ctrlKey) {
          tipo = 'links';
        //} else if (!e.shiftKey && e.ctrlKey) {
        } else if (e.ctrlKey) {
            tipo = 'caminhos';	
        }
        if (('0' <= ns) && (ns <='9')) {
          if (ns=='0') {
            ns='10';
            //observação: javascript não aceita SHIFT+TeclaKeypd como atalho, também não aceita CTRL+SHIFT+0
            //menu_incluirCamada('', 10, tipo);
          } 
          var camadaInsercao = parseInt(ns);
          if ((camadaInsercao==1)&&(tipo=='cnpj')) {
            this.menu_incluir1Camada('');
          } else {
            if (tipo=='caminhos') {
              this.menu_caminhos(camadaInsercao, '', e.shiftKey);
            } else {
              this.menu_incluirCamada('', camadaInsercao, tipo);
            }
          }
          e.preventDefault();
          return;
        }
      } else if (testa('KeyZ', false, true)) { 
        this.menu_inserirDesfazer();
      } else if (testa('KeyJ', false, false)) { 
        this.menu_localiza_adjacentes();
      } else if (testa('KeyJ', true, false)) { 
        this.menu_localiza_componente();
      } else if (testa('KeyJ', false, true)) { 
        this.menu_localiza_itensComMaisLigacoes();
      } else if (testa('KeyI', false, false)) { 
        this.menu_inserir();
      } else if (testa('KeyU', false, false)) { 
        this.menu_ligar_novo('', '', true); //novo item sem ligação com selecionados
      } else if (testa('KeyU', true, false)) { 
        this.menu_ligar_novo('', '', false); //novo item com ligacao com selecionados
      } else if (testa('KeyU', false, true)) { 
        this.menu_ligar_novo('', '', false, true); //novo item com ligacao entre selecionados
      } else if (testa('KeyD', false, false)) { 
        this.menu_dados(false, this.idNoOnHover);
      } else if (testa('KeyD', true, false)) { 
        this.menu_dados(true, null);
      } else if (testa('KeyD', false, true)) { 
        menu_listaSelecao(true);
      } else if (testa('KeyA', false, false)) { 
        this.menu_abrirNovaAba(null, true);
      } else if (testa('KeyA', true, false)) { 
        this.menu_abrirNovaAba(null);
      } else if (testa('KeyA', false, true)) { 
        this.menu_selecionarTudo();
      } else if (testa('KeyA', true, true)) { 
        this.menu_selecionarInverte();
      } else if (testa('KeyQ', false, false)) {
        this.menu_quebraGraficoEmPartes();
      } else if (testa('KeyE', false, false)) { 
        this.menu_editar_no();	} 
      else if (testa('KeyB', false, false)) { 
        this.menu_abreBuscasEmSites();
      } else if (testa('KeyG', false, false)) { 
        this.menu_buscaEmSite('https://www.google.com/search?q=', 'N');
      } else if (testa('KeyG', true, false)) { 
        this.menu_GoogleMaps(true);;
      } else if (testa('KeyG', false, true)) { 
        this.menu_buscaEmSite('https://www.google.com/search?q=', 'S');
        //menu_links_google(false);
      } else if (testa('KeyH', false, false)) { 
        this.menu_links_google(false);
      } else if (testa('KeyH', true, false)) { 
        this.menu_links_google(true);
      } else if (testa('KeyN', false, false)) { 
        this.menu_rotulosCompletos(null);
      } else if (testa('KeyN', true, false)) { 
        this.menu_ligacoesExibe(null);
      } else if (testa('KeyF', false, false)) { 
        this.menu_localiza(false);
      } else if (testa('KeyF', true, false)) { 
        this.menu_localiza(true);
      } else if (testa('KeyF', false, true)) { 
        this.menu_localizaPorCampo(false);
      } else if (testa('KeyL', false, false)) { 
        this.menu_ligar_selecionados(true);
      } else if (testa('KeyL', true, false)) { 
        this.menu_desligar_selecionados(false);
      } else if (testa('KeyK', false, false)) { 
        this.menu_ligar_selecionados(false);
      } else if (testa('Delete', false, false)) { 
        this.menu_excluirNosSelecionados();
      } else if (testa('Delete', true, false)) { 
        this.menu_excluirTudo();
      } else if (testa('Delete', false, true)) { 
        this.removeIsolados(true);
      } else if (testa('Backspace', true, false)) { 
        this.excluirNoMantendoLinks();
      } else if (testa('KeyP', false, false)) { 
        this.menu_pinarNo(null);
      } else if (testa('KeyP', true, false)) { 
        this.menu_pinarDesfazerTudo();
      } else if (testa('KeyP', false, true)) { 
        this.menu_pinarUmNoEmCadaGrupo();		
      } else if (testa('KeyC', false, false)) { 
        this.menu_colorir();
      } else if (testa('KeyC', true, false)) { 
        this.menu_colorir('transparent');
      } else if (testa('KeyC', false, true)) { 
        this.menu_copiaClip();
      } else if (testa('KeyV', false, true)) { 
        this.menu_colaClip();
      } else if (testa('Space', false, false)) { 
        this.menu_rendererAtivarParar(!this.bRenderAtivado, true);
      } else if (testa('ArrowLeft', false, false)) { 
        this.menu_teclaLeft(false);
      } else if (testa('ArrowRight', false, false)) { 
        this.menu_teclaRight(false);	
      } else if (testa('ArrowUp', false, false)) { 
        this.menu_teclaUp(false);
      } else if (testa('ArrowDown', false, false)) { 
        this.menu_teclaDown(false);	
      } else if (testa('KeyO', false, false)) { 
        this.menu_exportaJSONServidorParaBaseLocal(true, '', 'operacao' );	
      } else {
        return;
      } 
      e.preventDefault();
    },

    menu_exportaJSONServidorParaBaseLocal(bSoSelecionados, comentario, acaoAlternativa) {
      var jsonDados = this.getRedeNosLigacoes(bSoSelecionados);
      if (jsonDados.no.length == 0) {
        notify.error('Não há itens para exportar.');
        return;
      }
      var url;
      if (acaoAlternativa) {
        url = base + 'envia_json/' + acaoAlternativa;
      } else {
        if (!comentario) {
          comentario = prompt('Digite um comentário para os dados inseridos na base local:', 'rede');
        }
        if (!comentario) {
          return;
        }
        url = base + 'json_para_base/' + encodeURIComponent(comentario);
      }
    
      fazFetch(url, jsonDados);
      
      const fazFetch = (url, jsonDados) => {
        document.body.style.cursor = 'wait';
        fetch(url, { method: 'post', body: JSON.stringify(jsonDados), headers: { "Content-type": "application/json" }, cache: "no-store" })
          .then(response => {
            if (response.status !== 200) {
              this.mensagemErroHttp(response);
              return;
            }
            response.json().then(data => {
              document.body.style.cursor = 'default';
              if (data.retorno) {
                const textoMensagem = acaoAlternativa ? 'Dados enviados.' : 'Os dados foram inseridos na base local.';
                this.exibe_mensagem_sucesso_erro(textoMensagem, data.mensagem);
              } else {
                notify.error('Aconteceu um erro. ' + data.mensagem);
              }
            });
          })
          .catch(err => {
            document.body.style.cursor = 'default';
            console.log('Fetch Error :-S', err);
            notify.error('Aconteceu um erro (Fetch error ' + err + ')');
          });
      }
    },    

    mensagemErroHttp(response) {
      let terro = 'Erro http ' +  response.status + ' - ' + response.statusText;
      console.log(terro);
      document.body.style.cursor = 'default';
      if (response.status==429) {
        notify.error(terro +'. Aguarde e tente novamente. ');
      } else {
        notify.error(terro);
      }
    },

    menu_teclaDown(bSemMensagem) { 
      //segue direção da seta, se chega no final do ramo, volta e entra no ramo pela esquerda
      //se houver vários itens selecionados, move para visualizar o último (anterior) da seleção
        /* //sintaxe antiga, antes desselecionada e só deixava o primeiro selecionado
        if (this.idNosSelecionados.size>1) {
          const lastValue = Array.from(this.idNosSelecionados).pop();
          this.selecionaNoid(lastValue, false, false);
          return;
        }
        */
        if (this.idNosSelecionados.size>1) {
          var lista = [...this.idNosSelecionados];
          lista.push(lista.shift());
          primeiroNoid = [...this.idNosSelecionados][0];
          selecionaSet(new Set(lista), primeiroNoid);
          return;
        }
        var noInicial = this.idnoSelecionado;
        var noid = this.idnoSelecionado;
        this.menu_teclaRight(true);
        if (noid != this.idnoSelecionado) {
          return;
        }
        var nosCaminho = new Set(noid);
        var passos = 0;
        while (true) {
          //console.log(this.idnoSelecionado);
          passos += 1;
          if (passos>this.graph.getNodesCount()*10) { //para evitar loop infinito
            this.selecionaNoid(noInicial, false, false);
            if (!bSemMensagem)  {
              notify.error('Não encontrou item seguinte.');
            }
          }
          nosCaminho.add(noid);
          //console.log('up');
          menu_teclaUp(true);
          if (noid == this.idnoSelecionado) { //não saiu do lugar, sair da rotina
            this.selecionaNoid(noInicial, false, false);
            if (!bSemMensagem)  {
              notify.error('Não encontrou item seguinte.');
            }
              break;			
          }		
          var knos = 0;
          var proximoNo = null;
          this.graph.forEachLinkedNode(this.idnoSelecionado, function(nodeaux, link){
            if (link.fromId==this.idnoSelecionado) { 
              knos += 1;
              if (knos==2) {
                proximoNo = link.toId;
                return;
              }
            }		
          });	
          if (knos>1) {
            this.selecionaNoid(proximoNo, false, false);
            if (!nosCaminho.has(this.idnoSelecionado)) {
              //console.log('saiu x1');
              break; 
            } else {
              menu_teclaUp(true);
            }
          }	
          noid = this.idnoSelecionado;
        }
      },

    menu_teclaUp(bSemMensagem) { //segue direção da seta
      var proximoNo = null;
      
      if (this.idNosSelecionados.size>1) {
        var lista = [...this.idNosSelecionados];
        lista.unshift(lista.pop());
        primeiroNoid = [...this.idNosSelecionados][0];
        this.selecionaSet(new Set(lista), primeiroNoid);
        return;
      }
    
      this.graph.forEachLinkedNode(this.idnoSelecionado, function(nodeaux, link){
        if (link.toId==this.idnoSelecionado) {
          proximoNo = link.fromId;
          return;
        }
      });	
      
      if (proximoNo) {
        this.selecionaNoid(proximoNo, false, false);
      } else if (!bSemMensagem) {
        notify.error('Não encontrou item anterior');
      }
    },

    menu_teclaRight(bSemMensagem) { //segue direção contrária da seta?
      var proximoNo = null;
      if (this.idNosSelecionados.size>1) {
        var lista = [...this.idNosSelecionados];
        lista.push(lista.shift());
        primeiroNoid = [...this.idNosSelecionados][0];
        this.selecionaSet(new Set(lista), primeiroNoid);
        return;
      }
      var k = 0;
    
      this.graph.forEachLinkedNode(this.idnoSelecionado, (nodeaux, link) => {
        if (!proximoNo) {
          if (link.fromId==this.idnoSelecionado) {
            proximoNo = link.toId;
            k += 1;
            if (k>1) {
              return;
            }
          }
        }
      });	
      
      if (proximoNo) {
        this.selecionaNoid(proximoNo, false, false);
      } else if (!bSemMensagem) {
        notify.error('Não encontrou item.');
      }
    },

    menu_teclaLeft(bSemMensagem) { //segue direção da seta
      var proximoNo = null;
      if (this.idNosSelecionados.size>1) {
        var lista = [...this.idNosSelecionados];
        lista.unshift(lista.pop());
        primeiroNoid = [...this.idNosSelecionados][0];
        this.selecionaSet(new Set(lista), primeiroNoid);
        return;
      }
    
      this.graph.forEachLinkedNode(this.idnoSelecionado, function(nodeaux, link){
        if (link.fromId==this.idnoSelecionado) {
          proximoNo = link.toId;
          return;
        }		
      });	
      
      if (proximoNo) {
        this.selecionaNoid(proximoNo, false, false);
      } else if (!bSemMensagem) {
        notify.error('Não encontrou item.');
      }
    },

    menu_colaClip() {
      var jsonDados;
      try {
       jsonDados = JSON.parse(localStorage.getItem('clipboard'));
      } catch (e) {
        notify.error('Não há itens na área de transferência.');
        return false;	
      }
      if (jsonDados.no.length==0) {
        notify.error('Não há itens para colar.');
        return false;
      }
    
      this.inserirJson(jsonDados, ' Colou itens da área de transferência. ', true);
    },

    menu_copiaClip() { //xx5
      var jsonDados;
      jsonDados = this.getRedeNosLigacoes(true);
      if (jsonDados.no.length==0) {
        notify.error('Não há itens para copiar.');
        return false;
      }
      
      localStorage.setItem('clipboard', JSON.stringify(jsonDados));
      notify.success('Copiou itens para a área de transferência.');
      return true;
    },

    getRedeNosLigacoes(bSoSelecionados, setNos, bSemPosicao) {	
      //se setNos=null, pega todos os itens do gráfico ou apenas ou selecionados
      //se setNos for especificado, pega esses da lista
      //return dojo.toJson({'no':listaNoInicial, 'ligacao':listaLigacaoInicial});
      //return JSON.stringify({'no':listaNoInicial, 'ligacao':listaLigacaoInicial}, filtroDeMembros);
      var nosAux=[], ligacoesAux=[];
      //pega dados apartir do vivagraph, assim não é preciso fazer ajustes em listaLigacaoInicial ou listaNoInicial
      var setAux = setNos ? setNos : this.idNosSelecionados;
      
      if (!setNos && !bSoSelecionados) { // || setNos) {
        this.graph.forEachNode( 
          function(node) {
            var nodedata = JSON.parse(JSON.stringify(node.data));
            if (!bSemPosicao) {
              nodedata['posicao'] = this.layout.getNodePosition(node.id);
              nodedata['pinado'] = this.layout.isNodePinned(node);
            } else {
              try {
                delete nodedata['posicao'];
                delete nodedata['pinado'];
              } catch (e){; };
            }
            if (setNos) { 
              if (setNos.has(node.id)) {
                nosAux.push(nodedata);	
              }
            } else {
              if ((!bSoSelecionados) || this.idNosSelecionados.has(node.id)) {
                nosAux.push(nodedata);			
              }
            }
          }
        );
      } else { //!bSoSelecionados
        for (let noid of setAux) {
          var node = this.graph.getNode(noid);
          if (node) {
            var nodedata = JSON.parse(JSON.stringify(node.data));
            if (!bSemPosicao) {
              nodedata['posicao'] = this.layout.getNodePosition(node.id);
              nodedata['pinado'] = this.layout.isNodePinned(node);
            } else {
              try {
              delete nodedata['posicao'];
              delete nodedata['pinado'];
              } catch (e){; };
            }
            nosAux.push(nodedata);				
          }
        }
      }
      this.graph.forEachLink((link) => {
        /* ligacoesAux.push(
          {"origem":link.fromId,
          "destino":link.toId ,
          "cor":link.data.cor,
          "camada":link.data.camada,
          "tipoDescricao": link.data.tipoDescricao,
          "label": link.data.label
          }
        ); */
        if (setNos) { 
          if (setNos.has(link.fromId) && setNos.has(link.toId)) {
            ligacoesAux.push(link.data);	
          }		
        } else {
          if ((!bSoSelecionados) || (this.idNosSelecionados.has(link.fromId) && this.idNosSelecionados.has(link.toId))) {
            ligacoesAux.push(JSON.parse(JSON.stringify(link.data)));	
          }
        }
      }); 
      return {'no':nosAux, 'ligacao':ligacoesAux};
    },

    menu_colorir(corEscolhida) {
      colorir = (n, cor) => {
        var node = this.graphics.getNodeUI(n);
        try {
          node.getElementsByTagName('rect')[0].setAttribute('fill',cor);
        } catch (e){; };
        var no = this.graph.getNode(n);
        if (no) {
          no.data.cor = cor;
        }
    
      }
      if (!this.idNosSelecionados.size) {
        notify.alert('Colorir', 'Não há itens selecionados para colorir. Selecione e tente novamente.', function(){ ; });
        return;
      }
      var cor = document.querySelector("#palheta").value; 
      if (corEscolhida) {
        cor = corEscolhida;
      }
      var tmensagem = (this.idNosSelecionados.size==1) ? 'Colorir 1 nó.' : ('Colorir '+ this.idNosSelecionados.size + ' nós selecionados.');
      var tsucesso = (this.idNosSelecionados.size==1) ? '1 nó foi colorido.' : (this.idNosSelecionados.size + ' nós foram coloridos.');
      for (let n of this.idNosSelecionados) {
        colorir(n, cor);
      }			
      notify.success(tsucesso);
    },

    menu_pinarUmNoEmCadaGrupo(bfixar){ 
      var listaGrupos = this.separaGrupos(0); //lista de sets 
      var sfixados = new Set();
      for (let sgrupo of listaGrupos) {
        let nid = [...sgrupo][0];
        let no = this.graph.getNode(nid);
        this.layout.pinNode(no, true);
        sfixados.add(nid);
      }
      this.selecionaSet(sfixados);
      notify.success('Cada grupo teve um nó fixado.');
    },

    menu_pinarDesfazerTudo(){ 
      var layout = this.layout;
      this.graph.forEachNode(
        function(node) {
          this.layout.pinNode(node, false);
        }	
      );
      notify.success('Todos os nós foram desafixados.');
    },

    menu_pinarNo(bfixar){
      var layout = this.layout;
      for (let n of this.idNosSelecionados) {
        let no = this.graph.getNode(n);
        if (bfixar===null) { //inverte
          layout.pinNode(no, !layout.isNodePinned(no));
        } else if (bfixar==1) {
          layout.pinNode(no, true);
        } else if (bfixar==0) {
          layout.pinNode(no, false);
        }
      }
    //	var no = this.graph.getNode(this.idnoSelecionado);
    //	layout.pinNode(no, !layout.isNodePinned(no));
    },

    excluirNoMantendoLinks() { 
      if (this.idNosSelecionados.size!=3) {
        notify.error('Para usar esta rotina, deve haver três itens selecionados.');
        return;
      }
      var listaNos = [...this.idNosSelecionados];
      resp = confirm('Deseja remover o item ' + listaNos[1] + '?');
      if (!resp) {
        return;
      }
      this.removeIdNo(listaNos[1]);
      this.selecionaSet(new Set([listaNos[0], listaNos[2]]));
      this.menu_ligar_selecionados(false, '', true);
    },

    removeIsolados(bExibeMensagem) {
      var quantidadeLigacoes;	
      var sNosRemover;	
      var contagem=0;
      if (!confirm('Deseja remover os itens sem ligação? Não será possível reverter!!')) {
        return;
      }
      sNosRemover = new Set();	
      this.graph.forEachNode(function(node) {
        if (node) {
          
          quantidadeLigacoes = 0 ;
          getlinks = this.graph.getLinks(node.id);
          if (getlinks) {
            quantidadeLigacoes += getlinks.length;
          }
          if (quantidadeLigacoes == 0) {
            sNosRemover.add(node.id);
          }
        }
      });
      contagem = sNosRemover.size;
      if (sNosRemover.size) {
        sNosRemover.forEach(removeIdNo);
      }
      if (bExibeMensagem) {
        if (contagem>0) {
          notify.success('Foram removidos ' + contagem + ' items.');
        } else {
          notify.success('Não foram localizados itens isolados para remover.');
        }
      }
    },

    menu_excluirTudo() {
      var setNos = new Set();
      this.graph.forEachNode( function(node) { 
        setNos.add(node.id);
      });
      dialog.confirm('Excluir todos os '+ setNos.size +  ' nós.', 'Deseja prosseguir? Não será possível reverter a exclusão.', 
          () => { 
            for (let n of setNos) {
              this.removeIdNo(n);
            }			
            notify.success(setNos.size + ' nós foram excluídos.') 
          }
                , function(){ ;}
      );
    },

    menu_excluirNosSelecionados(bSemConfirmar) {
      if (!this.idNosSelecionados.size) {
        if (!bSemConfirmar) {
          notify.alert('Exclusão', 'Não há itens selecionados para exclusão. Selecione e tente novamente.', function(){ ; });
        }
        return;
      }
      var tmensagem = (this.idNosSelecionados.size==1) ? 'Excluir 1 nó.' : ('Excluir '+ this.idNosSelecionados.size + ' nós selecionados.');
      var tsucesso = (this.idNosSelecionados.size==1) ? '1 nó foi excluído.' : (this.idNosSelecionados.size + ' nós foram excluídos.');
      var fExcluir = function(){ 
        for (let n of this.idNosSelecionados) {
          this.removeIdNo(n);
        }			
        this.idnoSelecionado=null;
        notify.success(tsucesso);
      };
      if (bSemConfirmar) {
        fExcluir();
        return;
      }
      dialog.confirm(tmensagem, 'Deseja prosseguir? Não será possível reverter a exclusão.', 
          fExcluir
                , function(){ ;}
      );
    },

    menu_localizaPorCampo(bFiltroNosSelecionados) {
      //bFiltroNosSelecionados, só procura em idNosSelecionados, senão procura em todos os itens
      const localizaNoPorCampo = (texto, bFiltroNosSelecionados) => { //retorna n. de nos localizados
        //bFiltroNosSelecionados, só procura em idNosSelecionados, senão procura em todos os itens
        var idNosLocalizados= new Set(); 
        var primeiroNoid = null;
        var comparacoes = texto.split(';');
        this.graph.forEachNode(function(node){
          var data = node.data;
          var campo, valor, valorDif;
          for (let comp of comparacoes) {
            var [campo, valorDif] = comp.split('<>');
            if (!valorDif) {
              var [campo, valor] = comp.split('=');
            }
            //valor = replaceAll(replaceAll(valor, '"', ''), "'", "");
            valor = valor.replaceAll( '"', '').replaceAll( "'", "");
            if (data[campo]) {
              if ( (Boolean(valor) && (data[campo]==valor)) ||
                (Boolean(valorDif) && (data[campo]!=valorDif))) {
                idNosLocalizados.add(node.id);
                if (!primeiroNoid) {
                  primeiroNoid = node.id;
                }
              }
            }
          }
        });
        return this.selecionaSet(idNosLocalizados, primeiroNoid);
      }
      this.ativaAtalhos(false);
      var brenderer = this.menu_rendererAtivarParar(false, false);
      var tmensagem = bFiltroNosSelecionados? 'Filtrar nos itens selecionados':'Localizar item na tela por campo'; 
      notify.prompt( tmensagem, 'Digite o nome do parâmetro do campo, por exemplo, cor="red"', ''
         , function(evt, texto) { 
          if (texto) { 
            contagem = localizaNoPorCampo(texto, bFiltroNosSelecionados);
            if (contagem) {
              notify.success('Localizou '+ contagem + ' ocorrencias(s) de ' + texto);
            } else {
              notify.error('Não localizou ' + texto);
            };
          }
          this.menu_rendererAtivarParar(brenderer, false);
          this.ativaAtalhos(true);
        }, function() { 
          this.ativaAtalhos(true);
          this.menu_rendererAtivarParar(brenderer, false);
        });
    },

    menu_localiza(bFiltroNosSelecionados) {
      //bFiltroNosSelecionados, só procura em idNosSelecionados, senão procura em todos os itens
      this.ativaAtalhos(false);
      var brenderer = this.menu_rendererAtivarParar(false, false);
      var tmensagem = bFiltroNosSelecionados? 'Filtrar nos itens selecionados':'Localizar item na tela'; 
      notify.prompt( tmensagem, 'Digite partes do Nome, CNPJ ou CPF. Utilize ponto e vírgula (;) como separador para buscar mais de um termo.', ''
         , function(evt, texto) { 
          if (texto) { 
            contagem = this.localizaNo(texto, bFiltroNosSelecionados);
            if (contagem) {
              notify.success('Localizou '+ contagem + ' ocorrencias(s) de ' + texto);
            } else {
              notify.error('Não localizou ' + texto);
            };
          }
          this.menu_rendererAtivarParar(brenderer, false);
          this.ativaAtalhos(true);
        }, function() { 
          this.ativaAtalhos(true);
          this.menu_rendererAtivarParar(brenderer, false);
        });
    },

    localizaNo(texto, bFiltroNosSelecionados) { //retorna n. de nos localizados
      //bFiltroNosSelecionados, só procura em idNosSelecionados, senão procura em todos os itens
      var textoU = texto.toUpperCase(); 
      var idNosLocalizados= new Set(); 
      var primeiroNoid = null;
      texto = texto.trim().replace(/\n/g,';').replace(/\t/g,';');
      if (texto.search(' ')>=0) {
        let bEspaco = confirm('O texto a procurar tem espaço(s). Utiliza espaço como separador?');
        if (bEspaco) {
          texto = texto.replace(/\s/g,';')
        }
      }
      this.graph.forEachNode(function(node){
        for (let taux of texto.toUpperCase().split(';')) { //usa ; como separador para busca de mais de um termo
          let t = taux.trim();
          if (!t) continue;
          if ((node.id.toUpperCase().search(t)!= -1) || (node.data.descricao.toUpperCase().search(t)!=-1)
            || (node.data.nota.toUpperCase().search(t)!= -1)) {
            if ((!bFiltroNosSelecionados) || ((bFiltroNosSelecionados) && (this.idNosSelecionados.has(node.id)))) {
              idNosLocalizados.add(node.id);
              if (!primeiroNoid) {
                primeiroNoid = node.id;
              }
            }
          }
        }
      });
      return this.selecionaSet(idNosLocalizados, primeiroNoid);
    },

    selecionaSet(sidNos, primeiroNoid) {
      //seleciona um set de ids, se primeiroNoid for informado, centraliza nesse id
      if (sidNos.size) {
        this.selecionaNoid(null, false); //apaga seleção primeiro
        for (let n of sidNos) {
          this.selecionaNoid(n, true);
        }
        if (primeiroNoid) {
          if (this.idNosSelecionados.has(primeiroNoid)) {
            this.idnoSelecionado = primeiroNoid;
            //ajustaMenuContextual(this.idnoSelecionado);
            //var position = this.renderer.getLayout().getNodePosition(this.idnoSelecionado);
            var position = this.layout.getNodePosition(this.idnoSelecionado);
            this.renderer.moveTo(position.x, position.y);
          } else {
            notify.error('erro na funcao selecionaSet');
          }
        }
        return this.idNosSelecionados.size;
      } else {
        return 0;
      }
    },

    menu_ligacoesExibe(bTipo) { 
      if (bTipo===null) {
        this.bMostraLigacao = !this.bMostraLigacao;
      } else if (bTipo) {
        this.bMostraLigacao= true;
      } else {
        this.bMostraLigacao= false;
      }
      //zoom in e out para dar um refresh na tela
      this.renderer.zoomIn();
      this.renderer.zoomOut();
    },

    menu_rotulosCompletos(bTipo) { 
      if (bTipo===null) {
        this.kTipoRotulo = (this.kTipoRotulo + 1) % 4;
      } else if (bTipo) {
        this.kTipoRotulo=0;
      } else {
        this.kTipoRotulo=2;
      }
      this.graph.forEachNode( function(node) {
        var ui=this.graphics.getNodeUI(node.id); 
        var [identificador, nome, nota] = this.labelsNo(node, this.kTipoRotulo); //node.data.label.split('\n');
        ui.getElementsByTagName('tspan')[0].text(identificador);
        ui.getElementsByTagName('tspan')[1].text(nome);
        ui.getElementsByTagName('tspan')[2].text(nota);
      });
    },

    menu_GoogleMaps(bMostraMensagem) {
      var data = this.graph.getNode(this.idnoSelecionado).data;
      if (data.logradouro) {
        var strUrl = 'https://www.google.com.br/maps/place/' + data.logradouro + ',' + data.municipio + '/' + data.uf;
        var novaJanela=window.open(strUrl);
        novaJanela.focus();
      } else if (bMostraMensagem) {
        notify.error('Não há endereço cadastrado.');
      }
    },

    menu_abreBuscasEmSites() {
      menu_buscaEmSite('https://www.reclameaqui.com.br/busca/?q=', null, true);
      menu_buscaEmSite('http://portaldatransparencia.gov.br/busca?termo=');
      menu_buscaEmSite('https://www.jusbrasil.com.br/busca?q=');	
      menu_buscaEmSite('https://www.escavador.com/busca?q=');	
      menu_buscaEmSite('https://duckduckgo.com/?q=');	
      menu_buscaEmSite('https://www.bing.com/search?q=');
      menu_GoogleMaps(false);
      menu_buscaEmSite('https://www.google.com/search?q=', 'N');
    },

    menu_buscaEmSite(siteUrl, perguntaParametroAdicionalGoogle, bsemaspas){
      //perguntaParametroAdicionalGoogle=null, padrão; se =='S' pergunta parametro adicional para google, se =='N' adiciona this.termoBuscaGoogle
      if (perguntaParametroAdicionalGoogle=='S') {
        let resp = prompt('Insira termo a ser adicionado nas próximas buscas do Google pela tecla G:\nObservação: Houve uma alteração na tecla de atalho, para exibir links do google, utilize a tecla H. ', this.termoBuscaGoogle);
        if (resp===null) return;
        this.termoBuscaGoogle = resp;
      }
      var parametroAdicional = '';
      //var parametro = replaceAll(this.graph.getNode(this.idnoSelecionado).data.descricao,'&', ' ');
      var parametro = this.graph.getNode(this.idnoSelecionado).data.descricao.replaceAll('&', ' ');
      if (perguntaParametroAdicionalGoogle) {
        parametroAdicional = perguntaParametroAdicionalGoogle ? '+' + this.termoBuscaGoogle: '';
      }
      if (!parametro) {
        parametro = this.graph.getNode(this.idnoSelecionado).data.id.substr(3);
      }
      if (bsemaspas) {
        var strUrl = siteUrl + parametro.replaceAll(' ','+') + parametroAdicional;		
      } else {
        var strUrl = siteUrl + '"' + parametro + '"' + parametroAdicional;
      }
      window.open(strUrl).focus();
    },

    menu_editar_no(noid) {
      //edita dados item, se o usuário alterar o id, cria novo item.
      if (!noid) {
        noid = this.idnoSelecionado;
      }
      var idNovo =  noid;
      var node = this.graph.getNode(noid);
      if (!node) {
        alert(noid + ' não foi encontrado.')
        return;
      }
      var ui=this.graphics.getNodeUI(noid); 
      var dlgItemOriginal = document.getElementById('dlgItemEditar');
      var dlgItem = document.getElementById('dlgItemEditar').cloneNode(true); //clone para não mexer no original, soluciona problema de instabilidade (parava de funcionar depois de misturar tipos de consulta, cnpj e link)
      var camposTexto = dlgItem.getElementsByClassName('ajs-input');
      camposTexto[0].value= noid;
      camposTexto[1].value= node.data.descricao;
      camposTexto[2].value= node.data.nota;
      //camposTexto[3] = texto ligacao, não existe mais para o formulário de edição
        
      var campoImagem = camposTexto[3];
      if (1) {
        const img = document.createElement("img");
        var nodeUI = this.graphics.getNodeUI(noid);
        if (nodeUI) {
          img.src = nodeUI.getElementsByTagName('image')[0].getAttribute('xlink:href');
        } 
        img.id = "dlgItemEditar_imagem";
        img.alt = "Cole imagem aqui";
        img.height=100;
        img.width=100;
        img.title = "Para substituir a imagem, Cole (CTRL+V) aqui";
        campoImagem.appendChild(img);
      }
      
      dlgItemOriginal.parentNode.appendChild(dlgItem); // para dlgItem.outerHTML = '' funcionar no chrome
      dlgItem.outerHTML = ''; //receita de bolo para usar o dialog.confirm. sem isso  a linha de cima dava erro no chrome
      ativaAtalhos(false);
      this.base64Imagem = null;
      campoImagem.addEventListener('paste', editarIconeColarImagem);
      
      dialog.confirm(dlgItem).set('onok', function(closeevent, value) { 
        ativaAtalhos(true); 
        var camposTexto = dlgItem.getElementsByClassName('ajs-input');
        //idNovo = camposTexto[0].value;
        var idNovo = camposTexto[0].value;
        var tligacao = camposTexto[3].value;
        if (!idNovo) {
          alert('O Identificador não pode ser nulo.');
          return;
        }
        
        if (idNovo.toLowerCase().startsWith('https://') || idNovo.toLowerCase().startsWith('http://')) {
          idNovo = 'LI_' + idNovo;
        } else if (idNovo.startsWith('"') && idNovo.endsWith('"')) { //aspas quando se copia o caminho completo pelo menu contextual no windows. não sei como fica em outros sistemas
          idNovo = 'AR_' + idNovo.slice(1,-1);
        } else if (idNovo.startsWith('C:\\') || idNovo.startsWith('D:\\') || (idNovo.substr(1,2)==':\\')) { //isso só vai funcionar no windows
          idNovo = 'AR_' + idNovo;
        } else if (idNovo.startsWith('LI_') || idNovo.startsWith('AR_')) { //não por em maiuscula, senão link para url não funciona
          //não faz nada
        } else {
          idNovo = idNovo.toUpperCase();
          idNovo = tipoPresumido(idNovo);
          while (this.graph.hasNode(idNovo) && (noid!=idNovo) ) {
            idNovo = prompt('Editar Item:\n\nO identificador ' + idNovo + ' não pode ser utilizado, pois já existe no gráfico.\nAltere o identificador:', idNovo);
            if (idNovo===null) {
              return;
            }
            idNovo = idNovo.toUpperCase();
            idNovo = tipoPresumido(idNovo);
          }
        }
    
        if (noid==idNovo) {
          node.data.descricao = camposTexto[1].value;
          node.data.nota = camposTexto[2].value;
          //poderia se usar reinsereComNovoId(idNovo, idNovo) ao invês de trocar uis
          ui.getElementsByTagName('tspan')[1].text(node.data.descricao);
          ui.getElementsByTagName('tspan')[2].text(node.data.nota);
          
        } else {
          if (this.graph.hasNode(idNovo)) { //caso LI_ AR_
            alert('O identificador ' + idNovo + ' já existe no gráfico. Não será feita a inclusão');
            return;
          }
          if ([ 'PF_', 'PJ_', 'EN_', 'TE_', 'EM_'].includes(noid.substr(0,3))) { 
            if (!confirm('ESTA OPERAÇÃO NÃO É RECOMENDADA!! Alterar este identificador pode causar INCONSISTÊNCIAS e não será possível buscar informações no Banco de Dados. Deseja prosseguir?')) {
              return;
            }
          }	
          node.data.descricao = camposTexto[1].value;
          node.data.nota = camposTexto[2].value;
          reinsereComNovoId(noid, idNovo); //xxx se alterar o id, essa rotina apaga e corrige .data em no e nas ligações.
        }		
        if (nodeUI && this.base64Imagem) {
          menu_faviconNosItens(this.base64Imagem);
        }
      }, function() { 
        campoImagem.removeEventListener("paste", editarIconeColarImagem, false);
        ativaAtalhos(true); }
      ).set('oncancel', function() { campoImagem.removeEventListener("paste", editarIconeColarImagem, false); 
                      ativaAtalhos(true); })
      .set('title',"Editar Item (E)");
    },

    menu_quebraGraficoEmPartes(){
      var ngrupos = prompt('Deseja quebrar este gráfico em outras abas em partes menores? Especifique a quantidade aproximada de novas abas (máximo de 10)', 4);
      ngrupos = parseInt(ngrupos);
      if (!ngrupos) {
        return;
      }
      if (ngrupos>10) {
        notify.error('Escolha uma quantidade menor de novas abas.'); 
        return;
      }
      var tamanho = Math.floor(this.graph.getNodesCount()/ngrupos)+1;
      //console.log(tamanho);
      var conjuntos = this.separaGrupos(tamanho);
      if (conjuntos.length==1) {
        alert('O gráfico não pode ser separado.');
        return;
      }
      var k = 0;
      for (let conj of conjuntos) {
        var sconj = new Set(conj);
        //este alert serve para criar um delay entre as requisições... Se não houver pausa o servidor tenta criar arquivos json com nome repetido o que vai dar erro depois.
        resp = confirm('Deseja criar uma nova aba com ' + sconj.size + ' elementos?'); 
        if (resp) {
          k += 1;
          var jsonDados = getRedeNosLigacoes(false, sconj, true);
          this.openWindowWithPost({'json':jsonDados}, ''); //menu_copiaItensParaOutraAba não funciona neste caso, porque há uma demora para abrir a nova aba
      
        } else {
          resp = confirm('Deseja abrir outras abas?');
          if (!resp) {
            break;
          }
        }
      }
      notify.success('Foram inseridas ' + k + ' novas abas');
    },

    openWindowWithPost(data, url) {
      //https://stackoverflow.com/questions/5684303/javascript-window-open-pass-values-using-post
        var form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
      form.rel = 'opener'; //evitar erro de window.opener is null quando clica no mapa para pedir dados
        //form.action = base + 'selecao_de_itens/' ; 
      form.action = url.startsWith('http') ? url : base + url;
        form.style.display = "none";
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = "data";
      input.value = JSON.stringify(data);
      form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },

    separaGrupos(tamanhoGrupo) {
      //pega os nos do gráfico e separa em grupos até tamanhoGrupo, mantendo os itens conectados juntos
      //se tamanhoGrupo=0, retorna os subcomponentes (árvores, regiões conectadas) do grafico, listaGrupos = lista de sets = [set(componente1), set(componente2)...]
      //se tamanhoGrupo<>0, retorna lista de conjuntos = [[conjunto1], [conjunto2],..]
      var di = {};
      var bMudou = false;
      var contagemAnterior = -1;
      //inicializa di com id, o loop while irá fazer que di[elemento] seja o menor para os que estão ligados
      this.graph.forEachLink(function(link){
        di[link.fromId] = link.fromId;
        di[link.toId] = link.toId;
      });
      this.graph.forEachNode(function(node){
        di[node.id] = node.id;
      });
      var sgrupos = null;
      while (1) {
        bMudou = false;
        this.graph.forEachLink(function(link){
          var menor = (di[link.fromId]<=di[link.toId]) ? di[link.fromId] : di[link.toId] ;
          if (di[link.fromId] != di[link.toId]) {
            bMudou = true;
          }
          di[link.fromId] = menor;
          di[link.toId] = menor;
        });
        
        sgrupos = new Set(Object.values(di));
        if ((sgrupos.size==contagemAnterior)&&(!bMudou)) {
          break;
        }
        contagemAnterior = sgrupos.size;
        //console.log(sgrupos.size);
        //break;
      }
      //dgrupo associa o menor valor do grupo com um set com os elementos do grupo
      var dgrupo = {};
      for (const [k, v] of Object.entries(di)) {
        var value = dgrupo[v];
        if (value == null) {
          dgrupo[v] = new Set();
        }
        dgrupo[v].add(k);	
      }
    
      //cada elemento de listaGrupos é set com itens conectados
      var listaGrupos = [];
      for (const v of Object.values(dgrupo)) {
        listaGrupos.push(v);
      }
    
      listaGrupos.sort(function(a,b){
        return b.size - a.size; //ordem decrescente, size porque os elementos são sets
      });
      if (!tamanhoGrupo) {
        return listaGrupos; //[ set1, set2,...]
      }
      //conjuntos, tenta separar os conjuntos com no máximo tamanhoGrupo, preservando as ligações
      //se o grupo conexo já for maior que tamanhoGrupo, coloca sem quebrá-lo
      
      var conjuntos = [];
      var tamanhoAux = 0;
      var caux = []; //new Set();
      for (const v of listaGrupos) {
        if ((caux.length==0)||((v.size+caux.length)<tamanhoGrupo)) {
          Array.prototype.push.apply(caux, Array.from(v));
        } else {
          conjuntos.push(JSON.parse(JSON.stringify(caux)));
          caux = Array.from(v);
        }
        if (caux.length>=tamanhoGrupo) {
          conjuntos.push(JSON.parse(JSON.stringify(caux)));
          caux = []; //new Set();
        }
      }
      if (caux.length) {
        conjuntos.push(JSON.parse(JSON.stringify(caux)));
      }
      return conjuntos; //[ lista1, lista2,..]
    },

    menu_selecionarInverte() {
      //inverte a seleção
      var snos = new Set(this.idNosSelecionados);
      this.selecionaNoid(null, false); //apaga seleção
      this.graph.forEachNode(
        (node) => {
          if (!snos.has(node.id)) {
            //var nodeUI = this.graphics.getNodeUI(node.id);
            this.selecionaNoid(node.id, true, true);
          }
        }	
      );
      notify.success('Foram selecionados ' + this.idNosSelecionados.size+ ' itens.');
    },

    menu_selecionarTudo() {
      this.graph.forEachNode(
        function(node) {
          this.selecionaNoid(node.id, true, true);
        }	
      );
      notify.success('Foram selecionados ' + this.graph.getNodesCount() + ' itens.');
    },

    menu_listaSelecao(bNovaJanela) {
      if (!this.idNosSelecionados) { 
        return; 
      }
      var ht = '';
      for (let n of this.idNosSelecionados) {
        var noData = this.graph.getNode(n).data;
        ht += "<b>ID: </b> " + noData.id;
        if (noData.descricao && (!noData.id.includes(noData.descricao))) { 
          ht += " ("+ noData.descricao + ")<br>";
          ht += " ("+ noData.descricao + ")<br>";
        } else {
          ht += "<br>";
        }
        if (noData.nota) {
          ht += "<b>Nota: </b> "+ noData.nota + "<br>";
        }
      }
      if (ht) {
        //document.getElementById("corpo").disabled = true; 
        if (bNovaJanela) { 
          //var win = window.open('/rede/dados_janela/'+this.idnoSelecionado, this.idnoSelecionado,'resizable,scrollbars,status,menubar=no, toolbar=no, personalbar=no, location=no, titlebar=0, height=500, width=400');
          var win = window.open('', this.idnoSelecionado,'resizable,scrollbars,status,menubar=no, toolbar=no, personalbar=no, location=no, titlebar=0, height=500, width=400');
          win.document.body.innerHTML = "<!DOCTYPE html><html><head><title>Itens Selecionados</title></head><body  >" + ht + "</body></html>";
        } else {
          this.ativaAtalhos(false); //para permitir ctrl+c
          notify.alert("Itens selecionados: \n" + ht, function(){ativaAtalhos(true);});
        }
      } 
    },

    menu_dados(bNovaJanela, idNo) {
      var idin = idNo? idNo : this.idnoSelecionado;
    
      if (bNovaJanela) {
        if (idNo) {
          window.open(base+'consulta_cnpj/?cnpj='+idNo.substr(3));
        } else {
          var listaIds = [...this.idNosSelecionados].filter(function(id) {return id.startsWith('PJ_');}).slice(0,100).join('; ');
          window.open(base+'consulta_cnpj/?cnpj='+listaIds);
        }
        return;
      }
    
      if (!idin) return;
      /*
      if (bNovaJanela && idin.startsWith('PJ_')) {
        window.open(base+'consulta_cnpj/?cnpj='+idin.substr(3));
        return;
      }*/
    
      function mostraResultado(idin, ht) {
        if (bNovaJanela) { 
            //var win = window.open('/rede/dados_janela/'+this.idnoSelecionado, this.idnoSelecionado,'resizable,scrollbars,status,menubar=no, toolbar=no, personalbar=no, location=no, titlebar=0, height=500, width=400');
            var win = window.open('', idin,'resizable,scrollbars,status,menubar=no, toolbar=no, personalbar=no, location=no, titlebar=0, height=500, width=400');
            win.document.body.innerHTML = "<!DOCTYPE html><html><head><title>" + idin + "</title></head><body  >" + ht + "</body></html>";
        } else {
          ativaAtalhos(false);
          notify.alert("Dados de "+idin, ht, function(){ativaAtalhos(true);});
        }	
      }
      
      let node = this.graph.getNode(idin);
      var noData = node.data;
      var ht = '';
      if (!idin.startsWith('PJ_')) {
        if (idin.startsWith('PF_')) {
          ht += "<b>ID: </b> " + idin + "<br>";
          if (noData.descricao) { 
            ht += "<b>Descrição: </b> "+ noData.descricao + "<br>";
          }
          if (noData.nota) {
            ht += "<b>Nota: </b> "+ noData.nota + "<br>";
          }
          let tf = this.textoFlag(node, true); //ttt
          if (tf) {
            ht += "<br>" + tf + "<br>";
          }
        } else if (idin.startsWith('LI_')) { //if ([ 'LI_', 'ID_'].includes(this.idnoSelecionado.substr(0,3))) { 
          ht += "<b>ID: </b> " + idin + "<br>";
          if (noData.descricao) { 
            ht += "<b>Descrição: </b> "+ noData.descricao + "<br>";
          }
          if (noData.nota) {
            ht += "<b>Nota: </b> "+ noData.nota + "<br>";
          }		
          mostraResultado(idin, ht);
          return;
        } else {
          for (const [key, value] of Object.entries(noData)) {
            if (!['camada', 'situacao_ativa', 'posicao', 'pinado'].includes(key)) {
              if (value) {
                ht += "<b>" + key + ": </b> "+ value+ "<br>";
              }
              
            }
          }
        }
        if (!this.inicio.bBaseLocal) {
          mostraResultado(idin, ht);
          return;
        }
      }
    
      //var url = base + 'dadosjson/' + idin;
      var url = base + 'dadosjson/'; 
      //link pode ter caractere, como barra, que bagunça o app.route do flask, por isso os dados vão pelo body. outra opção, ignorar pedido de dadosjson de LI_
      /*
      if ([ 'LI_', 'ID_'].includes(idin.substr(0,3))) { 
        //url += idin.substr(0,3); //encodeURIComponent(idin); 
        url += encodeURIComponent(idin.replaceAll('/',' ').replaceAll('?', ' '));
      } else {
        url += idin; //o idin aqui é um enfeite, porque via post o parâmetro vai ser lido pelo body
      } */
      url += encodeURIComponent(idin.replaceAll('/',' ').replaceAll('?', ' '));
      // talvez isto é redundante para PF, pois os dados de pep, etc, já terão sido carregados. Só tem sentido se existisse atualizasse online de algum dado
      fetch(url, {method: 'post', body:JSON.stringify({'idin':idin}), headers: {"Content-type": "application/json"}, cache: "no-store"}) //, mode: 'cors',})
        .then(
        function(response) {
          if (response.status !== 200) {
          mensagemErroHttp(response);
          return;
          }
          response.json().then(function(data) {
          var texto = "";
          this.json = data;
    
          // if (data) { // se data for {}. é não nulo no javascript
          if (Object.keys(data).length) {
            if (idin.startsWith('PJ_')) {
              ht = dadosEmHtmlPJ(data, noData);
            } // else {
              //ht += noData;
            htadicional = ''
            for (const [key, value] of Object.entries(data)) {
              if (['id'].includes(key)) {
                continue;
              }
              if ((idin.startsWith('PF_')) && (this.itensFlag.includes(key))) { 
                continue;
              }
              if (value) {
                htadicional += "<b>" + key.toUpperCase() + ": </b> "+ value+ "<br>";
              }
            }
            if (htadicional) {
              //ht +=  "<b>--------------</b> "+ "<br>" + htadicional;
              ht +=  "<br>" + htadicional;
            }
            //}
            if (!this.mobile && idin.startsWith('PJ_')) {
              ht += '<a href="/rede/consulta_cnpj/?cnpj=' + idin.substring(3) + '" title="No gráfico, pressione SHIFT+D para ver dados de CNPJ em uma nova aba. Os sócios serão listados." target="_blank">Abrir em outra aba</a><br><br>';
            }
          } 
          mostraResultado(idin, ht);
          });
        }
        )
        .catch(function(err) {
        console.log('Fetch Error :-S', err);
        notify.error('Aconteceu um erro (Fetch error ' + err + ')');
        });
    },

    // menu_ligar_novo(idNovo, descricaoNovo, bNaoLigar, bLigarEntre, bInverterLIgacaoPadrao, posicao) {
    //   //cria novo item (não PJ) e liga com nós selecionados.
    //   if (idNovo && !bNaoLigar) {
    //     if (this.graph.hasNode(idNovo) && idNovo.startsWith('LI_')) { //neste caso, só liga com o nó já existente
    //       var resp = alert('O item já existe no gráfico. Este será selecionado:\n:' + idNovo);
    //       this.selecionaNoid(idNovo);
    //       return;
    //     }
    //   }
    //   idNovo = idNovo ? idNovo: ''; //idNovo = idNovo ?? ''
    //   descricaoNovo = descricaoNovo ? descricaoNovo: '';
    //   var dlgItemOriginal = document.getElementById('dlgItem');
    //   var dlgItem = document.getElementById('dlgItem').cloneNode(true); //clone para não mexer no original, soluciona problema de instabilidade (parava de funcionar depois de misturar tipos de consulta, cnpj e link)
    //   var camposTexto = dlgItem.getElementsByClassName('ajs-input');
    //   var dados = {};
    //   camposTexto[0].value= idNovo;
    //   camposTexto[1].value= descricaoNovo; 
    //   camposTexto[2].value= '';
    //   camposTexto[3].value= '';
    
    //   var campoImagem = camposTexto[4];
    //   if (1) {
    //     const img = document.createElement("img");
    //     img.id = "dlgItemEditar_imagem";
    //     img.alt = "Cole imagem aqui";
    //     img.height=100;
    //     img.width=100;
    //     img.title = "Para substituir a imagem, Cole (CTRL+V) aqui";
    //     campoImagem.appendChild(img);
    //   }
      
    //   dlgItemOriginal.parentNode.appendChild(dlgItem); // para dlgItem.outerHTML = '' funcionar no chrome
    //   dlgItem.outerHTML = ''; //receita de bolo para usar o dialog.confirm. sem isso  a linha de cima dava erro no chrome
    //   this.ativaAtalhos(false);
    //   this.base64Imagem = null;
    //   campoImagem.addEventListener('paste', editarIconeColarImagem);	
      
    //   dialog.confirm(dlgItem)
    //   //não funciona .set('defaultFocusOff', true)
    //   //não funciona .set('focus', camposTexto[0])
    //   .set('onfocus', () => { camposTexto[0].focus(); } )
    //   .set('onok', (closeevent, value) => { 
    //     this.ativaAtalhos(true); 
    //     var camposTexto = dlgItem.getElementsByClassName('ajs-input');
    //     //idNovo = camposTexto[0].value.toUpperCase().trim();
    //     idNovo = camposTexto[0].value.trim();
    //     descricaoNovo = camposTexto[1].value;
    //     var tnota = camposTexto[2].value;
    //     var tligacao = camposTexto[3].value;
    //     if (!idNovo) {
    //       alert('O Identificador não pode ser nulo. Tente novamente.');
    //       return;
    //     }
    //     if (idNovo.toLowerCase().startsWith('https://') || idNovo.toLowerCase().startsWith('http://')) {
    //       idNovo = 'LI_' + idNovo;
    //     } else if (idNovo.startsWith('"') && idNovo.endsWith('"')) { //aspas quando se copia o caminho completo pelo menu contextual no windows. não sei como fica em outros sistemas
    //       idNovo = 'AR_' + idNovo.slice(1,-1);
    //     } else if (idNovo.startsWith('C:\\') || idNovo.startsWith('D:\\') || (idNovo.substr(1,2)==':\\')) { //isso só vai funcionar no windows
    //       idNovo = 'AR_' + idNovo;
    //     } else if (idNovo.startsWith('LI_') || idNovo.startsWith('AR_')) { //não por em maiuscula, senão link para url não funciona
    //       //não faz nada
    //     } else {
    //       idNovo = idNovo.toUpperCase();
    //       idNovo = tipoPresumido(idNovo);
    //       while (this.graph.hasNode(idNovo)) {
    //         idNovo = prompt('Item novo:\n\nO identificador ' + idNovo + ' já existe no gráfico.\nAltere o novo identificador:', idNovo);
    //         if (idNovo===null) {
    //           return;
    //         }
    //         idNovo = idNovo.toUpperCase();
    //         idNovo = tipoPresumido(idNovo);
    //       }		
    //     }
    //     if (this.graph.hasNode(idNovo)) { //caso LI_ AR_
    //       alert('O identificador ' + idNovo + ' já existe no gráfico. Não será feita a inclusão');
    //       return;
    //     }
    //     /*
    //     if (idNovo.startsWith('PJ_')) {
    //       alert('Para inserir um PJ, use a opção Inserir CNPJ ou CPF (I)');
    //       ativaAtalhos(true);
    //       return;
    //     }*/
    //     descricaoNovo = idNovo.startsWith('PF_')?idNovo.substr(15):descricaoNovo;
    //     if (tligacao) {
    //       bNaoLigar = false;
    //     } 
    //     //dados.camada = bNaoLigar? 0 : 1; //ttt
    //     criarNovoNo(idNovo, descricaoNovo, tnota, tligacao, dados, bNaoLigar, bLigarEntre, bInverterLIgacaoPadrao);
    //     if (posicao) {
    //       this.layout.setNodePosition(idNovo, posicao.x, posicao.y);
    //       //console.log('setnodeposition: ' + posicao.x + ' ; ' +  posicao.y);
    //     }
    //     if (this.base64Imagem) {
    //       this.menu_faviconNosItens(this.base64Imagem);
    //     }
    //   }, () => { campoImagem.removeEventListener("paste", editarIconeColarImagem, false); 
    //     this.ativaAtalhos(true); }
    //   ).set('oncancel', () => { campoImagem.removeEventListener("paste", editarIconeColarImagem, false); 
    //                   this.ativaAtalhos(true);  })
    //   .set('title',"Novo Item (U)");
    
    // },

    menu_localiza_adjacentes(bFiltroNosSelecionados) {
      //bFiltroNosSelecionados, só procura em idNosSelecionados, senão procura em todos os itens
      //ativaAtalhos(false);
      var brenderer = menu_rendererAtivarParar(false, false);
      var idNosLocalizados = new Set();
      for (let noId of this.idNosSelecionados) {
        this.graph.forEachLinkedNode(noId, function(nodeaux, link){
          idNosLocalizados.add(nodeaux.id);
        });	
      }
      this.menu_rendererAtivarParar(brenderer, false);
      if (idNosLocalizados.size) {
        //this.selecionaNoid(null, false); //apaga seleção primeiro
        for (let n of idNosLocalizados) {
          //this.graphics.getNodeUI(n).getElementsByTagName('rect')[1].setAttribute('visibility', 'visible'); 
          //this.idNosSelecionados.add(n);
          this.selecionaNoid(n, true, true); 
        }
        notify.success('Localizou '+ idNosLocalizados.size + ' adjacentes');
        this.camadaIdExpandido = {}; 
        return idNosLocalizados.size;
      } else {
        return 0;
      }
    },
    menu_localiza_componente() {
      var brenderer = this.menu_rendererAtivarParar(false, false);
      var idNosLocalizados = new Set(this.idNosSelecionados);
      var tamanhoAnterior = -1;
      while (true) {
        var idNosLocalizadosFor = new Set(idNosLocalizados);
        //var idNosLocalizados = new Set();
        for (let noId of idNosLocalizadosFor) {
          this.graph.forEachLinkedNode(noId, function(nodeaux, link){
            idNosLocalizados.add(nodeaux.id);
          });	
        }
        if (tamanhoAnterior==idNosLocalizados.size) {
          break;
        }
        tamanhoAnterior = idNosLocalizados.size;
      }
      this.menu_rendererAtivarParar(brenderer, false);
      if (idNosLocalizados.size) {
        //this.selecionaNoid(null, false); //apaga seleção primeiro
        for (let n of idNosLocalizados) {
          //this.graphics.getNodeUI(n).getElementsByTagName('rect')[1].setAttribute('visibility', 'visible'); 
          //this.idNosSelecionados.add(n);
          this.selecionaNoid(n, true, true); 
        }
        if (this.idNosSelecionados.size == this.graph.getNodesCount()) { 
          notify.success('Todo o gráfico foi selecionado, com '+ idNosLocalizados.size + ' itens');
        } else {
          notify.success('Localizou '+ idNosLocalizados.size + ' adjacentes');
        }
        return idNosLocalizados.size;
      } else {
        return 0;
      }
    },
    menu_localiza_itensComMaisLigacoes() {
      var dcontagem = {};
      var bMudou = false;
      this.graph.forEachLink(function(link){
        dcontagem[link.fromId] = dcontagem[link.fromId] ? dcontagem[link.fromId]+1 : 1;
        dcontagem[link.toId] = dcontagem[link.toId] ? dcontagem[link.toId]+1 : 1;
      });
      listaESeleciona(dcontagem, 'Itens com mais ligações');
    },

    iconeF(idno) {
      var tipo = idno.substr(0,3);
      var imagem = 'icone-grafo-id.png';
      if (tipo=='PF_') {
        imagem = 'icone-grafo-desconhecido.png';
      //} else if (tipo=='PJ_') {
      //	imagem =
      } else if (tipo=='EN_') {
        imagem = 'icone-grafo-endereco.png';
      } else if (tipo=='TE_') {
        imagem = 'icone-grafo-telefone.png';
      } else if (tipo=='EM_') {
        imagem = 'icone-grafo-email.png';		
      } else if (tipo=='UG_') {
        imagem = 'icone-grafo-ug.png';	
      } else if (tipo=='LI_') {
        //ttt imagem = 'link.png';
        imagem = this.imagemLinkDeSite(idno); 
      } else if (tipo=='AR_') {
        imagem = 'external-link.png';
      } else if (tipo=='PM_') { //PM_ pessoa mulher
        imagem = 'icone-grafo-feminino.png';
      } else if (tipo=='PH_') { //PH_ pessoa homem
        imagem = 'icone-grafo-masculino.png';
      } else if (tipo=='PP_') { //PP_ pessoa pessoa
        imagem = 'icone-grafo-desconhecido.png';
      } else if (tipo=='OO_') {
        imagem = 'circle-o.png';
      } else if (idno.startsWith('ID_')) {
        var idnox = idno.substr(3);
        if (idnox.includes('__')) { //dois undercores depois da numeração de id
          imagem = 'binary.png';
          idnox = idnox.substr(idnox.indexOf('__')+2);
          var palavra = idnox.split(' ')[0];
          if (['def','class'].includes(palavra)) {
            imagem = 'python.png';
          } else if (['return','break','continue'].includes(palavra)) {
            imagem = 'reply.png';
          } else if (['if','else:','elif:','try:', 'except:','finally','with'].includes(palavra)) {
            imagem = 'random.png';
          } else if (['for','while'].includes(palavra)) {
            imagem = 'repeat.png';
          } else if (['@'].includes(palavra)) {
            imagem = 'at.png';
          } else if (palavra.startsWith('#') || palavra.startsWith('//')) {
            imagem = 'sticky-note-o.png';
          } else if (palavra == 'function') {
            imagem = 'code.png';
          }
        }
      }
      return imagem;
    },
    imagemLinkDeSite(idNovo) {
      //aqui já se supõe que idNovo começa com LI_
      var imagem= 'link.png';
      var bTentaFavicon = true;
      /*
      if (idNovo.startsWith("LI_https://www.youtube.com/watch?v=")) {
        //nodados.imagem = "https://img.youtube.com/vi/" + idNovo.substr("LI_https://www.youtube.com/watch?v=".length) + '/1.jpg';
        imagem = imagemYoutube(idNovo.substr(3)); //youtube.png
        //converter imagens de outro domínio dá erro de permissão nodados.imagem = converteImagem2Base64(nodados.imagem);
        bTentaFavicon = false;
      } else */
      if (idNovo.startsWith("LI_https://www.youtube.com")) {
        imagem = 'youtube.png';
      } else if (idNovo.startsWith("LI_https://twitter.com/")) {
        imagem = 'twitter.png';
      } else if (idNovo.startsWith("LI_https://www.facebook.com/")) {
        imagem = 'facebook.png';
      } else if (idNovo.startsWith("LI_https://www.instagram.com/")) {
        imagem = 'instagram.png';
      } else if (idNovo.startsWith("LI_https://www.google.com/")) {
        imagem = 'google.png';
      } else if (idNovo.startsWith("LI_https://github.com/")) {
        imagem = 'github.png';
      } else if (idNovo.startsWith("LI_https://www.linkedin.com/")) {
        imagem = 'linkedin.png';
      } else if (idNovo.startsWith("LI_https://www.reddit.com/")) {
        imagem = 'reddit.png';
      } else if (idNovo.startsWith("LI_https://www.whatsapp.com/")) {
        imagem = 'whatsapp.png';
      } else if (idNovo.includes(".gov.br/") || idNovo.includes(".gov/") || idNovo.includes("jus.br/")) {
          imagem = 'institution.png';
      } else if (idNovo.includes(".wikipedia.org/")) {
        imagem = 'wikipedia-w.png';
      } else if (idNovo.includes(".amazon.com")) {
        imagem = 'amazon.png';
      } 
      return imagem;
    },
    menu_caminhos(camadaIn, criterioCaminhos, bBuscarNoServidor) { 
      var kitens_encontrados, resp;
      var kitensIniciais = this.idNosSelecionados.size;
      if (kitensIniciais<2) {
        notify.error('Para usar a rotina de caminhos, deve haver ao menos dois itens selecionados.');
        return false;
      } else if (kitensIniciais>10) {
        resp = confirm('Fazer a busca de caminhos de muitos itens pode travar o navegador. Deseja prosseguir?');
        if (!resp) {
          return false;
        }
      } 
      if (!bBuscarNoServidor) {
        kitens_encontrados = menu_caminhos_na_tela(2*camadaIn, criterioCaminhos);
        if (kitens_encontrados) {
          if (kitens_encontrados<kitensIniciais) {
            notify.warning('Não encontrou caminhos para todos os itens no gráfico atual. Para buscar dados no servidor, pressione CTRL+SHIFT+Número');
          } else {
            notify.success('Encontrou caminho entre os itens no gráfico atual. Esses elementos foram selecionados.');
          }
          return;
        } else {
          resp = confirm('Não encontrou caminho no gráfico atual. Deseja buscar dados no servidor?');
          if (!resp) {
            return;
          }
        }
      }
      if (criterioCaminhos){
        criterioCaminhos = 'caminhos-' + criterioCaminhos;
      } else {
        criterioCaminhos = 'caminhos';
      }
      //camadaInsercao = (Math.floor(camadaIn/2)==camadaIn/2)? Math.floor(camadaIn/2) : Math.floor(camadaIn/2)+1;
      menu_incluirCamada('', camadaIn, criterioCaminhos); //faz chamada ao servidor
    },
    menu_caminhos_na_tela(camada, criterioCaminhos) { 
      //ativaAtalhos(false);
      var brenderer = this.menu_rendererAtivarParar(false, false);
    
      //var camada = camadaIn*2; //+2;
      var idNosLocalizados = new Set();
      var camadasItem = {};
    
      document.body.style.cursor = 'wait';
      for (let noId of this.idNosSelecionados) {	
        var dcamada = {0:[noId,]};
        var itensCamadaAnterior = new Set([noId,]);
        var itensVisitados = new Set([noId,]);
        for (let cam=1; cam<=camada; cam++) {
          var itensNaCamada=new Set();	
          for (idr of dcamada[cam-1]) {
            this.graph.forEachLinkedNode(idr, function(naux, link){
              if ((naux.id!=idr) && (!itensVisitados.has(naux.id))) {
                itensNaCamada.add(naux.id);
              }
              itensVisitados.add(naux.id);
            })
          }
          //console.log([...itensNaCamada]);
          dcamada[cam] = [...itensNaCamada];
        }
        camadasItem[noId] = JSON.parse(JSON.stringify(dcamada));
      }
      var bAtendeCriterio;
      for (let no1 of this.idNosSelecionados) {	
        for (let no2 of this.idNosSelecionados) {	
          if (no1>=no2) continue;
          for (let cam=1; cam<=camada; cam++) {
            var scam = new Set(camadasItem[no1][cam]);
            if (scam.has(no2)){
              if (criterioCaminhos) {		
                bAtendeCriterio = false;					
                var nota1 = this.graph.getNode(no1).data.nota;
                var nota2 = this.graph.getNode(no2).data.nota;
                if (nota1 && nota2) {
                  if (criterioCaminhos=='intra') {
                    if (nota1==nota2) {
                      bAtendeCriterio = true;
                    }
                  } else if (criterioCaminhos=='extra') {
                    if (nota1!=nota2) {
                      bAtendeCriterio = true;
                    }						
                  }
                }
              } else {
                bAtendeCriterio = true;
              }
              if (!bAtendeCriterio) continue;
              //encontrou, então faz ordem inversa
              idNosLocalizados.add(no2);
              idNosLocalizados.add(no1);
              for (let cam2=1; cam2<cam; cam2++) {
                var scam1 = new Set(camadasItem[no1][cam-cam2])
                var scam2 = new Set(camadasItem[no2][cam2]);
                for (let idaux of scam2) { //intersecção
                  if (scam1.has(idaux)) {
                    idNosLocalizados.add(idaux);
                  }
                }
              }
              break;
            }
          }
        }
      }
      var kitensOrigemLocalizados=0;
      for (idc of idNosLocalizados) {
        if (this.idNosSelecionados.has(idc)) {
          kitensOrigemLocalizados += 1;
        }
      }
    
      for (idc of idNosLocalizados) {
        this.selecionaNoid(idc, true, true); 
      }
    
      this.menu_rendererAtivarParar(brenderer, false);
      document.body.style.cursor = 'default';
      return kitensOrigemLocalizados; //idNosLocalizados.size;
    
    },
    menu_inserirDesfazer() {
      var idNosInseridos = this.listaIdNosInseridos.pop();
      if (!idNosInseridos) return;
      var tam = idNosInseridos.size;
      for (let n of idNosInseridos) {
        this.removeIdNo(n);
      }
      var tmensagem = (tam==1 ? 'Foi removido um nó.' : ('Foram removidos ' + tam + ' nós.'))
      notify.success(tmensagem);
      this.camadaIdExpandido = {}; //reseta idExpandidos
    },
    removeIdNo(noId) { 
      //remover o nó da lista de nós
      //remover ligações que partem do nó e que chegam ao nó
      //procura label do link para remover
      this.graph.forEachLinkedNode(noId, (nodeaux, link) => {
        var linkUIaux=null;
        try {
          linkUIaux = this.graphics.getLinkUI(link.id);
          element=document.getElementById('link_label_'+linkUIaux.attr('id'));
          element.parentNode.removeChild(element);
        } catch (e){; };
      });
      this.graph.removeNode(noId);
      //remove no da lista de selecionados
      this.idNosSelecionados.delete(noId);
      if (this.idnoSelecionado==noId) {
        this.idnoSelecionado=null;
      }
      this.camadaIdExpandido = {};
    },
    menu_incluir1Camada(idin) {
      //para tratar 1 camada, se clicar repetidamente o mesmo item, vai aumentando as camadas.
      var idref = idin;
      var camada = 1;
      if (!idin) {
        idref = [...this.idNosSelecionados][0];
      }
      if (this.camadaIdExpandido[idref]){ //se ícone já foi clicado, abre camada seguinte.
        camada = this.camadaIdExpandido[idref] + 1;
      }
      this.camadaIdExpandido = {}; //reseta, expansão gradativa só de 1 item por vez.
      menu_incluirCamada(idin, camada);
      //if ((tipo=='cnpj')&&(this.graph.getNode(idref))) { //verifica se nó existe para evitar inconsistência quando busca item inexistente na base local
      if (this.graph.getNode(idref)) { //verifica se nó existe para evitar inconsistência quando busca item inexistente na base local
        this.camadaIdExpandido[idref]=camada;
      }
    }, 
    menu_incluirCamada(idin, camada, tipo = 'cnpj', bNaoConfirma) {
      // Verifica se idin está vazio e se nenhum nó está selecionado
      if (!idin.trim() && !this.idnoSelecionado) return;
    
      let url = '';
      let bAbriuAbaLink = false;
      let bodyj = '';
      let sidSelecionadosInicial = new Set([...this.idNosSelecionados]);
    
      // Ajusta o conjunto inicial de IDs selecionados
      if (idin.trim()) {
        sidSelecionadosInicial = new Set([idin.trim()]);
      }
    
      const sitensQueNaoEstaoNaBase = new Set();
    
      // Processa os itens selecionados
      for (const idaux of sidSelecionadosInicial) {
        if (idaux.startsWith('CH_')) {
          menu_links_google(true);
          sitensQueNaoEstaoNaBase.add(idaux);
        } else if (['LI_', 'AR_'].includes(idaux.substr(0, 3)) || 
                   (idaux.startsWith('ID_') && !this.inicio.bBaseLocal)) {
          this.menu_abrirNovaAba(idaux);
          bAbriuAbaLink = true;
          sitensQueNaoEstaoNaBase.add(idaux);
        }
      }
    
      // Verifica a camada para endereço, telefone ou email
      if (this.idNosSelecionados.size === 1 && this.idnoSelecionado &&
          ['EN_', 'TE_', 'EM_'].includes(this.idnoSelecionado.substr(0, 3)) &&
          camada > 1) {
        notify.warning('A rotina só expande endereço, telefone ou email em camada 1. Para expandir os itens relacionados, selecione-os primeiro com a tecla J (menu Filtrar/Localizar>Adjacentes)');
        return;
      }
    
      // Se todos os itens selecionados são chave, link, arquivo ou id_
      if (sidSelecionadosInicial.size === sitensQueNaoEstaoNaBase.size) {
        return;
      }
    
      // Valida e ajusta a camada
      if (camada > 10) {
        notify.error('O número de camadas é limitado em 10.');
        return;
      }
      camada = Math.min(camada, 10);
    
      // Processa o tipo de dados
      if (tipo === 'links') {
        dialogoParametrosLink();
      } else {
        if (this.idNosSelecionados.size < 2 && tipo.startsWith('caminhos')) {
          alert('Para usar a opção caminhos, selecione ao menos dois itens do gráfico. Utilize Shift+Click para adicionar itens à seleção');
          return;
        }
    
        url = base + 'grafojson/' + tipo + '/' + camada + '/';
        bodyj = tipo.startsWith('caminhos') ? JSON.stringify([[...this.idNosSelecionados]]) : JSON.stringify(menu_incluirCamada_dicItemNota());
        fazFetch(url, idin, bodyj);
      }
    
      function fazFetch(url, idin, bodyjsonIn) {
        document.body.style.cursor = 'wait';
        const bodyjson = bodyjsonIn || (idin ? JSON.stringify([idin]) : JSON.stringify([...this.idNosSelecionados]));
        const qitens = idin ? 1 : this.idNosSelecionados.size;
    
        url += encodeURIComponent((idin ? idin : this.idnoSelecionado).replace(/[\?\/]/g, ' '));
        if (qitens > 1) {
          url += ` (${qitens} itens)`;
        }
    
        fetch(url, {
          method: 'post',
          body: bodyjson,
          headers: { "Content-type": "application/json" },
          cache: "no-store"
        })
          .then(response => {
            if (response.status !== 200) {
              this.mensagemErroHttp(response);
              return;
            }
            return response.json();
          })
          .then(data => {
            document.body.style.cursor = 'default';
            if (data.no.length) {
              const textoInserir = camada > 1 ? ((tipo === 'cnpj') ? `Camada ${camada}. ` : `${tipo} em camada ${camada}. `) : '';
              this.inserirJson(data, textoInserir, bNaoConfirma, tipo === 'caminhos');
            } else if (!bAbriuAbaLink) {
              const errorMsg = isNumeric(idin.replace(/[\.\-\//]/g, '').trim()) || idin.includes('*')
                ? `Não encontrou ${idin} na base. ${data.mensagem}`
                : `Não encontrou o item ou novos itens que satisfaçam os parâmetros da consulta. ${data.mensagem}`;
              notify.error(errorMsg);
            }
          })
          .catch(err => {
            document.body.style.cursor = 'default';
            console.error('Fetch Error :-S', err);
            notify.error(`Aconteceu um erro (Fetch error ${err})`);
          })
          .finally(() => {
            if (document.activeElement.id === "input_cnpj") {
              document.getElementById("botao_inserir").focus();
            }
          });
      }
    
      function dialogoParametrosLink() {
        const dlgLinkOriginal = document.getElementById('dlgLink');
        const dlgLink = dlgLinkOriginal.cloneNode(true);
        dlgLink.id = 'dlgLink_clone';
        dlgLinkOriginal.parentNode.appendChild(dlgLink); 
        dlgLinkOriginal.remove();
        ativaAtalhos(false);
    
        dialog.confirm(dlgLink).set({
          onok: () => {
            const listaInput = dlgLink.getElementsByTagName('input');
            const valorMinimo = parseFloat(listaInput.dlgLink_valorMinimo.value) || 0;
            const valorMaximo = parseFloat(listaInput.dlgLink_valorMaximo.value) || 0;
            const numeroItens = parseInt(listaInput.dlgLink_numeroItens.value) || 0;
            const camada = Math.min(parseInt(listaInput.dlgLink_camadas.value) || 0, 10);
    
            dlgLinkOriginal.getElementsByTagName('input').forEach(input => {
              input.value = listaInput[input.id].value;
            });
    
            if (camada > 10) {
              notify.error('O número de camadas é limitado em 10.');
            } else {
              ativaAtalhos(true);
              url = `${base}grafojson/links/${camada}/${numeroItens}/${valorMinimo}/${valorMaximo}/`;
              fazFetch(url, idin);
              dlgLink.remove();
            }
          },
          onclose: () => ativaAtalhos(true),
          oncancel: () => ativaAtalhos(true)
        }).set('title', "Inserir Ligacoes");
    
        document.getElementById('dlgLink_camadas').value = camada;
      }
    },
    menu_links_google(bAbrePalavrasChaves) {
      // Manda termos de busca para o servidor, que fará uma chamada ao google e retornará uma lista de nós e de ligações.
      if (!this.inicio.bbusca_chaves && bAbrePalavrasChaves) {
        notify.error('A opção de busca de palavras chave não está habilitada. Baixe o projeto no github e rode localmente.');
        return;
      }
    
      let termosId = this.idnoSelecionado ? this.graph.getNode(this.idnoSelecionado).data.descricao.replaceAll('&', ' ') : '';
      let url = '';
      let termos = '';
      let kpalavras = 0;
      let pagina = 1;
    
      if (!termosId && this.idnoSelecionado) {
        termosId = this.graph.getNode(this.idnoSelecionado).data.id.substr(3);
      }
    
      if (this.idnoSelecionado && ['LI_', 'AR_'].includes(this.idnoSelecionado.substr(0, 3)) && bAbrePalavrasChaves
          && !this.idnoSelecionado.startsWith('LI_https://www.google.com')) {
        termosId = this.idnoSelecionado;
      }
    
      const textoPrompt = bAbrePalavrasChaves
        ? 'Digite termos para buscar no Google. Será criado um gráfico com o resultado da busca e conexões com palavras chaves (isto pode demorar):'
        : 'Digite termos para buscar no Google. Será criado um gráfico com o resultado da busca:';
      
      termos = prompt(textoPrompt, termosId);
      if (!termos) {
        return;
      }
    
      if (!['LI_', 'AR_'].includes(termos.substr(0, 3))) {
        if (this.paginaBuscaGoogle[termos]) {
          this.paginaBuscaGoogle[termos]++;
          pagina = prompt('Digite um número inteiro com a Página do Google para baixar:', this.paginaBuscaGoogle[termos]);
          if (pagina) {
            this.paginaBuscaGoogle[termos] = pagina;
          }
        } else {
          this.paginaBuscaGoogle[termos] = 1;
        }
      }
    
      if (termos.search('@') !== -1) {
        kpalavras = parseInt(termos.split('@')[1]);
        if (kpalavras) {
          termos = termos.split('@')[0];
        }
      } else {
        kpalavras = 20;
      }
    
      if (['LI_', 'AR_'].includes(termos.substr(0, 3))) {
        url = base + 'busca_google?link=' + encodeURIComponent(termos);
      } else {
        url = base + 'busca_google?pag=' + encodeURIComponent(this.paginaBuscaGoogle[termos]) + '&q=' + encodeURIComponent(termos);
      }
      
      url += '&palavras_chave=' + (bAbrePalavrasChaves ? kpalavras : '0');
      
      if (bAbrePalavrasChaves) {
        notify.warning('O servidor irá baixar os arquivos e selecionar palavras chaves relacionadas à busca. Isto pode demorar...');
      }
    
      fazFetch(url, termosId);
    
      function fazFetch(url, idin) {
        document.body.style.cursor = 'wait';
        const idSelecionadoAnterior = this.idnoSelecionado;
        idin = ['LI_', 'AR_'].includes(idin.substr(0, 3)) ? 'LI' : idin;
        const bodyjson = idin ? JSON.stringify([idin]) : JSON.stringify([...this.idNosSelecionados]);
    
        fetch(url, { method: 'get', cache: "no-store" }) // mode: 'cors',
          .then(response => {
            if (response.status !== 200) {
              this.mensagemErroHttp(response);
              return;
            }
            response.json().then(data => {
              document.body.style.cursor = 'default';
              if (data.no.length) {
                this.inserirJson(data, 'busca no google por ' + termos, true);
                if (idSelecionadoAnterior && (pagina.toString() === '1')) {
                  setTimeout(() => {
                    let resp = true;
                    if (termos !== termosId) { // se os termos forem diferentes da descrição do cpf/cnpj, pergunta se quer ligar
                      resp = confirm('Liga ao item que estava selecionado?');
                    }
                    if (resp) {
                      this.idNosSelecionados.add(idSelecionadoAnterior);
                      menu_ligar_selecionados(true, '', true); 
                    }
                    if (data.mensagem) {
                      notify.success(data.mensagem);
                    }
                  }, 1000);
                }
              } else {
                if (data.mensagem) {
                  notify.error(data.mensagem);
                } else {
                  notify.warning('Não encontrou informações'); 
                }
              }
            });
          })
          .catch(err => {
            document.body.style.cursor = 'default';
            console.log('Fetch Error :-S', err);
            notify.error('Aconteceu um erro (Fetch error ' + err + ')');
          });
      }
    },
    main() {
      this.ajustaAmbiente();
      this.geom = Viva.Graph.geom();
      this.graph = Viva.Graph.graph();
      this.graphics = Viva.Graph.View.svgGraphics();
      
      this.AreaSelecaoRetangular = {
        Setup:function() {
          /*seleção retangular */
          var multiSelectOverlay;
          document.addEventListener('keydown', function(e) {
            if (e.which === 17 && !multiSelectOverlay) { // ctrl key
              multiSelectOverlay = this.AreaSelecaoRetangular.startMultiSelect(graph, this.renderer, this.layout);
            }
            if (e.which != 17 && multiSelectOverlay) { // pressionou outro botão (corrige problema quando se pressiona CTRL+botão para outro comando, que o tipo de cursor não mudava para o padrão
              multiSelectOverlay.destroy();
              multiSelectOverlay = null;
            }
      
          });
          document.addEventListener('keyup', function(e) {
            if (e.which === 17 && multiSelectOverlay) {
              multiSelectOverlay.destroy();
              multiSelectOverlay = null;
            }
          });
        }, startMultiSelect: function(graph, renderer, layout) {
          var graphics = renderer.getGraphics();
          var domOverlay = document.querySelector('.graph-overlay');
          var overlay = this.AreaSelecaoRetangular.createOverlay(domOverlay);
          overlay.onAreaSelected(handleAreaSelected);
          
          return overlay;
      
          function handleAreaSelected(area) {
            // For the sake of this demo we are using silly O(n) implementation.
            // Could be improved with spatial indexing if required.
            var topLeft = this.graphics.transformClientToGraphCoordinates({
              x: area.x,
              y: area.y
            });
      
          var bottomRight = this.graphics.transformClientToGraphCoordinates({
            x: area.x + area.width,
            y: area.y + area.height
          });
      
          this.graph.forEachNode(higlightIfInside);
          renderer.rerender();
      
          return;
      
          function higlightIfInside(node) {
            var nodeUI = this.graphics.getNodeUI(node.id);
            if (isInside(node.id, topLeft, bottomRight)) {
              this.selecionaNoid(node.id, true, true);
            }
          }
           
          function isInside(nodeId, topLeft, bottomRight) {
            var nodePos = layout.getNodePosition(nodeId);
            return ((topLeft.x < nodePos.x) && (nodePos.x < bottomRight.x) &&
              (topLeft.y < nodePos.y) && (nodePos.y < bottomRight.y));
          }
          }
        }, createOverlay: function(overlayDom) {
          var selectionClasName = 'graph-selection-indicator';
          var selectionIndicator = overlayDom.querySelector('.' + selectionClasName);
          if (!selectionIndicator) {
            selectionIndicator = document.createElement('div');
            selectionIndicator.className = selectionClasName;
            overlayDom.appendChild(selectionIndicator);
          }	
      
          var notify = [];
          var dragndrop = Viva.Graph.Utils.dragndrop(overlayDom);
          var selectedArea = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          };
          var startX = 0;
          var startY = 0;
      
          dragndrop.onStart(function(e) {
            startX = selectedArea.x = e.clientX;
            startY = selectedArea.y = e.clientY;
            selectedArea.width = selectedArea.height = 0;
            updateSelectedAreaIndicator();
            selectionIndicator.style.display = 'block';
          });
      
          dragndrop.onDrag(function(e) {
            recalculateSelectedArea(e);
            updateSelectedAreaIndicator();
            notifyAreaSelected();
          });
      
          dragndrop.onStop(function() {
            selectionIndicator.style.display = 'none';
          });
      
          overlayDom.style.display = 'block';
      
          return {
            onAreaSelected: function(cb) {
              notify.push(cb);
            },
            destroy: function () {
              overlayDom.style.display = 'none';
              dragndrop.release();
            }
          };
      
          function notifyAreaSelected() {
            notify.forEach(function(cb) {
              cb(selectedArea);
            });
          }
      
          function recalculateSelectedArea(e) {
            var bcr = document.getElementById('principal').getBoundingClientRect();
            selectedArea.width = Math.abs(e.clientX - startX);
            selectedArea.height = Math.abs(e.clientY - startY);
            selectedArea.x = Math.min(e.clientX, startX)- bcr.x;
            selectedArea.y = Math.min(e.clientY, startY)- bcr.y;
          }
      
          function updateSelectedAreaIndicator() {
            var bcr = document.getElementById('principal').getBoundingClientRect();
            selectionIndicator.style.left = (selectedArea.x) + 'px';
            selectionIndicator.style.top = (selectedArea.y) + 'px';
            selectionIndicator.style.width = selectedArea.width + 'px';
            selectionIndicator.style.height = selectedArea.height + 'px';
          }	
        }
      }

      this.markerSeta = Viva.Graph.svg('marker')
        .attr('id', 'Triangle')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', '10')
        .attr('refY', '5')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '10')
        .attr('markerHeight', '5')
        .attr('orient', 'auto')
        .attr('stroke', 'gray')
        .attr('fill', 'gray');

      this.markerSeta.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

      this.graphics.getSvgRoot().id = 'principal_svg';


      var defs = this.graphics.getSvgRoot().append('defs');
      defs.innerHTML = ' \
        <filter id="filtroPB"> \
        <feColorMatrix \
          type="matrix" \
          values="0 1 0 0 0 \
              0 1 0 0 0 \
              0 1 0 0 0 \
              0 1 0 1 0 "/> \
        </filter>\
        <filter id="filtroNegativo"> \
        <feColorMatrix type="matrix" \
        values="-1  0  0 0 0  0 -1  0 0 0 0 0 -1 0 0 1 1 1 0 0"/>\
        </filter> \
        ';
      defs.append(this.markerSeta);
    
      if (!this.mobile) {
        //Ajusta região para drag and drop de arquivo ou do excel
        this.ajustaRegiaoDrop();
        this.AreaSelecaoRetangular.Setup();
        this.ativaAtalhos(true);
      }
      if (this.inicio.cpfcnpj) {
        menu_incluirCamada(this.inicio.cpfcnpj, this.inicio.camada, null, true);
      } else if (this.inicio.idArquivoServidor ) {
        menu_importaJSONServidor(this.inicio.idArquivoServidor, true);
      } else if (this.inicio.lista) {
        inserir_lista(this.inicio.lista, true);
      } else if (this.inicio.json) {
        this.inserirJson(this.inicio.json, 'Json informado. ', true);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        //if (urlParams.get('pula_mensagem')!='sim') {
          if (this.inicio.mensagem) {
            var horaAbrePopup = localStorage.getItem( 'horaAbrePopup' );
            if (!horaAbrePopup || !(horaAbrePopup>new Date())) {
              if (this.mobile) {
                alert('Esta página pode não funcionar corretamente no celular ou tablet... Se der erro, abra um issue na página do projeto no github. Tente em um computador com o Firefox, Chrome ou Edge.\n\n' + this.inicio.mensagem);
              } else {
                alert(this.inicio.mensagem);
              }
              var expira = new Date();
              localStorage.setItem( 'horaAbrePopup', expira.setHours(expira.getHours() + 20)); //exibe de novo em 20 horas
            }
          }
        // }
        if (this.inicio.bMenuInserirInicial && !window.opener) { //se for aberta por outra aba, não abre opção de inserir
          this.menu_inserir();
        }
      }
    },
    start(){

      this.graphics.node((node) => {
        // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
        let ui = Viva.Graph.svg('g');
        //let urlImagem = node.data.imagem ? node.data.imagem: 'icone-grafo-id.png';
        var urlImagem = node.data.imagem ? node.data.imagem: this.iconeF(node.id);
        /*
        var urlImagem;
        if (node.data.imagem) {
          urlImagem = node.data.imagem
        } else {
          urlImagem = this.iconeF(node.id);
          if (!node.id.startsWith('LI_') { 
            node.data.imagem = urlImagem;
          }
        }*/
        if (!urlImagem.includes(this.baseImagem) && !urlImagem.startsWith('data:') && !urlImagem.startsWith('http')) {
          urlImagem = this.baseImagem + urlImagem;
        }
        let img = Viva.Graph.svg('image');
        //ui.posXRel = - this.nodeSize/2;
        //ui.posYRel = - this.nodeSize/2;
      
      
        img.attr('width', this.nodeSize)
          .attr('height', this.nodeSize)
          //.attr('onError','https://www.google.com/favicon.ico') 
          .link(urlImagem); 
      
        //if (!node.data.situacao_ativa) {
        if (node.data.situacao_ativa==false) {
          img.attr('filter','url(#filtroPB)');
        };	
        let corFundo = node.data.cor ? node.data.cor:'transparent';
        let	rectCor = Viva.Graph.svg('rect')
            //.attr('stroke', 'black')
            //.attr('stroke-width', 0)		
            .attr('fill', corFundo) //corFundoImagemF(node)) 
            .attr('width', this.nodeSize)
            .attr('height', this.nodeSize)
            .attr('visibility', 'visible');  //hidden or visible
        
        let	rect = Viva.Graph.svg('rect') //destacar se está selecionado
            .attr('visibility', 'hidden') //hidden or visible	
            .attr('stroke', 'black') //'crimson'
            .attr('stroke-width', 1.5)	
            .attr('fill', 'transparent') 
            .attr('width', this.nodeSize)
            .attr('height', this.nodeSize)
            .attr('stroke-dasharray', '6, 6');
            
        /*
        if (!urlImagem) {
          rectCor.attr('x', 0).attr('y', this.nodeSize);
          rect.attr('x', 0).attr('y', this.nodeSize);
        }
        */
        //https://developer.mozilla.org/pt-BR/docs/Web/SVG/Element/animate
        /*
        var animateRect = Viva.Graph.svg('animate');
        animateRect.attr('attributeName','stroke-dashoffset').attr('values','0;180;0').attr('dur', '60s').attr('repeatCount','indefinite');
        rect.appendChild(animateRect);
        */
        var [identificador, nome, nota] = this.labelsNo(node, this.kTipoRotulo); //node.data.label.split('\n');
        //var nota = node.data.nota? node.data.nota: '';
        //node.data.nota = nota;
        var svgText, textspan, textspan2, textspan3;
        if (this.btextoEmbaixoIcone) { //textp embaixo do ícone
          svgText = Viva.Graph.svg('text')
            .attr('pointer-events', 'none') //o texto não é mais clicável
            .attr('y', this.tamanhoFonte*1.1 + this.nodeSize) 
            .attr('x', this.nodeSize/2).attr('text-anchor','middle')
            .attr('font-size',this.tamanhoFonte+'px'); 
          textspan = Viva.Graph.svg('tspan').attr('x', this.nodeSize/2).attr('dy', 0).text(identificador);
          textspan2 = Viva.Graph.svg('tspan').attr('x', this.nodeSize/2).attr('dy', this.tamanhoFonte*1.1).text(nome);		
          textspan3 = Viva.Graph.svg('tspan').attr('x', this.nodeSize/2).attr('dy', this.tamanhoFonte*1.5)
            .attr('font-size',this.tamanhoFonte*1.5+'px').text(nota);
        } else { //texto à direita do ícone
          svgText = Viva.Graph.svg('text')
            .attr('pointer-events', 'none')
            .attr('y',  this.nodeSize*0.5+this.tamanhoFonte*0.5)
            .attr('x', this.nodeSize).attr('text-anchor','left')  
            .attr('font-size',this.tamanhoFonte+'px')
            .attr('style','font-family:Comic Sans MS;') ; 	
          textspan = Viva.Graph.svg('tspan').attr('x', this.nodeSize*1.2).attr('dy', 0).text(identificador);
          textspan2 = Viva.Graph.svg('tspan').attr('x', this.nodeSize*1.2).attr('dy', this.tamanhoFonte*1.1).text(nome);	
          textspan3 = Viva.Graph.svg('tspan').attr('x', this.nodeSize*1.2).attr('dy', this.tamanhoFonte*1.5)
            .attr('font-size',this.tamanhoFonte*1.5+'px').text(nota);
        }
      
        svgText.append(textspan);
        svgText.append(textspan2);			
        svgText.append(textspan3);	
        ui.insertAdjacentHTML('beforeEnd','<title>' + this.textoTooltip(node, true) + '</title>'); //title deve ser a primeira coisa apos g para funcionar no firefox 48
        ui.append(rectCor);
        ui.append(img);
        ui.append(rect);
        ui.append(svgText);
          
        let textoBandeira = this.textoFlag(node);
        if (textoBandeira) { //redflag
          var iconeFlag = 'flag_red.png';
          if (textoBandeira.startsWith('situacao_fiscal') && (textoBandeira.indexOf(LF)==-1)) { //se tiver situação fiscal não ativa e não baixada, e for unico texto de "flag", coloca bandeira cinza.
            iconeFlag = 'flag.png';
          }
          let redflag = Viva.Graph.svg('image');
          redflag.attr('width', this.nodeSize*0.6)
            .attr('height', this.nodeSize*0.6)
            .attr('x', this.nodeSize/2)
            .attr('y', -this.nodeSize/2)
            .link(this.baseImagem + iconeFlag); 
          ui.append(redflag);
        }
        
        ui.onmousedown = (event) => {  //estava onmouseup, assim dá pra congelar após click
          if (event.which == 1) {
            if (event.altKey) {
              //console.log('x1'); //ttt não funciona, apesar de chegar aqui, não está abrindo... Talvez alguma coisa a ver com o altKey??
              event.preventDefault();		
              menu_abrirNovaAba(node.id);			
              return;
            }
      
            if (!event.ctrlKey) {
              event.preventDefault();				
              this.selecionaNoid(node.id, event.shiftKey);
              //pinarNoTemp(node.id, 500); //pausar layout é melhor que só pinar o nó
              this.pausarLayout(1000); //500); //delay para facilitar duplo clique
            }
          } else if (event.which == 2) {
            //botão central abre edição de nota
            event.preventDefault();
            menu_editarNota(node.id);
          }
          return;
        };
        ui.ondblclick = (event) => {
          if (event.which == 1) {
            this.reativarLayout(); //click pausa layout, se for duplo click, já pode reativar
            event.preventDefault();
            if (node.id.startsWith('AR_') || node.id.startsWith('LI_')) {
              menu_abrirNovaAba(node.id);
            } else if (node.id.startsWith('ID_') && (!this.inicio.bBaseLocal)) {
              //
            } else {
              this.selecionaNoid(node.id, false);	
              //menu_incluir1Camada(node.id); 
              menu_incluir1Camada(''); 
            }
          };
          return;
        }; 
        ui.ontouchstart = (event) => {
          this.inicioToque = new Date().getTime();
        };
        
        ui.ontouchend = (event) => {
          //TODO verificar posição
          var currentTime = new Date().getTime();
          var tempoToque = currentTime - this.ultimoToque;
          this.ultimoToque = currentTime;
          if ((tempoToque<500) && (tempoToque > 0)) {
            //double tab ondblclick
            this.selecionaNoid(node.id, false);
            //menu_incluir1Camada(node.id); 
            menu_incluir1Camada(''); 
            event.preventDefault();
          } else {
            var touchLength = currentTime - this.inicioToque;
            if ((touchLength>=500) && (this.inicioToque!=0)) {
              this.inicioToque=0;
              //return false;
              return true;
            }
            //single tap onclick
            this.selecionaNoid(node.id, event.shiftKey);
            event.preventDefault();
          }
              
          return false;
        };
        ui.onmouseover = (event) => { 
          this.idNoOnHover = node.id; 
          // menu_dados(false, this.idNoOnHover); 
          return; 
        };
        ui.onmouseleave = (event) => { 
          this.idNoOnHover = null;
          // notify.alert().close(); 
          return; 
        };
        return ui;
      }).placeNode((nodeUI, pos) => {
        // 'g' element doesn't have convenient (x,y) attributes, instead
        // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
        nodeUI.attr('transform', 'translate(' + (pos.x - this.nodeSize/2) + ',' + (pos.y - this.nodeSize/2) + ')');
      });

      this.graphics.link((link) => {

        var label = Viva.Graph.svg('text')
          //.attr('title', String(link.data.label))
          .attr('id','link_label_'+link.data.id)
          .attr('font-size',this.tamanhoFonte+'px')
          .attr('fill',link.data.cor)
          .text(this.cortastr(this.filtraTextoLigacao(String(link.data.label)),25));
        label.insertAdjacentHTML('beforeEnd','<title>' + String(link.data.label) + '</title>'); 
        //this.idLigacoes[link.data.origem + '\n' + link.data.destino] = link.data.id;
        this.graphics.getSvgRoot().childNodes[0].append(label);
        var vpath = Viva.Graph.svg('path')
          .attr('stroke', link.data.cor) // 'gray')
          .attr('marker-end', 'url(#Triangle)')
          .attr('id', link.data.id);
        //if ((link.data.origem.startsWith('ID_')) || (link.data.destino.startsWith('ID_')) || (link.data.destino.startsWith('EN_')) 
        //	|| (link.data.destino.startsWith('EM_')) || (link.data.destino.startsWith('TE_')) || (link.data.tipoDescricao=='link')) {
        //if (link.data.tipoDescricao=='link') {
        if (['link','end','email','tel'].includes(link.data.tipoDescricao)) {
          vpath.attr('stroke-dasharray', '5, 5');
        };
        return vpath
        }).placeLink((linkUI, fromPos, toPos) => {
          var toNodeSize = this.nodeSize,
          fromNodeSize = this.nodeSize;
      
          var dyFromRotulo = (this.btextoEmbaixoIcone && !linkUI.link.fromId.startsWith('OO_'))? this.tamanhoFonte *2 : 0;
          var dyToRotulo = (this.btextoEmbaixoIcone && !linkUI.link.toId.startsWith('OO_'))? this.tamanhoFonte*2 : 0;
          
          var from = this.geom.intersectRect(
            fromPos.x - fromNodeSize / 2, // left
            fromPos.y - fromNodeSize / 2, // top
            fromPos.x + fromNodeSize / 2, // right
            fromPos.y + fromNodeSize / 2 + dyFromRotulo, // bottom
            fromPos.x, fromPos.y, toPos.x, toPos.y)
          || fromPos;
          
          var to = this.geom.intersectRect(
            toPos.x - toNodeSize / 2, // left
            toPos.y - toNodeSize / 2, // top
            toPos.x + toNodeSize / 2, // right
            toPos.y + toNodeSize / 2 + dyToRotulo, // bottom
            // segment:
            toPos.x, toPos.y, fromPos.x, fromPos.y)
            || toPos;
            
          var data = 'M' + from.x + ',' + from.y + 'L' + to.x + ',' + to.y;
          linkUI.attr("d", data);
          var elemento = document.getElementById('link_label_'+linkUI.attr('id'));
          elemento.attr("x", (from.x + to.x) / 2).attr("y", (from.y + to.y) / 2)
              .attr('visibility', this.bMostraLigacao? 'visible' : 'hidden');	
      
          // se for grande, deixa o texto do link na horizontal, se for menor alinha com a ligacao.
          if  (true) { 
          // if (elemento.textContent.length <= 2*20) { //20 caracteres, length é contado em dobro por causa do <title>
            // calcula o angulo para exibir o rótulo inclinado
            var angulo = 180.0/Math.PI* Math.atan2(toPos.y-fromPos.y,toPos.x - fromPos.x);
            var baseline = '-1';
            if (angulo>90) {
              angulo = -(180.0 - angulo);
              baseline = '-1';
            } else if (angulo<-90) {
              angulo = 180.0 + angulo;
              baseline = '-2';
            }
            elemento.attr("transform","rotate(" + parseFloat(angulo) + " " + parseInt((from.x + to.x) / 2) + "," 
              + parseInt((from.y + to.y) / 2) + ") translate(0," + baseline + ")")
              .attr('text-anchor','middle')
              .attr('visibility', this.bMostraLigacao? 'visible' : 'hidden');
          } else { //se estava inclinado e o texto aumentou para ficar na horizontal, tem que remover o transform
            /*
            if (elemento.hasAttribute('transform')) {
              elemento.removeAttribute('transform');
            }
            elemento.attr('text-anchor','start'); */
          }
      })
    },
    reativarLayout() {
      if (this.layout_suspenso) {
        this.renderer.resume();
        this.layout_suspenso = false;
      }
    },
    setLoading(isLoading){
      if(isLoading){
        LoadingBar.start();
        Loading.show()
        return;
      }
      LoadingBar.stop();
      Loading.hide()
    }
  },
});
