function setup() {
  const canvas =createCanvas(500, 400);
  canvas.parent("crossFreeway");
  somDaTrilha.loop();
}



function draw() {
  background(imagemDaEstrada);
  mostraAtor();
  mostraCarro();
  movimentaCarro();
  movimentaAtor();
  voltaPosicaoInicialDoCarro();
  verificaColisao();
  incluiPontos();
  marcaPonto();
}









