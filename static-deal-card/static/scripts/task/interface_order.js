import { Templates } from './templates/task_order.js';


export class TaskOrderInterface {
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

        this.container = document.querySelector('#taskApplication');
        this.manager.addObserver(this);

        this.templates = new Templates();

        this.initHandlers();
    }

    initHandlers() {
        // добавление/удаление технологии
        this.container.addEventListener('click', async (event) => {
            let target = event.target;
            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technology-add')) {
                const containerProductRow = event.target.closest('.product-row');
                const productId = containerProductRow.dataset.productId;
                await this.dataManager.createTechnology(productId);
                this.dataManager.updateHTML();
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technologies-technology-remove')) {
                const containerProductRow = target.closest('.product-row');
                const productId = containerProductRow.dataset.productId;
                const containerTechnologyRow = target.closest('.technology-row');
                const technologyId = containerTechnologyRow.dataset.technologyId;
                await this.dataManager.removeTechnology(productId, technologyId);
                this.dataManager.updateHTML();
            }
        })

        // добвление/удаление товара
        this.container.addEventListener('click', async (event) => {
            const target = event.target;
            
            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-add')) {
                const containerProductRow = event.target.closest('.application-group');
                const groupId = containerProductRow.dataset.groupId;
                await this.dataManager.createProduct(groupId);
                this.dataManager.updateHTML();
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove')) {
                const containerProductRow = target.closest('.product-row');
                const productId = containerProductRow.dataset.productId;
                await this.dataManager.removeProduct(productId);
                containerProductRow.remove();
                this.dataManager.updateHTML();
            }
        })

        // добавление группы товаров
        this.container.addEventListener('click', async (event) => {
            const target = event.target;

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-header-add-group')) {
                const containerRow = event.target.closest('.application-group');
                // const groupId = containerProductRow.dataset.groupId;
                await this.dataManager.createProductGroup();
                this.dataManager.updateHTML();
            }
        })
        
        // добавление/удаление исходного файла
        this.container.addEventListener('click', event => {
            const target = event.target;

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-add')) {
                const sourceItemHTML = this.templatesTaskApp.getSourcesHTML([{}]);
                target.parentElement.parentElement.querySelector('.task-container_group-item-sources-list').insertAdjacentHTML('beforeend', sourceItemHTML);
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-remove')) {
                const containerProductRow = target.closest('.product-row');
                console.log("containerProductRow = ", containerProductRow);
                const containerSourcesList = target.parentElement.parentElement.parentElement;
                const groupId = containerProductRow.dataset.groupId;
                const productId = containerProductRow.dataset.productId;
                target.parentElement.parentElement.remove();
                this.updateSources(containerSourcesList, groupId, productId);
            }
        })

        // Обновление исходных файлов
        this.container.addEventListener('change', event => {
            if (event.target.tagName === 'SELECT' && event.target.classList.contains('product-source-select')) {
                const containerProductRow = event.target.closest('.product-row');
                const containerSourcesList = event.target.parentElement.parentElement.parentElement;
                const groupId = containerProductRow.dataset.groupId;
                const productId = containerProductRow.dataset.productId;
                this.updateSources(containerSourcesList, groupId, productId);
            }
        })

        this.handlersGropupProducts();
        this.handlersProduct();
        this.handlersTechnology();

    }

    handlersGropupProducts() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            const groupId = target.dataset.groupId;
            const groupField = target.dataset.groupField;

            if (target.tagName === 'INPUT' && target.dataset.groupType === 'text' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'checkbox' && target.dataset.groupField && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.checked});
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'select' && target.dataset.groupField && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.checked});
            }
        });
    }

    handlersProduct() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            const groupId = target.dataset.groupId;
            const productId = target.dataset.productId;
            const productField = target.dataset.productField;

            if (target.tagName === 'INPUT' && target.dataset.productType === 'text' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'number' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'checkbox' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.checked});
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'date' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'TEXTAREA' && target.dataset.productType === 'textarea' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'SELECT' && target.dataset.productType === 'select' && groupId && productId && productField) {
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
            
            if (target.tagName === 'INPUT' && target.dataset.technologyType === 'checkbox' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.checked});
            } else if (target.tagName === 'SELECT' && target.dataset.technologyType === 'select' && target.dataset.technologyField) {
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
        for (const group of this.manager.groupsData) {
            contentHTML += this.templates.getGroupHTML(group);
        }
        this.container = contentHTML;            
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
