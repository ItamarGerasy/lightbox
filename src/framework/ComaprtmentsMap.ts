// CompartmentsMap.ts
// Author: Itamar Gerasy
import { Compartment } from "./Compartment"

/** this class is basically a map of modules with some extra properties */
export class CompartmentsMap<CompartmentType  extends Compartment> {
    private compartmentsMap: { [key: string]: CompartmentType } = {}
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    /**  Constructor for Compartments map
     * @param compratmentsArray optional - Array of compratments to create the map from
     * option 1: do not pass any argument, will initialize empty map
     * option 2: pass an array of compartments , in that case we assume all compartments 
     * id's on the array are different */
    constructor(compratmentsArray?: CompartmentType[]){
        if(!compratmentsArray){
            return
        }

        compratmentsArray.forEach((cm) => {
            this.compartmentsMap[cm.id] = cm;
            if (!this.lastId || cm.id > this.lastId) {
                this.lastId = cm.id;
            }
            this._amount++;
        });
    }

    /** removes a compartment from the compartments map and returns the compartment object
     * @param cm compartment object or compartment id
     * @returns the removed compartment object
     * @throws error if the compartment doesn't exist on the map */
    removeCompartment(cm: string|CompartmentType): CompartmentType {
        let id = typeof cm === 'string' ? cm : cm.id
        if (!this.hasCompartment(id)) {
            throw new Error(`[CompartmentsMap] compartment with id: ${id} cannot be deleted from map since it doesn't exists in the map`)
        }

        const compartmentToDelete = this.compartmentsMap[id]
        if (compartmentToDelete.id === this.lastId){
            // if the compartment we want to remove has the latest index
            // we set the latest index as the largest index before that
            const ids = Object.keys(this.compartmentsMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        delete this.compartmentsMap[id]
        this._amount--

        return compartmentToDelete
    }

    /** removes several compartments from the map and returns an array of the removed compartments  
     * @param compartments - array of compartment objects/ids to remove
     * @returns array of the removed compartment objects
    */
    removeCompartments(compartments: Array<string|CompartmentType>): Array<CompartmentType>{
        const deletedCompartments: Array<CompartmentType> = []
        compartments.forEach(cm => deletedCompartments.push(this.removeCompartment(cm)))
        return deletedCompartments
    }

    /** Method to check if a module with given id exists  
     * @param compartmentId id of compartment to check
    */
    hasCompartment(compartmentId: string): boolean {
        return compartmentId in this.compartmentsMap
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
        return this.compartmentsMap[id]
    }

    /**
     * Add a new compartment on the map property
     * @param newCompartment compartment obect to add
     */
    set(newCompartment: CompartmentType): void {
        this.compartmentsMap[newCompartment.id] = newCompartment;
    }

    /**
     * Adds new compartment to the our map
     * @param newCompartment compartment object to add
     */
    addCompartment(newCompartment: CompartmentType): void {
        if (this.hasCompartment(newCompartment.id)) {
            console.log(`Compartments map already have compartment with id: ${newCompartment.id}`)
            return
        }
        this.set(newCompartment)
        this.lastId = newCompartment.id
        this._amount++ 
    }

    /** function to generate new index based on all exsisting indexes for example
     * if the latest compartment added has the index of "c123" the function will return c124  
     * @returns new unused compartment index*/
    generateIndex(): string {
        if(!this.lastId){
            return "c1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `m${newHigestIndex}`
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

    /** this function creates a colne/copy of the current ModulesMap */ 
    clone(): CompartmentsMap<CompartmentType> {
        const compartmentsArr = Object.values(this.compartmentsMap).map(cm => cm.clone() as CompartmentType)
        return new CompartmentsMap<CompartmentType>(compartmentsArr)
    }
}