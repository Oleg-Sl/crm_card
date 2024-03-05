
export default class FilesMethods {
    constructor(api) {
        this.api = api;
    }

    async addFolder(parentId, name) {
        const response = await fetch(`${this.api}disk.folder.addsubfolder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": parentId,
                "data": {
                    "NAME": name
                }
            })
        });

        const result = await response.json();
        return result?.result;
    }

    async uploadFile(folderId, file) {
        try {
            const base64Data = await this.readFileAsBase64(file);
            const response = await fetch(`${this.api}disk.folder.uploadfile`, {
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

            const result = await response.json();
            return result?.result;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    async removeFile(fileId) {
        try {
            const response = await fetch(`${this.api}disk.file.markdeleted`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: fileId,
                })
            });

            const result = await response.json();
            return result?.result;
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    async getFilesFromFolder(folderId) {
        try {
            const response = await fetch(`${this.api}disk.folder.getchildren`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: folderId
                })
            });

            const result = await response.json();
            // console.log("uploadFile = ", result);
            return result?.result;
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
