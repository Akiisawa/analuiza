document.addEventListener("DOMContentLoaded", function () {
    const cfg = window.WORKSHOP_CONFIG || {};
    const linksCfg = cfg.links || {};
    const textosCfg = cfg.textosBotoes || {};
    const animCfg = cfg.animacao || {};

    // 1. Alternância Automática dos Botões + Preservação de UTMs
    const linkWhatsAppBase = linksCfg.whatsappGrupoEspera || "https://wa.me/seu_numero_aqui";
    const linkCheckoutBase = linksCfg.checkoutInscricao || "https://seu_checkout_aqui.com.br";

    const dataCorte = cfg.dataCorteISO
        ? new Date(cfg.dataCorteISO)
        : new Date(2026, 10, 25, 0, 0, 0);
    const agora = new Date();
    const ehFaseEspera = agora < dataCorte;

    const queryParams = window.location.search;
    function anexarUtms(url) {
        if (!queryParams) return url;
        const separador = url.includes("?") ? "&" : "?";
        return url + separador + queryParams.substring(1);
    }

    const destinoFinal = anexarUtms(ehFaseEspera ? linkWhatsAppBase : linkCheckoutBase);
    const labelFinal = ehFaseEspera
        ? (textosCfg.espera || "Entrar no grupo de espera")
        : (textosCfg.inscricao || "Quero participar do workshop");

    document.querySelectorAll(".js-cta-dinamico").forEach(function (botao) {
        botao.href = destinoFinal;
        const spanTexto = botao.querySelector(".btn-text");
        if (spanTexto) {
            spanTexto.textContent = labelFinal;
        } else {
            botao.textContent = labelFinal;
        }
    });

    // 2. Accordion Fluido para o FAQ (Seção 09)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        const btn = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        btn.addEventListener("click", function () {
            const estaAberto = item.classList.contains("active");

            faqItems.forEach(function (outroItem) {
                outroItem.classList.remove("active");
                outroItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
                outroItem.querySelector(".faq-answer").style.maxHeight = null;
            });

            if (!estaAberto) {
                item.classList.add("active");
                btn.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 3. Acompanhamento Suave pelo Topo da Tela (.js-follow-top) + Parallax das Imagens
    const followTopElements = document.querySelectorAll(".js-follow-top");
    const janelasParallax = document.querySelectorAll(".parallax-window");
    const elementosParallax = document.querySelectorAll(".parallax-el");
    const suavidade = typeof animCfg.suavidadeFollow === "number" ? animCfg.suavidadeFollow : 0.14;
    const intensidadeImg = typeof animCfg.intensidadeParallaxImg === "number" ? animCfg.intensidadeParallaxImg : -18;

    const followState = Array.from(followTopElements).map(function (el) {
        return { el: el, currentOffset: 0 };
    });

    let rafId = null;

    function calcularAlvoFollowTop(item) {
        if (window.innerWidth <= 980) {
            return 0;
        }

        const el = item.el;
        const secao = el.closest("section");
        if (!secao) return 0;

        const topOffset = parseFloat(el.getAttribute("data-top-offset")) || animCfg.offsetTopoFollow || 115;
        const secRect = secao.getBoundingClientRect();
        const styles = window.getComputedStyle(secao);
        const padTop = parseFloat(styles.paddingTop) || 0;
        const padBottom = parseFloat(styles.paddingBottom) || 0;

        const deslocamentoDesejado = Math.max(0, -secRect.top - padTop + topOffset);
        const alturaUtilSecao = secao.offsetHeight - padTop - padBottom;
        const deslocamentoMaximo = Math.max(0, alturaUtilSecao - el.offsetHeight);

        return Math.min(deslocamentoDesejado, deslocamentoMaximo);
    }

    function loopAnimacao() {
        const viewportH = window.innerHeight;
        let precisaContinuar = false;

        followState.forEach(function (item) {
            const targetOffset = calcularAlvoFollowTop(item);
            const diff = targetOffset - item.currentOffset;

            if (Math.abs(diff) > 0.15) {
                item.currentOffset += diff * suavidade;
                precisaContinuar = true;
            } else {
                item.currentOffset = targetOffset;
            }

            item.el.style.transform = "translate3d(0, " + item.currentOffset.toFixed(1) + "px, 0)";
        });

        janelasParallax.forEach(function (janela) {
            const img = janela.querySelector(".parallax-img");
            if (!img) return;
            const rect = janela.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportH) {
                const progresso = (rect.top + rect.height / 2 - viewportH / 2) / (viewportH / 2);

                if (img.classList.contains("autora-parallax-img")) {
                    const descidaSuave = Math.max(0, Math.min(6, (1 - progresso) * 4));
                    img.style.transform = "translate3d(0, " + descidaSuave.toFixed(1) + "px, 0)";
                } else {
                    const deslocamentoY = progresso * intensidadeImg;
                    img.style.transform = "translate3d(0, calc(-6% + " + deslocamentoY.toFixed(1) + "px), 0)";
                }
            }
        });

        if (window.innerWidth > 980) {
            elementosParallax.forEach(function (el) {
                const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.05;
                const rect = el.getBoundingClientRect();
                if (rect.bottom > -100 && rect.top < viewportH + 100) {
                    const centroDistancia = (rect.top + rect.height / 2) - (viewportH / 2);
                    const offset = centroDistancia * speed;
                    el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
                }
            });
        } else {
            elementosParallax.forEach(function (el) {
                el.style.transform = "none";
            });
        }

        if (precisaContinuar) {
            rafId = window.requestAnimationFrame(loopAnimacao);
        } else {
            rafId = null;
        }
    }

    function solicitarAtualizacao() {
        if (!rafId) {
            rafId = window.requestAnimationFrame(loopAnimacao);
        }
    }

    window.addEventListener("scroll", solicitarAtualizacao, { passive: true });
    window.addEventListener("resize", solicitarAtualizacao);
    solicitarAtualizacao();
});