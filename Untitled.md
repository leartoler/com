@import url('https://fonts.googleapis.com/css?family=Indie+Flower');

@import url('https://fonts.googleapis.com/css?family=Amatic+SC');

  

*, *::before, *::after {

    box-sizing: border-box;

}

  

html, body {

    width: 100%;

    overflow-x: hidden; /* evita el scroll horizontal si algo se pasa del borde */

}

  

body {

    font-family: 'Indie Flower', cursive !important;

    background-image: url(https://trenmaya.neocities.org/Diario_de_Viaje/Prueba/madera.jpeg); /*CAPE HONEY*/

    margin: 0px;

    padding: 0px;

    position: relative;

    min-height: 100vh; /* para que los top:% de los elementos absolutos tengan una base real */

}

  

::selection {

    background: transparent;

}

  

h4 {

    font-size: clamp(18px, 4vw, 26px);

    line-height: 1px;

    font-family: 'Amatic SC', cursive !important;

}

  

.card {

    color: #013243; /*SHERPA BLUE*/

    position: absolute;

    width: clamp(280px, 65vw, 500px);

    height: clamp(360px, 90vw, 700px);

    top: 60%;

    left: 50%;

    background: #e0e1dc;

    transform-style: preserve-3d;

    transform: translate(-50%,-50%) perspective(2000px);

    box-shadow: inset 700px 0 50px rgba(0,0,0,.5), 20px 0 60px rgba(0,0,0,.5);

    transition: 1s;

}

  

.card .imgBox img {

    width: 100%;

    height: 100%;

    object-fit: cover;

    display: block;

}

  

.card:hover {

    transform: translate(-50%,-50%) perspective(2000px) rotate(15deg) scale(1.15);

    box-shadow: inset 20px 0 50px rgba(0,0,0,.5), 0 10px 100px rgba(0,0,0,.5);

}

  

.card:before {

    content:'';

    position: absolute;

    top: -5px;

    left: 0;

    width: 100%;

    height: 5px;

    background: #BAC1BA;

    transform-origin: bottom;

    transform: skewX(-45deg);

}

  

.card:after {

    content: '';

    position: absolute;

    top: 0;

    right: -5px;

    width: 5px;

    height: 100%;

    background: #92A29C;

    transform-origin: left;

    transform: skewY(-45deg);

    z-index:1;

}

  

.card .imgBox {

    width: 100%;

    height: 100%;

    position: relative;

    transform-origin: left;

    transition: .7s;

    overflow: hidden;

}

  

.card .bark {

    position: absolute;

    background: #e0e1dc;

    width: 100%;

    height: 100%;

    opacity: 0;

    transition: .7s;

}

  

.card:hover .imgBox {

    transform: rotateY(-135deg);

}

  

.card:hover .bark {

    opacity: 1;

    transition: .6s;

    box-shadow: 300px 200px 100px rgba(0, 0, 0, .4) inset;

}

  

.card .details {

    position: absolute;

    top: 0;

    left: 0;

    width: 100%;

    box-sizing: border-box;

    padding: 0 0 0 10px;

    z-index: -1;

    margin-top: 70px;

}

  

.card .details p {

    font-size: clamp(18px, 5vw, 32px);

    line-height: 1.2;

    transform: rotate(-10deg);

    padding: 0 0 0 20px;

}

  

.card .details h4 {

    text-align: center;

}

  

.text-right {

    text-align: right;

}

  

.regla {

    position: absolute;

    left: 25%;

    top: 1%;

    width: clamp(220px, 60vw, 700px);

    height: clamp(60px, 10vw, 100px);

    background-image: url("https://trenmaya.neocities.org/Diario_de_Viaje/Prueba/regla.png");

    background-size: contain;

    background-repeat: no-repeat;

    background-position: center;

    z-index: 5;

    transition: transform .3s;

}

  

.regla:hover {

    transform: scale(1.05);

}

  

.nota {

    position: absolute;

    left: 60%;

    top: 75%;

    width: clamp(180px, 40vw, 350px);

    height: clamp(150px, 35vw, 300px);

    background-image: url("https://trenmaya.neocities.org/Diario_de_Viaje/Prueba/nota.png");

    background-size: contain;

    background-repeat: no-repeat;

    background-position: center;

    z-index: 6;

    transition: transform .3s;

}

  

.nota:hover {

    transform: scale(1.05);

}

  

.papel {

    position: absolute;

    left: 5%;

    top: 70%;

    width: clamp(260px, 60vw, 550px);

    height: clamp(240px, 55vw, 500px);

    background-image: url("https://trenmaya.neocities.org/Diario_de_Viaje/Prueba/papel.png");

    background-size: contain;

    background-repeat: no-repeat;

    background-position: center;

    transform: rotate(-25deg);

    z-index: 7;

    transition: transform .3s;

}

  

.papel:hover {

    transform: rotate(-25deg) scale(1.05);

}

  

.gatogordo {

    position: absolute;

    left: 35%;

    top: 120%;

    width: clamp(180px, 40vw, 350px);

    height: clamp(150px, 35vw, 300px);

    background-image: url("https://trenmaya.neocities.org/Diario_de_Viaje/Prueba/gatogordo.png");

    background-size: contain;

    background-repeat: no-repeat;

    background-position: center;

    z-index: 8;

    transition: transform .3s;

}

  

.gatogordo:hover {

    transform: scale(1.05);

}