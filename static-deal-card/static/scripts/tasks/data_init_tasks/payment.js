import {
    FIELD_DEAL_TITLE,
    FIELD_DEAL_ORDER_NUMBER,
} from '../../parameters.js';import { TaskTemaplateBase } from './base.js';

const RESPONSIBLE_ID = 255;


export class TaskPaymentBody extends TaskTemaplateBase {

    getTaskData(dataObject) {
        const dealDesc = dataObject.dealDesc.getChangedData();
        let fields = {
            TITLE: `🎰 | ${dealDesc[FIELD_DEAL_ORDER_NUMBER] || ""} | ${dealDesc[FIELD_DEAL_TITLE] || ""} | Счет на оплату`,
            CREATED_BY: dataObject.userCurrent.ID,
            RESPONSIBLE_ID: RESPONSIBLE_ID,
            DESCRIPTION: this.getBody(dataObject),
            UF_CRM_TASK: [`D_${dataObject.dealId}`]
        };
        return fields;
    }

    getBody(dataObject) {
        return `Описание Заказа (Что делаем, сколько, требования, особенности)
${this.getDescriptionOrder(dataObject)}
${this.getDealData(dataObject)}
${this.getSources(dataObject)}
${this.getDocs(dataObject)}
        `;
    }
}
