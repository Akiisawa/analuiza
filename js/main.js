document.addEventListener("DOMContentLoaded", function () {
    const cfg = window.SITE_CONFIG || {};
    const links = cfg.links || {};
    const textos = cfg.textos || {};
    const investimento = cfg.investimento || {};

    const urlGrupo = links.grupoEspera || "https://chat.whatsapp.com/BAM6Ckx4bx43wZoTlQNF1e?s=sw&p=i&iam=2";
    const urlCheckout = links.checkout || "";
    const aberturaMs = cfg.dataAberturaInscricoes ? Date.parse(cfg.dataAberturaInscricoes) : NaN;
    const eventoMs = cfg.dataEvento ? Date.parse(cfg.dataEvento) : NaN;

    function anexarUtms(urlDestino) {
        if (!urlDestino || urlDestino.startsWith("#")) return urlDestino;
        const paramsPagina = new URLSearchParams(window.location.search);
        if (!paramsPagina.toString()) return urlDestino;

        try {
            const urlObj = new URL(urlDestino);
            paramsPagina.forEach(function (valor, chave) {
                if (!urlObj.searchParams.has(chave)) {
                    urlObj.searchParams.set(chave, valor);
                }
            });
            return urlObj.toString();
        } catch (err) {
            return urlDestino;
        }
    }

    function checkoutEstaAtivo() {
        if (cfg.forcarModoCheckout && urlCheckout) return true;
        if (urlCheckout && !Number.isNaN(aberturaMs) && Date.now() >= aberturaMs) return true;
        return false;
    }

    function aplicarInvestimento() {
        const totalEl = document.querySelector(".js-valor-total");
        const parceladoEl = document.querySelector(".js-preco-parcelado");
        const avistaEl = document.querySelector(".js-preco-avista");

        if (totalEl && investimento.valorTotalRiscado) {
            totalEl.textContent = investimento.valorTotalRiscado;
        }
        if (parceladoEl && investimento.parcelamentoDestaque) {
            parceladoEl.textContent = investimento.parcelamentoDestaque;
        }
        if (avistaEl && investimento.precoAVista) {
            avistaEl.textContent = investimento.precoAVista;
        }
    }

    function atualizarCtas() {
        const modoCheckout = checkoutEstaAtivo();
        const destino = anexarUtms(modoCheckout ? urlCheckout : urlGrupo);
        const ctas = document.querySelectorAll(".js-cta-dinamico");

        ctas.forEach(function (btn) {
            btn.setAttribute("href", destino);

            if (modoCheckout) {
                const labelCustom = btn.getAttribute("data-label-checkout") || textos.ctaCheckout || "Quero garantir minha vaga";
                const spanTexto = btn.querySelector(".btn-text");
                if (spanTexto) {
                    spanTexto.textContent = labelCustom;
                } else {
                    btn.textContent = labelCustom;
                }
            } else if (textos.ctaEspera && btn.classList.contains("btn-topbar")) {
                btn.textContent = textos.ctaEspera;
            }
        });
    }

    function pad2(n) {
        return String(Math.max(0, n)).padStart(2, "0");
    }

    function iniciarContador() {
        const blocos = Array.from(document.querySelectorAll(".js-countdown"));
        if (!blocos.length) return;

        let jaAtualizouCta = false;

        function atualizarRelogio() {
            const agora = Date.now();
            const modoCheckout = checkoutEstaAtivo();
            let alvoMs = aberturaMs;
            let labelTexto = textos.labelAntesAbertura || "Abertura das inscrições em";

            if (modoCheckout || (!Number.isNaN(aberturaMs) && agora >= aberturaMs)) {
                if (!jaAtualizouCta) {
                    jaAtualizouCta = true;
                    atualizarCtas();
                }
                if (!Number.isNaN(eventoMs) && agora < eventoMs) {
                    alvoMs = eventoMs;
                    labelTexto = textos.labelAposAbertura || "Inscrições abertas • O workshop começa em";
                } else {
                    alvoMs = NaN;
                }
            }

            const diff = Number.isNaN(alvoMs) ? 0 : alvoMs - agora;

            blocos.forEach(function (bloco) {
                const labelEl = bloco.querySelector(".js-countdown-label");
                const gridEl = bloco.querySelector(".countdown-grid");
                const daysEl = bloco.querySelector(".js-cd-days");
                const hoursEl = bloco.querySelector(".js-cd-hours");
                const minsEl = bloco.querySelector(".js-cd-mins");
                const secsEl = bloco.querySelector(".js-cd-secs");

                if (diff <= 0) {
                    if (labelEl) labelEl.style.display = "none";
                    if (gridEl) {
                        gridEl.innerHTML = '<span class="countdown-finished">' + (textos.mensagemEncerrado || "As inscrições estão abertas!") + "</span>";
                    }
                    return;
                }

                if (labelEl) {
                    labelEl.style.display = "";
                    labelEl.textContent = labelTexto;
                }

                const totalSeg = Math.floor(diff / 1000);
                const dias = Math.floor(totalSeg / 86400);
                const horas = Math.floor((totalSeg % 86400) / 3600);
                const mins = Math.floor((totalSeg % 3600) / 60);
                const segs = totalSeg % 60;

                if (daysEl) daysEl.textContent = pad2(dias);
                if (hoursEl) hoursEl.textContent = pad2(horas);
                if (minsEl) minsEl.textContent = pad2(mins);
                if (secsEl) secsEl.textContent = pad2(segs);
            });
        }

        atualizarRelogio();
        window.setInterval(atualizarRelogio, 1000);
    }

    function iniciarLightbox() {
        const lightbox = document.querySelector(".js-prancha-lightbox");
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector(".js-lightbox-img");
        const lightboxCaption = lightbox.querySelector(".js-lightbox-caption");
        const closeBtn = lightbox.querySelector(".js-lightbox-close");
        const triggers = document.querySelectorAll(".js-preview-trigger");

        function abrirLightbox(src, caption) {
            if (lightboxImg) {
                lightboxImg.src = src || "";
                lightboxImg.alt = caption || "";
            }
            if (lightboxCaption) {
                lightboxCaption.textContent = caption || "";
            }
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

    function iniciarFaq() {
        const faqItems = Array.from(document.querySelectorAll(".faq-item"));
        if (!faqItems.length) return;

        faqItems.forEach(function (item) {
            const btn = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");
            if (!btn || !answer) return;

            btn.addEventListener("click", function () {
                const estavaAtivo = item.classList.contains("active");

                faqItems.forEach(function (outro) {
                    outro.classList.remove("active");
                    const outroBtn = outro.querySelector(".faq-question");
                    const outroAnswer = outro.querySelector(".faq-answer");
                    if (outroBtn) outroBtn.setAttribute("aria-expanded", "false");
                    if (outroAnswer) outroAnswer.style.maxHeight = null;
                });

                if (!estavaAtivo) {
                    item.classList.add("active");
                    btn.setAttribute("aria-expanded", "true");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    function iniciarModalLegal() {
        const linkPriv = document.querySelector(".js-link-privacidade");
        const linkTermos = document.querySelector(".js-link-termos");
        const linkContato = document.querySelector(".js-link-contato");

        if (linkPriv && links.privacidade) linkPriv.setAttribute("href", links.privacidade);
        if (linkTermos && links.termos) linkTermos.setAttribute("href", links.termos);
        if (linkContato && links.contato) linkContato.setAttribute("href", links.contato);

        const legalModal = document.querySelector(".js-legal-modal");
        if (!legalModal) return;

        const legalTitle = legalModal.querySelector(".js-legal-title");
        const legalBody = legalModal.querySelector(".js-legal-body");
        const legalClose = legalModal.querySelector(".js-legal-close");
        const footerLinks = document.querySelectorAll(".footer-links a[data-modal]");

        const conteudosLegais = {
            privacidade: {
                titulo: "Política de Privacidade",
                html:
                    "<p>Respeitamos a sua privacidade e tratamos seus dados pessoais em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.</p>" +
                    "<p>As informações fornecidas voluntariamente para inscrição no workshop <strong>Por Trás do Projeto</strong> ou ingresso no grupo de espera são utilizadas exclusivamente para envio de comunicados sobre o evento, liberação de acesso às aulas e suporte aos participantes.</p>" +
                    "<p>Não compartilhamos, vendemos ou cedemos seus dados a terceiros, exceto com plataformas estritamente necessárias para o processamento de pagamentos e entrega do conteúdo. Você pode solicitar a atualização ou exclusão dos seus dados a qualquer momento pelos nossos canais de contato.</p>"
            },
            termos: {
                titulo: "Termos de Uso",
                html:
                    "<p>Ao realizar sua inscrição no workshop <strong>Por Trás do Projeto</strong>, você terá acesso aos dois encontros online e ao vivo pelo Zoom nos dias 16 e 17 de dezembro de 2026, às gravações por 12 meses e aos materiais editáveis disponibilizados.</p>" +
                    "<p><strong>Propriedade intelectual:</strong> os documentos editáveis e projetos completos são liberados para uso e adaptação na rotina profissional do participante. É proibida a redistribuição, revenda ou compartilhamento público das aulas gravadas e do acervo técnico.</p>" +
                    "<p>O bônus exclusivo sobre projetos residenciais financiados pela Caixa (PCI e PLS) é destinado aos participantes dos encontros ao vivo, conforme informado nesta página.</p>"
            },
            contato: {
                titulo: "Contato e Suporte",
                html:
                    "<p>Ficou com alguma dúvida sobre o workshop <strong>Por Trás do Projeto</strong>, inscrições ou formas de pagamento? Fale diretamente com a nossa equipe pelo grupo oficial no WhatsApp.</p>" +
                    '<div class="legal-modal-actions">' +
                    '<a href="' + anexarUtms(urlGrupo) + '" class="btn-primary" target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp <i class="fa-solid fa-arrow-right"></i></a>' +
                    "</div>"
            }
        };

        function abrirModalLegal(tipo) {
            const dados = conteudosLegais[tipo];
            if (!dados) return;
            if (legalTitle) legalTitle.textContent = dados.titulo;
            if (legalBody) legalBody.innerHTML = dados.html;
            legalModal.classList.add("is-open");
            legalModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }

        function fecharModalLegal() {
            legalModal.classList.remove("is-open");
            legalModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        footerLinks.forEach(function (link) {
            link.addEventListener("click", function (e) {
                const href = link.getAttribute("href") || "";
                if (href === "#" || href.startsWith("#")) {
                    e.preventDefault();
                    abrirModalLegal(link.getAttribute("data-modal"));
                }
            });
        });

        if (legalClose) {
            legalClose.addEventListener("click", fecharModalLegal);
        }

        legalModal.addEventListener("click", function (e) {
            if (e.target === legalModal) {
                fecharModalLegal();
            }
        });

        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && legalModal.classList.contains("is-open")) {
                fecharModalLegal();
            }
        });
    }

    function iniciarParallax() {
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const parallaxEls = Array.from(document.querySelectorAll(".parallax-el"));
        const parallaxWindows = Array.from(document.querySelectorAll(".parallax-window"));
        if (!parallaxEls.length && !parallaxWindows.length) return;

        let ticking = false;

        function atualizarParallax() {
            ticking = false;

            if (window.innerWidth <= 980) {
                parallaxEls.forEach(function (el) {
                    el.style.transform = "";
                });
                parallaxWindows.forEach(function (win) {
                    const img = win.querySelector(".parallax-img");
                    if (img) img.style.transform = "";
                });
                return;
            }

            const vh = window.innerHeight || 1;

            parallaxEls.forEach(function (el) {
                const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.06;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + rect.height * 0.5 - vh * 0.5) * speed;
                el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
            });

            parallaxWindows.forEach(function (win) {
                const img = win.querySelector(".parallax-img");
                if (!img) return;
                const rect = win.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > vh) return;
                const progresso = (rect.top + rect.height) / (vh + rect.height);
                const desloc = (progresso - 0.5) * -36;
                img.style.transform = "translate3d(0, " + desloc.toFixed(1) + "px, 0)";
            });
        }

        function agendarAtualizacao() {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(atualizarParallax);
            }
        }

        window.addEventListener("scroll", agendarAtualizacao, { passive: true });
        window.addEventListener("resize", agendarAtualizacao, { passive: true });
        atualizarParallax();
    }

    aplicarInvestimento();
    atualizarCtas();
    iniciarContador();
    iniciarLightbox();
    iniciarFaq();
    iniciarModalLegal();
    iniciarParallax();
});