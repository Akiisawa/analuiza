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

    // Sincroniza valores de investimento e links do rodapé via config.js
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

// 2. Lightbox para Prévias das Pranchas (Pack 01)
    const lightbox = document.querySelector(".js-prancha-lightbox");
    if (lightbox) {
        const lightboxImg = lightbox.querySelector(".js-lightbox-img");
        const lightboxCaption = lightbox.querySelector(".js-lightbox-caption");
        const closeBtn = lightbox.querySelector(".js-lightbox-close");
        const triggers = document.querySelectorAll(".js-preview-trigger");

        function abrirLightbox(src, caption) {
            lightboxImg.src = src;
            lightboxImg.alt = caption || "";
            lightboxCaption.textContent = caption || "";
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }

        function fecharLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        triggers.forEach(function (btn) {
            btn.addEventListener("click", function () {
                abrirLightbox(
                    btn.getAttribute("data-img"),
                    btn.getAttribute("data-caption")
                );
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", fecharLightbox);
        }

        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) {
                fecharLightbox();
            }
        });

        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
                fecharLightbox();
            }
        });
    }

    // 3. Accordion Fluido para o FAQ
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

    // 4. Contador Regressivo Dinâmico (Hero e Investimento)
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

    // 5. Parallax Suave nas Imagens e Molduras
    const janelasParallax = document.querySelectorAll(".parallax-window");
    const elementosParallax = document.querySelectorAll(".parallax-el");
    const intensidadeImg =
        typeof animCfg.intensidadeParallaxImg === "number"
            ? animCfg.intensidadeParallaxImg
            : -16;

    let rafId = null;

    function loopAnimacao() {
        const viewportH = window.innerHeight;

        janelasParallax.forEach(function (janela) {
            const img = janela.querySelector(".parallax-img");
            if (!img) return;

            if (img.classList.contains("autora-parallax-img")) {
                img.style.transform = "translate3d(0, 0, 0)";
                return;
            }

            const rect = janela.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportH) {
                const progresso =
                    (rect.top + rect.height / 2 - viewportH / 2) /
                    (viewportH / 2);
                const deslocamentoY = progresso * intensidadeImg;
                img.style.transform =
                    "translate3d(0, calc(-5% + " +
                    deslocamentoY.toFixed(1) +
                    "px), 0)";
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

        rafId = null;
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