
// import {
//     SP_GROUP_ID,
//     SP_PRODUCT_ID,
//     SP_TECHOLOGY_ID,
//     SP_GROUP_FIELDS,
//     SP_PRODUCT_FIELDS,
//     SP_TECHOLOGY_FIELDS,
// } from '../../parameters.js';



// export function getGroupProductsApplicationHTML(groupData, fieldGroup, fieldProductk, fieldTechnology) {
//     // console.log("groupData = ", groupData);
//     let products = groupData?.products || [];
//     if (products.length === 0) {
//         products = [{}];
//     }

//     let productsHTML = '';
//     for (let ind in products) {
//         // const deliveryHTML = (ind == 0) ? getDeliveryHTML(groupData, products.length) : '';
//         productsHTML += getProductHTML(fieldGroup, groupData, products[ind], +ind + 1, groupData.id);
//     }

//     return `
//         <div class="application-group" data-group-id="${groupData.id}">
//             <div class="task-container__group-title">
//                 <span>Группа 1: </span><input type="text" placeholder="Название" value="${groupData.title}">
//             </div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>
//                             <div class="task-container_group-header-add-group"><i class="bi bi-plus-circle-fill"></i></div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-product-desc">о позиции</div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-technology">
//                                 <div>
//                                     <label class="switch">
//                                         <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                         <span class="slider round"></span>
//                                     </label>
//                                     <span>технология</span>
//                                 </div>
//                                 <span>+/-</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-sources">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>исходники</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-measurements">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>замер</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-design">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>дизайн</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-color">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>ЦП</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-mounting">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>монтаж</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-deadlines">
//                                 <label class="switch">
//                                     <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''}>
//                                     <span class="slider round"></span>
//                                 </label>
//                                 <span>сроки</span>
//                             </div>
//                         </th>
//                         <th>
//                             <div class="task-container_group-header-dismantling">
//                                 <span>демонтаж</span>
//                             </div>
//                         </th>
//                         <th></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${productsHTML}
//                 </tbody>
//             </table>
//         </div>
//     `;
// }


// function getProductHTML(fieldGroup, groupData, productData, number, groupId) {
//     console.log(groupData);
//     let technologies = productData?.technologies || [];
//     if (!technologies.length) {
//         technologies = [{}];
//     }

//     return `
//         <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupId}">
//             <td>
//                 <div class="task-container__item-number"><div>${number}</div></div>
//             </td>
//             <td>
//                 <div class="task-container__item-info">
//                     <div class="task-container__item-info-title">
//                         <input type="text" name="" id="" placeholder="название" value="${customToString(productData.title)}">
//                     </div>
//                     <div class="task-container__item-info-count">
//                         <input type="text" name="" id="" placeholder="количество" value="${customToString(productData.quantity)}">
//                     </div>
//                     <div class="task-container__item-info-desc">
//                         <textarea name="" id=""  rows="3" placeholder="описание">${customToString(productData.description)}</textarea>
//                     </div>
//                 </div>
//             </td>
//             <td class="task-container__item-technologies">
//                 <div class="task-container__item-technologies-list">
//                     <div class="task-container__item-technologies-list-container">
//                         ${getTechnologiesHTML(technologies)}
//                     </div>
//                 </div>
//                 <div class="task-container__item-technology-add">
//                     <i class="bi bi-plus-square"></i>
//                 </div>
//             </td>
//             <td class="task-container_group-item-sources">
//                 <div class="task-container_group-item-sources-list">
//                     ${getSourcesHTML(productData.sources || [{}])}
//                 </div>
//                 <div class="task-container_group-item-sources-add">
//                     <i class="bi bi-plus-square"></i>
//                 </div>
//             </td>
//             <td class="task-container_group-item-measurements">
//                 <div class="task-container_group-item-measurements-list" data-value="${customToString(productData.measurement)}">
//                     <select name="" id="">
//                         <option value="1">нет - есть балванка</option>
//                         <option value="2">печать + конт. резка</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <select name="" id="">
//                         <option value="1">нет - есть балванка</option>
//                         <option value="2">печать + конт. резка</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//             </td>
//             <td class="task-container_group-item-design">
//                 <div class="task-container_group-item-design-list">
//                     <select name="" id="">
//                         <option value="1">адаптация</option>
//                         <option value="2">нет</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <select name="" id="">
//                         <option value="1">адаптация</option>
//                         <option value="2">нет</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//             </td>
//             <td class="task-container_group-item-color-test">
//                 <div class="task-container_group-item-color-test-list">
//                     <select name="" id="">
//                         ${getOptionsHTML(fieldGroup?.[SP_GROUP_FIELDS.delivery]?.items, groupData.delivery)}
//                         <option value="1">нет</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <select name="" id="">
//                         <option value="1">нет</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//             </td>
//             <td class="task-container_group-item-mounting">
//                 <div class="task-container_group-item-mounting-container">
//                     <input class="task-container_group-item-mounting-left vertical-input" type="text" name="" id="" placeholder="день">
//                     <select class="task-container_group-item-mounting-top" name="" id="">
//                         <option value="1">нет</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <select class="task-container_group-item-mounting-bottom" name="" id="">
//                         <option value="1">нет</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <input class="task-container_group-item-mounting-right vertical-input" type="text" name="" id="" placeholder="день">
//                 </div>
//             </td>
//             <td class="task-container_group-item-deadlines">
//                 <div class="task-container_group-item-deadlines-list">
//                     <select name="" id="">
//                         <option value="1">нет</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <input type="date">
//                 </div>
//             </td>
//             <td class="task-container_group-item-dismantling">
//                 <div class="task-container_group-item-dismantling-container">
//                     <select class="task-container_group-item-dismantling-top" name="" id="">
//                         <option value="1">да: >1,5 лет </option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <select class="task-container_group-item-dismantling-bottom" name="" id="">
//                         <option value="1">известен</option>
//                         <option value="2">печать</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                     <input class="task-container_group-item-dismantling-area vertical-input" type="text" name="" id="" value="12 м2">
//                 </div>
//             </td>
//             <td class="task-container_group-item-right">
//                 <div class="task-container_group-item-move"><i class="bi bi-list"></i></div>
//                 <div class="task-container_group-item-add"><i class="bi bi-plus-circle-fill"></i></div>
//                 <div class="task-container_group-item-copy"><i class="bi bi-copy"></i></div>
//                 <div class="task-container_group-item-remove"><i class="bi bi-x-square"></i></div>
//             </td>
//         </tr>
//     `;
// }


// function getTechnologiesHTML(technologies) {
//     let contentHTML = '';

//     for (let technology of technologies) {
//         contentHTML += `
//             <div class="task-container__item-technologies-technology technology-row" data-technology-id="${technology.id}">
//                 <div class="task-container__item-technologies-technology-mchs">
//                     <span>МЧС</span>
//                     <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
//                 </div>
//                 <div class="task-container__item-technologies-technology-type">
//                     <select name="" id="">
//                         <option value="1">печать</option>
//                         <option value="2">печать + конт. резка</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technologies-technology-material-1">
//                     <select name="" id="">
//                         <option value="1">3551RA</option>
//                         <option value="2">215GRA</option>
//                         <option value="3">21wdRA</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technologies-technology-material-2">
//                     <select name="" id="">
//                         <option value="1">3551RA</option>
//                         <option value="2">215GRA</option>
//                         <option value="3">21wdRA</option>
//                     </select>
//                 </div>
//                 <div class="task-container__item-technologies-technology-remove">
//                     <i class="bi bi-dash-square"></i>
//                 </div>
//             </div>
//         `;
//     }

//     return contentHTML;
// }


// export function getSourcesHTML(sources) {
//     let contentHTML = '';

//     for (const source in sources) {
//         contentHTML += `
//             <div class="task-container_group-item-sources-item">
//                 <div class="task-container_group-item-sources-item-prev">🖼</div>
//                 <div class="task-container_group-item-sources-item-value" data-value="">
//                     <select class="product-source-select" name="" id="">
//                         <option value="1">печать</option>
//                         <option value="2">печать + конт. резка</option>
//                         <option value="3">плотерка</option>
//                     </select>
//                 </div>
//                 <div class="task-container_group-item-sources-remove">
//                     <i class="bi bi-dash-square"></i>
//                 </div>
//             </div>
//         `;
//     }

//     return contentHTML;
// }

// function getOptionsHTML(fields, value) {
//     console.log(fields, value);
//     let contentHTML = '<option value=""></option>';
//     for (const field of fields) {
//         if (field.ID == value) {
//             contentHTML += `<option value="${field.ID}" selected>${field.VALUE}</option>`;
//         } else {
//             contentHTML += `<option value="${field.ID}">${field.VALUE}</option>`;
//         }
//     }
//     return contentHTML;
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
