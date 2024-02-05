

export default class DealMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async getFields() {
        let data = await this.bx24.callMethod("crm.deal.fields", {});
        return data;
    }

    async get(dealId) {
        try {
            let data = await this.bx24.callMethod("crm.deal.list", {
                "filter": { "ID": dealId },
                "select": ["*", "UF_*",],
                start: -1,
            });
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

//    async update(dealId, data) {
//        let result = await bx24.callMethod("crm.deal.update", {
//            "id": dealId,
//            "fields": data
//        });
//        return result;
//    }
    async update(body) {
        let result = await bx24.callMethod("crm.deal.update", body);
        return result;
    }
}
