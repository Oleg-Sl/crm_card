import {
    FIELD_DEAL_CREATE_DATE,
    FIELD_DEAL_MODIFY_DATE,
} from '../parameters.js';


// const FIELD_CREATE_DATE = 'DATE_CREATE';
// const FIELD_MODIFY_DATE = 'DATE_MODIFY';


const ID_ONE_LEFT = 'dealStateOneLeft';
const ID_TWO_LEFT = 'dealStateTwoLeft';
const ID_THREE_LEFT = 'dealStateThreeLeft';
const ID_FOUR_LEFT = 'dealStateFourLeft';
const ID_FIVE_LEFT = 'dealStateFiveLeft';
const ID_SIX_LEFT = 'dealStateSixLeft';
const ID_SEVEN_LEFT = 'dealStateSevenLeft';

const ID_ONE_RIGHT = 'dealStateOneRight';
const ID_TWO_RIGHT = 'dealStateTwoRight';
const ID_THREE_RIGHT = 'dealStateThreeRight';
const ID_FOUR_RIGHT = 'dealStateFourRight';
const ID_FIVE_RIGHT = 'dealStateFiveRight';
const ID_SIX_RIGHT = 'dealStateSixRight';
const ID_SEVEN_RIGHT = 'dealStateSevenRight';


export default class DealState {
    constructor(container, bx24, dealId) {
        this.dealId = dealId;
        this.bx24 = bx24;
        this.container = container;

        this.dealData = null;
        this.stageHistory = null;
    }

    init(dealData, stageHistory) {
        this.dealData = dealData;
        this.stageHistory = stageHistory.items || [];
        const actualStage = this.findElementWithMaxCreatedTimeAndStage(this.stageHistory, this.dealData.STAGE_ID);
        this.render(actualStage);
    }

    render(actualStage) {
        const elemOneLeft = this.container.querySelector(`#${ID_ONE_LEFT}`);
        const elemTwoLeft = this.container.querySelector(`#${ID_TWO_LEFT}`);
        const elemThreeLeft = this.container.querySelector(`#${ID_THREE_LEFT}`);
        const elemFourLeft = this.container.querySelector(`#${ID_FOUR_LEFT}`);
        const elemFiveLeft = this.container.querySelector(`#${ID_FIVE_LEFT}`);
        const elemSixLeft = this.container.querySelector(`#${ID_SIX_LEFT}`);
        const elemSevenLeft = this.container.querySelector(`#${ID_SEVEN_LEFT}`);

        const elemOneRight = this.container.querySelector(`#${ID_ONE_RIGHT}`);
        const elemTwoRight = this.container.querySelector(`#${ID_TWO_RIGHT}`);
        const elemThreeRight = this.container.querySelector(`#${ID_THREE_RIGHT}`);
        const elemFourRight = this.container.querySelector(`#${ID_FOUR_RIGHT}`);
        const elemFiveRight = this.container.querySelector(`#${ID_FIVE_RIGHT}`);
        const elemSixRight = this.container.querySelector(`#${ID_SIX_RIGHT}`);
        const elemSevenRight = this.container.querySelector(`#${ID_SEVEN_RIGHT}`);

        const dateCreateDeal = this.formatDateTime(this.dealData[FIELD_DEAL_CREATE_DATE]);
        const numberOfHoursOnStage = this.hoursElapsedBetweenDates(actualStage.CREATED_TIME, new Date()).toFixed(2);
        const numberOfDeyOnWork = this.daysBetweenDates(this.dealData[FIELD_DEAL_CREATE_DATE], new Date());

        elemOneLeft.innerHTML = dateCreateDeal;
        elemTwoLeft.innerHTML = `${isNaN(numberOfHoursOnStage) ? "-" : numberOfHoursOnStage} ч.`;
        elemThreeLeft.innerHTML = isNaN(numberOfDeyOnWork) ? "-" : numberOfDeyOnWork;
    }

    findElementWithMaxCreatedTimeAndStage(stageHistory, stageIdFilter) {
        
        if (!Array.isArray(stageHistory) || stageHistory.length === 0) {
            return null;
        }
    
        const filteredData = stageHistory.filter(element => element.STAGE_ID === stageIdFilter);
    
        if (filteredData.length === 0) {
            return null;
        }
    
        return filteredData.reduce((maxElement, currentElement) => {
            const maxTime = new Date(maxElement.CREATED_TIME).getTime();
            const currentTime = new Date(currentElement.CREATED_TIME).getTime();
            return currentTime > maxTime ? currentElement : maxElement;
        }, filteredData[0]);
    }

    formatDateTime(inputDateTime) {
        const date = new Date(inputDateTime);

        if (isNaN(date)) {
            return '-';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    }

    hoursElapsedBetweenDates(date1, date2) {
        const startDate = new Date(date1);
        const endDate = new Date(date2);
    
        const timeDifference = Math.abs(endDate - startDate);
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        return hoursDifference;
    }

    daysBetweenDates(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
    
        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    
        return diffDays;
    }

};
