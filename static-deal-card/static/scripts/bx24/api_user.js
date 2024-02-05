

export default class UserMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async getCurrent() {
        return await this.bx24.callMethod("user.current", {});
    }

    async getData(users_ids) {
        let reqPackage = {};
        for (let user_id of users_ids) {
            if (user_id) {
                reqPackage[user_id] = ["user.get", {"ID": user_id}];
            }
        }
        let userData = await this.bx24.batchMethod(reqPackage);
        return userData;
    }

    async search(body) {
        return await this.bx24.callMethod("user.search", body);
    }

    async get(body) {
        return await this.bx24.callMethod("user.get", body);
    }

    async getDepartments() {
        let response = await this.bx24.callMethod("department.get");          // получение списка подразделений из Битрикс
        return response;
    }
}