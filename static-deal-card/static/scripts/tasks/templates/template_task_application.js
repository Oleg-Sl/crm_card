// import {
//     SP_GROUP_ID,
//     SP_PRODUCT_ID,
//     SP_TECHOLOGY_ID,
//     SP_FILMS_ID,
//     SP_GROUP_FIELDS,
//     SP_PRODUCT_FIELDS,
//     SP_TECHOLOGY_FIELDS,
//     SP_FILMS_FIELDS,
// } from '../../parameters.js';



// export class TemplateTaskApplication {
//     constructor(fieldGroup, fieldProduct, fieldTechnology, fieldFilms, filmsDataList) {
//         this.fieldGroup = fieldGroup;
//         this.fieldProduct = fieldProduct;
//         this.fieldTechnology = fieldTechnology;
//         this.fieldFilms = fieldFilms;
//         this.filmsDataList = filmsDataList;
//     }

//     getGroupProductsHTML(groupData, numberGroup = 1) {
//         let products = groupData?.products || [];
//         if (products.length === 0) {
//             products = [];
//         }

//         let productsHTML = '';
//         for (let ind in products) {
//             const productData = products[ind];
//             productsHTML += this.getProductHTML(groupData, productData, +ind + 1);
//         }

//         return `
//             <div class="application-group" data-group-id="${groupData.id}">
//                 <div class="task-container__group-title">
//                     <span>Группа ${numberGroup}: </span><input type="text" placeholder="Название" value="${groupData.title}" data-group-field="title" data-group-type="text">
//                 </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>
//                                 <div class="task-container_group-header-add-group"><i class="bi bi-plus-circle-fill"></i></div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-product-desc">о позиции</div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-technology">
//                                     <div>
//                                         <label class="switch">
//                                             <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''} data-group-field="repeatTechnologies" data-group-type="checkbox">
//                                             <span class="slider round"></span>
//                                         </label>
//                                         <span>технология</span>
//                                     </div>
//                                     <span>+/-</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-sources">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatSources ? 'checked' : ''} data-group-field="repeatSources" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>исходники</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-measurements">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatMeasurement ? 'checked' : ''} data-group-field="repeatMeasurement" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>замер</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-design">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatDesign ? 'checked' : ''} data-group-field="repeatDesign" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>дизайн</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-color">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatDelivery ? 'checked' : ''} data-group-field="repeatDelivery" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>ЦП</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-mounting">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatMontage ? 'checked' : ''} data-group-field="repeatMontage" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>монтаж</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-deadlines">
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatDeadline ? 'checked' : ''} data-group-field="repeatDeadline" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>сроки</span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div class="task-container_group-header-dismantling">
//                                     <span>демонтаж</span>
//                                 </div>
//                             </th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${productsHTML}
//                     </tbody>
//                 </table>
//             </div>
//         `;
//     }

//     getProductHTML(groupData, productData, number) {
//         let technologies = productData?.technologies || [];
//         if (!technologies.length) {
//             technologies = [];
//         }

//         return `
//             <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupData.id}">
//                 <td>
//                     <div class="task-container__item-number"><div>${number}</div></div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-info">
//                         <div class="task-container__item-info-title">
//                             <input type="text" name="" id="" placeholder="название" value="${this.customToString(productData.title)}" data-product-field="title" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-info-count">
//                             <input type="text" name="" id="" placeholder="количество" value="${this.customToString(productData.quantity)}" data-product-field="quantity" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-info-desc">
//                             <textarea name="" id=""  rows="3" placeholder="описание" data-product-field="description" data-product-type="textarea">${this.customToString(productData.description)}</textarea>
//                         </div>
//                     </div>
//                 </td>
//                 <td class="task-container__item-technologies">
//                     <div class="task-container__item-technologies-list">
//                         <div class="task-container__item-technologies-list-container">
//                             ${this.getTechnologiesHTML(technologies)}
//                         </div>
//                     </div>
//                     <div class="task-container__item-technology-add">
//                         <i class="bi bi-plus-square"></i>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-sources">
//                     <div class="task-container_group-item-sources-list">
//                         ${this.getSourcesHTML(productData.sources || [{}])}
//                     </div>
//                     <div class="task-container_group-item-sources-add">
//                         <i class="bi bi-plus-square"></i>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-measurements">
//                     <div class="task-container_group-item-measurements-list" data-value="${this.customToString(productData.measurement)}">
//                         <select name="" id="" data-product-field="measurement" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.measurement]?.items, productData.measurement)}
//                         </select>
//                         <select name="" id="">
//                         </select>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-design">
//                     <div class="task-container_group-item-design-list">
//                         <select name="" id="" data-product-field="design" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
//                         </select>
//                         <select name="" id="" data-product-field="designPayment" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.designPayment]?.items, productData.designPayment)}
//                         </select>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-color-test">
//                     <div class="task-container_group-item-color-test-list">
//                         <select name="" id="" data-group-field="delivery" data-group-type="select">
//                             ${this.getOptionsHTML(this.fieldGroup?.[SP_GROUP_FIELDS.delivery]?.items, groupData.delivery)}
//                         </select>
//                         <select name="" id="">
//                             <option value=""></option>
//                         </select>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-mounting">
//                     <div class="task-container_group-item-mounting-container">
//                         <div class="task-container_group-item-mounting-left ">
//                             <select class="" name="" id="" data-product-field="installTime" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.installTime]?.items, productData.installTime)}
//                             </select>
//                         </div>
//                         <select class="task-container_group-item-mounting-top" name="" id="" data-product-field="installCity" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.installCity]?.items, productData.installCity)}
//                         </select>
//                         <select class="task-container_group-item-mounting-bottom" name="" id="" data-product-field="installPlace" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.installPlace]?.items, productData.installPlace)}
//                         </select>
//                         <div class="task-container_group-item-mounting-right ">
//                             <select class="" name="" id="" data-product-field="installComplexity" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.installComplexity]?.items, productData.installComplexity)}
//                             </select>
//                         </div>
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-deadlines">
//                     <div class="task-container_group-item-deadlines-list">
//                         <select name="" id="" data-product-field="terms" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}
//                         </select>
//                         <input type="date" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-product-type="date">
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-dismantling">
//                     <div class="task-container_group-item-dismantling-container">
//                         <select class="task-container_group-item-dismantling-top" name="" id="" data-product-field="dismantling" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
//                         </select>
//                         <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="dismantlingDesc" data-product-type="select">
//                             ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
//                         </select>
//                         <input class="task-container_group-item-dismantling-area vertical-input" type="number" name="" id="" value="${productData.dismantlingArea || 0}" data-product-field="dismantlingArea" data-product-type="number">
//                     </div>
//                 </td>
//                 <td class="task-container_group-item-right">
//                     <div class="task-container_group-item-move"><i class="bi bi-list"></i></div>
//                     <div class="task-container_group-item-add"><i class="bi bi-plus-circle-fill"></i></div>
//                     <div class="task-container_group-item-copy"><i class="bi bi-copy"></i></div>
//                     <div class="task-container_group-item-remove"><i class="bi bi-x-square"></i></div>
//                 </td>
//             </tr>
//         `;
//     }

//     getTechnologiesHTML(technologies) {
//         let contentHTML = '';
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-technologies-technology technology-row" data-technology-id="${technology.id}">
//                     <div class="task-container__item-technologies-technology-mchs">
//                         <span>МЧС</span>
//                         <label class="switch">
//                             <input type="checkbox" ${technology.MCHS ? 'checked' : ''} data-technology-field="MCHS" data-technology-type="checkbox">
//                             <span class="slider round"></span>
//                         </label>
//                     </div>
//                     <div class="task-container__item-technologies-technology-type">
//                         <select name="" id="" data-technology-field="general" data-technology-type="select">
//                             ${this.getOptionsHTML(this.fieldTechnology?.[SP_TECHOLOGY_FIELDS.general]?.items, technology.general)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technologies-technology-material-1">
//                         <select name="" id="" data-technology-field="film" data-technology-type="select">
//                             ${this.getFilmsTypeOptionsHTML(technology.film)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technologies-technology-material-2">
//                         <select name="" id="" data-technology-field="lamination" data-technology-type="select">
//                             ${this.getFilmsLaminationsOptionsHTML(technology.film, technology.lamination)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technologies-technology-remove">
//                         <i class="bi bi-dash-square"></i>
//                     </div>
//                 </div>
//             `;
//         }

//         return contentHTML;
//     }

//     getSourcesHTML(sources) {
//         let contentHTML = '';

//         for (const source in sources) {
//             contentHTML += `
//                 <div class="task-container_group-item-sources-item">
//                     <div class="task-container_group-item-sources-item-prev">🖼</div>
//                     <div class="task-container_group-item-sources-item-value" data-value="">
//                         <select class="product-source-select" name="" id="">
//                             <option value="1">печать</option>
//                             <option value="2">печать + конт. резка</option>
//                             <option value="3">плотерка</option>
//                         </select>
//                     </div>
//                     <div class="task-container_group-item-sources-remove">
//                         <i class="bi bi-dash-square"></i>
//                     </div>
//                 </div>
//             `;
//         }

//         return contentHTML;
//     }

//     getOptionsHTML(fields, value) {
//         let contentHTML = '<option value=""></option>';
//         for (const field of fields) {
//             if (field.ID == value) {
//                 contentHTML += `<option value="${field.ID}" selected>${field.VALUE}</option>`;
//             } else {
//                 contentHTML += `<option value="${field.ID}">${field.VALUE}</option>`;
//             }
//         }
//         return contentHTML;
//     }

//     customToString(value) {
//         if (value === 0) {
//             return "0";
//         } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
//             return "";
//         } else {
//             return value;
//         }
//     }

//     getFilmsTypeOptionsHTML(filmId) {
//         let filmsListHTML = '<option value=""></option>';
//         for (let film of this.filmsDataList) {
//             if (film.id == filmId) {
//                 filmsListHTML += `<option value="${film.id}" selected>${film.title}</option>`
//             } else {
//                 filmsListHTML += `<option value="${film.id}">${film.title}</option>`
//             }
//         }

//         return filmsListHTML;
//     }

//     getFilmsLaminationsOptionsHTML(filmId, activeLamination) {
//         let laminationsListHTML = '<option value=""></option>';
//         const film = this.filmsDataList.find(film => film.id == filmId) || {};
//         const laminationsList = film[SP_FILMS_FIELDS.laminations] || [];

//         for (let lamination of laminationsList) {
//             if (lamination == activeLamination) {
//                 laminationsListHTML += `<option value="${lamination}" selected>${lamination}</option>`
//             } else {
//                 laminationsListHTML += `<option value="${lamination}">${lamination}</option>`
//             }
//         }

//         return laminationsListHTML;
//     }

//     getFilmsWidthsOptionsHTML(filmId, activeWidth) {
//         let widthsListHTML = '<option value=""></option>';
//         const film = this.filmsDataList.find(film => film.id == filmId) || {};
//         const widthsList = film[SP_FILMS_FIELDS.widths] || [];
//         for (let width of widthsList) {
//             if (width == activeWidth) {
//                 widthsListHTML += `<option value="${width}" selected>${width}</option>`
//             } else {
//                 widthsListHTML += `<option value="${width}">${width}</option>`
//             }
//         }

//         return widthsListHTML;
//     }

//     customToString(value) {
//         if (value === 0) {
//             return "0";
//         } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
//             return "";
//         } else {
//             return value;
//         }
//     }
// };
