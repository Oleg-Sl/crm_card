import {
    FOLDER_PREVIEW_ID,
    FIELD_DEAL_DOCS,
} from '../parameters.js';


const FIELD_DOCS = "UF_DOCS";
const CLASS_LIST_ITEMS = "deal-docs__files";
const CLASS_BUTTON_ADD_FILE = "deal-files__button-add-file";
const CLASS_BUTTON_ADD_LINK = "deal-files__button-add-link";

const CLASS_INPUT_FILE = "deal-files__sources-files";
const CLASS_SPINNER = "spinner-border";


class FileManager {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async uploadFile(folderId, file) {
        const result = await this.bx24.files.uploadFile(folderId, file);
        return result?.result;
    }

    async removeFile(fileId) {
        const result = await this.bx24.files.removeFile(fileId);
        return result;
    }

    async getFiles(folderId) {
        const result = await this.bx24.files.getFilesFromFolder(folderId);
        return result?.result || [];
    }
}


class YandexDiskManager {
    constructor(yaDisk) {
        this.yaDisk = yaDisk;
    }

    async uploadFile(dirPath, fileName, fileData) {
        try {
            return await this.yaDisk.uploadFile(dirPath, fileName, fileData);
        } catch (error) {
            console.error('Error uploading file to YandexDisk:', error);
            throw error;
        }
    }
}


class FilePreviewManager {
    constructor(bx24, previewFolder) {
        this.fileManagerPrview = new FileManager(bx24);
        this.previewFolder = previewFolder;
    }

    async uploadFile(fileData) {
        console.log("FilePreviewDownload");
        try {
            const filePreview = await this.convertAndCompressImage(fileData);
            return await this.fileManagerPrview.uploadFile(this.previewFolder, filePreview);
        } catch (error) {
            console.error('Error uploading preview file:', error);
            throw error;
        }
    }

    convertAndCompressImage(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
      
              // Уменьшаем разрешение (ширину и высоту) до, например, 300x200 пикселей
              const newWidth = 300;
              const newHeight = 200;
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
              // Преобразуем canvas в Data URL и создаем Blob
              canvas.toBlob(function (blob) {
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
              }, 'image/jpeg', 0.9); // 0.9 - качество сжатия (от 0.0 до 1.0)
            };
      
            img.src = e.target.result;
          };
      
          reader.readAsDataURL(file);
        });
    }
}


class UIManager {
    constructor(container, fileManager) {
        this.container = container;
        this.fileManager = fileManager;

        this.btnAddFile = this.container.querySelector(`.${CLASS_BUTTON_ADD_FILE}`);
        this.btnAddLink = this.container.querySelector(`.${CLASS_BUTTON_ADD_LINK}`);
        this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        this.elemSpinner = this.btnAddFile.querySelector(`.${CLASS_SPINNER}`);
        this.initHandlers();
    }

    initHandlers() {
        this.btnAddFile.addEventListener('click', (event) => this.showFileInput(event));
        this.btnAddLink.addEventListener('click', (event) => this.handlerLinkAdd(event));
        this.boxList.addEventListener('change', (event) => this.handleFileDescriptionChange(event));
        this.boxList.addEventListener('click', (event) => this.handleFileRemoval(event));
    }

    async showFileInput() {
        try {
            const files = await this.selectFiles();
            if (files.length > 0) {
                this.showSpinner();
                
                await Promise.all(Array.from(files).map(async (file) => {
                    await this.fileManager.addFile(file);
                }));
                this.hideSpinner();
            }
        } catch (error) {
            console.error('Error selecting files:', error);
        }
    }

    async selectFiles(event) {
        return new Promise((resolve, reject) => {
            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.multiple = true;
            // inputElement.accept = 'image/*'; // Установите подходящий тип файлов
            inputElement.addEventListener('change', () => {
                resolve(inputElement.files);
            });
            inputElement.click();
        });
    }

    handlerLinkAdd(event) {
        this.fileManager.handlerLinkAdd(event);
    }

    handleFileDescriptionChange(event) {
        this.fileManager.handleFileDescriptionChange(event);
    }

    handleFileRemoval(event) {
        this.fileManager.handleFileRemoval(event);
    }

    updateHTML(files) {
        let contentHTML = "";

        this.removePreviewEventListeners();

        for (let i = 0; i < files.length; i++) {
            const { type, url, title, size, description, urlPrev } = files[i];
            if (type === "link") {
                contentHTML += `
                    <div class="deal-docs__file-row">
                        <div><div class="deal-docs__file-row-numb">${i + 1}.</div></div>
                        <div><div class="deal-docs__file-row-prev">🔗</div></div>
                        <div class="deal-docs__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${url}">${url}</a></div>
                        <div class="deal-docs__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${description}"></div>
                        <div class="deal-docs__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
                        <div class="deal-docs__file-row-draganddrop"><i class="bi bi-list"></i></div>
                        <div class="deal-docs__file-row-update"><i class="bi bi-arrow-repeat"></i></div>
                    </div>
                `;
            } else {
                contentHTML += `
                    <div class="deal-docs__file-row">
                        <div><div class="deal-docs__file-row-numb">${i + 1}.</div></div>
                        <div><div class="deal-docs__file-row-prev file-row-prev" data-link="${urlPrev}">🗂</div></div>
                        <div class="deal-docs__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${title} (${size})">${title} (${size})</a></div>
                        <div class="deal-docs__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${description}"></div>
                        <div class="deal-docs__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
                        <div class="deal-docs__file-row-draganddrop"><i class="bi bi-list"></i></div>
                        <div class="deal-docs__file-row-update"><i class="bi bi-arrow-repeat"></i></div>
                    </div>
                `;
            }
        }

        this.boxList.innerHTML = contentHTML;

        this.addPreviewEventListeners();
    }

    handleEventPreviewShow(event) {
        const target = event.target;
        if (target.tagName === 'DIV' && target.classList.contains('deal-docs__file-row-prev') && target.dataset.link) {
            const smile = target.textContent;
            const previewLink = target.dataset.link;
            const previewContainer = document.getElementById('tooltip');
            previewContainer.innerHTML = `<div style="max-width: 250px;"><img src="${previewLink}" alt="${smile}" style="width: 100%;"></div>`;
            previewContainer.style.visibility = 'visible';
            previewContainer.style.left = event.pageX + 'px';
            previewContainer.style.opacity = '1';
            previewContainer.style.top = event.pageY + 'px';
        }
    }

    handleEventPreviewHide(event) {
        const previewContainer = document.getElementById('tooltip');
        previewContainer.style.opacity = '0';
        previewContainer.style.visibility = "hidden";
    }

    addPreviewEventListeners() {
        const list = this.boxList.querySelectorAll('.file-row-prev');

        list.forEach(item => {
            item.addEventListener('mouseover', this.handleEventPreviewShow);
            item.addEventListener('mouseout', this.handleEventPreviewHide);
        });
    }

    removePreviewEventListeners() {
        const list = this.boxList.querySelectorAll('.file-row-prev');

        list.forEach(item => {
            item.removeEventListener('mouseover', this.handleEventPreviewShow);
            item.removeEventListener('mouseout', this.handleEventPreviewHide);
        });
    }

    showSpinner() {
        this.elemSpinner.classList.remove("d-none");
    }
    
    hideSpinner() {
        this.elemSpinner.classList.add("d-none");
    }
}


export default class DealDocs {
    constructor(container, bx24, yaDisk, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        
        this.ui = new UIManager(container, this);
        this.yaDiskManager = new YandexDiskManager(yaDisk);
        this.filePreviewManager = new FilePreviewManager(bx24, FOLDER_PREVIEW_ID);

        this.data = [];
    }

    init(dataDeal) {
        let dataDocs = dataDeal?.[FIELD_DEAL_DOCS] || [];
        console.log(dataDocs);
        this.data = this.parseList(dataDocs);
        console.log(this.data);
        this.updateHTML();
    }

    handlerLinkAdd(event) {
        this.addLink();
    }

    handleFileDescriptionChange(event) {
        if (event.target.classList.contains('files-desc')) {
            const index = event.target.dataset.index;
            this.data[index].description = event.target.value;
        }
    }

    handleFileRemoval(event) {
        if (event.target.classList.contains('file-row-del')) {
            const index = event.target.dataset.index;
            this.data.splice(index, 1);
            this.updateHTML();
        }
    }

    updateHTML() {
        this.ui.updateHTML(this.data);
    }

    getDataFromDeal() {
        return this.bx24.getDealData();
    }

    addLink() {
        const link = prompt('Введите ссылку', 'https://');
        if (link) {
            this.data.push({
                type: 'link',
                url: link,
                description: "",
            });
            this.updateHTML();
        }
    }

    async addFile(fileData) {
        const fileName = fileData.name;
        const fileSize = fileData.size;
    
        const dirPath = `${this.dealId}`;
        const linkPromise = this.yaDiskManager.uploadFile(dirPath, fileName, fileData);
    
        let previewUrlPromise = null;
        if (this.isImageFile(fileData)) {
            previewUrlPromise = this.filePreviewManager.uploadFile(fileData)
                .then(preview => preview?.DOWNLOAD_URL);
        }
    
        try {
            const [link, previewUrl] = await Promise.all([linkPromise, previewUrlPromise]);
    
            if (!link) {
                console.error('Error uploading file to YandexDisk');
                return;
            }
    
            this.data.push({
                type: 'file',
                url: link,
                title: fileName,
                size: this.getFormatingFileSize(fileSize),
                description: "",
                urlPrev: previewUrl,
            });
    
            this.updateHTML();
            // BX24.fitWindow();
        } catch (error) {
            console.error('Error adding file:', error);
        }
    }
    

    // async addFile(fileData) {
    //     const fileName = fileData.name;
    //     const fileSize = fileData.size;

    //     const dirPath = `${this.dealId}`;
    //     const link = await this.yaDiskManager.uploadFile(dirPath, fileName, fileData);
    //     let previewUrl = null;

    //     if (this.isImageFile(fileData)) {
    //         const preview = await this.filePreviewManager.uploadFile(fileData);
    //         previewUrl = preview?.DOWNLOAD_URL;
    //     }

    //     if (!link) {
    //         console.error('Error uploading file to YandexDisk');
    //         return;
    //     }

    //     this.data.push({
    //         type: 'file',
    //         url: link,
    //         title: fileName,
    //         size: this.getFormatingFileSize(fileSize),
    //         description: "",
    //         urlPrev: previewUrl,
    //     });

    //     this.updateHTML();
    //     // BX24.fitWindow();
    // }

    isImageFile(file) {
        return file.type.startsWith('image/');
    }

    parseList(dataList) {
        // "file;https://yadi.sk/d/lIjE3soll7ZK6A;file.jpg;19.58KB;Краткое описание;https://yadi.sk/d/lIjE3soll7ZK6A;"
        // "link;https://google.com;;;Краткое описание;;"
        const parsedData = [];
    
        for (const dataItem of dataList) {
            const [type, ...rest] = dataItem.split(';');
    
            if (type === 'file') {
                const [fileName, fileSize, fileLink, filePreviewLink, fileDescription] = rest;
                parsedData.push({
                    type: 'file',
                    url: fileLink,
                    title: fileName,
                    size: fileSize,
                    desc: fileDescription,
                    urlPrev: filePreviewLink,
                });
            } else if (type === 'link') {
                const [, , fileLink, , linkDescription] = rest;
                parsedData.push({
                    type: 'link',
                    url: fileLink,
                    desc: linkDescription || "",
                });
            }
        }
    
        return parsedData;
    }

    getFormatingFileSize(size) {
        const KB = 1024;
        const MB = KB * KB;
        if (size < KB) {
            return size + "B";
        } else if (size < MB) {
            return (size / KB).toFixed(2) + "KB";
        } else {
            return (size / MB).toFixed(2) + "MB";
        }
    }

    getChangedData() {
        return {
            [FIELD_DEAL_DOCS]: this.stringifyData(this.data)
        };
    }

    stringifyData(dataArray) {
        return dataArray.map(item => `${item.type};${item.title};${item.size};${item.url};${item.urlPrev};${item.desc || ""}`);
    }
}



// export default class DealDocs {
//     constructor(container, bx24, yaDisk, dealId) {
//         this.container = container;
//         this.bx24 = bx24;
//         this.yaDisk = yaDisk;
//         this.dealId = dealId;

//         this.data = []

//         this.boxList = null;
//         this.btnAddFile = null;
//         this.btnAddLink = null;

//     }

//     init(dataDeal) {
//         let dataDocs = dataDeal?.[FIELD_DEAL_DOCS] || [];
//         this.data = this.parseList(dataDocs);

//         this.btnAddFile = this.container.querySelector(`.${CLASS_BUTTON_ADD_FILE}`);
//         this.btnAddLink = this.container.querySelector(`.${CLASS_BUTTON_ADD_LINK}`);
//         this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        
//         this.updateHTML();
//         this.initHadler();
//     }

//     updateHTML() {
//         let contentHTML = "";

//         this.removePreviewEventListeners();

//         for (let i = 0; i < this.data.length; i++) {
//             const { type, url, title, size, description, urlPrev } = this.data[i];
//             if (type === "link") {
//                 contentHTML += `
//                     <div class="deal-docs__file-row">
//                         <div><div class="deal-docs__file-row-numb">${i + 1}.</div></div>
//                         <div><div class="deal-docs__file-row-prev">🔗</div></div>
//                         <div class="deal-docs__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${url})">${url}</a></div>
//                         <div class="deal-docs__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${description}"></div>
//                         <div class="deal-docs__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
//                         <div class="deal-docs__file-row-draganddrop"><i class="bi bi-list"></i></div>
//                         <div class="deal-docs__file-row-update"><i class="bi bi-arrow-repeat"></i></div>
//                     </div>
//                 `;
//             } else {
//                 contentHTML += `
//                     <div class="deal-docs__file-row">
//                         <div><div class="deal-docs__file-row-numb">${i + 1}.</div></div>
//                         <div><div class="deal-docs__file-row-prev file-row-prev" data-link="${urlPrev}">🗂</div></div>
//                         <div class="deal-docs__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${title} (${size})">${title} (${size})</a></div>
//                         <div class="deal-docs__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${description}"></div>
//                         <div class="deal-docs__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
//                         <div class="deal-docs__file-row-draganddrop"><i class="bi bi-list"></i></div>
//                         <div class="deal-docs__file-row-update"><i class="bi bi-arrow-repeat"></i></div>
//                     </div>
//                 `;
//             }
//         }

//         this.boxList.innerHTML = contentHTML;

//         this.addPreviewEventListeners();
//     }

//     parseList(dataList) {
//         // "file;https://yadi.sk/d/lIjE3soll7ZK6A;file.jpg;19.58KB;Краткое описание;https://yadi.sk/d/lIjE3soll7ZK6A;"
//         // "link;https://google.com;;;Краткое описание;;"
//         const parsedData = [];
    
//         for (const dataItem of dataList) {
//             const [type, ...rest] = dataItem.split(';');
    
//             if (type === 'file') {
//                 const [fileLink, fileName, fileSize, fileDescription, filePreviewLink] = rest;
//                 parsedData.push({
//                     type: 'file',
//                     url: fileLink,
//                     title: fileName,
//                     size: fileSize,
//                     description: fileDescription,
//                     urlPrev: filePreviewLink,
//                 });
//             } else if (type === 'link') {
//                 const [linkUrl, , , linkDescription] = rest;
//                 parsedData.push({
//                     type: 'link',
//                     url: linkUrl,
//                     description: linkDescription,
//                 });
//             }
//         }
    
//         return parsedData;
//     }

//     initHadler() {
//         // нажатие кнопки "Добавить файл"
//         this.btnAddFile.addEventListener('click', (event) => {
//             let elemInput = event.target.parentNode.parentNode.querySelector("input");
//             elemInput.click();
//         });

//         // нажатие кнопки "Добавить ссылку"
//         this.btnAddLink.addEventListener('click', (event) => {
//             this.addLink();
//         });

//         // Пользователь подтвердил выбор файла
//         this.container.addEventListener('change', async (e) => {
//             if (e.target.classList.contains(CLASS_INPUT_FILE)) {
//                 let elemSpinner = this.btnAddFile.querySelector(`.${CLASS_SPINNER}`);
//                 elemSpinner.classList.remove("d-none");
//                 for (let file of e.target.files) {
//                     await this.addFile(file.name, file, file.size);
//                 }
//                 elemSpinner.classList.add("d-none");
//             }
//         });

//         // Изменение описания файла
//         this.boxList.addEventListener('change', (event) => {
//             if (event.target.classList.contains('files-desc')) {
//                 const index = event.target.dataset.index;
//                 this.data[index].description = event.target.value;
//             }
//         })

//         // Событие удаления файла
//         this.boxList.addEventListener('click', (event) => {
//             if (event.target.classList.contains('file-row-del')) {
//                 const index = event.target.dataset.index;
//                 this.data.splice(index, 1);
//                 this.updateHTML();
//             }
//         })

//     }

//     addLink() {
//         const link = prompt('Введите ссылку', 'https://');
//         if (link) {
//             this.data.push({
//                 type: 'link',
//                 url: link,
//                 description: "",
//             });
//             this.updateHTML();
//         }
//     }

//     async addFile(fileName, fileData, fileSize) {
//         let dirPath = `${this.dealId}`;
//         console.log(dirPath, fileName, fileData, fileSize);
//         let link = await this.yaDisk.uploadFile(dirPath, fileName, fileData);

//         if (!link) {
//             console.error("Error upload file to YandexDisk");
//             return;
//         }

//         this.data.push({
//             type: 'file',
//             url: link,
//             title: fileName,
//             size: this.getFormatingFileSize(fileSize),
//             description: "",
//             urlPrev: link,
//         });

//         this.updateHTML();
//         // BX24.fitWindow();
//     }

//     handleEventPreviewShow(event) {
//         const target = event.target;
//         if (target.tagName === 'DIV' && target.classList.contains('deal-docs__file-row-prev') && target.dataset.link) {
//             const smile = target.textContent;
//             const previewLink = target.dataset.link;
//             const previewContainer = document.getElementById('tooltip');
//             previewContainer.innerHTML = `<img src="${previewLink}" alt="${smile}">`;
//             previewContainer.style.height = '100px';
//             previewContainer.style.width = '100px';
//             previewContainer.style.visibility = "visible";
//             previewContainer.style.left = event.pageX + 'px';
//             previewContainer.style.opacity = '1';
//             previewContainer.style.top = event.pageY + 'px';

//         }
//     }

//     handleEventPreviewHide(event) {
//         const previewContainer = document.getElementById('tooltip');
//         previewContainer.style.opacity = '0';
//         previewContainer.style.visibility = "hidden";
//     }

//     addPreviewEventListeners() {
//         const list = this.boxList.querySelectorAll('.file-row-prev');

//         list.forEach(item => {
//             item.addEventListener('mouseover', this.handleEventPreviewShow);
//             item.addEventListener('mouseout', this.handleEventPreviewHide);
//         });
//     }

//     removePreviewEventListeners() {
//         const list = this.boxList.querySelectorAll('.file-row-prev');

//         list.forEach(item => {
//             item.removeEventListener('mouseover', this.handleEventPreviewShow);
//             item.removeEventListener('mouseout', this.handleEventPreviewHide);
//         });
//     }
      

//     getData() {
//         return this.stringifyData(this.data);
//     }

//     stringifyData(dataArray) {
//         const stringList = [];

//         for (const item of dataArray) {
//             if (item.type === 'file') {
//                 const fileString = `file;${item.link};${item.name};${item.size};${item.description};${item.previewLink};`;
//                 stringList.push(fileString);
//             } else if (item.type === 'link') {
//                 const linkString = `link;${item.url};;;;${item.description};;`;
//                 stringList.push(linkString);
//             }
//         }

//         return stringList;
//     }

//     getFormatingFileSize(size) {
//         const KB = 1024;
//         const MB = KB * KB;
//         if (size < KB) {
//             return size + "B";
//         } else if (size < MB) {
//             return (size / KB).toFixed(2) + "KB";
//         } else {
//             return (size / MB).toFixed(2) + "MB";
//         }
//     }
// }

