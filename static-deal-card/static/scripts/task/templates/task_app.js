
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
        this.sourceFilesData = [];
        this.sourceLinksData = [];
        this.groupData = null;
    }

    setSmartFields(fields) {
        this.fields = fields;
    }

    setMaterialsData(materials) {
        this.materials = materials;
    }

    setSourcesFilesData(sourceFilesData) {
        this.sourceFilesData = sourceFilesData;
    }

    setSourcesLinksData(sourceLinksData) {
        this.sourceLinksData = sourceLinksData;
    }

    getGroupHTML(groupData, numberGroup = 1) {
        this.groupData = groupData;
        let products = groupData?.products || [];
        if (products.length === 0) {
            products = [];
        }

        let productsHTML = '';
        for (const index in products) {
            const productData = products[index];
            productsHTML += this.getProductHTML(productData, +index + 1, groupData.id, groupData.delivery);
        }

        return `
            <div class="application-group" data-group-id="${groupData.id}">
                <div class="task-container__group-title">
                    <span>Группа ${numberGroup}: </span><input type="text" placeholder="Название" value="${groupData.title}" data-group-field="title" data-type="text" data-group-id="${groupData.id}">
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div class="task-container_group-header-add-group"><i class="bi bi-plus-circle-fill"></i></div>
                            </th>
                            <th class="">
                                <div style="width: 100%;">
                                    <div class="task-container_group-header-product-desc">о позиции</div>    
                                </div>
                                <div class="resizable" style="cursor: col-resize;"><i class="bi bi-grip-vertical resizable"></i></div>
                            </th>
                            <th>
                                <div class="task-container_group-header-technology">
                                    <div>
                                        <label class="switch">
                                            <input type="checkbox" ${groupData.repeatTechnologies ? 'checked' : ''} data-group-field="repeatTechnologies" data-type="checkbox" data-group-id="${groupData.id}">
                                            <span class="slider round"></span>
                                        </label>
                                        <span>технология</span>
                                    </div>
                                    <span>+/-</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-sources">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatSources ? 'checked' : ''} data-group-field="repeatSources" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>исходники</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-measurements">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatMeasurement ? 'checked' : ''} data-group-field="repeatMeasurement" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>замер</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-design">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatDesign ? 'checked' : ''} data-group-field="repeatDesign" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>дизайн</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-color">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatDelivery ? 'checked' : ''} data-group-field="repeatDelivery" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>ЦП</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-mounting">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatMontage ? 'checked' : ''} data-group-field="repeatMontage" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>монтаж</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-deadlines">
                                    <label class="switch">
                                        <input type="checkbox" ${groupData.repeatDeadline ? 'checked' : ''} data-group-field="repeatDeadline" data-type="checkbox" data-group-id="${groupData.id}">
                                        <span class="slider round"></span>
                                    </label>
                                    <span>сроки</span>
                                </div>
                            </th>
                            <th>
                                <div class="task-container_group-header-dismantling">
                                    <span>демонтаж</span>
                                </div>
                            </th>
                            <th></th>
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

    getProductHTML(productData, number, groupId, groupDelivery) {
        let technologies = productData?.technologies || [];
        if (!technologies.length) {
            technologies = [];
        }
        const dismantlingDisabled = productData.dismantling == 8069 ? 'disabled' : '';
        return `
            <tr class="product-row" data-product-id="${productData.id}" data-group-id="${groupId}">
                <td>
                    <div class="task-container__item-number"><div>${number}</div></div>
                </td>
                <td>
                    <div class="task-container__item-info">
                        <div class="task-container__item-info-title">
                            <textarea name="" id="" placeholder="название" title="${this.customToString(productData.title)}" ${this.groupData.repeatTechnologies ? '' : 'readonly'} data-product-field="title" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}">${this.customToString(productData.title)}</textarea>
                        </div>
                        <div class="task-container__item-info-count">
                            <input type="number" name="" id="" placeholder="количество" ${this.groupData.repeatTechnologies ? '' : 'readonly'} value="${this.customToString(productData.quantity)}" step="1" data-product-field="quantity" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                        </div>
                        <div class="task-container__item-info-desc">
                            <textarea name="" id=""  rows="3" placeholder="описание" ${this.groupData.repeatTechnologies ? '' : 'readonly'} title="${this.customToString(productData.description)}" data-product-field="description" data-type="textarea" data-group-id="${groupId}" data-product-id="${productData.id}">${this.customToString(productData.description)}</textarea>
                        </div>
                    </div>
                </td>
                <td class="task-container__item-technologies">
                    <div class="task-container__item-technologies-list">
                        <div class="task-container__item-technologies-list-container">
                            ${this.getTechnologiesHTML(technologies, groupId, productData.id)}
                        </div>
                    </div>
                    <div class="task-container__item-technology-add">
                        <i class="bi bi-plus-square" data-group-id="${groupId}" data-product-id="${productData.id}"></i>
                    </div>
                </td>
                <td class="task-container_group-item-sources">
                    <div class="task-container_group-item-sources-list">
                        ${this.getSourcesHTML(productData.sourcesFiles || [{}], groupId, productData.id)}
                    </div>
                    <div class="task-container_group-item-sources-add">
                        <i class="bi bi-plus-square" data-group-id="${groupId}" data-product-id="${productData.id}"></i>
                    </div>
                </td>
                <td class="task-container_group-item-measurements">
                    <div class="task-container_group-item-measurements-list" data-value="${this.customToString(productData.measurement)}">
                        <select name="" id="" data-product-field="measurement" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.measurement]?.items, productData.measurement)}" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.measurement]?.items, productData.measurement)}
                        </select>
                        <input type="text" name="" id="" placeholder="Адрес" value="${this.customToString(productData.measurementAddress)}" title="${this.customToString(productData.measurementAddress)}" data-product-field="measurementAddress" data-type="text" data-group-id="${groupId}" data-product-id="${productData.id}">
                    </div>
                </td>
                <td class="task-container_group-item-design">
                    <div class="task-container_group-item-design-list">
                        <select name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}" data-product-field="design" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.design]?.items, productData.design)}
                        </select>
                        <select name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.designPayment]?.items, productData.designPayment)}" data-product-field="designPayment" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.designPayment]?.items, productData.designPayment)}
                        </select>
                    </div>
                </td>
                <td class="task-container_group-item-color-test">
                    <div class="task-container_group-item-color-test-list">
                        <select name="" id="" title="${this.getTitleFromEnums(this.fields?.group?.[SP_GROUP_FIELDS.delivery]?.items, groupDelivery)}" data-group-field="delivery" data-type="select" data-group-id="${groupId}">
                            ${this.getOptionsHTML(this.fields?.group?.[SP_GROUP_FIELDS.delivery]?.items, groupDelivery)}
                        </select>
                        <select name="" id=""></select>
                    </div>
                </td>
                <td class="task-container_group-item-mounting">
                    <div class="task-container_group-item-mounting-container">
                        <div class="task-container_group-item-mounting-left ">
                            <select class="" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installTime]?.items, productData.installTime)}" data-product-field="installTime" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installTime]?.items, productData.installTime)}
                            </select>
                        </div>
                        <select class="task-container_group-item-mounting-top" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installCity]?.items, productData.installCity)}" data-product-field="installCity" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installCity]?.items, productData.installCity)}
                        </select>
                        <select class="task-container_group-item-mounting-bottom" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installPlace]?.items, productData.installPlace)}" data-product-field="installPlace" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installPlace]?.items, productData.installPlace)}
                        </select>
                        <input class="task-container_group-item-mounting-area vertical-input" type="number" name="" id="" title="${this.customToString(productData.dismantlingArea)}" value="${productData.dismantlingArea || 0}" data-product-field="dismantlingArea" data-type="number" data-group-id="${groupId}" data-product-id="${productData.id}">
                    </div>
                </td>
                <td class="task-container_group-item-deadlines">
                    <div class="task-container_group-item-deadlines-list">
                        <select name="" id="" data-product-field="terms" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.terms]?.items, productData.terms)}
                        </select>
                        <input type="date" title="${this.customToString(productData.termsDate)}" value="${this.customToString(productData.termsDate)}" data-product-field="termsDate" data-type="date" data-group-id="${groupId}" data-product-id="${productData.id}">
                    </div>
                </td>
                <td class="task-container_group-item-dismantling">
                    <div class="task-container_group-item-dismantling-container">
                        <select class="task-container_group-item-dismantling-top" name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}" data-product-field="dismantling" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantling]?.items, productData.dismantling)}
                        </select>
                        <select class="task-container_group-item-dismantling-bottom" ${dismantlingDisabled} name="" id="" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}" data-product-field="dismantlingDesc" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                            ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.dismantlingDesc]?.items, productData.dismantlingDesc)}
                        </select>
                        <div class="task-container_group-item-dismantling-right">
                            <select class="" ${dismantlingDisabled} name="" id="" data-product-field="installComplexity" title="${this.getTitleFromEnums(this.fields?.product?.[SP_PRODUCT_FIELDS.installComplexity]?.items, productData.installComplexity)}" data-type="select" data-group-id="${groupId}" data-product-id="${productData.id}">
                                ${this.getOptionsHTML(this.fields?.product?.[SP_PRODUCT_FIELDS.installComplexity]?.items, productData.installComplexity)}
                            </select>
                        </div>
                    </div>
                </td>
                <td class="task-container_group-item-right">
                    <div class="task-container_group-item-move"><i class="bi bi-list" data-group-id="${groupId}" data-product-id="${productData.id}"></i></div>
                    <div class="task-container_group-item-add"><i class="bi bi-plus-circle-fill" placeholder="Создать продукт" data-group-id="${groupId}" data-product-id="${productData.id}"></i></div>
                    <div class="task-container_group-item-copy"><i class="bi bi-copy" placeholder="Создать копию продукта" data-group-id="${groupId}" data-product-id="${productData.id}"></i></div>
                    <div class="task-container_group-item-remove"><i class="bi bi-x-square" placeholder="Удалить продукт" data-group-id="${groupId}" data-product-id="${productData.id}"></i></div>
                </td>
            </tr>
        `;
    }

    getTechnologiesHTML(technologies, groupId, productId) {
        let contentHTML = '';
        for (let technology of technologies) {
            contentHTML += `
                <div class="task-container__item-technologies-technology technology-row" data-technology-id="${technology.id}">
                    <div class="task-container__item-technologies-technology-mchs">
                        <span>МЧС</span>
                        <label class="switch">
                            <input type="checkbox" ${technology.MCHS ? 'checked' : ''} data-technology-field="MCHS" data-type="checkbox" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="task-container__item-technologies-technology-type">
                        <select name="" id="" title="${this.getTitleFromList(this.materials.technologiesTypes, technology.general)}" data-technology-field="general" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getTechnologyTypeOptionsHTML(technology.general)}
                        </select>
                    </div>
                    <div class="task-container__item-technologies-technology-material-1">
                        <select name="" id="" title="${this.getTitleFromList(this.materials.dependences, technology.film)}" data-technology-field="film" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getFilmsOptionsHTML(technology.film)}
                        </select>
                    </div>
                    <div class="task-container__item-technologies-technology-material-2">
                        <select name="" id="" title="${this.getTitleLaminations(technology.film, technology.lamination)}" data-technology-field="lamination" data-type="select" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}">
                            ${this.getLaminationsOptionsHTML(technology.film, technology.lamination)}
                        </select>
                    </div>
                    <div class="task-container__item-technologies-technology-remove">
                        <i class="bi bi-dash-square" data-group-id="${groupId}" data-product-id="${productId}" data-technology-id="${technology.id}"></i>
                    </div>
                </div>
            `;
        }

        return contentHTML;
    }

    getSourcesHTML(sources, groupId, productId) {
        let contentHTML = '';
        for (const source of sources) {
            const [nameSelected, urlSelected, previewSelected] = source.split(';');
            contentHTML += `
                <div class="task-container_group-item-sources-item">
                    <div class="task-container_group-item-sources-item-prev" data-link="${previewSelected}">🖼</div>
                    <div class="task-container_group-item-sources-item-value" data-value="">
                        <select class="product-source-select" name="" id="" title="${this.getTitleSources(source)}" data-group-id="${groupId}" data-product-id="${productId}">
                            ${this.getSourcesOptionsHTML(source || '')}
                        </select>
                    </div>
                    <div class="task-container_group-item-sources-remove">
                        <i class="bi bi-dash-square" data-group-id="${groupId}" data-product-id="${productId}"></i>
                    </div>
                </div>
            `;
        }

        return contentHTML;
    }

    getSourcesOptionsHTML(source) {
        let contentHTML = '<option value="" selected>-</option>';
        let isSelected = false;
        const [nameSelected, urlSelected, previewSelected, commentSelected] = source.split(';');
        // "имя;размер;ссылка_главная;ссылка_превью;комментарий"
        for (const sourceData of this.sourceFilesData) {
            const [name, size, url, preview, comment] = sourceData.split(';');
            if (name == nameSelected && url == urlSelected) {
                isSelected = true;
                contentHTML += `<option value="${name};${url};${preview};${comment}" selected>${name} (${comment || ""})</option>`;
            } else {
                contentHTML += `<option value="${name};${url};${preview};${comment}">${name} (${comment || ""})</option>`;
            }
        }

        for (const sourceData of this.sourceLinksData) {
            const [url, comment] = sourceData.split(';');
            if (url == urlSelected) {
                isSelected = true;
                contentHTML += `<option value=";${url};;${comment}" selected>${url} (${comment || ""})</option>`;
            } else {
                contentHTML += `<option value=";${url};;${comment}">${url} (${comment || ""})</option>`;
            }
        }

        if (!isSelected && source) {
            contentHTML += `<option value="${nameSelected};${urlSelected};${previewSelected};${commentSelected}" selected>${nameSelected} (${commentSelected || ""})</option>`;
        }

        return contentHTML;
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
        // let technologyTypeListHTML = '<option value=""></option>';
        let technologyTypeListHTML = this.groupData.repeatTechnologies  || techId ==='' || techId === null || techId === undefined || isNaN(techId) ? '<option value=""></option>' : '<option value="" disabled></option>';
        for (const {id, title} of this.materials.technologiesTypes) {
            if (id == techId) {
                technologyTypeListHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                technologyTypeListHTML += `<option value="${id}" ${this.groupData.repeatTechnologies ? 'disabled' : ''}>${title}</option>`
            }
        }

        return technologyTypeListHTML;
    }

    getFilmsOptionsHTML(filmId) {
        // let filmsListHTML = '<option value=""></option>';
        let filmsListHTML = this.groupData.repeatTechnologies  || filmId ==='' || filmId === null || filmId === undefined || isNaN(filmId) ? '<option value=""></option>' : '<option value="" disabled></option>';
        for (const {id, title} of this.materials.dependences) {
            if (id == filmId) {
                filmsListHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                filmsListHTML += `<option value="${id}" ${this.groupData.repeatTechnologies ? 'disabled' : ''}>${title}</option>`
            }
        }

        return filmsListHTML;
    }

    getLaminationsOptionsHTML(filmId, laminationId) {
        // let laminationsHTML = '<option value=""></option>';
        let laminationsHTML = this.groupData.repeatTechnologies  || laminationId ==='' || laminationId === null || laminationId === undefined || isNaN(laminationId) ? '<option value=""></option>' : '<option value="" disabled></option>';
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.id] == filmId) || {};
        const laminationIds = dependence?.[SP_DEPENDENCE_FIELDS.laminations] || [];
        const laminationsList = this.materials.laminations.filter(obj => laminationIds.includes(String(obj.id)));
        for (let { id, title } of laminationsList) {
            if (id == laminationId) {
                laminationsHTML += `<option value="${id}" selected>${title}</option>`
            } else {
                laminationsHTML += `<option value="${id}" ${this.groupData.repeatTechnologies ? 'disabled' : ''}>${title}</option>`
            }
        }

        return laminationsHTML;
    }

    getFilmsWidthsOptionsHTML(filmId, widthId) {
        let widthsHTML = '<option value=""></option>';
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.id] == filmId) || {};
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

    numberToStr(value) {
        if (value === 0) {
            return "0";
        } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return "0";
        } else {
            return value.toFixed(2);
        }
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
        const dependence = this.materials.dependences.find(obj => obj[SP_DEPENDENCE_FIELDS.id] == filmId) || {};
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
}


