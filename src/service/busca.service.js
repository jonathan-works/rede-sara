
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
        }, 1000);
    })
}

const buscarPorId = async (tipo, id) => {
    //const data await useApi(`/busca/${tipo}/${id}`)

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "matriz_filial": "Matriz",
                "nome_fantasia": "",
                "situacao_cadastral": "02 - Ativa",
                "data_situacao_cadastral": "02/04/2008",
                "motivo_situacao_cadastral": "00-SEM MOTIVO",
                "pais": "",
                "data_inicio_atividades": "02/04/2008",
                "cnae_fiscal": "7020400-Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
                "cep": "04548004",
                "uf": "SP",
                "municipio": "SAO PAULO",
                "ddd1": "11",
                "telefone1": "38767600",
                "ddd2": "",
                "telefone2": "",
                "ddd_fax": "",
                "fax": "",
                "correio_eletronico": "daniel@precisaocontabil.com.br",
                "cnpj": "09514356000118",
                "razao_social": "EGEU CONSULTORIA E GESTAO EMPRESARIAL LTDA",
                "natureza_juridica": "2062-Sociedade Empresária Limitada",
                "porte_empresa": "03-Empresa de pequeno porte",
                "capital_social": "1.000,00",
                "opcao_mei": "",
                "cnae_secundaria": "8219999-Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente",
                "endereco": "AVENIDA DR. CARDOSO DE MELO, 1340, ANDAR 6, VILA OLIMPIA",
                "id": "PJ_09514356000118",
                "cnpj_formatado": "09.514.356/0001-18"
            });
        }, 1000);
    })
}

export default { buscar, buscarPorId };