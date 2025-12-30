const fileToBase64 = async (file:File):Promise<string> => {
    return new Promise ((resolve, reject)=>{
        const base64Maker = new FileReader();

        base64Maker.onload = () =>{
            resolve(base64Maker.result as string);
        }

        base64Maker.onerror = (error) =>{
            reject(error)
        }

        base64Maker.readAsDataURL(file)
    })
}

export default fileToBase64