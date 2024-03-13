import { parseAmount, convertYNToBoolean, parseDateFromDatetimeString } from './common.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,

    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,

    SP_WIDTH_FIELDS,
    SP_DEPENDENCE_FIELDS,
} from '../parameters.js';


export class Product {
    constructor(data) {
        console.log('data = ', data);
        this.data = data;
        this.parentId = data?.[`parentId${SP_GROUP_ID}`];

        this.id = data?.[SP_PRODUCT_FIELDS.id];
        this.title = data?.[SP_PRODUCT_FIELDS.title];                                       // Название
        this.quantity = data?.[SP_PRODUCT_FIELDS.quantity];                                 // Количество
        this.description = data?.[SP_PRODUCT_FIELDS.description];                           // Описание
        this.measurement = data?.[SP_PRODUCT_FIELDS.measurement];                           // Замер
        this.measurementAddress = data?.[SP_PRODUCT_FIELDS.address];                        // Адрес
        this.measurementCost = data?.[SP_PRODUCT_FIELDS.measurementCost];                   // Себестоимость замера
        this.measurementPercent = data?.[SP_PRODUCT_FIELDS.measurementPercent];             // Процент замер
        this.design = data?.[SP_PRODUCT_FIELDS.design];                                     // Дизайн
        this.designPayment = data?.[SP_PRODUCT_FIELDS.designPayment];                       // Оплата дизайна
        this.designCost = parseAmount(data?.[SP_PRODUCT_FIELDS.designCost]);                // Стоимость дизайна
        this.installTime = data?.[SP_PRODUCT_FIELDS.installTime];                           // Монтаж - время
        this.installCity = data?.[SP_PRODUCT_FIELDS.installCity];                           // Монтаж - город
        this.installPlace = data?.[SP_PRODUCT_FIELDS.installPlace];                         // Монтаж - место
        this.installComplexity = data?.[SP_PRODUCT_FIELDS.installComplexity];               // Монтаж - сложность
        this.installDays = data?.[SP_PRODUCT_FIELDS.installDays];                           // Монтаж - количество дней
        this.installCost = parseAmount(data?.[SP_PRODUCT_FIELDS.installCost]);              // Монтаж - себестоимость
        this.installPercentage = data?.[SP_PRODUCT_FIELDS.installPercentage];               // Монтаж - процент
        this.terms = data?.[SP_PRODUCT_FIELDS.terms];                                       // Сроки
        this.termsDate = parseDateFromDatetimeString(data?.[SP_PRODUCT_FIELDS.termsDate]);  // Сроки - дата
        this.dismantling = data?.[SP_PRODUCT_FIELDS.dismantling];                           // Демонтаж
        this.dismantlingDesc = data?.[SP_PRODUCT_FIELDS.dismantlingDesc];                   // Демонтаж - описание
        this.dismantlingArea = data?.[SP_PRODUCT_FIELDS.dismantlingArea];                   // Демонтаж - площадь
        this.dismantlingComplexity = data?.[SP_PRODUCT_FIELDS.dismantlingComplexity];       // Демонтаж - сложность
        this.dismantlingCost = parseAmount(data?.[SP_PRODUCT_FIELDS.dismantlingCost]);      // Демонтаж - себестоимость
        this.dismantlingPercent = data?.[SP_PRODUCT_FIELDS.dismantlingPercent];             // Демонтаж - процент
        this.businessTrip = data?.[SP_PRODUCT_FIELDS.businessTrip];                         // Командировка
        this.businessTripCost = parseAmount(data?.[SP_PRODUCT_FIELDS.businessTripCost]);    // Командировка - себестоимость
        this.businessTripPercent = data?.[SP_PRODUCT_FIELDS.businessTripPercent];           // Командировка - процент
        this.deliveryFrequency = data?.[SP_PRODUCT_FIELDS.deliveryFrequency];               // Доставка - сколько раз
        this.deliveryCostPerTime = data?.[SP_PRODUCT_FIELDS.deliveryCostPerTime];           // Доставка - себестоимость за раз
        this.sourcesFiles = data?.[SP_PRODUCT_FIELDS.sourcesFiles] || [];                   // Исходник - фото

        this.technologies = [];
        this.changedFields = {};
        this.initialValues = {};

        this.initFields();
    }

    addTechnology(objTechnology) {
        this.technologies.push(objTechnology);
    }

    removeTechnology(objTechnology) {
        const index = this.technologies.indexOf(objTechnology);
        if (index !== -1) {
            this.technologies.splice(index, 1);
        }
    }

    update(newData) {
        Object.keys(newData).forEach(field => {
            this.saveChanges(field, newData);
            this.updateField(field, newData[field]);
        });
    }

    saveChanges(field, newData) {
        const oldValue = this[field];
        const newValue = newData[field];

        if (oldValue !== newValue) {
            const fieldTitle = SP_PRODUCT_FIELDS[field];

            if (newValue == this.initialValues[fieldTitle]) {
                delete this.changedFields[fieldTitle];
            } else {
                this.changedFields[fieldTitle] = {
                    oldValue: oldValue,
                    newValue: newValue,
                    initialValue: this.initialValues[fieldTitle],
                };
            }
        }
    }

    updateField(field, value) {
        if (field in this) {
            this[field] = value;
        } else {
            console.error(`Field ${field} does not exist in Product`);
        }
    }

    initFields() {
        Object.keys(SP_PRODUCT_FIELDS).forEach(field => {
            this.initialValues[SP_PRODUCT_FIELDS[field]] = this[field];
        });
    }

    getChangedFields() {
        if (Object.keys(this.changedFields).length !== 0) {
            let changed = this.getChangedFieldsMap(this.changedFields);
            changed.entityTypeId = SP_PRODUCT_ID;
            changed.entityId = this.id;
            return changed;
        }
        return {};
    }

    getChangedFieldsMap(changedFields) {
        const changedFieldsMap = {};

        for (const key in changedFields) {
            if (Object.hasOwnProperty.call(changedFields, key)) {
                if (changedFields[key].newValue === true) {
                    changedFieldsMap[key] = 'Y';
                } else if (changedFields[key].newValue === false) {
                    changedFieldsMap[key] = 'N';
                } else {
                    changedFieldsMap[key] = changedFields[key].newValue;
                }
            }
        }
    
        return changedFieldsMap;
    }
}
