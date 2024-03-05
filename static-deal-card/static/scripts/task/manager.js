import { TaskData } from "./task_data.js";
import { TaskAppInterface } from "./interface_app.js";
import { TaskOfferInterface } from "./interface_offer.js";
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_TECHOLOGY_TYPE_ID,
    SP_FILMS_ID,
    SP_WIDTH_ID,
    SP_LAMINATION_ID,
    SP_DEPENDENCE_ID,

    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,

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

        this.dataManager = new TaskData(this.bx24, this.dealId);

        const containerApp = document.querySelector('#taskApplication');
        const containerOffer = document.querySelector('#taskOffer');
        const containerOrder = document.querySelector('#taskOffer');
        console.log("containerApp = ", containerApp);
        console.log("containerOffer = ", containerOffer);
        this.uiApp = new TaskAppInterface(containerApp, this.dataManager);
        this.uiOffer = new TaskOfferInterface(containerOffer, this.dataManager);
        // this.uiOrder = new TaskOfferInterface(containerOrder, this.dataManager);

    }

    async init() {
        const data = await this.getDataFromBx24();
        console.log("task init data = ", data);
        
        this.uiApp.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        this.uiOffer.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        // this.uiOrder.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        
        this.uiApp.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);        
        this.uiOffer.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);        
        // this.uiOrder.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);        
        
        this.dataManager.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        this.dataManager.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);        
        
        this.dataManager.setData(data.groups, data.products, data.technologies);

        this.update();

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

    async getDataFromBx24() {
        const cmd = {
            fieldGroup: `crm.item.fields?entityTypeId=${SP_GROUP_ID}`,
            fieldProduct: `crm.item.fields?entityTypeId=${SP_PRODUCT_ID}`,
            fieldTechnology: `crm.item.fields?entityTypeId=${SP_TECHOLOGY_ID}`,

            [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
            [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
            [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
           
            [SP_TECHOLOGY_TYPE_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_TYPE_ID}&select[]=id&select[]=title`,
            [SP_FILMS_ID]: `crm.item.list?entityTypeId=${SP_FILMS_ID}&select[]=id&select[]=title`,
            [SP_WIDTH_ID]: `crm.item.list?entityTypeId=${SP_WIDTH_ID}&select[]=id&select[]=title&select[]=${SP_WIDTH_FIELDS.value}`,
            [SP_LAMINATION_ID]: `crm.item.list?entityTypeId=${SP_LAMINATION_ID}&select[]=id&select[]=title`,
            [SP_DEPENDENCE_ID]: `crm.item.list?entityTypeId=${SP_DEPENDENCE_ID}&select[]=id&select[]=title&select[]=${SP_DEPENDENCE_FIELDS.film}&select[]=${SP_DEPENDENCE_FIELDS.laminations}&select[]=${SP_DEPENDENCE_FIELDS.widths}`,
        };
        // const d = {
        //     fieldGroup: `crm.item.fields?entityTypeId=164`,
        //     fieldProduct: `crm.item.fields?entityTypeId=186`,
        //     fieldTechnology: `crm.item.fields?entityTypeId=137`,

        //     164: `crm.item.list?entityTypeId=164&filter[parentId2]=14305`,
        //     186: `crm.item.list?entityTypeId=186&filter[parentId2]=14305`,
        //     137: `crm.item.list?entityTypeId=137&filter[parentId2]=14305`,
           
        //     188: `crm.item.list?entityTypeId=188&select[]=id&select[]=title`,
        //     172: `crm.item.list?entityTypeId=172&select[]=id&select[]=title`,
        //     157: `crm.item.list?entityTypeId=157&select[]=id&select[]=title&select[]=ufCrm43_1709380138`,
        //     131: `crm.item.list?entityTypeId=131&select[]=id&select[]=title`,
        //     189: `crm.item.list?entityTypeId=189&select[]=id&select[]=title&select[]=ufCrm33_1709568884&select[]=ufCrm33_1709222893&select[]=ufCrm33_1709370111`,
        // }

        const data = await this.bx24.callBatchCmd(cmd);
        console.log("task data = ", data);

        const fieldGroup = data?.fieldGroup?.fields;
        const fieldProduct = data?.fieldProduct?.fields;
        const fieldTechnology = data?.fieldTechnology?.fields;

        const groups = data?.[SP_GROUP_ID]?.items || [];
        const products = data?.[SP_PRODUCT_ID]?.items || [];
        const technologies = data?.[SP_TECHOLOGY_ID]?.items || [];

        const technologiesType = data?.[SP_TECHOLOGY_TYPE_ID]?.items || [];
        const films = data?.[SP_FILMS_ID]?.items || [];
        const widths = data?.[SP_WIDTH_ID]?.items || [];
        const laminations = data?.[SP_LAMINATION_ID]?.items || [];
        const dependenceMaterial = data?.[SP_DEPENDENCE_ID]?.items || [];

        return {
            fieldGroup: fieldGroup,
            fieldProduct: fieldProduct,
            fieldTechnology: fieldTechnology,

            groups: groups,
            products: products,
            technologies: technologies,

            technologiesTypes: technologiesType,
            films: films,
            widths: widths,
            laminations: laminations,
            dependencesMaterial: dependenceMaterial,
        };
    }

    getChangedData() {
        return this.dataManager.getChangedData();
    }

    async createGroup() {
        this.dataManager.createGroup();
    }
}
