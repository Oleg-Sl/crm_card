import { ProductGroup } from './product_group.js';
import { Product } from './product.js';
import { Technology } from './technology.js';
// import {
//     getGroupProductsOrderHTML,
// } from './templates/task_order.js';
// import {
//     getGroupProductsApplicationHTML,
//     getSourcesHTML,
// } from './templates/task_application.js';
import { UiTaskApplication } from './ui_application.js';
import { UiTaskOffer } from './ui_offer.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_FILMS_ID,
    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,
    SP_FILMS_FIELDS,
} from '../parameters.js';



export class DataManager {
    constructor(bx24, dealId, containerTaksOffer, containerTaksApplication, containerTaksOrder) {
        this.bx24 = bx24;
        this.dealId = dealId;
        this.containerTaksOffer = containerTaksOffer;
        this.containerTaksApplication = containerTaksApplication;
        this.containerTaksOrder = containerTaksOrder;
        
        this.productGroups = [];

        this.fieldGroup = null;
        this.fieldProduct = null;
        this.fieldTechnology = null;

        this.uiTaskApp = null;
        this.uiTaskOffer = null;
        this.uiTaskOrder = null;
    }

    init(fieldsData) {
        this.fieldGroup = fieldsData?.fieldGroup;
        this.fieldProduct = fieldsData?.fieldProduct;
        this.fieldTechnology = fieldsData?.fieldTechnology;
        this.fieldFilms = fieldsData?.fieldFilms;
        this.filmsDataList = fieldsData?.filmsDataList;

        this.uiTaskApp = new UiTaskApplication(
            this,
            this.containerTaksApplication,
            this.fieldGroup,
            this.fieldProduct,
            this.fieldTechnology,
            this.fieldFilms,
            this.filmsDataList
        );

        this.uiTaskOffer = new UiTaskOffer(
            this,
            this.containerTaksOffer,
            this.fieldGroup,
            this.fieldProduct,
            this.fieldTechnology,
            this.fieldFilms,
            this.filmsDataList
        );
    }

    getChangedData() {
        let changed = [];

        for (const group of this.productGroups) {
            const changedFields = group.getChangedFields();
            if (Object.keys(changedFields).length !== 0) {
                let tmp = this.getChangedFieldsMap(changedFields);
                tmp.entityTypeId = SP_GROUP_ID;
                tmp.entityId = group.id;
                changed.push(tmp);
            }
            for (const product of group.products) {
                const changedFields = product.getChangedFields();
                if (Object.keys(changedFields).length !== 0) {
                    let tmp = this.getChangedFieldsMap(changedFields);
                    tmp.entityTypeId = SP_PRODUCT_ID;
                    tmp.entityId = product.id;
                    changed.push(tmp);
                }
                for (const technology of product.technologies) {
                    const changedFields = technology.getChangedFields();
                    if (Object.keys(changedFields).length !== 0) {
                        let tmp = this.getChangedFieldsMap(changedFields);
                        tmp.entityTypeId = SP_TECHOLOGY_ID;
                        tmp.entityId = technology.id;
                        changed.push(tmp);
                    }
                }
            }
        }

        return changed;
    }

    getChangedFieldsMap(changedFields) {
        const changedFieldsMap = {};

        for (const key in changedFields) {
            if (Object.hasOwnProperty.call(changedFields, key)) {
                if (changedFields[key].initialValue === true) {
                    changedFieldsMap[key] = 'Y';
                } else if (changedFields[key].initialValue === false) {
                    changedFieldsMap[key] = 'N';
                } else {
                    changedFieldsMap[key] = changedFields[key].newValue;
                }
            }
        }
    
        return changedFieldsMap;
    }

    searchTechnology(groupId, productId, technologyId) {
        let products = this.searchProduct(groupId, productId);
        if (products) {
            return products.technologies.find(technology => technology.id == technologyId);
        }
    }

    searchProduct(groupId, productId) {
        let productGroup = this.searchGroupProduct(groupId);
        if (productGroup) {
            return productGroup.products.find(product => product.id == productId);
        }
    }

    searchGroupProduct(groupId) {
        return this.productGroups.find(productGroup => productGroup.id == groupId);
    }

    async createTechnology(productId) {
        const data = {[`parentId${SP_PRODUCT_ID}`]: productId, parentId2: this.dealId};
        let response = await this.bx24.smartProcess.add(SP_TECHOLOGY_ID, data);
        
        if (response?.result?.item) {
            const technology = new Technology(response?.result?.item);
            for (let group of this.productGroups) {
                const productData = group.products.find(product => product.id == technology.parentId);
                if (productData) {
                    productData.addTechnology(technology);
                }
            }
        }

        return response?.result?.item;
    }

    async removeTechnology(productId, technologyId) {
        for (let group of this.productGroups) {
            const productData = group.products.find(product => product.id == productId);
            if (productData) {
                const technologyData = productData.technologies.find(technology => technology.id == technologyId);
                if (technologyData) {
                    productData.removeTechnology(technologyData);
                }
            }
        }

        const response = await this.bx24.smartProcess.delete(SP_TECHOLOGY_ID, technologyId);
        return response;
    }

    async createProduct(groupId) {
        const entityTypeId = SP_PRODUCT_ID;
        const data = {[`parentId${SP_GROUP_ID}`]: groupId, parentId2: this.dealId};
        let response = await this.bx24.smartProcess.add(entityTypeId, data);
        if (response?.result?.item) {
            const product = new Product(response?.result?.item);
            this.productGroups.find(productGroup => productGroup.id == groupId).addProduct(product);
        }

        return response?.result?.item;
    }

    async removeProduct(productId) {
        for (let group of this.productGroups) {
            const productData = group.products.find(product => product.id == productId);
            if (productData) {
                group.removeProduct(productData);
            }
        }

        let response = await this.bx24.smartProcess.delete(SP_PRODUCT_ID, productId);
        
        return response;
    }

    async createProductGroup() {
        const entityTypeId = SP_GROUP_ID;
        const data = {parentId2: this.dealId};
        let response = await this.bx24.smartProcess.add(entityTypeId, data);
        constole.log("createProductGroup = ", response);
        if (response?.result?.item) {
            constole.log("response?.result?.item = ", response?.result?.item);

            const group = new ProductGroup(response?.result?.item);
            // let responseProduct = await this.bx24.smartProcess.add(entityTypeId, data);
            // if (responseProduct?.result?.item) {
            //     const product = new Product(responseProduct?.result?.item);
            //     group.addProduct(product);
            // }
            this.productGroups.push(group);
            await this.createProduct(group.id);
        }

        return response?.result?.item;
    }

    addProductGroup(productGroup) {
        this.productGroups.push(productGroup);
        this.updateHTML();
        this.triggerDataChange();
    }

    removeProductGroup(productGroup) {
        const index = this.productGroups.indexOf(productGroup);
        if (index !== -1) {
            this.productGroups.splice(index, 1);
            this.updateHTML();
            this.triggerDataChange();
        }
    }

    onDataChange(callback) {
        this.onDataChange = callback;
    }

    triggerDataChange() {
        if (typeof this.onDataChange === 'function') {
            this.onDataChange({
                productGroups: this.productGroups,
            });
        }
    }

    updateHTML() {
        this.uiTaskApp.updateHTML();
        this.uiTaskOffer.updateHTML();
    }
}











    // initHandlers() {
    //     this.handlerSourcesFiles();
    //     this.handlerProduct();

    //     this.containerTaksApplication.addEventListener('click', async (event) => {
    //         let target = event.target;
    //         if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technology-add')) {
    //             const containerProductRow = event.target.closest('.product-row');
    //             const productId = containerProductRow.dataset.productId;
    //             await this.createTechnology(productId);
    //             this.updateHTML();
    //         }

    //         // Удалить технологию
    //         if (target.tagName === 'I' && target.parentElement.classList.contains('task-container__item-technologies-technology-remove')) {
    //             const containerProductRow = target.closest('.product-row');
    //             const productId = containerProductRow.dataset.productId;
    //             const containerTechnologyRow = target.closest('.technology-row');
    //             const technologyId = containerTechnologyRow.dataset.technologyId;
    //             console.log("target.parentElement ==>", target.parentElement);
    //             for (let group of this.productGroups) {
    //                 const productData = group.products.find(product => product.id == productId);
    //                 if (productData) {
    //                     const technologyData = productData.technologies.find(technology => technology.id == technologyId);
    //                     if (technologyData) {
    //                         productData.removeTechnology(technologyData);
    //                     }
    //                 }
    //             }
    //             let response = await this.bx24.smartProcess.delete(SP_TECHOLOGY_ID, technologyId);
    //             console.log(response);
    //             // const containerSourcesList = event.target.parentElement.parentElement.parentElement;
    //             // event.target.parentElement.parentElement.remove();
    //             // this.updateSources(containerSourcesList, containerProductRow.dataset.groupId, containerProductRow.dataset.productId);
    //             // containerProductRow.remove();
    //             this.updateHTML();
    //         }
    //     })
    // }

    // handlerProduct() {
    //     this.containerTaksApplication.addEventListener('click', async (event) => {
    //         let target = event.target;
    //         // Создать товар
    //         if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-add')) {
    //             const containerProductRow = event.target.closest('.application-group');
    //             const groupId = containerProductRow.dataset.groupId;
    //             await this.createProduct(groupId);
    //             this.updateHTML();
    //         }
    //         // Удалить товар
    //         if (target.tagName === 'I' && target.parentElement.classList.contains('task-container_group-item-remove')) {
    //             const containerProductRow = target.closest('.product-row');
    //             const productId = containerProductRow.dataset.productId;
    //             for (let group of this.productGroups) {
    //                 const productData = group.products.find(product => product.id == productId);
    //                 if (productData) {
    //                     group.removeProduct(productData);
    //                 }
    //             }
    //             let response = await this.bx24.smartProcess.delete(SP_PRODUCT_ID, productId);
    //             console.log(response);
    //             // const containerSourcesList = event.target.parentElement.parentElement.parentElement;
    //             // event.target.parentElement.parentElement.remove();
    //             // this.updateSources(containerSourcesList, containerProductRow.dataset.groupId, containerProductRow.dataset.productId);
    //             containerProductRow.remove();
    //             // this.updateHTML();
    //         }
    //     })
    // }

    // =========== ИСХОДНИКИ ===========
    // handlerSourcesFiles() {
    //     this.containerTaksApplication.addEventListener('click', event => {
    //         // Добавление исходного файла
    //         if (event.target.tagName === 'I' && event.target.parentElement.classList.contains('task-container_group-item-sources-add')) {
    //             const sourceItemHTML = getSourcesHTML([{}]);
    //             event.target.parentElement.parentElement.querySelector('.task-container_group-item-sources-list').insertAdjacentHTML('beforeend', sourceItemHTML);
    //         }

    //         // Удаление исходного файла
    //         if (event.target.tagName === 'I' && event.target.parentElement.classList.contains('task-container_group-item-sources-remove')) {
    //             const containerProductRow = event.target.closest('.product-row');
    //             const containerSourcesList = event.target.parentElement.parentElement.parentElement;
    //             event.target.parentElement.parentElement.remove();
    //             this.updateSources(containerSourcesList, containerProductRow.dataset.groupId, containerProductRow.dataset.productId);
    //         }
    //     })

    //     // Обновление исходных файлов
    //     this.containerTaksApplication.addEventListener('change', event => {
    //         if (event.target.tagName === 'SELECT' && event.target.classList.contains('product-source-select')) {
    //             const containerProductRow = event.target.closest('.product-row');
    //             const containerSourcesList = event.target.parentElement.parentElement.parentElement;
    //             this.updateSources(containerSourcesList, containerProductRow.dataset.groupId, containerProductRow.dataset.productId);
    //         }
    //     })
    // }

    // updateSources(containerSources, groupId, productId) {
    //     let sources = [];
    //     for (let source of containerSources.querySelectorAll('select')) {
    //         sources.push(source.value);
    //     }

    //     this.searchProduct(groupId, productId).setSources(sources);
    // }

    // updateHTML() {
    //     this.uiTaskApp.updateHTML();
    //     // let contentTaskOfferHTML = '';
    //     // let contentTaskApplicationHTML = '';

    //     // for (let productGroup of this.productGroups) {
    //     //     contentTaskOfferHTML += getGroupProductsOrderHTML(productGroup);
    //     //     contentTaskApplicationHTML += getGroupProductsApplicationHTML(productGroup, this.fieldGroup, this.fieldProductk, this.fieldTechnology);
    //     // }

    //     // this.containerTaksOffer.innerHTML = contentTaskOfferHTML;
    //     // this.containerTaksApplication.innerHTML = contentTaskApplicationHTML;
    // }

    // searchGroupProduct(groupId) {
    //     return this.productGroups.find(productGroup => productGroup.id == groupId);
    // }

    // searchProduct(groupId, productId) {
    //     let productGroup = this.searchGroupProduct(groupId);
    //     if (productGroup) {
    //         return productGroup.products.find(product => product.id == productId);
    //     }
    // }

// addProductGroup(productGroup) {
//     this.productGroups.push(productGroup);
//     this.updateHTML();
// }

// removeProductGroup(productGroup) {
//     const index = this.productGroups.indexOf(productGroup);
//     if (index !== -1) {
//         this.productGroups.splice(index, 1);
//         this.updateHTML();
//     }
// }

// addProduct(product) {
//     this.products.push(product);
//     this.updateHTML();
// }

// removeProduct(product) {
//     const index = this.products.indexOf(product);
//     if (index !== -1) {
//         this.products.splice(index, 1);
//         this.updateHTML();
//     }
// }

// addTechnology(technology) {
//     this.technologies.push(technology);
//     this.updateHTML();
// }

// removeTechnology(technology) {
//     const index = this.technologies.indexOf(technology);
//     if (index !== -1) {
//         this.technologies.splice(index, 1);
//         this.updateHTML();
//     }
// }

// updateHTML() {
//     // Реализация обновления HTML-представления данных
// }
