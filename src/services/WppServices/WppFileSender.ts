export const sendFile = async (to: string, file: File, fileName: string, message: string) => {
    try {
        await window.WPP.chat.sendFileMessage(to, file, {
            type: 'auto-detect',
            filename: fileName,
            caption: message,      
        });
    } catch (e){
        throw new Error(String(e))
    }
}