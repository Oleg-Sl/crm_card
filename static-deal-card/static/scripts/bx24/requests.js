
export default class Bitrix24 {
    constructor() {
        this.debugMode = true;

        // Максимальное количество запросов в пакете
        this.batchLength = 50;
    }

    logError(message) {
        if (this.debugMode) {
            console.error(message);
        }
    }

    async callMethod(method, params = {}) {
        try {
            const result = await new Promise((resolve, reject) => {
                BX24.callMethod(method, params, response => {
                    if (response.status !== 200 || response.error()) {
                        const errorMessage = `${response.error()} (callMethod ${method}: ${JSON.stringify(params)})`;
                        this.logError(errorMessage);
                        reject(errorMessage);
                    }
                    resolve(response.data());
                });
            });

            return result;
        } catch (error) {
            const errorMessage = `An error occurred in callMethod: ${error}`;
            this.logError(errorMessage);
            return null;
        }
    }

    async openPath(path) {
        try {
            await new Promise((resolve, reject) => {
                BX24.openPath(path, (response) => {
                    // Handle the response if needed
                    resolve();
                });
            });
        } catch (error) {
            this.logError(`An error occurred in openPath: ${error}`);
        }
    }

    async makeCall(phoneNumber) {
        BX24.im.phoneTo(phoneNumber);
    }

    async openLine(openLineId) {
        BX24.im.openMessenger(openLineId);
    }

    async getDomain() {
        const domain = await BX24.getDomain();
        return domain;
    }

    async getSettingsAppByKey(key) {
        try {
            const value = await BX24.appOption.get(key);
            return value;
        } catch (error) {
            this.logError(`An error occurred in getSettingsAppByKey: ${error}`);
            return null;
        }
    }

    async setSettingsAppByKey(key, value) {
        try {
            const result = await new Promise((resolve, reject) => {
                BX24.appOption.set(key, value, response => {
                    if (response.status !== 200 || response.error()) {
                        const errorMessage = `${response.error()} (setSettingsAppByKey ${key}: ${value})`;
                        this.logError(errorMessage);
                        reject(new Error(errorMessage));
                    } else {
                        resolve(response.data());
                    }
                });
            });

            return result;
        } catch (error) {
            const errorMessage = `An error occurred in setSettingsAppByKey: ${error}`;
            this.logError(errorMessage);
            return null;
        }
    }

    async batchMethod(reqPackage) {
        try {
            const result = await new Promise((resolve, reject) => {
                BX24.callBatch(reqPackage, response => {
                    const responseData = {};
                    for (let key in response) {
                        const { status, error, data } = response[key];
                        console.log("status", status);
                        console.log("error", error());
                        console.log("data", data());

                        if (status !== 200 || error()) {
                            this.logError(`${error()} (method ${reqPackage[key].method}: ${JSON.stringify(reqPackage[key].params)})`);
                            continue;
                        }
                        responseData[key] = data();

                        // if (response[key].status !== 200 || response[key].error()) {
                        //     this.logError(`${response[key].error()} (method ${reqPackage[key].method}: ${JSON.stringify(reqPackage[key].params)})`);
                        //     continue;
                        // }
                        // const resData = response[key].data();
                        // responseData[key] = resData;
                    }
                    resolve(responseData);
                });
            });

            return result;
        } catch (error) {
            const errorMessage = `An error occurred in batchMethod: ${error}`;
            this.logError(errorMessage);
            return null;
        }
    }

    async callMethodForLong(method, params = {}) {
        try {
            const result = await new Promise((resolve, reject) => {
                BX24.callMethod(method, params, response => {
                    if (response.status !== 200 || response.error()) {
                        const errorMessage = `${response.error()} (callMethod ${method}: ${JSON.stringify(params)})`;
                        this.logError(errorMessage);
                        reject(new Error(errorMessage));
                    }
                    resolve(response.answer);
                });
            });

            return result;
        } catch (error) {
            const errorMessage = `An error occurred in callMethodForLong: ${error}`;
            this.logError(errorMessage);
            return null;
        }
    }

    async longBatchMethod(method, params) {
        try {
            const response = await this.callMethodForLong(method, params);
            let result = response.result;
            let next = response.next;
            let total = response.total;

            if (next) {
                const requestsList = this.generatingRequests(method, params, next, total);
                const batchList = this.splittingListRequests(requestsList);
                const countBatch = batchList.length;

                for (let batch of batchList) {
                    const res = await this.batchMethod(batch);
                    Object.values(res).forEach(value => {
                        result = result.concat(value);
                    });
                }
                const infoMessage = `Executed ${countBatch} requests out of ${countBatch}`;
                console.log(infoMessage);
            }

            return result;
        } catch (error) {
            const errorMessage = `An error occurred in longBatchMethod: ${error}`
            this.logError(errorMessage);
            return null;
        }
    }

    generatingRequests(method, params, start, total) {
        const batch = [];
        for (let ind = start; ind < total; ind += this.batchLength) {
            const paramsStart = { ...params, start: ind };
            const req = {
                method,
                params: paramsStart
            };
            batch.push(req);
        }
        return batch;
    }

    splittingListRequests(requestsList) {
        const requestsBatch = [];
        let batch = {};
        let count = 1;

        for (let ind in requestsList) {
            if (count > this.batchLength) {
                requestsBatch.push(batch);
                batch = {};
                count = 1;
            }
            batch[ind] = requestsList[ind];
            count++;
        }
        requestsBatch.push(batch);

        return requestsBatch;
    }
}



// class Bitrix24Old {
//     constructor() {}

//     async callMethod(method, params = {}) {
//         return new Promise((resolve, reject) => {
//             let callback = result => {
//                 if (result.status != 200 || result.error()) {
//                     console.log(`${result.error()} (callMethod ${method}: ${JSON.stringify(params)})`);
//                     return reject(result.error());
//                     // return result.error();
//                 }
//                 return resolve(result.data());
//             };
//             BX24.callMethod(method, params, callback);
//         });
//     }

//     // Открыть путь внутри портала
//     async openPath(path) {
//         return new Promise((resolve, reject) => {
//             let callback = result => {
//                 // if (result.status != 200 || result.error()) {
//                 //     // console.log(`${result}`);
//                 //     return reject("");
//                 // }
//                 // return resolve(result.data());
//                 return resolve();
//             };
//             BX24.openPath(path, callback);
//         });
//     }

//     // Получить начтройки приложения по ключу
//     async getSettingsAppByKey(key) {
//         let value = await BX24.appOption.get(key);
//         return value;
//     }

//     // Установка настройки приложения: ключ-значение
//     async setSettingsAppByKey(key, value) {
//         return new Promise((resolve, reject) => {
//             let callback = result => {
//                 if (result.status != 200 || result.error()) {
//                     console.log(`${result.error()} (callMethod ${method}: ${JSON.stringify(params)})`);
//                     return reject("");
//                 }
//                 return resolve(result.data());
//             };
//             BX24.appOption.set(key, value, callback);
//         });
//     }

//     // Выполнение пакетного запроса
//     async batchMethod(reqPackage) {
//         return new Promise((resolve, reject) => {
//             let callback = result => {
//                 let response = {};
//                 for (let key in result) {
//                     if (result[key].status != 200 || result[key].error()) {
//                         console.log(`${result[key].error()} (method ${reqPackage[key]["method"]}: ${JSON.stringify(reqPackage[key]["params"])})`);
//                         // return reject("");
//                         continue;
//                     }
//                     let resData = result[key].data();
//                     response[key] = resData;
//                 }
//                 return resolve(response);
//             };
//             BX24.callBatch(reqPackage, callback);
//         });
//     }

//     async callMethodForLong(method, params = {}) {
//         return new Promise((resolve, reject) => {
//             let callback = result => {
//                 if (result.status != 200 || result.error()) {
//                     console.log(`${result.error()} (callMethod ${method}: ${JSON.stringify(params)})`);
//                     return reject("");
//                 }
//                 return resolve(result.answer);
//             };
//             BX24.callMethod(method, params, callback);
//         });
//     }

//     // Выполнение длинного пакетного запроса
//     async longBatchMethod(method, params) {
//         let response = await this.callMethodForLong(method, params);
//         let result = response.result;               // данные
//         let next = response.next;                   // следующий номер элемента для извлечения
//         let total = response.total;                 // всего элементов
//         if (next) {
//             let requestsList = this.generatingRequests(method, params, next, total);        // формирование списка запросов
//             let batchList = this.splittingListRequests(requestsList);                       // разбитие списка запросов на "пачки"
//             let countBatch = batchList.length;      // общее количество BATCH запросов
//             let count = 0;                          // количество выпоненных BATCH запросов
//             for (let batch of batchList) {
//                 let res = await this.batchMethod(batch);                                    //
//                 // result = result.concat(...res);
//                 for (let key in res) {
//                     result = result.concat(res[key]);
//                 }
//                 count++;
//                 console.log(`Выполнено ${count} запросов из ${countBatch}`);
//             }
//         }
        
//         return result;
//     }


//      // формирование списка запросов для batch
//      generatingRequests(method, params, start, total) {
//         let batch = [];                                     // список запросов
//         for (let ind=start; ind < total; ind += 50) {
//             let paramsStart = JSON.parse(JSON.stringify(params));
//             paramsStart.start = ind;
//             // формирование запроса
//             let req = {
//                 method,
//                 params: paramsStart
//             };
//             batch.push(req);
//         }    
//         return batch;
//     }

//     // формирование списка пакетов запросов batch 
//     splittingListRequests(requestsList){
//         let requestsBatch = [];                     // 
//         let batch = {};                             // пакет batch запросов
//         let count = 1;                              // текущее количество запросов в пакете batch запросов
//         for (let ind in requestsList) {
//             if (count > this.batchLength) {         // если количество запросов в пакете превысило лимит
//                 requestsBatch.push(batch);          // добавление пакета batch запросов 
//                 batch = {};
//                 count = 1
//             }
//             batch[ind] = requestsList[ind];         // добавление запроса в пакет batch
//             count++;                                // кол-во запросов в пакете batch
//         }
//         requestsBatch.push(batch);                  // добавление пакета batch запросов 
        
//         return requestsBatch;
//     }

// }

