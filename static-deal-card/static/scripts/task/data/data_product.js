import { parseAmount, convertYNToBoolean, parseDateFromDatetimeString } from '../common/common.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_PRODUCT_FIELDS,
} from '../../parameters.js';


const FIELDS_MONEY = ['designCost', 'installCost', 'dismantlingCost', 'businessTripCost', 'deliveryCostPerTime'];
const FIELDS_MONEY_BX24 = [SP_PRODUCT_FIELDS.designCost, SP_PRODUCT_FIELDS.installCost, SP_PRODUCT_FIELDS.dismantlingCost, SP_PRODUCT_FIELDS.businessTripCost, SP_PRODUCT_FIELDS.deliveryCostPerTime];


export class Product {
    constructor(data) {
        this.data = data;
        this.parentId = data?.[`parentId${SP_GROUP_ID}`];

        this.id = data?.[SP_PRODUCT_FIELDS.id];
        this.title = data?.[SP_PRODUCT_FIELDS.title];                                           // Название
        this.quantity = data?.[SP_PRODUCT_FIELDS.quantity];                                     // Количество
        this.description = data?.[SP_PRODUCT_FIELDS.description];                               // Описание
        this.measurement = data?.[SP_PRODUCT_FIELDS.measurement];                               // Замер
        this.measurementAddress = data?.[SP_PRODUCT_FIELDS.measurementAddress];                 // Замер - Адрес замера
        this.measurementCost = data?.[SP_PRODUCT_FIELDS.measurementCost];                       // Замер - Себестоимость замера
        this.measurementPercent = data?.[SP_PRODUCT_FIELDS.measurementPercent];                 // Замер - Процент замер
        this.design = data?.[SP_PRODUCT_FIELDS.design];                                         // Дизайн
        this.designPayment = data?.[SP_PRODUCT_FIELDS.designPayment];                           // Дизайн - Оплата дизайна
        this.designCost = parseAmount(data?.[SP_PRODUCT_FIELDS.designCost]);                    // Дизайн - Стоимость дизайна
        this.installTime = data?.[SP_PRODUCT_FIELDS.installTime];                               // Монтаж - время
        this.installCity = data?.[SP_PRODUCT_FIELDS.installCity];                               // Монтаж - город
        this.installPlace = data?.[SP_PRODUCT_FIELDS.installPlace];                             // Монтаж - место
        this.installComplexity = data?.[SP_PRODUCT_FIELDS.installComplexity];                   // Монтаж - сложность
        this.installDays = data?.[SP_PRODUCT_FIELDS.installDays];                               // Монтаж - количество дней
        this.installCost = parseAmount(data?.[SP_PRODUCT_FIELDS.installCost]);                  // Монтаж - себестоимость
        this.installPercentage = data?.[SP_PRODUCT_FIELDS.installPercentage];                   // Монтаж - процент
        this.terms = data?.[SP_PRODUCT_FIELDS.terms];                                           // Сроки
        this.termsDate = parseDateFromDatetimeString(data?.[SP_PRODUCT_FIELDS.termsDate]);      // Сроки - дата
        this.dismantling = data?.[SP_PRODUCT_FIELDS.dismantling];                               // Демонтаж
        this.dismantlingDesc = data?.[SP_PRODUCT_FIELDS.dismantlingDesc];                       // Демонтаж - описание
        this.dismantlingArea = data?.[SP_PRODUCT_FIELDS.dismantlingArea];                       // Демонтаж - площадь
        this.dismantlingComplexity = data?.[SP_PRODUCT_FIELDS.dismantlingComplexity];           // Демонтаж - сложность
        this.dismantlingCost = parseAmount(data?.[SP_PRODUCT_FIELDS.dismantlingCost]);          // Демонтаж - себестоимость
        this.dismantlingPercent = data?.[SP_PRODUCT_FIELDS.dismantlingPercent];                 // Демонтаж - процент
        this.businessTrip = data?.[SP_PRODUCT_FIELDS.businessTrip];                             // Командировка
        this.businessTripCost = parseAmount(data?.[SP_PRODUCT_FIELDS.businessTripCost]);        // Командировка - себестоимость
        this.businessTripPercent = data?.[SP_PRODUCT_FIELDS.businessTripPercent];               // Командировка - процент
        this.deliveryFrequency = data?.[SP_PRODUCT_FIELDS.deliveryFrequency];                   // Доставка - сколько раз
        this.deliveryCostPerTime = parseAmount(data?.[SP_PRODUCT_FIELDS.deliveryCostPerTime]);  // Доставка - себестоимость за раз
        this.sourcesFiles = data?.[SP_PRODUCT_FIELDS.sourcesFiles] || [];                       // Исходник - фото

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

    updateTechnologies(newData) {
        this.technologies.forEach(technology => {
            technology.update(newData);
        });
    }

    copyTechnologyFromProduct(productEtalon) {
        for (const i in productEtalon.technologies) {
            if (i >= this.technologies.length) {
                continue;
            }
            const technologyThis = this.technologies[i];
            const technologyEtalon = productEtalon.technologies[i];
            technologyThis.update({
                general: technologyEtalon.general ? technologyEtalon.general : '',
                inKP: technologyEtalon.inKP ? technologyEtalon.inKP : false,
                MCHS: technologyEtalon.MCHS ? technologyEtalon.MCHS : false,
                film: technologyEtalon.film ? technologyEtalon.film : '',
                lamination: technologyEtalon.lamination ? technologyEtalon.lamination : '',
                price: technologyEtalon.price ? technologyEtalon.price : 0,
            });
        }
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
                if (FIELDS_MONEY_BX24.includes(key)) {
                    changedFieldsMap[key] = `${changedFields[key].newValue || 0}|RUB`;
                } else if (changedFields[key].newValue === true) {
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

    getFields() {
        const fieldsObject = {};
        for (const key in SP_PRODUCT_FIELDS) {
            if (key !== 'id' && key in this) {
                const fieldTitle = SP_PRODUCT_FIELDS[key];
                if (FIELDS_MONEY.includes(key)) {
                    fieldsObject[fieldTitle] = `${this[key] || 0}|RUB`;
                } else if (this[key] === true) {
                    fieldsObject[fieldTitle] = 'Y';
                } else if (this[key] === false) {
                    fieldsObject[fieldTitle] = 'N';
                } else {
                    fieldsObject[fieldTitle] = this[key];
                }
            }
        }
        return fieldsObject;
    }

}
