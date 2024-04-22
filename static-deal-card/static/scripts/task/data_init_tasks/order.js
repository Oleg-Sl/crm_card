import {
    FIELD_DEAL_TITLE,
    FIELD_DEAL_ORDER_NUMBER,
} from '../../parameters.js';import { TaskTemaplateBase } from './base.js';

const RESPONSIBLE_ID = 255;


export class TaskOrderBody extends TaskTemaplateBase {
    getTaskData(dataObject) {
        const dealDesc = dataObject.dealDesc.getChangedData();
        const userMosId = dataObject.dealWorkers.getMos();
        const userMopId = dataObject.dealWorkers.getMop();
        const userObserversIds = dataObject.dealWorkers.getObservers();
        const userCurrentId = dataObject.userCurrent.ID;

        let fields = {
            TITLE: `🎰 | ${dealDesc[FIELD_DEAL_ORDER_NUMBER] || ""} | ${dealDesc[FIELD_DEAL_TITLE] || ""} | Заказ`,
            CREATED_BY: dataObject.userCurrent.ID,
            RESPONSIBLE_ID: userMosId || userCurrentId,
            AUDITORS: userObserversIds,
            DESCRIPTION: this.getBody(dataObject),
            UF_CRM_TASK: [`D_${dataObject.dealId}`]
        };
        return fields;
    }

//     getBody(dataObject) {
//         return `Описание Заказа (Что делаем, сколько, требования, особенности)
// ${this.getDescriptionOrder(dataObject)}
// ${this.getDealData(dataObject)}
// ${this.getMedia(dataObject)}

//         `;
//     }
}
