<script setup lang="ts">
    //TODO:
    // implementar lógica
    import { onMounted, ref } from "vue";
    import { useMultiStepFormStore } from "@/stores/multiStepForm";
    import { useWppStatesStore } from "@/stores/wppStates";
    import { startWppService } from "@/services/WppServices/mock/WppTesting";
    
    const aviso = ref<string>("");
    const multiStepForm = useMultiStepFormStore();
    const wppStates = useWppStatesStore();
        
    const voltarHomePage = () => {
        setTimeout(() => {
            aviso.value= '';
            multiStepForm.backToBeginning();
        }, 1000);
    };

    onMounted(async() => {
        // voltarHomePage();
        await startWppService()
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
                <p class="font-bold">{{ wppStates.dynamicPopupMessage }}</p>
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
</template>