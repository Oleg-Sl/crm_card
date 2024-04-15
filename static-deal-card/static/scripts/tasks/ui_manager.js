// // uiManager.js

// export default class UIManager {
//     constructor(dataManager, tabName) {
//         this.dataManager = dataManager;
//         this.tabName = tabName;
//         this.initUI();
//     }

//     initUI() {
//         // Пример: добавление обработчика для кнопки добавления группы товаров
//         const addButton = document.getElementById(`add-${this.tabName}-button`);
//         addButton.addEventListener('click', () => this.handleAddButtonClick());

//         // Добавьте обработчики для других кнопок и событий по аналогии
//     }

//     handleAddButtonClick() {
//         const itemName = prompt(`Введите название ${this.tabName}:`);
//         if (itemName) {
//             switch (this.tabName) {
//                 case 'product-group':
//                     this.dataManager.addProductGroup(new ProductGroup(itemName));
//                     break;
//                 case 'product':
//                     this.dataManager.addProduct(new Product(itemName));
//                     break;
//                 case 'technology':
//                     this.dataManager.addTechnology(new Technology(itemName));
//                     break;
//             }
//         }
//     }
// }
