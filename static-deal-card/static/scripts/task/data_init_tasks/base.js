import {
    // FIELD_DEAL_TITLE,
    // FIELD_DEAL_ORDER_NUMBER,
    // FIELD_DEAL_ASSIGNED_BY_ID,

    // FIELD_DEAL_SOURCE_ID,
    FIELD_DEAL_DESCRIPTIONS,

} from '../../parameters.js';

// import { ProductGroup } from '../product_group.js';
// const RESPONSIBLE_ID = 1;



export class TaskTemaplateBase {
    getDealData(dataObject) {
        this.dataObject = dataObject;
        const clients = this.dataObject.dealClients.getData();
        const contacts = clients?.contactsData;
        
        return `
            [TABLE]
                [TR]
                    [TD]1.[/TD]
                    [TD][B]Как вас зовут[/B][/TD]
                    [TD]${this.getContacts_(contacts)}[/TD]
                [/TR]
            [/TABLE]
        `;
    }
    
    getSources(dataObject) {
        this.dataObject = dataObject;
        const links = this.dataObject.dealSources.getLinks();
        const files = this.dataObject.dealSources.getFiles();
        let contentLink = '';
        let contentPreview = '';

        for (const { url, description } of links) {
            contentLink += `
                [TR]
                    [TD][URL=${url}]🔗 ${url}[/URL][/TD]
                    [TD]${description}[/TD]
                [/TR]
            `;
        }

        for (const { url, urlPrev, title, size, desc } of files) {
            contentPreview += `
                [TR]
                    [TD][URL=${url}]🔗 ${title} [/URL](${size}) ${desc}[/TD]
                    [TD][IMG]${urlPrev}[/IMG][/TD]
                [/TR]
            `;
        }

        return `[U][B]Исходники - ссылки[/B][/U][TABLE]
                [TR]
                    [TD][B]Ссылки[/B][/TD]
                    [TD][B]Описание[/B][/TD]
                [/TR]
                ${contentLink}
            [/TABLE]

[U][B]Исходники - файлы[/B][/U][TABLE]
                [TR]
                    [TD][B]Описание[/B][/TD]
                    [TD][B]Фото[/B][/TD]
                [/TR]
                ${contentPreview}
            [/TABLE]
        `;
    }

    getDocs(dataObject) {
        this.dataObject = dataObject;
        const docs = this.dataObject.dealDocs.getData();
        let contentLink = '';
        let contentPreview = '';

        for (const { type, url, urlPrev, title, size, description } of docs) {
            if (type === 'link') {
                contentLink += `
                    [TR]
                        [TD][URL=${url}]🔗 ${url}[/URL][/TD]
                        [TD]${description}[/TD]
                    [/TR]
                `;
            }
            if (type === 'file') {
                contentPreview += `
                    [TR]
                        [TD][URL=${url}]🔗 ${title} [/URL](${size}) ${description}[/TD]
                        [TD][IMG]${urlPrev}[/IMG][/TD]
                    [/TR]
                `;
            }
        }

        return `[U][B]Ссылки по сделке[/B][/U][TABLE]
                [TR]
                    [TD][B]Ссылки[/B][/TD]
                    [TD][B]Описание[/B][/TD]
                [/TR]
                    ${contentLink}
            [/TABLE]

[U][B]Документы по сделке[/B][/U][TABLE]
                [TR]
                    [TD][B]Описание[/B][/TD]
                    [TD][B]Фото[/B][/TD]
                [/TR]
                ${contentPreview}
            [/TABLE]
        `;
    }

    getDescriptionOrder(dataObject) {
        this.dataObject = dataObject;
        const dealDesc = this.dataObject.dealDesc.getChangedData();
        let content = '';

        for (let i = 0; i < 9; i++) {
            const [key, val] = dealDesc[FIELD_DEAL_DESCRIPTIONS[i]];
            content += `
                [TR]
                    [TD]${1 + i}.[/TD]
                    [TD][B]${key}[/B][/TD]
                    [TD]${val}[/TD]
                [/TR]
            `;
        }
    
        return `[TABLE]${content}[/TABLE]`
    }

    getContacts_(contacts) {
        let content = '';
        for (var key in contacts) {
            if (contacts.hasOwnProperty(key)) {
                const { ID, LAST_NAME, NAME, SECOND_NAME, PHONE, } = contacts[key];
                for (const { VALUE } of PHONE) {
                    const phone = this.formatPhoneNumber_(VALUE);
                    content += `[*][URL=https://007.bitrix24.ru/crm/contact/details/${VALUE}/]${LAST_NAME} ${NAME} ${SECOND_NAME} ${VALUE}[/URL]. Написать в Whats App [URL=https://wa.me/${phone}/]${phone}[/URL]`;
                }
            }
        }

        return `[LIST]${content}[/LIST]`;
    }

    formatPhoneNumber_(phoneNumber) {
        let digits = phoneNumber.replace(/\D/g, '');
        if (digits.length > 0 && (digits[0] === '8' || digits[0] === '7')) {
            digits = '+7' + digits.slice(1);
        } else {
            digits = '+7' + digits;
        }
    
        return digits;
    }

    getMedia(dataObject) {
        this.dataObject = dataObject;
        const links = this.dataObject.dealSources.getLinks();
        const files = this.dataObject.dealSources.getFiles();
        const docs = this.dataObject.dealDocs.getData();

        let contentSources = '';
        let contentDocsLinks = '';
        let contentDocsFiles = '';
        // 🖼🔗
        for (const { url, description } of links) {
            contentSources += `[*][URL=${url}]🔗 ${url}[/URL] ${description}`;
        }

        for (const { url, urlPrev, title, size, desc } of files) {
            contentSources += `[*][URL=${urlPrev}]🖼[/URL][URL=${url}]${url}[/URL] ${desc}`;
        }

        for (const { type, url, urlPrev, title, size, description } of docs) {
            if (type === 'link') {
                contentDocsLinks += `[*][URL=${url}]🔗 ${url}[/URL] ${description}`;
            }
            if (type === 'file') {
                contentDocsFiles += `[*][URL=${urlPrev}]🖼[/URL][URL=${url}]${url}[/URL] ${description}`;
            }
        }

        return `[U][B]Исходники - [/B][/U][TABLE]
                [TR]
                    [TD][B]Исходники[/B][/TD]
                    [TD][B]Файлы[/B][/TD]
                [/TR]
                
                [TR]
                    [TD]${contentSources}[/TD]
                    [TD]${contentDocsLinks}${contentDocsFiles}[/TD]
                [/TR]
            [/TABLE]
        `;
    }

    getBody(dataObject) {
        return `Описание Заказа (Что делаем, сколько, требования, особенности)
${this.getDescriptionOrder(dataObject)}
${this.getDealData(dataObject)}
${this.getMedia(dataObject)}
        `;
    }
}
