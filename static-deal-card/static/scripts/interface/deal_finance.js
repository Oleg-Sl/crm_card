import {
    FIELD_DEAL_OUR_REQUISITES,
    FIELD_DEAL_PAYMENT_METHOD,
    FIELD_DEAL_DOCUMENT_FLOW,
} from '../parameters.js';

const CLASS_OUR_REQUISITES = "deal-finance__our-requisites-select";
const CLASS_PAYMENT_METHOD = "deal-finance__payment-method-select";
const CLASS_DOCUMENT_FLOW = "deal-finance__document-flow-select";


export default class DealFinance {
    constructor(container, bx24, dealId) {
        this.dealId = dealId;
        this.bx24 = bx24;
        this.container = container;

        this.elemOurRequisites = this.container.querySelector(`.${CLASS_OUR_REQUISITES}`);
        this.elemPaymentMethod = this.container.querySelector(`.${CLASS_PAYMENT_METHOD}`);
        this.elemDocumentFlow = this.container.querySelector(`.${CLASS_DOCUMENT_FLOW}`);

        this.dealData = null;
        this.ourRequisites = null;
        this.paymentMethod = null;
        this.documentFlow = null;
    }

    init(dealData, dealFields) {
        this.dealData = dealData;
        this.listOurRequisites = dealFields[FIELD_DEAL_OUR_REQUISITES]?.items;
        this.listPaymentMethods = dealFields[FIELD_DEAL_PAYMENT_METHOD]?.items;
        this.listDocumentFlow = dealFields[FIELD_DEAL_DOCUMENT_FLOW]?.items;

        this.fillSelectWithData(this.elemOurRequisites, this.listOurRequisites, this.dealData[FIELD_DEAL_OUR_REQUISITES]);
        this.fillSelectWithData(this.elemPaymentMethod, this.listPaymentMethods, this.dealData[FIELD_DEAL_PAYMENT_METHOD]);
        this.fillSelectWithData(this.elemDocumentFlow, this.listDocumentFlow, this.dealData[FIELD_DEAL_DOCUMENT_FLOW]);
    }

    getChangedData() {
        return {
            [FIELD_DEAL_OUR_REQUISITES]: this.elemOurRequisites.value,
            [FIELD_DEAL_PAYMENT_METHOD]: this.elemPaymentMethod.value,
            [FIELD_DEAL_DOCUMENT_FLOW]: this.elemDocumentFlow.value
        };
    }

    fillSelectWithData(selectElement, data, selectedId = null) {
        selectElement.innerHTML = '';
    
        data.forEach(optionData => {
            const optionElement = document.createElement('option');
            optionElement.value = optionData.ID;
            optionElement.textContent = optionData.VALUE;
    
            if (selectedId !== null && optionData.ID === selectedId) {
                optionElement.selected = true;
            }
    
            selectElement.appendChild(optionElement);
        });
    }
};
