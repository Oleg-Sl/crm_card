

export default class SmartProcessMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async update(smartNumber, data) {
        if (data.length === 0) {
            return;
        }

        let reqPackage = {};
        for (const item of data) {
            const { id, ...fields } = item;
            reqPackage[id] = [
                "crm.item.update",
                {
                    entityTypeId: smartNumber,
                    id: id,
                    fields: fields
                }
            ];
        }

        const response = await this.bx24.batchMethod(reqPackage);
        return response;
    }

    async getFields(smartNumber) {
        let data = await this.bx24.callMethod("crm.item.fields", {
            "entityTypeId": smartNumber
        });
        return data.fields;
    }

//    async getList(smartNumber, dealId) {
//        const params = {
//            entityTypeId: smartNumber,
//            filter: { parentId2: dealId },
//            select: [
//                "id",
//                SMART_FIELDS.TITLE,
//                SMART_FIELDS.COUNT_PIECES,
//                SMART_FIELDS.TECHNOLOGY,
//                SMART_FIELDS.FILM,
//                SMART_FIELDS.LAMINATION,
//                SMART_FIELDS.WIDTH_FILM,
//                SMART_FIELDS.LINEAR_METER_PIECES,
//                SMART_FIELDS.SQUARE_METER_PIECES,
//                SMART_FIELDS.LINEAR_METER_TOTAL,
//                SMART_FIELDS.SQUARE_METER_TOTAL,
//                SMART_FIELDS.LINK_SRC,
//                SMART_FIELDS.CLIENT_FILES,
//                SMART_FIELDS.PREPRESS,
//                SMART_FIELDS.COMMENT
//            ],
//            start: -1
//        };
//
//        const data = await this.bx24.callMethod("crm.item.list", params);
//        return data.items;
//    }
    async add(entityTypeId, data) {
        let result = await this.bx24.callMethod("crm.item.add", {
            entityTypeId: smartNumber,
            fields: data
        });

        return result;
    }

    async delete(smartNumber, smartId) {
        let data = await this.bx24.callMethod("crm.item.delete", {
            entityTypeId: smartNumber,
            id: smartId
        });

        return data;
    }
}
