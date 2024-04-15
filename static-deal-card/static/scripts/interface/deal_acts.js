
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
    constructor(container, bx24, yaDisk, dealId, FIELD, folderYaDisk) {
        this.container = container;
        this.dealId = dealId;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.folderYaDisk = folderYaDisk;

        this.folderId = null;
        this.files = null;
        this.field = null;

        this.yaDisk = new YandexDiskManager(yaDisk);
        this.ui = new UIManager(container, this);
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
        const dirPath = `${this.dealId}/${this.folderYaDisk}`;
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
            [this.field]: this.files.length > 0 ? this.stringifyData(this.files) : [''],
        };
    }
}
