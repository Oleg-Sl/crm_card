import { Templates } from '../templates/task_order.js';


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

    update() {
        let contentHTML = '';
        let number = 0;
        for (const group of this.manager.groupsData) {
            contentHTML += this.templates.getGroupHTML(group, ++number);
        }
        contentHTML += this.templates.getSummaryHTML(this.manager.groupsData);

        this.container.innerHTML = contentHTML;
        // if (!this.templateColumns) {
        //     const table = this.container.querySelector("table");
        //     if (table.offsetWidth > 0 && table.offsetHeight > 0) {
        //         const cells = table.querySelector('tr').querySelectorAll('th');
        //         this.templateColumns = Array.from(cells).map(cell => parseFloat(cell.offsetWidth.toFixed(2)));
        //     }
        // } else {
        //     const tables = this.container.querySelectorAll("table");
        //     const newTemplateColumns = this.templateColumns.map(column => parseInt(column));
        //     const sum = newTemplateColumns.reduce((acc, column) => acc + column, 0);
        //     const totalWidth = tables[0].parentElement.offsetWidth;
        //     newTemplateColumns[newTemplateColumns.length - 1] += totalWidth - sum;
        //     for (const table of tables) {
        //         table.style.gridTemplateColumns = newTemplateColumns.join('px ') + 'px';
        //     }
        // }
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

    createProduct(groupId) {
        this.manager.createProduct(groupId);
    }

    createCopyProduct(groupId, productId) {
        this.manager.createCopyProduct(groupId, productId);
    }

    removeProduct(groupId, productId) {
        this.manager.removeProduct(groupId, productId);
    }
}
