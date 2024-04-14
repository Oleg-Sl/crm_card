
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


export class Template {
    constructor() {
        this.fields = {};
        this.materials = {};
        this.editable = false;
    }

    setSmartFields(fields) {
        this.fields = fields;
    }

    setMaterialsData(materials) {
        this.materials = materials;
    }

    getGroupHTML(groupData, numberGroup = 1, editable = true) {
        this.editable = editable;
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

    getSummaryHTML(groupsData) {
        let productsCount = 0;
        for (const group of groupsData) {
            productsCount += group.products.length;
        }

        let areaMateria = 0;
        for (const group of groupsData) {
            for (const product of group.products) {
                for (const technology of product.technologies) {
                    const width = +technology.width || 0;
                    const runningMeter = +technology.runningMeter || 0;
                    const area = width * runningMeter;
                    areaMateria += area;
                }
            }
        }
        let areaInstall = 0;
        for (const group of groupsData) {
            for (const product of group.products) {
                for (const technology of product.technologies) {
                    const installArea = +technology.installArea || 0;
                    areaInstall += installArea;
                }
            }
        }

        return `
            <div class="task-container__summary" style="
                display: flex;
                font-family: Roboto;
                font-size: 10px;
                font-weight: 400;
                color: #464A4E;
                gap: 20px;
            ">
                <div>Позиций: <span id="taskProductsPositions">${groupsData.length}</span></div>
                <div>Кол-во: <span id="taskProductsCount">${productsCount}</span></div>
                <div>М прод.: <span id="taskProductsAreaMaterial">${this.numberToStr(areaMateria)}</span></div>
                <div>М монт.: <span id="taskProductsAreaInstall">${this.numberToStr(areaInstall)}</span></div>
            </div>
        `;
    }

    getProductHTML(productData, number, groupId, deliveryHTML) {
        let technologies = productData?.technologies || [];
        if (!technologies.length) {
            technologies = [];
        }

        const dismantlingDisabled = productData.dismantling == 8069 ? 'disabled' : '';

        return `
            <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupId}">
                <td class="block-center">
                    <div class="task-container__item-number">${number}</div>
                </td>
                <td>
                    <div>
                        <div class="task-container__item-info">
                            <div class="task-container__item-title">
                                <textarea name="" id="" placeholder="название" title="${this.customToString(productData.title)}" data-product-field="title" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}>${this.customToString(productData.title)}</textarea>
                            </div>
                            <div class="task-container__item-count">
                                <input type="text" name="" id="" placeholder="количество" title="${this.customToString(productData.quantity)}" value="${this.customToString(productData.quantity)}" data-product-field="quantity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                            </div>
                            <div class="task-container__item-desc">
                                <textarea name="" id=""  rows="3" placeholder="описание" data-product-field="description" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'} title="${this.customToString(productData.description)}" >${this.customToString(productData.description)}</textarea>
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
                            <input type="text" name="" id="" title="${this.customToString(productData.measurement)}" value="${this.customToString(productData.measurement)}" data-product-field="measurement" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-measure-address">
                            <input type="text" name="" id="" title="${this.customToString(productData.measurementAddress)}" value="${this.customToString(productData.measurementAddress)}" data-product-field="measurementAddress" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-measure-costprice">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себест. замера" title="${this.customToString(productData.measurementCost)}" value="${this.customToString(productData.measurementCost)}" data-product-field="measurementCost" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-design">
                        <div class="task-container__item-design-type">
                            <select name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}" data-product-field="design" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
                            </select>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-mounting">
                        <div class="task-container__item-mounting-city">
                            <select class="task-container_group-item-mounting-top" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installCity]?.items, productData.installCity)}" data-product-field="installCity" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installCity]?.items, productData.installCity)}
                            </select>
                        </div>
                        <div class="task-container__item-mounting-count-day">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="сколько дней" title="${this.customToString(productData.installDays)}" value="${this.customToString(productData.installDays)}" data-product-field="installDays" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-mounting-symbol-mul">
                            <i class="bi bi-x"></i>
                        </div>
                        <div class="task-container__item-mounting-type">
                            <select class="task-container_group-item-mounting-bottom" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installPlace]?.items, productData.installPlace)}" data-product-field="installPlace" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installPlace]?.items, productData.installPlace)}
                            </select>
                        </div>
                        <div class="task-container__item-mounting-costprice">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себ. аренды за день" title="${this.customToString(productData.installCost)}" value="${this.customToString(productData.installCost)}" data-product-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-deadlines">
                        <div class="task-container__item-deadlines-type">
                            <select name="" id="" data-product-field="terms" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}
                            </select>
                        </div>
                        <div class="task-container__item-deadlines-data">
                            <input type="date" name="" id="" title="${this.customToString(productData.termsDate)}" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-type="date" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-dismantling">
                        <div class="task-container__item-dismantling-area">
                            <input type="number" name="" id="" placeholder="площадь" title="${this.customToString(productData.dismantlingArea)}" value="${this.customToString(productData.dismantlingArea)}" data-product-field="dismantlingArea" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-difficulty-desc">
                            <select class="task-container_group-item-dismantling-top" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}" data-product-field="dismantling" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
                            </select> 
                        </div>
                        <div class="task-container__item-dismantling-difficulty-price">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="сложн. демонтожа" title="${this.customToString(productData.dismantlingComplexity)}" value="${this.customToString(productData.dismantlingComplexity)}" data-product-field="dismantlingComplexity" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-cost-desc">
                            <select class="task-container_group-item-dismantling-bottom" ${dismantlingDisabled} name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}" data-product-field="dismantlingDesc" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
                            </select>
                        </div>
                        <div class="task-container__item-dismantling-cost-price">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себест. демонтожа" title="${this.customToString(productData.dismantlingCost)}" value="${this.customToString(productData.dismantlingCost)}" data-product-field="dismantlingCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-business-trip">
                        <div class="task-container__item-business-trip-type" value="${this.customToString(productData.businessTrip)}">
                            <select class="task-container_group-item-dismantling-bottom ${this.editable ? 'employee-mos' : ''}" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.businessTrip]?.items, productData.businessTrip)}" data-product-field="businessTrip" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.businessTrip]?.items, productData.businessTrip)}
                            </select>
                        </div>
                        <div class="task-container__item-dismantling-count-workers">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="сколько. человек" title="${this.customToString(productData.businessTripPeople)}" value="${this.customToString(productData.businessTripPeople)}" data-product-field="businessTripPeople" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-count-days">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="сколько дней" title="${this.customToString(productData.businessTripDays)}" value="${this.customToString(productData.businessTripDays)}" data-product-field="businessTripDays" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-count-nights">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="проживание ночей" title="${this.customToString(productData.businessTripAccommodation)}" value="${this.customToString(productData.businessTripAccommodation)}" data-product-field="businessTripAccommodation" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-count-eating-days">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="питание дней" title="${this.customToString(productData.businessTripNutritions)}" value="${this.customToString(productData.businessTripNutritions)}" data-product-field="businessTripNutritions" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                        <div class="task-container__item-dismantling-count-miles">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="пробег" title="${this.customToString(productData.businessTripMileages)}" value="${this.customToString(productData.businessTripMileages)}" data-product-field="businessTripMileages" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-delivery-container">
                        <div class="task-container__item-delivery">
                            <div class="task-container__item-delivery-count">
                                <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="сколько раз" title="${this.customToString(productData.deliveryFrequency)}" value="${this.customToString(productData.deliveryFrequency)}" data-product-field="deliveryFrequency" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
                            </div>
                            <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
                            <div class="task-container__item-delivery-price">
                                <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себес. доставки за раз" title="${this.customToString(productData.deliveryCostPerTime)}" value="${this.customToString(productData.deliveryCostPerTime)}" data-product-field="deliveryCostPerTime" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}" ${this.editable ? '' : 'readonly'}ly>
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
                        <select name="" id="" title="${this.getTitleFromList(this.materials.technologiesTypes, technology.general)}" data-technology-field="general" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getTechnologyTypeOptionsHTML(technology.general)}
                        </select>
                    </div>
                    <div class="task-container__item-technology-material-1">
                        <select name="" id="" title="${this.getTitleFromList(this.materials.films, technology.film)}" data-technology-field="film" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getFilmsOptionsHTML(technology.film)}
                        </select>
                    </div>
                    <div class="task-container__item-technology-material-2">
                        <select name="" id="" title="${this.getTitleLaminations(technology.film, technology.lamination)}" data-technology-field="lamination" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="inKP" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
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
                        <input class="${this.editable ? 'employee-dis' : ''}" type="text" name="" id="" placeholder="ЧПП" title="${this.customToString(technology.CHPP)}" value="${this.customToString(technology.CHPP)}" data-technology-field="CHPP" data-type="text" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
                    </div>
                    <div class="task-container__item-consumption-item-empty"></div>
                    <div class="task-container__item-consumption-item-m2">м2</div>
                    <div class="task-container__item-consumption-item-width">
                        <select class="${this.editable ? 'employee-dis' : ''}" name="" id="" title="${this.getTitleWidths(technology.film, technology.width)}" data-technology-field="width" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getWidthsOptionsHTML(technology.film, technology.width)}
                        </select>
                    </div>
                    <div class="task-container__item-consumption-item-product">
                        <i class="bi bi-x"></i>
                    </div>
                    <div class="task-container__item-consumption-item-length">
                        <input class="${this.editable ? 'employee-dis' : ''}" type="number" name="" id="" placeholder="п.м." title="${this.customToString(technology.runningMeter)}" value="${this.customToString(technology.runningMeter)}" data-technology-field="runningMeter" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
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
                <div class="task-container__item-area-mounting technology-item technology-row " data-technology-id="${technology.id}">
                    <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="Площадь монтажа" title="${this.customToString(technology.installArea)}" value="${this.customToString(technology.installArea)}" data-technology-field="installArea" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
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
                        <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себест. монт." title="${this.customToString(technology.installCost)}" value="${this.customToString(technology.installCost)}" data-technology-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
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
                        <input type="number" name="" id="" title="${this.customToString(technology.totalPercent)}" value="${this.customToString(technology.totalPercent)}" data-technology-field="totalPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
                    </div>
                    <div class="task-container__item-summary-percent-percent">%</div>${this.editable ? 'employee-mos' : ''}
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
                    <span class="task-container__item-summary-amount-value" data-technology-field="dismantling" data-type="number" title="${this.numberToStr(technology.amount)}">${this.numberToStr(technology.amount)}</span> &nbsp; ₽
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
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="addedToOrder" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}" ${this.editable ? '' : 'readonly'}ly>
                </div>
            `;
        }

        return contentHTML;
    }

    getDeliveryHTML(groupData, technologiesCount) {
        return `
            <td class="shared block-center" style="grid-row: span ${technologiesCount}">
                <div class="task-container__item-delivery-cp-container">
                    <div class="task-container__item-delivery-cp">
                        <div class="task-container__item-delivery-cp-method">
                            <select name="" id="" title="${this.getTitleFromEnums(this.fields?.group?.[SP_GROUP_FIELDS.deliveryMethod]?.items, groupData.deliveryMethod)}" data-group-field="deliveryMethod" data-type="select" data-group-id="${groupData.id}">
                                ${this.getOptionsHTML(this.fields?.group?.[SP_GROUP_FIELDS.deliveryMethod]?.items, groupData.deliveryMethod)}
                            </select>
                        </div>
                        <div class="task-container__item-delivery-cp-address">
                            <textarea name="" id="" rows="2" placeholder="адрес" data-group-field="deliveryAddress" data-group-id="${groupData.id}" data-type="textarea" data-group-id="${groupData.id}" ${this.editable ? '' : 'readonly'} title="${this.customToString(groupData.deliveryAddress)}">${this.customToString(groupData.deliveryAddress)}</textarea>
                        </div>
                        <div class="task-container__item-delivery-cp-cost">
                            <input class="${this.editable ? 'employee-mos' : ''}" type="number" name="" id="" placeholder="себес. курьер. ЦП" title="${this.customToString(groupData.deliveryCost)}" value="${this.customToString(groupData.deliveryCost)}" data-group-field="deliveryCost" data-type="number" data-group-id="${groupData.id}" ${this.editable ? '' : 'readonly'}ly>
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
                contentHTML += `<option value="${field.ID}" ${this.editable ? '' : 'disabled'}>${field.VALUE}</option>`;
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
                technologyTypeListHTML += `<option value="${id}" ${this.editable ? '' : 'disabled'}>${title}</option>`
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
                filmsListHTML += `<option value="${id}" ${this.editable ? '' : 'disabled'}>${title}</option>`
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
                laminationsHTML += `<option value="${id}" ${this.editable ? '' : 'disabled'}>${title}</option>`
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
                widthsHTML += `<option value="${id}" ${this.editable ? '' : 'disabled'}>${title}</option>`
            }
        }

        return widthsHTML;
    }

    customToString(value) {
        if (value === 0) {
            return "0";
        } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return "";
        } else if (typeof value === 'string' && value.includes('|')) {
            const parts = value.split('|');
            const numberPart = parseFloat(parts[0]);
            return isNaN(numberPart) ? "" : numberPart;
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

    getTitleFromList(items, ident) {
        for (const {id, title} of items) {
            if (id == ident) {
                return title;
            }
        }

        return "";
    }

    getTitleFromEnums(fields, ident) {
        for (const {ID, VALUE} of fields) {
            if (ID == ident) {
                return VALUE;
            }
        }
        return "";
    }

    getTitleLaminations(filmId, laminationId) {
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.film] == filmId) || {};
        const laminationIds = dependence?.[SP_DEPENDENCE_FIELDS.laminations] || [];
        const laminationsList = this.materials.laminations.filter(obj => laminationIds.includes(String(obj.id)));
        for (let { id, title } of laminationsList) {
            if (id == laminationId) {
                return title;
            }
        }
        return "";
    }

    getTitleSources(source) {
        const [nameSelected, urlSelected, previewSelected, commentSelected] = source.split(';');
        return `${nameSelected} (${commentSelected || ""})`;
    }

    getTitleWidths(filmId, widthId) {
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.film] == filmId) || {};
        const widthIds = dependence?.[SP_DEPENDENCE_FIELDS.widths] || [];
        const widthsList = this.materials.widths.filter(obj => widthIds.includes(String(obj.id)));
        for (let { id, title } of widthsList) {
            if (id == widthId) {
                return title;
            }
        }
        return "";
    }
}


