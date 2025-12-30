const base64ToFile = (base64String: string, fileName: string): File => {
  // 1. Separa o cabeçalho do conteúdo (data:image/png;base64,xxxx...)
  const [header, data] = base64String.split(',');
  
  // 2. Extrai o tipo MIME (ex: image/png)
  const mime = header?.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  
  // 3. Decodifica a string base64
  const binaryString = atob(data!.trim());
  const n = binaryString.length;
  const u8arr = new Uint8Array(n);
  
  // 4. Preenche o array de bytes
  for (let i = 0; i < n; i++) {
    u8arr[i] = binaryString.charCodeAt(i);
  }
  
  // 5. Retorna o objeto File
  return new File([u8arr], fileName, { type: mime });
};

export default base64ToFile;