
const WEBHOOK = "https://007.bitrix24.ru/rest/255/y68dho0vjxn8pstg/";


export default class Bitrix24 {
    constructor() {
        // this.webhook = WEBHOOK;

        this.debugMode = true;
        this.batchLength = 50;      // Максимальное количество запросов в пакете
    }

    setWebhook(webhook) {
        this.webhook = webhook;
    }

    logError(message) {
        if (this.debugMode) {
            console.error(message);
        }
    }

    async getAppOption(key) {
        const result = await BX24.appOption.get(key);
        return result;
    }

    async callMethod(method, params = {}) {
        try {
            const response = await fetch(`${this.webhook}${method}`,  {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(params)
            });

            let result = await response.json();
            if (response.status !== 200) {
                const errorMessage = `${response.error()} (callMethod ${method}: ${JSON.stringify(params)})`;
                this.logError(errorMessage);
                return null;
            }
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
            let result = await new Promise((resolve, reject) => {
                BX24.callBatch(reqPackage, response => {
                    const responseData = {};
                    
                    for (let key in response) {
                        const res = response[key]
                        if (res.status !== 200 || res.error()) {
                            this.logError(`${res.error()} (method ${reqPackage[key].method}: ${JSON.stringify(reqPackage[key].params)})`);
                            continue;
                        }

                        responseData[key] = res.data();
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
