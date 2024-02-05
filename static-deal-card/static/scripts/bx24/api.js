import Bitrix24 from './requests.js';

import BatchMethods from './api_batch.js';
import BzProcessMethods from './api_bz_process.js';
import ContactMethods from './api_contact.js'
import DealMethods from './api_deal.js'
import SmartProcessMethods from './api_smart_process.js'
import TaskMethods from './api_task.js'
import UserMethods from './api_user.js'


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

        this.domain = null;
    }

    async init() {
        this.domain = await this.bx24.getDomain();
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
}
