import { TaskData } from "./data/task_data.js";
import { TaskAppInterface } from "./interface/interface_app.js";
import { TaskOfferInterface } from "./interface/interface_offer.js";
import { TaskOrderInterface } from "./interface/interface_order.js";
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
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
        console.log("init TaskManager - ok");
        await this.dataManager.init();        
        console.log("init TaskManager.dataManager - ok");
        this.uiApp.init();
        console.log("init TaskManager.uiApp - ok");
        this.uiOffer.init();
        this.uiOrder.init();
    }

    updateSources(sourceFilesData, sourceLinksData) {
        this.uiApp.setSourcesFilesData(sourceFilesData);
        this.uiApp.setSourcesLinksData(sourceLinksData);
        this.dataManager.setSources(sourceFilesData);
    }

    async update() {
        await this.dataManager.setActualData();
    }

    getChangedData() {
        return this.dataManager.getChangedData();
    }

    async createGroup() {
        this.dataManager.createGroup();
    }
}
