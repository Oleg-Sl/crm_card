
const CLASS_LIST_ITEMS = "files-items-container";
const CLASS_BUTTON_ADD = "button-add-file";
const CLASS_INPUT_FILES = "choice-files-input";
const CLASS_SPINNER = "spinner-border";


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
        this.btnAdd.addEventListener('click', (event) => this.showFileInput(event));
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
        let contentHTML = "";

        this.removePreviewEventListeners();
        for (let i = 0; i < files.length; i++) {
            const { title, size, url, urlPrev, desc } = files[i];

            contentHTML += `
                <div class="deal-file-row">
                    <div><div class="deal-file-row-numb">${i + 1}.</div></div>
                    <div><div class="deal-file-row-prev"><i class="bi bi-file-earmark-pdf-fill file-row-prev" data-link="${url}"></i></div></div>
                    <div class="deal-file-row-url" data-link="${url}">
                        <a href="${url}" target="_blank" title="${title} (${size})">${title} (${size})</a>
                    </div>
                    <div class="deal-file-row-del">
                        <i class="bi bi-dash-square file-row-del" data-index="${i}"></i>
                    </div>
                </div>
            `;
        }

        this.boxList.innerHTML = contentHTML;

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

    getFormattedFileSize(size) {
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
}


export default class DealActs {
    constructor(container, bx24, yaDisk, dealId, FIELD) {
        this.container = container;
        this.dealId = dealId;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.folderId = null;
        this.files = null;
        this.field = null;

        // this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        // this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);
        // this.inputFiles = this.container.querySelector(`.${CLASS_INPUT_FILES}`);


        this.yaDisk = new YandexDiskManager(yaDisk);
        this.ui = new UIManager(container, this);

        // this.initHandler();
    }

    async init(dataList, field) {
        this.field = field;
        this.files = [];
        if (Array.isArray(dataList)) {
            this.files = this.parseData(dataList);
        }
        this.updateHTML();
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
        const link = await this.yaDisk.uploadFile(dirPath, fileName, fileData);

        if (!link) {
            console.error('Error uploading file to YandexDisk');
            return;
        }

        this.files.push({
            title: fileName,
            size: this.formatFileSize(fileSize),
            url: link,
            urlPrev: '',
            desc: '',
        });

        this.updateHTML();
    }

    updateHTML() {
        this.ui.updateHTML(this.files);
    }    

    parseData(inputString) {
        const dataArray = inputString.map(item => {
            const [title, size, url, urlPrev, desc] = item.split(';');
            return { title, size, url, urlPrev, desc };
        });

        return dataArray;
    }

    getData() {
        return {
            [this.field]: this.stringifyData(this.files)
        };
    }

    stringifyData(dataArray) {
        return dataArray.map(item => `${item.title};${item.size};${item.url};${item.urlPrev};${item.desc}`);
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

    getChangedData() {
        return {
            [this.field]: this.stringifyData(this.files)
        };
    }
}


























// class FileManager {
//     constructor(bx24) {
//         this.bx24 = bx24;
//     }

//     async uploadFile(folderId, file) {
//         const result = await this.bx24.files.uploadFile(folderId, file);
//         return result?.result;
//     }

//     async removeFile(fileId) {
//         const result = await this.bx24.files.removeFile(fileId);
//         return result;
//     }

//     async getFiles(folderId) {
//         const result = await this.bx24.files.getFilesFromFolder(folderId);
//         return result?.result || [];
//     }
// }


// class UIManager {
//     constructor(container) {
//         this.container = container;
//     }

//     updateHTML(files) {
//         let contentHTML = "";

//         this.removePreviewEventListeners();

//         for (let i = 0; i < files.length; i++) {
//             const { ID, NAME, SIZE, DOWNLOAD_URL, DETAIL_URL } = files[i];
//             const sizeStr = this.getFormattedFileSize(+SIZE);

//             contentHTML += `
//                 <div class="deal-file-row">
//                     <div><div class="deal-file-row-numb">${i + 1}.</div></div>
//                     <div><div class="deal-file-row-prev"><i class="bi bi-file-earmark-pdf-fill file-row-prev" data-link="${DOWNLOAD_URL}"></i></div></div>
//                     <div class="deal-file-row-url" data-link="${DETAIL_URL}">
//                         <a href="${DETAIL_URL}" target="_blank" title="${NAME} (${sizeStr})">${NAME} (${sizeStr})</a>
//                     </div>
//                     <div class="deal-file-row-del">
//                         <i class="bi bi-dash-square file-row-del" data-index="${i}"></i>
//                     </div>
//                 </div>
//             `;
//         }

//         this.container.innerHTML = contentHTML;

//         this.addPreviewEventListeners();
//     }


//     handleEventPreviewShow(event) {
//         let target = event.target;
//         if (target && target.classList.contains('file-row-prev')) {
//             const smile = target.textContent;
//             const previewLink = target.dataset.link;
//             const previewContainer = document.getElementById('tooltip');
//             previewContainer.innerHTML = `<img src="${previewLink}" alt="${smile}">`;
//             previewContainer.style.minHeight = '100px';
//             previewContainer.style.minWidth = '100px';
//             previewContainer.style.visibility = "visible";
//             previewContainer.style.left = event.pageX + 2 + 'px';
//             previewContainer.style.opacity = '1';
//             previewContainer.style.top = event.pageY + 2 + 'px';
//             previewContainer.querySelector('img').style.maxHeight = '100px';
//             previewContainer.querySelector('img').style.maxWidth = '150px';
//             // console.log(previewContainer);

//         }
//     }

//     handleEventPreviewHide(event) {
//         const previewContainer = document.getElementById('tooltip');
//         previewContainer.style.opacity = '0';
//         previewContainer.style.visibility = "hidden";
//     }

//     addPreviewEventListeners() {
//         const list = this.container.querySelectorAll('.file-row-prev');
//         list.forEach(item => {
//             item.addEventListener('mouseover', this.handleEventPreviewShow);
//             item.addEventListener('mouseout', this.handleEventPreviewHide);
//         });
//     }

//     removePreviewEventListeners() {
//         const list = this.container.querySelectorAll('.file-row-prev');

//         list.forEach(item => {
//             item.removeEventListener('mouseover', this.handleEventPreviewShow);
//             item.removeEventListener('mouseout', this.handleEventPreviewHide);
//         });
//     }

//     getFormattedFileSize(size) {
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


// export default class DealActs {
//     constructor(container, bx24, yaDisk, dealId, FIELD) {
//         this.container = container;
//         this.dealId = dealId;
//         this.folderId = null;
//         this.files = null;

//         this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
//         this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);
//         this.inputFiles = this.container.querySelector(`.${CLASS_INPUT_FILES}`);


//         this.fileManager = new FileManager(bx24);
//         this.uiManager = new UIManager(this.boxList);

//         this.initHandler();
//     }

//     async init(dealData, folderId) {
//         this.folderId = await this.getFolder(folderId);
//         this.files = await this.fileManager.getFiles(this.folderId);
//         this.uiManager.updateHTML(this.files);
//     }

//     initHandler() {
//         let activeUploads = 0;

//         this.btnAdd.addEventListener('click', async (event) => {
//             this.inputFiles.click();
//         });

//         this.inputFiles.addEventListener('change', async (e) => {
//             const elemSpinner = this.btnAdd.querySelector(`.${CLASS_SPINNER}`);
//             elemSpinner.classList.remove("d-none");
//             activeUploads++;

//             try {
//                 const uploadedFiles = [];
//                 for (const file of e.target.files) {
//                     const result = await this.fileManager.uploadFile(this.folderId, file);
//                     uploadedFiles.push(result);
//                 }

//                 this.files.push(...uploadedFiles);
//                 this.uiManager.updateHTML(this.files);
//             } catch (error) {
//                 console.error('Ошибка загрузки акта:', error);
//             } finally {
//                 activeUploads--;

//                 if (activeUploads === 0) {
//                     elemSpinner.classList.add("d-none");
//                 }
//             }
//         });

//         this.boxList.addEventListener('click', async (event) => {
//             if (event.target.classList.contains('file-row-del')) {
//                 this.handleFileRemoval(event);
//             }
//         })
//     }

//     async handleFileRemoval(event) {
//         const index = event.target.dataset.index;
//         const file = this.files[index];

//         try {
//             await this.fileManager.removeFile(file.ID);
//             this.files.splice(index, 1);
//             this.uiManager.updateHTML(this.files);
//         } catch (error) {
//             console.error('Ошибка удаления акта:', error);
//         }
//     }

//     async getFolder(folderId) {
//         // let folderId = dealData?.[FIELD_FOLDER_ACTS_ID];
//         if (!folderId) {
//             let parentFolder = await this.bx24.getActsFolderId();
//             let res = await this.bx24.files.addFolder(parentFolder, this.dealId);
//             folderId = res?.result?.ID;
//         }

//         return folderId;
//     }

// }

// 
// export default class DealActs {
//     constructor(container, bx24, yaDisk, dealId) {
//         this.container = container;
//         this.bx24 = bx24;
//         this.yaDisk = yaDisk;
//         this.dealId = dealId;
//         this.folderId = null;
//         this.files = null;

//         this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
//         this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);
//         this.inputFiles = this.container.querySelector(`.${CLASS_INPUT_FILES}`);

//         this.initHadler();
//     }

//     async init(dealData) {
//         this.folderId = await this.getFolder(dealData);
//         // [{DETAIL_URL: .., DOWNLOAD_URL: .., SIZE: .., ID: .., NAME: ..}, ...] 
//         this.files = await this.getFiles(this.folderId);

//         this.updateHTML();
//     }

//     initHadler() {
//         // нажатие кнопки "Добавить файл"
//         this.btnAdd.addEventListener('click', async (event) => {
//             this.inputFiles.click();
//         });

//         // Пользователь подтвердил выбор файла
//         this.inputFiles.addEventListener('change', async (e) => {
//             const elemSpinner = this.btnAdd.querySelector(`.${CLASS_SPINNER}`);
//             try {
//                 elemSpinner.classList.remove("d-none");

//                 for (const file of e.target.files) {
//                     const result = await this.bx24.files.uploadFile(this.folderId, file);
//                     this.files.push(result?.result);
//                     this.updateHTML();
//                 }
//             } catch (error) {
//                 console.error('Error uploading file:', error);
//             } finally {
//                 elemSpinner.classList.add("d-none");
//             }
//         });

//         // Событие удаления файла
//         this.boxList.addEventListener('click', async (event) => {
//             if (event.target.classList.contains('file-row-del')) {
//                 this.handleFileRemoval(event);
//             }
//         })

//     }

//     async handleFileRemoval(event) {
//         const index = event.target.dataset.index;
//         const file = this.files[index];
//         console.log("Remove file = ", file);
    
//         try {
//             const resDel = await this.bx24.files.removeFile(file.ID);
//             console.log("resDel = ", resDel);
//             this.files.splice(index, 1);
//             this.updateHTML();
//         } catch (error) {
//             console.error('Error removing file:', error);
//         }
//     }

//     async getFiles(folderId) {
//         try {
//             const res = await this.bx24.files.getFilesFromFolder(folderId);
//             return res?.result || [];
//         } catch (error) {
//             console.error('Error getting files:', error);
//             return [];
//         }
//     }

//     async getFolder(dealData) {
//         let folderId = dealData?.[FIELD_FOLDER_ACTS_ID];
//         if (!folderId) {
//             let parentFolder = await this.bx24.getActsFolderId();
//             let res = await this.bx24.files.addFolder(parentFolder, this.dealId);
//             folderId = res?.result?.ID;
//         }

//         return folderId;
//     }

//     updateHTML() {
//         let contentHTML = "";

//         for (let i = 0; i < this.files.length; i++) {
//             const { ID, NAME, SIZE, DOWNLOAD_URL, DETAIL_URL } = this.files[i];
//             const sizeStr = this.getFormatingFileSize(+SIZE);

//             contentHTML += `
//                 <div class="deal-acts__file-row">
//                     <div><div class="deal-acts__file-row-numb">${i + 1}.</div></div>
//                     <div><div class="deal-acts__file-row-prev"><i class="bi bi-file-earmark-pdf-fill"></i></div></div>
//                     <div class="deal-acts__file-row-url" data-link="${DETAIL_URL}"><a href="${DETAIL_URL}" target="_blank" title="${NAME} (${sizeStr})">${NAME} (${sizeStr})</a></div>
//                     <div class="deal-acts__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
//                 </div>
//             `;
//         }

//         this.boxList.innerHTML = contentHTML;
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
