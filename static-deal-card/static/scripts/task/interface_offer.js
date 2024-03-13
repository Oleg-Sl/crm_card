import { Templates } from './templates/task_offer.js';


export class TaskOfferInterface {
    constructor(container, manager) {
        this.container = container;
        this.manager = manager;

        this.fields = {
            group: null,
            product: null,
            technology: null
        };
        this.materials = {
            dependences: null,
            technologiesTypes: null,
            films: null,
            widths: null,
            laminations: null
        };

        this.manager.addObserver(this);

        this.templates = new Templates();

        this.initHandlers();
    }

    initHandlers() {
        this.handlersGropupProducts();
        this.handlersProduct();
        this.handlersTechnology();
    }

    handlersGropupProducts() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            const groupId = target.dataset.groupId;
            const groupField = target.dataset.groupField;

            if (target.tagName === 'INPUT' && target.dataset.type === 'text' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'number' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'checkbox' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.checked});
            } else if (target.tagName === 'SELECT' && target.dataset.type === 'select' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'TEXTAREA' && target.dataset.type === 'textarea' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            }
        });
    }

    handlersProduct() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            const groupId = target.dataset.groupId;
            const productId = target.dataset.productId;
            const productField = target.dataset.productField;

            if (target.tagName === 'INPUT' && target.dataset.type === 'text' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'number' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'date' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'checkbox' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.checked});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'date' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'TEXTAREA' && target.dataset.type === 'textarea' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'SELECT' && target.dataset.type === 'select' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            }
        });
    }

    handlersTechnology() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            const groupId = target.dataset.groupId;
            const productId = target.dataset.productId;
            const technologyId = target.dataset.technologyId;
            const technologyField = target.dataset.technologyField;
            
            if (target.tagName === 'INPUT' && target.dataset.type === 'number' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'text' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.type === 'checkbox' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.checked});
            } else if (target.tagName === 'SELECT' && target.dataset.type === 'select' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.value});
            }
        });

    }

    setSmartFields(fieldGroup, fieldProduct, fieldTechnology) {
        this.fields = {
            group: fieldGroup,
            product: fieldProduct,
            technology: fieldTechnology
        };
        this.templates.setSmartFields(this.fields);
    }

    setMaterialsData(dependencesMaterial, technologiesTypes, films, widths, laminations) {
        this.materials = {
            dependences: dependencesMaterial,
            technologiesTypes: technologiesTypes,
            films: films,
            widths: widths,
            laminations: laminations
        };
        this.templates.setMaterialsData(this.materials);
    }

    update() {
        let contentHTML = '';
        let number = 0;
        for (const group of this.manager.groupsData) {
            contentHTML += this.templates.getGroupHTML(group, ++number);
        }
        this.container.innerHTML = contentHTML;            
    }

    // Методы для изменения данных и уведомления TaskManager
    updateTaskGroup(groupId, newData) {
        this.manager.updateGroup(groupId, newData);
    }

    updateTaskProduct(groupId, productId, newData) {
        this.manager.updateProduct(groupId, productId, newData);
    }

    updateTaskTechnology(groupId, productId, techId, newData) {
        this.manager.updateTechnology(groupId, productId, techId, newData);
    }
}
