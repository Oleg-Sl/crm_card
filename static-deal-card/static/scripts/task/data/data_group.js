import { parseAmount, convertYNToBoolean } from '../common/common.js';
import {
    SP_GROUP_ID,
    SP_GROUP_FIELDS,
} from '../../parameters.js';


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
            this.updateRepeatCheck(field, newData);
            this.saveChanges(field, newData);
            this.updateField(field, newData[field]);
        });
    }

    updateRepeatCheck(field, newData) {
        if (this.products.length === 0 || this.products[0].technologies.length === 0) {
            return;
        }
        const value = newData[field];
        const productEtalon = this.products[0];
        const technologyEtalon = productEtalon.technologies[0];
        // if (!value) {
        //     return;
        // }
        // console.log("updateRepeatCheck", field, value);
        switch (field) {
            case "repeatTechnologies":
                this.products.slice(1).forEach(product => {
                    product.updateTechnologies({
                        general: value ? technologyEtalon.general : '',
                        inKP: value ? technologyEtalon.inKP : false,
                        MCHS: value ? technologyEtalon.MCHS : false,
                        film: value ? technologyEtalon.film : '',
                        lamination: value ? technologyEtalon.lamination : '',
                        price: value ? technologyEtalon.price : 0,
                    });
                });
                break;
            case "repeatSources":
                this.products.slice(1).forEach(product => {
                    product.update({
                        sourcesFiles: value ? productEtalon.sourcesFiles : [],
                    });
                });
                break;
            case "repeatConsumption":
                this.products.slice(1).forEach(product => {
                    product.updateTechnologies({
                        CHPP: value ? technologyEtalon.CHPP : '',
                        width: value ? technologyEtalon.width : '',
                        runningMeter: value ? technologyEtalon.runningMeter : '',
                    });
                });
                break;
            case "repeatMeasurement":
                this.products.slice(1).forEach(product => {
                    product.update({
                        measurement: value ? productEtalon.measurement : '',
                        measurementAddress: value ? productEtalon.measurementAddress : '',
                        measurementCost: value ? productEtalon.measurementCost : '',
                        measurementPercent: value ? productEtalon.measurementPercent : '',
                    });
                })
                break;
            case "repeatDesign":
                this.products.slice(1).forEach(product => {
                    product.update({
                        design: value ? productEtalon.design : '',
                        designPayment: value ? productEtalon.designPayment : '',
                        designCost: value ? productEtalon.designCost : 0,
                    });
                });
                break;
            case "repeatMontage":
                this.products.slice(1).forEach(product => {
                    product.update({
                        installTime: value ?  productEtalon.installTime : '',
                        installCity: value ?  productEtalon.installCity : '',
                        installPlace: value ?  productEtalon.installPlace : '',
                        dismantlingArea: value ?  productEtalon.dismantlingArea : '',
                        installDays: value ?  productEtalon.installDays : '',
                        installCost: value ?  productEtalon.installCost : 0,
                        installPercentage: value ?  productEtalon.installPercentage : '',
                    });
                });
                break;
            case "repeatDeadline":
                this.products.slice(1).forEach(product => {
                    product.update({
                        terms: value ? productEtalon.terms : '',
                        termsDate: value ? productEtalon.termsDate : '',
                    });
                });
                break;
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
