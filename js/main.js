document.addEventListener("DOMContentLoaded", function () {
    const cfg = window.WORKSHOP_CONFIG || {};
    const linksCfg = cfg.links || {};
    const textosCfg = cfg.textosBotoes || {};
    const invCfg = cfg.investimento || {};
    const cdCfg = cfg.contador || {};
    const animCfg = cfg.animacao || {};

    // 1. Alternância Automática dos Botões + Preservação de UTMs
    const linkWhatsAppBase =
        linksCfg.whatsappGrupoEspera ||
        "https://chat.whatsapp.com/BAM6Ckx4bx43wZoTlQNF1e?s=sw&p=i&iam=2";
    const linkCheckoutBase =
        linksCfg.checkoutInscricao || "https://seu_checkout_aqui.com.br";

    const dataCorte = cfg.dataCorteISO
        ? new Date(cfg.dataCorteISO)
        : new Date(2026, 10, 25, 0, 0, 0);

    const queryParams = window.location.search;
    function anexarUtms(url) {
        if (!queryParams) return url;
        const separador = url.includes("?") ? "&" : "?";
        return url + separador + queryParams.substring(1);
    }

    function aplicarCtas() {
        const ehFaseEspera = Date.now() < dataCorte.getTime();
        const destinoFinal = anexarUtms(
            ehFaseEspera ? linkWhatsAppBase : linkCheckoutBase
        );

        document.querySelectorAll(".js-cta-dinamico").forEach(function (botao) {
            botao.href = destinoFinal;
            const labelCheckout =
                botao.getAttribute("data-label-checkout") ||
                textosCfg.inscricao ||
                "Quero participar do workshop";
            const labelFinal = ehFaseEspera
                ? textosCfg.espera || "Entrar no grupo de espera"
                : labelCheckout;

            const spanTexto = botao.querySelector(".btn-text");
            if (spanTexto) {
                spanTexto.textContent = labelFinal;
            } else {
                botao.textContent = labelFinal;
            }
        });
    }

    aplicarCtas();

    // Sincroniza valores de investimento e links do rodapé a partir do config.js
    const elTotal = document.querySelector(".js-valor-total");
    const elParcelado = document.querySelector(".js-preco-parcelado");
    const elAVista = document.querySelector(".js-preco-avista");

    if (elTotal && invCfg.valorTotalRiscado) elTotal.textContent = invCfg.valorTotalRiscado;
    if (elParcelado && invCfg.parcelamentoDestaque) elParcelado.textContent = invCfg.parcelamentoDestaque;
    if (elAVista && invCfg.precoAVista) elAVista.textContent = invCfg.precoAVista;

    const elPriv = document.querySelector(".js-link-privacidade");
    const elTermos = document.querySelector(".js-link-termos");
    const elContato = document.querySelector(".js-link-contato");

    if (elPriv && linksCfg.politicaPrivacidade) elPriv.href = linksCfg.politicaPrivacidade;
    if (elTermos && linksCfg.termosUso) elTermos.href = linksCfg.termosUso;
    if (elContato && linksCfg.contato) elContato.href = linksCfg.contato;

    // 2. Accordion Fluido para o FAQ (Seção 09)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        const btn = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        btn.addEventListener("click", function () {
            const estaAberto = item.classList.contains("active");

            faqItems.forEach(function (outroItem) {
                outroItem.classList.remove("active");
                outroItem
                    .querySelector(".faq-question")
                    .setAttribute("aria-expanded", "false");
                outroItem.querySelector(".faq-answer").style.maxHeight = null;
            });

            if (!estaAberto) {
                item.classList.add("active");
                btn.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 3. Contador Regressivo Dinâmico (Hero e Investimento)
    const countdownEls = document.querySelectorAll(".js-countdown");
    if (countdownEls.length > 0) {
        if (cdCfg.ativo === false) {
            countdownEls.forEach(function (el) {
                el.style.display = "none";
            });
        } else {
            const dataEvento = cdCfg.dataEventoISO
                ? new Date(cdCfg.dataEventoISO)
                : new Date(2026, 11, 16, 19, 30, 0);

            function pad2(num) {
                return String(num).padStart(2, "0");
            }

            let ultimoEstadoEspera = Date.now() < dataCorte.getTime();

            function atualizarContadores() {
                const agoraMs = Date.now();
                const corteMs = dataCorte.getTime();
                const eventoMs = dataEvento.getTime();
                const agoraEhEspera = agoraMs < corteMs;

                // Se virou a data de corte com a página aberta, atualiza os botões também
                if (agoraEhEspera !== ultimoEstadoEspera) {
                    ultimoEstadoEspera = agoraEhEspera;
                    aplicarCtas();
                }

                let alvoMs = eventoMs;
                let tituloAtual = cdCfg.labelEvento || "O workshop começa em";

                if (cdCfg.modo === "automatico" && agoraEhEspera) {
                    alvoMs = corteMs;
                    tituloAtual =
                        cdCfg.labelAbertura || "Abertura das inscrições em";
                }

                const diffMs = alvoMs - agoraMs;

                countdownEls.forEach(function (box) {
                    const labelEl = box.querySelector(".js-countdown-label");
                    const gridEl = box.querySelector(".countdown-grid");

                    if (diffMs <= 0) {
                        if (labelEl) labelEl.style.display = "none";
                        if (gridEl) {
                            gridEl.innerHTML =
                                '<span class="countdown-finished">' +
                                (cdCfg.mensagemEncerrado ||
                                    "Encontros ao vivo iniciados") +
                                "</span>";
                        }
                        return;
                    }

                    const totalSegundos = Math.floor(diffMs / 1000);
                    const dias = Math.floor(totalSegundos / 86400);
                    const horas = Math.floor((totalSegundos % 86400) / 3600);
                    const minutos = Math.floor((totalSegundos % 3600) / 60);
                    const segundos = totalSegundos % 60;

                    if (labelEl) labelEl.textContent = tituloAtual;
                    const dEl = box.querySelector(".js-cd-days");
                    const hEl = box.querySelector(".js-cd-hours");
                    const mEl = box.querySelector(".js-cd-mins");
                    const sEl = box.querySelector(".js-cd-secs");

                    if (dEl) dEl.textContent = pad2(dias);
                    if (hEl) hEl.textContent = pad2(horas);
                    if (mEl) mEl.textContent = pad2(minutos);
                    if (sEl) sEl.textContent = pad2(segundos);
                });
            }

            atualizarContadores();
            window.setInterval(atualizarContadores, 1000);
        }
    }

    // 4. Acompanhamento Suave pelo Topo da Tela (.js-follow-top) + Parallax das Imagens
    const followTopElements = document.querySelectorAll(".js-follow-top");
    const janelasParallax = document.querySelectorAll(".parallax-window");
    const elementosParallax = document.querySelectorAll(".parallax-el");
    const suavidade =
        typeof animCfg.suavidadeFollow === "number"
            ? animCfg.suavidadeFollow
            : 0.14;
    const intensidadeImg =
        typeof animCfg.intensidadeParallaxImg === "number"
            ? animCfg.intensidadeParallaxImg
            : -18;

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

        const topOffset =
            parseFloat(el.getAttribute("data-top-offset")) ||
            animCfg.offsetTopoFollow ||
            115;
        const secRect = secao.getBoundingClientRect();
        const styles = window.getComputedStyle(secao);
        const padTop = parseFloat(styles.paddingTop) || 0;
        const padBottom = parseFloat(styles.paddingBottom) || 0;

        const deslocamentoDesejado = Math.max(
            0,
            -secRect.top - padTop + topOffset
        );
        const alturaUtilSecao = secao.offsetHeight - padTop - padBottom;
        const deslocamentoMaximo = Math.max(
            0,
            alturaUtilSecao - el.offsetHeight
        );

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

            item.el.style.transform =
                "translate3d(0, " + item.currentOffset.toFixed(1) + "px, 0)";
        });

        janelasParallax.forEach(function (janela) {
            const img = janela.querySelector(".parallax-img");
            if (!img) return;
            const rect = janela.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportH) {
                const progresso =
                    (rect.top + rect.height / 2 - viewportH / 2) /
                    (viewportH / 2);

                if (img.classList.contains("autora-parallax-img")) {
                    const descidaSuave = Math.max(
                        0,
                        Math.min(6, (1 - progresso) * 4)
                    );
                    img.style.transform =
                        "translate3d(0, " + descidaSuave.toFixed(1) + "px, 0)";
                } else {
                    const deslocamentoY = progresso * intensidadeImg;
                    img.style.transform =
                        "translate3d(0, calc(-6% + " +
                        deslocamentoY.toFixed(1) +
                        "px), 0)";
                }
            }
        });

        if (window.innerWidth > 980) {
            elementosParallax.forEach(function (el) {
                const speed =
                    parseFloat(el.getAttribute("data-parallax-speed")) || 0.05;
                const rect = el.getBoundingClientRect();
                if (rect.bottom > -100 && rect.top < viewportH + 100) {
                    const centroDistancia =
                        rect.top + rect.height / 2 - viewportH / 2;
                    const offset = centroDistancia * speed;
                    el.style.transform =
                        "translate3d(0, " + offset.toFixed(1) + "px, 0)";
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