<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from "vue";
    import { useMultiStepFormStore } from "@/stores/multiStepForm";
    import { useWppStatesStore } from "@/stores/wppStates";
    import { WppService } from "@/services/WppServices/mock/WppTesting";
    import { useFileSelectedStore } from "@/stores/fileSelected";
    import { useFileAppenderStore } from "@/stores/fileAppender";
    import { useGloblalLocalStorageHandler } from "@/stores/globalLocalStorageHandler";
    import { CsvReader } from "@/services/WppServices/CsvReader/CsvReaderImpl";
import type { ContatosEmCSV } from "@/services/WppServices/CsvReader/CsvReaderInterface";


    //calls das stores
    const fileSelected = useFileSelectedStore();
    const fileAppender = useFileAppenderStore();
    const handleLocalStorage = useGloblalLocalStorageHandler();
    
    const aviso = ref<string>("");
    const multiStepForm = useMultiStepFormStore();
    const wppStates = useWppStatesStore();
        
    const voltarHomePage = async () => {
        if (!wppStates.isAborted){
            handleLocalStorage.clearAll()
            fileSelected.cleanSelectedFile();
            fileAppender.cleanAppendedFiles('global-file-option')
        }
        await wppStates.handlePopupMessage('Retornando à página inicial em {sec}s', 5000)
        multiStepForm.backToBeginning();
    };

    onMounted(async() => {
        //se não tiver fileSelected, verifica se tem no localStorage
        if (!fileSelected.fileSelected){
            fileSelected.loadStore();
        }
        //se não tiver arquivos globais, verifica se tem no localStorage
        if (!fileAppender.hasFileAppended()){
            fileAppender.loadStore();
        }
        //carregar os contatos manuais
        const manualContacts = handleLocalStorage.getItem('manual-contacts')
        const manualMessage = handleLocalStorage.getItem('personalizatedMessage')
        const intervalBetMsg = handleLocalStorage.getItem('interval-bet-messages') as unknown as number * 1000;
        //se tiver contatos manuais, nem precisa verificar se tem ou não mensagem personalizada, puxa direto
        if (manualContacts) {
            const manualContactsArray = manualContacts.split(', ');
            const contatosParsed: ContatosEmCSV[] = []
            const man = manualContactsArray.map(phoneNumber => {
                return {id_empresa: '-1', nome: phoneNumber, telefone: phoneNumber, mensagem: manualMessage!, mapa_referencias: new Map()}
            })
            man.forEach(m => contatosParsed.push(m))
            //passando os contatos manuais e a mensagem manual e os arquivos globais ou não
            fileAppender.hasFileAppended () ? await WppService.sendMessagesAndFiles(contatosParsed, fileAppender.filesAppended,intervalBetMsg ) : await WppService.sendMessages(contatosParsed, intervalBetMsg)
        } else { //nesse caso eu tenho um arquivo .csv
            // precisa verificar se tem optional message
            const sendManualMessage = handleLocalStorage.getItem('option-message')
            const contatosParsed = await CsvReader.validateAndParse(fileSelected.fileSelected!)
            if (sendManualMessage){
                //passando o arquivo .csv e mais a mensagem manual e os arquivos globais ou não
                fileAppender.hasFileAppended () ? await WppService.sendMessagesAndFiles(contatosParsed, fileAppender.filesAppended, intervalBetMsg, manualMessage!) : await WppService.sendMessages(contatosParsed, intervalBetMsg, manualMessage!)
            } else {
                fileAppender.hasFileAppended () ? await WppService.sendMessagesAndFiles(contatosParsed, fileAppender.filesAppended, intervalBetMsg) : await WppService.sendMessages(contatosParsed, intervalBetMsg)
            }
        }
        await voltarHomePage(); 
    });
</script>

<template>
    <div class="w-full h-[50vh] justify-center flex items-center">
        <div class="flex flex-col items-start">
            <div>
                <p v-for="action in wppStates.actualAction" class="break-word">
                {{ action }}
                </p>
            </div>
            <div>
                <p v-for="fileAction in wppStates.actualFile" class="break-all">
                {{ fileAction }}
                </p>
            </div>
            <div class="flex items-center justify-center w-full mt-10">
                <p class="text-red-500">{{ wppStates.error }}</p>
                <p class="font-bold text-center">{{ wppStates.dynamicPopupMessage }}</p>
            </div>
        </div>
    </div>
    <div v-if="wppStates.actualFileProgressBarWidth" class="w-full flex gap-3 h-1 items-center">
        <p>Arquivos:</p>
        <div  class="w-full border border-solid border-black flex gap-1 items-center p-0.5 rounded-2xl">
        <div 
        class="h-1 bg-green-600 transition-all duration-200 rounded-2xl" 
        :style="{ width: wppStates.actualFileProgressBarWidth }"
        ></div>
        </div>
        <p class="w-15 text-center">{{ wppStates.actualFileProgressBarWidth }}</p>
    </div>
    <div v-if="wppStates.actionProgressBarWidth" class="w-full flex gap-3 h-1 items-center mt-10">
        <p>Contatos:</p>
        <div  class="w-full border border-solid border-black flex gap-1 items-center p-0.5 rounded-2xl">
        <div 
        class="h-1 bg-red-600 transition-all duration-200 rounded-2xl" 
        :style="{ width: wppStates.actionProgressBarWidth }"
        ></div>
        </div>
        <p class="w-15 text-center">{{ wppStates.actionProgressBarWidth }}</p>
    </div>
    <button class=" text-white absolute right-75 w-30 bottom-5 bg-red-500 rounded-full cursor-pointer" v-if="multiStepForm.currentStep.position === 4" @click="wppStates.abortSend()">Abortar envio</button> 
</template>