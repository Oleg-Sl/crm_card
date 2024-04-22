import WindowSearchUser from '../windows/search_user.js';
import {
    FIELD_DEAL_RESPONSIBLE_MOP,
    FIELD_DEAL_RESPONSIBLE_MOS,
    FIELD_DEAL_OBSERVERS,
} from '../parameters.js'

// const FIELD_RESPONSIBLE_MOP = 'ASSIGNED_BY_ID';
// const FIELD_RESPONSIBLE_MOS = 'UF_CRM_1672839295';
// const FIELD_OBSERVERS = 'UF_CRM_1684305731';

const ID__RESPONSIBLE_MOP = "responsibleMOP";
const ID__RESPONSIBLE_MOS = "responsibleMOS";
const ID__OBSERVER = "observerUser";

const CLASS__USER_IMG = "deal-workers__user-photo-img";
const CLASS__USER_NAME = "deal-workers__user-name-span";
const CLASS__USER_CHANGE = "deal-workers__user-change";
const CLASS__USERS_ADD = "deal-workers__observers-add";


class User {
    /**
     * Создает экземпляр класса User.
     * @constructor
     * @param {HTMLElement} container - Контейнер HTML, в который будут вставлены пользовательские данные.
     * @param {BX24} bx24 - Объект, для выполнения запросов к Bitrix24.
     * @param {Array} [departments=[]] - Список подразделений компаниии.
     * @param {number} [userId=null] - Идентификатор пользователя.
     * @param {string} [name=null] - Имя пользователя.
     * @param {string} [lastName=null] - Фамилия пользователя.
     * @param {string} [photoUrl=null] - URL фотографии пользователя.
     */
    constructor(container, bx24, departments = [], userId = null, name = null, lastName = null, photoUrl = null) {
        this.container = container;
        this.bx24 = bx24;
        this.departments = departments;
        this.userId = userId;
        this.name = name;
        this.lastName = lastName;
        this.photoUrl = photoUrl;

        const btnChangeUser = this.container.querySelector(`.${CLASS__USER_CHANGE}`);
        this.windowSearchUser = new WindowSearchUser(this.container, bx24, this.setData.bind(this), btnChangeUser, this.departments);

        this._updateHTML();
        this.initHandler();
    }

    initHandler() {
        this.container.addEventListener("click", async (e) => {
            if (e.target.closest(`.${CLASS__USER_CHANGE}`)) {
                this.windowSearchUser.showWindow();
            }
        })

        this.container.addEventListener("click", async (e) => {
            if (this.userId && e.target.closest(".deal-workers__user-container")) {
                let path = `/company/personal/user/${this.userId}/`;
                await this.bx24.openPath(path);
            }     
        })
    }

    getUserId() {
        return this.userId;
    }

    getData() {
        return {
            ID: this.userId,
            NAME: this.name,
            LAST_NAME: this.lastName,
        };
    }

    setData(userId, lastName, name, photoUrl) {
        this.userId = userId;
        this.lastName = lastName;
        this.name = name;
        this.photoUrl = photoUrl;
    
        this._updateHTML();
    }

    _updateHTML() {
        const userPhotoElement = this.container.querySelector(`.${CLASS__USER_IMG}`);
        const userNameElement = this.container.querySelector(`.${CLASS__USER_NAME}`);

        if (userPhotoElement) {
            userPhotoElement.src = this.photoUrl;
            if (this.photoUrl) {
                userPhotoElement.style.visibility = 'visible';
            } else {
                userPhotoElement.style.visibility = 'hidden';
            }
        }

        if (userNameElement) {
            userNameElement.textContent = `${this.lastName || ""} ${this.name || ""}`;
        }
    }

    _getBottomRightCoordinates(element) {
        var rect = element.getBoundingClientRect();
        var right = rect.right + window.scrollX;
        var bottom = rect.bottom + window.scrollY;
        return { x: right, y: bottom };
    }
}


class UsersList {
     /**
     * Создает экземпляр класса UsersList.
     * @constructor
     * @param {HTMLElement} container - Контейнер HTML, в который будут вставлены пользовательские данные.
     * @param {BX24} bx24 - Объект, для выполнения запросов к Bitrix24.
     * @param {Array} [departments=[]] - Список подразделений компаниии.
     * @param {Array} [users=[]] - Список пользователей.
     */
     constructor(container, bx24, departments = [], users = []) {
        this.container = container;
        this.bx24 = bx24;
        this.departments = departments;
        this.users = users;     // [{ID: ..., NAME: ..., LAST_NAME: ..., PERSONAL_PHOTO: ...}, ...]

        this.usersContainer = this.container.querySelector(".deal-workers__observers-userslist");
        const btnAddUser = this.container.querySelector(`.${CLASS__USERS_ADD}`);
        this.windowSearchUser = new WindowSearchUser(this.container, bx24, this.setData.bind(this), btnAddUser, this.departments);
        
        this._updateHTML();
        this.initHandler();
    }

    initHandler() {
        this.container.addEventListener("click", async (e) => {
            if (e.target.closest(`.${CLASS__USERS_ADD}`)) {
                this.windowSearchUser.showWindow();
            }
        })

        this.container.addEventListener("click", async (e) => {
            if (e.target.closest(".deal-workers__observers-user")) {
                const userId = e.target.dataset.userId;
                let path = `/company/personal/user/${userId}/`;
                await this.bx24.openPath(path);
            }     
        })
        
    }

    getUsersIds() {
        return this.users.map(user => user.ID);
    }

    getData() {
        return this.users.map(user => {
            return {
                ID: user.ID,
                NAME: user.NAME,
                LAST_NAME: user.LAST_NAME,
            }
        });
    }

    setData(userId, lastName, name, photoUrl) {
        let userIndex = this.users.findIndex(user => user.ID == userId);
        if (userIndex === -1) {
            this.users.push({
                ID: userId,
                NAME: name,
                LAST_NAME: lastName,
                PERSONAL_PHOTO: photoUrl
            });
        }

        this._updateHTML();
    }

    _updateHTML() {
        let contentHTML = "";
        
        for (let user of this.users) {
            contentHTML += `<div class="deal-workers__observers-user" data-user-id="${user.ID}" title="${user.LAST_NAME} ${user.NAME}">${user.LAST_NAME} ${user.NAME}</div>`;
        }

        this.usersContainer.innerHTML = contentHTML;
    }
}


export default class DealWorkers {
    constructor(container, bx24, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.dealId = dealId;

        this.userMOS = null;
        this.userMOP = null;
        this.usersObserver = null;
    }

    async init(dealData, departments) {
        this.departments = departments;

        let idResponsibleMOP  = dealData[FIELD_DEAL_RESPONSIBLE_MOP];
        let idResponsibleMOS  = dealData[FIELD_DEAL_RESPONSIBLE_MOS];
        let idsObservers      = dealData[FIELD_DEAL_OBSERVERS] || [];
        
        let usersData = await this.getUsersData([idResponsibleMOP, idResponsibleMOS, ...idsObservers]);
        let userDataMOP = usersData[idResponsibleMOP] ? (usersData[idResponsibleMOP][0] || {}) : {};
        let userDataMOS = usersData[idResponsibleMOS] ? (usersData[idResponsibleMOS][0] || {}) : {};

        let usersObserversData = this.getUserSelectedData(idsObservers, usersData);

        let containerMOP      = this.container.querySelector(`.deal-workers__mop`);
        let containerMOS      = this.container.querySelector(`.deal-workers__mos`);
        let containerObserver = this.container.querySelector(`.deal-workers__observers`);
        
        this.userMOP = new User(containerMOP, this.bx24, departments, idResponsibleMOP, userDataMOP.NAME, userDataMOP.LAST_NAME, userDataMOP.PERSONAL_PHOTO);
        this.userMOS = new User(containerMOS, this.bx24, departments, idResponsibleMOS, userDataMOS.NAME, userDataMOS.LAST_NAME, userDataMOS.PERSONAL_PHOTO);
        this.usersObserver = new UsersList(containerObserver, this.bx24, departments, usersObserversData);
    }

    getMos() {
        return this.userMOS.getUserId();
    }

    getMop() {
        return this.userMOP.getUserId();
    }

    getObservers() {
        return this.usersObserver.getUsersIds();
    }

    getChangedData() {
        return {
            [FIELD_DEAL_RESPONSIBLE_MOP]: this.userMOP.getUserId(),
            [FIELD_DEAL_RESPONSIBLE_MOS]: this.userMOS.getUserId(),
            [FIELD_DEAL_OBSERVERS]: this.usersObserver.getUsersIds(),
        };
    }

    async getUsersData(idsUsers) {
        const users = await this.bx24.user.getList(idsUsers);
        return users?.result;
    }

    getUserSelectedData(ids, usersData) {
        return ids.map(id => usersData[id][0] || {});
    }
};
