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



// export class TemplateTaskOffer {
//     constructor(fieldGroup, fieldProduct, fieldTechnology, fieldFilms, filmsDataList) {
//         this.fieldGroup = fieldGroup;
//         this.fieldProduct = fieldProduct;
//         this.fieldTechnology = fieldTechnology;
//         this.fieldFilms = fieldFilms;
//         this.filmsDataList = filmsDataList;
//     }


//     getGroupProductsOfferHTML(groupData, numberGroup = 1) {
//         let products = groupData?.products || [];
//         if (products.length === 0) {
//             products = [];
//         }
    
//         let productsHTML = '';
//         for (let ind in products) {
//             const deliveryHTML = (ind == 0) ? this.getDeliveryHTML(groupData, products.length) : '';
//             productsHTML += this.getProductHTML(groupData, products[ind], deliveryHTML, +ind + 1);
//         }
    
//         return `
//             <div class="offer-group" data-group-id="${groupData.id}">
//                 <div class="task-container__group-title">
//                     <span>Группа ${numberGroup}: </span><input type="text" placeholder="Название" value="${this.customToString(groupData.title)}" data-group-field="title" data-group-type="text">
//                 </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th class="">№</td>
//                             <th class="">о позиции</td>
//                             <th class="">в КП</td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''} data-group-field="repeatTechnologies" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>технология</span>
//                             </td>
//                             <th class="task-container__group-header-consumption">
//                                 <div>
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatConsumption ? 'checked' : ''} data-group-field="repeatConsumption" data-group-type="checkbox">
//                                         <span class="slider round"></span>
//                                         </label>
//                                     <span>расход (1ед.)</span>
//                                 </div>
//                                 <div>
//                                     <span>м2</span>
//                                     <span>прод</span>
//                                 </div>
//                             </td>
//                             <th class="task-container__group-header-area-mounting">
//                                 <span>м2 монт</span>
//                             </td>
//                             <th class=""></td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatMeasurement ? 'checked' : ''} data-group-field="repeatMeasurement" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>замер</span>
//                             </td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatDesign ? 'checked' : ''} data-group-field="repeatDesign" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>дизайн</span>
//                             </td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatMontage ? 'checked' : ''} data-group-field="repeatMontage" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>монтаж</span>
//                             </td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatDeadline ? 'checked' : ''} data-group-field="repeatDeadline" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>сроки</span>
//                             </td>
//                             <th class="">
//                                 <span>демонтаж(1ед.)</span>
//                             </td>
//                             <th class="">
//                                 <span>командировка / выезд</span>
//                             </td>
//                             <th class="">
//                                 <span>доставка</span>
//                             </td>
//                             <th class="">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatDelivery ? 'checked' : ''} data-group-field="repeatDelivery" data-group-type="checkbox">
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>цп</span>
//                             </td>
//                             <th class=""></td>
//                             <th class=""></td>
//                             <th class="">
//                                 <div>доб. в заказ</div>
//                             </td>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${productsHTML}
//                     </tbody>
//                 </table>
//             </div>
    
//         `;
//     }

//     getProductHTML(groupData, productData, deliveryHTML, number) {
//         let technologies = productData?.technologies || [];
//         if (!technologies.length) {
//             technologies = [];
//         }
    
//         return `
//             <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupData.id}">
//                 <td class="block-center">
//                     <div class="task-container__item-number">${number}</div>
//                 </td>
//                 <td>
//                     <div>
//                         <div class="task-container__item-info">
//                             <div class="task-container__item-title">
//                                 <input type="text" name="" id="" placeholder="название" value="${this.customToString(productData.title)}" data-product-field="title" data-product-type="text">
//                             </div>
//                             <div class="task-container__item-count">
//                                 <input type="text" name="" id="" placeholder="количество" value="${this.customToString(productData.quantity)}" data-product-field="quantity" data-product-type="text">
//                             </div>
//                             <div class="task-container__item-desc">
//                                 <textarea name="" id=""  rows="3" placeholder="описание" data-product-field="description" data-product-type="textarea">${this.customToString(productData.description)}</textarea>
//                             </div>
//                         </div>
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-is-offers">
//                         ${this.getIsOffersHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-technologies">
//                         ${this.getTechnologiesHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-consumption">
//                         ${this.getConsumptionHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-area-mountings">
//                         ${this.getAreaMountingHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-amounts">
//                         ${this.getAmountsHTML(technologies)}
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-measure">
//                         <div class="task-container__item-measure-status">
//                             <input type="text" name="" id="" value="${this.customToString(productData.measurement)}" data-product-field="measurement" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-measure-address">
//                             <input type="text" name="" id="" value="${this.customToString(productData.measurementAddress)}" data-product-field="measurementAddress" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-measure-costprice">
//                             <input type="number" name="" id="" placeholder="себест. замера" value="${this.customToString(productData.measurementCost)}" data-product-field="measurementCost" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-measure-symbol-plus">+</div>
//                         <div class="task-container__item-measure-value-persent">
//                             <input type="number" name="" id="" value="${this.customToString(productData.measurementPercent)}" data-product-field="measurementPercent" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-measure-symbol-percent">%</div>
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-design">
//                         <div class="task-container__item-design-type">
//                             <select name="" id="" data-product-field="design" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
//                             </select>
//                         </div>
//                         <div class="task-container__item-design-amount">
//                             <input type="number" name="" id="" value="${this.customToString(productData.designPayment)}" data-product-field="designPayment" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-design-symbol-rub">₽</div>
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-mounting">
//                         <div class="task-container__item-mounting-city">
//                             <input type="text" name="" id="" value="${this.customToString(productData.installCity)}"  data-product-field="installCity" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-mounting-count-day">
//                             <input type="number" name="" id="" placeholder="сколько дней" value="${this.customToString(productData.installDays)}" data-product-field="installDays" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-mounting-symbol-mul">
//                             <i class="bi bi-x"></i>
//                         </div>
//                         <div class="task-container__item-mounting-type">
//                             <input type="text" name="" id="" value="${this.customToString(productData.installPlace)}" data-product-field="installPlace" data-product-type="text">
//                         </div>
//                         <div class="task-container__item-mounting-costprice">
//                             <input type="number" name="" id="" placeholder="себ. аренды за день" value="${this.customToString(productData.installCost)}" data-product-field="installCost" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-mounting-symbol-plus">+</div>
//                         <div class="task-container__item-mounting-value-percent">
//                             <input type="number" name="" id="" value="${this.customToString(productData.installPercentage)}" data-product-field="installPercentage" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-mounting-symbol-percent">%</div>
//                         <div class="empty-1"></div>
//                         <div class="empty-2"></div>
//                         <div class="empty-3"></div>
//                         <div class="empty-4"></div>
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-deadlines">
//                         <div class="task-container__item-deadlines-type">
//                             <select name="" id="" data-product-field="terms" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}
//                             </select>
//                         </div>
//                         <div class="task-container__item-deadlines-data">
//                             <input type="date" name="" id="" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-product-type="date">
//                         </div>
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-dismantling">
//                         <div class="task-container__item-dismantling-area">
//                             <input type="number" name="" id="" value="${this.customToString(productData.dismantlingArea)}" data-product-field="dismantlingArea" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-dismantling-difficulty-desc">
//                             <select class="task-container_group-item-dismantling-top" name="" id="" data-product-field="dismantling" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
//                             </select>    
//                         </div>
//                         <div class="task-container__item-dismantling-difficulty-price">
//                             <input type="number" name="" id="" placeholder="сложн. демонтожа" value="${this.customToString(productData.dismantlingComplexity)}" data-product-field="dismantlingComplexity" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-dismantling-cost-desc">
//                             <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="dismantlingDesc" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
//                             </select>
//                         </div>
//                         <div class="task-container__item-dismantling-cost-price">
//                             <input type="number" name="" id="" placeholder="себест. демонтожа" value="${this.customToString(productData.dismantlingCost)}" data-product-field="dismantlingCost" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-dismantling-symbol-plus">+</div>
//                         <div class="task-container__item-dismantling-value-percent">
//                             <input type="number" name="" id="" value="${this.customToString(productData.dismantlingPercent)}" data-product-field="dismantlingPercent" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-dismantling-symbol-percent">%</div>
//                         <div class="empty-1"></div>
//                     </div>
//                 </td>
//                 <td class="block-center">
//                     <div class="task-container__item-business-trip">
//                         <div class="task-container__item-business-trip-type" value="${this.customToString(productData.businessTrip)}">
//                             <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="businessTrip" data-product-type="select">
//                                 ${this.getOptionsHTML(this.fieldProduct?.[SP_PRODUCT_FIELDS.businessTrip]?.items, productData.businessTrip)}
//                             </select>
//                         </div>
//                         <div class="task-container__item-business-trip-costprice">
//                             <input type="number" name="" id="" placeholder="себест. командировки" value="${this.customToString(productData.businessTripCost)}" data-product-field="businessTripCost" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-business-trip-symbol-plus">+</div>
//                         <div class="task-container__item-business-trip-value-percent">
//                             <input type="number" name="" id="" value="${this.customToString(productData.businessTripPercent)}" data-product-field="businessTripPercent" data-product-type="number">
//                         </div>
//                         <div class="task-container__item-business-trip-symbol-percent">%</div>
//                     </div>
//                 </td>
//                     ${deliveryHTML}
//                 <td>
//                     <div class="task-container__item-summary-percents">
//                         ${this.getSummaryPercentHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-summary-amounts">
//                         ${this.getSummaryAmountHTML(technologies)}
//                     </div>
//                 </td>
//                 <td>
//                     <div class="task-container__item-addeds">
//                         ${this.getAddedProductHTML(technologies)}
//                     </div>
//                 </td>
//             </tr>
//         `;
//     }

//     getIsOffersHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             let checked = technology.inKP ? 'checked' : '';
//             contentHTML += `
//                 <div class="task-container__item-is-offer technology-item technology-row" data-technology-id="${technology.id}">
//                     <input type="checkbox" name="" id="" ${checked} data-technology-field="inKP" data-technology-type="checkbox">
//                 </div>
//             `;
//         }
//         return contentHTML;
//     }

//     getTechnologiesHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-technology technology-row" data-technology-id="${technology.id}">
//                     <div class="task-container__item-technology-type">
//                         <select name="" id="" data-technology-field="general" data-technology-type="select">
//                             ${this.getOptionsHTML(this.fieldTechnology?.[SP_TECHOLOGY_FIELDS.general]?.items, technology.general)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technology-material-1">
//                         <select name="" id="" data-technology-field="film" data-technology-type="select">
//                             ${this.getFilmsTypeOptionsHTML(technology.film)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technology-material-2">
//                         <select name="" id="" data-technology-field="lamination" data-technology-type="select">
//                             ${this.getFilmsLaminationsOptionsHTML(technology.film, technology.lamination)}
//                         </select>
//                     </div>
//                     <div class="task-container__item-technology-price">
//                         <input class="vertical-input" type="number" name="" id="" placeholder="Цена" value="${this.customToString(technology.price)}" data-technology-field="price" data-technology-type="number">
//                     </div>
//                 </div>
//             `;
//         }
//         return contentHTML;
//     }

//     getConsumptionHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-consumption-item technology-row" data-technology-id="${technology.id}">
//                     <div class="task-container__item-consumption-item-img">🖼</div>
//                     <div class="task-container__item-consumption-item-title">
//                         <input type="text" name="" id="" placeholder="ЧПП" value="${this.customToString(technology.CHPP)}" data-technology-field="CHPP" data-technology-type="text">
//                     </div>
//                     <div class="task-container__item-consumption-item-empty"></div>
//                     <div class="task-container__item-consumption-item-m2">м2</div>
//                     <div class="task-container__item-consumption-item-width">
//                         <input type="number" name="" id="" placeholder="|&harr;|" value="${this.customToString(technology.width)}" data-technology-field="width" data-technology-type="number">
//                     </div>
//                     <div class="task-container__item-consumption-item-product">
//                         <i class="bi bi-x"></i>
//                     </div>
//                     <div class="task-container__item-consumption-item-length">
//                         <input type="number" name="" id="" placeholder="п.м." value="${this.customToString(technology.runningMeter)}" data-technology-field="runningMeter" data-technology-type="number">
//                     </div>
//                     <div class="task-container__item-consumption-item-result">=${this.mulNumbmer(technology.width, technology.runningMeter)}</div>
//                 </div>
//             `;
//         }
    
//         return contentHTML;
//     }
    
//     getAreaMountingHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-area-mounting technology-item technology-row" data-technology-id="${technology.id}">
//                     <input type="number" name="" id="" placeholder="Площадь монтажа" value="${this.customToString(technology.installArea)}" data-technology-field="installArea" data-technology-type="number">
//                 </div>
//             `;
//         }
    
//         return contentHTML;
//     }
    
//     getAmountsHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-amount technology-item technology-row" data-technology-id="${technology.id}">
//                     <div class="task-container__item-amount-costprice">
//                         <input type="number" name="" id="" placeholder="себест. монт." value="${this.customToString(technology.installCost)}" data-technology-field="installCost" data-technology-type="number">
//                     </div>
//                     <div class="task-container__item-amount-symbol-plus">+</div>
//                     <div class="task-container__item-amount-value-percent">
//                         <input type="number" name="" id="" value="${this.customToString(technology.installPercent)}" data-technology-field="installPercent" data-technology-type="number">
//                     </div>
//                     <div class="task-container__item-amount-symbol-percent">%</div>
//                 </div>
//             `;
//         }
    
//         return contentHTML;
//     }
    
//     getSummaryPercentHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-summary-percent technology-item technology-row" data-technology-id="${technology.id}">
//                     <div class="task-container__item-summary-percent-plus">+</div>
//                     <div class="task-container__item-summary-percent-value">
//                         <input type="number" name="" id="" value="${this.customToString(technology.totalPercent)}" data-technology-field="totalPercent" data-technology-type="number">
//                     </div>
//                     <div class="task-container__item-summary-percent-percent">%</div>
//                 </div>
//             `;
//         }
//         return contentHTML;
//     }
    
    
//     getSummaryAmountHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             contentHTML += `
//                 <div class="task-container__item-summary-amount technology-item">
//                     <span class="task-container__item-summary-amount-value" data-product-field="dismantling" data-product-type="number">${this.numberToStr(technology.amount)}</span> &nbsp; ₽
//                 </div>
//             `;
//         }
//         return contentHTML;
//     }
    
//     getAddedProductHTML(technologies) {
//         let contentHTML = '';
    
//         for (let technology of technologies) {
//             let checked = technology.addedToOrder ? 'checked' : '';
//             contentHTML += `
//                 <div class="task-container__item-added technology-item technology-row" data-technology-id="${technology.id}">
//                     <input type="checkbox" name="" id="" ${checked} data-technology-field="addedToOrder" data-technology-type="checkbox">
//                 </div>
//             `;
//         }
//         return contentHTML;
//     }
    
    
//     getDeliveryHTML(groupData, technologiesCount) {
//         return `
//             <td class="shared block-center" style="grid-row: span ${technologiesCount}">
//                 <div class="task-container__item-delivery-container">
//                     <div class="task-container__item-delivery">
//                         <div class="task-container__item-delivery-count">
//                             <input type="number" name="" id="" placeholder="сколько раз" value="${this.customToString(groupData.deliveryCount)}" data-group-field="deliveryCount" data-group-type="number">
//                         </div>
//                         <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
//                         <div class="task-container__item-delivery-price">
//                             <input type="number" name="" id="" placeholder="себес. доставки за раз" value="${this.customToString(groupData.deliveryCostOne)}" data-group-field="deliveryCostOne" data-group-type="number">
//                         </div>
//                     </div>
//                 </div>
//             </td>
//             <td class="shared block-center" style="grid-row: span ${technologiesCount}">
//                 <div class="task-container__item-delivery-cp-container">
//                     <div class="task-container__item-delivery-cp">
//                         <div class="task-container__item-delivery-cp-method">
//                             <select name="" id="" data-group-field="deliveryMethod" data-group-type="select">
//                                 ${this.getOptionsHTML(this.fieldGroup?.[SP_GROUP_FIELDS.deliveryMethod]?.items, groupData.deliveryMethod)}
//                             </select>
//                         </div>
//                         <div class="task-container__item-delivery-cp-address">
//                             <textarea name="" id="" rows="2" data-group-field="deliveryAddress" data-group-type="textarea">${this.customToString(groupData.deliveryAddress)}</textarea>
//                         </div>
//                         <div class="task-container__item-delivery-cp-cost">
//                             <input type="number" name="" id="" placeholder="себес. курьер. ЦП" value="${this.customToString(groupData.deliveryCost)}" data-group-field="deliveryCost" data-group-type="number">
//                         </div>
//                         <div class="task-container__item-delivery-cp-symbol-plus">+</div>
//                         <div class="task-container__item-delivery-cp-percent">
//                             <input type="number" name="" id="" value="${this.customToString(groupData.deliveryPercentage)}" data-group-field="deliveryPercentage" data-group-type="number">
//                         </div>
//                         <div class="task-container__item-delivery-cp-symbol-percent">%</div>
//                     </div>
//                 </div>
//             </td>
//         `;
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

//     mulNumbmer(num1, num2) {
//         try {
//             num1 = parseFloat(num1) || 0;
//             num2 = parseFloat(num2) || 0;
//         } catch (e) {
//             num1 = 0;
//             num2 = 0;
//         }
//         const res = num1 * num2;
//         return res.toFixed(1);
//     }

//     numberToStr(value) {
//         if (value === 0) {
//             return "0";
//         } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
//             return "0";
//         } else {
//             return value.toFixed(2);
//         }
//     }

//     formatDateForInput(dateString) {
//         if (!dateString) return "";
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         let month = (date.getMonth() + 1).toString().padStart(2, '0');
//         let day = date.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }
// };
