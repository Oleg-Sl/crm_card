
class TaskOrderInterface {
    constructor(manager) {
        this.manager = manager;

        this.container = document.querySelector('#taksOrder');
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