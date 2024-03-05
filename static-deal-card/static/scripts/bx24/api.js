import Bitrix24 from './requests.js';

import BatchMethods from './api_batch.js';
import BzProcessMethods from './api_bz_process.js';
import ContactMethods from './api_contact.js'
import DealMethods from './api_deal.js'
import SmartProcessMethods from './api_smart_process.js'
import TaskMethods from './api_task.js'
import UserMethods from './api_user.js'
// import FilesMethods from './api_file.js'
import FilesMethods from './api_file_webhook.js'

const URL = 'url';
export default class BitrixService {
    constructor() {
        
        this.bx24 = new Bitrix24();

        this.batch = new BatchMethods(this.bx24);
        this.bz = new BzProcessMethods(this.bx24);
        this.contact = new ContactMethods(this.bx24);
        this.deal = new DealMethods(this.bx24);
        this.smartProcess = new SmartProcessMethods(this.bx24);
        this.task = new TaskMethods(this.bx24);
        this.user = new UserMethods(this.bx24);
        // this.files = new FilesMethods(this.bx24);
        this.files = null;
        this.domain = null;
        this.webhook = null;
    }

    async init() {
        this.domain = await this.bx24.getDomain();
        this.api = await this.bx24.getAppOption(URL);
        this.files = new FilesMethods(this.api);
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
