import { loadWppLibrary } from "./WppLoader/WppLoaderService";

export const checkWppConnection = async () => {
  try {
    // 1. Tenta injetar/carregar a biblioteca primeiro
    await loadWppLibrary();

    // 2. Verifica se o WPP está pronto de fato
    if (!window.WPP || !window.WPP.webpack.isReady) {
      throw new Error('WPPConnect carregou mas não está pronto.');
    }

    // 3. Verifica se o usuário está logado no WhatsApp
    if (!window.WPP.conn.isAuthenticated()) {
      throw new Error('Usuário não está logado no WhatsApp Web.');
    }

    return true;
  } catch (e) {
    throw e; // Repassa o erro para ser tratado na UI
  }
}