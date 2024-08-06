// CompartmentsMap.ts
// Author: Itamar Gerasy
import { Compartment } from "./Compartment"
import { defaultCompartmentDimensions, Dimensions } from "../components/general/generalTypes"
import { Module } from "./Module"

/** this class is basically a map of modules with some extra properties */
export class CompartmentsMap {
    private compartmentsMap = new Map<string, Compartment>()
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    /**  Constructor for Compartments map
     * @param compratmentsArray optional - Array of compratments to create the map from
     * option 1: do not pass any argument, will initialize empty map
     * option 2: pass an array of compartments , in that case we assume all compartments 
     * id's on the array are different */
    constructor(compratmentsArray?: Compartment[]){
        if(!compratmentsArray){
            return
        }

        compratmentsArray.forEach((cm) => {
            this.set(cm)
            if (!this.lastId || cm.id > this.lastId) {
                this.lastId = cm.id;
            }
        });
    }

    /** removes a compartment from the compartments map and returns the compartment object
     * @param cm compartment object or compartment id
     * @returns the removed compartment object
     * @throws error if the compartment doesn't exist on the map */
    removeCompartment(cm: string|Compartment): Compartment {
        let id = typeof cm === 'string' ? cm : cm.id
        if (!this.hasCompartment(id)) {
            throw new Error(`[CompartmentsMap] compartment with id: ${id} cannot be deleted from map since it doesn't exists in the map`)
        }

        const compartmentToDelete = this.compartmentsMap.get(id)
        if (compartmentToDelete!.id === this.lastId){
            // if the compartment we want to remove has the latest index
            // we set the latest index as the largest index before that
            const ids = Object.keys(this.compartmentsMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        this.compartmentsMap.delete(id)
        this._amount--

        return compartmentToDelete!
    }

    /** removes several compartments from the map and returns an array of the removed compartments  
     * @param compartments - array of compartment objects/ids to remove
     * @returns array of the removed compartment objects
    */
    removeCompartments(compartments: Array<string|Compartment>): Array<Compartment>{
        const deletedCompartments: Array<Compartment> = []
        compartments.forEach(cm => deletedCompartments.push(this.removeCompartment(cm)))
        return deletedCompartments
    }

    /** Method to check if a module with given id exists  
     * @param compartmentId id of compartment to check
    */
    hasCompartment(compartmentId: string): boolean {
        return this.compartmentsMap.has(compartmentId)
    }

    /** number of compartments in the map */
    get amount(): number {
        return this._amount
    }

    /** get compartment with given id 
     * @param id compartment id to get
     * @throws error if doesn't exists throws an error  */
    get(id: string): Compartment {
        if(!this.hasCompartment(id)) {
            throw new Error(`[compartmentsMap] compartment with id: ${id} doesn't exsit on the map \n compartments map ids: ${Object.keys(this.compartmentsMap)}`)
        }
        return this.compartmentsMap.get(id)!
    }

    /**
     * Add a new compartment on the map property
     * @param newCompartment compartment obect to add
     */
    set(newCompartment: Compartment): void {
        this.compartmentsMap.set(newCompartment.id, newCompartment)
        this._amount++
    }

    /**
     * Adds new compartment to the our map
     * @param newCompartment compartment object to add
     */
    addCompartment(newCompartment: Compartment): void {
        if (this.hasCompartment(newCompartment.id)) {
            console.log(`Compartments map already have compartment with id: ${newCompartment.id}`)
            return
        }
        this.set(newCompartment)
        this.lastId = newCompartment.id
    }

    /**
     * Factory function for Compartment object, adds it to the map and returns it
     * @param feed Compartment feed, Default: compartment+number
     * @param moduleObjList Oredered modules array (not sorting order, orgenizational order), Default: []
     * @param name Optional - Comaprtment name, if not provided will name it compartment and a number, example: comaprtment5 
     * @param dimensions Compartment dimensions, Default: {@link defaultModuleDimensions}
     */
    createNewComaprtment({feed = "", moduleObjList=null, name, dimensions = defaultCompartmentDimensions}:{
        feed?: string,
        moduleObjList?: Module[] | null,
        name?: string 
        dimensions?: Dimensions
    }): Compartment {
        let newId = this.generateIndex() // new index of the shape: c23, c11, c123

        const compartmentParams = {
            id: `${newId}`, 
            name: name || `compartment${newId.substring(1)}`, 
            feed: feed,
            moduleObjList: moduleObjList || [],
            dimensions: dimensions
        }

        const cm = new Compartment(compartmentParams)
        this.addCompartment(cm)

        return cm
    }

    /**
     * Creates an array of comaprtment objects without any modules with same feed and dimensions to all compartments
     * 
     * They will have different IDs and names
     * @param compartmentsAmount amount of comaprtments to reate
     * @param feed Comaprtments feed, Default: ""
     * @param dimensions Comaprtments dimensions, Default: {@link defaultCompartmentDimensions}
     * @returns Array of new compartments objects
     */
    createNewComaprtmentsArray({compartmentsAmount, feed = "", dimensions = defaultCompartmentDimensions}:{
        compartmentsAmount: number, 
        feed?: string, 
        dimensions?: Dimensions
    }): Compartment[] {
        let params = {
            feed: feed, 
            dimensions: dimensions
        }

        let compsArr = new Array(compartmentsAmount).fill(null).map( _ => this.createNewComaprtment(params))

        return compsArr
    }

    /** function to generate new index based on all exsisting indexes for example
     * if the latest compartment added has the index of "c123" the function will return c124  
     * @returns new unused compartment index*/
    generateIndex(): string {
        if(!this.lastId){
            return "c1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `c${newHigestIndex}`
    }

    /**
     * finds the compartment holding the module with the given id
     * @param id id of module to find parent compartment of
     * @returns the parent compartment object of that module
     */
    getParentCompartmentOfModuleById(id: string): Compartment | null {
        let parentModule = null
        Object.values(this.compartmentsMap).forEach((cm) => {
            if(cm.getModuleIndexById(id) !== -1){
                parentModule = cm
            }
        })
        return parentModule
    }

    /**
     * Returns a map of free slots on each compartment in the map 
     * You can Provide either array of module object or height to check for
     * @param mdArr  Array of module objects, if provided will check only for given amount of modules
     * @param height height of compartments to check for, if provided will check to maximum amount each compartment can fit
     * @returns A map, key is compartment id and value is number of switches it can add to itself.
     */
    getCompartmentsFreeSlotsMap(
        mdArr?: Module[], 
        height?: number
    ): Map<string, number> 
    {
        if(!mdArr && !height){
            throw new Error(`[CompMap][getModuleFreeSlotsMap] please provide either modules array or height parameters`)
        }

        const output = new Map<string, number>()
        
        if(height !== undefined){
            this.compartmentsMap.forEach(cm => output.set(cm.id, Math.floor(cm.freeHeight / height)))
        } else {
            this.compartmentsMap.forEach(cm => output.set(cm.id, cm.canAddModules(mdArr!)) )
        }
        
        return output
    }

    /** this function creates a colne/copy of the current ModulesMap */ 
    clone(): CompartmentsMap {
        const compartmentsArr = Object.values(this.compartmentsMap).map(cm => cm.clone() as Compartment)
        return new CompartmentsMap(compartmentsArr)
    }

    /**
     * A function that calls a provided callback function once for each key/value pair in the CompartmentsMap object, in insertion order.
     *
     * @param {Compartment} value - The value of the current element being processed in the map.
     * @param {string} key - The key of the current element being processed in the map.
     * @param {Map<string, Compartment>} map - The map object being iterated.
     * @param {any} thisArg - An object to which the this keyword can refer in the callbackfn function.
     */
    forEach(callbackfn: (value: Compartment, key: string, map: Map<string, Compartment>) => void, thisArg?: any): void {
        this.compartmentsMap.forEach(callbackfn, thisArg)
    }
}