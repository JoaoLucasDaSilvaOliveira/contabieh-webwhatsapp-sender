// public/loader.js

function injectScript(file_path) {
    var script = document.createElement('script');
    // Usa getURL para pegar o caminho real dentro da extensão
    script.src = chrome.runtime.getURL(file_path);
    script.onload = function() {
        this.remove(); // Remove a tag script após executar (limpeza)
    };
    (document.head || document.documentElement).appendChild(script);
}

// Função para ler o arquivo e injetar como texto (Bypass CSP mais agressivo)
// Necessário se o WhatsApp bloquear script.src = chrome-extension://...
async function injectCode(filePath) {
    const src = chrome.runtime.getURL(filePath);
    const content = await (await fetch(src)).text();
    const script = document.createElement('script');
    script.textContent = content;
    (document.head || document.documentElement).appendChild(script);
}

// Sequência de Injeção
(async () => {
    console.log("Iniciando injeção Contabiehl...");
    
    // 1. Injeta WPPConnect
    try {
        await injectCode('wppconnect.js'); 
        console.log("WPPConnect injetado.");
    } catch (e) {
        console.error("Erro ao injetar WPP:", e);
    }

    // 2. Injeta o Bundle do Vue (gerado pelo build)
    // O nome do arquivo depende do build. Verifique a pasta dist/assets após o build.
    // Geralmente é index.js se configurado corretamente, ou o nome que definimos no vite.config.ts
    // Como configuramos 'assets/[name].js', e a entrada é main.ts, provavelmente será 'assets/index.js'
    try {
       await injectCode('assets/index.js');
       console.log("Vue App injetado.");
    } catch (e) {
        console.error("Erro ao injetar Vue App:", e);
    }
})();