

// Парсит и возвращает число из строки типа "22|RUB"
export function parseAmount(inputString) {
    try {
        const parts = inputString.split("|");
        const amount = parseFloat(parts[0]);
        return amount;
    } catch (error) {
        return null;
    }
}


// Парсит дату из строки типа "2024-01-29T03:00:00+03:00"
export function parseDateFromDatetimeString(dateString) {
    if (!dateString) {
        return null;
    }
    try {
        const dateObject = new Date(dateString);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
        const day = dateObject.getDate();
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null;
        }
        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        return formattedDate;
    } catch (error) {
        return null;
    }
}


// Возвращает true или false в зависимости от занчения поля да/нет в битрикс
export function convertYNToBoolean(input) {
    if (input === "Y" || input === "y") {
        return true;
    } else if (input === "N" || input === "n") {
        return false;
    } else {
        return null;
    }
}

