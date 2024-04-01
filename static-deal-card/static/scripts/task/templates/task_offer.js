
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_DEPENDENCE_ID,
    
    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,
    SP_DEPENDENCE_FIELDS,
} from '../../parameters.js';


export class Templates {
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
            productsHTML += this.getProductHTML(productData, +index + 1, groupData.id, deliveryHTML, groupData);
        }

        return `
            <div class="offer-group" data-group-id="${groupData.id}">
                <div class="task-container__group-title">
                    <span>Группа ${numberGroup}: </span><input type="text" placeholder="Название" value="${this.customToString(groupData.title)}" data-group-field="title" data-type="text" data-group-id="${groupData.id}">
                </div>
                <table>
                    <thead>
                        <tr>
                            <th class="">№</td>
                            <th class="">о позиции</td>
                            <th class="">в КП</td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''} data-group-field="repeatTechnologies" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>технология</span>
                            </td>
                            <th class="task-container__group-header-consumption">
                                <div>
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatConsumption ? 'checked' : ''} data-group-field="repeatConsumption" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                        </label>
                                    <span>расход (1ед.)</span>
                                </div>
                                <div>
                                    <span>м2</span>
                                    <span>прод</span>
                                </div>
                            </td>
                            <th class="task-container__group-header-area-mounting">
                                <span>м2 монт</span>
                            </td>
                            <th class=""></td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatMeasurement ? 'checked' : ''} data-group-field="repeatMeasurement" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>замер</span>
                            </td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatDesign ? 'checked' : ''} data-group-field="repeatDesign" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>дизайн</span>
                            </td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatMontage ? 'checked' : ''} data-group-field="repeatMontage" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>монтаж</span>
                            </td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatDeadline ? 'checked' : ''} data-group-field="repeatDeadline" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>сроки</span>
                            </td>
                            <th class="">
                                <span>демонтаж(1ед.)</span>
                            </td>
                            <th class="">
                                <span>командировка / выезд</span>
                            </td>
                            <th class="">
                                <span>доставка</span>
                            </td>
                            <th class="">
                                <label class="switch">
                                    <input type="checkbox" ${groupData.repeatDelivery ? 'checked' : ''} data-group-field="repeatDelivery" data-type="checkbox" data-group-id="${groupData.id}">
                                    <span class="slider round"></span>
                                </label>
                                <span>цп</span>
                            </td>
                            <th class=""></td>
                            <th class=""></td>
                            <th class="">
                                <div>доб. в заказ</div>
                            </td>
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
        const productsCount = groupsData.products.reduce((acc, products) => {
            return acc + products.length;
        }, 0);

        let areaMateria = 0;
        for (const product of groupsData.products) {
            for (const technology of product.technologies) {
                const width = +technology.width || 0;
                const runningMeter = +technology.runningMeter || 0;
                const area = width * runningMeter;
                areaMateria += area;
            }
        }
        let areaInstall = 0;
        for (const product of groupsData.products) {
            for (const technology of product.technologies) {
                const installArea = +technology.installArea || 0;
                areaInstall += installArea;
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

    getProductHTML(productData, number, groupId, deliveryHTML, groupData) {
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
                                <input type="text" name="" id="" placeholder="название" value="${this.customToString(productData.title)}" data-product-field="title" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                            </div>
                            <div class="task-container__item-count">
                                <input type="text" name="" id="" placeholder="количество" value="${this.customToString(productData.quantity)}" data-product-field="quantity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                            </div>
                            <div class="task-container__item-desc">
                                <textarea name="" id=""  rows="3" placeholder="описание" data-product-field="description" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}">${this.customToString(productData.description)}</textarea>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="task-container__item-is-offers">
                        ${this.getIsOffersHTML(technologies, groupId, productData.id)}
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
                            <input type="text" name="" id="" value="${this.customToString(productData.measurement)}" data-product-field="measurement" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-measure-address">
                            <input type="text" name="" id="" value="${this.customToString(productData.measurementAddress)}" data-product-field="measurementAddress" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-measure-costprice">
                            <input type="number" name="" id="" placeholder="себест. замера" value="${this.customToString(productData.measurementCost)}" data-product-field="measurementCost" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-measure-symbol-plus">+</div>
                        <div class="task-container__item-measure-value-persent">
                            <input type="number" name="" id="" value="${this.customToString(productData.measurementPercent)}" data-product-field="measurementPercent" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-measure-symbol-percent">%</div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-design">
                        <div class="task-container__item-design-type">
                            <select name="" id="" data-product-field="design" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
                            </select>
                        </div>
                        <div class="task-container__item-design-amount">
                            <input type="number" name="" id="" value="${this.customToString(productData.designPayment)}" data-product-field="designPayment" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-design-symbol-rub">₽</div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-mounting">
                        <div class="task-container__item-mounting-city">
                            <input type="text" name="" id="" value="${this.customToString(productData.installCity)}"  data-product-field="installCity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-mounting-count-day">
                            <input type="number" name="" id="" placeholder="сколько дней" value="${this.customToString(productData.installDays)}" data-product-field="installDays" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-mounting-symbol-mul">
                            <i class="bi bi-x"></i>
                        </div>
                        <div class="task-container__item-mounting-type">
                            <input type="text" name="" id="" value="${this.customToString(productData.installPlace)}" data-product-field="installPlace" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-mounting-costprice">
                            <input type="number" name="" id="" placeholder="себ. аренды за день" value="${this.customToString(productData.installCost)}" data-product-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-mounting-symbol-plus">+</div>
                        <div class="task-container__item-mounting-value-percent">
                            <input type="number" name="" id="" value="${this.customToString(productData.installPercentage)}" data-product-field="installPercentage" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-mounting-symbol-percent">%</div>
                        <div class="empty-1"></div>
                        <div class="empty-2"></div>
                        <div class="empty-3"></div>
                        <div class="empty-4"></div>
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
                            <input type="date" name="" id="" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-type="date" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-dismantling">
                        <div class="task-container__item-dismantling-area">
                            <input type="number" name="" id="" value="${this.customToString(productData.dismantlingArea)}" data-product-field="dismantlingArea" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-dismantling-difficulty-desc">
                            <select class="task-container_group-item-dismantling-top" name="" id="" data-product-field="dismantling" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
                            </select>    
                        </div>
                        <div class="task-container__item-dismantling-difficulty-price">
                            <input type="number" name="" id="" placeholder="сложн. демонтожа" value="${this.customToString(productData.dismantlingComplexity)}" data-product-field="dismantlingComplexity" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-dismantling-cost-desc">
                            <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="dismantlingDesc" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
                            </select>
                        </div>
                        <div class="task-container__item-dismantling-cost-price">
                            <input type="number" name="" id="" placeholder="себест. демонтожа" value="${this.customToString(productData.dismantlingCost)}" data-product-field="dismantlingCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-dismantling-symbol-plus">+</div>
                        <div class="task-container__item-dismantling-value-percent">
                            <input type="number" name="" id="" value="${this.customToString(productData.dismantlingPercent)}" data-product-field="dismantlingPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-dismantling-symbol-percent">%</div>
                        <div class="empty-1"></div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-business-trip">
                        <div class="task-container__item-business-trip-type" value="${this.customToString(productData.businessTrip)}">
                            <select class="task-container_group-item-dismantling-bottom" name="" id="" data-product-field="businessTrip" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.businessTrip]?.items, productData.businessTrip)}
                            </select>
                        </div>
                        <div class="task-container__item-business-trip-costprice">
                            <input type="number" name="" id="" placeholder="себест. командировки" value="${this.customToString(productData.businessTripCost)}" data-product-field="businessTripCost" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-business-trip-symbol-plus">+</div>
                        <div class="task-container__item-business-trip-value-percent">
                            <input type="number" name="" id="" value="${this.customToString(productData.businessTripPercent)}" data-product-field="businessTripPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-business-trip-symbol-percent">%</div>
                    </div>
                </td>
                <td class="block-center">
                    <div class="task-container__item-delivery-container">
                        <div class="task-container__item-delivery">
                            <div class="task-container__item-delivery-count">
                                <input type="number" name="" id="" placeholder="сколько раз" value="${this.customToString(productData.deliveryFrequency)}" data-product-field="deliveryFrequency" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                            </div>
                            <div class="task-container__item-delivery-mul"><i class="bi bi-x"></i></div>
                            <div class="task-container__item-delivery-price">
                                <input type="number" name="" id="" placeholder="себес. доставки за раз" value="${this.customToString(productData.deliveryCostPerTime)}" data-product-field="deliveryCostPerTime" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                            </div>
                        </div>
                    </div>
                </td>
                ${deliveryHTML}
                <td>
                    <div class="task-container__item-summary-percents">
                        ${this.getSummaryPercentHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
                <td>
                    <div class="task-container__item-summary-amounts">
                        ${this.getSummaryAmountHTML(technologies, groupData, productData)}
                    </div>
                </td>
                <td>
                    <div class="task-container__item-addeds">
                        ${this.getAddedProductHTML(technologies, groupId, productData.id)}
                    </div>
                </td>
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
                    <div class="task-container__item-technology-price">
                        <input class="vertical-input" type="number" name="" id="" placeholder="Цена" value="${this.customToString(technology.price)}" data-technology-field="price" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="inKP" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                        <input type="text" name="" id="" placeholder="ЧПП" value="${this.customToString(technology.CHPP)}" data-technology-field="CHPP" data-type="text" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                        <input type="number" name="" id="" placeholder="п.м." value="${this.customToString(technology.runningMeter)}" data-technology-field="runningMeter" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                    <input type="number" name="" id="" placeholder="Площадь монтажа" value="${this.customToString(technology.installArea)}" data-field="installArea" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
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
                        <input type="number" name="" id="" placeholder="себест. монт." value="${this.customToString(technology.installCost)}" data-technology-field="installCost" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                    </div>
                    <div class="task-container__item-amount-symbol-plus">+</div>
                    <div class="task-container__item-amount-value-percent">
                        <input type="number" name="" id="" value="${this.customToString(technology.installPercent)}" data-technology-field="installPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                    </div>
                    <div class="task-container__item-amount-symbol-percent">%</div>
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
                        <input type="number" name="" id="" value="${this.customToString(technology.totalPercent)}" data-technology-field="totalPercent" data-type="number" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                    </div>
                    <div class="task-container__item-summary-percent-percent">%</div>
                </div>
            `;
        }
        return contentHTML;
    }

    getSummaryAmountHTML(technologies, groupData, productData) {
        let contentHTML = '';
        // let amount = technologies.runningMeter ;
        const designPayment = +productData.designPayment || 0;  // Дизайн - себестоимость
        console.log("designPayment = ", designPayment);
        const installDays = +productData.installDays || 0;  // Монтаж - кол-во дней
        const installCost = +productData.installCost || 0;  // Монтаж - себестоимость
        const installPercentage = +productData.installPercentage || 0;  // Монтаж - процент себестоимости
        const dismantlingCost = +productData.dismantlingCost || 0;  // Демонтаж - себестоимость
        const dismantlingPercent = +productData.dismantlingPercent || 0;  // Демонтаж - процент себестоимости
        const businessTripCost = +productData.businessTripCost || 0;  // Командировка - себестоимость
        const businessTripPercent = +productData.businessTripPercent || 0;  // Командировка - процент себестоимости
        console.log("businessTripCost = ", businessTripCost, ", businessTripPercent = ", businessTripPercent);
        const deliveryFrequency = +productData.deliveryFrequency || 0;  // Доставка - сколько раз
        const deliveryCostPerTime = +productData.deliveryCostPerTime || 0;  // Доставка - стоимость за раз
        console.log("deliveryFrequency = ", deliveryFrequency, ", deliveryCostPerTime = ", deliveryCostPerTime);
        const measurementCost = +productData.measurementCost || 0;  // Измерение - себестоимость
        const measurementPercent = +productData.measurementPercent || 0;  // Измерение - процент себестоимости
        console.log("measurementCost = ", measurementCost, ", measurementPercent = ", measurementPercent);

        const deliveryCost = +groupData.deliveryCost || 0;  // ЦП - себестоимость
        const deliveryPercentage = +groupData.deliveryPercentage || 0;  // ЦП - процент себестоимости
        const countProducts = groupData.products.length || 1;
        const priceWork = designPayment + measurementCost * (1 + measurementPercent / 100)
                        + installDays * installCost * (1 + installPercentage / 100) 
                        + dismantlingCost * (1 + dismantlingPercent / 100) 
                        + businessTripCost * (1 + businessTripPercent / 100) 
                        + deliveryFrequency * deliveryCostPerTime
                        + deliveryCost * (1 + deliveryPercentage / 100) / countProducts;
        console.log("priceWork = ", priceWork);
        for (let technology of technologies) {
            const width = +technology.width || 0;
            const runningMeter = +technology.runningMeter || 0;
            const price = +technology.price || 0;
            console.log("width = ", width, ", runningMeter = ", runningMeter, ", price = ", price);
            const percent = +technology.totalPercent || 0;
            const technologyInstallCost = +technology.installCost || 0;
            const technologyInstallPercent = +technology.installPercent || 0;
            const amount = (width * runningMeter * price + technologyInstallCost * (1 + technologyInstallPercent / 100) + priceWork) * (1 + percent / 100);
            console.log("amount = ", amount);
            contentHTML += `
                <div class="task-container__item-summary-amount technology-item">
                    <span class="task-container__item-summary-amount-value" data-technology-field="dismantling" data-type="number">${this.numberToStr(amount)}</span> &nbsp; ₽
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
                    <input type="checkbox" name="" id="" ${checked} data-technology-field="addedToOrder" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                </div>
            `;
        }
        return contentHTML;
    }

    getDeliveryHTML(groupData, technologiesCount) {
        // <td class="shared block-center" style="grid-row: span ${technologiesCount}">
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
                            <textarea name="" id="" rows="2" data-group-field="deliveryAddress" data-data-group-id="${groupData.id}"type="textarea" data-group-id="${groupData.id}">${this.customToString(groupData.deliveryAddress)}</textarea>
                        </div>
                        <div class="task-container__item-delivery-cp-cost">
                            <input type="number" name="" id="" placeholder="себес. курьер. ЦП" value="${this.customToString(groupData.deliveryCost)}" data-group-field="deliveryCost" data-type="number" data-group-id="${groupData.id}">
                        </div>
                        <div class="task-container__item-delivery-cp-symbol-plus">+</div>
                        <div class="task-container__item-delivery-cp-percent">
                            <input type="number" name="" id="" value="${this.customToString(groupData.deliveryPercentage)}" data-group-field="deliveryPercentage" data-type="number" data-group-id="${groupData.id}">
                        </div>
                        <div class="task-container__item-delivery-cp-symbol-percent">%</div>
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
                contentHTML += `<option value="${field.ID}">${field.VALUE}</option>`;
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
                technologyTypeListHTML += `<option value="${id}">${title}</option>`
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
                filmsListHTML += `<option value="${id}">${title}</option>`
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
                laminationsHTML += `<option value="${id}">${title}</option>`
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
                widthsHTML += `<option value="${id}">${title}</option>`
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

    getAmountTechnology(technology) {
        const priceMaterial = +technology[SP_TECHOLOGY_FIELDS.price];
        const installCost = +technology[SP_TECHOLOGY_FIELDS.installCost];
        const installPercent = +technology[SP_TECHOLOGY_FIELDS.installPercent];
        
    }
}


