
import useApi from "src/composable/UseApi";

const buscar = async (tipo, camada, palavraChave) => {
    //const data = await useApi(`/busca/${tipo}/${camada}/${palavraChave}`);

    //mock
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "no": [
                    {
                        "id": "PF_***825238**-ALI MOHAMAD MOURAD",
                        "descricao": "ALI MOHAMAD MOURAD",
                        "camada": 1,
                        "sexo": 0,
                        "imagem": "icone-grafo-desconhecido.png",
                        "cor": "",
                        "nota": ""
                    },
                    {
                        "id": "TE_11 39858176",
                        "descricao": "",
                        "camada": 1,
                        "imagem": "icone-grafo-telefone.png",
                        "cor": "",
                        "nota": ""
                    },
                    {
                        "id": "TE_11 36621646",
                        "descricao": "",
                        "camada": 1,
                        "imagem": "icone-grafo-telefone.png",
                        "cor": "",
                        "nota": ""
                    },
                    {
                        "id": "PJ_11085772000190",
                        "descricao": "CONCEB ENGENHARIA LTDA",
                        "nome_fantasia": "",
                        "camada": 0,
                        "tipo": 0,
                        "situacao_ativa": true,
                        "logradouro": "RUA CONSELHEIRO SARAIVA, 207",
                        "logradouro_complemento": "SALA 610 - 6 ANDAR-SANTANA",
                        "municipio": "SAO PAULO",
                        "uf": "SP",
                        "cod_nat_juridica": "2062",
                        "nota": "",
                        "imagem": "icone-grafo-empresa.png",
                        "cor": "orange"
                    }
                ],
                "ligacao": [
                    {
                        "origem": "PF_***825238**-ALI MOHAMAD MOURAD",
                        "destino": "PJ_11085772000190",
                        "label": "Sócio-Administrador",
                        "cor": "silver",
                        "camada": 0,
                        "tipoDescricao": ""
                    },
                    {
                        "origem": "PJ_11085772000190",
                        "destino": "TE_11 36621646",
                        "label": "tel",
                        "cor": "silver",
                        "camada": 0,
                        "tipoDescricao": ""
                    },
                    {
                        "origem": "PJ_11085772000190",
                        "destino": "TE_11 39858176",
                        "label": "tel",
                        "cor": "silver",
                        "camada": 0,
                        "tipoDescricao": ""
                    }
                ],
                "mensagem": ""
            });
        }, 3000);
    })
    
}

export default { buscar };