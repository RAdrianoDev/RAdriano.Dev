// imagens e sons do jogo

let imagemDaEstrada;
let imagemDoAtor;
let imagemCarro;
let imagemCarro2;
let imagemCarro3;

//sons do jogo

let somDaTrilha;
let somDaColisao;
let somDoPonto;

function preload(){
  imagemDaEstrada = loadImage("pictures/estrada.png");
  imagemDoAtor = loadImage("pictures/ator-1.png");
  imagemCarro = loadImage("pictures/carro-1.png");
  imagemCarro2 = loadImage("pictures/carro-2.png");
  imagemCarro3 = loadImage("pictures/carro-3.png");  
  imagemCarros = [imagemCarro, imagemCarro2, imagemCarro3, imagemCarro, imagemCarro2, imagemCarro3]
  
  somDaTrilha = loadSound("sounds/trilha.mp3");
  somDaColisao = loadSound("sounds/colidiu.mp3");
  somDoPonto = loadSound("sounds/pontos.wav");
}