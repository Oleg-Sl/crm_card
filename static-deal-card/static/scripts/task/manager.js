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
        // const data = await this.getActualDataFromBx24();
        // this.dataManager.setData(data.groups, data.products, data.technologies);
        this.dataManager.setActualData();
    }

    // async getActualDataFromBx24() {
    //     const cmd = {
    //         [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
    //         [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
    //         [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
    //     };

    //     // const data = await this.bx24.callBatchCmd(cmd);
    //     const response = await this.bx24.callMethod('batch', {
    //         halt: 0,
    //         cmd: cmd,
    //     });
    //     let {productsRemain, technologiesRemain} = await this.getAllTechnologyData(response?.result_total);
        
    //     const data = response?.result;
    //     const groups = data?.[SP_GROUP_ID]?.items || [];
    //     const products = data?.[SP_PRODUCT_ID]?.items || [] + productsRemain;
    //     const technologies = data?.[SP_TECHOLOGY_ID]?.items || [] + technologiesRemain;
    //     console.log("products = ", products);
    //     console.log("technologies = ", technologies);
    //     return {
    //         groups: groups,
    //         products: products,
    //         technologies: technologies,
    //     };
    // }

    // async getAllTechnologyData(totals) {
    //     let cmd = {};
    //     let products = [];
    //     let technologies =[];
    //     if (SP_PRODUCT_ID in totals) {
    //         for (let i = 50; i < totals[SP_PRODUCT_ID]; i += 50) {
    //             cmd[`${SP_PRODUCT_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}&start=${i}`;
    //         }
    //     }
    //     if (SP_TECHOLOGY_ID in totals) {
    //         for (let i = 50; i < totals[SP_TECHOLOGY_ID]; i += 50) {
    //             cmd[`${SP_TECHOLOGY_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}&start=${i}`;
    //         }
    //     }

    //     const response = await this.bx24.callMethod('batch', {
    //         halt: 0,
    //         cmd: cmd,
    //     });

    //     for (const key in response?.result) {
    //         if (key.startsWith(SP_PRODUCT_ID)) {
    //             const productData = response?.result[key]?.items;
    //             products = products.concat(productData);
    //         } else if (key.startsWith(SP_TECHOLOGY_ID)) {
    //             const technologyData = response?.result[key]?.items;
    //             technologies = technologies.concat(technologyData);
    //         }
    //     }
    //     return {
    //         productsRemain: products,
    //         technologiesRemain: technologies
    //     };
    // }

    getChangedData() {
        return this.dataManager.getChangedData();
    }

    async createGroup() {
        this.dataManager.createGroup();
    }
}
