import { TaskEstimateBody } from './tasks/data_init_tasks/estiimate.js';
import { TaskCommercOfferBody } from './tasks/data_init_tasks/commercial_offer.js';
import { TaskOrderBody } from './tasks/data_init_tasks/order.js';
import { TaskPaymentBody } from './tasks/data_init_tasks/payment.js';
import { TaskPrepaymentBody } from './tasks/data_init_tasks/prepayment.js';
import {
    FIELD_DEAL_TASK_ESTIMATE,
    FIELD_DEAL_TASK_COMMERC_OFFER,
    FIELD_DEAL_TASK_ORDER,
    FIELD_DEAL_TASK_PAYMENT,
    FIELD_DEAL_TASK_PREPAYMENT,
} from './parameters.js';


export class TaskMenu {
    constructor(container, bx24, dealId, data) {
        this.container = container;
        this.bx24 = bx24;
        this.dealId = dealId;
        this.dataObject = data;

        this.fields = [
            FIELD_DEAL_TASK_ESTIMATE,
            FIELD_DEAL_TASK_COMMERC_OFFER,
            FIELD_DEAL_TASK_ORDER,
            FIELD_DEAL_TASK_PAYMENT,
            FIELD_DEAL_TASK_PREPAYMENT,
        ];
        this.buttons = {
            createEstimate: this.container.querySelector('#btnCreateTaskEstimate'),
            updateEstimate: this.container.querySelector('#btnUpdateTaskEstimate'),
            createCommercOffer: this.container.querySelector('#btnCreateTaskCommercOffer'),
            updateCommercOffer: this.container.querySelector('#btnUpdateTaskCommercOffer'),
            createOrder: this.container.querySelector('#btnCreateTaskOrder'),
            updateOrder: this.container.querySelector('#btnUpdateTaskOrder'),
            createPayment: this.container.querySelector('#btnCreateTaskPayment'),
            createPrepayment: this.container.querySelector('#btnCreateTaskPrepayment')
        };
        this.task = {
            estimate: null,
            commercOffer: null,
            order: null,
            payment: null,
            prepayment: null
        };

        this.initHandlers();
    }

    init(dealData, taskEstimate, taskCommercOffer, taskOrder, taskPayment, taskPrepayment) {
        this.dealData = dealData;
        this.task.estimate = taskEstimate;
        this.task.commercOffer = taskCommercOffer;
        this.task.order = taskOrder;
        this.task.payment = taskPayment;
        this.task.prepayment = taskPrepayment;
        this.displayTaskStates();
    }

    initHandlers() {
        console.log('initHandlers');
        this.buttons.createEstimate.addEventListener('click', this.createTask.bind(this, FIELD_DEAL_TASK_ESTIMATE, new TaskEstimateBody(),  "estimate"));
        this.buttons.createCommercOffer.addEventListener('click', this.createTask.bind(this, FIELD_DEAL_TASK_COMMERC_OFFER, new TaskCommercOfferBody(), "commercOffer"));
        this.buttons.createOrder.addEventListener('click', this.createTask.bind(this, FIELD_DEAL_TASK_ORDER, new TaskOrderBody(), "order"));
        this.buttons.createPayment.addEventListener('click', this.createTask.bind(this, FIELD_DEAL_TASK_PAYMENT, new TaskPaymentBody(), "payment"));
        this.buttons.createPrepayment.addEventListener('click', this.createTask.bind(this, FIELD_DEAL_TASK_PREPAYMENT, new TaskPrepaymentBody(), "prepayment"));

        this.buttons.updateEstimate.addEventListener('click', this.updateTask.bind(this, FIELD_DEAL_TASK_ESTIMATE, new TaskEstimateBody(),  "estimate"));
        this.buttons.updateCommercOffer.addEventListener('click', this.updateTask.bind(this, FIELD_DEAL_TASK_COMMERC_OFFER, new TaskCommercOfferBody(), "commercOffer"));
        this.buttons.updateOrder.addEventListener('click', this.updateTask.bind(this, FIELD_DEAL_TASK_ORDER, new TaskOrderBody(), "order"));
    }

    async createTask(field, objTaskBody, taskType, event) {
        const target = event.target;
        const container = target.closest('.task-container__activities-rows');

        if (!this.task[taskType]) {
            this.showCreatingProcess(container);
            const fields = objTaskBody.getTaskData(this.dataObject);
            const result = await this.bx24.task.create(fields)
            const taskId = result?.task?.id;
            this.task[taskType] = result?.task;
            this.bx24.deal.update({
                id: this.dealId,
                fields: { [field]: taskId },
            });
            this.showCompletedCreating(container);
        }
    }

    async updateTask(field, objTaskBody, taskType, event) {
        const target = event.target;
        console.log(taskType, this.task[taskType]);
        const container = target.closest('.task-container__activities-rows');
        if (this.task[taskType]) {
            this.showUpdatingProcess(container);
            const fields = objTaskBody.getTaskData(this.dataObject);
            const result = await this.bx24.task.update(this.task[taskType].id, fields);
            this.task[taskType] = result?.task;
            this.showCompletedUpdating(container);
        }
    }

    displayTaskStates() {
        this.updateTaskState(this.dealData[FIELD_DEAL_TASK_ESTIMATE] && this.task.estimate, this.buttons.createEstimate);
        this.updateTaskState(this.dealData[FIELD_DEAL_TASK_COMMERC_OFFER] && this.task.commercOffer, this.buttons.createCommercOffer);
        this.updateTaskState(this.dealData[FIELD_DEAL_TASK_ORDER] && this.task.order, this.buttons.createOrder);
        this.updateTaskState(this.dealData[FIELD_DEAL_TASK_PAYMENT] && this.task.payment, this.buttons.createPayment);
        this.updateTaskState(this.dealData[FIELD_DEAL_TASK_PREPAYMENT] && this.task.prepayment, this.buttons.createPrepayment);
    }

    updateTaskState(taskExists, button) {
        if (taskExists) {
            this.showTaskExists(button.closest('.task-container__activities-rows'))
        } else {
            this.showTaskNotExist(button.closest('.task-container__activities-rows'));
        }
    }

    showCreatingProcess(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        markerCreate.style.display = 'inline-block';

        markerCreate.classList.remove('bi-check-circle-fill');
        markerCreate.classList.add('bi-arrow-clockwise');
        markerCreate.classList.add('rotate');
    }

    showCompletedCreating(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        markerCreate.classList.add('bi-check-circle-fill');
        markerCreate.classList.remove('bi-arrow-clockwise');
        markerCreate.classList.remove('rotate');
        if (markerUpdate) {
            markerUpdate.style.display = 'inline-block';
        }
    }

    showUpdatingProcess(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        if (markerUpdate) {
            markerUpdate.style.display = 'inline-block';
            markerUpdate.classList.add('rotate');
        }
    }

    showCompletedUpdating(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        if (markerUpdate) {
            markerUpdate.style.display = 'inline-block';
            markerUpdate.classList.remove('rotate');
        }
    }

    showTaskExists(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        markerCreate.style.display = 'inline-block';
        markerCreate.classList.remove('rotate');
        if (markerUpdate) {
            markerUpdate.style.display = 'inline-block';
            markerUpdate.classList.remove('rotate');
        }
    }

    showTaskNotExist(container) {
        const [markerCreate, markerUpdate] = container.querySelectorAll('.task-container__activities-lable i');
        markerCreate.style.display = 'none';
        if (markerUpdate) {
            markerUpdate.style.display = 'none';
        }
    }
}





























        // this.displayTaskNotCreated(this.btnCreateTaskEstimate);
        // this.displayTaskNotCreated(this.btnCreateTaskCommercOffer);
        // this.displayTaskNotCreated(this.btnCreateTaskOrder);
        // this.displayTaskNotCreated(this.btnCreateTaskPayment);
        // this.displayTaskNotCreated(this.btnCreateTaskPrepayment);
        // this.displayTaskNotUpdated(this.btnUpdateTaskEstimate);
        // this.displayTaskNotUpdated(this.btnUpdateTaskCommercOffer);
        // this.displayTaskNotUpdated(this.btnUpdateTaskOrder);

        // if (this.dealData[FIELD_DEAL_TASK_ESTIMATE]) {
        //     this.displayTaskCreated(this.btnCreateTaskEstimate);
        //     this.displayTaskUpdated(this.btnUpdateTaskEstimate);
        // }
        // if (this.dealData[FIELD_DEAL_TASK_COMMERC_OFFER]) {
        //     this.displayTaskCreated(this.btnCreateTaskCommercOffer);
        //     this.displayTaskUpdated(this.btnUpdateTaskCommercOffer);
        // }
        // if (this.dealData[FIELD_DEAL_TASK_ORDER]) {
        //     this.displayTaskCreated(this.btnCreateTaskOrder);
        //     this.displayTaskUpdated(this.btnUpdateTaskOrder);
        // }
        // if (this.dealData[FIELD_DEAL_TASK_PAYMENT]) {
        //     this.displayTaskCreated(this.btnCreateTaskPayment);
        // }
        // if (this.dealData[FIELD_DEAL_TASK_PREPAYMENT]) {
        //     this.displayTaskCreated(this.btnCreateTaskPrepayment);
        // }
    // }

    // initHandlers() {
    //     // Создать Смету
    //     this.btnCreateTaskEstimate.addEventListener('click', this.createTaskEstimate.bind(this));
    //     // // Перезаписать Смету
    //     // this.btnUpdateTaskEstimate.addEventListener('click', this.updateTaskEstimate.bind(this));
    //     // // Создать КП
    //     // document.querySelector('#btnCreateTaskCommercOffer').addEventListener('click', this.createTaskCommercOffer);
    //     // // Перезаписать КП
    //     // document.querySelector('#btnUpdateTaskCommercOffer').addEventListener('click', this.updateTaskCommercOffer);
    //     // // Создать Заказ
    //     // document.querySelector('#btnCreateTaskOrder').addEventListener('click', this.createTaskOrder);
    //     // // Перезаписать Заказ
    //     // document.querySelector('#btnUpdateTaskOrder').addEventListener('click', this.updateTaskOrder);
    //     // // Создать Счет на оплату
    //     // document.querySelector('#btnCreateTaskPayment').addEventListener('click', this.createTaskPayment);
    //     // // Создать Счет на Предоплату
    //     // document.querySelector('#btnCreateTaskPrepayment').addEventListener('click', this.createTaskPrepayment);

    // }

    // async createTaskEstimate(event) {
    //     const target = event.target;
    //     if (this.dealData[FIELD_DEAL_TASK_ESTIMATE]) {
    //         this.displayTaskProcessing(target);
    //         this.displayTaskUpdated(this.btnUpdateTaskEstimate);
    //         this.displayTaskCreated(target);
    //     }
    // }

    // async updateTaskEstimate(event) {
    //     const target = event.target;
    //     if (this.dealData[FIELD_DEAL_TASK_ESTIMATE]) {
    //         this.displayTaskProcessing(target);
    //         this.displayTaskUpdated(this.btnUpdateTaskEstimate);
    //         this.displayTaskCreated(target);
    //     }
    // }

    // displayTaskNotCreated(btn) {
    //     btn.parentNode.querySelector('.task-container__activities-lable i').style.display = 'none';
    // }

    // displayTaskProcessing(btn) {
    //     const marker = btn.parentNode.querySelector('.task-container__activities-lable i');
    //     marker.style.display = 'inline-block';
    //     marker.style.color = '#464a4e';
    //     marker.classList.remove('bi-check-circle-fill');
    //     marker.classList.add('bi-arrow-clockwise');
    //     marker.classList.add('rotate');
    // }

    // displayTaskCreated(btn) {
    //     const marker = btn.parentNode.querySelector('.task-container__activities-lable i');
    //     marker.style.display = 'inline-block';
    //     marker.style.color = '#54b434';
    //     marker.classList.add('bi-check-circle-fill');
    //     marker.classList.remove('bi-arrow-clockwise');
    //     marker.classList.remove('rotate');
    // }

    // displayTaskNotUpdated(btn) {
    //     const marker = btn.parentNode.querySelector('.task-container__activities-lable i');
    //     marker.style.display = 'none';
    //     marker.classList.remove('rotate');
    // }

    // displayTaskUpdating(btn) {
    //     const marker = btn.parentNode.querySelector('.task-container__activities-lable i');
    //     marker.style.display = 'inline-block';
    //     marker.classList.add('rotate');
    // }

    // displayTaskUpdated(btn) {
    //     const marker = btn.parentNode.querySelector('.task-container__activities-lable i');
    //     marker.style.display = 'inline-block';
    //     marker.classList.remove('rotate');
    // }
// }
