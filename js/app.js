/* ==========================================================
   Olho da Dona
   app.js

   Responsável por:
   - registrar Service Worker
   - guardar token do cliente
   - carregar Portal dentro do aplicativo
   ========================================================== */



/*
==============================================================
URL da implantação do Apps Script
==============================================================
Substitua pela URL real do seu Web App.
Não coloque ?t= no final.
*/

const URL_PORTAL =
"https://script.google.com/macros/s/AKfycbyMMh5ZrxQoWjLnIDp1qKQOo-3T0UkcGQf9lQ0py7rY7LxuwsEH4LAWvVcJfXvC8zXYCw/exec";



/*
==============================================================
Elementos da interface
==============================================================
*/

const splash =
document.getElementById("splash");


const portal =
document.getElementById("portal");



/*
==============================================================
Captura token recebido pelo link
==============================================================

Exemplo:

...?t=ABC123

==============================================================
*/

const parametros =
new URLSearchParams(
    window.location.search
);


const tokenRecebido =
parametros.get("t");



if(tokenRecebido){

    localStorage.setItem(
        "tokenCliente",
        tokenRecebido
    );

}



/*
==============================================================
Recupera token salvo
==============================================================
*/

const token =
localStorage.getItem(
    "tokenCliente"
);



/*
==============================================================
Registra Service Worker
==============================================================
*/

if(
    "serviceWorker" in navigator
){

    navigator.serviceWorker.register(
        "service-worker.js"
    );

}



/*
==============================================================
Carrega o portal
==============================================================
*/

function abrirPortal(){


    if(!token){

        splash.innerHTML =
        `
        <h1>
        Olho da Dona
        </h1>

        <p>
        Este aplicativo ainda não está vinculado
        a um imóvel.
        </p>
        `;

        return;

    }



    portal.src =
        URL_PORTAL +
        "?t=" +
        token;



    portal.onload =
    function(){


        splash.style.opacity="0";


        setTimeout(function(){


            splash.style.display="none";


            portal.style.display="block";


        },500);


    };


}



/*
==============================================================
Inicialização
==============================================================
*/

setTimeout(
    abrirPortal,
    1200
);

/* ==========================================================
   Instalação do aplicativo
   ========================================================== */


let eventoInstalacao;


window.addEventListener(
"beforeinstallprompt",
function(event){


    event.preventDefault();


    eventoInstalacao = event;


    const botao =
    document.getElementById(
        "instalar"
    );


    botao.style.display =
    "block";


    botao.onclick =
    function(){


        eventoInstalacao.prompt();


        eventoInstalacao
        .userChoice
        .then(function(){


            eventoInstalacao = null;


            botao.style.display =
            "none";


        });


    };


});