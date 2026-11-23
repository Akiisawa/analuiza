window.WORKSHOP_CONFIG = {
    // Links de destino dos botões principais e rodapé
    links: {
        whatsappGrupoEspera: "https://chat.whatsapp.com/BAM6Ckx4bx43wZoTlQNF1e?s=sw&p=i&iam=2",
        checkoutInscricao: "https://seu_checkout_aqui.com.br",
        politicaPrivacidade: "#",
        termosUso: "#",
        contato: "https://chat.whatsapp.com/BAM6Ckx4bx43wZoTlQNF1e?s=sw&p=i&iam=2"
    },

    // Até 24/11/2026 (23:59:59) = Grupo de espera
    // A partir de 25/11/2026 (00:00:00) = Checkout
    dataCorteISO: "2026-11-25T00:00:00-03:00",

    textosBotoes: {
        espera: "Entrar no grupo de espera",
        inscricao: "Quero participar do workshop",
        garantirVaga: "Quero garantir minha vaga"
    },

    // Valores exibidos na seção de investimento
    investimento: {
        valorTotalRiscado: "R$ 823,00",
        parcelamentoDestaque: "12x de R$ XX,XX",
        precoAVista: "ou R$ 197,00 à vista"
    },

    // Configurações do contador regressivo
    contador: {
        ativo: true,
        // "automatico" -> conta para a abertura (25/11) e depois para o workshop (16/12)
        // "evento"     -> conta direto para o início do workshop (16/12 às 19h30)
        modo: "automatico",
        dataEventoISO: "2026-12-16T19:30:00-03:00",
        labelAbertura: "Abertura das inscrições em",
        labelEvento: "O workshop começa em",
        mensagemEncerrado: "Encontros ao vivo iniciados"
    },

    // Ajustes finos de parallax
    animacao: {
        intensidadeParallaxImg: -16
    }
};