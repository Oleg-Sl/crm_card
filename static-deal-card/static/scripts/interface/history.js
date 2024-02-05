

export default class ChangeHistory {
    constructor() {
        this.records = [];
    }

    addToHistory(fieldId, oldValue, newValue) {
        const record = {
            fieldId,
            oldValue,
            newValue,
            timestamp: new Date().toLocaleString(),
        };
        this.records.push(record);
    }

    removeFromHistory(fieldId) {
        const index = this.records.findIndex(record => record.fieldId === fieldId);
        if (index !== -1) {
            this.records.splice(index, 1);
        }
    }

    updateHistory(fieldId, oldValue, newValue) {
        const existingRecord = this.findRecordById(fieldId);
    
        // Функция для сравнения двух массивов
        const arraysEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);
    
        if (existingRecord) {
            if (arraysEqual(newValue, existingRecord.oldValue)) {
                this.removeFromHistory(fieldId);
            } else {
                existingRecord.newValue = newValue;
                existingRecord.timestamp = new Date().toLocaleString();
            }
        } else {
            // Если записи нет, добавляем новую
            this.addToHistory(fieldId, oldValue, newValue);
        }
    }
    

    findRecordById(fieldId) {
        return this.records.find(record => record.fieldId === fieldId);
    }

    getHistory() {
        return this.records;
    }

    clearHistory() {
        this.records = [];
    }
}

// export default class DealDescription extends ChangeHistory {
//     constructor(container) {
//         super();
//         this.container = container;

//         // ... (остальные поля класса)
//     }

//     // ... (остальные методы)

//     updateChangeHistory(fieldId, oldValue, newValue) {
//         super.updateHistory(fieldId, oldValue, newValue);
//     }
// }
