<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useFileSelectedStore } from '@/stores/fileSelected';

    const optionMessage = ref<boolean>(true);
    const fileStoreSelected = useFileSelectedStore()
    const mensagemPersonalizada = ref<string | null>(null)

    onMounted(()=>{
        if (!fileStoreSelected.fileSelected){
            optionMessage.value = false
        }
    })
</script>

<template>
    <div class="flex flex-col items-center">

        <div v-if="fileStoreSelected.fileSelected">
            <p class="mb-4 font-medium text-gray-700">Usar mensagem da tabela de contatos?</p>
    
            <div class="flex w-full justify-center gap-8 mb-6">
                <div class="flex items-center">
                    <input
                        type="radio"
                        v-model="optionMessage"
                        id="table-message-radio-no"
                        :value="false"
                        class="peer hidden"
                    />
                    <label
                        for="table-message-radio-no"
                        class="flex items-center gap-2 cursor-pointer text-gray-600 peer-checked:text-[#F9B02E] font-semibold transition-all"
                    >
                        <span class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-[#F9B02E]">
                            <span :class="[
                                'w-2.5 h-2.5 bg-[#F9B02E] rounded-full transition-transform duration-200',
                                optionMessage ? 'scale-0' : 'scale-100'
                            ]"></span>
                        </span>
                        Não
                    </label>
                </div>
    
                <div class="flex items-center">
                    <input
                        type="radio"
                        v-model="optionMessage"
                        id="table-message-radio-yes"
                        :value="true"
                        class="peer hidden"
                    />
                    <label
                        for="table-message-radio-yes"
                        class="flex items-center gap-2 cursor-pointer text-gray-600 peer-checked:text-[#F9B02E] font-semibold transition-all"
                    >
                        <span class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-[#F9B02E]">
                            <span :class="[
                                'w-2.5 h-2.5 bg-[#F9B02E] rounded-full transition-transform duration-200',
                                optionMessage ? 'scale-100' : 'scale-0'
                            ]"></span>
                        </span>
                        Sim
                    </label>
                </div>
            </div>
        </div>

        <fieldset :class="[
                'w-100 border-2 rounded-lg p-2 transition-all duration-200 overflow-hidden',
                !optionMessage 
                ? 'border-gray-300 focus-within:border-[#F9B02E]' 
                : 'border-gray-100 opacity-50 pointer-events-none grayscale'
            ]">
            <legend :class="!optionMessage ? 'px-2 text-sm font-medium text-gray-600' : 'hidden'">
                Digite sua mensagem
            </legend>
            <textarea 
                :disabled="optionMessage"
                :class="[
                    'w-full p-3 outline-none transition-all duration-200 placeholder:text-gray-400 field-sizing-content resize-none  block break-all overflow-hidden min-h-[100px]',
                    fileStoreSelected.fileSelected ? 'max-h-30' : 'max-h-55'
                ]" 
                name="custom-message"
                id="message-input" 
                :placeholder="!optionMessage ? 'Olá prezado, bom dia! ...' : ''"
                v-model="mensagemPersonalizada"
            />
        </fieldset>
    </div>
</template>