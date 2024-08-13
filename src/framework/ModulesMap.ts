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
    private modulesMap: Map<string, Module> = new Map()
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
            this.modulesMap.set(md.id, md)
            if (!this.lastId || md.id > this.lastId) {
                this.lastId = md.id;
            }
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

        const moduleToDelete = this.modulesMap.get(id)
        this.modulesMap.delete(id)
        // if the module we want to remove has the latest index
        // we set the latest index as the largest index before that
        if (moduleToDelete!.id === this.lastId){
            const ids = Array.from(this.modulesMap.keys())
            ids.sort()
            this.lastId = ids.pop()
        }

        return moduleToDelete!
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
        return this.modulesMap.has(moduleId)
    }

    /**
     * @property the number of switches on this module
     */
    get amount(): number {
        return this.modulesMap.size
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
        return this.modulesMap.get(id)!
    }

    /**
     * Adding new module in the map with ID as key and module object as value
     * @param {string} id module ID
     * @param {ModuleType} newModule module object 
     */
    set(newModule: Module): void {
        if (this.hasModule(newModule.id)) {
            console.log(`Modules map already have module with id: ${newModule.id}`)
            return
        }
        this.lastId = newModule.id
        this.modulesMap.set(newModule.id, newModule)
    }

    /**
     * Function to generate new index based on all exsisting indexes.
     * If the latest module added has the index of "m123" the function will return "m124"
     * @returns {string} new index to assign to new module
     */
    generateIndex(): string {
        let maxIdNumber = 0;

        this.modulesMap.forEach((_, id) => {
            const idNumber = parseInt(id.substring(1), 10)
            if (idNumber > maxIdNumber) {
                maxIdNumber = idNumber
            }
        })

        let newHighestId = `m${maxIdNumber + 1}`
        return newHighestId;
    }

    /**
     * Finds a module containning a switch with given ID
     * @param {string} id ID of switch to look for 
     * @returns {Module} returns 
     */
    getParentModuleOfSwitchById(id: string): Module | null {
        let parentModule = null
        this.modulesMap.forEach((md) => {
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
    getFirstModuleThatCanAddSwitch(sw: Switch): Module | undefined {
        let module = undefined
        this.modulesMap.forEach((md) => {
            if(md.canAddSwitch(sw)) module = md
        })
        return module
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
        this.modulesMap.forEach(md => output.set(md.id, md.canAddSwitches(swArr)) )
        return output
    }

    /**
     * This function will add the switches to available modules, might add them all to one module if he has the capacity
     * this function if succesfull will empty swArr.
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
     * Factory function for Module object, adds it to the map and returns it
     * @param feed Modules feed, Default: module+number
     * @param switchesObjList Oredered switch array (not sorting order, orgenizational order), Default: []
     * @param name Optional - Mdule name, if not provided will name it module and a number, example: module5 
     * @param dimensions Modules dimensions, Default: {@link defaultModuleDimensions}
     */
    createNewModule({feed = "", switchesObjList=null, name, dimensions = defaultModuleDimensions}:{
        feed?: string,
        switchesObjList?: Switch[] | null,
        name?: string
        dimensions?: Dimensions
    }): Module {
        let newId = this.generateIndex() // new index of the shape: m23, m11, m123

        const moduleParams = {
            id: `${newId}`, 
            name: name || `module${newId.substring(1)}`, 
            feed: feed,
            switchesObjList: switchesObjList || [],
            dimensions: dimensions
        }
        const md = new Module(moduleParams)
        this.set(md)
        return md
    }

    /**
     * Creates an array of module objects without any switches with same feed and dimensions to all modules
     * 
     * They will have different IDs and names
     * @param modulesAmount amount of modules to reate
     * @param feed Modules feed, Default: ""
     * @param dimensions Modules dimensions, Default: {@link defaultModuleDimensions}
     * @returns Array of new module objects
     */
    createNewModulesArray({modulesAmount, feed = "", dimensions = defaultModuleDimensions}:{
        modulesAmount: number, 
        feed?: string, 
        dimensions?: Dimensions
    }): Module[] {
        let params = {
            feed: feed, 
            dimensions: dimensions
        }

        let modulesArr = new Array(modulesAmount).fill(null).map( _ => this.createNewModule(params))

        return modulesArr
    }
    

    /**
     * this function creates a clone/copy of the current ModulesMap
     * @returns ModuleMap copy
     */
    clone(): ModulesMap {
        const modulesArr: Module[] = []
        this.modulesMap.forEach((md) => modulesArr.push(md.clone()))
        return new ModulesMap(modulesArr)
    }

    /**
     * A function that calls a provided callback function once for each key/value pair in the ModulesMap object, in insertion order.
     *
     * @param {Module} value - The value of the current element being processed in the map.
     * @param {string} key - The key of the current element being processed in the map.
     * @param {Map<string, Module>} map - The map object being iterated.
     * @param {any} thisArg - An object to which the this keyword can refer in the callbackfn function.
     */
    forEach(callbackfn: (value: Module, key: string, map: Map<string, Module>) => void, thisArg?: any): void {
        this.modulesMap.forEach(callbackfn, thisArg)
    }
}