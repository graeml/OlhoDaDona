/* ==========================================================
   Olho da Dona
   service-worker.js

   Responsável pela instalação do PWA
   ========================================================== */


const CACHE_NAME =
"olho-da-dona-v3";



const ARQUIVOS_BASE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/app.css",

    "./js/app.js",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

"./service-worker.js"

];



/*
==============================================================
Instalação
==============================================================
*/

self.addEventListener(
"install",
function(event){


    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(function(cache){

            return cache.addAll(
                ARQUIVOS_BASE
            );

        })

    );


});



/*
==============================================================
Ativação
==============================================================
*/

self.addEventListener(
"activate",
function(event){


    event.waitUntil(

        caches.keys()
        .then(function(chaves){


            return Promise.all(

                chaves.map(function(chave){


                    if(
                        chave !== CACHE_NAME
                    ){

                        return caches.delete(chave);

                    }


                })

            );


        })

    );


});



/*
==============================================================
Busca de arquivos

Mantemos simples por enquanto.

==============================================================
*/

self.addEventListener(
"fetch",
function(event){


    event.respondWith(

        caches.match(
            event.request
        )
        .then(function(resposta){


            return resposta ||
                   fetch(event.request);


        })

    );


});
