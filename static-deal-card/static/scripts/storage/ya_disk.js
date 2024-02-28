
import FileStorage from './storage_interface.js';
import { YANDEX_DISK_API_URL } from './constants.js';


export default class YaDisk extends FileStorage {
    constructor(secretKey) {
        super(secretKey);
        this.api = YANDEX_DISK_API_URL;
    }

    async retryOperation(operation, maxRetries = 3, baseRetryDelay = 1000, maxRetryDelay = 5000) {
        let currentRetryDelay = baseRetryDelay;

        for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
            try {
                const result = await operation();
                return result;
            } catch (error) {
                console.error("An error occurred: ", error);
                await new Promise(resolve => setTimeout(resolve, currentRetryDelay));
                currentRetryDelay = Math.min(currentRetryDelay * 2, maxRetryDelay);
            }
        }

        console.error(`Failed after ${maxRetries} retries`);
        return null;
    }

    async uploadFile(dirPath, fileName, fileData) {
        const operation = async () => {
            // создание директории
            // const createDirRes = await this.createRecursiveDir(dirPath.split("/"));
            // if (!createDirRes) {
            //     return null;
            // }

            // получение URL для загрузки файла
            const href = await this.getUploadURL(dirPath, fileName, fileData);
            if (!href) {
                return null;
            }

            // загрузка файла
            const putFileRes = await this.putFile(href, fileData);
            if (!putFileRes) {
                return null;
            }

            // получение пуюличной ссылки на файл
            const encodedFileName = encodeURIComponent(fileName);
            const urlMetaInfoFile = await this.publishFile(`${dirPath}/${encodedFileName}`);
            if (!urlMetaInfoFile) {
                return null;
            }

            const publishUrl = await this.getPublishLinkFile(this.replaceHttpWithHttps(urlMetaInfoFile));
            return publishUrl;
        };

        return await this.retryOperation(operation);
    }

    async removeFile(dirPath, fileName) {
        const fileNameEncode = encodeURIComponent(fileName);

        const operation = async () => {
            const response = await fetch(`${this.api}?path=app:/${dirPath}/${fileNameEncode}&permanently=false`, {
                method: 'DELETE',
                headers: {
                    Authorization: `OAuth ${this.secretKey}`,
                },
            });

            if (response.ok) {
                return response;
            }

            const result = await response.json();
            console.error("Error removing file from YandexDisk: ", result);
            throw new Error("Failed to remove file");
        };

        return await this.retryOperation(operation);
    }

    async removeDir(dirPath) {
        const operation = async () => {
            const response = await fetch(`${this.api}?path=app:/${dirPath}&permanently=false`, {
                method: 'DELETE',
                headers: {
                    Authorization: `OAuth ${this.secretKey}`,
                },
            });

            if (response.ok) {
                return response;
            } else {
                const result = await response.json();
                console.error("Error removing directory from YandexDisk: ", result);
                throw new Error("Failed to remove directory");
            }
        };

        return await this.retryOperation(operation);
    }

    async getUploadURL(dirPath, fileName, file) {
        const fileNameEncode = encodeURIComponent(fileName);
        const operation = async () => {
            const url = `${this.api}/upload?path=app:/${dirPath}/${fileNameEncode}&overwrite=true`;
            const headers = {
                Authorization: `OAuth ${this.secretKey}`,
            };
            const response = await fetch(url, { method: 'GET', headers });

            if (response.ok) {
                const { href } = await response.json();
                return href;
            } else {
                const result = await response.json();
                console.error("Error getting upload URL for YandexDisk: ", result);
                throw new Error("Failed to get upload URL");
            }
        };

        return await this.retryOperation(operation);
    }

    async putFile(href, file) {
        const operation = async () => {
            const response = await fetch(href, {
                method: 'PUT',
                body: file,
            });

            if (!response.ok) {
                console.error('Error uploading file to YandexDisk');
                throw new Error("Failed to upload file");
            }

            return response.ok;
        };

        return await this.retryOperation(operation);
    }

    async publishFile(pathFile) {
        const operation = async () => {
            const response = await fetch(`${this.api}/publish?path=app:/${pathFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `OAuth ${this.secretKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log("published file result = ", result);
                return result.href;
            }

            console.log(`Error publishing file ${pathFile} to YandexDisk: `, await response.json());
            throw new Error("Failed to publish file");
        };

        return await this.retryOperation(operation);
    }

    async getPublishLinkFile(url) {
        const operation = async () => {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `OAuth ${this.secretKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result.public_url;
            }

            const result = await response.json();
            console.log(`Error getting public link for file in YandexDisk: `, result);
            throw new Error("Failed to get public link");
        };

        return await this.retryOperation(operation);
    }

    async createRecursiveDir(dirPath) {
        let dirResult = "";

        for (let dir of dirPath) {
            dirResult += dir;
            console.log("dirResult = ", dirResult);

            const operation = async () => {
                const response = await fetch(`${this.api}?path=app:/${dirResult}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `OAuth ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok || ("error" in result && result.error === "DiskPathPointsToExistentDirectoryError")) {
                    dirResult += "/";
                    return true;
                }

                if (!response.ok) {
                    console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
                    throw new Error("Failed to add directory");
                }

                console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
                throw new Error("Failed to add directory");
            };

            const res = await this.retryOperation(operation);

            if (!res) {
                return false;
            }
        }

        return true;
    }

    async createDir(dirPath) {
        const operation = async () => {
            const response = await fetch(`${this.api}?path=app:/${dirPath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `OAuth ${this.secretKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok || ("error" in result && result.error === "DiskPathPointsToExistentDirectoryError")) {
                dirPath += "/";
                return true;
            }

            if (!response.ok) {
                console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
                throw new Error("Failed to add directory");
            }

            console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
            throw new Error("Failed to add directory");
        };

        const res = await this.retryOperation(operation);

        if (!res) {
            return false;
        }

        return true;
    }
}
