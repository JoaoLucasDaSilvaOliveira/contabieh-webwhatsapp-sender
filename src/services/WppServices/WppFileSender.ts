// src/services/WppServices/WppFileSender.ts
import { EVO_CONFIG } from './EvolutionConfig';
import fileToBase64 from "@/components/composables/fromFiletoBase64";

export const sendFile = async (to: string, file: File, fileName: string) => {
    try {
        const base64Full = await fileToBase64(file);
        const pureBase64 = base64Full.split(',')[1]; 

        const response = await fetch(`${EVO_CONFIG.baseUrl}/message/sendMedia/${EVO_CONFIG.instance}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVO_CONFIG.apikey 
            },
            body: JSON.stringify({
                number: to,
                mediaMessage: {
                    mediatype: 'document',
                    mimetype: file.type || 'application/octet-stream',
                    caption: "",
                    media: pureBase64,
                    fileName: fileName
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no envio via Evolution API');
        }
    } catch (e) {
        throw new Error(String(e));
    }
}