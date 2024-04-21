import BitrixService from "./bx24/api.js";
import { TaskData } from "./data/task_data.js";
import { TaskAppInterface } from './interface/task_interface.js';


class App {
    constructor(taskId, dealId, bx24) {
        this.taskId = taskId;
        this.dealId = dealId;
        this.bx24 = bx24;

        this.containerTask = document.querySelector('#taskContainer');
        this.btnEdit = document.querySelector('#btnEditTaskChanges');
        this.btnSave = document.querySelector('#btnSaveTaskChanges');
        this.btnCancel = document.querySelector('#btnCancelTaskChanges');
        
        // this.dataManager = new TaskData(this.bx24, this.taskId);
        this.dataManager = new TaskData(this.bx24);
        this.uiTask = new TaskAppInterface(this.containerTask, this.dataManager);

        this.initHandlers();
    }

    async init() {
        if (this.taskId) {
            await this.dataManager.initFromTask(this.taskId);
        } else {
            await this.dataManager.initFromDeal(this.dealId);
        }
        if (this.taskId != this.dataManager.taskEstimate && this.taskId != this.dataManager.taskCommOffer) {
            throw new Error("Task not found");
        }

        this.uiTask.init();
        this.uiTask.render(false);
        BX24.fitWindow();
    }

    async update() {
        await this.dataManager.init();
        if (this.taskId != this.dataManager.taskEstimate && this.taskId != this.dataManager.taskCommOffer) {
            throw new Error("Task not found");
        }

        this.uiTask.render(false);
    }

    initHandlers() {
        this.btnEdit.addEventListener('click', this.handleEditChanges.bind(this));
        this.btnSave.addEventListener('click', this.handleSaveChanges.bind(this));
        this.btnCancel.addEventListener('click', this.handleCancelChanges.bind(this));
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
