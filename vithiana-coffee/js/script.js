/* =====================================================================
   VITHIANA COFFEE — js/script.js
   JavaScript principal. Precisa vir DEPOIS de js/produtos.js (usa o array "produtos").

   Cada funcionalidade é uma função "iniciarXxx()". Cada uma confere se os
   elementos existem na página atual antes de rodar — assim o mesmo arquivo
   serve para as 6 páginas sem dar erro.

   ÍNDICE
    1. Ajudantes (formatar preço, WhatsApp, avisos)
    2. Sons (música de fundo + efeito de clique)
    3. Menu hambúrguer e destaque do link ativo
    4. Neve (canvas)
    5. Parallax (evento scroll)
    6. Carrossel automático
    7. Cards de produtos (criados a partir do array)
    8. Filtro por categoria + busca por nome
    9. Modal de detalhes
   10. Carrinho (localStorage)
   11. Contagem regressiva do Natal
   12. Galeria e lightbox
   13. Formulário de contato (validação)
   14. Animação ao rolar, botão voltar ao topo
   15. Inicialização
   ===================================================================== */
"use strict";

/* ---------- 1. AJUDANTES ---------- */
const WHATSAPP = "5519991591344";
const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));

// Transforma 18.9 em "R$ 18,90"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Cria o link do WhatsApp já com a mensagem pronta (encodeURIComponent troca espaços e acentos por códigos de URL)
function linkWhatsApp(mensagem) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

// Evita que um texto digitado vire HTML (segurança básica)
function escapar(texto) {
  const d = document.createElement("div");
  d.textContent = texto;
  return d.innerHTML;
}

// Aviso rápido na parte de baixo da tela
let temporizadorAviso;
function mostrarAviso(texto) {
  let aviso = $("#aviso");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "aviso";
    aviso.className = "aviso";
    aviso.setAttribute("role", "status");
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("mostra");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("mostra"), 2400);
}

/* ---------- 2. SONS ----------
   - A música só começa quando a pessoa CLICA no botão (os navegadores bloqueiam som automático).
   - Volume baixo (0.25). Se o arquivo MP3 não existir, nada quebra: só mostramos um aviso.
   - O estado (ligada/desligada) fica salvo para a próxima página.            */
const musica = new Audio("audio/musica-natal.mp3");
musica.loop = true;
musica.volume = 0.25;
const sino = new Audio("audio/sino.mp3");
sino.volume = 0.4;

function tocarSino() {
  try {
    sino.currentTime = 0;
    const p = sino.play();
    if (p && p.catch) p.catch(() => {});        // ignora erro (arquivo ausente ou bloqueado)
  } catch (e) { /* sem som, sem problema */ }
}

function iniciarMusica() {
  const botao = $("#btnMusica");
  if (!botao) return;
  const rotulo = $(".rotulo", botao);

  const atualizar = (tocando) => {
    botao.classList.toggle("tocando", tocando);
    botao.setAttribute("aria-pressed", String(tocando));
    if (rotulo) rotulo.textContent = tocando ? "Música: ligada" : "Música: desligada";
  };
  atualizar(false);

  // Continua do ponto onde estava na página anterior (se a pessoa tinha ligado)
  try {
    const t = parseFloat(sessionStorage.getItem("vc-musica-tempo"));
    if (!isNaN(t)) musica.currentTime = t;
  } catch (e) {}

  botao.addEventListener("click", () => {
    if (musica.paused) {
      const p = musica.play();
      if (p && p.then) {
        p.then(() => { atualizar(true); try { localStorage.setItem("vc-musica", "1"); } catch (e) {} })
         .catch(() => { atualizar(false); mostrarAviso("Não foi possível tocar a música (arquivo ausente)."); });
      }
    } else {
      musica.pause();
      atualizar(false);
      try { localStorage.setItem("vc-musica", "0"); } catch (e) {}
    }
  });

  // guarda o ponto da música ao trocar de página
  window.addEventListener("pagehide", () => {
    try { sessionStorage.setItem("vc-musica-tempo", String(musica.currentTime)); } catch (e) {}
  });
}

// Som de sininho ao clicar em botões e links (um único "ouvinte" para a página toda = delegação de eventos)
function iniciarSomCliques() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".botao, .link-card, .btn-carrinho, .seta, .chip, .card-botoes button")) tocarSino();
  });
}

/* ---------- 3. MENU HAMBÚRGUER ---------- */
function iniciarMenu() {
  const botao = $(".menu-toggle");
  const menu = $("#menu");
  if (!botao || !menu) return;

  const fechar = () => { menu.classList.remove("aberto"); botao.setAttribute("aria-expanded", "false"); };
  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
  });
  // fecha ao clicar em um link, ao apertar Esc ou ao clicar fora
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) fechar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".topo")) fechar(); });

  // marca o link da página atual (classe "ativo")
  const atual = location.pathname.split("/").pop() || "index.html";
  $$("a", menu).forEach((a) => {
    const destino = a.getAttribute("href");
    if (destino === atual || (atual === "" && destino === "index.html")) {
      a.classList.add("ativo");
      a.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- 4. NEVE (canvas) ----------
   Desenhamos flocos num <canvas> que cobre a tela. requestAnimationFrame
   chama a função ~60x por segundo. Pausa quando a aba está escondida.      */
function iniciarNeve() {
  const tela = $("#neve");
  if (!tela || !tela.getContext) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { tela.style.display = "none"; return; }
  const ctx = tela.getContext("2d");
  let largura, altura, flocos = [];

  function ajustar() {
    largura = tela.width = window.innerWidth;
    altura = tela.height = window.innerHeight;
    const quantidade = Math.min(90, Math.round(largura / 14));   // menos flocos no celular
    flocos = Array.from({ length: quantidade }, novoFloco);
  }
  function novoFloco() {
    return {
      x: Math.random() * largura, y: Math.random() * altura,
      r: Math.random() * 2.6 + 1, v: Math.random() * 0.9 + 0.4,
      balanco: Math.random() * Math.PI * 2, o: Math.random() * 0.5 + 0.4
    };
  }
  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    for (const f of flocos) {
      f.y += f.v;
      f.balanco += 0.012;
      f.x += Math.sin(f.balanco) * 0.5;
      if (f.y > altura + 5) { f.y = -5; f.x = Math.random() * largura; }
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255," + f.o + ")";
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!document.hidden) requestAnimationFrame(desenhar);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(desenhar); });
  window.addEventListener("resize", ajustar);
  ajustar();
  requestAnimationFrame(desenhar);
}

/* ---------- 5. PARALLAX (evento scroll) ----------
   Cada imagem com data-velocidade se move numa velocidade diferente quando
   rolamos a página. Valor 0.1 = sobe devagar (fundo); 0.5 = anda mais rápido.
   Guardamos o resultado na variável CSS --py, que o CSS usa no transform.   */
function iniciarParallax() {
  const camadas = $$("[data-velocidade]");
  if (!camadas.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let esperando = false;

  function atualizar() {
    const rolagem = window.scrollY;
    // só calcula enquanto o banner está visível (economiza processamento)
    if (rolagem < window.innerHeight * 1.3) {
      camadas.forEach((c) => {
        const v = parseFloat(c.dataset.velocidade) || 0;
        c.style.setProperty("--py", (rolagem * v).toFixed(1) + "px");
      });
    }
    esperando = false;
  }
  window.addEventListener("scroll", () => {
    if (!esperando) { esperando = true; requestAnimationFrame(atualizar); }   // limita a 1 cálculo por quadro
  }, { passive: true });
  atualizar();
}

/* ---------- 6. CARROSSEL AUTOMÁTICO ---------- */
function iniciarCarrossel() {
  const carrossel = $("#carrossel");
  if (!carrossel) return;
  const slides = $$(".slide", carrossel);
  const indicadores = $("#indicadores");
  let atual = 0, timer;

  // cria uma bolinha para cada slide
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ir para o slide " + (i + 1));
    b.addEventListener("click", () => { mostrar(i); reiniciar(); });
    indicadores.appendChild(b);
  });
  const bolinhas = $$("button", indicadores);

  function mostrar(n) {
    atual = (n + slides.length) % slides.length;           // volta ao começo/fim
    slides.forEach((s, i) => { s.classList.toggle("ativo", i === atual); s.setAttribute("aria-hidden", String(i !== atual)); });
    bolinhas.forEach((b, i) => { b.classList.toggle("ativo", i === atual); b.setAttribute("aria-current", String(i === atual)); });
  }
  function reiniciar() { clearInterval(timer); timer = setInterval(() => mostrar(atual + 1), 5000); }

  $(".anterior", carrossel).addEventListener("click", () => { mostrar(atual - 1); reiniciar(); });
  $(".proximo", carrossel).addEventListener("click", () => { mostrar(atual + 1); reiniciar(); });
  carrossel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { mostrar(atual - 1); reiniciar(); }
    if (e.key === "ArrowRight") { mostrar(atual + 1); reiniciar(); }
  });
  // pausa quando o mouse está em cima
  carrossel.addEventListener("mouseenter", () => clearInterval(timer));
  carrossel.addEventListener("mouseleave", reiniciar);
  // suporte a deslizar o dedo no celular
  let inicioX = null;
  carrossel.addEventListener("touchstart", (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
  carrossel.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dif = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dif) > 40) { mostrar(atual + (dif < 0 ? 1 : -1)); reiniciar(); }
    inicioX = null;
  });
  mostrar(0);
  reiniciar();
}

/* ---------- 7. CARDS DE PRODUTOS ----------
   criarCard() recebe UM produto (objeto) e devolve o HTML do card.
   renderizarProdutos() recebe uma LISTA, limpa a grade e cria todos os cards.  */
function criarCard(p, indice) {
  const estrela = p.destaque
    ? '<span class="badge-destaque" title="Destaque"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg></span>'
    : "";
  return `
    <article class="card" style="animation-delay:${Math.min(indice, 12) * 45}ms" data-id="${p.id}">
      <div class="card-imagem">
        <img src="${p.imagem}" alt="${escapar(p.nome)}" loading="lazy" width="600" height="600">
        <span class="badge-categoria">${escapar(p.categoria)}</span>
        ${estrela}
      </div>
      <div class="card-corpo">
        <h3>${escapar(p.nome)}</h3>
        <p class="card-descricao">${escapar(p.descricao)}</p>
        <span class="preco">${formatarPreco(p.preco)}</span>
        <div class="card-botoes">
          <button type="button" class="botao botao-contorno" data-acao="detalhes" data-id="${p.id}">Detalhes</button>
          <button type="button" class="botao" data-acao="adicionar" data-id="${p.id}">
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h-2l-1 2H2v2h1.6l2.7 8.6A2 2 0 0 0 8.2 18h8.6a2 2 0 0 0 1.9-1.4L21 8H6.2l-.5-2zM9 20a1.5 1.5 0 1 0 0 .01zM17 20a1.5 1.5 0 1 0 0 .01z"/></svg>
            Adicionar
          </button>
        </div>
      </div>
    </article>`;
}

function renderizarProdutos(lista, grade) {
  grade.innerHTML = lista.map(criarCard).join("");
}

// Clique nos botões dos cards (delegação: um só ouvinte na página cuida de todos os cards)
function iniciarAcoesDosCards() {
  document.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-acao]");
    if (!botao) return;
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === "adicionar") adicionarAoCarrinho(id);
    if (botao.dataset.acao === "detalhes") abrirModal(id);
  });
}

// Destaques da página inicial: pega do array os produtos com destaque: true
function iniciarDestaques() {
  const grade = $("#produtosDestaque");
  if (!grade || typeof produtos === "undefined") return;
  renderizarProdutos(produtos.filter((p) => p.destaque).slice(0, 8), grade);
}

/* ---------- 8. FILTRO POR CATEGORIA + BUSCA ---------- */
// Tira acentos e deixa minúsculo, para "cafe" achar "Café"
function normalizar(t) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function iniciarProdutos() {
  const grade = $("#gradeProdutos");
  if (!grade || typeof produtos === "undefined") return;
  const busca = $("#busca");
  const selecao = $("#categoria");
  const contador = $("#contador");
  const vazio = $("#semResultados");
  const limpar = $("#limparFiltros");

  // monta as opções do filtro a partir do próprio array (sem repetir categorias)
  const categorias = [...new Set(produtos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  selecao.innerHTML = '<option value="todas">Todas as categorias</option>' +
    categorias.map((c) => `<option value="${escapar(c)}">${escapar(c)}</option>`).join("");

  function filtrar() {
    const termo = normalizar(busca.value.trim());
    const cat = selecao.value;
    const lista = produtos.filter((p) =>
      (cat === "todas" || p.categoria === cat) &&
      (termo === "" || normalizar(p.nome).includes(termo) || normalizar(p.descricao).includes(termo))
    );
    renderizarProdutos(lista, grade);
    contador.innerHTML = "Exibindo <strong>" + lista.length + "</strong> de <strong>" + produtos.length + "</strong> produtos";
    vazio.hidden = lista.length !== 0;
    grade.hidden = lista.length === 0;
    limpar.hidden = termo === "" && cat === "todas";
  }

  busca.addEventListener("input", filtrar);            // a cada letra digitada
  selecao.addEventListener("change", filtrar);          // ao trocar a categoria
  limpar.addEventListener("click", () => { busca.value = ""; selecao.value = "todas"; filtrar(); busca.focus(); });
  $("#formFiltros").addEventListener("submit", (e) => e.preventDefault());
  filtrar();
}

/* ---------- 9. MODAL DE DETALHES ---------- */
let ultimoFoco = null;
function abrirModal(id) {
  const p = produtos.find((x) => x.id === id);
  const modal = $("#modalProduto");
  if (!p || !modal) return;
  $("#modalImagem").src = p.imagem;
  $("#modalImagem").alt = p.nome;
  $("#modalNome").textContent = p.nome;
  $("#modalCategoria").textContent = p.categoria;
  $("#modalDescricao").textContent = p.descricao;
  $("#modalPreco").textContent = formatarPreco(p.preco);
  $("#modalCodigo").textContent = "Código do produto: " + String(p.id).padStart(3, "0");
  $("#modalAdicionar").dataset.id = p.id;
  ultimoFoco = document.activeElement;
  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".btn-fechar", modal).focus();
}
function fecharModal() {
  const modal = $("#modalProduto");
  if (!modal) return;
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (ultimoFoco) ultimoFoco.focus();
}
function iniciarModal() {
  const modal = $("#modalProduto");
  if (!modal) return;
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-fechar]")) fecharModal(); });
  $("#modalAdicionar").addEventListener("click", (e) => { adicionarAoCarrinho(Number(e.currentTarget.dataset.id)); fecharModal(); });
}

/* ---------- 10. CARRINHO (localStorage) ----------
   O carrinho é um objeto { idDoProduto: quantidade }. Fica salvo no navegador,
   então continua lá mesmo se a pessoa trocar de página ou recarregar.       */
let carrinho = {};
function carregarCarrinho() {
  try { carrinho = JSON.parse(localStorage.getItem("vc-carrinho")) || {}; } catch (e) { carrinho = {}; }
  // limpa itens que não existem mais no catálogo
  Object.keys(carrinho).forEach((id) => { if (!produtos.some((p) => p.id === Number(id)) || !(carrinho[id] > 0)) delete carrinho[id]; });
}
function salvarCarrinho() {
  try { localStorage.setItem("vc-carrinho", JSON.stringify(carrinho)); } catch (e) {}
}
function adicionarAoCarrinho(id) {
  const p = produtos.find((x) => x.id === id);
  if (!p) return;
  carrinho[id] = (carrinho[id] || 0) + 1;
  salvarCarrinho();
  atualizarCarrinho();
  mostrarAviso("🎄 " + p.nome + " foi para o carrinho!");
  const c = $(".contagem-carrinho");
  if (c) { c.classList.remove("pulo"); void c.offsetWidth; c.classList.add("pulo"); }
}
function alterarQuantidade(id, delta) {
  carrinho[id] = (carrinho[id] || 0) + delta;
  if (carrinho[id] <= 0) delete carrinho[id];
  salvarCarrinho();
  atualizarCarrinho();
}
function removerDoCarrinho(id) { delete carrinho[id]; salvarCarrinho(); atualizarCarrinho(); }

function totalCarrinho() {
  return Object.entries(carrinho).reduce((soma, [id, q]) => soma + produtos.find((p) => p.id === Number(id)).preco * q, 0);
}
function quantidadeCarrinho() {
  return Object.values(carrinho).reduce((a, b) => a + b, 0);
}

function atualizarCarrinho() {
  $$(".contagem-carrinho").forEach((c) => { c.textContent = quantidadeCarrinho(); });
  const lista = $("#carrinhoLista");
  if (!lista) return;
  const ids = Object.keys(carrinho);
  if (!ids.length) {
    lista.innerHTML = '<div class="carrinho-vazio"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h-2l-1 2H2v2h1.6l2.7 8.6A2 2 0 0 0 8.2 18h8.6a2 2 0 0 0 1.9-1.4L21 8H6.2l-.5-2zM9 20a1.5 1.5 0 1 0 0 .01zM17 20a1.5 1.5 0 1 0 0 .01z"/></svg><p><strong>Seu carrinho está vazio.</strong><br>Que tal um chocolate quente natalino?</p></div>';
  } else {
    lista.innerHTML = ids.map((id) => {
      const p = produtos.find((x) => x.id === Number(id));
      const q = carrinho[id];
      return `<div class="item-carrinho">
        <img src="${p.imagem}" alt="${escapar(p.nome)}" width="64" height="64">
        <div>
          <h3>${escapar(p.nome)}</h3>
          <span class="unitario">${formatarPreco(p.preco)} cada</span>
          <div class="qtd">
            <button type="button" data-qtd="-1" data-id="${p.id}" aria-label="Diminuir quantidade de ${escapar(p.nome)}">−</button>
            <span aria-live="polite">${q}</span>
            <button type="button" data-qtd="1" data-id="${p.id}" aria-label="Aumentar quantidade de ${escapar(p.nome)}">+</button>
          </div>
        </div>
        <div>
          <div class="item-subtotal">${formatarPreco(p.preco * q)}</div>
          <button type="button" class="btn-remover" data-remover="${p.id}">Remover</button>
        </div>
      </div>`;
    }).join("");
  }
  const total = $("#carrinhoTotal");
  if (total) total.textContent = formatarPreco(totalCarrinho());
  const fin = $("#finalizarPedido");
  if (fin) fin.disabled = !ids.length;
}

function abrirCarrinho() {
  $("#carrinhoPainel").classList.add("aberto");
  $("#carrinhoFundo").classList.add("aberto");
  $("#carrinhoPainel").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#fecharCarrinho").focus();
}
function fecharCarrinho() {
  $("#carrinhoPainel").classList.remove("aberto");
  $("#carrinhoFundo").classList.remove("aberto");
  $("#carrinhoPainel").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Monta a mensagem do pedido e abre o WhatsApp
function finalizarPedido() {
  const linhas = Object.keys(carrinho).map((id) => {
    const p = produtos.find((x) => x.id === Number(id));
    return "• " + carrinho[id] + "x " + p.nome + " — " + formatarPreco(p.preco * carrinho[id]);
  });
  const msg = "Olá! Gostaria de fazer um pedido na Vithiana Coffee:\n\n" + linhas.join("\n") + "\n\nTotal: " + formatarPreco(totalCarrinho());
  window.open(linkWhatsApp(msg), "_blank", "noopener");
}

function iniciarCarrinho() {
  if (typeof produtos === "undefined") return;
  carregarCarrinho();
  atualizarCarrinho();
  const painel = $("#carrinhoPainel");
  if (!painel) return;
  $$(".btn-carrinho").forEach((b) => b.addEventListener("click", abrirCarrinho));
  $("#fecharCarrinho").addEventListener("click", fecharCarrinho);
  $("#carrinhoFundo").addEventListener("click", fecharCarrinho);
  $("#finalizarPedido").addEventListener("click", finalizarPedido);
  $("#limparCarrinho").addEventListener("click", () => { carrinho = {}; salvarCarrinho(); atualizarCarrinho(); });
  painel.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qtd]");
    const r = e.target.closest("[data-remover]");
    if (q) alterarQuantidade(Number(q.dataset.id), Number(q.dataset.qtd));
    if (r) removerDoCarrinho(Number(r.dataset.remover));
  });
  // se outra aba mudar o carrinho, esta aba acompanha
  window.addEventListener("storage", (e) => { if (e.key === "vc-carrinho") { carregarCarrinho(); atualizarCarrinho(); } });
}

/* ---------- 11. CONTAGEM REGRESSIVA DO NATAL ---------- */
function iniciarContagem() {
  const caixa = $("#contagem");
  if (!caixa) return;
  const campos = { dias: $("#cdDias"), horas: $("#cdHoras"), min: $("#cdMin"), seg: $("#cdSeg") };
  const msg = $("#contagemMsg");
  const dois = (n) => String(n).padStart(2, "0");

  function alvoNatal() {
    const agora = new Date();
    let alvo = new Date(agora.getFullYear(), 11, 25, 0, 0, 0);   // 25 de dezembro (mês 11 = dezembro)
    if (agora >= new Date(agora.getFullYear(), 11, 26)) alvo = new Date(agora.getFullYear() + 1, 11, 25);
    return alvo;
  }

  function atualizar() {
    const agora = new Date();
    const alvo = alvoNatal();
    if (agora.getMonth() === 11 && agora.getDate() === 25) {       // é Natal!
      caixa.hidden = true; msg.hidden = false; msg.textContent = "🎄 Feliz Natal! 🎅";
      return;
    }
    caixa.hidden = false; msg.hidden = true;
    const ms = alvo - agora;
    const total = Math.floor(ms / 1000);
    const valores = { dias: Math.floor(total / 86400), horas: Math.floor((total % 86400) / 3600), min: Math.floor((total % 3600) / 60), seg: total % 60 };
    for (const k in campos) {
      const texto = k === "dias" ? String(valores[k]) : dois(valores[k]);
      if (campos[k].textContent !== texto) {
        campos[k].textContent = texto;
        const pai = campos[k].parentElement;
        pai.classList.remove("troca"); void pai.offsetWidth; pai.classList.add("troca");
      }
    }
  }
  atualizar();
  setInterval(atualizar, 1000);          // roda a cada 1 segundo
}

/* ---------- 12. GALERIA E LIGHTBOX ---------- */
function iniciarGaleria() {
  const grade = $("#galeriaGrade");
  if (!grade) return;
  const itens = $$(".galeria-item", grade);
  const lb = $("#lightbox");
  const img = $("#lbImagem");
  const legenda = $("#lbLegenda");
  let visiveis = itens, atual = 0;

  // filtros por tema
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    const tema = chip.dataset.tema;
    itens.forEach((i) => { i.hidden = !(tema === "todas" || i.dataset.tema === tema); });
    visiveis = itens.filter((i) => !i.hidden);
  }));

  function mostrar(n) {
    atual = (n + visiveis.length) % visiveis.length;
    const item = visiveis[atual];
    const foto = $("img", item);
    img.src = foto.src;
    img.alt = foto.alt;
    legenda.innerHTML = escapar($(".legenda", item).textContent) + "<small>" + (atual + 1) + " de " + visiveis.length + "</small>";
  }
  function abrir(item) {
    visiveis = itens.filter((i) => !i.hidden);
    mostrar(visiveis.indexOf(item));
    lb.classList.add("aberto"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".btn-fechar", lb).focus();
  }
  function fechar() { lb.classList.remove("aberto"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

  itens.forEach((item) => item.addEventListener("click", () => abrir(item)));
  $(".btn-fechar", lb).addEventListener("click", fechar);
  $(".anterior", lb).addEventListener("click", () => mostrar(atual - 1));
  $(".proximo", lb).addEventListener("click", () => mostrar(atual + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
}

/* ---------- 13. FORMULÁRIO DE CONTATO ---------- */
function iniciarContato() {
  const form = $("#formContato");
  if (!form) return;
  const retorno = $("#retornoForm");
  const campoMsg = $("#mensagem");
  const contagem = $("#contadorMsg");

  // cada regra devolve um texto de erro ou "" quando está certo
  const regras = {
    nome: (v) => (v.trim().length < 3 ? "Digite seu nome (mínimo 3 letras)." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido, como nome@email.com."),
    assunto: (v) => (v.trim().length < 3 ? "Informe o assunto (mínimo 3 letras)." : ""),
    mensagem: (v) => (v.trim().length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : "")
  };

  function validarCampo(nome) {
    const input = form.elements[nome];
    const caixa = input.closest(".campo");
    const erro = regras[nome](input.value);
    caixa.classList.toggle("invalido", erro !== "");
    caixa.classList.toggle("valido", erro === "");
    $(".erro-campo", caixa).textContent = erro;
    input.setAttribute("aria-invalid", String(erro !== ""));
    return erro === "";
  }

  Object.keys(regras).forEach((nome) => {
    form.elements[nome].addEventListener("blur", () => validarCampo(nome));
    form.elements[nome].addEventListener("input", () => { if (form.elements[nome].closest(".campo").classList.contains("invalido")) validarCampo(nome); });
  });
  campoMsg.addEventListener("input", () => { contagem.textContent = campoMsg.value.length + " / 500"; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();                                   // não deixa a página recarregar
    const todosOk = Object.keys(regras).map(validarCampo).every(Boolean);   // valida TODOS os campos
    if (!todosOk) {
      retorno.className = "retorno-form erro";
      retorno.textContent = "⚠️ Corrija os campos destacados e tente novamente.";
      const primeiro = $(".invalido input, .invalido textarea", form);
      if (primeiro) primeiro.focus();
      return;
    }
    const msg = "Olá, Vithiana Coffee! 🎄\n\n" +
      "Nome: " + form.elements.nome.value.trim() + "\n" +
      "E-mail: " + form.elements.email.value.trim() + "\n" +
      "Assunto: " + form.elements.assunto.value.trim() + "\n\n" +
      form.elements.mensagem.value.trim();
    retorno.className = "retorno-form sucesso";
    retorno.textContent = "✅ Tudo certo, " + form.elements.nome.value.trim().split(" ")[0] + "! Abrindo o WhatsApp com a sua mensagem…";
    window.open(linkWhatsApp(msg), "_blank", "noopener");
    form.reset();
    contagem.textContent = "0 / 500";
    $$(".campo", form).forEach((c) => c.classList.remove("valido", "invalido"));
  });
}

/* ---------- 14. ANIMAÇÃO AO ROLAR + VOLTAR AO TOPO ---------- */
function iniciarRevelar() {
  const itens = $$(".revelar");
  if (!itens.length) return;
  if (!("IntersectionObserver" in window)) { itens.forEach((i) => i.classList.add("visivel")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visivel"); obs.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  itens.forEach((i) => obs.observe(i));
}

function iniciarVoltarTopo() {
  const botao = $("#voltarTopo");
  if (!botao) return;
  window.addEventListener("scroll", () => botao.classList.toggle("visivel", window.scrollY > 500), { passive: true });
  botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Se uma imagem não carregar, troca por um quadrado neutro (nunca fica "ícone quebrado") */
function protegerImagens() {
  const vazio = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#EFE4CB"/><text x="300" y="330" font-size="120" text-anchor="middle">☕</text></svg>');
  document.addEventListener("error", (e) => {
    if (e.target.tagName === "IMG" && e.target.src !== vazio) { e.target.src = vazio; }
  }, true);
}

/* ---------- 15. INICIALIZAÇÃO ----------
   Quando o HTML termina de carregar, ligamos cada funcionalidade.
   try/catch em cada uma: se uma falhar, as outras continuam funcionando.   */
document.documentElement.classList.add("js");
document.addEventListener("DOMContentLoaded", () => {
  protegerImagens();
  [iniciarMenu, iniciarMusica, iniciarSomCliques, iniciarNeve, iniciarParallax, iniciarCarrossel,
   iniciarAcoesDosCards, iniciarDestaques, iniciarProdutos, iniciarModal, iniciarCarrinho,
   iniciarContagem, iniciarGaleria, iniciarContato, iniciarRevelar, iniciarVoltarTopo
  ].forEach((funcao) => {
    try { funcao(); } catch (erro) { console.error("Erro em " + funcao.name + ":", erro); }
  });
  // Esc fecha modal e carrinho
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { fecharModal(); if ($("#carrinhoPainel")) fecharCarrinho(); }
  });
});
