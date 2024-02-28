
import {
    FIELD_DEAL_AMOUNT,
    FIELD_DEAL_PAYMENT,
} from '../parameters.js'


const ID_DEAL_AMOUNT = 'dealAmountsAmount';
const ID_DEAL_PAYMENT = 'dealAmountsPayment';


export default class DealAmounts {

    constructor(container, bx24, dealId) {
        this.dealId = dealId;
        this.bx24 = bx24;
        this.container = container;

        this.elemAmount = this.container.querySelector(`#${ID_DEAL_AMOUNT}`);
        this.elemPayment = this.container.querySelector(`#${ID_DEAL_PAYMENT}`);

        this.dealAmount = null;
        this.payment = null;
    }
    
    init(dealData) {
        this.dealAmount = dealData[FIELD_DEAL_AMOUNT];
        this.payment = dealData[FIELD_DEAL_PAYMENT];

        this.render();
    }

    render() {
        const profit = this.dealAmount - this.payment;

        this.elemAmount.innerHTML = isNaN(this.dealAmount) ? '0' : this.dealAmount.toLocaleString();
        this.elemPayment.innerHTML = isNaN(profit) ? '0' : profit.toLocaleString();
    }
};
