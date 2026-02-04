export const sendFile = async (to: string, file: File, fileName: string) => {
    try {
        await window.WPP.chat.sendFileMessage(to, file, {
            type: 'auto-detect',
            filename: fileName,    
            createChat: true
        });
    } catch (e){
        throw new Error(String(e))
    }
}