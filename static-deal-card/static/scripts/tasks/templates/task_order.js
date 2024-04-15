
// export function getGroupProductsOrderHTML(groupData) {
//     let products = groupData?.products || [];
//     if (products.length === 0) {
//         products = [{}];
//     }

//     let productsHTML = '';
//     for (let ind in products) {
//         const deliveryHTML = (ind == 0) ? getDeliveryHTML(groupData, products.length) : '';
//         productsHTML += getProductHTML(products[ind], deliveryHTML, +ind + 1);
//     }

//     return `
//         <div class="offer-group">
//             <div class="task-container__group-title">
//                 <span>Группа 1: </span><input type="text" placeholder="Название" value="${customToString(groupData.title)}">
//             </div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th class="">№</td>
//                         <th class="">о позиции</td>
//                         <th class="">в КП</td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>технология</span>
//                         </td>
//                         <th class="task-container__group-header-consumption">
//                             <div>
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatConsumption ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                     </label>
//                                 <span>расход (1ед.)</span>
//                             </div>
//                             <div>
//                                 <span>м2</span>
//                                 <span>прод</span>
//                             </div>
//                         </td>
//                         <th class="task-container__group-header-area-mounting">
//                             <span>м2 монт</span>
//                         </td>
//                         <th class=""></td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatMeasurement ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>замер</span>
//                         </td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatDesign ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>дизайн</span>
//                         </td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatMontage ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>монтаж</span>
//                         </td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatDeadline ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>сроки</span>
//                         </td>
//                         <th class="">
//                             <span>демонтаж(1ед.)</span>
//                         </td>
//                         <th class="">
//                             <span>командировка / выезд</span>
//                         </td>
//                         <th class="">
//                             <span>доставка</span>
//                         </td>
//                         <th class="">
//                             <label class="switch">
//                                 <input type="checkbox" ${groupData.repeatDelivery ? 'checked' : ''}>
//                                 <span class="slider round"></span>
//                             </label>
//                             <span>цп</span>
//                         </td>
//                         <th class=""></td>
//                         <th class=""></td>
//                         <th class="">
//                             <div>доб. в заказ</div>
//                         </td>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${productsHTML}
//                 </tbody>
//             </table>
//         </div>

//     `;
// }


// function getProductHTML(productData, deliveryHTML, number) {
//     let technologies = productData?.technologies || [];
//     // console.log("technologies = ", technologies);
//     if (!technologies.length) {
//         technologies = [{}];
//     }

//     return `
//         <tr>
//             <td class="block-center">
//                 <div class="task-container__item-number">${number}</div>
//             </td>
//             <td>
//                 <div>
//                     <div class="task-container__item-info">
//                         <div class="task-container__item-title">
//                             <input type="text" name="" id="" placeholder="название" value="${customToString(productData.title)}">
//                         </div>
//                         <div class="task-container__item-count">
//                             <input type="text" name="" id="" placeholder="количество" value="${customToString(productData.quantity)}">
//                         </div>
//                         <div class="task-container__item-desc">
//                             <textarea name="" id=""  rows="3" placeholder="описание">${customToString(productData.description)}</textarea>
//                         </div>
//                     </div>
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-is-offers">
//                     ${getIsOffersHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-technologies">
//                     ${getTechnologiesHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-consumption">
//                     ${getConsumptionHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-area-mountings">
//                     ${getAreaMountingHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-amounts">
//                     ${getAmountsHTML(technologies)}
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-measure">
//                     <div class="task-container__item-measure-status">
//                         <input type="text" name="" id="" value="${customToString(productData.measurement)}" >
//                     </div>
//                     <div class="task-container__item-measure-address">
//                         <input type="text" name="" id="" value="${customToString(productData.measurementAddress)}">
//                     </div>
//                     <div class="task-container__item-measure-costprice">
//                         <input type="number" name="" id="" placeholder="себест. замера" value="${customToString(productData.measurementCost)}">
//                     </div>
//                     <div class="task-container__item-measure-symbol-plus">+</div>
//                     <div class="task-container__item-measure-value-persent">
//                         <input type="number" name="" id="" value="${customToString(productData.measurementPercent)}">
//                     </div>
//                     <div class="task-container__item-measure-symbol-percent">%</div>
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-design">
//                     <div class="task-container__item-design-type" data-value="${customToString(productData.design)}">
//                         <select name="" id="">
//                             <option value="1">Test 1</option>
//                             <option value="2">Test 2</option>
//                             <option value="3">Test 3</option>
//                         </select>
//                     </div>
//                     <div class="task-container__item-design-amount">
//                         <input type="number" name="" id="" value="${customToString(productData.designPayment)}">
//                     </div>
//                     <div class="task-container__item-design-symbol-rub">₽</div>
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-mounting">
//                     <div class="task-container__item-mounting-city">
//                         <input type="text" name="" id="" value="${customToString(productData.installCity)}">
//                     </div>
//                     <div class="task-container__item-mounting-count-day">
//                         <input type="number" name="" id="" placeholder="сколько дней" value="${customToString(productData.installDays)}">
//                     </div>
//                     <div class="task-container__item-mounting-symbol-mul">
//                         <i class="bi bi-x"></i>
//                     </div>
//                     <div class="task-container__item-mounting-type">
//                         <input type="text" name="" id="" value="${customToString(productData.installPlace)}">
//                     </div>
//                     <div class="task-container__item-mounting-costprice">
//                         <input type="number" name="" id="" placeholder="себ. аренды за день" value="${customToString(productData.installCost)}">
//                     </div>
//                     <div class="task-container__item-mounting-symbol-plus">+</div>
//                     <div class="task-container__item-mounting-value-percent">
//                         <input type="number" name="" id="" value="${customToString(productData.installPercentage)}">
//                     </div>
//                     <div class="task-container__item-mounting-symbol-percent">%</div>
//                     <div class="empty-1"></div>
//                     <div class="empty-2"></div>
//                     <div class="empty-3"></div>
//                     <div class="empty-4"></div>
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-deadlines">
//                     <div class="task-container__item-deadlines-type" data-value="${customToString(productData.terms)}">
//                         <select name="" id="">
//                             <option value="1">Item 1</option>
//                             <option value="2">Item 2</option>
//                             <option value="3">Item 3</option>
//                         </select>
//                     </div>
//                     <div class="task-container__item-deadlines-data">
//                         <input type="date" name="" id="" value="${customToString(productData.termsDate)}">
//                     </div>
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-dismantling">
//                     <div class="task-container__item-dismantling-area">
//                         <input type="number" name="" id="" value="${customToString(productData.dismantlingArea)}">
//                     </div>
//                     <div class="task-container__item-dismantling-difficulty-desc">
//                         <input type="text" name="" id="" value="${customToString(productData.dismantling)}">
//                     </div>
//                     <div class="task-container__item-dismantling-difficulty-price">
//                         <input type="number" name="" id="" placeholder="сложн. демонтожа" value="${customToString(productData.dismantlingComplexity)}">
//                     </div>
//                     <div class="task-container__item-dismantling-cost-desc">
//                         <input type="text" name="" id="" value="${customToString(productData.dismantlingDesc)}">
//                     </div>
//                     <div class="task-container__item-dismantling-cost-price">
//                         <input type="number" name="" id="" placeholder="себест. демонтожа" value="${customToString(productData.dismantlingCost)}">
//                     </div>
//                     <div class="task-container__item-dismantling-symbol-plus">+</div>
//                     <div class="task-container__item-dismantling-value-percent">
//                         <input type="number" name="" id="" value="${customToString(productData.dismantlingPercent)}">
//                     </div>
//                     <div class="task-container__item-dismantling-symbol-percent">%</div>
//                     <div class="empty-1"></div>
//                 </div>
//             </td>
//             <td class="block-center">
//                 <div class="task-container__item-business-trip">
//                     <div class="task-container__item-business-trip-type" value="${customToString(productData.businessTrip)}">
//                         <select name="" id="">
//                             <option value="1">Командировка</option>
//                             <option value="2">Командировка 2</option>
//                             <option value="3">Командировка 3</option>
//                         </select>
//                     </div>
//                     <div class="task-container__item-business-trip-costprice">
//                         <input type="number" name="" id="" placeholder="себест. командировки" value="${customToString(productData.businessTripCost)}">
//                     </div>
//                     <div class="task-container__item-business-trip-symbol-plus">+</div>
//                     <div class="task-container__item-business-trip-value-percent">
//                         <input type="number" name="" id="" value="${customToString(productData.businessTripPercent)}">
//                     </div>
//                     <div class="task-container__item-business-trip-symbol-percent">%</div>
//                 </div>
//             </td>
//             ${deliveryHTML}
//             <td>
//                 <div class="task-container__item-summary-percents">
//                     ${getSummaryPercentHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-summary-amounts">
//                     ${getSummaryAmountHTML(technologies)}
//                 </div>
//             </td>
//             <td>
//                 <div class="task-container__item-addeds">
//                     ${getAddedProductHTML(technologies)}
//                 </div>
//             </td>
//         </tr>
//     `;
// }


// function getIsOffersHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         let checked = technology.inKP ? 'checked' : '';
//         contentHTML += `
//             <div class="task-container__item-is-offer technology-item">
//                 <input type="checkbox" name="" id="" ${checked}>
//             </div>
//         `;
//     }
//     return contentHTML;
// }


// function getTechnologiesHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-technology">
//                 <div class="task-container__item-technology-type" data-value="${customToString(technology.general)}">
//                     <select name="" id="">
//                         <option value="1">печать</option>
//                         <option value="2">печать + конт. резка</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technology-material-1" data-value="${customToString(technology.film)}">
//                     <select name="" id="">
//                         <option value="1">3551RA</option>
//                         <option value="2">215GRA</option>
//                         <option value="3">21wdRA</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technology-material-2" data-value="${customToString(technology.lamination)}">
//                     <select name="" id="">
//                         <option value="1">3551RA</option>
//                         <option value="2">215GRA</option>
//                         <option value="3">21wdRA</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technology-price">
//                     <input class="vertical-input" type="number" name="" id="" placeholder="Цена" value="${customToString(technology.price)}">
//                 </div>
//             </div>
//         `;
//     }
//     return contentHTML;
// }


// function getConsumptionHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-consumption-item">
//                 <div class="task-container__item-consumption-item-img">🖼</div>
//                 <div class="task-container__item-consumption-item-title">
//                     <input type="text" name="" id="" placeholder="ЧПП" value="${customToString(technology.CHPP)}">
//                 </div>
//                 <div class="task-container__item-consumption-item-empty"></div>
//                 <div class="task-container__item-consumption-item-m2">м2</div>
//                 <div class="task-container__item-consumption-item-width">
//                     <input type="number" name="" id="" placeholder="|&harr;|" value="${customToString(technology.width)}">>
//                 </div>
//                 <div class="task-container__item-consumption-item-product">
//                     <i class="bi bi-x"></i>
//                 </div>
//                 <div class="task-container__item-consumption-item-length">
//                     <input type="number" name="" id="" placeholder="п.м." value="${customToString(technology.runningMeter)}">
//                 </div>
//                 <div class="task-container__item-consumption-item-result"> = ??</div>
//             </div>
//         `;
//     }

//     return contentHTML;
// }


// function getAreaMountingHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-area-mounting technology-item">
//                 <input type="number" name="" id="" placeholder="Площадь монтажа" value="${customToString(technology.installArea)}">
//             </div>
//         `;
//     }

//     return contentHTML;
// }


// function getAmountsHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-amount technology-item">
//                 <div class="task-container__item-amount-costprice">
//                     <input type="number" name="" id="" placeholder="себест. монт." value="${customToString(technology.installCost)}">
//                 </div>
//                 <div class="task-container__item-amount-symbol-plus">+</div>
//                 <div class="task-container__item-amount-value-percent">
//                     <input type="number" name="" id="" value="${customToString(technology.installPercent)}">>
//                 </div>
//                 <div class="task-container__item-amount-symbol-percent">%</div>
//             </div>
//         `;
//     }

//     return contentHTML;
// }


// function getSummaryPercentHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-summary-percent technology-item">
//                 <div class="task-container__item-summary-percent-plus">+</div>
//                 <div class="task-container__item-summary-percent-value">
//                     <input type="number" name="" id="" value="${customToString(technology.totalPercent)}">
//                 </div>
//                 <div class="task-container__item-summary-percent-percent">%</div>
//             </div>
//         `;
//     }
//     return contentHTML;
// }


// function getSummaryAmountHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-summary-amount technology-item">
//                 <span class="task-container__item-summary-amount-value">000.000</span> &nbsp; ₽
//             </div>
//         `;
//     }
//     return contentHTML;
// }


// function getAddedProductHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         let checked = technology.addedToOrder ? 'checked' : '';
//         contentHTML += `
//             <div class="task-container__item-added technology-item">
//                 <input type="checkbox" name="" id="" ${checked}>
//             </div>
//         `;
//     }
//     return contentHTML;
// }


// function getDeliveryHTML(groupData, technologiesCount) {
//     return `
//         <td class="shared block-center" style="grid-row: span ${technologiesCount}">
//             <div class="task-container__item-delivery-container">
//                 <div class="task-container__item-delivery">
//                     <div class="task-container__item-delivery-count">
//                         <input type="number" name="" id="" placeholder="сколько раз" value="${customToString(groupData.deliveryCount)}">
//                     </div>
//                     <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
//                     <div class="task-container__item-delivery-price">
//                         <input type="number" name="" id="" placeholder="себес. доставки за раз" value="${customToString(groupData.deliveryCostOne)}">
//                     </div>
//                 </div>
//             </div>
//         </td>
//         <td class="shared block-center" style="grid-row: span ${technologiesCount}">
//             <div class="task-container__item-delivery-cp-container">
//                 <div class="task-container__item-delivery-cp">
//                     <div class="task-container__item-delivery-cp-method" data-value="${customToString(groupData.deliveryMethod)}">
//                         <select name="" id="">
//                             <option value="1">Курьер</option>
//                             <option value="2">нет</option>
//                             <option value="3">Думают</option>
//                         </select>
//                     </div>
//                     <div class="task-container__item-delivery-cp-address">
//                         <textarea name="" id="" rows="2">${customToString(groupData.deliveryAddress)}</textarea>
//                     </div>
//                     <div class="task-container__item-delivery-cp-cost">
//                         <input type="number" name="" id="" placeholder="себес. курьер. ЦП" value="${customToString(groupData.deliveryCost)}">
//                     </div>
//                     <div class="task-container__item-delivery-cp-symbol-plus">+</div>
//                     <div class="task-container__item-delivery-cp-percent">
//                         <input type="number" name="" id="" value="${customToString(groupData.deliveryPercentage)}">
//                     </div>
//                     <div class="task-container__item-delivery-cp-symbol-percent">%</div>
//                 </div>
//             </div>
//         </td>
//     `;
// }

// function customToString(value) {
//     if (value === 0) {
//         return "0";
//     } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
//         return "";
//     } else {
//         return value;
//     }
// }


// // export function getGroupProductsHTML(groupData) {
// //     let products = groupData?.products || [];
// //     if (products.length === 0) {
// //         products = [{}];
// //     }
// //     let productsHTML = '';
// //     for (let product of products) {
// //         productsHTML += getProductHTML(product);
// //     }

// //     return `
// //         <div class="task-container__group">
// //             <div class="task-container__group" id="taksOffer">
// //                 <div class="task-container__group-title">
// //                     <span>Группа 1: </span><input type="text" placeholder="Название" value="${groupData.title || ''}">
// //                 </div>
// //                 <div class="task-container__group-data">
// //                     <div class="task-container__group-header">
// //                         <div class="task-container__group-header-number">№</div>
// //                         <div class="task-container__group-header-info">о позиции</div>
// //                         <div class="task-container__group-header-is-offer">в КП</div>
// //                         <div class="task-container__group-header-technology">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>технология</span>
// //                         </div>
// //                         <div class="task-container__group-header-consumption">
// //                             <div>
// //                                 <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                                 <span>расход (1ед.)</span>
// //                             </div>
// //                             <div>
// //                                 <span>м2</span>
// //                                 <span>прод</span>
// //                             </div>
// //                         </div>
// //                         <div class="task-container__group-header-area-mounting">
// //                             <span>м2 монт</span>
// //                         </div>
// //                         <div class="task-container__group-header-cost-price">
// //                         </div>
// //                         <div class="task-container__group-header-measure">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>замер</span>
// //                         </div>
// //                         <div class="task-container__group-header-design">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>дизайн</span>
// //                         </div>
// //                         <div class="task-container__group-header-mounting">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>монтаж</span>
// //                         </div>
// //                         <div class="task-container__group-header-deadlines">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>сроки</span>
// //                         </div>
// //                         <div class="task-container__group-header-dismantling">
// //                             <span>демонтаж(1ед.)</span>
// //                         </div>
// //                         <div class="task-container__group-header-business-trip">
// //                             <span>командировка / выезд</span>
// //                         </div>
// //                         <div class="task-container__group-header-delivery">
// //                             <span>доставка</span>
// //                         </div>
// //                         <div class="task-container__group-header-color">
// //                             <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
// //                             <span>цп</span>
// //                         </div>
// //                     </div>
// //                     <div class="task-container__group-body">
// //                         <div>
// //                             ${productsHTML}
// //                         </div>
// //                         <div class="task-container__item-delivery">
// //                             <div class="task-container__item-delivery-count">
// //                                 <input type="number" name="" id="" placeholder="сколько раз">
// //                             </div>
// //                             <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
// //                             <div class="task-container__item-delivery-price">
// //                                 <input type="number" name="" id="" placeholder="себес. доставки за раз">
// //                             </div>
// //                         </div>
// //                         <div class="task-container__item-delivery-cp">
// //                             <div class="task-container__item-delivery-cp-method">
// //                                 <select name="" id="">
// //                                     <option value="1">Курьер</option>
// //                                     <option value="2">нет</option>
// //                                     <option value="3">Думают</option>
// //                                 </select>
// //                             </div>
// //                             <div class="task-container__item-delivery-cp-address">
// //                                 <textarea name="" id=""  rows="2" value="${groupData?.deliveryAddress || ''}"></textarea>
// //                             </div>
// //                             <div class="task-container__item-delivery-cp-cost">
// //                                 <input type="number" name="" id="" placeholder="себес. курьер. ЦП" value="${null || ''}" groupData?.deliveryCost>
// //                             </div>
// //                             <div class="task-container__item-delivery-cp-symbol-plus">+</div>
// //                             <div class="task-container__item-delivery-cp-percent">
// //                                 <input type="number" name="" id="" value="${groupData?.deliveryPercentage || ''}">
// //                             </div>
// //                             <div class="task-container__item-delivery-cp-symbol-percent">%</div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     `;
// // }


// // function getProductHTML(productData) {
// //     let technologies = productData?.technologies || [];
// //     if (!technologies.length) {
// //         technologies = [{}];
// //     }
// //     // let technologiesHTML = '';
// //     // for (let technology of technologies) {
// //     //     technologiesHTML += getProductTechnologiesHTML(technology);
// //     // }

// //     return `
// //         <div class="task-container__item">
// //             <div class="task-container__item-number">1</div>
// //             <div class="task-container__item-info">
// //                 <div class="task-container__item-title">
// //                     <input type="text" name="" id="" placeholder="название" value="${productData.title || ''}">
// //                 </div>
// //                 <div class="task-container__item-count">
// //                     <input type="text" name="" id="" placeholder="количество" value="${productData.quantity || ''}">
// //                 </div>
// //                 <div class="task-container__item-desc">
// //                     <textarea name="" id=""  rows="3" placeholder="описание" value="${productData.description || ''}"></textarea>
// //                 </div>
// //             </div>

// //             <div>
// //             ${getTechnologiesIsOfferHTML(technologies)}
// //             </div>
// //             <div>
// //             ${getTechnologiesHTML(technologies)}
// //             </div>
// //             <div>
// //             ${getTechnologiesConsumptionHTML(technologies)}
// //             </div>
// //             <div>
// //             ${getTechnologiesAreaMountingHTML(technologies)}
// //             </div>
// //             <div>
// //             ${getTechnologiesAmountHTML(technologies)}
// //             </div>
            
// //             <div class="task-container__item-measure">
// //                 <div class="task-container__item-measure-status">
// //                     <input type="text" name="" id="" value="${productData.measurement || ''}">
// //                 </div>
// //                 <div class="task-container__item-measure-address">
// //                     <input type="text" name="" id="" value="${productData.measurementAddress || ''}">
// //                 </div>
// //                 <div class="task-container__item-measure-costprice">
// //                     <input type="number" name="" id="" placeholder="себест. замера" value="${productData.measurementCost || ''}">
// //                 </div>
// //                 <div class="task-container__item-measure-symbol-plus">+</div>
// //                 <div class="task-container__item-measure-value-persent">
// //                     <input type="number" name="" id="" value="${productData.measurementPercent || ''}">
// //                 </div>
// //                 <div class="task-container__item-measure-symbol-percent">%</div>
// //             </div>
// //             <div class="task-container__item-design">
// //                 <div class="task-container__item-design-type" data-value="${productData.design || ''}">
// //                     <select name="" id="">
// //                         <option value="1">Test 1</option>
// //                         <option value="2">Test 2</option>
// //                         <option value="3">Test 3</option>
// //                     </select>
// //                 </div>
// //                 <div class="task-container__item-design-amount">
// //                     <input type="number" name="" id="" value="${productData.designPayment || ''}">
// //                 </div>
// //                 <div class="task-container__item-design-symbol-rub">₽</div>
// //             </div>
// //             <div class="task-container__item-mounting">
// //                 <div class="task-container__item-mounting-city">
// //                     <input type="text" name="" id="" value="${productData.installCity || ''}">
// //                 </div>
// //                 <div class="task-container__item-mounting-count-day">
// //                     <input type="number" name="" id="" placeholder="сколько дней" value="${productData.installDays || ''}">
// //                 </div>
// //                 <div class="task-container__item-mounting-symbol-mul">
// //                     <i class="bi bi-x"></i>
// //                 </div>
// //                 <div class="task-container__item-mounting-type">
// //                     <input type="text" name="" id="" value="${productData.installPlace || ''}">
// //                 </div>
// //                 <div class="task-container__item-mounting-costprice">
// //                     <input type="number" name="" id="" placeholder="себ. аренды за день" value="${productData.installCost || ''}">
// //                 </div>
// //                 <div class="task-container__item-mounting-symbol-plus">+</div>
// //                 <div class="task-container__item-mounting-value-percent">
// //                     <input type="number" name="" id="" value="${productData.installPercentage || ''}">
// //                 </div>
// //                 <div class="task-container__item-mounting-symbol-percent">%</div>
// //                 <div class="empty-1"></div>
// //                 <div class="empty-2"></div>
// //                 <div class="empty-3"></div>
// //                 <div class="empty-4"></div>
// //             </div>
// //             <div class="task-container__item-deadlines">
// //                 <div class="task-container__item-deadlines-type" data-value="${productData.terms || ''}">
// //                     <select name="" id="">
// //                         <option value="1">Item 1</option>
// //                         <option value="2">Item 2</option>
// //                         <option value="3">Item 3</option>
// //                     </select>
// //                 </div>
// //                 <div class="task-container__item-deadlines-data">
// //                     <input type="date" name="" id="" value="${productData.termsDate || ''}">
// //                 </div>
// //             </div>
// //             <div class="task-container__item-dismantling">
// //                 <div class="task-container__item-dismantling-area">
// //                     <input type="number" name="" id="" value="${productData.dismantlingArea || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-difficulty-desc">
// //                     <input type="text" name="" id="" value="${productData.dismantling || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-difficulty-price">
// //                     <input type="number" name="" id="" placeholder="сложн. демонтожа" value="${productData.dismantlingComplexity || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-cost-desc">
// //                     <input type="text" name="" id="" value="${productData.dismantlingDesc || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-cost-price">
// //                     <input type="number" name="" id="" placeholder="себест. демонтожа" value="${productData.dismantlingCost || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-symbol-plus">+</div>
// //                 <div class="task-container__item-dismantling-value-percent">
// //                     <input type="number" name="" id="" value="${productData.dismantlingPercent || ''}">
// //                 </div>
// //                 <div class="task-container__item-dismantling-symbol-percent">%</div>
// //                 <div class="empty-1"></div>
// //             </div>
// //             <div class="task-container__item-business-trip">
// //                 <div class="task-container__item-business-trip-type" data-value="${productData.businessTrip || ''}">
// //                     <select name="" id="">
// //                         <option value="1">Командировка</option>
// //                         <option value="2">Командировка 2</option>
// //                         <option value="3">Командировка 3</option>
// //                     </select>
// //                 </div>
// //                 <div class="task-container__item-business-trip-costprice">
// //                     <input type="number" name="" id="" placeholder="себест. командировки" value="${productData.businessTripCost || ''}">
// //                 </div>
// //                 <div class="task-container__item-business-trip-symbol-plus">+</div>
// //                 <div class="task-container__item-business-trip-value-percent">
// //                     <input type="number" name="" id="" value="${productData.businessTripPercent || ''}">
// //                 </div>
// //                 <div class="task-container__item-business-trip-symbol-percent">%</div>
// //             </div>
// //         </div>
// //     `;
// // }


// // function getTechnologiesIsOfferHTML(technologiesData) {
// //     let contentHTML = '';

// //     for (let technologyData of technologiesData) {
// //         contentHTML += `
// //             <div class="task-container__item-is-offer">
// //                 <input type="checkbox" name="" id="" value="${technologyData.inKP || false}">
// //             </div>
// //         `;
// //     }
// //     return contentHTML;
// // }


// // function getTechnologiesHTML(technologiesData) {
// //     let contentHTML = '';

// //     for (let technologyData of technologiesData) {
// //         contentHTML += `
// //             <div class="task-container__item-technologies">
// //                 <div class="task-container__item-technology">
// //                     <div class="task-container__item-technology-type" data-value="${technologyData.general || ''}">
// //                         <select name="" id="">
// //                             <option value="1">печать</option>
// //                             <option value="2">печать + конт. резка</option>
// //                             <option value="3">плотерка</option>
// //                         </select>
// //                     </div>
// //                     <div class="task-container__item-technology-material-1" data-value="${technologyData.film || ''}">
// //                         <select name="" id="">
// //                             <option value="1">3551RA</option>
// //                             <option value="2">215GRA</option>
// //                             <option value="3">21wdRA</option>
// //                         </select>
// //                     </div>
// //                     <div class="task-container__item-technology-material-2" data-value="${technologyData.lamination || ''}">
// //                         <select name="" id="">
// //                             <option value="1">3551RA</option>
// //                             <option value="2">215GRA</option>
// //                             <option value="3">21wdRA</option>
// //                         </select>
// //                     </div>
// //                     <div class="task-container__item-technology-price">
// //                         <input type="number" name="" id="" placeholder="Цена" value="${technologyData.price || ''}">
// //                     </div>
// //                 </div>
// //             </div>
// //         `;
// //     }

// //     return contentHTML;
// // }


// // function getTechnologiesConsumptionHTML(technologiesData) {
// //     let contentHTML = '';

// //     for (let technologyData of technologiesData) {
// //         contentHTML += `
// //             <div class="task-container__item-consumption">
// //                 <div class="task-container__item-consumption-item">
// //                     <div class="task-container__item-consumption-item-img">🖼</div>
// //                     <div class="task-container__item-consumption-item-title">
// //                         <input type="text" name="" id="" placeholder="ЧПП" value="${technologyData.CHPP || false}">
// //                     </div>
// //                     <div class="task-container__item-consumption-item-empty"></div>
// //                     <div class="task-container__item-consumption-item-m2">v2</div>
// //                     <div class="task-container__item-consumption-item-width">
// //                         <input type="number" name="" id="" placeholder="|&harr;|" value="${technologyData.width || ''}">
// //                     </div>
// //                     <div class="task-container__item-consumption-item-product">
// //                         <i class="bi bi-x"></i>
// //                     </div>
// //                     <div class="task-container__item-consumption-item-length">
// //                         <input type="number" name="" id="" placeholder="п.м." value="${technologyData.runningMeter || ''}">
// //                     </div>
// //                     <div class="task-container__item-consumption-item-result"> = ${(technologyData.width * technologyData.runningMeter)  || '-'}</div>
// //                 </div>
// //             </div>
// //         `;
// //     }

// //     return contentHTML;
// // }


// // function getTechnologiesAreaMountingHTML(technologiesData) {
// //     let contentHTML = '';

// //     for (let technologyData of technologiesData) {
// //         contentHTML += `
// //             <div class="task-container__item-area-mounting">
// //                 <input type="number" name="" id="" value="${technologyData.installArea || ''}">
// //             </div>
// //         `;
// //     }

// //     return contentHTML;
// // }


// // function getTechnologiesAmountHTML(technologiesData) {
// //     let contentHTML = '';

// //     for (let technologyData of technologiesData) {
// //         contentHTML += `
// //             <div class="task-container__item-amount">
// //                 <div class="task-container__item-amount-costprice">
// //                     <input type="number" name="" id="" placeholder="себест. монт." value="${technologyData.installCost || ''}">
// //                 </div>
// //                 <div class="task-container__item-amount-symbol-plus">+</div>
// //                 <div class="task-container__item-amount-value-percent">
// //                     <input type="number" name="" id="" value="${technologyData.installPercent || ''}">
// //                 </div>
// //                 <div class="task-container__item-amount-symbol-percent">%</div>
// //             </div>
// //         `;
// //     }

// //     return contentHTML;
// // }
