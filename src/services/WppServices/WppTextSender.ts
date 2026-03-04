// src/services/WppServices/WppTextSender.ts
import { EVO_CONFIG } from './EvolutionConfig';

export const sendText = async (to: string, message: string) => {
    try {
        const response = await fetch(`${EVO_CONFIG.baseUrl}/message/sendText/${EVO_CONFIG.instance}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVO_CONFIG.apikey 
            },
            body: JSON.stringify({
                number: to,
                options: {
                    delay: 200,
                    presence: "composing"
                },
                textMessage: {
                    text: message
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao enviar texto pela API');
        }
    } catch (e) {
        throw new Error(String(e));
    }
}