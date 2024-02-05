
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
            const createDirRes = await this.createDir(dirPath.split("/"));
            if (!createDirRes) {
                return null;
            }

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

    async createDir(dirPath) {
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

        // let dirResult = "";
        // for (let dir of dirPath) {
        //     dirResult += dir;
        //     console.log("dirResult = ", dirResult);
        //     const response = await fetch(`${this.url}?path=app:/${dirResult}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Authorization': `OAuth ${this.secretKey}`,
        //             'Content-Type': 'application/json'
        //         }
        //     });
    
        //     let result = await response.json();
        //     if (response.ok || ("error" in result && result.error === "DiskPathPointsToExistentDirectoryError")) {
        //         dirResult += "/";
        //         continue;
        //         // 
        //     }
    
        //     console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
        //     return false;
        // }
        // return true;
    }
}




// export default class YandexDisk extends FileStorage {
//     constructor(secretKey) {
//         super(secretKey);
//         this.api = YANDEX_DISK_API_URL;
//     }

//     async uploadFile(dirPath, fileName, fileData) {
//         const res = await this.createDir(dirPath.split("/"));
//         if (!res) {
//             return null;
//         }
//         const href = await this.getUploadURL(dirPath, fileName, fileData);
//         if (!href) {
//             return null;
//         }
//         const putFileRes = await this.putFile(href, fileData);
//         if (!putFileRes) {
//             return null;
//         }
//         const urlMetaInfoFile = await this.publishFile(`${dirPath}/${encodeURIComponent(fileName)}`);
//         if (!urlMetaInfoFile) {
//             return null;
//         }
//         const publishUrl = await this.getPublishLinkFile(this.replaceHttpWithHttps(urlMetaInfoFile));
//         return publishUrl;
//     }

//     async removeFile(dirPath, fileName) {
//         const maxRetries = 3;
//         const retryDelay = 1000; // milliseconds

//         for (let i = 0; i < maxRetries; i++) {
//             try {
//                 const fileNameEncode = encodeURIComponent(fileName);
//                 const response = await fetch(`${this.url}?path=app:/${dirPath}/${fileNameEncode}&permanently=false`, {
//                     method: 'DELETE',
//                     headers: {
//                         Authorization: `OAuth ${this.secretKey}`,
//                     },
//                 });
//                 if (response.ok) {
//                     return response;
//                 } else {
//                     const result = await response.json();
//                     console.error("Ошибка удаления файла на YandexDisk: ", result);
//                 }
//             } catch (error) {
//                 console.error("An error occurred while removing the file: ", error);
//             }

//             // Delay before retrying
//             await new Promise(resolve => setTimeout(resolve, retryDelay));
//         }

//         console.error("Failed to remove the file after multiple retries");
//     }

//     async removeDir(dirPath) {
//         const maxRetries = 3;
//         const retryDelay = 1000; // in milliseconds
    
//         for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
//             try {
//                 const response = await fetch(`${this.url}?path=app:/${dirPath}&permanently=false`, {
//                     method: 'DELETE',
//                     headers: {
//                         Authorization: `OAuth ${this.secretKey}`,
//                     },
//                 });
    
//                 if (response.ok) {
//                     return response;
//                 } else {
//                     const result = await response.json();
//                     console.error("Ошибка удаления файла на YandexDisk: ", result);
//                     break;
//                 }
//             } catch (error) {
//                 console.error("Ошибка при выполнении запроса: ", error);
//             }
    
//             await new Promise(resolve => setTimeout(resolve, retryDelay));
//         }
//     }

//     async getUploadURL(dirPath, fileName, file) {
//         const maxRetries = 3;
//         const retryDelay = 1000;
    
//         for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
//             try {
//                 const fileNameEncode = encodeURIComponent(fileName);
//                 const url = `${this.url}/upload?path=app:/${dirPath}/${fileNameEncode}&overwrite=true`;
//                 const headers = {
//                     Authorization: `OAuth ${this.secretKey}`,
//                 };
//                 const response = await fetch(url, { method: 'GET', headers });
    
//                 if (response.ok) {
//                     const { href } = await response.json();
//                     return href;
//                 } else {
//                     const result = await response.json();
//                     console.error("Error getting upload URL for YandexDisk: ", result);
//                 }
//             } catch (error) {
//                 console.error("Error getting upload URL for YandexDisk: ", error);
//             }
    
//             await new Promise(resolve => setTimeout(resolve, retryDelay));
//         }
    
//         console.error("Failed to get upload URL after multiple retries");
//     }

//     async putFile(href, file) {
//         const response = await fetch(href, {
//             method: 'PUT',
//             body: file,
//         });
//         if (!response.ok) {
//             console.error('Ошибка загрузки файла на YandexDisk');
//         }

//         return response.ok;
//     }

//     async publishFile(pathFile) {
//         let retryCount = 0;
//         const maxRetries = 3;
//         const retryDelay = 1000;
   
//         while (retryCount < maxRetries) {
//             try {
//                 const response = await fetch(`${this.url}/publish?path=app:/${pathFile}`, {
//                     method: 'PUT',
//                     headers: {
//                         'Authorization': `OAuth ${this.secretKey}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });
   
//                 if (response.ok) {
//                     const result = await response.json();
//                     return result.href;
//                 } else {
//                     console.log(`Ошибка публикации файла ${pathFile} в YandexDisk: `, await response.json());
//                     retryCount++;
//                     await new Promise(resolve => setTimeout(resolve, retryDelay));
//                 }
//             } catch (error) {
//                 console.error(`An error occurred while publishing file ${pathFile}: `, error);
//                 retryCount++;
//                 await new Promise(resolve => setTimeout(resolve, retryDelay));
//             }
//         }
   
//         return false;
//     }

//     async getPublishLinkFile(url, maxRetries = 3, retryDelay = 500) {
//         let retries = 0;
      
//         const makeRequest = async () => {
//             try {
//                 const response = await fetch(url, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `OAuth ${this.secretKey}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });
      
//                 if (response.ok) {
//                     const result = await response.json();
//                     return result.public_url;
//                 } else {
//                     const result = await response.json();
//                     console.log(`Ошибка получения публичной ссылки на файл в YandexDisk: `, result);
//                     return false;
//                 }
//             } catch (error) {
//                 console.log(`Ошибка при выполнении запроса: `, error);
//                 return false;
//             }
//         };
      
//         const retry = async () => {
//             retries++;
//             if (retries <= maxRetries) {
//                 console.log(`Повторная попытка (${retries}/${maxRetries}) через ${retryDelay} мс`);
//                 await new Promise(resolve => setTimeout(resolve, retryDelay));
//                 return await makeRequest();
//             } else {
//                 console.log(`Достигнуто максимальное количество попыток (${maxRetries})`);
//                 return false;
//             }
//         };
      
//         return await makeRequest() || await retry();
//     }
// }


// class YandexDisk {
//     constructor(secretKey) {
//         this.secretKey = secretKey;
//         this.url = "https://cloud-api.yandex.net/v1/disk/resources";
//     }

//     updateSecretKey(newSecretKey) {
//         this.secretKey = newSecretKey;
//     }

//     async uploadFile(dirPath, fileName, file) {
//         let href = null;
//         let res = await this.createDir(dirPath.split("/"));
//         if (res) {
//             href = await this.getUploadURL(dirPath, fileName, file);
//         }
//         if (href) {
//             res = await this.putFile(href, file);
//         }
//         let urlMetaInfoFile = null;
//         if (res && href) {
//             urlMetaInfoFile = await this.publishFile(`${dirPath}/${encodeURIComponent(fileName)}`);
//         }
//         if (res && href && urlMetaInfoFile) {
//             let publishUrl = await this.getPublishLinkFile(this.replaceHttpWithHttps(urlMetaInfoFile));
//             return publishUrl;
//         }
//     }

//     // https://cloud-api.yandex.net/v1/disk/resources
//     // ? path=<путь к удаляемому ресурсу>
//     // & [permanently=<признак безвозвратного удаления>]
//     // & [fields=<свойства, которые нужно включить в ответ>]
//     async removeFile(dirPath, fileName) {
//         const fileNameEncode = encodeURIComponent(fileName);
//         const response = await fetch(`${this.url}?path=app:/${dirPath}/${fileNameEncode}&permanently=false`, {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `OAuth ${this.secretKey}`,
//             },
//         });
//         if (response.ok) {
//             return response;
//         } else {
//             let result = await response.json();
//             console.error("Ошибка удаления файла на YandexDisk: ", result);
//         }
//     }

//     async removeDir(dirPath) {
//         const response = await fetch(`${this.url}?path=app:/${dirPath}&permanently=false`, {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `OAuth ${this.secretKey}`,
//             },
//         });
//         if (response.ok) {
//             return response;
//         } else {
//             let result = await response.json();
//             console.error("Ошибка удаоения файла на YandexDisk: ", result);
//         }
//     }

//     async getUploadURL(dirPath, fileName, file) {
//         const fileNameEncode = encodeURIComponent(fileName);
//         const response = await fetch(`${this.url}/upload?path=app:/${dirPath}/${fileNameEncode}&overwrite=true`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `OAuth ${this.secretKey}`,
//             },
//         });
//         if (response.ok) {
//             let { href } = await response.json();
//             return href;
//         } else {
//             let result = await response.json();
//             console.error("Ошибка получения ссылки для загрузки файла на YandexDisk: ", result);
//         }
//     }

//     async putFile(href, file) {
//         const response = await fetch(href, {
//             method: 'PUT',
//             body: file,
//         });
//         if (!response.ok) {
//             console.error('Ошибка загрузки файла на YandexDisk');
//         }

//         return response.ok;
//     }

//     async createDir(dirPath) {
//         let dirResult = "";
//         for (let dir of dirPath) {
//             dirResult += dir;
//             console.log("dirResult = ", dirResult);
//             const response = await fetch(`${this.url}?path=app:/${dirResult}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `OAuth ${this.secretKey}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
    
//             let result = await response.json();
//             if (response.ok || ("error" in result && result.error === "DiskPathPointsToExistentDirectoryError")) {
//                 dirResult += "/";
//                 continue;
//                 // 
//             }
    
//             console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
//             return false;    
//         }
//         return true;
//     }

//     async publishFile(pathFile) {
//         const response = await fetch(`${this.url}/publish?path=app:/${pathFile}`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `OAuth ${this.secretKey}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         let result = await response.json();
//         if (response.ok) {
//             return result.href;
//         }

//         console.log(`Ошибка публикации файла ${pathFile} в YandexDisk: `, result);

//         return false;
//     }

//     async getPublishLinkFile(url, maxRetries = 3, retryDelay = 500) {
//         let retries = 0;
    
//         const makeRequest = async () => {
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `OAuth ${this.secretKey}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
    
//             let result = await response.json();
            
//             if (response.ok) {
//                 return result.public_url;
//             }
    
//             console.log(`Ошибка получения публичной ссылки на файл в YandexDisk: `, result);
    
//             return false;
//         };
    
//         const retry = async () => {
//             retries++;
//             if (retries <= maxRetries) {
//                 console.log(`Повторная попытка (${retries}/${maxRetries}) через ${retryDelay} мс`);
//                 await new Promise(resolve => setTimeout(resolve, retryDelay));
//                 return await makeRequest();
//             } else {
//                 console.log(`Достигнуто максимальное количество попыток (${maxRetries})`);
//                 return false;
//             }
//         };
    
//         return await makeRequest() || await retry();
//     }
    

//     replaceHttpWithHttps(url) {
//         if (url.startsWith("http://")) {
//           return url.replace(/^http:\/\//, "https://");
//         }
//         return url;
//       }

// }
