import { Templates } from './templates/task_app.js';


export class TaskAppInterface {
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
        // добавление группы товаров
        this.container.addEventListener('click', async (event) => {
            const target = event.target;
            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-header-add-group')) {
                this.createGroup();
            }
        })

        // добвление/удаление товара
        this.container.addEventListener('click', async (event) => {
            const target = event.target;
            
            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-add') && target.dataset.groupId) {
                this.createProduct(target.dataset.groupId);
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove') && target.dataset.productId) {
                this.removeProduct(target.dataset.productId);
            }
        })

        // добавление/удаление технологии
        this.container.addEventListener('click', async (event) => {
            let target = event.target;

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technology-add') && target.dataset.productId) {
                this.createTechnology(target.dataset.productId);
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technologies-technology-remove') && target.dataset.technologyId) {
                this.removeTechnology(target.dataset.technologyId);
            }
        })

        // // добавление/удаление исходного файла
        // this.container.addEventListener('click', event => {
        //     const target = event.target;

        //     if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-add')) {
        //         const sourceItemHTML = this.templatesTaskApp.getSourcesHTML([{}]);
        //         target.parentElement.parentElement.querySelector('.task-container_group-item-sources-list').insertAdjacentHTML('beforeend', sourceItemHTML);
        //     }

        //     if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-remove')) {
        //         const containerProductRow = target.closest('.product-row');
        //         console.log("containerProductRow = ", containerProductRow);
        //         const containerSourcesList = target.parentElement.parentElement.parentElement;
        //         const groupId = containerProductRow.dataset.groupId;
        //         const productId = containerProductRow.dataset.productId;
        //         target.parentElement.parentElement.remove();
        //         this.updateSources(containerSourcesList, groupId, productId);
        //     }
        // })

        // // Обновление исходных файлов
        // this.container.addEventListener('change', event => {
        //     if (event.target.tagName === 'SELECT' && event.target.classList.contains('product-source-select')) {
        //         const containerProductRow = event.target.closest('.product-row');
        //         const containerSourcesList = event.target.parentElement.parentElement.parentElement;
        //         const groupId = containerProductRow.dataset.groupId;
        //         const productId = containerProductRow.dataset.productId;
        //         this.updateSources(containerSourcesList, groupId, productId);
        //     }
        // })

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
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'number' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'checkbox' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.checked});
            } else if (target.tagName === 'SELECT' && target.dataset.groupType === 'select' && groupId && groupField) {
                this.updateTaskGroup(groupId, {[groupField]: target.value});
            } else if (target.tagName === 'TEXTAREA' && target.dataset.groupType === 'textarea' && groupId && groupField) {
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

            if (target.tagName === 'INPUT' && target.dataset.productType === 'text' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'number' && groupId && productId && productField) {
                this.updateTaskProduct(groupId, productId, {[productField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'date' && groupId && productId && productField) {
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
            
            if (target.tagName === 'INPUT' && target.dataset.technologyType === 'number' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.technologyType === 'text' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.value});
            } else if (target.tagName === 'INPUT' && target.dataset.technologyType === 'checkbox' && groupId && productId && technologyId && technologyField) {
                this.updateTaskTechnology(groupId, productId, technologyId, {[technologyField]: target.checked});
            } else if (target.tagName === 'SELECT' && target.dataset.technologyType === 'select' && groupId && productId && technologyId && technologyField) {
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
        console.log("setMaterialsData interface = ", this.materials);
        this.templates.setSmartFields(this.materials);
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

    createGroup() {
        this.manager.createGroup();
    }

    removeGroup(groupId) {
        this.manager.removeGroup(groupId);
    }

    createProduct(groupId) {
        this.manager.createProduct(groupId);
    }

    removeProduct(productId) {
        this.manager.removeProduct(productId);
    }

    createTechnology(productId) {
        this.manager.createTechnology(productId);
    }

    removeTechnology(technologyId) {
        this.manager.removeTechnology(technologyId);
    }
}
