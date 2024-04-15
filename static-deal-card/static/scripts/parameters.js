
export const FOLDER_PREVIEW_ID = 947233;

export const FIELD_DEAL_ASSIGNED_BY_ID = 'ASSIGNED_BY_ID';

// ID задачи СМЕТА
export const FIELD_DEAL_TASK_ESTIMATE = 'UF_CRM_1694710433';
// ID задачи КП
export const FIELD_DEAL_TASK_COMMERC_OFFER = 'UF_CRM_1709109026';
// ID задачи  ЗАКАЗ
export const FIELD_DEAL_TASK_ORDER = 'UF_CRM_1661089895';
// ID задачи  СЧЕТ НА ОПЛАТУ
export const FIELD_DEAL_TASK_PAYMENT = 'UF_CRM_1661089811';
// ID задачи  СЧЕТ НА ПРЕДОПЛАТУ
export const FIELD_DEAL_TASK_PREPAYMENT = 'UF_CRM_1661253202';


// Поля блока - описание сделки
export const FIELD_DEAL_TITLE = 'TITLE';
export const FIELD_DEAL_ORDER_NUMBER = "UF_CRM_1633523035";
export const FIELD_DEAL_SOURCE_ID = "SOURCE_ID";
export const FIELD_DEAL_DESCRIPTIONS = [
    'UF_CRM_1707143925',
    'UF_CRM_1707143976',
    'UF_CRM_1707144033',
    'UF_CRM_1707144078',
    'UF_CRM_1707144122',
    'UF_CRM_1707144160',
    'UF_CRM_1707144200',
    'UF_CRM_1707144257',
    'UF_CRM_1707144284',
];

// Поля блока - состояние сделки
export const FIELD_DEAL_CREATE_DATE = 'DATE_CREATE';
export const FIELD_DEAL_MODIFY_DATE = 'DATE_MODIFY';


// Поля блока - сумма
export const FIELD_DEAL_AMOUNT = 'OPPORTUNITY';
export const FIELD_DEAL_PAYMENT = 'UF_CRM_1656421972';


// Поля блока - работники
export const FIELD_DEAL_RESPONSIBLE_MOP = 'ASSIGNED_BY_ID';
export const FIELD_DEAL_RESPONSIBLE_MOS = 'UF_CRM_1672839295';
export const FIELD_DEAL_OBSERVERS = 'UF_CRM_1684305731';

// Поля блока - исходники
export const FIELD_DEAL_SOURCE_LINKS = "UF_CRM_1707143471";
export const FIELD_DEAL_SOURCE_FILES = "UF_CRM_1707143546";

// Поля блока - документы и ссылки
export const FIELD_DEAL_DOCS = "UF_CRM_1707143605";

// Поля блока - акты, счета
export const FIELD_DEAL_ACTS_ID = 'UF_CRM_1707143746';
export const FIELD_DEAL_INVOICES_ID = 'UF_CRM_1707143681';

// Поля блока - реквизиты
export const FIELD_DEAL_OUR_REQUISITES = "UF_CRM_1637326777";       // Наши реквизиты
export const FIELD_DEAL_PAYMENT_METHOD = "UF_CRM_1619441621";       // Способ оплаты
export const FIELD_DEAL_DOCUMENT_FLOW = "UF_CRM_1707143812";        // ЭДО


// Смарт процесс с списокм технологий в товаре
export const SP_TECHOLOGY_ID = 137;
export const SP_TECHOLOGY_FIELDS = {
    id: "id",
    inKP: "ufCrm31_1707121933",           // Технология - в КП
    MCHS: "ufCrm31_1707121971",           // Технология - МЧС
    price: "ufCrm31_1707122007",          // Технология - Цена
    CHPP: "ufCrm31_1707121880",           // Расход - ЧПП
    runningMeter: "ufCrm31_1707121857",   // Расход - Погонный метр
    installArea: "ufCrm31_1707121805",    // Площадь монтажа
    installCost: "ufCrm31_1707121910",    // Себестоимость монтажа
    installPercent: "ufCrm31_1707121821", // Процент монтаж
    totalPercent: "ufCrm31_1707121781",   // Итого - процент
    addedToOrder: "ufCrm31_1707121709",   // Добавить в заказ
    
    general: "ufCrm31_1709369397",        // Технология изготовления
    film: "ufCrm31_1709369180",           // Технология - Пленка
    lamination: "ufCrm31_1709369083",     // Технология - Ламинация
    width: "ufCrm31_1709382065",          // Расход - Ширина
};

// Смарт процесс - товары
export const SP_PRODUCT_ID = 186;
export const SP_PRODUCT_FIELDS = {
    id: "id",
    title: "title",                                 // Название
    quantity: "ufCrm29_1707120728",                 // Количество
    description: "ufCrm29_1707120767",              // Описание
    measurement: "ufCrm29_1707120790",              // Замер
    measurementAddress: "ufCrm29_1707120840",       // Адрес замера
    measurementCost: "ufCrm29_1707120852",          // Себестоимость замера
    measurementPercent: "ufCrm29_1707120872",       // Процент замер
    design: "ufCrm29_1707120895",                   // Дизайн
    designPayment: "ufCrm29_1707120933",            // Оплата дизайна
    designCost: "ufCrm29_1707120983",               // Стоимость дизайна
    installTime: "ufCrm29_1707121011",              // Монтаж - время
    installCity: "ufCrm29_1707121046",              // Монтаж - город
    installPlace: "ufCrm29_1707121086",             // Монтаж - место
    installComplexity: "ufCrm29_1707121203",        // Монтаж - сложность
    installDays: "ufCrm29_1707121228",              // Монтаж - количество дней
    installCost: "ufCrm29_1707121245",              // Монтаж - себестоимость
    installPercentage: "ufCrm29_1707121272",        // Монтаж - процент
    terms: "ufCrm29_1707121290",                    // Сроки
    termsDate: "ufCrm29_1707121323",                // Сроки - дата
    dismantling: "ufCrm29_1707121354",              // Демонтаж
    dismantlingDesc: "ufCrm29_1707121394",          // Демонтаж - описание
    dismantlingArea: "ufCrm29_1707121429",          // Демонтаж - площадь
    dismantlingComplexity: "ufCrm29_1707121444",    // Демонтаж - сложность
    dismantlingCost: "ufCrm29_1707121461",          // Демонтаж - себестоимость
    dismantlingPercent: "ufCrm29_1707121476",       // Демонтаж - процент
    businessTrip: "ufCrm29_1707121504",             // Командировка
    businessTripCost: "ufCrm29_1707121539",         // Командировка - себестоимость
    businessTripPercent: "ufCrm29_1707121557",      // Командировка - процент
    deliveryFrequency: "ufCrm29_1707121587",        // Доставка - сколько раз
    deliveryCostPerTime: "ufCrm29_1707121613",      // Доставка - себестоимость за раз
    sourcesFiles: "ufCrm29_1710345391",             // Исходник - фото
};

// Смарт процесс - группы товаров
export const SP_GROUP_ID = 164;
export const SP_GROUP_FIELDS = {
    id: "id",
    title: "title",                             // Название
    deliveryMethod: "ufCrm27_1707120323",       // ЦП - способ доставки
    deliveryAddress: "ufCrm27_1707120357",      // ЦП - адрес
    deliveryCost: "ufCrm27_1707120373",         // ЦП - себестоимость
    deliveryPercentage: "ufCrm27_1707120407",   // ЦП - процент
    delivery: "ufCrm27_1707120261",             // ЦП - да/нет/...
    deliveryDesc: "ufCrm27_1707120438",         // ЦП - описание
    deliveryCount: "ufCrm27_1707120466",        // ЦП - сколько раз
    deliveryCostOne: "ufCrm27_1707120484",      // ЦП - себестоимость за раз

    repeatTechnologies: "ufCrm27_1707120515", // Повторить - технология
    repeatSources: "ufCrm27_1707120542",      // Повторить - исходники
    repeatConsumption: "ufCrm27_1707120561",  // Повторить - расход (1ед.)
    repeatMeasurement: "ufCrm27_1707120577",  // Повторить - замер
    repeatDesign: "ufCrm27_1707120597",       // Повторить - дизайн
    repeatMontage: "ufCrm27_1707120622",      // Повторить - монтаж
    repeatDeadline: "ufCrm27_1707120645",     // Повторить - сроки
    repeatDelivery: "ufCrm27_1707120665",     // Повторить - доставка
};

// Смарт процесс - список названий (видов) технологий
export const SP_TECHOLOGY_TYPE_ID = 188;
// Смарт процесс - список названий (видов) пленок
export const SP_FILMS_ID = 172;
// Смарт процесс - список доступных ширин пленок 
export const SP_WIDTH_ID = 157;
export const SP_WIDTH_FIELDS = {
    id: "id",
    title: "title",                     // Название
    value: "ufCrm43_1709380138",        // Значение
};
// Смарт процесс - список доступных ламинаций
export const SP_LAMINATION_ID = 131;
// Смарт процесс - список зависимостей ламинаций и ширин от пленок
export const SP_DEPENDENCE_ID = 189;
export const SP_DEPENDENCE_FIELDS = {
    id: "id",
    title: "title",                         // Название
    // film: "ufCrm33_1709568884",             // Пленка
    laminations: "ufCrm33_1709222893",      // Список ID ламинаций
    widths: "ufCrm33_1709370111",           // Список ID ширин
};
