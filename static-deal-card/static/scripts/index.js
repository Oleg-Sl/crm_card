import { DEAL, SOURCE, COMPANY, COMPANY_CONTACTS, CONTACT_DATA, STAGE_HISTORY, USERS, } from './test_data.js';
import {
    FIELD_DEAL_RESPONSIBLE_MOP,
    FIELD_DEAL_RESPONSIBLE_MOS,
    FIELD_DEAL_OBSERVERS,
    FIELD_DEAL_ACTS_ID,
    FIELD_DEAL_INVOICES_ID,

} from './parameters.js';

import DealDescription from './interface/deal_description.js';
import DealClients from './interface/deal_clients.js';
import DealState from './interface/deal_state.js';
import DealAmounts from './interface/deal_amoutns.js';
import DealWorkers from './interface/deal_workers.js';
import DealFinance from './interface/deal_finance.js';
import DealSources from './interface/deal_sources.js';
import DealDocs from './interface/deal_docs.js';
import DealActs from './interface/deal_acts.js';

import TaskManager from './tasks/task_manager.js';

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
        this.dealActs = new DealActs(elemDealActs, this.bx24, this.yaDisk, this.dealId, FIELD_DEAL_ACTS_ID);

        const elemDealInvoices = document.querySelector('.deal-invoices');
        this.dealInvoices = new DealActs(elemDealInvoices, this.bx24, this.yaDisk, this.dealId, FIELD_DEAL_INVOICES_ID);

        const elemTasks = document.querySelector('#taskContainer');
        this.tasks = new TaskManager(elemTasks, this.bx24, 797); 

    }


    async init() {
//        const dealId = 797;

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
        };

        const resBatch = await this.bx24.batch.getData(cmd);

        const dealData          = resBatch?.result?.deal;
        const contactsData      = resBatch?.result?.contacts;
        const companyData       = resBatch?.result?.company;
        const companyContacts   = resBatch?.result?.company_contacts;
        const stageHistory      = resBatch?.result?.stage_history;
        const dealSources       = resBatch?.result?.sources;
        const userCurrent       = resBatch?.result?.user_current;
        const departments       = resBatch?.result?.departments;
        const fieldsDeal        = resBatch?.result?.fields;

        console.log("dealData = ", dealData);
        console.log("contactsData = ", contactsData);
        console.log("companyData = ", companyData);
        console.log("companyContacts = ", companyContacts);
        console.log("stageHistory = ", stageHistory);
        console.log("dealSources = ", dealSources);
        console.log("userCurrent = ", userCurrent);
        console.log("departments = ", departments);
        console.log("fieldsDeal = ", fieldsDeal);

        this.dealDesc.init(dealData, dealSources);
        this.dealClients.init(companyData, companyContacts, contactsData);
        this.dealState.init(dealData, stageHistory);
        this.dealAmounts.init(dealData);
        this.dealWorkers.init(dealData, departments);
        this.dealFinance.init(dealData, fieldsDeal);
        this.dealSources.init(dealData);
        this.dealDocs.init(dealData);
        this.dealActs.init(dealData?.[FIELD_DEAL_ACTS_ID], FIELD_DEAL_ACTS_ID);
        this.dealInvoices.init(dealData?.[FIELD_DEAL_INVOICES_ID], FIELD_DEAL_INVOICES_ID);
        this.tasks.init();

        this.initHandlers();
    }

    initHandlers() {
        document.addEventListener('click', async (event) => {
            const target = event.target;
            if (target.classList.contains('task-container__menu-save-task')) {
                let dealDesc = this.dealDesc.getChangedData();
                let dealWorkers = this.dealWorkers.getChangedData();
                let dealSources = this.dealSources.getChangedData();
                let dealDocs = this.dealDocs.getChangedData();
                let dealActs = this.dealActs.getChangedData();
                let dealInvoices = this.dealInvoices.getChangedData();
                let dealFinance = this.dealFinance.getChangedData();

                const dealData = {...dealDesc, ...dealWorkers, ...dealSources, ...dealDocs, ...dealActs, ...dealInvoices, ...dealFinance};

                let smartsData = this.tasks.getChangedData();

                let res = await this.bx24.deal.update({
                    id: this.dealId,
                    fields: dealData,
                    params: { "REGISTER_SONET_EVENT": "Y" }
                });
            }
        })
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
