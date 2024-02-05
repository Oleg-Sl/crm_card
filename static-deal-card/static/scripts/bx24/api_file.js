
export default class FilesMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async uploadFile(folderId, file) {
        try {
            const base64Data = await this.readFileAsBase64(file);
            const result = await this.bx24.callMethod("disk.folder.uploadfile", {
                id: folderId,
                data: {
                    NAME: file.name
                },
                fileContent: base64Data,
                generateUniqueName: true
            });
            console.log("preview result = ", result);
            return result;
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }

    async removeFile(fileId) {
        try {
            const result = await this.bx24.callMethod("disk.file.markdeleted", {
                id: fileId
            })
            return result;
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    async getFilesFromFolder(folderId) {
        try {
            const result = await this.bx24.callMethod("disk.folder.getchildren", {
                id: folderId
            });
            return result;
        } catch (error) {
            console.error('Error uploading file:', error);
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
