/* =====================================================================
   VITHIANA COFFEE — CATÁLOGO DE PRODUTOS (js/produtos.js)
   ---------------------------------------------------------------------
   Este arquivo guarda os 50 produtos da cafeteria em um ARRAY de OBJETOS.
   Cada objeto tem os campos:
     id         número único (1 a 50) — usado para achar o produto no carrinho
     nome       texto
     categoria  texto (sempre com a mesma grafia: Cafés, Bebidas, Doces,
                Natalinos ou Salgados) — o filtro da página usa estes valores
     preco      NÚMERO com ponto decimal (ex.: 18.90), nunca texto, para poder somar
     imagem     caminho relativo da imagem local (img/produtos/nome-do-arquivo.jpg)
     descricao  frase curta que aparece no card
     destaque   true = aparece em "Nossos destaques" na página inicial

   IMPORTANTE: este arquivo precisa ser carregado ANTES de js/script.js,
   porque o script principal usa a variável "produtos".
   ===================================================================== */

const produtos = [
  {
    id: 1,
    nome: "Chocolate Quente Natalino",
    categoria: "Bebidas",
    preco: 18.90,
    imagem: "img/produtos/chocolate-quente-natalino.jpg",
    descricao: "Chocolate cremoso com chantilly.",
    destaque: true
  },
  {
    id: 2,
    nome: "Cappuccino Especial",
    categoria: "Cafés",
    preco: 16.90,
    imagem: "img/produtos/cappuccino-especial.jpg",
    descricao: "Café cremoso com toque de canela.",
    destaque: true
  },
  {
    id: 3,
    nome: "Latte de Baunilha",
    categoria: "Cafés",
    preco: 17.90,
    imagem: "img/produtos/latte-de-baunilha.jpg",
    descricao: "Leite vaporizado e baunilha.",
    destaque: false
  },
  {
    id: 4,
    nome: "Mocha de Natal",
    categoria: "Cafés",
    preco: 19.90,
    imagem: "img/produtos/mocha-de-natal.jpg",
    descricao: "Café com chocolate e leite cremoso.",
    destaque: true
  },
  {
    id: 5,
    nome: "Chocolate Branco",
    categoria: "Bebidas",
    preco: 18.50,
    imagem: "img/produtos/chocolate-branco.jpg",
    descricao: "Chocolate branco quente e cremoso.",
    destaque: false
  },
  {
    id: 6,
    nome: "Café Expresso",
    categoria: "Cafés",
    preco: 8.90,
    imagem: "img/produtos/cafe-expresso.jpg",
    descricao: "Café intenso e encorpado.",
    destaque: false
  },
  {
    id: 7,
    nome: "Café com Canela",
    categoria: "Cafés",
    preco: 12.90,
    imagem: "img/produtos/cafe-com-canela.jpg",
    descricao: "Café especial com aroma de canela.",
    destaque: false
  },
  {
    id: 8,
    nome: "Frappuccino Natalino",
    categoria: "Cafés",
    preco: 21.90,
    imagem: "img/produtos/frappuccino-natalino.jpg",
    descricao: "Bebida gelada com chocolate.",
    destaque: true
  },
  {
    id: 9,
    nome: "Milkshake de Morango",
    categoria: "Bebidas",
    preco: 19.90,
    imagem: "img/produtos/milkshake-de-morango.jpg",
    descricao: "Milkshake com morangos e chantilly.",
    destaque: false
  },
  {
    id: 10,
    nome: "Chá de Maçã e Canela",
    categoria: "Bebidas",
    preco: 12.00,
    imagem: "img/produtos/cha-de-maca-e-canela.jpg",
    descricao: "Chá quentinho com especiarias.",
    destaque: false
  },
  {
    id: 11,
    nome: "Panetone Trufado",
    categoria: "Natalinos",
    preco: 35.90,
    imagem: "img/produtos/panetone-trufado.jpg",
    descricao: "Panetone recheado com chocolate.",
    destaque: true
  },
  {
    id: 12,
    nome: "Chocotone",
    categoria: "Natalinos",
    preco: 32.90,
    imagem: "img/produtos/chocotone.jpg",
    descricao: "Massa macia com gotas de chocolate.",
    destaque: true
  },
  {
    id: 13,
    nome: "Biscoito de Gengibre",
    categoria: "Natalinos",
    preco: 9.90,
    imagem: "img/produtos/biscoito-de-gengibre.jpg",
    descricao: "Biscoito artesanal decorado.",
    destaque: true
  },
  {
    id: 14,
    nome: "Cookie Natalino",
    categoria: "Doces",
    preco: 9.90,
    imagem: "img/produtos/cookie-natalino.jpg",
    descricao: "Cookie com gotas de chocolate.",
    destaque: false
  },
  {
    id: 15,
    nome: "Brownie Especial",
    categoria: "Doces",
    preco: 12.90,
    imagem: "img/produtos/brownie-especial.jpg",
    descricao: "Brownie macio com chocolate.",
    destaque: true
  },
  {
    id: 16,
    nome: "Cupcake de Natal",
    categoria: "Natalinos",
    preco: 13.90,
    imagem: "img/produtos/cupcake-de-natal.jpg",
    descricao: "Cupcake com cobertura decorada.",
    destaque: false
  },
  {
    id: 17,
    nome: "Bolo Red Velvet",
    categoria: "Doces",
    preco: 16.90,
    imagem: "img/produtos/bolo-red-velvet.jpg",
    descricao: "Bolo vermelho com creme especial.",
    destaque: false
  },
  {
    id: 18,
    nome: "Torta de Limão",
    categoria: "Doces",
    preco: 14.90,
    imagem: "img/produtos/torta-de-limao.jpg",
    descricao: "Torta com creme de limão.",
    destaque: false
  },
  {
    id: 19,
    nome: "Cheesecake de Frutas",
    categoria: "Doces",
    preco: 18.90,
    imagem: "img/produtos/cheesecake-de-frutas.jpg",
    descricao: "Cheesecake com frutas vermelhas.",
    destaque: true
  },
  {
    id: 20,
    nome: "Donut de Chocolate",
    categoria: "Doces",
    preco: 11.90,
    imagem: "img/produtos/donut-de-chocolate.jpg",
    descricao: "Donut coberto com chocolate.",
    destaque: false
  },
  {
    id: 21,
    nome: "Waffle Especial",
    categoria: "Doces",
    preco: 19.90,
    imagem: "img/produtos/waffle-especial.jpg",
    descricao: "Waffle com calda e frutas.",
    destaque: false
  },
  {
    id: 22,
    nome: "Panqueca Doce",
    categoria: "Doces",
    preco: 17.90,
    imagem: "img/produtos/panqueca-doce.jpg",
    descricao: "Panqueca com chocolate.",
    destaque: false
  },
  {
    id: 23,
    nome: "Rabanada Natalina",
    categoria: "Natalinos",
    preco: 12.90,
    imagem: "img/produtos/rabanada-natalina.jpg",
    descricao: "Rabanada com açúcar e canela.",
    destaque: true
  },
  {
    id: 24,
    nome: "Pudim de Leite",
    categoria: "Doces",
    preco: 10.90,
    imagem: "img/produtos/pudim-de-leite.jpg",
    descricao: "Pudim tradicional e cremoso.",
    destaque: false
  },
  {
    id: 25,
    nome: "Brigadeiro Gourmet",
    categoria: "Doces",
    preco: 5.90,
    imagem: "img/produtos/brigadeiro-gourmet.jpg",
    descricao: "Brigadeiro artesanal de chocolate.",
    destaque: false
  },
  {
    id: 26,
    nome: "Trufa de Avelã",
    categoria: "Doces",
    preco: 7.90,
    imagem: "img/produtos/trufa-de-avela.jpg",
    descricao: "Trufa recheada com creme de avelã.",
    destaque: false
  },
  {
    id: 27,
    nome: "Macaron Natalino",
    categoria: "Natalinos",
    preco: 8.90,
    imagem: "img/produtos/macaron-natalino.jpg",
    descricao: "Macaron delicado e colorido.",
    destaque: false
  },
  {
    id: 28,
    nome: "Brownie com Nozes",
    categoria: "Doces",
    preco: 14.90,
    imagem: "img/produtos/brownie-com-nozes.jpg",
    descricao: "Brownie com pedaços de nozes.",
    destaque: false
  },
  {
    id: 29,
    nome: "Torta de Chocolate",
    categoria: "Doces",
    preco: 16.90,
    imagem: "img/produtos/torta-de-chocolate.jpg",
    descricao: "Torta com recheio de chocolate.",
    destaque: true
  },
  {
    id: 30,
    nome: "Muffin de Mirtilo",
    categoria: "Doces",
    preco: 11.90,
    imagem: "img/produtos/muffin-de-mirtilo.jpg",
    descricao: "Muffin fofinho com mirtilos.",
    destaque: false
  },
  {
    id: 31,
    nome: "Sanduíche Natural",
    categoria: "Salgados",
    preco: 16.90,
    imagem: "img/produtos/sanduiche-natural.jpg",
    descricao: "Sanduíche leve e saboroso.",
    destaque: false
  },
  {
    id: 32,
    nome: "Croissant de Queijo",
    categoria: "Salgados",
    preco: 13.90,
    imagem: "img/produtos/croissant-de-queijo.jpg",
    descricao: "Massa folhada com queijo.",
    destaque: false
  },
  {
    id: 33,
    nome: "Pão de Queijo",
    categoria: "Salgados",
    preco: 7.90,
    imagem: "img/produtos/pao-de-queijo.jpg",
    descricao: "Pão de queijo quentinho.",
    destaque: false
  },
  {
    id: 34,
    nome: "Quiche de Alho-Poró",
    categoria: "Salgados",
    preco: 15.90,
    imagem: "img/produtos/quiche-de-alho-poro.jpg",
    descricao: "Quiche cremosa e artesanal.",
    destaque: false
  },
  {
    id: 35,
    nome: "Empada de Frango",
    categoria: "Salgados",
    preco: 9.90,
    imagem: "img/produtos/empada-de-frango.jpg",
    descricao: "Empada com recheio de frango.",
    destaque: false
  },
  {
    id: 36,
    nome: "Mini Pizza",
    categoria: "Salgados",
    preco: 12.90,
    imagem: "img/produtos/mini-pizza.jpg",
    descricao: "Mini pizza com queijo e tomate.",
    destaque: false
  },
  {
    id: 37,
    nome: "Tostex Especial",
    categoria: "Salgados",
    preco: 14.90,
    imagem: "img/produtos/tostex-especial.jpg",
    descricao: "Pão tostado com queijo.",
    destaque: false
  },
  {
    id: 38,
    nome: "Esfiha de Queijo",
    categoria: "Salgados",
    preco: 8.90,
    imagem: "img/produtos/esfiha-de-queijo.jpg",
    descricao: "Esfiha assada com queijo.",
    destaque: false
  },
  {
    id: 39,
    nome: "Folhado de Palmito",
    categoria: "Salgados",
    preco: 13.90,
    imagem: "img/produtos/folhado-de-palmito.jpg",
    descricao: "Massa folhada com palmito.",
    destaque: false
  },
  {
    id: 40,
    nome: "Bruschetta Especial",
    categoria: "Salgados",
    preco: 15.90,
    imagem: "img/produtos/bruschetta-especial.jpg",
    descricao: "Pão italiano com tomate e ervas.",
    destaque: false
  },
  {
    id: 41,
    nome: "Bolo de Cenoura",
    categoria: "Doces",
    preco: 12.90,
    imagem: "img/produtos/bolo-de-cenoura.jpg",
    descricao: "Bolo fofinho com cobertura.",
    destaque: false
  },
  {
    id: 42,
    nome: "Cookie Red Velvet",
    categoria: "Doces",
    preco: 10.90,
    imagem: "img/produtos/cookie-red-velvet.jpg",
    descricao: "Cookie macio com chocolate branco.",
    destaque: false
  },
  {
    id: 43,
    nome: "Torta de Morango",
    categoria: "Doces",
    preco: 17.90,
    imagem: "img/produtos/torta-de-morango.jpg",
    descricao: "Torta com creme e morangos.",
    destaque: false
  },
  {
    id: 44,
    nome: "Sorvete de Baunilha",
    categoria: "Doces",
    preco: 12.90,
    imagem: "img/produtos/sorvete-de-baunilha.jpg",
    descricao: "Sorvete cremoso de baunilha.",
    destaque: false
  },
  {
    id: 45,
    nome: "Açaí Especial",
    categoria: "Doces",
    preco: 19.90,
    imagem: "img/produtos/acai-especial.jpg",
    descricao: "Açaí com frutas e acompanhamentos.",
    destaque: false
  },
  {
    id: 46,
    nome: "Chocolate com Marshmallow",
    categoria: "Bebidas",
    preco: 20.90,
    imagem: "img/produtos/chocolate-com-marshmallow.jpg",
    descricao: "Chocolate quente com marshmallows.",
    destaque: true
  },
  {
    id: 47,
    nome: "Biscoito Decorado",
    categoria: "Natalinos",
    preco: 8.90,
    imagem: "img/produtos/biscoito-decorado.jpg",
    descricao: "Biscoito artesanal com glacê.",
    destaque: false
  },
  {
    id: 48,
    nome: "Bolo de Frutas Natalino",
    categoria: "Natalinos",
    preco: 22.90,
    imagem: "img/produtos/bolo-de-frutas-natalino.jpg",
    descricao: "Bolo com frutas e especiarias.",
    destaque: true
  },
  {
    id: 49,
    nome: "Caixa de Doces Natalinos",
    categoria: "Natalinos",
    preco: 39.90,
    imagem: "img/produtos/caixa-de-doces-natalinos.jpg",
    descricao: "Seleção de doces para presentear.",
    destaque: true
  },
  {
    id: 50,
    nome: "Kit Café Presenteável",
    categoria: "Natalinos",
    preco: 49.90,
    imagem: "img/produtos/kit-cafe-presenteavel.jpg",
    descricao: "Kit especial para presentear.",
    destaque: true
  }
];

/* Verificação rápida no Console (F12): confirma 50 produtos, ids únicos e preços numéricos. */
(function validarCatalogo() {
  const ids = new Set(produtos.map(function (p) { return p.id; }));
  const precosOk = produtos.every(function (p) { return typeof p.preco === "number" && !isNaN(p.preco); });
  if (produtos.length !== 50 || ids.size !== produtos.length || !precosOk) {
    console.warn("Catálogo com problema: confira quantidade, ids repetidos e preços.");
  }
})();
