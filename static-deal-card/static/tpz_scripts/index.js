import BitrixService from "./bx24/api.js";
import { TaskData } from "./data/task_data.js";
import { TaskAppInterface } from './interface/task_interface.js';


const ALLOWED_USERS = ['1', '255',];

class App {
    constructor(taskId, dealId, bx24) {
        this.taskId = taskId;
        this.dealId = dealId;
        this.bx24 = bx24;

        this.containerTask = document.querySelector('#taskContainer');
        this.btnEdit = document.querySelector('#btnEditTaskChanges');
        this.btnSave = document.querySelector('#btnSaveTaskChanges');
        this.btnCancel = document.querySelector('#btnCancelTaskChanges');
        this.btnTaskSettings = document.querySelector('#btnTaskSettings');
        
        this.dataManager = new TaskData(this.bx24);
        this.uiTask = new TaskAppInterface(this.containerTask, this.dataManager);

        this.initHandlers();
    }

    async init() {
        if (this.taskId) {
            await this.dataManager.initFromTask(this.taskId);
            if (this.taskId != this.dataManager.taskEstimate && this.taskId != this.dataManager.taskCommOffer) {
                throw new Error("Task not found");
            }
        } else {
            await this.dataManager.initFromDeal(this.dealId);
        }
        this.initSettings();
        this.uiTask.init();
        this.uiTask.render(false);
        BX24.fitWindow();
    }

    async update() {
        await this.dataManager.init();
        if (this.taskId && this.taskId != this.dataManager.taskEstimate && this.taskId != this.dataManager.taskCommOffer) {
            throw new Error("Task not found");
        }

        this.uiTask.render(false);
    }

    initHandlers() {
        this.btnEdit.addEventListener('click', this.handleEditChanges.bind(this));
        this.btnSave.addEventListener('click', this.handleSaveChanges.bind(this));
        this.btnCancel.addEventListener('click', this.handleCancelChanges.bind(this));
    }

    initSettings() {
        if (!ALLOWED_USERS.includes(String(this.dataManager.currentUser.ID))) {
            this.btnTaskSettings.remove();
            return;
        }
        this.btnTaskSettings.addEventListener('click', this.handleTaskSettings.bind(this));
    }

    async handleEditChanges(event) {
        this.uiTask.render(true);
        this.btnEdit.classList.add('d-none');
        this.btnSave.classList.remove('d-none');
    }

    async handleSaveChanges(event) {
        const target = event.target;
        const spinner = target.parentNode.querySelector(`.spinner`);
        spinner.classList.remove('d-none');
        const smartsData = this.getChangedData();

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
        this.btnSave.classList.add('d-none');
        this.btnEdit.classList.remove('d-none');
        this.uiTask.render(false);
        
    }

    async handleCancelChanges(event) {
        const target = event.target;
        const spinner = target.parentNode.querySelector(`.spinner`);
        spinner.classList.remove('d-none');

        await this.update();

        spinner.classList.add('d-none');
        this.btnSave.classList.add('d-none');
        this.btnEdit.classList.remove('d-none');
    }

    async handleTaskSettings(event) {
        const costOfFoodOld = await this.bx24.getOptions('costOfFood');
        const costOfFoodNew = prompt('Стоимость питания (руб./день)', costOfFoodOld || 0);
        if (costOfFoodNew) {
            await this.bx24.setOptions('costOfFood', costOfFoodNew);
        }

        const costOfLivingOld = await this.bx24.getOptions('costOfLiving');
        const costOfLivingNew = prompt('Стоимость проживания (руб./день)', costOfLivingOld || 0);
        if (costOfLivingNew) {
            await this.bx24.setOptions('costOfLiving', costOfLivingNew);
        }

        const costOfTravelOld = await this.bx24.getOptions('costOfTravel');
        const costOfTravelNew = prompt('Стоимость одного киллометра (руб./км.)', costOfTravelOld || 0);
        if (costOfTravelNew) {
            await this.bx24.setOptions('costOfTravel', costOfTravelNew);
        }
    }

    updateSources(sourceFilesData) {
        this.uiTask.setSourcesFilesData(sourceFilesData);
        this.dataManager.setSources(sourceFilesData);
    }

    getChangedData() {
        return this.dataManager.getChangedData();
    }
};


document.addEventListener("DOMContentLoaded", async () => {
    BX24.init(async () => {
        const bx24 = new BitrixService();
        await bx24.init();
        const app = new App(taskId, dealId, bx24);
        app.init();
    });
});
