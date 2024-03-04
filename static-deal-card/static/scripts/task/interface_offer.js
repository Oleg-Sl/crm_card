
class TaskOfferInterface {
    constructor(manager) {
        this.manager = manager;

        // this.containerTaksTechnical = document.querySelector('#taksTechnical');
        // this.containerTaksOrder = document.querySelector('#taksOrder');
        
        this.container = document.querySelector('#taksOffer');
        this.manager.addObserver(this);
    }

    update() {
        // Перерисовка интерфейса
    }

    // Методы для изменения данных и уведомления TaskManager
    updateTaskGroup(groupId, newData) {
        this.manager.updateTaskGroup(groupId, newData);
    }

    updateTaskProduct(groupId, productId, newData) {
        this.manager.updateTaskProduct(groupId, productId, newData);
    }

    updateTaskTechnology(groupId, productId, techId, newData) {
        this.manager.updateTaskTechnology(groupId, productId, techId, newData);
    }
}