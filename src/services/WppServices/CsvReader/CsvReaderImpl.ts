import { type ContatosEmCSV } from "@/services/WppServices/CsvReader/CsvReaderInterface";
import { phoneValidator } from "@/components/composables/PhoneValidatorComposable";

export class CsvReader {
  static async validateAndParse(file: File): Promise<ContatosEmCSV[]> {
    //LEMOS O ARQUIVO VINDO
    const fileString = await file.text();
    //VERIFICAMOS SE O ARQUIVO É NULO
    if (fileString === null || fileString.length === 0)
      throw new Error("Arquivo corrompido ou com erro");

    const contatosEmCSV: ContatosEmCSV[] = []; //CONSTANTE DE RETORNO
    const headersEsperados = [
      "Codigo",
      "Nome da empresa",
      "Telefone",
      "Mensagem",
    ]; //O ESSENCIAL PRA APLICAÇÃO
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/; // Regex que identifica a vírgula apenas se ela NÃO estiver cercada por aspas

    const array = fileString.split(/\r?\n|\r/);
    if (array[0] === undefined) throw new Error("Arquivo não possui linhas");

    const headersEntregues = array[0]?.split(regex);

    const contemHeaderEsperado = headersEsperados?.every((header) => {
      const headerEmLowerCase = headersEntregues.map((header) =>
        header.toLowerCase(),
      );
      return headerEmLowerCase?.includes(header.toLowerCase());
    });
    const invalidPhoneNumbers: string[] = [];

    if (contemHeaderEsperado) {
      //PRIMEIRO PRECISAMOS VALIDAR OS NÚMEROS E ADICIONAR O PREFIXO NECESSÁRIO
      const phoneNumberPosition = headersEntregues!.findIndex(
        (header) => header.trim().toLowerCase() === "telefone",
      ); //PRA ISSO PRECISAMOS SABER A POSIÇÃO DO TELEFONE NO ARRAY DE HEADERS
      //SE TIVER OS HEADERS ESPERADOS, PERCORREMOS O ARRAY PULANDO A PRIMEIRA POSIÇÃO (HEADERS) CRIANDO UM MAPA
      for (let i = 1; i < array.length; i++) {
        const csvData = array[i]?.split(regex);
        //SE NÃO FOR UMA LINHA VAZIA
        if (csvData && csvData.length >= headersEsperados!.length) {
          //CONFERINDO SE O NÚMERO É VALIDO (REGEX)
          if (phoneValidator(csvData[phoneNumberPosition]!)) {
            //PRIMEIRO ELIMINAMOS O ESPAÇO, SE HOUVER
            csvData[phoneNumberPosition]! = csvData[
              phoneNumberPosition!
            ]!.replace(/\s+/g, "");
          } else {
            invalidPhoneNumbers.push(csvData[phoneNumberPosition]!);
            //LANÇAR ERRO/REJEITAR PROMISSE
          }

          //PRIMEIRO CRIAMOS O MAPA DE REFERENCIAS E DEPOIS CRIAMOS O OBJETO E IMBUTIMOS O MAPA NELE
          const mapaReferencias = new Map<string, any>();

          for (let j = 0; j < headersEntregues!.length; j++) {
            let data = csvData[j];
            if (
              data === "" &&
              headersEsperados[j]?.toLowerCase() ===
                headersEntregues![j]?.toLowerCase()
            ) {
              //caso eu tenha o dado vazio na posição que eu espero ter algo (essencial pra aplicação), lanço erro
              throw new Error(`É esperado um(a): ${headersEsperados[j]}`);
            } else if (data === undefined) {
              data = "";
            }
            mapaReferencias.set(headersEntregues![j]!.toLowerCase(), data);
          }

          //FAZEMOS A CRIAÇÃO DO OBJ E COLOCAMOS NO ARRAY
          contatosEmCSV.push({
            id_empresa: mapaReferencias.get("codigo"),
            nome: mapaReferencias.get("nome da empresa"),
            telefone: mapaReferencias.get("telefone"),
            mensagem: mapaReferencias.get("mensagem"),
            mapa_referencias: mapaReferencias,
          });
        }
      }
      if (contatosEmCSV.length === 0)
        throw new Error(
          "Nenhum contato adicionado, por favor inclua um contato com, no mínimo: " +
            headersEsperados.join(", ") +
            ".",
        );

      if (invalidPhoneNumbers.length > 0)
        throw new Error(
          invalidPhoneNumbers.length > 1
            ? "Números inválidos: " + invalidPhoneNumbers
            : "Número inválido: " + invalidPhoneNumbers,
        );

      return contatosEmCSV;
    } else {
      throw new Error(
        "O arquivo não contém as colunas esperadas. Colunas esperadas: " +
          headersEsperados.join(", "),
      );
    }
  }
}
