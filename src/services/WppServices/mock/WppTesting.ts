import type { ContatosEmCSV } from "../CsvReader/CsvReaderInterface";
import { useWppStatesStore } from "../../../stores/wppStates";
import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";

export const startWppService = async () => {

    const wppStates = useWppStatesStore();
    const contatos: ContatosEmCSV[] = [
        {
            id_empresa: '1',
            nome: 'Contabiehl',
            mensagem: 'Olá bom dia, podemos fechar a folha de pagamento referente ao mes atual?',
            telefone: '5199999999',
            mapa_referencias: new Map()
        },
        {
            id_empresa: '2',
            nome: 'Augustão',
            mensagem: 'Boa tarde, saiu uma nova convenção coletiva, mande mensagem para saber mais sobre',
            telefone: '5188888888',
            mapa_referencias: new Map()
        },
    ] 
    const arquivos = [
        {
            nome: 'arquivo1',
            legenda: 'esse é o arquivo 1'
        },
        {
            nome: 'arquivo2',
            legenda: 'esse é o arquivo 2'
        }
    ]
    //4 - ENVIAR MENSAGENS E/OU ARQUIVOS
    // 1 - caso: tem mensagem e tem arquivo
    wppStates.contatosFaltantes = contatos.length;
    wppStates.arquivosFaltantes = arquivos.length;
    for (const contato of contatos){
        if (wppStates.contatosFaltantes === contatos.length){
            await wppStates.handlePopupMessage('Iniciando envio!\n@Contabiehl Sender since 2026', 2000)
            wppStates.totalContatos = contatos.length;
            wppStates.totalArquivos = arquivos.length;
        }
        wppStates.handleActualAction(`Enviando mensagem para: ${contato.nome} (${contato.telefone})`)
        for (const arquivo of arquivos){
            wppStates.handleActualFile(`Enviando arquivo: ${arquivo.nome}`)
            wppStates.handleActualFile(`Legenda: ${arquivo.legenda}`)
            try{
                await sendFile(contato.nome, arquivo.nome, arquivo.legenda);
                wppStates.cleanActualFile();
                wppStates.handleActualFile(`Arquivo enviado com sucesso: ${arquivo.nome}`)
                wppStates.arquivosFaltantes--
                if (wppStates.arquivosFaltantes === 0){
                    wppStates.cleanActualFile()
                    await wppStates.handlePopupMessage(`Todos os arquivos foram enviados para ${contato.nome}`, 3000)
                    wppStates.arquivosFaltantes = wppStates.totalArquivos;
                } else {
                    await wppStates.handlePopupMessage(`Próximo arquivo em {sec}s` , 5000)
                }
                wppStates.cleanActualFile();
            } catch(error){
                wppStates.cleanActualFile();
                wppStates.cleanActualAction();
                await wppStates.handleError(String(error));
            }
        }
        wppStates.cleanActualAction();
        wppStates.contatosFaltantes--
        if (wppStates.contatosFaltantes === 0){
            await wppStates.handlePopupMessage('Envio finalizado', 5000)
            wppStates.totalContatos = 0;
            wppStates.totalArquivos = 0;
            
        } else {
            await wppStates.handlePopupMessage(`Próximo contato em {sec}s`, 5000)
        }
    }
    // PARA CADA UM DOS CONTATOS, ENVIAMOS
    // 2 - caso: apenas mensagem de texto
    wppStates.contatosFaltantes = contatos.length;
    for (const contato of contatos){
        if (wppStates.contatosFaltantes === contatos.length){
            await wppStates.handlePopupMessage('Iniciando envio!\n@Contabiehl Sender since 2026', 2000)
            wppStates.totalContatos = contatos.length;
        }
        wppStates.handleActualAction(`Enviando mensagem para: ${contato.nome}`)
        wppStates.handleActualAction(`Número: ${contato.telefone}`)
        wppStates.handleActualAction(`Conteúdo da mensagem: ${contato.mensagem}`)
        try{
            await sendText(contato.telefone, contato.mensagem)
            wppStates.cleanActualAction();
            wppStates.handleActualAction(`Mensagem enviada com sucesso para ${contato.nome}`)

            wppStates.contatosFaltantes--;
        } catch (error){
            wppStates.cleanActualAction();
            await wppStates.handleError(String(error));
        } finally{
            if (wppStates.contatosFaltantes === 0){
                wppStates.cleanActualAction();
                await wppStates.handlePopupMessage('Envio finalizado', 5000)
                wppStates.totalContatos = 0;
            } else {
                await wppStates.handlePopupMessage('Próximo envio em {sec}s', 5000)
            }
            wppStates.cleanActualAction();
        }
    }
};

const sleep = async (ms: number) =>{
  return new Promise(res => setTimeout(res, ms))
}

const sendText = async (args1: any, args2: any) =>{
    return new Promise<string>((res, rej) =>{
        setTimeout(()=>{
            // rej('Ocorreu um erro, verifique os logs')
            res('')
        }, 5000) //demora 3 seg pra enviar a mensagem
    })
}

const sendFile = async (to: string, fileName: string, message: string) => {
    return new Promise<string>((res, rej) =>{
        setTimeout(()=>{
            // rej('Ocorreu um erro, verifique os logs')
            res('')
        }, 3000) //demora 3 seg pra enviar a mensagem
    })
}