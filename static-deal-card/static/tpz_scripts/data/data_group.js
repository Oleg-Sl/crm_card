import { parseAmount, convertYNToBoolean } from '../common/common.js';
import {
    SP_GROUP_ID,
    SP_GROUP_FIELDS,
} from '../parameters.js';


export class Group {
    constructor(data) {
        this.data = data;

        this.id = data?.[SP_GROUP_FIELDS.id];
        this.title = data?.[SP_GROUP_FIELDS.title];                                     // Название
        this.deliveryMethod = data?.[SP_GROUP_FIELDS.deliveryMethod];                   // ЦП - способ доставки
        this.deliveryAddress = data?.[SP_GROUP_FIELDS.deliveryAddress];                 // ЦП - адрес
        this.deliveryCost = parseAmount(data?.[SP_GROUP_FIELDS.deliveryCost]);          // ЦП - себестоимость
        this.deliveryPercentage = data?.[SP_GROUP_FIELDS.deliveryPercentage];           // ЦП - процент
        this.delivery = data?.[SP_GROUP_FIELDS.delivery];                               // ЦП - да/нет/...
        this.deliveryDesc = data?.[SP_GROUP_FIELDS.deliveryDesc];                       // ЦП - описание
        this.deliveryCount = data?.[SP_GROUP_FIELDS.deliveryCount];                     // ЦП - сколько раз
        this.deliveryCostOne = parseAmount(data?.[SP_GROUP_FIELDS.deliveryCostOne]);    // ЦП - себестоимость за раз

        this.repeatTechnologies = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatTechnologies]);   // Повторить - технология
        this.repeatSources = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatSources]);             // Повторить - исходники
        this.repeatConsumption = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatConsumption]);     // Повторить - расход (1ед.)
        this.repeatMeasurement = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatMeasurement]);     // Повторить - замер
        this.repeatDesign = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatDesign]);               // Повторить - дизайн
        this.repeatMontage = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatMontage]);             // Повторить - монтаж
        this.repeatDeadline = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatDeadline]);           // Повторить - сроки
        this.repeatDelivery = convertYNToBoolean(data?.[SP_GROUP_FIELDS.repeatDelivery]);           // Повторить - доставка

        this.businessTrip = data?.[SP_GROUP_FIELDS.businessTrip];                               // Командировка - тип
        this.businessTripCost = data?.[SP_GROUP_FIELDS.businessTripCost];                       // Командировка - себестоимость
        this.businessTripPercent = data?.[SP_GROUP_FIELDS.businessTripPercent];                 // Командировка - процент
        this.businessTripPeople = data?.[SP_GROUP_FIELDS.businessTripPeople];                   // Командировка - сколько человек
        this.businessTripDays = data?.[SP_GROUP_FIELDS.businessTripDays];                       // Командировка - сколько дней
        this.businessTripAccommodation = data?.[SP_GROUP_FIELDS.businessTripAccommodation];     // Командировка - проживание ночей
        this.businessTripNutritions = data?.[SP_GROUP_FIELDS.businessTripNutritions];           // Командировка - питание дней
        this.businessTripMileages = data?.[SP_GROUP_FIELDS.businessTripMileages];               // Командировка - пробег
        this.businessTripTypeDeparture = data?.[SP_GROUP_FIELDS.businessTripTypeDeparture];     // Командировка - тип выезда
        this.businessTripCount = data?.[SP_GROUP_FIELDS.businessTripCount];                     // Командировка - сколько раз
        this.businessTripCostOne = data?.[SP_GROUP_FIELDS.businessTripCostOne];                 // Командировка - себестоимость за круг

        this.products = [];
        this.changedFields = {};
        this.initialValues = {};

        this.initFields();
    }

    addProduct(objProduct) {
        this.products.push(objProduct);
    }

    removeProduct(objProduct) {
        const index = this.products.indexOf(objProduct);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    addTechnology(objTechnology) {
        for (const product of this.products) {
            if (product.id == objTechnology.parentId) {
                product.addTechnology(objTechnology);
            }
        }
    }

    removeTechnology(objTechnology) {
        for (const product of this.products) {
            if (product.technologies.indexOf(objTechnology) !== -1) {
                product.removeTechnology(objTechnology);
            }
        }
    }

    update(newData) {
        Object.keys(newData).forEach(field => {
            this.saveChanges(field, newData);
            this.updateField(field, newData[field]);
        });

    }

    updateTripCost(costOfFood, costOfLiving, costOfTravel) {
        // {ID: '10369', VALUE: 'Командировка'}
        // {ID: '10371', VALUE: 'Выезд'}
        if (this.businessTrip == '10369') {
            this.businessTripCost = +this.businessTripPeople * ( +this.businessTripAccommodation * +costOfLiving + +this.businessTripNutritions * +costOfFood + +this.businessTripMileages * +costOfTravel);
        } else if (this.businessTrip == '10371') {
            this.businessTripCost = +this.businessTripPeople * +this.businessTripCount * +this.businessTripCostOne;
        } else {
            this.businessTripCost = 0;
        }
    }

    updateField(field, value) {
        if (field in this) {
            this[field] = value;
        } else {
            console.error(`Field ${field} does not exist in Group`);
        }
    }

    saveChanges(field, newData) {
        const oldValue = this[field];
        const newValue = newData[field];

        if (oldValue !== newValue) {
            const fieldTitle = SP_GROUP_FIELDS[field];

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

    initFields() {
        Object.keys(SP_GROUP_FIELDS).forEach(field => {
            this.initialValues[SP_GROUP_FIELDS[field]] = this[field];
        });
    }

    getChangedFields() {
        if (Object.keys(this.changedFields).length !== 0) {
            let changed = this.getChangedFieldsMap(this.changedFields);
            changed.entityTypeId = SP_GROUP_ID;
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
