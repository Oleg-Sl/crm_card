import { Group } from './data_group.js';
import { Product } from './data_product.js';
import { Technology } from './data_technology.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,
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

    setSmartFields(fieldGroup, fieldProduct, fieldTechnology) {
        this.fields = {
            group: fieldGroup,
            product: fieldProduct,
            technology: fieldTechnology
        };
    }

    setMaterialsData(dependencesMaterial, technologiesTypes, films, widths, laminations) {
        this.materials = {
            dependences: dependencesMaterial,
            technologiesTypes: technologiesTypes,
            films: films,
            widths: widths,
            laminations: laminations
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
                // const techno
                await this.createCopyTechnology(groupId, productId);
                
                // let fields = product.getFields();
                // fields[`parentId${SP_GROUP_ID}`] = groupId;
                // fields.parentId2 = this.dealId;
                // let response = await this.bx24.callMethod('crm.item.add', {
                //     entityTypeId: SP_PRODUCT_ID,
                //     fields: fields,
                // });
                // if (response?.item) {
                //     this.addProduct(response?.item);
                // }
            }
        }
    }

    async createCopyTechnology(groupId, productId) {
        const group = this.groupsData.find(group => group.id == groupId);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            if (product) {
                let cmd = {};
                const technologies = product.technologies;
                for (const ind in technologies) {
                    const technology = technologies[ind];
                    let fields = technology.getFields();
                    fields[`parentId${SP_PRODUCT_ID}`] = productId;
                    fields.parentId2 = this.dealId;
                    cmd[ind + 1] = `crm.item.add?entityTypeId=${SP_TECHOLOGY_ID}&${this.objectToQueryString(fields)}`;
                }
                console.log(cmd);
                let response = await this.bx24.callMethod('batch', {
                    halt: 0,
                    cmd: cmd,
                });
                console.log(response);
                // if (response?.item) {
                //     this.addProduct(response?.item);
                // }
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
}

