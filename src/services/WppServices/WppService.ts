import { useFileSelectedStore } from "@/stores/fileSelected";
import { CsvReader } from "@/services/WppServices/CsvReader/CsvReaderImpl";
import { useWppStatesStore } from "@/stores/wppStates";
import { checkWppConnection } from "./WppConnectionChecker";
import { wppPhoneChecker } from "./checkWppPhoneNumber";
import { ref } from "vue";
import type { ContatosEmCSV } from "./CsvReader/CsvReaderInterface";
import { useFileAppenderStore } from "@/stores/fileAppender";
import { sendFile } from "./WppFileSender";
import { sendText } from "./WppTextSender";


const startWppService = async () => {

  const fileSelectedStore = useFileSelectedStore();
  const wppStates = useWppStatesStore();
  const fileAppender = useFileAppenderStore();
  const contatos = ref <ContatosEmCSV[]>([])
  //TODO:
  //IMPLEMENTAÇÕES:
  //1 - VALIDAR OS NÚMEROS E COLOCAR O @c.us
  if (fileSelectedStore.fileSelected !== null) {
    try {
      const contatosObj = await CsvReader.validateAndParse(
        fileSelectedStore.fileSelected
      );
      contatosObj.forEach((contato) =>
        contatos.value.push(contato)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await wppStates.handleError(errorMessage);
      return;
    }
  }
  //2 - CHECAR CONEXÃO COM O WPP
  try {
    await checkWppConnection();
  } catch (e) {
    await wppStates.handleError(String(e));
    return;
  }
  //3 - VERIFICAR SE O NRO EXISTE no WPP
  const result = await wppPhoneChecker(contatos.value);
  if (result.error) {
    await wppStates.handleError(result.numerosInexistentes!.length > 1 ? `Números incorretos: ${result.numerosInexistentes}` : `Número incorreto: ${result.numerosInexistentes}`);
    return;
  }
  //atribuindo o wid real do numero
  contatos.value = result.contatosComWid!;
  //4 - ENVIAR MENSAGENS E/OU ARQUIVOS
  // 1 - caso: tem mensagem e tem arquivo
  if (fileAppender.hasFileAppended()){
    //PARA CADA UM DOS CONTATOS, ENVIAMOS
    let indexContato = 0;
    for (const contato of contatos.value){
      //PARA CADA UM DOS ARQUIVOS, ENVIAMOS
      for (let i = 0; i < fileAppender.filesAppended.length; i++){
          //mostrando na tela o estado pré-envio
          wppStates.handleActualAction([`Enviando mensagem para: ${contato.nome}`, `Preparando para enviar arquivo: ${fileAppender.filesAppended[i]?.name}`, `Arquivo ${i+1} de ${fileAppender.filesAppended.length}`, `Contato ${indexContato+1} de ${contatos.value.length}`])
          //mandamos a mensagem apenas na primeira vez
          try{
            await sendFile(contato.telefone, fileAppender.filesAppended[i]!, fileAppender.filesAppended[i]!.name, (i > 0 ? '' : contato.mensagem))
            //mostrando na tela o estado pós-envio
             wppStates.handleActualAction([`Enviando mensagem para: ${contato.nome}`, `Arquivo enviado com sucesso: ${fileAppender.filesAppended[i]?.name}`, `${i+1} de ${fileAppender.filesAppended.length}`, `Contato ${indexContato+1} de ${contatos.value.length}`])
          } catch (error){
            const message = error instanceof Error ? error.message : String(error);
            await wppStates.handleError(message);
          }
          await sleep(250) 
      }
      await sleep(5000)
      indexContato++;
    }
  } else {
    // 2 - caso: apenas mensagem de texto
    let indexContato = 0;
    for (const contato of contatos.value){
      wppStates.handleActualAction([`Enviando mensagem para: ${contato.nome}`, `Contato ${indexContato+1} de ${contatos.value.length}`])
      try{
        await sendText(contato.telefone, contato.mensagem)
        wppStates.handleActualAction([`Mensagem enviada com sucesso para ${contato.nome}`, `Contato ${indexContato+1} de ${contatos.value.length}`])
      } catch (error){
        const message = error instanceof Error ? error.message : String(error);
          await wppStates.handleError(message);
      } finally{
        await sleep(5000)
        indexContato++
      }
    }
  }
};

const sleep = async (ms: number) =>{
  return new Promise(res => setTimeout(res, ms))
}

export default startWppService;
