export const loadWppLibrary = async () => {
  return new Promise((resolve, reject) => {
    // Função de verificação
    const check = () => {
        if (window.WPP && window.WPP.isReady) {
            resolve(true);
        } else {
            // Tenta novamente em 1 segundo
            setTimeout(check, 1000);
        }
    };

    // Timeout de segurança (ex: 30 segundos)
    setTimeout(() => {
        if (!window.WPP || !window.WPP.isReady) {
            // Não rejeita fatalmente, apenas avisa, pois pode demorar a carregar
            console.warn("WPP ainda não detectado, continuando a esperar..."); 
        }
    }, 30000);

    check();
  });
};