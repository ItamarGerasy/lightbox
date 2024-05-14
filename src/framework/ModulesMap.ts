// ModulesMap.ts
// Author: Itamar Gerasy
import { Module } from "./Module"
import { Switch } from "./Switch"
import { Dimensions, defaultModuleDimensions } from "../components/general/generalTypes";

/**
 * this class is basically a map of modules with some extra properties
 * also used as proxy to create and delete Modules in this project
 */
export class ModulesMap {
    private modulesMap: { [key: string]: Module } = {}
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    /**
     * Constructor for Modules map
     * 
     * option 1: do not pass any argument, will initialize empty map
     * 
     * option 2: pass an array of modules , in that case we assume all modules id's on the array are different
     * @param modulesArray 
     * @returns 
     */
    constructor(modulesArray?: Module[]){
        if(!modulesArray){
            return
        }

        modulesArray.forEach((md) => {
            this.modulesMap[md.id] = md;
            if (!this.lastId || md.id > this.lastId) {
                this.lastId = md.id;
            }
            this._amount++;
        });
    }

    /**
     * removes a module from the modules map
     * @param {string|Module} md module object or module ID
     * @returns the removed module object
     * @throws error if the module doesn't exist on the map
     */
    removeModule(md: string|Module): Module {
        let id = typeof md === 'string' ? md : md.id
        if (!this.hasModule(id)) {
            throw new Error(`[ModulesMap] module with id: ${id} cannot be deleted from map since it doesn't exists in the map`)
        }

        const moduleToDelete = this.modulesMap[id]
        // if the module we want to remove has the latest index
        // we set the latest index as the largest index before that
        if (moduleToDelete.id === this.lastId){
            const ids = Object.keys(this.modulesMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        delete this.modulesMap[id]
        this._amount--

        return moduleToDelete
    }

    /**
     * removes several modules from the map
     * @param {Array<string | Module>} modules array of modules IDs or module objects
     * @returns array of the removed modules
     */
    removeModules(modules: Array<string|Module>): Array<Module>{
        const deletedModules: Array<Module> = []
        modules.forEach(md => deletedModules.push(this.removeModule(md)))
        return deletedModules
    }

    /**
     * Method to check if a module with given id exists
     * @param {string} moduleId module ID 
     * @returns {boolean} true if module with this ID exists on the map
     */
    hasModule(moduleId: string): boolean {
        return moduleId in this.modulesMap
    }

    /**
     * @property the number of switches on this module
     */
    get amount(): number {
        return this._amount
    }

    /**
     * Gets module with given id
     * @param {string} id module ID 
     * @returns {Module} module object, if module with ID doesn't exists returns null
     */
    get(id: string): Module {
        if(!this.hasModule(id)) {
            throw new Error(`[ModulesMap] module with id: ${id} doesn't exsit on the map \n modules map ids: ${Object.keys(this.modulesMap)}`)
        }
        return this.modulesMap[id]
    }

    /**
     * Adding new module in the map with ID as key and module object as value
     * @param {string} id module ID
     * @param {ModuleType} newModule module object 
     */
    set(id: string, newModule: Module): void {
        if (this.hasModule(newModule.id)) {
            console.log(`Modules map already have module with id: ${newModule.id}`)
            return
        }
        this._amount++
        this.lastId = id
        this.modulesMap[id] = newModule;
    }

    /**
     * Function to generate new index based on all exsisting indexes.
     * If the latest module added has the index of "m123" the function will return "m124"
     * @returns {string} new index to assign to new module
     */
    generateIndex(): string {
        if(!this.lastId){
            return "m1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `m${newHigestIndex}`
    }

    /**
     * Finds a module containning a switch with given ID
     * @param {string} id ID of switch to look for 
     * @returns {Module} returns 
     */
    getParentModuleOfSwitchById(id: string): Module | null {
        let parentModule = null
        Object.values(this.modulesMap).forEach((md) => {
            if(md.getSwitchIndexById(id) !== -1){
                parentModule = md
            }
        })
        return parentModule
    }

    /**
     * Find the first module that can add a given switch
     * @param {Switch} sw switch object
     * @returns module object that can add the switch
     */
    getFirstModuleThatCanAddSwitch(sw: Switch): Module | null {
        Object.values(this.modulesMap).forEach((md) => {
            if(md.canAddSwitch(sw)){
                return md
            }
        })
        return null
    }

    /**
     * This function takes an array of identical size switch objects and checks if there is a single module who can fit all of them.
     * 
     * If there is one the fucntion will return this module object. If not this function will return null
     * @param {Switch[]} swArr Array of switch objects 
     * @returns Module object that can fit all switches. or null if no module can fit all switches
     */
    canOneModuleFitSwitches(swArr: Switch[]): Module | null {
        const freeSlotsMap = this.getModuleFreeSlotsMap(swArr)
        let moduleToReturn: Module | null = null
        freeSlotsMap.forEach((swNum, moduleId) => {
            if (moduleToReturn) return
            if (swNum >= swArr.length) moduleToReturn = this.get(moduleId)
        })
        return moduleToReturn 
    }

    /**
     * this function designed to be used after  canOneModuleFitSwitches() 
     * 
     * checks for the amount of switches that can be added to existing modules
     * @param {Switch[]} swArr  Array of switch objects
     * @returns the amount of switches that can be added to existing modules
     */
    canSomeModulesFitSwitches(swArr: Switch[]): number {
        const moduleFreeSlotsMap = this.getModuleFreeSlotsMap(swArr)
        let totalFreeSlots: number = 0 
        moduleFreeSlotsMap.forEach(swNum => totalFreeSlots += swNum)
        return totalFreeSlots
    }

    /**
     * Returns a map of free slots on each module in the map 
     * 
     * Assuming all switches are the same size
     * @param {Switch[]} swArr  Array of switch objects 
     * @returns A map, key is module id and value is number of switches it can add to itself.
     */
    getModuleFreeSlotsMap(swArr: Switch[]): Map<string, number> {
        const output = new Map()
        Object.values(this.modulesMap).forEach((mdObj) => {
            output.set(mdObj.id, mdObj.canAddSwitches(swArr)) 
        })
        return output
    }

    /**
     * This function will add the switches to available modules, might add them all to one module if he has the capacity
     * @param {Switch[]} swArr  Array of switch objects 
     * @returns true if operation was seccesful, else false
     */
    addSwitchesToSeveralModules(swArr: Switch[]): boolean {
        if(!this.canSomeModulesFitSwitches(swArr)) return false
        const freeSlotsMap = this.getModuleFreeSlotsMap(swArr)
        freeSlotsMap.forEach((freeSlots, moduleId) => {
            if(swArr.length === 0 || !freeSlots) return
            const switchesForModule = swArr.splice(0, freeSlots);
            const module = this.get(moduleId)
            module.addSwitches(switchesForModule)
        })
        return true
    }

    /**
     * this function creates a clone/copy of the current ModulesMap
     * @returns ModuleMap copy
     */
    clone(): ModulesMap {
        const modulesArr = Object.values(this.modulesMap).map(md => md.clone() as Module)
        return new ModulesMap(modulesArr)
    }
}