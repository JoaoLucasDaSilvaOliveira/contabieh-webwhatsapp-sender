export const sendText = async (to: string, message: string) =>{
    try {
        const result = await window.WPP.chat.sendTextMessage(to, message, {
            createChat: true
        })
        return result;
    } catch (e){
        throw new Error(String(e))
    }
}