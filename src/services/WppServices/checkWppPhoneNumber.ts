export const wppPhoneChecker = async (contato: string) => {
  try {
    const contatoAjustado = "55" + contato.trim() + '';
    const result = await window.WPP.contact.queryExists(contatoAjustado);
    if (!result || !result.wid) {
      throw new Error('Número inexistente')
    }
    return result.wid._serialized;
  } catch (e) {
    throw new Error(String(e));
  }
};

