
// const OPEN_EMAIL = "https://bits24.bitrix24.ru/bitrix/components/bitrix/crm.activity.planner/slider.php?context=deal-797&ajax_action=ACTIVITY_EDIT&activity_id=0&TYPE_ID=4&OWNER_ID=797&OWNER_TYPE=DEAL&OWNER_PSID=0&FROM_ACTIVITY_ID=0&MESSAGE_TYPE=&SUBJECT=&BODY=&=undefined&__post_data_hash=-1046067848&IFRAME=Y&IFRAME_TYPE=SIDE_SLIDER";


export default class DealClients {
    constructor(container, bx24, dealId) {
        this.dealId = dealId;
        this.bx24 = bx24;
        this.container = container;
        this.clientsContainer = this.container.querySelector('.deal-clients__container');

        this.companyData = null;
        this.companyContacts = null;
        this.contactsData = null;
    }

    async init (companyData, companyContacts, contactsData) {
        this.companyData = companyData;
        this.companyContacts = companyContacts;
        
        let data = await this.getContactsData([...companyContacts, ...contactsData]);
        this.contactsData = data?.result?.result || [];

        this.render();
        this.addEventListeners();
    }

    async getContactsData(contacts) {
        const contactIds = contacts.map(item => item.CONTACT_ID);
        const data = await this.bx24.contact.getList(contactIds);
        return data;
    }

    render() {
        let contentHTML = '';
        contentHTML += this.getCompanyRowHTML(this.companyData, this.companyContacts, this.contactsData);
        contentHTML += this.getClientsRowsHTML(this.contactsData);
        this.clientsContainer.innerHTML = contentHTML;
    }

    getCompanyRowHTML(companyData, companyContacts, contactsData) {
        const firstContactWithPhone = companyContacts.find(contact => {
            const contactData = contactsData[contact.CONTACT_ID];
            return contactData && contactData.PHONE && contactData.PHONE.length > 0;
        });

        const contactData = contactsData?.[firstContactWithPhone?.CONTACT_ID] || {};
        const companyName = companyData.TITLE || " - ";
        const phones = contactData.PHONE || [];
        const emails = contactData.EMAIL || [];
        const openLines = contactData.IM || [];

        const classElementPhone = phones.length === 0 ? 'inactive' : '';
        const classElementEmail = emails.length === 0 ? 'inactive' : '';
        const classElementOpenLines = openLines.length === 0 ? 'inactive' : '';

        const contentHTML = `
            <div class="deal-clients__row-container" data-info="${companyData.ID}">
                <label for="">Компания</label>
                <div class="deal-clients__row">
                    <div class="deal-clients__name">
                        <div class="deal-clients__title" data-path-bx24="/company/details/${companyData.ID}/">${companyName}</div>
                    </div>
                    <div class="deal-clients__phone ${classElementPhone}">
                        <i class="bi bi-telephone-forward"></i>
                        ${this.getPhoneMenuHTML(phones)}
                    </div>
                    <div class="deal-clients__email ${classElementEmail}"><i class="bi bi-envelope"></i></div>
                    <div class="deal-clients__whatsapp ${classElementOpenLines}">
                        <i class="bi bi-whatsapp"></i>
                        ${this.getOpenLinesMenuHTML(openLines)}
                    </div>
                    <div class="deal-clients__thelegram inactive"><i class="bi bi-telegram"></i></div>
                </div>
            </div>
        `;
        return contentHTML;
    }

    getClientsRowsHTML(contactsData) {
        let contentHTML = '';

        for (const contact_id in contactsData) {
            const contact = contactsData[contact_id];
            contentHTML += this.getClientRowHTML(contact);
        }

        return contentHTML;
    }

    getClientRowHTML(contact) {
        const emails = contact.EMAIL || [];
        const phones = contact.PHONE || [];
        const openLines = contact.IM || [];
        const phone = phones[0] || {};
        const email = emails[0] || {};
        const separator = phone.VALUE ? ',' : '';
        const classElementPhone = phones.length === 0 ? 'inactive' : '';
        const classElementEmail = emails.length === 0 ? 'inactive' : '';
        const classElementOpenLines = openLines.length === 0 ? 'inactive' : '';

        let contentHTML = `
            <div class="deal-clients__row-container" data-info="${contact.ID}">
                <label for="">Клиент</label>
                <div class="deal-clients__row">
                    <div class="deal-clients__name">
                        <div  class="deal-clients__title" data-path-bx24="/contact/details/${contact.ID}/">${contact.LAST_NAME || ""} ${contact.NAME || ""}</div>
                        <div  class="deal-clients__title-info">${phone.VALUE || ""}${separator} ${email.VALUE || ""}</div>
                    </div>
                    <div class="deal-clients__phone ${classElementPhone}">
                        <i class="bi bi-telephone-forward"></i>
                        ${this.getPhoneMenuHTML(phones)}
                    </div>
                    <div class="deal-clients__email ${classElementEmail}"><i class="bi bi-envelope"></i></div>
                    <div class="deal-clients__whatsapp ${classElementOpenLines}">
                        <i class="bi bi-whatsapp"></i>
                        ${this.getOpenLinesMenuHTML(openLines)}
                    </div>
                    <div class="deal-clients__thelegram inactive"><i class="bi bi-telegram"></i></div>
                </div>
            </div>
        `;
        return contentHTML;
    }

    getPhoneMenuHTML(phones) {
        let contentHTML = '';

        for (const phone of phones) {
            if (phone.VALUE) {
                const phoneType = phone.VALUE_TYPE === "WORK" ? 'Рабочий' : phone.VALUE_TYPE;
                contentHTML += `
                    <span class="menu-phone-item">
                        <span class="menu-phone-item-text" data-phone-number="${phone.VALUE}">${phoneType || 'Рабочий'}: ${phone.VALUE}</span>
                    </span>
                `;
            }
        }

        return `<div class="menu-phones-items close">${contentHTML}</div>`;
    }

    getOpenLinesMenuHTML(openLines) {
        let contentHTML = '';

        for (const openLine of openLines) {
            if (openLine.VALUE) {
                contentHTML += `
                    <span class="menu-open-line-item">
                        <span class="menu-open-line-item-text" data-open-line-id="${openLine.VALUE}" title="Открытая линия: ${openLine.VALUE}">Открытая линия: ${openLine.VALUE}</span>
                    </span>
                `;
            }
        }

        return `<div class="menu-open-lines-items close">${contentHTML}</div>`;
    }

    addEventListeners() {
        // Открытие слайдер контакта
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('deal-clients__title')) {
                const path = target.getAttribute('data-path-bx24');
                console.log('Open contact = ', path);
                this.bx24.openPath(path);
            }
        });

        // Сделать звонок
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('menu-phone-item-text')) {
                const phoneNumber = target.getAttribute('data-phone-number');
                console.log('Make call = ', phoneNumber);
                this.bx24.makeCall(phoneNumber);
                // window.open(`https://wa.me/${phoneNumber}`, '_blank');
            }
        });

        // Отправить письмо
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.closest('.deal-clients__email')) {
                const url = this.bx24.getUrlSendMessageFromDealId(this.dealId);
                console.log('Send email to url = ', url);
                // window.open(`https://wa.me/${phoneNumber}`, '_blank');
            }
        });

        // Открыть окно открытой линии
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('menu-open-line-item-text')) {
                const openLineId = target.getAttribute('data-open-line-id');
                console.log('Open openline = ', openLineId);
                this.bx24.makeCall(openLineId);
                // window.open(`https://wa.me/${phoneNumber}`, '_blank');
            }
        });

        // Открытие/закрытие меню с телефонными номерами
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const phoneIcon = target.closest('.bi-telephone-forward');
            if (target.classList.contains('deal-clients__phone') || phoneIcon) {
                this.closePhoneMenu();
                this.togglePhoneMenu(target.closest('.deal-clients__phone'));
            }
        });

        // Закрытие меню с телефонными номерами
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!target.closest('.menu-phones-items') && !target.closest('.deal-clients__phone')) {
                this.closePhoneMenu();
            }
        });

        // Открытие/закрытие меню с открытыми линиями
        this.clientsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const icon = target.closest('.bi-whatsapp');
            if (target.classList.contains('deal-clients__whatsapp') || icon) {
                this.closeOpenLineMenu();
                this.toggleOpenLineMenu(target.closest('.deal-clients__whatsapp'));
            }
        });
    
        // Закрытие меню с открытыми линиями
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!target.closest('.menu-open-lines-items') && !target.closest('.deal-clients__whatsapp')) {
                this.closeOpenLineMenu();
            }
        });
    }

    closePhoneMenu() {
        const openMenus = document.querySelectorAll('.menu-phones-items:not(.close)');
        openMenus.forEach(menu => menu.classList.add('close'));
    }

    togglePhoneMenu(element) {
        const menu = element.querySelector('.menu-phones-items');
        menu.classList.toggle('close');
    }

    toggleOpenLineMenu(element) {
        const menu = element.querySelector('.menu-open-lines-items');
        menu.classList.toggle('close');
    }

    closeOpenLineMenu() {
        const openMenus = document.querySelectorAll('.menu-open-lines-items:not(.close)');
        openMenus.forEach(menu => menu.classList.add('close'));
    }

    
}
