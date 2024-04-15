// import { TemplateTaskApplication } from './templates/template_task_application.js';


// export class UiTaskApplication {
//     constructor(dataManager, containerTaskApplication, fieldGroup, fieldProduct, fieldTechnology, fieldFilms, filmsDataList) {
//         this.dataManager = dataManager;
//         this.container = containerTaskApplication;

//         this.fieldGroup = fieldGroup; 
//         this.fieldProduct = fieldProduct;
//         this.fieldTechnology = fieldTechnology;
//         this.fieldFilms = fieldFilms;
//         this.filmsDataList = filmsDataList;

//         this.templatesTaskApp = new TemplateTaskApplication(this.fieldGroup, this.fieldProduct, this.fieldTechnology, this.fieldFilms, this.filmsDataList);

//         this.initHandlers();
//     }

//     initHandlers() {
//         // добавление/удаление технологии
//         this.container.addEventListener('click', async (event) => {
//             let target = event.target;
//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technology-add')) {
//                 const containerProductRow = event.target.closest('.product-row');
//                 const productId = containerProductRow.dataset.productId;
//                 await this.dataManager.createTechnology(productId);
//                 this.dataManager.updateHTML();
//             }

//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technologies-technology-remove')) {
//                 const containerProductRow = target.closest('.product-row');
//                 const productId = containerProductRow.dataset.productId;
//                 const containerTechnologyRow = target.closest('.technology-row');
//                 const technologyId = containerTechnologyRow.dataset.technologyId;
//                 await this.dataManager.removeTechnology(productId, technologyId);
//                 this.dataManager.updateHTML();
//             }
//         })

//         // добвление/удаление товара
//         this.container.addEventListener('click', async (event) => {
//             const target = event.target;
            
//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-add')) {
//                 const containerProductRow = event.target.closest('.application-group');
//                 const groupId = containerProductRow.dataset.groupId;
//                 await this.dataManager.createProduct(groupId);
//                 this.dataManager.updateHTML();
//             }

//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove')) {
//                 const containerProductRow = target.closest('.product-row');
//                 const productId = containerProductRow.dataset.productId;
//                 await this.dataManager.removeProduct(productId);
//                 containerProductRow.remove();
//                 this.dataManager.updateHTML();
//             }
//         })

//         // добавление группы товаров
//         this.container.addEventListener('click', async (event) => {
//             const target = event.target;

//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-header-add-group')) {
//                 const containerRow = event.target.closest('.application-group');
//                 // const groupId = containerProductRow.dataset.groupId;
//                 await this.dataManager.createProductGroup();
//                 this.dataManager.updateHTML();
//             }
//         })
        
//         // добавление/удаление исходного файла
//         this.container.addEventListener('click', event => {
//             const target = event.target;

//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-add')) {
//                 const sourceItemHTML = this.templatesTaskApp.getSourcesHTML([{}]);
//                 target.parentElement.parentElement.querySelector('.task-container_group-item-sources-list').insertAdjacentHTML('beforeend', sourceItemHTML);
//             }

//             if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-sources-remove')) {
//                 const containerProductRow = target.closest('.product-row');
//                 console.log("containerProductRow = ", containerProductRow);
//                 const containerSourcesList = target.parentElement.parentElement.parentElement;
//                 const groupId = containerProductRow.dataset.groupId;
//                 const productId = containerProductRow.dataset.productId;
//                 target.parentElement.parentElement.remove();
//                 this.updateSources(containerSourcesList, groupId, productId);
//             }
//         })

//         // Обновление исходных файлов
//         this.container.addEventListener('change', event => {
//             if (event.target.tagName === 'SELECT' && event.target.classList.contains('product-source-select')) {
//                 const containerProductRow = event.target.closest('.product-row');
//                 const containerSourcesList = event.target.parentElement.parentElement.parentElement;
//                 const groupId = containerProductRow.dataset.groupId;
//                 const productId = containerProductRow.dataset.productId;
//                 this.updateSources(containerSourcesList, groupId, productId);
//             }
//         })

//         this.handlersGropupProducts();
//         this.handlersProduct();
//         this.handlersTechnology();

//     }

//     handlersGropupProducts() {
//         this.container.addEventListener('change', event => {
//             const target = event.target;
//             // data-group-field="title" data-group-type="text"
//             if (target.tagName === 'INPUT' && target.dataset.groupType === 'text' && target.dataset.groupField) {
//                 const groupId = this.getGroupId(target);
//                 const field = target.dataset.groupField;
//                 this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
//                 this.updateHTML();
//             } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'checkbox' && target.dataset.groupField) {
//                 const groupId = this.getGroupId(target);
//                 const field = target.dataset.groupField;
//                 this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.checked});
//                 this.updateHTML();
//             } else if (target.tagName === 'SELECT' && target.dataset.groupType === 'select' && target.dataset.groupField) {
//                 const groupId = this.getGroupId(target);
//                 const field = target.dataset.groupField;
//                 this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
//                 this.updateHTML();
//             }
//         });
//     }

//     handlersProduct() {
//         this.container.addEventListener('change', event => {
//             const target = event.target;
//             // data-product-field="title" data-product-type="text"
//             if (target.tagName === 'INPUT' && target.dataset.productType === 'text' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
//                 this.updateHTML();
//             } else if (target.tagName === 'INPUT' && target.dataset.productType === 'number' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
//                 this.updateHTML();
//             } else if (target.tagName === 'INPUT' && target.dataset.productType === 'checkbox' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.checked});
//                 this.updateHTML();
//             } else if (target.tagName === 'INPUT' && target.dataset.productType === 'date' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
//                 this.updateHTML();
//             } else if (target.tagName === 'TEXTAREA' && target.dataset.productType === 'textarea' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
//                 this.updateHTML();
//             } else if (target.tagName === 'SELECT' && target.dataset.productType === 'select' && target.dataset.productField) {
//                 const { groupId, productId } = this.getGroupProductId(target);
//                 const field = target.dataset.productField;
//                 this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
//                 this.updateHTML();
//             }
//         });
//     }

//     handlersTechnology() {
//         this.container.addEventListener('change', event => {
//             const target = event.target;
//             // data-technology-field="title" data-technology-type="text"
//             if (target.tagName === 'INPUT' && target.dataset.technologyType === 'checkbox' && target.dataset.technologyField) {
//                 const { groupId, productId, technologyId } = this.getTechnologyId(target);
//                 const field = target.dataset.technologyField;
//                 this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.checked});
//                 this.updateHTML();
//             } else if (target.tagName === 'SELECT' && target.dataset.technologyType === 'select' && target.dataset.technologyField) {
//                 const { groupId, productId, technologyId } = this.getTechnologyId(target);
//                 const field = target.dataset.technologyField;
//                 this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.value});
//                 this.updateHTML();
//             }
//         });

//     }

//     updateHTML() {
//         let contentTaskApplicationHTML = '';
//         for (let indGroup in this.dataManager.productGroups) {
//             const productGroup = this.dataManager.productGroups[indGroup];
//             contentTaskApplicationHTML += this.templatesTaskApp.getGroupProductsHTML(productGroup, +indGroup + 1);
//         }

//         this.container.innerHTML = contentTaskApplicationHTML;
//     }

//     updateSources(containerSources, groupId, productId) {
//         let sources = [];
//         for (let source of containerSources.querySelectorAll('select')) {
//             sources.push(source.value);
//         }

//         this.dataManager.searchProduct(groupId, productId).setSources(sources);
//     }

//     getGroupId(element) {
//         const containerProductRow = element.closest('.application-group');
//         const groupId = containerProductRow.dataset.groupId;
//         return groupId;
//     }

//     getGroupProductId(element) {
//         const containerProductRow = element.closest('.product-row');
//         const groupId = containerProductRow.dataset.groupId;
//         const productId = containerProductRow.dataset.productId;
//         return { groupId: groupId, productId: productId};
//     }

//     getTechnologyId(element) {
//         const containerTechnologyRow = element.closest('.technology-row');
//         const technologyId = containerTechnologyRow.dataset.technologyId;
//         const { groupId, productId} = this.getGroupProductId(element);
//         return { groupId: groupId, productId: productId, technologyId: technologyId };
//     }

// };
