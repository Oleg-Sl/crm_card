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
} from '../../parameters.js';


export class TaskData {
    constructor(bx24, dealId) {
        this.bx24 = bx24;
        this.dealId = dealId;

        this.fields = {
            group: null,
            product: null,
            technology: null
        };
        this.materials = {
            dependences: null,
            technologiesTypes: null,
            films: null,
            widths: null,
            laminations: null
        };

        this.sourceFilesData = [];

        this.groupsData = [];
        this.observers = [];
    }

    async init() {
        await this.getDataFromBx24();

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
        this.observers.forEach(observer => observer.update());
    }

    addGroup(groupData) {
        let objGroup = new Group(groupData);
        this.groupsData.push(objGroup);
        this.notify();
    }

    addProduct(productData) {
        let objProduct = new Product(productData); 
        for (let objGroup of this.groupsData) {
            if (objGroup.id == objProduct.parentId) {
                objGroup.addProduct(objProduct);
                this.notify();
            }
        }
    }

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

    updateGroup(groupId, newData) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            group.update(newData);
            this.notify();
        }
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

    removeGroup(groupId) {
        const index = this.groupsData.findIndex(group => group.id == groupId);
        if (index !== -1) {
            this.groupsData.splice(index, 1);
            this.notify();
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

    async createCopyProduct(groupId, productId) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            if (product) {
                let fields = product.getFields();
                fields[`parentId${SP_GROUP_ID}`] = groupId;
                fields.parentId2 = this.dealId;
                let response = await this.bx24.callMethod('crm.item.add', {
                    entityTypeId: SP_PRODUCT_ID,
                    fields: fields,
                });
                if (response?.item) {
                    this.addProduct(response?.item);
                    await this.createCopyTechnology(groupId, productId, response?.item?.id);
                }
            }
        }
    }

    async createCopyTechnology(groupId, productIdOld, productIdNew) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productIdOld);
            if (product) {
                let cmd = {};
                const technologies = product.technologies;
                for (const ind in technologies) {
                    const technology = technologies[ind];
                    let fields = technology.getFields();
                    fields[`parentId${SP_PRODUCT_ID}`] = productIdNew;
                    fields.parentId2 = this.dealId;
                    cmd[ind] = `crm.item.add?entityTypeId=${SP_TECHOLOGY_ID}&${this.objectToQueryString(fields)}`;
                }
                let response = await this.bx24.callMethod('batch', {
                    halt: 0,
                    cmd: cmd,
                });
                for (const key in response?.result) {
                    const technologyData = response?.result[key]?.item;
                    this.addTechnology(technologyData);
                }
            }
        }
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

    objectToQueryString(obj) {
        const queryStringArray = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(obj[key]);
                queryStringArray.push(`fields[${encodedKey}]=${encodedValue}`);
            }
        }
        return queryStringArray.join('&');
    }

    async getDataFromBx24() {
        const cmd = {
            fieldGroup: `crm.item.fields?entityTypeId=${SP_GROUP_ID}`,
            fieldProduct: `crm.item.fields?entityTypeId=${SP_PRODUCT_ID}`,
            fieldTechnology: `crm.item.fields?entityTypeId=${SP_TECHOLOGY_ID}`,

            [SP_GROUP_ID]: `crm.item.list?entityTypeId=${SP_GROUP_ID}&filter[parentId2]=${this.dealId}`,
            [SP_PRODUCT_ID]: `crm.item.list?entityTypeId=${SP_PRODUCT_ID}&filter[parentId2]=${this.dealId}`,
            [SP_TECHOLOGY_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_ID}&filter[parentId2]=${this.dealId}`,
           
            [SP_TECHOLOGY_TYPE_ID]: `crm.item.list?entityTypeId=${SP_TECHOLOGY_TYPE_ID}&select[]=id&select[]=title`,
            [SP_FILMS_ID]: `crm.item.list?entityTypeId=${SP_FILMS_ID}&select[]=id&select[]=title`,
            [SP_WIDTH_ID]: `crm.item.list?entityTypeId=${SP_WIDTH_ID}&select[]=id&select[]=title&select[]=${SP_WIDTH_FIELDS.value}`,
            [SP_LAMINATION_ID]: `crm.item.list?entityTypeId=${SP_LAMINATION_ID}&select[]=id&select[]=title`,
            [SP_DEPENDENCE_ID]: `crm.item.list?entityTypeId=${SP_DEPENDENCE_ID}&select[]=id&select[]=title&select[]=${SP_DEPENDENCE_FIELDS.film}&select[]=${SP_DEPENDENCE_FIELDS.laminations}&select[]=${SP_DEPENDENCE_FIELDS.widths}`,
        };

        const data = await this.bx24.callBatchCmd(cmd);

        const fieldGroup = data?.fieldGroup?.fields;
        const fieldProduct = data?.fieldProduct?.fields;
        const fieldTechnology = data?.fieldTechnology?.fields;

        const groups = data?.[SP_GROUP_ID]?.items || [];
        const products = data?.[SP_PRODUCT_ID]?.items || [];
        const technologies = data?.[SP_TECHOLOGY_ID]?.items || [];

        const technologiesType = data?.[SP_TECHOLOGY_TYPE_ID]?.items || [];
        const films = data?.[SP_FILMS_ID]?.items || [];
        const widths = data?.[SP_WIDTH_ID]?.items || [];
        const laminations = data?.[SP_LAMINATION_ID]?.items || [];
        const dependenceMaterial = data?.[SP_DEPENDENCE_ID]?.items || [];

        this.fields = {
            group: fieldGroup,
            product: fieldProduct,
            technology: fieldTechnology
        };
        this.materials = {
            dependences: dependenceMaterial,
            technologiesTypes: technologiesType,
            // films: films,
            widths: widths,
            laminations: laminations
        };
        this.setData(groups, products, technologies);
    }
}

