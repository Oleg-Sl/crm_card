import ChangeHistory from './history.js';
import {
    FIELD_DEAL_TITLE,
    FIELD_DEAL_ORDER_NUMBER,
    FIELD_DEAL_SOURCE_ID,
    FIELD_DEAL_DESCRIPTIONS,
} from '../parameters.js';


// Название идентификаторов в HTML:
const ID__NUMBER_ORDER = "dealDescNumberOrder";
const ID__TITLE = "dealDescTitle";
const ID__SOURCE = "dealDescSource";


const KEY_FIELD_IDS = [
    "dealDescKeyField1",
    "dealDescKeyField2",
    "dealDescKeyField3",
    "dealDescKeyField4",
    "dealDescKeyField5",
    "dealDescKeyField6",
    "dealDescKeyField7",
    "dealDescKeyField8",
    "dealDescKeyField9"
];


const VALUE_FIELD_IDS = [
    "dealDescValueField1",
    "dealDescValueField2",
    "dealDescValueField3",
    "dealDescValueField4",
    "dealDescValueField5",
    "dealDescValueField6",
    "dealDescValueField7",
    "dealDescValueField8",
    "dealDescValueField9"
];


export default class DealDescription extends ChangeHistory {
    constructor(container) {
        super();
        this.container = container;

        // Найденные элементы HTML
        this.numberOrderElement = this.findElement(`#${ID__NUMBER_ORDER}`);
        this.titleElement = this.findElement(`#${ID__TITLE}`);
        this.sourceSelect = this.findElement(`#${ID__SOURCE}`);
        this.keyFieldElements = KEY_FIELD_IDS.map(id => this.findElement(`#${id}`));
        this.valueFieldElements = VALUE_FIELD_IDS.map(id => this.findElement(`#${id}`));

        // Последние сохраненные данные в Битриксе
        this.sources = null;
        this.orderNumber = null;
        this.dealTitle = null;
        this.requestSource = null;
        this.fieldValues = Array(9).fill(null);

        this.addEventListeners();
    }

    init(dealData, dealSources) {
        this.sources = dealSources;
        this.clearHistory();
        this.setData(dealData, dealSources)
        this.render();
    }

    getChangedData() {
        const newDealData = {
            [FIELD_DEAL_ORDER_NUMBER]: this.numberOrderElement.value,
            [FIELD_DEAL_TITLE]: this.titleElement.value,
            [FIELD_DEAL_SOURCE_ID]: this.sourceSelect.value,
            [FIELD_DEAL_DESCRIPTIONS[0]]: [this.keyFieldElements[0].value, this.valueFieldElements[0].value],
            [FIELD_DEAL_DESCRIPTIONS[1]]: [this.keyFieldElements[1].value, this.valueFieldElements[1].value],
            [FIELD_DEAL_DESCRIPTIONS[2]]: [this.keyFieldElements[2].value, this.valueFieldElements[2].value],
            [FIELD_DEAL_DESCRIPTIONS[3]]: [this.keyFieldElements[3].value, this.valueFieldElements[3].value],
            [FIELD_DEAL_DESCRIPTIONS[4]]: [this.keyFieldElements[4].value, this.valueFieldElements[4].value],
            [FIELD_DEAL_DESCRIPTIONS[5]]: [this.keyFieldElements[5].value, this.valueFieldElements[5].value],
            [FIELD_DEAL_DESCRIPTIONS[6]]: [this.keyFieldElements[6].value, this.valueFieldElements[6].value],
            [FIELD_DEAL_DESCRIPTIONS[7]]: [this.keyFieldElements[7].value, this.valueFieldElements[7].value],
            [FIELD_DEAL_DESCRIPTIONS[8]]: [this.keyFieldElements[8].value, this.valueFieldElements[8].value],
        };

        // this.setData(newDealData)
        
        return newDealData;
    }

    getChangeHistory(fieldId, oldValue, newValue) {
        return super.getHistory();
    }

    clearChangeHistory() {
        super.clearHistory();
    }

    updateChangeHistory(fieldId, oldValue, newValue) {
        super.updateHistory(fieldId, oldValue, newValue);
    }

    setData(dealData, dealSources) {
        this.sources = dealSources;

        this.orderNumber = dealData?.[FIELD_DEAL_ORDER_NUMBER];
        this.dealTitle = dealData?.[FIELD_DEAL_TITLE];
        this.requestSource = dealData?.[FIELD_DEAL_SOURCE_ID];

        for (let i = 0; i < FIELD_DEAL_DESCRIPTIONS.length; i++) {
            this.fieldValues[i] = dealData?.[FIELD_DEAL_DESCRIPTIONS[i]];
        }
    }
    
    addEventListeners() {
        this.container.addEventListener('change', (e) => {
            const elem = e.target;
            switch (elem.id) {
                case ID__NUMBER_ORDER:
                    this.updateChangeHistory(FIELD_DEAL_ORDER_NUMBER, this.orderNumber, elem.value);
                    break;
                case ID__TITLE:
                    this.updateChangeHistory(FIELD_DEAL_TITLE, this.dealTitle, elem.value);
                    break;
                case ID__SOURCE:
                    this.updateChangeHistory(FIELD_DEAL_SOURCE_ID, this.requestSource, elem.value);
                    break;
                default:
                    const fieldIndex = this.getFieldIndexById(elem.id);
                    if (fieldIndex !== -1) {
                        const fieldId = FIELD_DEAL_DESCRIPTIONS[fieldIndex];
                        const oldValue = this.fieldValues[fieldIndex];
                        const newValue = [this.keyFieldElements[fieldIndex].value, this.valueFieldElements[fieldIndex].value];

                        this.updateChangeHistory(fieldId, oldValue, newValue);
                    }
                    break;
            }
        });
    }

    getFieldIndexById(elementId) {
        return KEY_FIELD_IDS.indexOf(elementId) !== -1
            ? KEY_FIELD_IDS.indexOf(elementId)
            : VALUE_FIELD_IDS.indexOf(elementId);
    }

    render() {
        this.setValue(this.numberOrderElement, this.orderNumber);
        this.setValue(this.titleElement, this.dealTitle);
        this.renderSourceSelect(this.sources, this.requestSource);

        for (let i = 0; i < 9; i++) {
            this.renderKeyValueField(this.keyFieldElements[i], this.valueFieldElements[i], this.fieldValues[i]);
        }
    }

    setValue(element, value) {
        if (element) {
            element.value = value || '';
        }
    }

    renderKeyValueField(keyElement, valueElement, value) {
        if (keyElement && valueElement) {
            this.setValueByElementType(keyElement, value && value[0]);
            this.setValueByElementType(valueElement, value && value[1]);
        }
    }

    setValueByElementType(element, value) {
        if (element && value) {
            const elementType = element.tagName.toLowerCase();
            element.title = value || '';
            switch (elementType) {
                case 'input':
                case 'textarea':
                    element.value = value || '';
                    break;
                default:
                    element.textContent = value || '';
                    break;
            }
        }
    }

    renderSourceSelect(sourceList, selectedStatusId) {
        if (this.sourceSelect) {
            this.sourceSelect.innerHTML = '';
            sourceList.forEach(source => {
                const option = document.createElement('option');
                option.value = source.STATUS_ID;
                option.text = source.NAME;
                this.sourceSelect.add(option);
                if (source.STATUS_ID === selectedStatusId) {
                    option.selected = true;
                }
            });
        }
    }

    findElement(selector) {
        return this.container.querySelector(selector);
    }

}






// export default class DealDescription extends ChangeHistory {
//     constructor(container) {
//         super();
//         this.container = container;

//         this.numberOrder = {
//             keyBx24: ORDER_NUMBER,
//             value: null,
//             idHTML: ID__NUMBER_ORDER,
//             elementHTML: this.findElement(`#${ID__NUMBER_ORDER}`)
//         };

//         this.titleElement = {
//             keyBx24: TITLE,
//             value: null,
//             idHTML: ID__TITLE,
//             elementHTML: this.findElement(`#${ID__TITLE}`)
//         };

//         this.source = {
//             keyBx24: SOURCE_ID,
//             value: null,
//             idHTML: ID__SOURCE,
//             elementHTML: this.findElement(`#${ID__SOURCE}`)
//         };
        
//         this.keyFieldElements = KEY_FIELD_IDS.map(id => this.findElement(`#${id}`));
//         this.valueFieldElements = VALUE_FIELD_IDS.map(id => this.findElement(`#${id}`));

//         this.sources = null;
        
//         this.fieldValues = Array(9).fill(null);
//     }

//     init(dealData, dealSources) {
//         this.sources = dealSources;

//         this.orderNumber = dealData?.[ORDER_NUMBER];
//         this.dealTitle = dealData?.[TITLE];
//         this.requestSource = dealData?.[SOURCE_ID];

//         for (let i = 0; i < FIELDS.length; i++) {
//             this.fieldValues[i] = dealData?.[FIELDS[i]];
//         }

//         this.render();
//         this.addEventListeners();
//     }


//     addEventListeners() {
//         this.addInputEventListeners();
//         this.addSelectEventListener();
//     }

//     addInputEventListeners() {
//         const inputElements = [this.numberOrderElement, this.titleElement, ...this.keyFieldElements, ...this.valueFieldElements];
//         inputElements.forEach(inputElement => {
//             inputElement.addEventListener('input', () => {
//                 this.handleFieldChange(inputElement);
//             });
//         });
//     }

//     addSelectEventListener() {
//         if (this.sourceSelect) {
//             this.sourceSelect.addEventListener('change', () => {
//                 this.handleFieldChange(this.sourceSelect);
//             });
//         }
//     }

//     render() {
//         this.setValue(this.numberOrderElement, this.orderNumber);
//         this.setValue(this.titleElement, this.dealTitle);
//         this.renderSourceSelect(this.sources, this.requestSource);

//         for (let i = 0; i < 9; i++) {
//             this.renderKeyValueField(this.keyFieldElements[i], this.valueFieldElements[i], this.fieldValues[i]);
//         }
//     }

//     setValue(element, value) {
//         if (element) {
//             element.value = value || '';
//         }
//     }

//     renderKeyValueField(keyElement, valueElement, value) {
//         if (keyElement && valueElement) {
//             this.setValueByElementType(keyElement, value && value[0]);
//             this.setValueByElementType(valueElement, value && value[1]);
//         }
//     }

//     setValueByElementType(element, value) {
//         if (element) {
//             const elementType = element.tagName.toLowerCase();
//             switch (elementType) {
//                 case 'input':
//                 case 'textarea':
//                     element.value = value || '';
//                     break;
//                 default:
//                     element.textContent = value || '';
//                     break;
//             }
//         }
//     }

//     renderSourceSelect(sourceList, selectedStatusId) {
//         if (this.sourceSelect) {
//             this.sourceSelect.innerHTML = '';
//             sourceList.forEach(source => {
//                 const option = document.createElement('option');
//                 option.value = source.STATUS_ID;
//                 option.text = source.NAME;
//                 this.sourceSelect.add(option);
//                 if (source.STATUS_ID === selectedStatusId) {
//                     option.selected = true;
//                 }
//             });
//         }
//     }

//     findElement(selector) {
//         return this.container.querySelector(selector);
//     }

//     updateChangeHistory(fieldId, oldValue, newValue) {
//         super.updateHistory(fieldId, oldValue, newValue);
//     }
// }



// export default class DealDescription {
//     constructor(container) {
//         console.log("container = ", container);
//         this.container = container;

//         this.sources = null;
//         this.orderNumber = null;
//         this.dealTitle = null;
//         this.requestSource = null;
//         this.field_1 = null;
//         this.field_2 = null;
//         this.field_3 = null;
//         this.field_4 = null;
//         this.field_5 = null;
//         this.field_6 = null;
//         this.field_7 = null;
//         this.field_8 = null;
//         this.field_9 = null;
//     }

//     init(dealData, dealSources) {
//         this.sources = dealSources;

//         this.orderNumber = dealData?.[ORDER_NUMBER];
//         this.dealTitle = dealData?.[TITLE];
//         this.requestSource = dealData?.[SOURCE_ID];
//         this.field_1 = dealData?.[FIELD_1];
//         this.field_2 = dealData?.[FIELD_2];
//         this.field_3 = dealData?.[FIELD_3];
//         this.field_4 = dealData?.[FIELD_4];
//         this.field_5 = dealData?.[FIELD_5];
//         this.field_6 = dealData?.[FIELD_6];
//         this.field_7 = dealData?.[FIELD_7];
//         this.field_8 = dealData?.[FIELD_8];
//         this.field_9 = dealData?.[FIELD_9];
//         this.render();
//         // this.initEventListeners();
//     }

//     render() {
//         this.setValue('#qq' + ID__NUMBER_ORDER, this.orderNumber);
//         this.setValue(`#${ID__TITLE}`, this.dealTitle);
//         this.renderSourceSelect(this.sources, this.requestSource);

//         for (let i = 1; i <= 9; i++) {
//             this.renderKeyValueField(`dealDescKeyField${i}`, `dealDescValueField${i}`, this[`field_${i}`]);
//         }
//     }

//     setValue(selector, value) {
//         const element = this.container.querySelector(selector);
//         if (element) {
//             element.value = value || '';
//         }
//     }

//     renderKeyValueField(keyId, valueId, value) {
//         const keyElement = this.container.querySelector(`#${keyId}`);
//         const valueElement = this.container.querySelector(`#${valueId}`);

//         if (keyElement && valueElement) {
//             this.setValueByElementType(keyElement, value && value[0]);
//             this.setValueByElementType(valueElement, value && value[1]);
//         }
//     }

//     setValueByElementType(element, value) {
//         if (element) {
//             const elementType = element.tagName.toLowerCase();
//             switch (elementType) {
//                 case 'input':
//                 case 'textarea':
//                     element.value = value || '';
//                     break;
//                 default:
//                     element.textContent = value || '';
//                     break;
//             }
//         }
//     }

//     renderSourceSelect(sourceList, selectedStatusId) {
//         const sourceSelect = this.container.querySelector(`#${ID__SOURCE}`);

//         if (sourceSelect) {
//             sourceSelect.innerHTML = '';
//             sourceList.forEach(source => {
//                 const option = document.createElement('option');
//                 option.value = source.STATUS_ID;
//                 option.text = source.NAME;
//                 sourceSelect.add(option);
//                 if (source.STATUS_ID === selectedStatusId) {
//                     option.selected = true;
//                 }
//             });
//         }
//     }

//     // initEventListeners() {
//     //     const allElements = [...KEY_FIELD_IDS, ...VALUE_FIELD_IDS, ID__SOURCE, ID__NUMBER_ORDER, ID__TITLE].map(id => this.container.querySelector(`#${id}`));

//     //     allElements.forEach(element => {
//     //         if (element) {
//     //             if (element.tagName.toLowerCase() === 'select') {
//     //                 element.addEventListener('change', this.handleInputChange.bind(this));
//     //             } else {
//     //                 element.addEventListener('blur', this.handleInputChange.bind(this));
//     //             }
//     //         }
//     //     });
//     // }

//     // handleInputChange(event) {
//     //     const element = event.target;
//     //     const id = element.id;

//     //     switch (id) {
//     //         case ID__NUMBER_ORDER:
//     //             this.orderNumber = element.value;
//     //             break;
//     //         case ID__TITLE:
//     //             this.dealTitle = element.value;
//     //             break;
//     //         case ID__SOURCE:
//     //             this.requestSource = element.value;
//     //             break;
//     //         default:
//     //             const fieldNumber = id.match(/\d+/)[0];
//     //             if (fieldNumber >= 1 && fieldNumber <= 9) {
//     //                 console.log('element = ', element);
//     //                 console.log('element.previousElementSibling = ', element.previousElementSibling);
//     //                 // this[`field_${fieldNumber}`] = [element.previousElementSibling.textContent.trim(), element.value];
//     //             }
//     //             break;
//     //     }
//     //     console.log(this);
//     // }
// }
