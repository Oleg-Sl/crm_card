
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_DEPENDENCE_ID,
    
    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,
    SP_DEPENDENCE_FIELDS,
} from '../parameters.js';


export class TemplatesOrderTask {
    constructor() {
        this.fields = {};
        this.materials = {};
    }

    setSmartFields(fields) {
        this.fields = fields;
    }

    setMaterialsData(materials) {
        this.materials = materials;
    }

    getGroupHTML(groupData, numberGroup = 1) {
        let products = groupData?.products || [];
        if (products.length === 0) {
            products = [];
        }

        let productsHTML = '';
        for (let index in products) {
            const productData = products[index];
            const deliveryHTML = (index == 0) ? this.getDeliveryHTML(groupData, products.length) : '';
            productsHTML += this.getProductHTML(productData, +index + 1, groupData.id, deliveryHTML);
        }

        return `
            <div class="offer-group" data-group-id="${groupData.id}">
                <div class="task-container__group-title">
                    <span>Группа ${numberGroup}: </span><input type="text" placeholder="Название" value="${this.customToString(groupData.title)}" data-group-field="title" data-type="text" data-group-id="${groupData.id}">
                </div>
                <table>
                    <thead>
                        <tr>
                            <th class="">№</th>
                            <th class="">о позиции</th>
                            <th class="">технология</th>
                            <th class="task-container__group-header-consumption">
                                <div>расход (1 ед.)</div>
                                <div>
                                    <span>м2</span>
                                    <span>прод</span>
                                </div>
                            </th>
                            <th class="task-container__group-header-area-mounting">
                                <span>м2 монт</span>
                            </th>
                            <th class=""></th>
                            <th class="">замер</th>
                            <th class="">дизайн</th>
                            <th class="">монтаж</th>
                            <th class="">сроки</th>
                            <th class="">
                                <span>демонтаж(1ед.)</span>
                            </th>
                            <th class="">
                                <span>командировка / выезд</span>
                            </th>
                            <th class="">
                                <span>доставка</span>
                            </th>
                            <th class="">цп</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHTML}
                    </tbody>
                </table>
            </div>
    
        `;
    }

    getProductHTML(productData, number, groupId, deliveryHTML) {
        let technologies = productData?.technologies || [];
        if (!technologies.length) {
            technologies = [];
        }

        return `
            <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupId}">
                <td class="block-center">
                    <div class="task-container__item-number">${number}</div>
                </td>
                <td>
                    <div>
                        <div class="task-container__item-info">
                            <div class="task-container__item-title">
                                <input type="text" name="" id="" placeholder="название" value="${this.customToString(productData.title)}" data-product-field="title" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                            </div>
                            <div class="task-container__item-count">
                                <input type="text" name="" id="" placeholder="количество" value="${this.customToString(productData.quantity)}" data-product-field="quantity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                            </div>
                            <div class="task-container__item-desc">
                                <textarea name="" id=""  rows="3" placeholder="описание" data-product-field="description" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>${this.customToString(productData.description)}</textarea>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="task-container__item-technologies">
                        ${this.getTechnologiesHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
                <td>
                    <div class="task-container__item-consumption">
                        ${this.getConsumptionHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
                <td>
                    <div class="task-container__item-area-mountings">
                        ${this.getAreaMountingHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
                <td>
                    <div class="task-container__item-amounts">
                        ${this.getAmountsHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-measure">
                        <div class="task-container__item-measure-status">
                            <input type="text" name="" id="" value="${this.customToString(productData.measurement)}" data-product-field="measurement" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-measure-address">
                            <input type="text" name="" id="" value="${this.customToString(productData.measurementAddress)}" data-product-field="measurementAddress" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-measure-costprice">
                            <input type="number" name="" id="" placeholder="себест. замера" value="${this.customToString(productData.measurementCost)}" data-product-field="measurementCost" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-design">
                        <div class="task-container__item-design-type">
                            <select name="" id="" data-product-field="design" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
                            </select>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-mounting">
                        <div class="task-container__item-mounting-city">
                            <input type="text" name="" id="" value="${this.customToString(productData.installCity)}"  data-product-field="installCity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-mounting-count-day">
                            <input type="number" name="" id="" placeholder="сколько дней" value="${this.customToString(productData.installDays)}" data-product-field="installDays" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-mounting-symbol-mul">
                            <i class="bi bi-x"></i>
                        </div>
                        <div class="task-container__item-mounting-type">
                            <input type="text" name="" id="" value="${this.customToString(productData.installPlace)}" data-product-field="installPlace" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-mounting-costprice">
                            <input type="number" name="" id="" placeholder="себ. аренды за день" value="${this.customToString(productData.installCost)}" data-product-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-deadlines">
                        <div class="task-container__item-deadlines-type">
                            <select name="" id="" data-product-field="terms" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}
                            </select>
                        </div>
                        <div class="task-container__item-deadlines-data">
                            <input type="date" name="" id="" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-type="date" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-dismantling">
                        <div class="task-container__item-dismantling-area">
                            <input type="number" name="" id="" value="${this.customToString(productData.dismantlingArea)}" data-product-field="dismantlingArea" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-difficulty-desc">
                            <select class="task-container_group-item-dismantling-top" name="" id="" data-product-field="dismantling" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
                            </select>    
                        </div>
                        <div class="task-container__item-dismantling-difficulty-price">
                            <input type="number" name="" id="" placeholder="сложн. демонтожа" value="${this.customToString(productData.dismantlingComplexity)}" data-product-field="dismantlingComplexity" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-cost-desc">
                            <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="dismantlingDesc" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
                            </select>
                        </div>
                        <div class="task-container__item-dismantling-cost-price">
                            <input type="number" name="" id="" placeholder="себест. демонтожа" value="${this.customToString(productData.dismantlingCost)}" data-product-field="dismantlingCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-business-trip">
                        <div class="task-container__item-business-trip-type" value="${this.customToString(productData.businessTrip)}">
                            <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="businessTrip" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.businessTrip]?.items, productData.businessTrip)}
                            </select>
                        </div>
                        <div class="task-container__item-dismantling-count-workers">
                            <input type="number" name="" id="" placeholder="сколько. человек" value="${this.customToString(productData.businessTripPeople)}" data-product-field="businessTripPeople" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-count-days">
                            <input type="number" name="" id="" placeholder="сколько дней" value="${this.customToString(productData.businessTripDays)}" data-product-field="businessTripDays" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-count-nights">
                            <input type="number" name="" id="" placeholder="проживание ночей" value="${this.customToString(productData.businessTripAccommodation)}" data-product-field="businessTripAccommodation" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-count-eating-days">
                            <input type="number" name="" id="" placeholder="питание дней" value="${this.customToString(productData.businessTripNutritions)}" data-product-field="businessTripNutritions" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                        <div class="task-container__item-dismantling-count-miles">
                            <input type="number" name="" id="" placeholder="пробег" value="${this.customToString(productData.businessTripMileages)}" data-product-field="businessTripMileages" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-delivery-container">
                        <div class="task-container__item-delivery">
                            <div class="task-container__item-delivery-count">
                                <input type="number" name="" id="" placeholder="сколько раз" value="${this.customToString(productData.deliveryFrequency)}" data-product-field="deliveryFrequency" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                            </div>
                            <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
                            <div class="task-container__item-delivery-price">
                                <input type="number" name="" id="" placeholder="себес. доставки за раз" value="${this.customToString(productData.deliveryCostPerTime)}" data-product-field="deliveryCostPerTime" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" readonly>
                            </div>
                        </div>
                    </div>
                </td>
                ${deliveryHTML}
            </tr>
        `;
    }

    getTechnologiesHTML(technologies, groupId, productId) {
        let contentHTML = '';
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-technology technology-row" data-technology-id="${technology.id}">
                    <div class="task-container__item-technology-type">
                        <select name="" id="" data-technology-field="general" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getTechnologyTypeOptionsHTML(technology.general)}
                        </select>
                    </div>
                    <div class="task-container__item-technology-material-1">
                        <select name="" id="" data-technology-field="film" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getFilmsOptionsHTML(technology.film)}
                        </select>
                    </div>
                    <div class="task-container__item-technology-material-2">
                        <select name="" id="" data-technology-field="lamination" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getLaminationsOptionsHTML(technology.film, technology.lamination)}
                        </select>
                    </div>
                </div>
            `;
        }
        return contentHTML;
    }

    getIsOffersHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            let checked = technology.inKP ? 'checked' : '';
            contentHTML += `
                <div class="task-container__item-is-offer technology-item technology-row" data-technology-id="${technology.id}">
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="inKP" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                </div>
            `;
        }
        return contentHTML;
    }

    getConsumptionHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-consumption-item technology-row" data-technology-id="${technology.id}">
                    <div class="task-container__item-consumption-item-img">🖼</div>
                    <div class="task-container__item-consumption-item-title">
                        <input type="text" name="" id="" placeholder="ЧПП" value="${this.customToString(technology.CHPP)}" data-technology-field="CHPP" data-type="text" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                    </div>
                    <div class="task-container__item-consumption-item-empty"></div>
                    <div class="task-container__item-consumption-item-m2">м2</div>
                    <div class="task-container__item-consumption-item-width">
                        <select name="" id="" data-technology-field="width" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getWidthsOptionsHTML(technology.film, technology.width)}
                        </select>
                    </div>
                    <div class="task-container__item-consumption-item-product">
                        <i class="bi bi-x"></i>
                    </div>
                    <div class="task-container__item-consumption-item-length">
                        <input type="number" name="" id="" placeholder="п.м." value="${this.customToString(technology.runningMeter)}" data-technology-field="runningMeter" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                    </div>
                    <div class="task-container__item-consumption-item-result">=${this.mulNumbmer(technology.width, technology.runningMeter)}</div>
                </div>
            `;
        }
    
        return contentHTML;
    }

    getAreaMountingHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-area-mounting technology-item technology-row" data-technology-id="${technology.id}">
                    <input type="number" name="" id="" placeholder="Площадь монтажа" value="${this.customToString(technology.installArea)}" data-field="installArea" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                </div>
            `;
        }
    
        return contentHTML;
    }

    getAmountsHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-amount technology-item technology-row" data-technology-id="${technology.id}">
                    <div class="task-container__item-amount-costprice">
                        <input type="number" name="" id="" placeholder="себест. монт." value="${this.customToString(technology.installCost)}" data-technology-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                    </div>
                </div>
            `;
        }
    
        return contentHTML;
    }

    getSummaryPercentHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-summary-percent technology-item technology-row" data-technology-id="${technology.id}">
                    <div class="task-container__item-summary-percent-plus">+</div>
                    <div class="task-container__item-summary-percent-value">
                        <input type="number" name="" id="" value="${this.customToString(technology.totalPercent)}" data-technology-field="totalPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                    </div>
                    <div class="task-container__item-summary-percent-percent">%</div>
                </div>
            `;
        }
        return contentHTML;
    }

    getSummaryAmountHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-summary-amount technology-item">
                    <span class="task-container__item-summary-amount-value" data-technology-field="dismantling" data-type="number">${this.numberToStr(technology.amount)}</span> &nbsp; ₽
                </div>
            `;
        }
        return contentHTML;
    }

    getAddedProductHTML(technologies, groupId, productId) {
        let contentHTML = '';
    
        for (let technology of technologies) {
            let checked = technology.addedToOrder ? 'checked' : '';
            contentHTML += `
                <div class="task-container__item-added technology-item technology-row" data-technology-id="${technology.id}">
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="addedToOrder" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" readonly>
                </div>
            `;
        }
        return contentHTML;
    }

    getDeliveryHTML(groupData, technologiesCount) {
        //     <td class="shared block-center" style="grid-row: span ${technologiesCount}">
        //     <div class="task-container__item-delivery-container">
        //         <div class="task-container__item-delivery">
        //             <div class="task-container__item-delivery-count">
        //                 <input type="number" name="" id="" placeholder="сколько раз" value="${this.customToString(groupData.deliveryCount)}" data-group-field="deliveryCount" data-type="number" data-group-id="${groupData.id}">
        //             </div>
        //             <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
        //             <div class="task-container__item-delivery-price">
        //                 <input type="number" name="" id="" placeholder="себес. доставки за раз" value="${this.customToString(groupData.deliveryCostOne)}" data-group-field="deliveryCostOne" data-type="number" data-group-id="${groupData.id}">
        //             </div>
        //         </div>
        //     </div>
        // </td>
        return `
            <td class="shared block-center" style="grid-row: span ${technologiesCount}">
                <div class="task-container__item-delivery-cp-container">
                    <div class="task-container__item-delivery-cp">
                        <div class="task-container__item-delivery-cp-method">
                            <select name="" id="" data-group-field="deliveryMethod" data-type="select" data-group-id="${groupData.id}">
                                ${this.getOptionsHTML(this.fields?.group?.[SP_GROUP_FIELDS.deliveryMethod]?.items, groupData.deliveryMethod)}
                            </select>
                        </div>
                        <div class="task-container__item-delivery-cp-address">
                            <textarea name="" id="" rows="2" data-group-field="deliveryAddress" data-data-group-id="${groupData.id}"type="textarea" data-group-id="${groupData.id}" readonly>${this.customToString(groupData.deliveryAddress)}</textarea>
                        </div>
                        <div class="task-container__item-delivery-cp-cost">
                            <input type="number" name="" id="" placeholder="себес. курьер. ЦП" value="${this.customToString(groupData.deliveryCost)}" data-group-field="deliveryCost" data-type="number" data-group-id="${groupData.id}" readonly>
                        </div>
                    </div>
                </div>
            </td>
        `;
    }

    getOptionsHTML(fields, value) {
        let contentHTML = '<option value=""></option>';
        for (const field of fields) {
            if (field.ID == value) {
                contentHTML += `<option value="${field.ID}" selected>${field.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${field.ID}" disabled>${field.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    getTechnologyTypeOptionsHTML(techId) {
        let technologyTypeListHTML = '<option value=""></option>';
        for (const {id, title} of this.materials.technologiesTypes) {
            if (id == techId) {
                technologyTypeListHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                technologyTypeListHTML += `<option value="${id}" disabled>${title}</option>`
            }
        }

        return technologyTypeListHTML;
    }

    getFilmsOptionsHTML(filmId) {
        let filmsListHTML = '<option value=""></option>';
        for (const {id, title} of this.materials.films) {
            if (id == filmId) {
                filmsListHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                filmsListHTML += `<option value="${id}" disabled>${title}</option>`
            }
        }

        return filmsListHTML;
    }

    getLaminationsOptionsHTML(filmId, laminationId) {
        let laminationsHTML = '<option value=""></option>';
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.film] == filmId) || {};
        const laminationIds = dependence?.[SP_DEPENDENCE_FIELDS.laminations] || [];
        const laminationsList = this.materials.laminations.filter(obj => laminationIds.includes(String(obj.id)));

        for (let { id, title } of laminationsList) {
            if (id == laminationId) {
                laminationsHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                laminationsHTML += `<option value="${id}" disabled>${title}</option>`
            }
        }

        return laminationsHTML;
    }

    getWidthsOptionsHTML(filmId, widthId) {
        let widthsHTML = '<option value=""></option>';
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.film] == filmId) || {};
        const widthIds = dependence?.[SP_DEPENDENCE_FIELDS.widths] || [];
        const widthsList = this.materials.widths.filter(obj => widthIds.includes(String(obj.id)));

        for (let { id, title } of widthsList) {
            if (id == widthId) {
                widthsHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                widthsHTML += `<option value="${id}" disabled>${title}</option>`
            }
        }

        return widthsHTML;
    }

    customToString(value) {
        if (value === 0) {
            return "0";
        } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return "";
        } else {
            return value;
        }
    }

    mulNumbmer(num1, num2) {
        try {
            num1 = parseFloat(num1) || 0;
            num2 = parseFloat(num2) || 0;
        } catch (e) {
            num1 = 0;
            num2 = 0;
        }
        const res = num1 * num2;
        return res.toFixed(1);
    }

    numberToStr(value) {
        if (value === 0) {
            return "0";
        } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return "0";
        } else {
            return value.toFixed(2);
        }
    }

    formatDateForInput(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}


