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

        
        this.manager.addObserver(this);

        this.templates = new Templates();

        this.isResizing = false;
        this.columnBeingResized = null;
        this.newTemplateColumns = null;

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

            if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove') && target.dataset.groupId && target.dataset.productId) {
                // console.log("remove target.dataset.productId = ", target.dataset.productId, target.dataset.groupId);
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
                console.log('selectElementsContainer = ', selectElementsContainer);
                const selectElements = selectElementsContainer.querySelectorAll('select');
                console.log('selectElements = ', selectElements);
                const sources = Array.from(selectElements).map(el => el.value);
                console.log('sources = ', sources);
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
                console.log('sources = ', sources);
                this.updateTaskProduct(groupId, productId, {sourcesFiles: sources});
                
                // const containerProductRow = event.target.closest('.product-row');
                // const containerSourcesList = event.target.parentElement.parentElement.parentElement;
                // const groupId = containerProductRow.dataset.groupId;
                // const productId = containerProductRow.dataset.productId;
                // this.updateSources(containerSourcesList, groupId, productId);
            }
        })

        this.container.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resizable')) {
                this.isResizing = true;
                // console.log("this.isResizing = ", this.isResizing);
                // this.columnBeingResized = e.target.parentElement;
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
            //  - this.columnBeingResized.getBoundingClientRect().width;
            console.log("e.clientX = ", e.clientX, "this.columnBeingResized.getBoundingClientRect() = ", this.columnBeingResized.getBoundingClientRect());
            const totalWidth = table.parentElement.offsetWidth;
            // console.log(e.clientX, this.columnBeingResized);
            console.log("newWidth = ", newWidth, "oldWidth = ", oldWidth, "totalWidth = ", totalWidth);
            // const oldRightWidth = this.templateColumns.reduce((acc, cell) => acc + cell, 0) - this.templateColumns[0] - oldWidth;
            // const newRightWidth = this.templateColumns.reduce((acc, cell) => acc + cell, 0) - this.templateColumns[0] - newWidth;
            const newRightWidth = totalWidth - this.templateColumns[0] - newWidth;
            const oldRightWidth = totalWidth - this.templateColumns[0] - oldWidth;
            
            const scale = newRightWidth / oldRightWidth;
            console.log("newRightWidth = ", newRightWidth, "oldRightWidth = ", oldRightWidth, "scale = ", scale);

            // this.templateColumns = Array.from(cells).map(cell => parseFloat(cell.offsetWidth.toFixed(2)));
            this.templateColumns = this.templateColumns.map((el, index) => index < 2 ? el : el * scale);
            this.templateColumns[1] = newWidth;
            // console.log(this.templateColumns);
            // this.templateColumns[this.templateColumns.length - 1] = totalWidth - this.templateColumns.reduce((acc, cell) => acc + cell, 0) + this.templateColumns[this.templateColumns.length - 1];
        
            // Обновляем стиль grid-template-columns
            // console.log(">>> ", this.templateColumns.join('px ') + 'px');
            // table.style.gridTemplateColumns = this.templateColumns.join('px ') + 'px';
            const newTemplateColumns = this.templateColumns.map(column => parseInt(column));
            const sum = newTemplateColumns.reduce((acc, column) => acc + column, 0);
            newTemplateColumns[newTemplateColumns.length - 1] += totalWidth - sum;
            console.log("newTemplateColumns = ", newTemplateColumns);
            for (const t in this.container.querySelectorAll("table")) {
                t.style.gridTemplateColumns = newTemplateColumns.join('px ') + 'px';
            }
            // this.isResizing = false;
        });

        // document.addEventListener('mousemove', (e) => {

        //     // console.log("Mouse move = ", this.isResizing);
        //     if (!this.isResizing) {
        //         return;
        //     }
        //     console.log("Mouse move!!!");
        //     // grid-template-columns: 15px 1fr 110px 120px 80px 80px 80px 110px 80px 90px 80px


        //     const table = this.container.querySelector("table");
        //     const cells = table.querySelectorAll('th');

        //     const newWidth = e.clientX - this.columnBeingResized.getBoundingClientRect().left;
        //     this.columnBeingResized.style.width = newWidth + 'px';
        
        //     const totalWidth = table.offsetWidth;
        //     const totalColumnsWidth = Array.from(cells).reduce((acc, cell) => acc + cell.offsetWidth, 0);
        //     const scale = (totalWidth - newWidth) / (totalWidth - totalColumnsWidth);
        
        //     Array.from(cells).forEach((cell, index) => {
        //     if (cell !== this.columnBeingResized) {
        //         const originalWidth = parseFloat(window.getComputedStyle(cell).width);
        //         const newCellWidth = originalWidth * scale;
        //         cell.style.width = newCellWidth + 'px';
        //     }
        //     });
        // });

        document.addEventListener('mouseup', () => {
            this.isResizing = false;
        });

        // const tableContainer = document.getElementById('table-container');
        // const cells = tableContainer.getElementsByClassName('cell');
        // const resizableColumn = document.querySelector('.resizable');

        // const resizer = document.createElement('div');
        // resizer.className = 'resizer';
        // resizableColumn.appendChild(resizer);







        // this.container.addEventListener('mouseenter', function(event) {
        //     const target = event.target;
        //     // Проверяем, что наведение произошло на элемент .task-container_group-item-sources-item-prev
        //     if (target.classList.contains('task-container_group-item-sources-item-prev')) {
        //       const link = target.getAttribute('data-link');
        //       // Показываем картинку
        //       if (link) {
        //         // Ваш код для отображения картинки
        //         this.handleFilePreviewShow(event);
        //         console.log('Показываем картинку:', link);
        //       }
        //     }
        //   });
          
        // this.container.addEventListener('mouseleave', function(event) {
        //     const target = event.target;
        //     // Проверяем, что покидание произошло с элемента .task-container_group-item-sources-item-prev
        //     if (target.classList.contains('task-container_group-item-sources-item-prev')) {
        //       // Закрываем картинку
        //       this.handleFilePreviewHide();
        //       // Ваш код для закрытия картинки
        //       console.log('Закрываем картинку');
        //     }
        //   });

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
        if (!this.newTemplateColumns) {
            const table = this.container.querySelector("table");
            const cells = table.querySelector('tr').querySelectorAll('th');
            this.templateColumns = Array.from(cells).map(cell => parseFloat(cell.offsetWidth.toFixed(2)));
        } else {
            const tables = this.container.querySelectorAll("table");
            console.log("Before update", this.templateColumns);
            const newTemplateColumns = this.templateColumns.map(column => parseInt(column));
            const sum = newTemplateColumns.reduce((acc, column) => acc + column, 0);
            newTemplateColumns[newTemplateColumns.length - 1] += totalWidth - sum;
            for (const table of tables) {
                table.style.gridTemplateColumns = newTemplateColumns.join('px ') + 'px';
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
