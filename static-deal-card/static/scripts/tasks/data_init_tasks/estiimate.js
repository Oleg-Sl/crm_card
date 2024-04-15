import {
    FIELD_DEAL_TITLE,
    FIELD_DEAL_ORDER_NUMBER,
    FIELD_DEAL_ASSIGNED_BY_ID,

    FIELD_DEAL_SOURCE_ID,
    FIELD_DEAL_DESCRIPTIONS,

} from '../../parameters.js';
// import { ProductGroup } from '../product_group.js';
const RESPONSIBLE_ID = 255;


import { TaskTemaplateBase } from './base.js';


export class TaskEstimateBody extends TaskTemaplateBase {
    getTaskData(dataObject) {
        const dealDesc = dataObject.dealDesc.getChangedData();
        let fields = {
            TITLE: `🎰 | ${dealDesc[FIELD_DEAL_ORDER_NUMBER] || ""} | ${dealDesc[FIELD_DEAL_TITLE] || ""} | Смета`,
            CREATED_BY: dataObject.userCurrent.ID,
            RESPONSIBLE_ID: RESPONSIBLE_ID,
            DESCRIPTION: this.getBody(dataObject),
            UF_CRM_TASK: [`D_${dataObject.dealId}`]
        };
        return fields;
    }

    getBody(dataObject) {
        return `Описание Заказа (Что делаем, сколько, требования, особенности)
${this.getDescriptionOrder(dataObject)}
${this.getDealData(dataObject)}
${this.getSources(dataObject)}
${this.getDocs(dataObject)}
        `;
    }

}























// export class TaskBodyEstimate extends TaskTemaplateBase {
//     constructor(dataObject) {
//         this.dataObject = dataObject;
//     }

//     getFieldBody() {
//         const dealDesc = this.dataObject.dealDesc.getChangedData();
//         let fields = {
//             TITLE: `🎰 | ${dealDesc[FIELD_DEAL_ORDER_NUMBER] || ""} | ${dealDesc[FIELD_DEAL_TITLE] || ""} | Смета`,
//             CREATED_BY: this.dataObject.userCurrent.ID,
//             RESPONSIBLE_ID: RESPONSIBLE_ID,
//             DESCRIPTION: this.getTaskBody(),
//             UF_CRM_TASK: [`D_${this.dataObject.dealId}`]
//         };
//         return fields;
//     }

//     getTaskBody() {
//         const clients = this.dataObject.dealClients.getData();
//         return `Описание Заказа (Что делаем, сколько, требования, особенности)
// ${this.getDescriptionOrder()}
// ${this.getTaskData()}
// ${this.getSources()}
// ${this.getDocs()}
//         `;
//     }

//     getTaskData() {
//         const clients = this.dataObject.dealClients.getData();
//         const contacts = clients?.contactsData;
//         console.log("contacts = ", contacts);
        
//         return `
//             [TABLE]
//                 [TR]
//                     [TD]1.[/TD]
//                     [TD][B]Как вас зовут[/B][/TD]
//                     [TD]${this.getContacts(contacts)}[/TD]
//                 [/TR]
//                 [TR]
//                     [TD]2.[/TD]
//                     [TD][B]Какой транспорт в каком количестве[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]Есть ли у вас макет или исходники[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]Есть ли замеры[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]Есть ли демонтаж[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
            
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]С НДС[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]В каие сроки нужна оклейка[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]Компания[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//                 [TR]
//                     [TD]3.[/TD]
//                     [TD][B]Спсособ связи[/B][/TD]
//                     [TD]   [/TD]
//                 [/TR]
//             [/TABLE]
//         `;
//     }

//     getContacts(contacts) {
//         let content = '';
//         for (var key in contacts) {
//             if (contacts.hasOwnProperty(key)) {
//                 const { ID, LAST_NAME, NAME, SECOND_NAME, PHONE, } = contacts[key];
//                 for (const { VALUE } of PHONE) {
//                     const phone = this.formatPhoneNumber(VALUE);
//                     content += `[*][URL=https://007.bitrix24.ru/crm/contact/details/${VALUE}/]${LAST_NAME} ${NAME} ${SECOND_NAME} ${VALUE}[/URL]. Написать в Whats App [URL=https://wa.me/${phone}/]${phone}[/URL]`;
//                 }
//             }
//         }

//         return `[LIST]${content}[/LIST]`;
//     }

//     formatPhoneNumber(phoneNumber) {
//         let digits = phoneNumber.replace(/\D/g, '');
//         if (digits.length > 0 && (digits[0] === '8' || digits[0] === '7')) {
//             digits = '+7' + digits.slice(1);
//         } else {
//             digits = '+7' + digits;
//         }
    
//         return digits;
//     }
    
//     getSources() {
//         const links = this.dataObject.dealSources.getLinks();
//         const files = this.dataObject.dealSources.getFiles();
//         let contentLink = '';
//         let contentPreview = '';

//         for (const { url, description } of links) {
//             contentLink += `
//                 [TR]
//                     [TD][URL=${url}]🔗 ${url}[/URL][/TD]
//                     [TD]${description}[/TD]
//                 [/TR]
//             `;
//         }

//         for (const { url, urlPrev, title, size, desc } of files) {
//             contentPreview += `
//                 [TR]
//                     [TD][URL=${url}]🔗 ${title} [/URL](${size}) ${desc}[/TD]
//                     [TD][IMG]${urlPrev}[/IMG][/TD]
//                 [/TR]
//             `;
//         }

//         return `[U][B]Исходники - ссылки[/B][/U][TABLE]
//                 [TR]
//                     [TD][B]Ссылки[/B][/TD]
//                     [TD][B]Описание[/B][/TD]
//                 [/TR]
//                 ${contentLink}
//             [/TABLE]

// [U][B]Исходники - файлы[/B][/U][TABLE]
//                 [TR]
//                     [TD][B]Описание[/B][/TD]
//                     [TD][B]Фото[/B][/TD]
//                 [/TR]
//                 ${contentPreview}
//             [/TABLE]
//         `;
//     }

//     getDocs() {
//         const docs = this.dataObject.dealDocs.getData();
//         let contentLink = '';
//         let contentPreview = '';

//         for (const { type, url, urlPrev, title, size, description } of docs) {
//             if (type === 'link') {
//                 contentLink += `
//                     [TR]
//                         [TD][URL=${url}]🔗 ${url}[/URL][/TD]
//                         [TD]${description}[/TD]
//                     [/TR]
//                 `;
//             }
//             if (type === 'file') {
//                 contentPreview += `
//                     [TR]
//                         [TD][URL=${url}]🔗 ${title} [/URL](${size}) ${description}[/TD]
//                         [TD][IMG]${urlPrev}[/IMG][/TD]
//                     [/TR]
//                 `;
//             }
//         }

//         return `[U][B]Ссылки по сделке[/B][/U][TABLE]
//                 [TR]
//                     [TD][B]Ссылки[/B][/TD]
//                     [TD][B]Описание[/B][/TD]
//                 [/TR]
//                     ${contentLink}
//             [/TABLE]

// [U][B]Документы по сделке[/B][/U][TABLE]
//                 [TR]
//                     [TD][B]Описание[/B][/TD]
//                     [TD][B]Фото[/B][/TD]
//                 [/TR]
//                 ${contentPreview}
//             [/TABLE]
//         `;
//     }

//     getDescriptionOrder() {
//         const dealDesc = this.dataObject.dealDesc.getChangedData();
//         let content = '';

//         for (let i = 0; i < 9; i++) {
//             const [key, val] = dealDesc[FIELD_DEAL_DESCRIPTIONS[i]];
//             content += `
//                 [TR]
//                     [TD]${1 + i}.[/TD]
//                     [TD][B]${key}[/B][/TD]
//                     [TD]${val}[/TD]
//                 [/TR]
//             `;
//         }
    
//         return `[TABLE]${content}[/TABLE]`
//     }
// }
