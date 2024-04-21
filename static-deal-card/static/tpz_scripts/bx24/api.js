import Bitrix24 from './requests.js'


const URL = 'url';


export default class BitrixService {
    constructor() {
        this.bx24 = new Bitrix24();

        this.files = null;
        this.domain = null;
    }

    async init() {
        this.domain = await this.bx24.getDomain();
        this.webhook = await this.bx24.getAppOption(URL);
        this.bx24.setWebhook(this.webhook);
    }

    async callMethod(method, body) {
        if (!method || !body || Object.keys(body).length === 0) {
            return null;
        }
        try {
            let data = await this.bx24.callMethod(method, body);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async callBatchCmd(cmd) {
        const result = await this.bx24.callMethod('batch', {
            halt: 0,
            cmd: cmd
        });

        return result?.result;
    }

    async callBatchJson(batch) {
        let data = await this.bx24.batchMethod(batch);
        return data;
    }

    async getOptions(key) {
        await this.bx24.getSettingsAppByKey(key);
    }

    async setOptions(key, value) {
        await this.bx24.setSettingsAppByKey(key, value);
    }

    makeCall(phoneNumber) {
        this.bx24.makeCall(phoneNumber);
    }

    openLine(openLineId) {
        this.bx24.openLine(openLineId);
    }

    async openPath(path) {
        await this.bx24.openPath(path);
    }

    getUrlSendMessageFromDealId(dealId) {
        return `https://${this.domain}/bitrix/components/bitrix/crm.activity.planner/slider.php?context=deal-${dealId}&ajax_action=ACTIVITY_EDIT&activity_id=0&TYPE_ID=4&OWNER_ID=${dealId}&OWNER_TYPE=DEAL&OWNER_PSID=0&FROM_ACTIVITY_ID=0&MESSAGE_TYPE=&SUBJECT=&BODY=&=undefined&__post_data_hash=-1046067848&IFRAME=Y&IFRAME_TYPE=SIDE_SLIDER`;
    }

    async getAppOption(key) {
        return await this.bx24.getAppOption(key);
    }
}
