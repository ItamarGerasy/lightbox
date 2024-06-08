// CompartmentsMap.ts
// Author: Itamar Gerasy
import { Compartment } from "./Compartment"

export class CompartmentsMap<CompartmentType  extends Compartment> {
    // this class is basically a map of modules with some extra properties
    private compartmentsMap: { [key: string]: CompartmentType } = {}
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    // Constructor for Compartments map
    // option 1: do not pass any argument, will initialize empty map
    // option 2: pass an array of compartments , in that case we assume all compartments 
    // id's on the array are different
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

    // removes a compartment from the compartments map and returns the compartment object
    // you can pass a compartment object or compartment id
    // if the compartment doesn't exist on the map an error will be thrown
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

    // removes several compartments from the map and returns an array of the removed compartments
    removeCompartments(compartments: Array<string|CompartmentType>): Array<CompartmentType>{
        const deletedCompartments: Array<CompartmentType> = []
        compartments.forEach(cm => deletedCompartments.push(this.removeCompartment(cm)))
        return deletedCompartments
    }

    // Method to check if a module with given id exists
    hasCompartment(compartmentId: string): boolean {
        return compartmentId in this.compartmentsMap
    }

    // Custom property to get the number of compartments
    get amount(): number {
        return this._amount
    }

    // get compartment with given id if doesn't exists throws an error
    get(id: string): Compartment {
        if(!this.hasCompartment(id)) {
            throw new Error(`[compartmentsMap] compartment with id: ${id} doesn't exsit on the map \n compartments map ids: ${Object.keys(this.compartmentsMap)}`)
        }
        return this.compartmentsMap[id]
    }

    set(id: string, newCompartment: CompartmentType): void {
        this._amount++
        this.lastId = id
        this.compartmentsMap[id] = newCompartment;
    }

    addCompartment(newCompartment: CompartmentType): void {
        if (this.hasCompartment(newCompartment.id)) {
            console.log(`Compartments map already have compartment with id: ${newCompartment.id}`)
            return
        }
        this.set(newCompartment.id, newCompartment)
        this._amount++ 
    }

    // function to generate new index based on all exsisting indexes for example
    // if the latest compartment added has the index of "c123" the function will return c124
    generateIndex(): string {
        if(!this.lastId){
            return "m1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `m${newHigestIndex}`
    }

    getParentCompartmentOfModuleById(id: string): Compartment | null {
        let parentModule = null
        Object.values(this.compartmentsMap).forEach((cm) => {
            if(cm.getModuleIndexById(id) !== -1){
                parentModule = cm
            }
        })
        return parentModule
    }

    // this function creates a colne/copy of the current ModulesMap
    clone(): CompartmentsMap<CompartmentType> {
        const compartmentsArr = Object.values(this.compartmentsMap).map(cm => cm.clone() as CompartmentType)
        return new CompartmentsMap<CompartmentType>(compartmentsArr)
    }
}