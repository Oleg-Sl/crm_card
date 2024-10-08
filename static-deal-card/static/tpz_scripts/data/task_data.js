import { Group } from './data_group.js';
import { Product } from './data_product.js';
import { Technology } from './data_technology.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
    SP_TECHOLOGY_TYPE_ID,
    SP_FILMS_ID,
    SP_WIDTH_ID,
    SP_LAMINATION_ID,
    SP_DEPENDENCE_ID,

    SP_WIDTH_FIELDS,
    SP_DEPENDENCE_FIELDS,

    FIELD_DEAL_TASK_ESTIMATE,
    FIELD_DEAL_TASK_COMMERC_OFFER,
} from '../parameters.js';


export class TaskData {
    constructor(bx24) {
        this.bx24 = bx24;
        // this.taskId = taskId;
        
        this.dealId = null;
        this.deal = null;
        this.currentUser = null;
        this.taskEstimate = null;
        this.taskCommOffer = null;
        this.fields = {
            group: null,
            product: null,
            technology: null
        };
        this.materials = {
            dependences: null,
            technologiesTypes: null,
            // films: null,
            widths: null,
            laminations: null
        };

        this.sourceFilesData = [];
        this.groupsData = [];
        this.observers = [];
    }

    async init() {
        await this.initFromDeal(this.dealId);
    }

    async initFromTask(taskId) {
        this.taskId = taskId;
        const taskData = await this.getTaskDataFromBx24();
        const dealId = this.extractNumberFromArray(taskData?.ufCrmTask);
        await this.initFromDeal(dealId);
    }

    async initFromDeal(dealId) {
        this.dealId = dealId;
        if (!this.dealId) {
            throw new Error("Deal id not found");
        }
        await this.initData();
        await this.updateTaskSettings();
    }

    setSources(sourceFilesData) {
        this.sourceFilesData = sourceFilesData;
        this.notify();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify() {
        this.observers.forEach(observer => observer.render());
    }

    async updateTaskSettings() {
        this.costOfFood = await this.bx24.getOptions('costOfFood');
        this.costOfLiving = await this.bx24.getOptions('costOfLiving');
        this.costOfTravel = await this.bx24.getOptions('costOfTravel');
    }


    // Работа с группами
    addGroup(groupData) {
        let objGroup = new Group(groupData);
        this.groupsData.push(objGroup);
        this.notify();
    }

    async createGroup(groupData) {
        let response = await this.bx24.callMethod('crm.item.add', {
            entityTypeId: SP_GROUP_ID,
            fields: { parentId2: this.dealId }
        });
        if (response?.item) {
            this.addGroup(response?.item);
            await this.createProduct(response?.item?.id);
        }

        return response?.item;
    }

    updateGroup(groupId, newData) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            group.update(newData);
            group.updateTripCost(this.costOfFood, this.costOfLiving, this.costOfTravel);
            this.notify();
        }
    }

    removeGroup(groupId) {
        const index = this.groupsData.findIndex(group => group.id == groupId);
        if (index !== -1) {
            this.groupsData.splice(index, 1);
            this.notify();
        }
    }


    // Работа с продуктами
    addProduct(productData) {
        let objProduct = new Product(productData); 
        for (let objGroup of this.groupsData) {
            if (objGroup.id == objProduct.parentId) {
                objGroup.addProduct(objProduct);
                this.notify();
            }
        }
    }

    async createProduct(groupId) {
        let response = await this.bx24.callMethod('crm.item.add', {
            entityTypeId: SP_PRODUCT_ID,
            fields: {[`parentId${SP_GROUP_ID}`]: groupId, parentId2: this.dealId}
        });

        if (response?.item) {
            this.addProduct(response?.item);
        }

        return response?.item;
    }

    updateProduct(groupId, productId, newData) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            
            if (product) {
                product.update(newData);
                this.notify();
            }
        }
    }

    async removeProduct(groupId, productId) {
        const group = this.groupsData.find(group => group.id == groupId);
        let cmd = { product: `crm.item.delete?entityTypeId=${SP_PRODUCT_ID}&id=${productId}` };
        if (group) {
            const product = group.products.find(product => product.id == productId);
            if (product) {
                group.removeProduct(product);
                if (group.products.length == 0) {
                    cmd.group = `crm.item.delete?entityTypeId=${SP_GROUP_ID}&id=${groupId}`
                    this.removeGroup(groupId);
                }
                this.notify();
            }
        }
        const response = await this.bx24.callBatchCmd(cmd);
        return response;
    }


    // Работа с технологиями
    addTechnology(technologyData) {
        let objTechnology = new Technology(technologyData);
        for (let objGroup of this.groupsData) {
            for (let objProduct of objGroup.products) {
                if (objProduct.id == objTechnology.parentId) {
                    objGroup.addTechnology(objTechnology);
                    this.notify();
                }
            }
        }
    }

    async createTechnology(productId) {
        let response = await this.bx24.callMethod('crm.item.add', {
            entityTypeId: SP_TECHOLOGY_ID,
            fields: {[`parentId${SP_PRODUCT_ID}`]: productId, parentId2: this.dealId}
        });
        if (response?.item) {
            this.addTechnology(response?.item);
        }

        return response?.item;
    }

    updateTechnology(groupId, productId, techId, newData) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            if (product) {
                const technology = product.technologies.find(tech => tech.id == techId);
                if (technology) {
                    technology.update(newData);
                    this.notify();
                }
            }
        }
    }

    async removeTechnology(groupId, productId, techId) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            if (product) {
                const technology = product.technologies.find(tech => tech.id == techId);
                if (technology) {
                    product.removeTechnology(technology);
                    this.notify();
                }
            }
        }
        const response = await this.bx24.callMethod('crm.item.delete', {
            entityTypeId: SP_TECHOLOGY_ID,
            id: techId
        });
        return response;
    }


    // Получение данных из битрикса
    async getTaskDataFromBx24() {
        const responseTask = await this.bx24.callMethod("tasks.task.get", {
            taskId: this.taskId,
            select: ['ID', 'TITLE', 'UF_CRM_TASK']
        });
        return responseTask?.result?.task;
    }

    async initData() {
        const data = await this.getDealData();
        this.deal = data?.deal || {};
        this.currentUser = data?.currentUser || {};
        this.taskEstimate = this.deal?.[FIELD_DEAL_TASK_ESTIMATE];
        this.taskCommOffer = this.deal?.[FIELD_DEAL_TASK_COMMERC_OFFER];

        this.fields = {
            group: data.fieldGroup,
            product: data.fieldProduct,
            technology: data.fieldTechnology
        };
        this.materials = {
            dependences: data.dependencesMaterial,
            technologiesTypes: data.technologiesTypes,
            // films: data.films,
            widths: data.widths,
            laminations: data.laminations
        };
        this.setData(data.groups, data.products, data.technologies);
    }

    async getDealData() {
        const cmd = {
            deal: `crm.deal.get?id=${this.dealId}`,
            currentUser: `user.current`,

            fieldGroup: `crm.item.fields?entityTypeId=${SP_GROUP_ID}`,
            fieldProduct: `crm.item.fields?entityTypeId=${SP_PRODUCT_ID}`,
            fieldTechnology: `crm.item.fields?entityTypeId=${SP_TECHOLOGY_ID}`,

            [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
            [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
            [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
           
            [SP_TECHOLOGY_TYPE_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_TYPE_ID}&select[]=id&select[]=title`,
            // [SP_FILMS_ID]: `crm.item.list?entityTypeId=${SP_FILMS_ID}&select[]=id&select[]=title`,
            [SP_WIDTH_ID]: `crm.item.list?entityTypeId=${SP_WIDTH_ID}&select[]=id&select[]=title&select[]=${SP_WIDTH_FIELDS.value}`,
            [SP_LAMINATION_ID]: `crm.item.list?entityTypeId=${SP_LAMINATION_ID}&select[]=id&select[]=title`,
            [SP_DEPENDENCE_ID]: `crm.item.list?entityTypeId=${SP_DEPENDENCE_ID}&select[]=id&select[]=title&select[]=${SP_DEPENDENCE_FIELDS.film}&select[]=${SP_DEPENDENCE_FIELDS.laminations}&select[]=${SP_DEPENDENCE_FIELDS.widths}`,
        };
        const response = await this.bx24.callMethod("batch.json", {
            halt: 0,
            cmd: cmd
        });
        console.log('response', response);
        let {productsRemain, technologiesRemain, laminationsRemain, widthsRemain} = await this.getAllTechnologyData(response?.result?.result_total);
        console.log('productsRemain, technologiesRemain, laminationsRemain, widthsRemain', productsRemain, technologiesRemain, laminationsRemain, widthsRemain);

        const data = response?.result?.result;
        
        const deal = data?.deal;
        const currentUser = data?.currentUser;
        const fieldGroup = data?.fieldGroup?.fields;
        const fieldProduct = data?.fieldProduct?.fields;
        const fieldTechnology = data?.fieldTechnology?.fields;

        const groups = data?.[SP_GROUP_ID]?.items || [];
        let products = data?.[SP_PRODUCT_ID]?.items || [];
        products = products.concat(productsRemain);
        let technologies = data?.[SP_TECHOLOGY_ID]?.items || [];
        technologies = technologies.concat(technologiesRemain);


        const technologiesType = data?.[SP_TECHOLOGY_TYPE_ID]?.items || [];
        // const films = data?.[SP_FILMS_ID]?.items || [];
        let widths = data?.[SP_WIDTH_ID]?.items || [];
        widths = widths.concat(widthsRemain);
        let laminations = data?.[SP_LAMINATION_ID]?.items || [];
        laminations = laminations.concat(laminationsRemain);
        const dependenceMaterial = data?.[SP_DEPENDENCE_ID]?.items || [];

        return {
            deal: deal,
            currentUser: currentUser,

            fieldGroup: fieldGroup,
            fieldProduct: fieldProduct,
            fieldTechnology: fieldTechnology,

            groups: groups,
            products: products,
            technologies: technologies,

            technologiesTypes: technologiesType,
            // films: films,
            widths: widths,
            laminations: laminations,
            dependencesMaterial: dependenceMaterial,
        };
    }

    async getAllTechnologyData(totals) {
        let cmd = {};
        let products = [];
        let technologies =[];
        let laminations = [];
        let widths = [];
        if (SP_PRODUCT_ID in totals) {
            for (let i = 50; i < totals[SP_PRODUCT_ID]; i += 50) {
                cmd[`${SP_PRODUCT_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}&start=${i}`;
            }
        }
        if (SP_TECHOLOGY_ID in totals) {
            for (let i = 50; i < totals[SP_TECHOLOGY_ID]; i += 50) {
                cmd[`${SP_TECHOLOGY_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}&start=${i}`;
            }
        }
        if (SP_WIDTH_ID in totals) {
            for (let i = 50; i < totals[SP_WIDTH_ID]; i += 50) {
                cmd[`${SP_WIDTH_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_WIDTH_ID}&select[]=id&select[]=title&select[]=${SP_WIDTH_FIELDS.value}&start=${i}`;
            }
        }
        if (SP_LAMINATION_ID in totals) {
            for (let i = 50; i < totals[SP_LAMINATION_ID]; i += 50) {
                cmd[`${SP_LAMINATION_ID}_${i}`] = `crm.item.list?entityTypeId=${SP_LAMINATION_ID}&select[]=id&select[]=title&start=${i}`;
            }
        }

        const response = await this.bx24.callMethod('batch', {
            halt: 0,
            cmd: cmd,
        });

        for (const key in response?.result?.result) {
            if (key.startsWith(SP_PRODUCT_ID)) {
                const productData = response?.result?.result[key]?.items;
                products = products.concat(productData);
            } else if (key.startsWith(SP_TECHOLOGY_ID)) {
                const technologyData = response?.result?.result[key]?.items;
                technologies = technologies.concat(technologyData);
            } else if (key.startsWith(SP_WIDTH_ID)) {
                const widthData = response?.result?.result[key]?.items;
                widths = widths.concat(widthData);
            } else if (key.startsWith(SP_LAMINATION_ID)) {
                const laminationsData = response?.result?.result[key]?.items;
                laminations = laminations.concat(laminationsData);
            }
        }
        return {
            productsRemain: products,
            technologiesRemain: technologies,
            laminationsRemain: laminations,
            widthsRemain: widths
        };
    }
    

    setData(groups, products, technologies) {
        this.groupsData = [];

        for (let group of groups) {
            this.addGroup(group);
        }

        for (let product of products) {
            this.addProduct(product);
        }

        for (let technology of technologies) {
            this.addTechnology(technology);
        }

        this.notify();
    }

    getChangedData() {
        let changed = [];

        for (const group of this.groupsData) {
            const changedGroupFields = group.getChangedFields();
            if (Object.keys(changedGroupFields).length !== 0) {
                changed.push(changedGroupFields);
            }
            for (const product of group.products) {
                const changedProductFields = product.getChangedFields();
                if (Object.keys(changedProductFields).length !== 0) {
                    changed.push(changedProductFields);
                }
                for (const technology of product.technologies) {
                    const changedTechnologyFields = technology.getChangedFields();
                    if (Object.keys(changedTechnologyFields).length !== 0) {
                        changed.push(changedTechnologyFields);
                    }
                }
            }
        }

        return changed;
    }

    extractNumberFromArray(arr) {
        for (let item of arr) {
            if (item.startsWith('D_')) {
                const number = parseInt(item.substring(2));
                if (!isNaN(number)) {
                    return number;
                }
            }
        }
        return null;
    }
}
