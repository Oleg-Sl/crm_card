import BitrixService from "./bx24/api.js";
import { TaskData } from "./task_data.js";
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_TECHOLOGY_TYPE_ID,
    SP_FILMS_ID,
    SP_WIDTH_ID,
    SP_LAMINATION_ID,
    SP_DEPENDENCE_ID,

    // SP_GROUP_FIELDS,
    // SP_PRODUCT_FIELDS,
    // SP_TECHOLOGY_FIELDS,

    SP_WIDTH_FIELDS,
    SP_DEPENDENCE_FIELDS,

    // FIELD_DEAL_RESPONSIBLE_MOP,
    // FIELD_DEAL_RESPONSIBLE_MOS,
    // FIELD_DEAL_OBSERVERS,
    // FIELD_DEAL_ACTS_ID,
    // FIELD_DEAL_INVOICES_ID,

    // FIELD_DEAL_TASK_ESTIMATE,
    // FIELD_DEAL_TASK_COMMERC_OFFER,
    // FIELD_DEAL_TASK_ORDER,
    // FIELD_DEAL_TASK_PAYMENT,
    // FIELD_DEAL_TASK_PREPAYMENT,

    FIELD_DEAL_TASK_ESTIMATE,
    FIELD_DEAL_TASK_COMMERC_OFFER,

} from './parameters.js';
import { TaskEstimateAppInterface } from './interface/estimate.js';
import { TaskOrderAppInterface } from './interface/order.js';
import { TemplatesOrderTask } from './templates/task_order.js';
import { TemplatesEstimateTask } from './templates/task_estimate.js';


class App {
    constructor(taskId, bx24) {
        this.taskId = taskId;
        this.bx24 = bx24;

        this.dataManager = new TaskData(this.bx24, this.dealId);

        this.containerTask = document.querySelector('#taskContainer');
        this.btnSave = document.querySelector('#btnSaveTaskChanges');
        this.btnCancel = document.querySelector('#btnCancelTaskChanges');
        this.uiTask = null;

        this.dealId = null;
    }

    async init() {
        const taskData = await this.getTaskData();
        this.dealId = this.extractNumberFromArray(taskData?.ufCrmTask);
        if (!this.dealId) {
            throw new Error("Deal id not found");
        }
        
        this.initData();
        this.initHandlers();
    }

    async initData() {
        const data = await this.getDealData();

        this.deal = data?.deal || {};
        const taskEstimate = this.deal?.[FIELD_DEAL_TASK_ESTIMATE];
        const taskCommOffer = this.deal?.[FIELD_DEAL_TASK_COMMERC_OFFER];

        if (this.taskId == taskEstimate) {
            this.uiTask = new TaskEstimateAppInterface(this.containerTask, this.dataManager, new TemplatesEstimateTask());
        } else if (this.taskId == taskCommOffer) {
            this.uiTask = new TaskOrderAppInterface(this.containerTask, this.dataManager, new TemplatesOrderTask());
            // console.log("taskCommOffer = ", this.containerTask.querySelectorAll('input'));
            // this.containerTask.classList.add('unmodified');
            // this.containerTask.querySelectorAll('input').forEach(input => input.disabled = true);
        } else {
            throw new Error("Task not found");
        }

        this.uiTask.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        this.uiTask.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);

        this.dataManager.setSmartFields(data.fieldGroup, data.fieldProduct, data.fieldTechnology);
        this.dataManager.setMaterialsData(data.dependencesMaterial, data.technologiesTypes, data.films, data.widths, data.laminations);
        this.dataManager.setData(data.groups, data.products, data.technologies);
        
        // this.uiTask.setAtributInputs();
    }

    initHandlers() {
        // сохранение измененных данных
        this.btnSave.addEventListener('click', async (event) => {
            const target = event.target;
            const spinner = target.parentNode.querySelector(`.spinner`);
            spinner.classList.remove('d-none');
            const smartsData = this.getChangedData();
            // Обновляем товары
            let batch = {};
            for (let smart of smartsData) {
                batch[`${smart.entityTypeId}_${smart.entityId}`] = {
                    method: "crm.item.update",
                    params: {
                        entityTypeId: smart.entityTypeId,
                        id: smart.entityId,
                        fields: smart
                    }
                }
            }

            if (Object.keys(batch).length > 0) {
                const resBatch = await this.bx24.callBatchJson(batch);
                console.log("resBatch = ", resBatch);
            }

            spinner.classList.add('d-none');
        })

        // отменить изменения
        this.btnCancel.addEventListener('click', async (event) => {
            const target = event.target;
            // const spinner = target.parentNode.querySelector(`.spinner`);
            // spinner.classList.remove('d-none');
            await this.initData();
            // spinner.classList.add('d-none');
        })
    }

    updateSources(sourceFilesData) {
        this.uiTask.setSourcesFilesData(sourceFilesData);
        this.dataManager.setSources(sourceFilesData);
    }

    async getTaskData() {
        const responseTask = await this.bx24.callMethod("tasks.task.get", {
            taskId: this.taskId,
            select: ['ID', 'TITLE', 'UF_CRM_TASK']
        });
        return responseTask?.result?.task;
    }

    async getDealData() {
        const cmd = {
            deal: `crm.deal.get?id=${this.dealId}`,

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
        const response = await this.bx24.callMethod("batch.json", {
            halt: 0,
            cmd: cmd
        });
        const data = response?.result?.result;
        
        const deal = data?.deal;
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
            deal: deal,

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

    extractNumberFromArray(arr) {
        for (let item of arr) {
            if (item.startsWith('D_')) {
                const number = parseInt(item.substring(2));
                if (!isNaN(number)) {
                    return number;
                }
            }
        }
        return null;
    }

};


document.addEventListener("DOMContentLoaded", () => {
    // BX24.init(async function() {
        const taskIdEstimate = 74117;
        const taskIdCommercOffer = 74193;
        const bx24 = new BitrixService();
        bx24.init();
        // const app = new App(taskIdEstimate, bx24);
        const app = new App(taskIdCommercOffer, bx24);
        app.init();
    // });
});




