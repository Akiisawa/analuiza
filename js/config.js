window.WORKSHOP_CONFIG = {
    // Links de destino dos botões principais
links: {
        whatsappGrupoEspera: "https://chat.whatsapp.com/BAM6Ckx4bx43wZoTlQNF1e?s=sw&p=i&iam=2",
        checkoutInscricao: "https://seu_checkout_aqui.com.br",
        politicaPrivacidade: "#",
        termosUso: "#",
        contato: "#"
    },

    // Até 24/11/2026 (23:59:59) = Grupo de espera
    // A partir de 25/11/2026 (00:00:00) = Checkout
    dataCorteISO: "2026-11-25T00:00:00-03:00",

    textosBotoes: {
        espera: "Entrar no grupo de espera",
        inscricao: "Quero participar do workshop",
        garantirVaga: "Quero garantir minha vaga"
    },

    // Informações do evento
    evento: {
        nome: "Por trás do Projeto",
        instrutora: "Ana Luiza Neves",
        datasCurta: "16 e 17 de dezembro • 19h30",
        datasLonga: "16 e 17 de dezembro de 2026, a partir das 19h30 (horário de Brasília)",
        plataforma: "Online e ao vivo pelo Zoom"
    },

    // Valores e itens da seção de investimento
    investimento: {
        valorTotalRiscado: "R$ 823,00",
        parcelamentoDestaque: "12x de R$ XX,XX",
        precoAVista: "ou R$ 197,00 à vista",
        itens: [
            {
                titulo: "Workshop online e ao vivo",
                descricao: "2 encontros pelo Zoom + tira-dúvidas",
                valorRiscado: "R$ 397,00"
            },
            {
                titulo: "Documentos editáveis",
                descricao: "Proposta, contrato, briefing, manual do cliente, atas e termos",
                valorRiscado: "R$ 79,00"
            },
            {
                titulo: "Materiais de organização",
                descricao: "Fluxograma e checklists",
                valorRiscado: "R$ 49,00"
            },
            {
                titulo: "Projeto arquitetônico completo",
                descricao: "Arquivos editáveis",
                valorRiscado: "R$ 149,00"
            },
            {
                titulo: "Projeto de interiores completo",
                descricao: "Arquivos editáveis",
                valorRiscado: "R$ 149,00"
            }
        ]
    },

    // Ajustes finos de rolagem e parallax
    animacao: {
        offsetTopoFollow: 115,
        suavidadeFollow: 0.14,
        intensidadeParallaxImg: -18
    }
};