import { Group } from './data_group.js';
import { Product } from './data_product.js';
import { Technology } from './data_technology.js';
import {
    SP_GROUP_ID,
    SP_PRODUCT_ID,
    SP_TECHOLOGY_ID,

    SP_GROUP_FIELDS,
    SP_PRODUCT_FIELDS,
    SP_TECHOLOGY_FIELDS,

    SP_WIDTH_FIELDS,
    SP_DEPENDENCE_FIELDS,
} from '../parameters.js';


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

        console.log(" this.groupsData = ", this.groupsData);
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
        console.log('objTechnology = ', objTechnology);
        for (let objGroup of this.groupsData) {
            for (let objProduct of objGroup.products) {
                if (objProduct.id == objTechnology.parentId) {
                    console.log('objProduct = ', objProduct);
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
        console.log("removeGroup = ", groupId);
        const index = this.groupsData.findIndex(group => group.id == groupId);
        if (index !== -1) {
            this.groupsData.splice(index, 1);
            this.notify();
        }
    }

    removeProduct(groupId, productId) {
        console.log("removeProduct = ", groupId, productId);
        const group = this.groupsData.find(group => group.id == groupId);
        console.log("group = ", group);
        if (group) {
            const product = group.products.find(product => product.id == productId);
            console.log("product = ", product);
            if (product) {
                group.removeProduct(product);
                this.notify();
            }
        }
    }

    removeTechnology(groupId, productId, techId) {
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
    }

    async createGroup(groupData) {
        let response = await this.bx24.callMethod('crm.item.add', {
            entityTypeId: SP_GROUP_ID,
            fields: { parentId2: this.dealId }
        });
        console.log("response create group = ", response);
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
        console.log("response create technology = ", response);
        if (response?.item) {
            console.log("this.addTechnology = ", response?.item);
            this.addTechnology(response?.item);
        }

        return response?.item;
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
}

