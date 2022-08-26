export const readFile = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onloadend = async () => {
      const { result } = fileReader
      if (result) resolve(result as ArrayBuffer)
      else reject()
    }

    fileReader.readAsArrayBuffer(file)
  })
}
