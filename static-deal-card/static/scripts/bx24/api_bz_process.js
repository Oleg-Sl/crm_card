
export default class BzProcessMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async startForDeal(bizprocId, dealId, params) {
        const data = await this.bx24.callMethod("bizproc.workflow.start", {
            TEMPLATE_ID: bizprocId,
            DOCUMENT_ID: ['crm', 'CCrmDocumentDeal', `DEAL_${dealId}`],
            PARAMETERS: params
        });

        return data;
    }
}
