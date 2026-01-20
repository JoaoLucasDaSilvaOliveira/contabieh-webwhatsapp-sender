export const loadWppLibrary = async () => {
  return new Promise((resolve, reject) => {
    // Se já estiver carregado, retorna imediatamente
    if (window.WPP && window.WPP.isReady) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    // Usando a versão nightly conforme sua documentação (ou use uma versão fixa)
    script.src = 'https://github.com/wppconnect-team/wa-js/releases/download/nightly/wppconnect-wa.js';
    script.async = true;

    script.onload = () => {
      // O script carregou, agora esperamos o WPP iniciar internamente
      if (window.WPP) {
        window.WPP.webpack.onReady(() => {
          resolve(true);
        });
      } else {
        reject(new Error('Falha ao inicializar WPP object'));
      }
    };

    script.onerror = () => {
      reject(new Error('Erro ao carregar o script do WPPConnect'));
    };

    document.head.appendChild(script);
  });
};