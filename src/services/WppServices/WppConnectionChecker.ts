import { EVO_CONFIG } from './EvolutionConfig';

export const checkWppConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${EVO_CONFIG.baseUrl}/instance/connectionState/${EVO_CONFIG.instance}`, {
            method: 'GET',
            headers: { 'apikey': EVO_CONFIG.apikey }
        });
        
        const data = await response.json();
        return data.instance?.state === 'open';
    } catch (e) {
        return false;
    }
}