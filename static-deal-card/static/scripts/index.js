import {
    FIELD_DEAL_RESPONSIBLE_MOP,
    FIELD_DEAL_RESPONSIBLE_MOS,
    FIELD_DEAL_OBSERVERS,
    FIELD_DEAL_ACTS_ID,
    FIELD_DEAL_INVOICES_ID,

    FIELD_DEAL_TASK_ESTIMATE,
    FIELD_DEAL_TASK_COMMERC_OFFER,
    FIELD_DEAL_TASK_ORDER,
    FIELD_DEAL_TASK_PAYMENT,
    FIELD_DEAL_TASK_PREPAYMENT,
} from './parameters.js';

import { TaskMenu } from './menu.js';

import DealDescription from './interface/deal_description.js';
import DealClients from './interface/deal_clients.js';
import DealState from './interface/deal_state.js';
import DealAmounts from './interface/deal_amoutns.js';
import DealWorkers from './interface/deal_workers.js';
import DealFinance from './interface/deal_finance.js';
import DealSources from './interface/deal_sources_new.js';
import DealDocs from './interface/deal_docs.js';
import DealActs from './interface/deal_acts.js';

import TaskManager from './task/manager.js';

import YaDisk from './storage/ya_disk.js';
import BitrixService from './bx24/api.js';

const FIELD_FOLDER_ACTS_ID = 'UF_FOLDER_ACTS';
const FIELD_FOLDER_INVOICES_ID = 'UF_FOLDER_INVOICES';

const SETTINGS__SECRETS_KEY = "yandex_secret_key";

class App {
    constructor(dealId, bx24, yaDisk) {
        this.dealId = dealId;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;

        const elemDealDesc = document.querySelector('.deal-desc');
        this.dealDesc = new DealDescription(elemDealDesc);

        const elemDealClients = document.querySelector('.deal-clients');
        this.dealClients = new DealClients(elemDealClients, this.bx24, this.dealId);

        const elemDealState = document.querySelector('.deal-state');
        this.dealState = new DealState(elemDealState, this.bx24, this.dealId);

        const elemDealAmounts = document.querySelector('.deal-amounts');
        this.dealAmounts = new DealAmounts(elemDealAmounts, this.bx24, this.dealId);

        const elemDealWorkers = document.querySelector('.deal-workers');
        this.dealWorkers = new DealWorkers(elemDealWorkers, this.bx24, this.dealId);

        const elemDealFinance = document.querySelector('.deal-finance');
        this.dealFinance = new DealFinance(elemDealFinance, this.bx24, this.dealId);

        const elemDealSources = document.querySelector('.deal-files');
        this.dealSources = new DealSources(elemDealSources, this.bx24, this.yaDisk, this.dealId);

        const elemDealDocs = document.querySelector('.deal-docs');
        this.dealDocs = new DealDocs(elemDealDocs, this.bx24, this.yaDisk, this.dealId);

        const elemDealActs = document.querySelector('.deal-acts');
        this.dealActs = new DealActs(elemDealActs, this.bx24, this.yaDisk, this.dealId, FIELD_DEAL_ACTS_ID, 'acts');

        const elemDealInvoices = document.querySelector('.deal-invoices');
        this.dealInvoices = new DealActs(elemDealInvoices, this.bx24, this.yaDisk, this.dealId, FIELD_DEAL_INVOICES_ID, 'invoices');

        this.taskData = new TaskManager(this.bx24, this.dealId);

        const elemTaskMenu = document.querySelector('#taskMenu');
        this.taskMenu = new TaskMenu(elemTaskMenu, this.bx24, this.dealId, this);
    }

    async init() {
        this.dealSources.addObserver(this.taskData);
        await Promise.all([
            this.createFolderYaDisk(),
            this.initData(),
            this.taskData.init(),
        ]);
        this.initHandlers();
        this.handleMutation();
        BX24.fitWindow();

    }

    async initData() {
        const cmd = {
            deal: `crm.deal.get?id=${this.dealId}`,
            contacts: `crm.deal.contact.items.get?id=${this.dealId}`,
            company: `crm.company.get?id=$result[deal][COMPANY_ID]`,
            company_contacts: `crm.company.contact.items.get?id=$result[deal][COMPANY_ID]`, 
            stage_history: `crm.stagehistory.list?entityTypeId=2&order[CREATED_TIME]=ASC&filter[OWNER_ID]=${this.dealId}`,
            sources: `crm.status.list?filter[ENTITY_ID]=SOURCE`,
            user_current: `user.current`,
            departments: `department.get`,
            fields: `crm.deal.fields`,
            taskEstimate: `tasks.task.get?taskId=$result[deal][${FIELD_DEAL_TASK_ESTIMATE}]`,
            taskCommercOffer: `tasks.task.get?taskId=$result[deal][${FIELD_DEAL_TASK_COMMERC_OFFER}]`,
            taskOrder: `tasks.task.get?taskId=$result[deal][${FIELD_DEAL_TASK_ORDER}]`,
            taskPayment: `tasks.task.get?taskId=$result[deal][${FIELD_DEAL_TASK_PAYMENT}]&select[]=ID&select[]=TITLE&select[]=CREATED_DATE&select[]=CHANGED_DATE&select[]=CLOSED_DATE&select[]=STATUS`,
            taskPrepayment: `tasks.task.get?taskId=$result[deal][${FIELD_DEAL_TASK_PREPAYMENT}]&select[]=ID&select[]=TITLE&select[]=CREATED_DATE&select[]=CHANGED_DATE&select[]=CLOSED_DATE&select[]=STATUS`,
        };

        const resBatch = await this.bx24.batch.getData(cmd);

        const dealData          = resBatch?.deal;
        const contactsData      = resBatch?.contacts || [];
        const companyData       = resBatch?.company || {};
        const companyContacts   = resBatch?.company_contacts || [];
        const stageHistory      = resBatch?.stage_history;
        const dealSources       = resBatch?.sources;
        const userCurrent       = resBatch?.user_current;
        const departments       = resBatch?.departments;
        const fieldsDeal        = resBatch?.fields;

        const taskEstimate      = resBatch?.taskEstimate?.task;
        const taskCommercOffer  = resBatch?.taskCommercOffer?.task;
        const taskOrder         = resBatch?.taskOrder?.task;
        const taskPayment       = resBatch?.taskPayment?.task;
        const taskPrepayment    = resBatch?.taskPrepayment?.task;
        this.userCurrent = userCurrent;

        await this.dealDesc.init(dealData, dealSources);
        await this.dealClients.init(companyData, companyContacts, contactsData);
        await this.dealState.init(dealData, stageHistory);
        await this.dealAmounts.init(dealData);
        await this.dealWorkers.init(dealData, departments);
        await this.dealFinance.init(dealData, fieldsDeal);
        await this.dealSources.init(dealData);
        await this.dealDocs.init(dealData);
        await this.dealActs.init(dealData?.[FIELD_DEAL_ACTS_ID], FIELD_DEAL_ACTS_ID);
        await this.dealInvoices.init(dealData?.[FIELD_DEAL_INVOICES_ID], FIELD_DEAL_INVOICES_ID);
        await this.taskMenu.init(dealData, taskEstimate, taskCommercOffer, taskOrder, taskPayment, taskPrepayment, this.userCurrent?.ID);
    }

    initHandlers() {
        // сохранение измененных данных
        document.addEventListener('click', async (event) => {
            const target = event.target;
            const button = target.closest('.task-container__menu-save-task');
            if (button) {
                const spinner = button.querySelector(`.spinner`);
                spinner.classList.remove('d-none');
                const dealDesc = this.dealDesc.getChangedData();
                const dealWorkers = this.dealWorkers.getChangedData();
                const dealSources = this.dealSources.getChangedData();
                const dealDocs = this.dealDocs.getChangedData();
                const dealActs = this.dealActs.getChangedData();
                const dealInvoices = this.dealInvoices.getChangedData();
                const dealFinance = this.dealFinance.getChangedData();

                const dealData = {...dealDesc, ...dealWorkers, ...dealSources, ...dealDocs, ...dealActs, ...dealInvoices, ...dealFinance};
                let smartsData = this.taskData.getChangedData();
                
                // Обновляем сделку
                let res = await this.bx24.deal.update({
                    id: this.dealId,
                    fields: dealData,
                    params: { "REGISTER_SONET_EVENT": "Y" }
                });

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
                    const resBatch = await this.bx24.batch.call(batch);
                    console.log("resBatch = ", resBatch);
                }

                spinner.classList.add('d-none');
            }
        })

        // добавление группы товаров
        document.addEventListener('click', async (event) => {
            const target = event.target;
            const button = target.closest('.task-container__menu-add-group');

            if (button) {
                const spinner = button.querySelector(`.spinner`);
                spinner.classList.remove('d-none');
                await this.taskData.createGroup();
                spinner.classList.add('d-none');
            }
        })

        // отменить изменения
        document.addEventListener('click', async (event) => {
            const target = event.target;
            const button = target.closest('.task-container__menu-cancel-task');

            if (button) {
                const spinner = button.querySelector(`.spinner`);
                spinner.classList.remove('d-none');
                await this.initData();
                this.taskData.update();
                spinner.classList.add('d-none');
            }
        })
    }

    async createFolderYaDisk() {
        const pathStorage = [
            [`${this.dealId}/sources`],
            [`${this.dealId}/docs`],
            [`${this.dealId}/acts`],
            [`${this.dealId}/invoices`],
        ];

        const createDirRes = await this.yaDisk.createDir(this.dealId);
        const results = await Promise.all(pathStorage.map(path => this.yaDisk.createDir(path)));
    }

    handleMutation() {
        const targetNode = document.querySelector('#taskContainer');
        const observer = new MutationObserver((mutationsList, observer) => {
            BX24.fitWindow();
        });
        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    BX24.init(async function() {
        const bx24 = new BitrixService();
        let secretKeyYandex = await BX24.appOption.get(SETTINGS__SECRETS_KEY);
        const yaDisk = new YaDisk(secretKeyYandex);
        bx24.init();
        const app = new App(dealId, bx24, yaDisk);
        app.init();
    });
});
