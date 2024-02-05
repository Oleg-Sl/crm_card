// deal-files

// Поле:
// - название;ссылка;размер;превью;описание
// - ID файла;ID превью;описание
// - ID файла;описание;
// - title;size;url;url-prev;desc;
//
import {
    FOLDER_PREVIEW_ID,
    FIELD_DEAL_SOURCE_LINKS,
    FIELD_DEAL_SOURCE_FILES,
} from '../parameters.js';


const CLASS_CONTAINER_LINKS = "deal-files__left";
const CLASS_CONTAINER_FILES = "deal-files__right";
const CLASS_LIST_ITEMS = "deal-files__files";
const CLASS_BUTTON_ADD = "deal-files__button-add";
const CLASS_INPUT_FILE = "deal-files__sources-files";
const CLASS_SPINNER = "spinner-border";


class FileManager {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async uploadFile(folderId, file) {
        const result = await this.bx24.files.uploadFile(folderId, file);
        return result;
    }

    async removeFile(fileId) {
        const result = await this.bx24.files.removeFile(fileId);
        return result;
    }

    async getFiles(folderId) {
        const result = await this.bx24.files.getFilesFromFolder(folderId);
        return result || [];
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
        console.log("this.fileManagerPrview = ", this.fileManagerPrview);
        this.previewFolder = previewFolder;
    }

    async uploadFile(fileData) {
        console.log("FilePreviewDownload");
        try {
            const filePreview = await this.convertAndCompressImage(fileData);
            console.log("this.fileManagerPrview2 = ", this.fileManagerPrview);
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
        this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);
        this.elemSpinner = this.btnAdd.querySelector(`.${CLASS_SPINNER}`);
        this.initHandlers();
    }

    initHandlers() {
        this.btnAdd.addEventListener('click', (event) => this.showFileInput());
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

    async selectFiles() {
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

    handleFileDescriptionChange(event) {
        this.fileManager.handleFileDescriptionChange(event);
    }

    handleFileRemoval(event) {
        this.fileManager.handleFileRemoval(event);
    }

    handleFilePreviewShow(event) {
        const target = event.target;
        if (target.tagName === 'DIV' && target.classList.contains('deal-files__file-row-prev') && target.dataset.link) {
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

    handleFilePreviewHide() {
        const previewContainer = document.getElementById('tooltip');
        previewContainer.style.opacity = '0';
        previewContainer.style.visibility = 'hidden';
    }

    updateHTML(files) {
        this.removePreviewEventListeners();

        this.boxList.innerHTML = files
            .map((file, index) => `
                <div class="deal-files__file-row file-row">
                    <div><div class="deal-files__file-row-numb">${index + 1}.</div></div>
                    <div><div class="deal-files__file-row-prev file-row-prev" data-link="${file.urlPrev}">🖼</div></div>
                    <div class="deal-files__file-row-url" data-link="${file.url}">
                        <a href="${file.url}" target="_blank" title="${file.title} (${file.size})">
                            ${file.title} (${file.size})
                        </a>
                    </div>
                    <div class="deal-files__file-row-desc">
                        <input class="files-desc" data-index="${index}" type="text" placeholder="описание файла (не обязательно)" value="${file.desc}">
                    </div>
                    <div class="deal-files__file-row-del">
                        <i class="bi bi-dash-square file-row-del" data-index="${index}"></i>
                    </div>
                </div>
            `)
            .join('');

        this.addPreviewEventListeners();
    }

    addPreviewEventListeners() {
        this.boxList.querySelectorAll('.file-row-prev').forEach(item => {
            item.addEventListener('mouseover', this.handleFilePreviewShow.bind(this));
            item.addEventListener('mouseout', this.handleFilePreviewHide);
        });
    }

    removePreviewEventListeners() {
        this.boxList.querySelectorAll('.file-row-prev').forEach(item => {
            item.removeEventListener('mouseover', this.handleFilePreviewShow.bind(this));
            item.removeEventListener('mouseout', this.handleFilePreviewHide);
        });
    }

    showSpinner() {
        this.elemSpinner.classList.remove("d-none");
    }
    
    hideSpinner() {
        this.elemSpinner.classList.add("d-none");
    }
}

class DealFiles {
    constructor(container, bx24, yaDisk, dealId, dataFiles) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;

        this.fileManager = new FileManager(bx24);
        this.yaDiskManager = new YandexDiskManager(yaDisk);
        this.filePreviewManager = new FilePreviewManager(bx24, FOLDER_PREVIEW_ID);
        this.uiManager = new UIManager(container, this);

        this.files = this.parseData(dataFiles);
        this.updateHTML();
    }

    handleFileDescriptionChange(event) {
        if (event.target.classList.contains('files-desc')) {
            const index = event.target.dataset.index;
            this.files[index].desc = event.target.value;
        }
    }

    handleFileRemoval(event) {
        if (event.target.classList.contains('file-row-del')) {
            const index = event.target.dataset.index;
            this.files.splice(index, 1);
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

            this.files.push({
                title: fileName,
                size: this.formatFileSize(fileSize),
                url: link,
                urlPrev: previewUrl,
                desc: '',
            });

            this.updateHTML();
        } catch (error) {
            console.error('Error adding file:', error);
        }
    }

    isImageFile(file) {
        return file.type.startsWith('image/');
    }

    formatFileSize(size) {
        const KB = 1024;
        const MB = KB * KB;
        if (size < KB) {
            return size + 'B';
        } else if (size < MB) {
            return (size / KB).toFixed(2) + 'KB';
        } else {
            return (size / MB).toFixed(2) + 'MB';
        }
    }

    updateHTML() {
        this.uiManager.updateHTML(this.files);
    }

    parseData(inputString) {
        const dataArray = inputString.map(item => {
            const [title, size, url, urlPrev, desc] = item.split(';');
            return { title, size, url, urlPrev, desc };
        });
        return dataArray;
    }

    getData() {
        return this.stringifyData(this.files);
    }

    stringifyData(dataArray) {
        return dataArray.map(item => `${item.title};${item.size};${item.url};${item.urlPrev};${item.desc}`);
    }
}


class DealLinks {
    constructor(container, bx24, dataLinks) {
        this.container = container;
        this.bx24 = bx24;

        this.links = this.parseDataLinks(dataLinks);

        this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);

        this.updateHTML();
        this.initHadler();
    }

    getData() {
        return this.stringifyData(this.links);
    }

    initHadler() {
        this.btnAdd.addEventListener('click', (event) => {
            this.addLink();
        })

        this.boxList.addEventListener('click', (event) => {
            const target = event.target;
            if (target.closest('.deal-files__file-row-del')) {
                const index = target.closest('.deal-files__file-row').dataset.index;
                this.links.splice(index, 1);
                this.updateHTML();
            }
        })
    }

    addLink() {
        const link = prompt('Введите ссылку', 'https://');
    
        if (link) {
            this.links.push({ url: link, description: '' });
            this.updateHTML();
        }
    }

    updateHTML() {
        let contentHTML = "";

        for (let i = 0; i < this.links.length; i++) {
            const { url, description } = this.links[i];
            contentHTML += `
                <div class="deal-files__file-row">
                    <div><div class="deal-files__file-row-numb">${i + 1}.</div></div>
                    <div><div class="deal-files__file-row-prev">🖼</div></div>
                    <div class="deal-files__file-row-url"><a href="${url}" target="_blank">${url}</a></div>
                    <div class="deal-files__file-row-desc"><input type="text" placeholder="описание ссылки (не обязательно)" value="${description}"></div>
                    <div class="deal-files__file-row-del"><i class="bi bi-dash-square"></i></div>
                </div>
            `;
        }

        this.boxList.innerHTML = contentHTML;
    }

    parseDataLinks(dataLinks) {
        const dataArray = dataLinks.map(item => {
            const [url, description] = item.split(';');
            return { url, description };
        });
    
        return dataArray;
    }

    stringifyData(dataArray) {
        const stringArray = dataArray.map(item => `${item.url};${item.description}`);
        return stringArray;
    }
}


export default class DealSources {
    constructor(container, bx24, yaDisk, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;

        this.boxFiles = this.container.querySelector(`.${CLASS_CONTAINER_FILES}`);
        this.boxLinks = this.container.querySelector(`.${CLASS_CONTAINER_LINKS}`);

        this.objLinks = null;
        this.objFiles = null;
    }

    init(dealData) {
        let links = dealData[FIELD_DEAL_SOURCE_LINKS] || [];
        let files = dealData[FIELD_DEAL_SOURCE_FILES] || [];
        this.objLinks = new DealLinks(this.boxLinks, this.bx24, links);
        this.objFiles = new DealFiles(this.boxFiles, this.bx24, this.yaDisk, this.dealId, files);
    }

    getChangedData() {
        return {
            [FIELD_DEAL_SOURCE_LINKS]: this.objLinks.getData(),
            [FIELD_DEAL_SOURCE_FILES]: this.objFiles.getData(),
        }
    }
}

































// class DealFiles {
//     constructor(container, bx24, yaDisk, dealId, dataFiles) {
//         this.container = container;
//         this.bx24 = bx24;
//         this.yaDisk = yaDisk;
//         this.dealId = dealId;
//         this.previewFolder = FOLDER_PREVIEW_ID;
//         this.fileManagerPrview = new FileManager(bx24);

//         this.files = this.parseData(dataFiles);

//         this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
//         this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);

//         this.updateHTML();
//         this.initHadler();
//     }

//     initHadler() {
//         // нажатие кнопки "Добавить файл"
//         this.btnAdd.addEventListener('click', (event) => {
//             let elemInput = event.target.parentNode.parentNode.querySelector("input");
//             elemInput.click();
//         });

//         // Пользователь подтвердил выбор файла
//         this.container.addEventListener('change', async (e) => {
//             if (e.target.classList.contains(CLASS_INPUT_FILE)) {
//                 let elemSpinner = this.btnAdd.querySelector(`.${CLASS_SPINNER}`);
//                 elemSpinner.classList.remove("d-none");
                
//                 for (let file of e.target.files) {
//                     await this.addFile(file);
//                 }

//                 elemSpinner.classList.add("d-none");
//             }
//         });

//         // Изменение описания файла
//         this.boxList.addEventListener('change', (event) => {
//             if (event.target.classList.contains('files-desc')) {
//                 const index = event.target.dataset.index;
//                 this.files[index].desc = event.target.value;
//             }
//         })

//         // Событие удаления файла
//         this.boxList.addEventListener('click', (event) => {
//             if (event.target.classList.contains('file-row-del')) {
//                 const index = event.target.dataset.index;
//                 this.files.splice(index, 1);
//                 this.updateHTML();
//             }
//         })

//     }

//     handleEventPreviewShow(event) {
//         const target = event.target;
//         if (target.tagName === 'DIV' && target.classList.contains('deal-files__file-row-prev') && target.dataset.link) {
//             const smile = target.textContent;
//             const previewLink = target.dataset.link;
//             const previewContainer = document.getElementById('tooltip');
//             previewContainer.innerHTML = `<div style="max-width: 250px;"><img src="${previewLink}" alt="${smile}" style="width: 100%;"></div>`;
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
//         return this.stringifyData(this.files);
//     }

//     updateHTML() {
//         let contentHTML = "";

//         this.removePreviewEventListeners();

//         for (let i = 0; i < this.files.length; i++) {
//             const { title, size, url, urlPrev, desc } = this.files[i];
//             contentHTML += `
//                 <div class="deal-files__file-row file-row">
//                     <div><div class="deal-files__file-row-numb">${i + 1}.</div></div>
//                     <div><div class="deal-files__file-row-prev file-row-prev" data-link="${urlPrev}">🖼</div></div>
//                     <div class="deal-files__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${title} (${size})">${title} (${size})</a></div>
//                     <div class="deal-files__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${desc}"></div>
//                     <div class="deal-files__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
//                 </div>
//             `;
//         }

//         this.boxList.innerHTML = contentHTML;

//         this.addPreviewEventListeners();
//     }

//     parseData(inputString) {
//         const dataArray = inputString.map(item => {
//             const [title, size, url, urlPrev, desc] = item.split(';');
//             return { title, size, url, urlPrev, desc };
//         });
    
//         return dataArray;
//     }

//     stringifyData(dataArray) {
//         const stringArray = dataArray.map(item => `${item.title};${item.size};${item.url};${item.urlPrev};${item.desc}`);
//         return stringArray;
//     }

//     async addFile(fileData) {
//         const fileName = fileData.name;
//         const fileSize = fileData.size;
        
//         let dirPath = `${this.dealId}`;
//         let link = await this.yaDisk.uploadFile(dirPath, fileName, fileData);
//         let previewUrl = null; 
//         if (this.isImageFile(fileData)) {
//             const filePreview = await convertAndCompressImage(fileData);
//             let preview = await this.fileManagerPrview.uploadFile(this.previewFolder, filePreview);
//             previewUrl = preview?.DOWNLOAD_URL;
//         }

//         if (!link) {
//             console.error("Error upload file to YandexDisk");
//             return;
//         }

//         this.files.push({
//             title: fileName,
//             size: this.getFormatingFileSize(fileSize),
//             url: link,
//             urlPrev: previewUrl,
//             desc: ""
//         });

//         this.updateHTML();
//         // BX24.fitWindow();
//     }

//     isImageFile(file) {
//         console.log("file.type = ", file.type);
//         console.log("file.type.startsWith('image/') = ", file.type.startsWith('image/'));
//         return file.type.startsWith('image/');
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
