import { Templates } from '../templates/task_app.js';


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

        this.templates = new Templates();

        this.isResizing = false;
        this.columnBeingResized = null;
        this.templateColumns = null;

    }

    init() {
        this.fields = this.manager.fields;
        this.materials = this.manager.materials;
        this.templates.setSmartFields(this.fields);
        this.templates.setMaterialsData(this.materials);

        this.manager.addObserver(this);
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

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-copy') && target.dataset.productId) {
                this.createCopyProduct(target.dataset.groupId, target.dataset.productId);
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove') && target.dataset.groupId && target.dataset.productId) {
                this.removeProduct(target.dataset.groupId, target.dataset.productId);
            }
        })

        // добавление/удаление технологии
        this.container.addEventListener('click', async (event) => {
            let target = event.target;

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technology-add') && target.dataset.productId) {
                this.createTechnology(target.dataset.productId);
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technologies-technology-remove') && target.dataset.groupId && target.dataset.productId && target.dataset.technologyId) {
                this.removeTechnology(target.dataset.groupId, target.dataset.productId, target.dataset.technologyId);
            }
        })

        // добавление/удаление исходного файла
        this.container.addEventListener('click', event => {
            const target = event.target;

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-add')) {
                const target = event.target;
                const groupId = target.dataset.groupId;
                const productId = target.dataset.productId;
                const productField = target.dataset.productField;

                const selectElementsContainer = target.closest('.task-container_group-item-sources')
                const selectElements = selectElementsContainer.querySelectorAll('select');
                const sources = Array.from(selectElements).map(el => el.value);
                sources.push('');
                this.updateTaskProduct(groupId, productId, {sourcesFiles: sources});
            }

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-remove')) {
                const target = event.target;
                const groupId = target.dataset.groupId;
                const productId = target.dataset.productId;
                const productField = target.dataset.productField;

                const selectElementsContainer = target.closest('.task-container_group-item-sources')
                const row = target.closest('.task-container_group-item-sources-item');
                row.remove();
                
                const selectElements = selectElementsContainer.querySelectorAll('select');
                const sources = Array.from(selectElements).map(el => el.value);
                this.updateTaskProduct(groupId, productId, {sourcesFiles: sources});
            }
        })

        // Обновление исходных файлов
        this.container.addEventListener('change', event => {
            if (event.target.tagName === 'SELECT' && event.target.classList.contains('product-source-select')) {
                const target = event.target;
                const groupId = target.dataset.groupId;
                const productId = target.dataset.productId;
                const productField = target.dataset.productField;

                const selectElements = target.closest('.task-container_group-item-sources').querySelectorAll('select');
                const sources = Array.from(selectElements).map(el => el.value);
                this.updateTaskProduct(groupId, productId, {sourcesFiles: sources});
            }
        })

        this.handleResizeColumn();
        this.handlersGropupProducts();
        this.handlersProduct();
        this.handlersTechnology();

    }

    addPreviewEventListeners() {
        this.container.querySelectorAll('.task-container_group-item-sources-item-prev').forEach(item => {
            item.addEventListener('mouseover', this.handleFilePreviewShow.bind(this));
            item.addEventListener('mouseout', this.handleFilePreviewHide);
        });
    }

    removePreviewEventListeners() {
        this.container.querySelectorAll('.task-container_group-item-sources-item-prev').forEach(item => {
            item.removeEventListener('mouseover', this.handleFilePreviewShow.bind(this));
            item.removeEventListener('mouseout', this.handleFilePreviewHide);
        });
    }

    handleFilePreviewShow(event) {
        const target = event.target;
        if (target.dataset.link) {
            const smile = target.textContent;
            const previewLink = target.dataset.link;
            const previewContainer = document.getElementById('tooltip');
            previewContainer.innerHTML = `<div style="max-width: 250px;"><img src="${previewLink}" alt="${smile}" style="width: 100%;"></div>`;
            previewContainer.style.visibility = 'visible';
            previewContainer.style.left = event.pageX + 'px';
            previewContainer.style.opacity = '1';
            previewContainer.style.top = event.pageY + 'px';
        }
    }

    handleFilePreviewHide() {
        const previewContainer = document.getElementById('tooltip');
        previewContainer.style.opacity = '0';
        previewContainer.style.visibility = 'hidden';
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

    handleResizeColumn() {
        this.container.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resizable')) {
                const table = this.container.querySelector("table");
                if (!this.templateColumns && table.offsetWidth > 0 && table.offsetHeight > 0) {
                    const cells = table.querySelector('tr').querySelectorAll('th');
                    this.templateColumns = Array.from(cells).map(cell => parseFloat(cell.offsetWidth.toFixed(2)));
                }
                this.isResizing = true;
                this.columnBeingResized = e.target.closest('th');
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (e.buttons !== 1) {
                this.isResizing = false;
            }
            if (!this.isResizing) {
                return;
            }

            const table = this.container.querySelector("table");
            const cells = table.querySelector('tr').querySelectorAll('th');
        
            const oldWidth = this.templateColumns[1];
            const newWidth = e.clientX - this.columnBeingResized.getBoundingClientRect().left;
            const totalWidth = table.parentElement.offsetWidth;
            const newRightWidth = totalWidth - this.templateColumns[0] - newWidth;
            const oldRightWidth = totalWidth - this.templateColumns[0] - oldWidth;
            
            const scale = newRightWidth / oldRightWidth;

            this.templateColumns = this.templateColumns.map((el, index) => index < 2 ? el : el * scale);
            this.templateColumns[1] = newWidth;
            const newTemplateColumns = this.templateColumns.map(column => parseInt(column));
            const sum = newTemplateColumns.reduce((acc, column) => acc + column, 0);
            newTemplateColumns[newTemplateColumns.length - 1] += totalWidth - sum;
            for (const t of this.container.querySelectorAll("table")) {
                t.style.gridTemplateColumns = newTemplateColumns.join('px ') + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            this.isResizing = false;
        });
    }

    // setSmartFields(fieldGroup, fieldProduct, fieldTechnology) {
    //     this.fields = {
    //         group: fieldGroup,
    //         product: fieldProduct,
    //         technology: fieldTechnology
    //     };
    //     this.templates.setSmartFields(this.fields);
    // }

    // setMaterialsData(dependencesMaterial, technologiesTypes, films, widths, laminations) {
    //     this.materials = {
    //         dependences: dependencesMaterial,
    //         technologiesTypes: technologiesTypes,
    //         films: films,
    //         widths: widths,
    //         laminations: laminations
    //     };
    //     this.templates.setMaterialsData(this.materials);
    // }

    setSourcesFilesData(sourceFilesData) {
        this.templates.setSourcesFilesData(sourceFilesData);
    }

    setSourcesLinksData(sourceLinksData) {
        this.templates.setSourcesLinksData(sourceLinksData);
    }

    update() {
        this.removePreviewEventListeners();
        let contentHTML = '';
        let number = 0;
        for (const group of this.manager.groupsData) {
            contentHTML += this.templates.getGroupHTML(group, ++number);
        }
        contentHTML += this.templates.getSummaryHTML(this.manager.groupsData);
        
        this.container.innerHTML = contentHTML;
        this.addPreviewEventListeners();
        if (this.templateColumns && this.templateColumns.length > 0) {
            const newTemplateColumns = this.templateColumns.map(column => parseInt(column));
            for (const t of this.container.querySelectorAll("table")) {
                t.style.gridTemplateColumns = newTemplateColumns.join('px ') + 'px';
            }
        }
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

    createGroup() {
        this.manager.createGroup();
    }

    createProduct(groupId) {
        this.manager.createProduct(groupId);
    }

    createCopyProduct(groupId, productId) {
        this.manager.createCopyProduct(groupId, productId);
    }

    createTechnology(productId) {
        this.manager.createTechnology(productId);
    }

    removeGroup(groupId) {
        this.manager.removeGroup(groupId);
    }

    removeProduct(groupId, productId) {
        this.manager.removeProduct(groupId, productId);
    }

    removeTechnology(groupId, productId, technologyId) {
        this.manager.removeTechnology(groupId, productId, technologyId);
    }
}
