// import {
//     SP_PRODUCT_ID,
//     SP_TECHOLOGY_ID,
//     SP_TECHOLOGY_FIELDS,
// } from '../parameters.js';

// import {
//     parseAmount,
//     parseDateFromDatetimeString,
//     convertYNToBoolean,
// } from './common.js';


// export class Technology {
//     constructor(data) {
//         this.parentId = data?.[`parentId${SP_PRODUCT_ID}`];

//         this.id = data?.[SP_TECHOLOGY_FIELDS.id];
//         this.general = data?.[SP_TECHOLOGY_FIELDS.general];                                 // Технология изготовления
//         this.inKP = convertYNToBoolean(data?.[SP_TECHOLOGY_FIELDS.inKP]);                   // Технология - в КП
//         this.MCHS = convertYNToBoolean(data?.[SP_TECHOLOGY_FIELDS.MCHS]);                   // Технология - МЧС
//         this.film = data?.[SP_TECHOLOGY_FIELDS.film];                                       // Технология - Пленка
//         this.lamination = data?.[SP_TECHOLOGY_FIELDS.lamination];                           // Технология - Ламинация
//         this.price = parseAmount(data?.[SP_TECHOLOGY_FIELDS.price]);                        // Технология - Цена
//         // this.photo = data?.[SP_TECHOLOGY_FIELDS.photo];                                   // Исходник - фото
//         this.CHPP = data?.[SP_TECHOLOGY_FIELDS.CHPP];                                       // Исходник - ЧПП
//         this.width = data?.[SP_TECHOLOGY_FIELDS.width];                                     // Исходник - Ширина
//         this.runningMeter = data?.[SP_TECHOLOGY_FIELDS.runningMeter];                       // Исходник - Погонный метр
//         this.installArea = data?.[SP_TECHOLOGY_FIELDS.installArea];                         // Площадь монтажа
//         this.installCost = data?.[SP_TECHOLOGY_FIELDS.installCost];                         // Себестоимость монтажа
//         this.installPercent = data?.[SP_TECHOLOGY_FIELDS.installPercent];                   // Процент монтаж
//         this.totalPercent = data?.[SP_TECHOLOGY_FIELDS.totalPercent];                       // Итого - процент
//         this.addedToOrder = convertYNToBoolean(data?.[SP_TECHOLOGY_FIELDS.addedToOrder]);   // Добавить в заказ

//         this.amount = 1;

//         this.changedFields = {};
        
//         this.initializeFields();
//     }

//     initializeFields() {
//         this.initialValues = {};
//         Object.keys(SP_TECHOLOGY_FIELDS).forEach(field => {
//             this.initialValues[SP_TECHOLOGY_FIELDS[field]] = this[field];
//         });
//     }

//     updateData(newData) {
//         Object.keys(newData).forEach(field => {
//             this.saveChanges(field, newData);
//             this.updateField(field, newData[field]);
//         });
//         console.log(this.changedFields);
//     }

//     saveChanges(field, newData) {
//         const oldValue = this[field];
//         const newValue = newData[field];

//         if (oldValue !== newValue) {
//             const fieldTitle = SP_TECHOLOGY_FIELDS[field];

//             if (newValue == this.initialValues[fieldTitle]) {
//                 delete this.changedFields[fieldTitle];
//             } else {
//                 this.changedFields[fieldTitle] = {
//                     oldValue: oldValue,
//                     newValue: newValue,
//                     initialValue: this.initialValues[fieldTitle],
//                 };
//             }
//         }
//     }

//     updateField(field, value) {
//         if (field in this) {
//             this[field] = value;
//         } else {
//             console.error(`Field ${field} does not exist in Technology`);
//         }
//     }

//     getChangedFields() {
//         return this.changedFields;
//     }
// }