/* ==========================================================
   Olho da Dona
   app.js
   ========================================================== */

const URL_PORTAL =
"https://script.google.com/macros/s/AKfycbyMMh5ZrxQoWjLnIDp1qKQOo-3T0UkcGQf9lQ0py7rY7LxuwsEH4LAWvVcJfXvC8zXYCw/exec";

/* ==========================================================
   Elementos
   ========================================================== */

const splash = document.getElementById("splash");
const portal = document.getElementById("portal");
const boasVindas = document.getElementById("boasVindas");
const textoBoasVindas = document.getElementById("textoBoasVindas");
const continuar = document.getElementById("continuar");
const botaoInstalar = document.getElementById("instalar");

/* ==========================================================
   Captura token recebido
   ========================================================== */

const parametros = new URLSearchParams(window.location.search);

const tokenRecebido = parametros.get("t");

if (tokenRecebido) {
    localStorage.setItem("tokenCliente", tokenRecebido);
}

const token = localStorage.getItem("tokenCliente");

/* ==========================================================
   Detecta navegador
   ========================================================== */

const ua = navigator.userAgent;

let navegador = "Outro";

if (/Edg/i.test(ua))
    navegador = "Edge";
else if (/Chrome/i.test(ua))
    navegador = "Chrome";
else if (/Firefox/i.test(ua))
    navegador = "Firefox";
else if (/Safari/i.test(ua))
    navegador = "Safari";

/* ==========================================================
   Service Worker
   ========================================================== */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")
        .catch(console.error);

}

/* ==========================================================
   Instalação
   ========================================================== */

let eventoInstalacao = null;

window.addEventListener("beforeinstallprompt", function(e){

    e.preventDefault();

    eventoInstalacao = e;

    botaoInstalar.style.display = "block";

});

botaoInstalar.onclick = async function(){

    if(!eventoInstalacao)
        return;

    eventoInstalacao.prompt();

    await eventoInstalacao.userChoice;

    botaoInstalar.style.display="none";

    eventoInstalacao = null;

};

/* ==========================================================
   Boas-vindas
   ========================================================== */

function mostrarBoasVindas(){

    let texto = "";

    switch(navegador){

        case "Chrome":
        case "Edge":

            texto =
            `
            Este aplicativo pode ser instalado na tela inicial.

            Procure pelo botão <b>Instalar aplicativo</b> na barra
            de endereços do navegador ou utilize o botão abaixo,
            quando disponível.
            `;

            break;

        case "Safari":

            texto =
            `
            Para instalar:

            Compartilhar →
            Adicionar à Tela de Início.
            `;

            break;

        case "Firefox":

            texto =
            `
            O Firefox possui suporte limitado para instalação.

            Recomendamos utilizar o Google Chrome para instalar
            o aplicativo.
            `;

            break;

        default:

            texto =
            `
            Você pode instalar este aplicativo na tela inicial
            do seu dispositivo.
            `;

    }

    textoBoasVindas.innerHTML = texto;

    boasVindas.style.display="flex";

}

continuar.onclick = function(){

    localStorage.setItem(
        "tutorialVisto",
        "SIM"
    );

    boasVindas.style.display="none";

    abrirPortal();

};

/* ==========================================================
   Portal
   ========================================================== */

function abrirPortal(){

    if(!token){

        splash.innerHTML=
        `
        <h2>Olho da Dona</h2>

        <p>
        Este aplicativo ainda não foi vinculado
        a um cliente.
        </p>
        `;

        return;

    }

    portal.src =
        URL_PORTAL + "?t=" + token;

    portal.onload = function(){

        splash.style.opacity="0";

        setTimeout(function(){

            splash.style.display="none";

            portal.style.display="block";

        },400);

    };

}

/* ==========================================================
   Inicialização
   ========================================================== */

setTimeout(function(){

    if(
        localStorage.getItem("tutorialVisto")
        !== "SIM"
    ){

        splash.style.display="none";

        mostrarBoasVindas();

        return;

    }

    abrirPortal();

},1200);
