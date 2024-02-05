
export default class FilesMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async uploadFile(folderId, file) {
        try {
            const base64Data = await this.readFileAsBase64(file);
            const result = await this.bx24.callMethod("disk.folder.uploadfile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: folderId,
                    data: {
                        NAME: file.name
                    },
                    fileContent: base64Data,
                    generateUniqueName: true
                })
            });
            console.log("preview result = ", result);
            return result;
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }

    async readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64Data = reader.result.split(',')[1];
                resolve(base64Data);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }

}
