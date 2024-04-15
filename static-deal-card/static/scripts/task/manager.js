import { TaskData } from "./data/task_data.js";
import { TaskAppInterface } from "./interface/interface_app.js";
import { TaskOfferInterface } from "./interface/interface_offer.js";
import { TaskOrderInterface } from "./interface/interface_order.js";
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_TECHOLOGY_TYPE_ID,
    SP_FILMS_ID,
    SP_WIDTH_ID,
    SP_LAMINATION_ID,
    SP_DEPENDENCE_ID,

    SP_WIDTH_FIELDS,
    SP_DEPENDENCE_FIELDS,
} from '../parameters.js';


export default class TaskManager {
    constructor(bx24, dealId) {
        this.bx24 = bx24;
        this.dealId = dealId;

        this.fieldGroup = null;
        this.fieldProduct = null;
        this.fieldTechnology = null;

        const containerApp = document.querySelector('#taskApplication');
        const containerOffer = document.querySelector('#taskOffer');
        const containerOrder = document.querySelector('#taksOrder');

        this.dataManager = new TaskData(this.bx24, this.dealId);
        this.uiApp = new TaskAppInterface(containerApp, this.dataManager);
        this.uiOffer = new TaskOfferInterface(containerOffer, this.dataManager);
        this.uiOrder = new TaskOrderInterface(containerOrder, this.dataManager);
    }

    async init() {
        await this.dataManager.init();

        this.uiApp.init();
        this.uiOffer.init();
        this.uiOrder.init();
    }

    updateSources(sourceFilesData, sourceLinksData) {
        this.uiApp.setSourcesFilesData(sourceFilesData);
        this.uiApp.setSourcesLinksData(sourceLinksData);
        this.dataManager.setSources(sourceFilesData);
    }

    async update() {
        const data = await this.getActualDataFromBx24();
        this.dataManager.setData(data.groups, data.products, data.technologies);
    }

    async getActualDataFromBx24() {
        const cmd = {
            [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
            [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
            [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
        };

        const data = await this.bx24.callBatchCmd(cmd);

        const groups = data?.[SP_GROUP_ID]?.items || [];
        const products = data?.[SP_PRODUCT_ID]?.items || [];
        const technologies = data?.[SP_TECHOLOGY_ID]?.items || [];

        return {
            groups: groups,
            products: products,
            technologies: technologies,
        };
    }

    getChangedData() {
        return this.dataManager.getChangedData();
    }

    async createGroup() {
        this.dataManager.createGroup();
    }
}
