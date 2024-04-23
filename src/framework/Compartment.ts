import { Dimensions, defaultCompartmentDimensions } from "../components/general/generalTypes";
import {Module as ModuleType} from "./Module"

export class Compartment {
    id: string
    name: string
    feed: string
    // modulesObjList will be responsible to hold the compartment modules ids
    // in a certain order that will be changed depending on user interactions 
    modulesObjList: Array<ModuleType>
    _dimensions: Dimensions
    modulesAmount: number
    occupiedHeight: number = 0
    freeHeight: number

    constructor({id, name, feed, modulesObjList, dimensions}:{
        id: string,
        name: string,
        feed: string,
        modulesObjList?: Array<ModuleType>,
        dimensions?: Dimensions
    }){
        this.id = id
        this.name = name
        this.feed = feed
        this._dimensions = dimensions ? dimensions : defaultCompartmentDimensions
        this.modulesObjList = modulesObjList ? modulesObjList : []
        
        // setting myCompartment property of each module added to this compartment
        // and updating the occupied height and free height property 
        this.modulesObjList.forEach((md) => {
            md.myCompartment = this
            this.occupiedHeight += md.dimensions.height
        })
        this.freeHeight = this._dimensions.height - this.occupiedHeight
        this.modulesAmount = this.modulesObjList.length
    }

    // setter for the switch dimensions, you can set some or all of the dimensions
    set dimensions({width, height, depth}:{
        width?: number;
        height?: number;
        depth?: number;
    }){
        this._dimensions = {
            width: width ? width : this._dimensions.width,
            height: height ? height : this._dimensions.height,
            depth: depth ? depth : this._dimensions.depth,
        }
    }

    // returns a copy of the dimensions object of the compartment
    get dimensions(): Dimensions{
        return {...this._dimensions}
    }

    // this function return a colne/copy of this current compartment
    clone(): Compartment {
        const params = {
            id: this.id,
            name: this.name,
            feed: this.feed,
            modulesObjList: this.modulesObjList.map( md => md.clone()),
            dimensions: {...this.dimensions}
        }
        return new Compartment(params)
    }

    getModuleIndexById(moduleId: string): number{
        let index =  this.modulesObjList.findIndex((md) => md.id === moduleId)
        if(index !== -1) return index
        console.warn(`[Module ${this.id}] Couldn't find switch with id: ${moduleId} on module: ${this.name}`)       
        return -1
    }
    
    hasModule(moduleId: string): boolean {
        return this.getModuleIndexById(moduleId) !== -1
    }

    getModuleById(moduleId: string): ModuleType | null {
        if(!this.hasModule(moduleId)){
            return null;
        }
        const moduleIndex = this.getModuleIndexById(moduleId)
        return this.modulesObjList[moduleIndex]
    }

    isFull(): boolean {
        return this.freeHeight === 0;
    }

    // checking if sizewize a module can be added
    canAddModule(md: ModuleType): boolean{
        if(this.isFull()) return false
        return md.dimensions.height + this.occupiedHeight > this._dimensions.height 
    }

    // checking if can several modules can be added to module
    // this method will return the amount of modules from the list it can add
    // parameter: modules - and array of modules with the same dimensions
    canAddModules(modules: Array<ModuleType>): number {
        if(this.isFull() && !modules) return 0
        return Math.floor(this.freeHeight / modules[0].dimensions.height)
    }

    // a method that adds a module to the compartment
    // if successfull return true, else false
    addModule(md: ModuleType, index?: number): boolean{
        // index parameter indicate in which index to insert it in the ordered list
        // if not provided will add it to the end
        // it is used for the drag and drop functionality

        if(this.isFull() && !this.canAddModule(md)) return false
        if(!index && index !== 0){
            this.modulesObjList.push(md)
            this.modulesAmount++
            return true;
        }
        this.modulesObjList.splice(index, 0, md)
        md.myCompartment = this
        this.modulesAmount++
        return true
    }

    removeModule(moduleId: string): ModuleType{
        // this method removes a module from the compartment and returns it
        // if this index doesn't exist in the comaprtment returns null
        if(!this.hasModule(moduleId!)){
            throw new Error(`[Compartment ${this.name}] cannot delete module with id ${moduleId} because it doesn't exists on this compartment`)
        }
        const index = this.getModuleIndexById(moduleId)
        const md = this.removeModuleAtIndex(index)
        md!.myCompartment = undefined
        this.freeHeight += md!.dimensions.height
        this.occupiedHeight -= md!.dimensions.height
        this.modulesAmount--
        return md
    }

    removeModuleAtIndex(index: number): ModuleType {
        if(index > this.modulesAmount){
            throw new Error(`[Compartment ${this.name}] cannot delete module on index ${index} since there are only ${this.modulesAmount} modules on the compartment`)
        }
        const [md] = this.modulesObjList.splice(index, 1)
        this.modulesAmount--
        return md
    }

    removeAllModules(): ModuleType[] {
        let moduleIds = this.modulesObjList.map(md => md.id)
        let removedModules: ModuleType[] = []
        moduleIds.forEach(moduleId => {
            let mdObj = this.removeModule(moduleId)
            removedModules.push(mdObj)
        })
        return removedModules
    }
}

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