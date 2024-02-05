
const CLASS_LIST_ITEMS = "files-items-container";
const CLASS_BUTTON_ADD = "button-add-file";
const CLASS_INPUT_FILES = "choice-files-input";




export default class DealFiles {
    constructor(container, bx24, yaDisk, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        
        this.folderId = null;

        this.files = null;
        this.filesNew = []

        this.boxList = this.container.querySelector(`.${CLASS_LIST_ITEMS}`);
        this.btnAdd = this.container.querySelector(`.${CLASS_BUTTON_ADD}`);
        this.inputFiles = this.container.querySelector(`.${CLASS_INPUT_FILES}`);

        // this.updateHTML();
        this.initHadler();
    }

    setFolderId(folderId) {
        
    }

    initHadler() {
        // нажатие кнопки "Добавить файл"
        this.btnAdd.addEventListener('click', async (event) => {
            console.log("click btnAdd");
            let res = await this.bx24.files.addFolder(FOLDER_ACTS_ID, this.dealId);
            let folderId = res?.result?.ID;
            console.log(res);
            // let elemInput = event.target.parentNode.parentNode.querySelector("input");
            // elemInput.click();
        });

    //     // Пользователь подтвердил выбор файла
    //     this.container.addEventListener('change', async (e) => {
    //         if (e.target.classList.contains(CLASS_INPUT_FILE)) {
    //             let elemSpinner = this.btnAdd.querySelector(`.${CLASS_SPINNER}`);
    //             elemSpinner.classList.remove("d-none");
                
    //             for (let file of e.target.files) {
    //                 await this.addFile(file.name, file, file.size);
    //             }

    //             elemSpinner.classList.add("d-none");
    //         }
    //     });

    //     // Изменение описания файла
    //     this.boxList.addEventListener('change', (event) => {
    //         if (event.target.classList.contains('files-desc')) {
    //             const index = event.target.dataset.index;
    //             this.files[index].desc = event.target.value;
    //         }
    //     })

    //     // Событие удаления файла
    //     this.boxList.addEventListener('click', (event) => {
    //         if (event.target.classList.contains('file-row-del')) {
    //             const index = event.target.dataset.index;
    //             this.files.splice(index, 1);
    //             this.updateHTML();
    //         }
    //     })

    }

    // handleEventPreviewShow(event) {
    //     const target = event.target;
    //     if (target.tagName === 'DIV' && target.classList.contains('deal-files__file-row-prev') && target.dataset.link) {
    //         const smile = target.textContent;
    //         const previewLink = target.dataset.link;
    //         const previewContainer = document.getElementById('tooltip');
    //         previewContainer.innerHTML = `<img src="${previewLink}" alt="${smile}">`;
    //         previewContainer.style.height = '100px';
    //         previewContainer.style.width = '100px';
    //         previewContainer.style.visibility = "visible";
    //         previewContainer.style.left = event.pageX + 'px';
    //         previewContainer.style.opacity = '1';
    //         previewContainer.style.top = event.pageY + 'px';

    //     }

    // }

    // handleEventPreviewHide(_event) {
    //     const previewContainer = document.getElementById('tooltip');
    //     previewContainer.style.opacity = '0';
    //     previewContainer.style.visibility = "hidden";
    // }



    // addPreviewEventListeners() {
    //     const list = this.boxList.querySelectorAll('.file-row-prev');

    //     list.forEach(item => {
    //         item.addEventListener('mouseover', this.handleEventPreviewShow);
    //         item.addEventListener('mouseout', this.handleEventPreviewHide);
    //     });
    // }

    // removePreviewEventListeners() {
    //     const list = this.boxList.querySelectorAll('.file-row-prev');

    //     list.forEach(item => {
    //         item.removeEventListener('mouseover', this.handleEventPreviewShow);
    //         item.removeEventListener('mouseout', this.handleEventPreviewHide);
    //     });
    // }
      

    // getData() {
    //     return this.stringifyData(this.files);
    // }

    updateHTML() {
        let contentHTML = "";

        this.removePreviewEventListeners();

        for (let i = 0; i < this.files.length; i++) {
            const { title, size, url, urlPrev, desc } = this.files[i];
            contentHTML += `
                <div class="deal-files__file-row file-row">
                    <div><div class="deal-files__file-row-numb">${i + 1}.</div></div>
                    <div><div class="deal-files__file-row-prev file-row-prev" data-link="${urlPrev}">🖼</div></div>
                    <div class="deal-files__file-row-url" data-link="${url}"><a href="${url}" target="_blank" title="${title} (${size})">${title} (${size})</a></div>
                    <div class="deal-files__file-row-desc"><input class="files-desc" data-index="${i}" type="text" placeholder="описание файла (не обязательно)" value="${desc}"></div>
                    <div class="deal-files__file-row-del"><i class="bi bi-dash-square file-row-del" data-index="${i}"></i></div>
                </div>
            `;
        }

        this.boxList.innerHTML = contentHTML;

        this.addPreviewEventListeners();
    }

    // parseData(inputString) {
    //     const dataArray = inputString.map(item => {
    //         const [title, size, url, urlPrev, desc] = item.split(';');
    //         return { title, size, url, urlPrev, desc };
    //     });
    
    //     return dataArray;
    // }

    // stringifyData(dataArray) {
    //     const stringArray = dataArray.map(item => `${item.title};${item.size};${item.url};${item.urlPrev};${item.desc}`);
    //     return stringArray;
    // }

    // async addFile(fileName, fileData, fileSize) {
    //     let dirPath = `${this.dealId}`;
    //     console.log(dirPath, fileName, fileData, fileSize);
    //     let link = await this.yaDisk.uploadFile(dirPath, fileName, fileData);

    //     if (!link) {
    //         console.error("Error upload file to YandexDisk");
    //         return;
    //     }

    //     this.files.push({
    //         title: fileName,
    //         size: this.getFormatingFileSize(fileSize),
    //         url: link,
    //         urlPrev: link,
    //         desc: ""
    //     });

    //     this.updateHTML();
    //     // BX24.fitWindow();
    // }

    // getFormatingFileSize(size) {
    //     const KB = 1024;
    //     const MB = KB * KB;
    //     if (size < KB) {
    //         return size + "B";
    //     } else if (size < MB) {
    //         return (size / KB).toFixed(2) + "KB";
    //     } else {
    //         return (size / MB).toFixed(2) + "MB";
    //     }
    // }
}
