import { EVO_CONFIG } from './EvolutionConfig';

export const wppPhoneChecker = async (phone: string): Promise<string> => {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
        // Rota de checagem da versão v1.8.2
        const response = await fetch(`${EVO_CONFIG.baseUrl}/chat/whatsappNumbers/${EVO_CONFIG.instance}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVO_CONFIG.apikey
            },
            body: JSON.stringify({
                "numbers": [cleanPhone]
            })
        });

        const res = await response.json();
        const data = res[0];
        if (data.exists) {
            return data.jid; // Retorna o ID correto do WhatsApp
        } else {
            throw new Error(`Número ${phone} não tem WhatsApp.`);
        }
    } catch (e) {
        throw new Error(String(e));
    }
}