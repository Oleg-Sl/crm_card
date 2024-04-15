// import { DataManager } from "./data_manager.js";
// import { ProductGroup } from './product_group.js';
// import { Product } from './product.js';
// import { Technology } from './technology.js';
// import {
//     SP_GROUP_ID,
//     SP_PRODUCT_ID,
//     SP_TECHOLOGY_ID,
//     SP_FILMS_ID,
//     SP_GROUP_FIELDS,
//     SP_PRODUCT_FIELDS,
//     SP_TECHOLOGY_FIELDS,
//     SP_FILMS_FIELDS,
// } from '../parameters.js';


// export default class TaskManager {
//     constructor(container, bx24, dealId) {
//         this.container = container;
//         this.bx24 = bx24;
//         this.dealId = dealId;

//         this.application = this.container.querySelector('#taskApplication');
//         this.commercial_offer = this.container.querySelector('#taskOffer');
//         this.order = this.container.querySelector('#taksOrder');

//         this.fieldGroup = null;
//         this.fieldProduct = null;
//         this.fieldTechnology = null;

//         this.dataManager = new DataManager(this.bx24, this.dealId, this.commercial_offer, this.application, this.order);
//         // this.dataManager.init({
//         //     fieldGroup: this.fieldGroup,
//         //     fieldProduct: this.fieldProduct,
//         //     fieldTechnology: this.fieldTechnology,
//         //     fieldFilms: this.fieldFilms,
//         //     filmsDataList: this.filmsDataList,
//         // });
//     }

//     async init() {
//         const { technologiesDataList, productsDataList, groupsDataList } = await this.getProductsData();

//         this.dataManager.init({
//             fieldGroup: this.fieldGroup,
//             fieldProduct: this.fieldProduct,
//             fieldTechnology: this.fieldTechnology,
//             fieldFilms: this.fieldFilms,
//             filmsDataList: this.filmsDataList,
//         });

//         this.addProducts(groupsDataList, productsDataList,technologiesDataList );
//         this.dataManager.updateHTML();
//     }


//     async initReload() {
//         const { technologiesDataList, productsDataList, groupsDataList } = await this.getProductsData();

//         this.dataManager.clear();

//         this.addProducts(groupsDataList, productsDataList,technologiesDataList );
//         this.dataManager.updateHTML();
//     }

//     addProducts(groupsDataList, productsDataList, technologiesDataList) {
//         for (let groupData of groupsDataList) {
//             let group = new ProductGroup(groupData);
//             this.dataManager.addProductGroup(group);
//         }

//         for (let productData of productsDataList) {
//             let product = new Product(productData); 
//             for (let group of this.dataManager.productGroups) {
//                 if (group.id === product.parentId) {
//                     group.addProduct(product);
//                 }
//             }
//         }

//         for (let technologyData of technologiesDataList) {
//             let technology = new Technology(technologyData);
//             for (let group of this.dataManager.productGroups) {
//                 for (let product of group.products) {
//                     if (product.id === technology.parentId) {
//                         product.addTechnology(technology);
//                     }
//                 }
//             }
//         }
//     }

//     async getProductsData() {
//         const data = await this.bx24.batch.getData({
//             fieldGroup: `crm.item.fields?entityTypeId=${SP_GROUP_ID}`,
//             fieldProduct: `crm.item.fields?entityTypeId=${SP_PRODUCT_ID}`,
//             fieldTechnology: `crm.item.fields?entityTypeId=${SP_TECHOLOGY_ID}`,
//             fieldFilms: `crm.item.fields?entityTypeId=${SP_FILMS_ID}`,
//             filmsDataList: `crm.item.list?entityTypeId=${SP_FILMS_ID}`,
//             [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
//             [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
//             [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
//         });
//         this.fieldGroup = data?.fieldGroup?.fields;
//         this.fieldProduct = data?.fieldProduct?.fields;
//         this.fieldTechnology = data?.fieldTechnology?.fields;
//         this.fieldFilms = data?.fieldFilms?.fields;

//         this.filmsDataList = data?.filmsDataList?.items || [];
//         const technologiesDataList = data?.[SP_TECHOLOGY_ID]?.items || [];
//         const productsDataList = data?.[SP_PRODUCT_ID]?.items || [];
//         const groupsDataList = data?.[SP_GROUP_ID]?.items || [];

//         return { technologiesDataList, productsDataList, groupsDataList };
//     }

//     getChangedData() {
//         return this.dataManager.getChangedData();
//     }
// }

