
export const FOLDER_PREVIEW_ID = 6249;

// Поля блока - описание сделки
export const FIELD_DEAL_TITLE = 'TITLE';
export const FIELD_DEAL_ORDER_NUMBER = "UF_CRM_1705170439319";
export const FIELD_DEAL_SOURCE_ID = "SOURCE_ID";
export const FIELD_DEAL_DESCRIPTIONS = [
    'UF_CRM_1705169880966',
    'UF_CRM_1705169893384',
    'UF_CRM_1705169963',
    'UF_CRM_1705169975',
    'UF_CRM_1705170000',
    'UF_CRM_1705170017',
    'UF_CRM_1705170032',
    'UF_CRM_1705170047',
    'UF_CRM_1705170062'
];

// Поля блока - состояние сделки
export const FIELD_DEAL_CREATE_DATE = 'DATE_CREATE';
export const FIELD_DEAL_MODIFY_DATE = 'DATE_MODIFY';

// Поля блока - сумма
export const FIELD_DEAL_AMOUNT = 'OPPORTUNITY';
export const FIELD_DEAL_PAYMENT = 'UF_CRM_1705205915';


// Поля блока - работники
export const FIELD_DEAL_RESPONSIBLE_MOP = 'ASSIGNED_BY_ID';
// const FIELD_RESPONSIBLE_MOS = 'UF_CRM_1672839295';
export const FIELD_DEAL_RESPONSIBLE_MOS = 'UF_CRM_1705169028';
// const FIELD_OBSERVERS = 'UF_CRM_1684305731';
export const FIELD_DEAL_OBSERVERS = 'UF_CRM_1705169155';

// Поля блока - исходники
export const FIELD_DEAL_SOURCE_LINKS = "UF_CRM_1705213116";
export const FIELD_DEAL_SOURCE_FILES = "UF_CRM_1707108853";

// Поля блока - документы и ссылки
export const FIELD_DEAL_DOCS = "UF_CRM_1707109069";

// Поля блока - акты, счета
export const FIELD_DEAL_ACTS_ID = 'UF_CRM_1705241207';
export const FIELD_DEAL_INVOICES_ID = 'UF_CRM_1705241225';

// Поля блока - реквизиты
export const FIELD_DEAL_OUR_REQUISITES = "UF_CRM_1705210520";       // Наши реквизиты
export const FIELD_DEAL_PAYMENT_METHOD =  "UF_CRM_1705210576";      // Способ оплаты
export const FIELD_DEAL_DOCUMENT_FLOW =  "UF_CRM_1705210615";       // ЭДО
// export const FIELD_DEAL_OUR_REQUISITES = "UF_CRM_1637326777";       // Наши реквизиты
// export const FIELD_DEAL_PAYMENT_METHOD =  "UF_CRM_1619441621";      // Способ оплаты
// export const FIELD_DEAL_DOCUMENT_FLOW =  "UF_CRM_1619441621";       // ЭДО

// Смарт процесс с списокм технологий в товаре
export const SP_TECHOLOGY_ID = 168;
export const SP_TECHOLOGY_FIELDS = {
    id: "id",
    general: "ufCrm33_1705324840",        // Технология изготовления
    inKP: "ufCrm33_1705324867",           // Технология - в КП
    MCHS: "ufCrm33_1705324943",           // Технология - МЧС
    film: "ufCrm33_1706947209",           // Технология - Пленка
    lamination: "ufCrm33_1706947327",     // Технология - Ламинация
    price: "ufCrm33_1705324987",          // Технология - Цена
    // photo: "ufCrm33_1705325000",          // Исходник - фото ----------------
    CHPP: "ufCrm33_1705325025",           // Расход - ЧПП
    width: "ufCrm33_1705325034",          // Расход - Ширина
    runningMeter: "ufCrm33_1705325045",   // Расход - Погонный метр
    installArea: "ufCrm33_1705325058",    // Площадь монтажа
    installCost: "ufCrm33_1705325070",    // Себестоимость монтажа
    installPercent: "ufCrm33_1705325085", // Процент монтаж
    totalPercent: "ufCrm33_1705325106",   // Итого - процент
    addedToOrder: "ufCrm33_1706092911",   // Добавить в заказ

};

// Смарт процесс - товары
export const SP_PRODUCT_ID = 164;
export const SP_PRODUCT_FIELDS = {
    id: "id",
    title: "title",                                 // Название
    quantity: "ufCrm31_1705323774",                 // Количество
    description: "ufCrm31_1705323794",              // Описание
    measurement: "ufCrm31_1705323809",              // Замер
    address: "ufCrm31_1705323837",                  // Адрес
    measurementCost: "ufCrm31_1705323848",          // Себестоимость замера
    measurementPercent: "ufCrm31_1705323865",       // Процент замер
    design: "ufCrm31_1705323886",                   // Дизайн
    designPayment: "ufCrm31_1705323916",            // Оплата дизайна
    designCost: "ufCrm31_1705323962",               // Стоимость дизайна
    installTime: "ufCrm31_1705323974",              // Монтаж - время
    installCity: "ufCrm31_1705324030",              // Монтаж - город
    installPlace: "ufCrm31_1705324064",             // Монтаж - место
    installComplexity: "ufCrm31_1705324094",        // Монтаж - сложность
    installDays: "ufCrm31_1705324114",              // Монтаж - количество дней
    installCost: "ufCrm31_1705324275",              // Монтаж - себестоимость
    installPercentage: "ufCrm31_1705324286",        // Монтаж - процент
    terms: "ufCrm31_1705324303",                    // Сроки
    termsDate: "ufCrm31_1705324356",                // Сроки - дата
    dismantling: "ufCrm31_1705324376",              // Демонтаж
    dismantlingDesc: "ufCrm31_1705324400",          // Демонтаж - описание
    dismantlingArea: "ufCrm31_1705324423",          // Демонтаж - площадь
    dismantlingComplexity: "ufCrm31_1705324441",    // Демонтаж - сложность
    dismantlingCost: "ufCrm31_1705324451",          // Демонтаж - себестоимость
    dismantlingPercent: "ufCrm31_1705324464",       // Демонтаж - процент
    businessTrip: "ufCrm31_1705324493",             // Командировка
    businessTripCost: "ufCrm31_1705324523",         // Командировка - себестоимость
    businessTripPercent: "ufCrm31_1705324534",      // Командировка - процент
    deliveryFrequency: "ufCrm31_1705324544",        // Доставка - сколько раз
    deliveryCostPerTime: "ufCrm31_1705324555",      // Доставка - себестоимость за раз
    sourcesFiles: "ufCrm31_1705496466",             // Исходник - фото
};

// Смарт процесс - группы товаров
export const SP_GROUP_ID = 156;
export const SP_GROUP_FIELDS = {
    id: "id",
    title: "title",                             // Название
    deliveryMethod: "ufCrm29_1705323639",       // ЦП - способ доставки
    deliveryAddress: "ufCrm29_1705323666",      // ЦП - адрес
    deliveryCost: "ufCrm29_1705323685",         // ЦП - себестоимость
    deliveryPercentage: "ufCrm29_1705323714",   // ЦП - процент
    delivery: "ufCrm29_1705496197",             // ЦП - да/нет/...
    deliveryDesc: "ufCrm29_1705496322",         // ЦП - описание
    deliveryCount: "ufCrm29_1706091306",        // ЦП - сколько раз
    deliveryCostOne: "ufCrm29_1706091344",      // ЦП - себестоимость за раз

    repeatTechnologies: "ufCrm29_1706100381", // Повторить - технология
    repeatSources: "ufCrm29_1706100424",      // Повторить - исходники
    repeatConsumption: "ufCrm29_1706100458",  // Повторить - расход (1ед.)
    repeatMeasurement: "ufCrm29_1706100489",  // Повторить - замер
    repeatDesign: "ufCrm29_1706100505",       // Повторить - дизайн
    repeatMontage: "ufCrm29_1706100517",      // Повторить - монтаж
    repeatDeadline: "ufCrm29_1706100962",     // Повторить - сроки
    repeatDelivery: "ufCrm29_1706100975",     // Повторить - доставка
};


// Смарт процесс - список пленок, ламинаций и ширин
export const SP_FILMS_ID = 173;
export const SP_FILMS_FIELDS = {
    id: "id",
    title: "title",  
    laminations: "ufCrm35_1706938068",  // Список ламинаций
    widths: "ufCrm35_1706938043",       // Список ширин пленок
};
