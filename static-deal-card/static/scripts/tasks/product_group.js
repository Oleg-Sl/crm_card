import {
    SP_GROUP_ID,
    SP_GROUP_FIELDS,
} from '../parameters.js';
import {
    parseAmount,
    parseDateFromDatetimeString,
    convertYNToBoolean,
} from './common.js';


export class ProductGroup {
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
        
        this.initializeFields();

    }

    initializeFields() {
        this.initialValues = {};
        Object.keys(SP_GROUP_FIELDS).forEach(field => {
            this.initialValues[SP_GROUP_FIELDS[field]] = this[field];
        });
    }

    setProducts(products) {
        this.products = products;
    }

    addProduct(product) {
        this.products.push(product);
    }

    addTechnology(technology) {
        for (const product of this.products) {
            if (product.technologies.indexOf(technology) === -1) {
                product.addTechnology(technology);
            }
        }
    }

    removeProduct(product) {
        const index = this.products.indexOf(product);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    updateData(newData) {
        Object.keys(newData).forEach(field => {
            if (field !== 'products') {
                this.saveChanges(field, newData);
                this.updateField(field, newData[field]);
            }
        });

        if (newData?.products !== undefined) {
            this.setProducts(newData.products);
        }
        console.log(this.changedFields);
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

    updateField(field, value) {
        console.log(field, value);
        if (field in this) {
            this[field] = value;
        } else {
            console.error(`Field ${field} does not exist in ProductGroup`);
        }
    }

    getChangedFields() {
        return this.changedFields;
    }
}
