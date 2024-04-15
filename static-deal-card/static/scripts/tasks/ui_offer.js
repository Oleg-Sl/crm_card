
import { TemplateTaskOffer } from './templates/template_task_offer.js';


export class UiTaskOffer {
    constructor(dataManager, containerTaskApplication, fieldGroup, fieldProduct, fieldTechnology, fieldFilms, filmsDataList) {
        this.dataManager = dataManager;
        this.container = containerTaskApplication;

        this.fieldGroup = fieldGroup; 
        this.fieldProduct = fieldProduct;
        this.fieldTechnology = fieldTechnology;
        this.fieldFilms = fieldFilms;
        this.filmsDataList = filmsDataList;

        this.templatesTaskOffer = new TemplateTaskOffer(this.fieldGroup, this.fieldProduct, this.fieldTechnology, this.fieldFilms, this.filmsDataList);

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
            // data-group-field="title" data-group-type="text"
            if (target.tagName === 'INPUT' && target.dataset.groupType === 'text' && target.dataset.groupField) {
                const groupId = this.getGroupId(target);
                const field = target.dataset.groupField;
                this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'number' && target.dataset.groupField) {
                const groupId = this.getGroupId(target);
                const field = target.dataset.groupField;
                this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.groupType === 'checkbox' && target.dataset.groupField) {
                const groupId = this.getGroupId(target);
                const field = target.dataset.groupField;
                this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.checked});
                this.updateHTML();
            } else if (target.tagName === 'SELECT' && target.dataset.groupType === 'select' && target.dataset.groupField) {
                const groupId = this.getGroupId(target);
                const field = target.dataset.groupField;
                this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'TEXTAREA' && target.dataset.groupType === 'textarea' && target.dataset.groupField) {
                const groupId = this.getGroupId(target);
                const field = target.dataset.groupField;
                this.dataManager.searchGroupProduct(groupId).updateData({[field]: target.value});
                this.updateHTML();
            }
        });
    }

    handlersProduct() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            // data-product-field="title" data-product-type="text"
            if (target.tagName === 'INPUT' && target.dataset.productType === 'text' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'number' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'checkbox' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.checked});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.productType === 'date' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'TEXTAREA' && target.dataset.productType === 'textarea' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'SELECT' && target.dataset.productType === 'select' && target.dataset.productField) {
                const { groupId, productId } = this.getGroupProductId(target);
                const field = target.dataset.productField;
                this.dataManager.searchProduct(groupId, productId).updateData({[field]: target.value});
                this.updateHTML();
            }
        });
    }

    handlersTechnology() {
        this.container.addEventListener('change', event => {
            const target = event.target;
            // data-technology-field="title" data-technology-type="text"
            if (target.tagName === 'INPUT' && target.dataset.technologyType === 'number' && target.dataset.technologyField) {
                const { groupId, productId, technologyId } = this.getTechnologyId(target);
                console.log(groupId, productId, technologyId);
                const field = target.dataset.technologyField;
                this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.technologyType === 'text' && target.dataset.technologyField) {
                const { groupId, productId, technologyId } = this.getTechnologyId(target);
                console.log(groupId, productId, technologyId);
                const field = target.dataset.technologyField;
                this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.value});
                this.updateHTML();
            } else if (target.tagName === 'INPUT' && target.dataset.technologyType === 'checkbox' && target.dataset.technologyField) {
                const { groupId, productId, technologyId } = this.getTechnologyId(target);
                const field = target.dataset.technologyField;
                this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.checked});
                this.updateHTML();
            } else if (target.tagName === 'SELECT' && target.dataset.technologyType === 'select' && target.dataset.technologyField) {
                const { groupId, productId, technologyId } = this.getTechnologyId(target);
                const field = target.dataset.technologyField;
                this.dataManager.searchTechnology(groupId, productId, technologyId).updateData({[field]: target.value});
                this.updateHTML();
            }
        });

    }

    updateHTML() {
        let contentTaskApplicationHTML = '';
        for (let indGroup in this.dataManager.productGroups) {
            const productGroup = this.dataManager.productGroups[indGroup];
            contentTaskApplicationHTML += this.templatesTaskOffer.getGroupProductsOfferHTML(productGroup, +indGroup + 1);
        }

        this.container.innerHTML = contentTaskApplicationHTML;
    }

    updateSources(containerSources, groupId, productId) {
        let sources = [];
        for (let source of containerSources.querySelectorAll('select')) {
            sources.push(source.value);
        }

        this.dataManager.searchProduct(groupId, productId).setSources(sources);
    }

    getGroupId(element) {
        const containerProductRow = element.closest('.offer-group');
        const groupId = containerProductRow.dataset.groupId;
        return groupId;
    }

    getGroupProductId(element) {
        const containerProductRow = element.closest('.product-row');
        const groupId = containerProductRow.dataset.groupId;
        const productId = containerProductRow.dataset.productId;
        return { groupId: groupId, productId: productId};
    }

    getTechnologyId(element) {
        const containerTechnologyRow = element.closest('.technology-row');
        const technologyId = containerTechnologyRow.dataset.technologyId;
        const { groupId, productId} = this.getGroupProductId(element);
        return { groupId: groupId, productId: productId, technologyId: technologyId };
    }

};
