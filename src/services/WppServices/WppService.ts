import type { ContatosEmCSV } from "@/services/WppServices/CsvReader/CsvReaderInterface";
import { useWppStatesStore } from "@/stores/wppStates";
import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";
import { sendFile } from "./WppFileSender";
import { sendText } from "./WppTextSender";
import { wppPhoneChecker } from "./checkWppPhoneNumber";
import { checkWppConnection } from "./WppConnectionChecker";

export class WppService {
  /**
   *
   * @param contatos Array do tipo ContatosEmCSV que esperamos receber. Nâo pode ser nulo
   * @param arquivos Arquivo(s) que serão enviados. Não pode ser nulo
   * @param manualMessage Mensagem manual que substiui a mensagem do array Contatos
   */
  static sendMessagesAndFiles = async (
    contatos: ContatosEmCSV[],
    arquivos: File[],
    interval: number,
    manualMessage?: string,
  ) => {
    const wppStates = useWppStatesStore();
    //resetar a opção de parar o envio de mensagens
    wppStates.resetAbort();
    if (contatos === null || arquivos === null) return;
    const regex = /^(\d+)\s*-\s*(.*)/;
    const existeArquivoGlobal = !arquivos.every((arquivo) =>
      arquivo.name.match(regex),
    );
    if (
      !existeArquivoGlobal &&
      contatos.every((contato) => contato.id_empresa !== "-1")
    ) {
      const idsArquivos = arquivos.map((arquivo) => {
        return arquivo.name.match(regex)![1];
      });
      const filteredContatos = contatos.filter((contato) =>
        idsArquivos.includes(contato.id_empresa),
      );
      contatos = filteredContatos; // crio uma nova lista de contatos apenas com quem tem arquivos pra enviar
    }
    wppStates.totalContatos = contatos.length;
    wppStates.contatosFaltantes = contatos.length;
    for (const contato of contatos) {
      if (wppStates.isAborted) {
        wppStates.contatosFaltantes = 0;
        wppStates.totalContatos = 0;
        wppStates.arquivosFaltantes = 0;
        wppStates.totalArquivos = 0;
        wppStates.cleanActualFile();
        wppStates.cleanActualAction();
        await wppStates.handlePopupMessage(
          "Envio cancelado pelo usuário",
          2000,
        );
        return;
      }
      let arrayTempArquivos: File[] = [];
      if (contato.id_empresa === "-1") {
        arrayTempArquivos = arquivos;
      } else {
        if (existeArquivoGlobal) {
          const arquivosGlobais = arquivos.filter(
            (arquivo) => !arquivo.name.match(regex),
          );
          arquivosGlobais.forEach((arqGlob) => arrayTempArquivos.push(arqGlob));
        }
        const arquivosFiltered = arquivos.filter((arquivo) => {
          const match = arquivo.name.match(regex);
          if (match && match[1]) {
            const idArquivo = match[1];
            if (idArquivo === contato.id_empresa) {
              return idArquivo;
            }
          }
        });
        arquivosFiltered.forEach((arq) => arrayTempArquivos.push(arq));
      }
      wppStates.totalArquivos = arrayTempArquivos.length;
      wppStates.arquivosFaltantes = arrayTempArquivos.length;
      if (wppStates.contatosFaltantes === contatos.length) {
        await wppStates.handlePopupMessage(
          "Iniciando envio!@Contabiehl Sender since 2026",
          2000,
        );
      }
      wppStates.handleActualAction(
        `Enviando mensagem para: ${contato.nome} (${contato.telefone})`,
      );
      try {
        const telefoneParseado = await wppPhoneChecker(contato.telefone);
        wppStates.handleActualAction(
          `Conteúdo da mensagem: ${manualMessage ? manualMessage : contato.mensagem}`,
        );
        await sendText(
          telefoneParseado,
          manualMessage ? manualMessage : contato.mensagem,
        );
        await this.sleep(3000);
        wppStates.cleanActualAction();
        await wppStates.handlePopupMessage(
          "Mensagem enviada com sucesso, enviado os arquivos em {sec}s",
          5000,
        );
      } catch (error) {
        wppStates.cleanActualFile();
        wppStates.cleanActualAction();
        await wppStates.handleError(String(error));
      }
      for (const arquivo of arrayTempArquivos) {
        if (wppStates.isAborted) {
          wppStates.contatosFaltantes = 0;
          wppStates.totalContatos = 0;
          wppStates.arquivosFaltantes = 0;
          wppStates.totalArquivos = 0;
          wppStates.cleanActualFile();
          wppStates.cleanActualAction();
          await wppStates.handlePopupMessage(
            "Envio cancelado pelo usuário",
            2000,
          );
          return;
        }
        wppStates.handleActualFile(`Enviando arquivo: ${arquivo.name}`);
        await this.sleep(3000);
        try {
          const telefoneParseado = await wppPhoneChecker(contato.telefone);
          await checkWppConnection();
          await sendFile(telefoneParseado, arquivo, arquivo.name);
          wppStates.cleanActualFile();
          wppStates.handleActualFile(
            `Arquivo enviado com sucesso: ${arquivo.name}`,
          );
          wppStates.arquivosFaltantes--;
          if (wppStates.arquivosFaltantes === 0) {
            wppStates.cleanActualFile();
            wppStates.cleanActualAction();
            await wppStates.handlePopupMessage(
              `Todos os arquivos foram enviados para ${contato.nome}`,
              2000,
            );
            wppStates.arquivosFaltantes = wppStates.totalArquivos;
          } else {
            await wppStates.handlePopupMessage(
              `Próximo arquivo em {sec}s`,
              interval,
            );
          }
          wppStates.cleanActualFile();
        } catch (error) {
          wppStates.cleanActualFile();
          wppStates.cleanActualAction();
          await wppStates.handleError(String(error));
        }
      }
      wppStates.cleanActualAction();
      wppStates.contatosFaltantes--;
      if (wppStates.contatosFaltantes === 0) {
        await wppStates.handlePopupMessage("Envio finalizado", 2000);
        wppStates.totalContatos = 0;
        wppStates.totalArquivos = 0;
      } else {
        await wppStates.handlePopupMessage(
          `Próximo contato em {sec}s`,
          interval,
        );
      }
    }
  };

  /**
   *
   * @param contatos Array do tipo ContatosEmCSV que esperamos receber. Nâo pode ser nulo
   * @param manualMessage Mensagem manual que substiui a mensagem do array Contatos
   */
  static sendMessages = async (
    contatos:
      | ContatosEmCSV[]
      | { nome: string; telefone: string; mensagem: string }[],
    interval: number,
    manualMessage?: string,
  ) => {
    const wppStates = useWppStatesStore();
    //resetar a opção de parar o envio de mensagens
    wppStates.resetAbort();
    if (contatos === null) return;
    wppStates.contatosFaltantes = contatos.length;
    for (const contato of contatos) {
      if (wppStates.isAborted) {
        wppStates.contatosFaltantes = 0;
        wppStates.totalContatos = 0;
        wppStates.cleanActualAction();
        await wppStates.handlePopupMessage(
          "Envio cancelado pelo usuário",
          2000,
        );
        return;
      }
      if (wppStates.contatosFaltantes === contatos.length) {
        await wppStates.handlePopupMessage(
          "Iniciando envio!\n@Contabiehl Sender since 2026",
          2000,
        );
        wppStates.totalContatos = contatos.length;
      }
      wppStates.handleActualAction(`Enviando mensagem para: ${contato.nome}`);
      wppStates.handleActualAction(`Número: ${contato.telefone}`);
      wppStates.handleActualAction(
        `Conteúdo da mensagem: ${manualMessage ? manualMessage : contato.mensagem}`,
      );
      await this.sleep(3000);
      try {
        await checkWppConnection();
        const telefoneParseado = await wppPhoneChecker(contato.telefone);
        await sendText(
          telefoneParseado,
          manualMessage ? manualMessage : contato.mensagem,
        );
        wppStates.cleanActualAction();
        wppStates.handleActualAction(
          `Mensagem enviada com sucesso para ${contato.nome}`,
        );
        await this.sleep(3000);
        wppStates.contatosFaltantes--;
      } catch (error) {
        wppStates.cleanActualAction();
        await wppStates.handleError(String(error));
      } finally {
        if (wppStates.contatosFaltantes === 0) {
          wppStates.cleanActualAction();
          await wppStates.handlePopupMessage("Envio finalizado", 2000);
          wppStates.totalContatos = 0;
        } else {
          await wppStates.handlePopupMessage(
            "Próximo envio em {sec}s",
            interval,
          );
        }
        wppStates.cleanActualAction();
      }
    }
  };

  static sleep(ms: number) {
    return new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  }
}
