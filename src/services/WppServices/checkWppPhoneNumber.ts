import type { ContatosEmCSV } from "./CsvReader/CsvReaderInterface";

export const wppPhoneChecker = async (contatos: ContatosEmCSV[]) =>{
    try{
        const numerosInexistentes: string[] = []
        const contatosComWid: ContatosEmCSV[] = []
        //PERCORREMOS TODOS OS NUMEROS RECEBIDOS
        for (const contato of contatos){
            const result = await window.WPP.contact.queryExists(contato.telefone);
            if (!result || !result.wid) {
                numerosInexistentes.push(contato.telefone)
            } else {
                contatosComWid.push({id_empresa: contato.id_empresa, telefone: result.wid._serialized, nome: contato.nome, mensagem: contato.mensagem, mapa_referencias: contato.mapa_referencias})
            }
        }
        return (numerosInexistentes.length > 0) ? {error: true, numerosInexistentes} : {error: false, contatosComWid}
    } catch (e) {
        throw new Error(String(e))
    }
}