export const checkWppConnection = async () =>{
// Verifica se o WPP foi injetado corretamente
  if (!window.WPP || !window.WPP.webpack.isReady) {
    throw new Error('WPPConnect não está pronto. A página recarregou?');
  }

  // Verifica se está logado
  if (!window.WPP.conn.isRegistered()) {
    throw new Error('Usuário não está logado no WhatsApp Web.');
  }

  return true;
}