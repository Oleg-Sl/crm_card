
const USER_TYPE = {
    "employee": "",
    "extranet": "Гость",
    "email": "Гость",
}

const ANIMATION_DURATION = 1000 / 100;  // скорость анимации разворачивания/сворачивания списка подразделений - мс./пикс.



export default class WindowSearchUser {
    /**
     * Создает экземпляр класса WindowSearchUser, поиска пользователя.
     * @constructor
     * @param {*} parent - Родительский контейнер.
     * @param {*} bx24 - Объект, для выполнения запросов к Bitrix24.
     * @param {*} callbackUserSelection - Функция обратного вызова при выборе пользователя.
     * @param {*} departments - Список подразделений компании.
     */
    constructor(parent, bx24, callbackUserSelection, ignorElem, departments=[]) {
        this.parent = parent;
        this.bx24 = bx24;
        this.callbackUserSelection = callbackUserSelection;
        this.ignorElem = ignorElem;
        this.departments = departments || [];
        this.companyStructure = this.getTreeDepartments();

        this.window = document.createElement('div');
        this.window.classList.add('d-none');
        this.window.classList.add('window-searchcontact');

        this.timeAnimate = ANIMATION_DURATION;
        this.fieldInput = null;
        this.boxResponsible = null;     // окно ПОИСКА
        this.boxDepartment = null;      // окно ПОДРАЗДЕЛЕНИЙ
        this.btnResponsible = null;     // кнопка открыть "окно ПОИСК"
        this.btnDepartment = null;      // кнопка открыть "окно ОТДЕЛЫ"
        this.btnCloseWindow = null;     // кнопка закрыть окно

        this.render();
        this.initHandlers();
    }

    getTreeDepartments(parent=undefined) {
        let departmentsList = [];
        if (!this.departments) return;
        for (let department of this.departments) {
            if (department.PARENT === parent) {
                let children = this.getTreeDepartments(department.ID);
                if (children.length !== 0) {
                    department.CHILDREN = children;
                }
                departmentsList.push(department);
            }
        }
        return departmentsList;
    }

    render() {
        let contentHTML = `
            <div class="window-searchcontact-container">
                <div class="filter-window-data-close">
                    <i class="bi bi-x-lg"></i>
                </div>
                <!-- Блоки с данными -->
                <div class="container-data">
                    <!-- Окно для ввода имени сотрудника -->
                    <div class="container-data-block">
                        <div class="container-data-head">
                            <div class="container-data-head-selector">    
                                <span>
                                    <input class="form-control form-control-sm search-user-input" type="text" autocomplete="on" placeholder="поиск" aria-label="default input example" id="">
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- Отфильтрованный список пользователей -->
                    <div class="container-data-user"> </div>
                    <!-- Список сотрудников по подразделениям -->
                    <div class="container-data-depart d-none"> </div>
                </div>
                <!-- Кнопка "ПОИСК" -->
                <div class="btn-search-responsible">
                    <div class="btn-search-logo"><i class="bi bi-search"></i></div>
                    <div class="btn-search-desc">Поиск</div>
                </div>
                <!-- Кнопка "ОТДЕЛЫ" -->
                <div class="btn-search-department btn-search-inactive">
                    <div class="btn-search-logo"><i class="bi bi-people-fill"></i></div>
                    <div class="btn-search-desc">Отделы</div>
                </div>
            </div>
        `;

        this.window.innerHTML = contentHTML;
        this.parent.append(this.window);

        this.fieldInput = this.window.querySelector("input");
        this.boxResponsible = this.window.querySelector(".container-data-user");                    // окно ПОИСКА
        this.boxDepartment = this.window.querySelector(".container-data-depart");                   // окно ПОДРАЗДЕЛЕНИЙ
        this.btnResponsible = this.window.querySelector(".btn-search-responsible");                 // кнопка открыть "окно ПОИСК"
        this.btnDepartment = this.window.querySelector(".btn-search-department");                   // кнопка открыть "окно ОТДЕЛЫ"
        this.btnCloseWindow = this.window.querySelector(".filter-window-data-close i");             // кнопка закрыть окно

        this.renderDepartments();
    }

    renderDepartments() {
        this.boxDepartment.innerHTML = this.getDepartmentsHTML(this.companyStructure);
    }

    getDepartmentsHTML(departments) {
        let contentHTML = '';

        for (let department of departments) {
            let departChildrenHTML = "";

            if (!department) return ""; 

            if (Array.isArray(department.CHILDREN) && department.CHILDREN.length >= 1) {
                departChildrenHTML += this.getDepartmentsHTML(department.CHILDREN);
            }

            contentHTML += `
                <div class="ui-selector-item-box" data-depart-id="${department.ID}">
                    <div class="ui-selector-item">
                        <div class="ui-selector-item-avatar"><i class="bi bi-people-fill"></i></div>
                        <div class="ui-selector-item-titles">
                            <div class="ui-selector-item-supertitle">Отдел</div>
                            <div class="ui-selector-item-title-box">${department.NAME}</div>
                        </div>
                        <div class="ui-selector-item-indicator">
                            <div><i class="bi bi-chevron-down"></i></div>
                        </div>
                    </div>
                    <div class="ui-selector-item-children">
                        ${departChildrenHTML}
                    </div>
                </div>
            `;
        }

        return contentHTML;
    }

    async getAndDisplayUsersOfDepart(departId, box) {
        let contentHTML = "";

        let users = await this.bx24.user.get({
            "ACTIVE": true, "UF_DEPARTMENT": departId, "ADMIN_MODE": true
        });

        for (let user of users) {
            if (typeof user === 'object' && user !== null && Object.keys(user).length > 0) {
                contentHTML += this.templateUserBoxForSearch(user.ID, user.LAST_NAME, user.NAME, user.WORK_POSITION, user.USER_TYPE, user.PERSONAL_PHOTO);
            }
        }

        box.insertAdjacentHTML('beforeend', contentHTML);
    }

    async getAndDisplayUsersSearch(name) {
        let contentHTML = "";
        let users = await this.bx24.user.search({
            "FILTER": {"NAME": `${name}%`, "ACTIVE": true}
        });
        let usersByLastname = await this.bx24.user.search({
            "FILTER": {"LAST_NAME": `${name}%`, "ACTIVE": true}
        });

        users.concat(usersByLastname);

        for (let user of users) {
            if (typeof user === 'object' && user !== null && Object.keys(user).length > 0) {
                contentHTML += this.templateUserBoxForSearch(user.ID, user.LAST_NAME, user.NAME, user.WORK_POSITION, user.USER_TYPE, user.PERSONAL_PHOTO);
            }
        }

        this.boxResponsible.innerHTML = contentHTML;
    }

    initHandlers() {
        // событие "открытие окна поиска"
        this.handlerSearchWindowOpen();

        // событие "открытие окна подразделения"
        this.handlerDepartmentWindowOpen();

        // событие "клик разворачивание/сворачивание списка вложенных подразделений"
        this.handlerToggleNestedDepartments();

        // событие "открытие страницы с информацией о сотруднике"
        this.handlerOpenEmployeeInfoPage();

        // кнопка "закрыть окно"
        this.handlerBtnCloseWindow();

        // событие "клик вне контейнера"
        this.handleClickOutsideContainer();

        // событие "клик по полю ввода имени"
        this.handleNameInputClick();

        // событие "поиск пользователя"
        this.handleNameInputChange();
        
        // событие "добавление пользователя в выбранные"
        this.handleUserSelection();
    }

    handlerSearchWindowOpen() {
        this.btnResponsible.addEventListener("click", (e) => {
            this.showSearchWindow();
        });
    }

    handlerDepartmentWindowOpen() {
        this.btnDepartment.addEventListener("click", () => {
            this.showDepartmentWindow();
        });
    }

    handlerToggleNestedDepartments() {
        this.boxDepartment.addEventListener("click", async (e) => {
            if (e.target.closest(".ui-selector-item-indicator")) {
                let box = e.target.closest(".ui-selector-item-box");                // блок-контейнер подразделения, по которому произошел клик
                let boxChildren = box.querySelector(".ui-selector-item-children");  // блок-контейнер с дочерними подразделениями родителя, по которому произошел клик
                let departId = box.dataset.departId;                                // id подразделения
                let usersDisplay = box.dataset.userDisplay;                         // список работников выведен/не выведен ("true"/"")
                if (!usersDisplay && departId) {
                    this.getAndDisplayUsersOfDepart(departId, boxChildren);         // получение и вывод списка работников подразделения
                    box.dataset.userDisplay = true;                                 // статус, что сотрудники подразделения уже выведены
                }
                if (box.classList.contains("ui-selector-item-box-open")) {
                    // свернуть вложенные подразделения
                    this.animationClose(boxChildren);
                    box.classList.remove("ui-selector-item-box-open");
                } else {
                    // развернуть вложенные подразделения
                    this.animationOpen(boxChildren);
                    box.classList.add("ui-selector-item-box-open");
                }
            }
        })
    }

    handlerOpenEmployeeInfoPage() {
        this.window.addEventListener("click", async (e) => {
            if (e.target.classList.contains("ui-selector-item-user-link")) {
                let boxUser = e.target.closest(".ui-selector-user-box");
                let userId = boxUser.dataset.userId; 
                let path = `/company/personal/user/${userId}/`;
                await this.bx24.openPath(path);
            }
        })
    }

    handlerBtnCloseWindow() {
        this.btnCloseWindow.addEventListener('click', (e) => {
            this.hideWindow();
        })
    }

    handleClickOutsideContainer() {
        document.addEventListener("click", async (e) => {
            if (!this.window.contains(e.target) && !this.ignorElem.contains(e.target)) {
                this.hideWindow();
            }
        })
    }

    handleNameInputClick() {
        this.fieldInput.addEventListener("click", async (e) => {
            console.log("клик по полю ввода имени");
            this.showWindow();
            let name = e.target.value;
            this.getAndDisplayUsersSearch(name);
        })
    }

    handleNameInputChange() {
        this.fieldInput.addEventListener("input", async (e) => {
            this.showWindow();
            let name = e.target.value;
            this.getAndDisplayUsersSearch(name);
        })
    }

    handleUserSelection() {
        this.window.addEventListener("click", async (e) => {
            let boxUser = e.target.closest(".ui-selector-user-box");
            if (boxUser && !e.target.closest(".ui-selector-item-user-link")) {
                let userId = boxUser.dataset.userId;
                let lastname = boxUser.dataset.lastname;
                let name = boxUser.dataset.name;
                let userPhoto = boxUser.dataset.userPhoto;
                this.callbackUserSelection(userId, lastname, name, userPhoto);
            }
        })
    }

    templateUserBoxForSearch(userId, lastname, name, workposition, userType, personalPhoto) {
        let cssClassIntranet = "ui-selector-item-box-guest";    // css класс приглашенного пользователя

        // если пользователь экстранет
        if (userType === "employee") {
            cssClassIntranet = "";
        }
        
        return `
            <div class="ui-selector-item-box ui-selector-user-box ${cssClassIntranet}" data-user-id="${userId}" data-lastname="${lastname}" data-name="${name}" data-user-type="${userType}" data-user-photo="${personalPhoto}">
                <div class="ui-selector-item">
                    <div class="ui-selector-item-useravatar"><i class="bi bi-people-fill"></i></div>
                    <div class="ui-selector-item-titles">
                        <div class="ui-selector-item-supertitle"></div>
                        <div class="ui-selector-item-title-box">
                            <div class="ui-selector-item-title-box-title">${lastname} ${name}</div>
                            <div class="ui-selector-item-title-box-status"><span>${USER_TYPE[userType] || userType}</span></div>
                            <div class="ui-selector-item-title-box-workposition">${workposition || ""}</div>
                        </div>
                        <div class="ui-selector-item-user-link">о сотруднике</div>
                    </div>
                    <div class="">
                        <div></div>
                    </div>
                </div>
            </div>
        `;
    }

    showWindow() {
        this.window.style.top = this.window.height + 5 + "px";
        this.window.style.right = 0 + "px";

        this.window.classList.remove("d-none");
        this.btnResponsible.classList.remove("btn-search-inactive");
        this.btnDepartment.classList.add("btn-search-inactive");
        this.boxResponsible.classList.remove("d-none");
        this.boxDepartment.classList.add("d-none");
    }

    hideWindow() {
        this.window.classList.add("d-none");
    }

    showSearchWindow() {
        this.btnResponsible.classList.remove("btn-search-inactive");
        this.btnDepartment.classList.add("btn-search-inactive");
        this.boxResponsible.classList.remove("d-none");
        this.boxDepartment.classList.add("d-none");
    }

    showDepartmentWindow() {
        this.btnResponsible.classList.add("btn-search-inactive");
        this.btnDepartment.classList.remove("btn-search-inactive");
        this.boxResponsible.classList.add("d-none");
        this.boxDepartment.classList.remove("d-none");
    }

    animationOpen(element) {
        let anime = element.animate({
            height: `${element.scrollHeight}px`}, this.timeAnimate //* element.scrollHeight
        );
        anime.addEventListener('finish', function() {
            element.style.height = '100%';
        });
        this.animate = anime;
    }

    animationClose(element) {
        let height = element.offsetHeight || element.scrollHeight;
        element.style.height = `${height}px`;
        let anime = element.animate(
            {height: "0px"}, this.timeAnimate //* height
        )
        anime.addEventListener('finish', function() {
            element.style.height = '0px';
        });
        this.animate = anime;
    }
}
