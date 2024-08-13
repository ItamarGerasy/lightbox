import { Dimensions, defaultCompartmentDimensions } from "../components/general/generalTypes";
import {Module} from "./Module"

export class Compartment {
    id: string
    name: string
    feed: string
    /** modulesObjList will be responsible to hold the compartment modules ids
        in a certain order that will be changed depending on user interactions */ 
    modulesObjList: Array<Module>
    _dimensions: Dimensions
    occupiedHeight: number = 0
    freeHeight: number

    /**Constructor for Comaprtment object, only id is required the rest are optional parameters and can be set to default
     * @param id compartment id of the format c<number> example: c1
     * @param name compartment name
     * @param feed compartment feed
     * @param modulesObjList list of module objects in the order of their appearnce on the compartment from top to bottom
     * @param dimensions object literal containning compartments dimensions: depth, width, height.
     */
    constructor({id, name, feed, modulesObjList, dimensions}:{
        id: string,
        name?: string,
        feed?: string,
        modulesObjList?: Array<Module>,
        dimensions?: Dimensions
    }){
        this.id = id
        this.name = name ? name : `compartment${this.id.substring(1)}`
        this.feed = feed ? feed : ""
        this._dimensions = dimensions ? dimensions : {...defaultCompartmentDimensions}
        this.modulesObjList = []
        this.freeHeight = this._dimensions.height

        if(modulesObjList) modulesObjList.forEach(md => this.addModule(md))
        
    }

    /**
     * @property dimesnsions, getter get's a copy of this property and not a pointer
     */
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

    get dimensions(): Dimensions{
        return {...this._dimensions}
    }

    /** number of modules in the compartment */
    get modulesAmount(): number{
        return this.modulesObjList.length
    }

    /** @returns returns a colne/copy of this current compartment */
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

    /**
     * Gets a module index on the modulesObjectsList by module id
     * @param moduleId id of the desired module
     * @returns the module index, or -1 if module doesn\t exsits on the compartment
     */
    getModuleIndexById(moduleId: string): number{
        let index =  this.modulesObjList.findIndex((md) => md.id === moduleId)
        if(index !== -1) return index   
        return -1
    }
    
    /**
     * @param moduleId id of the module
     * @returns True of module exsits on the comaprtment and False otherwise
     */
    hasModule(moduleId: string): boolean {
        return this.getModuleIndexById(moduleId) !== -1
    }

    /**
     * returns module object by module ID
     * @param moduleId module id
     * @returns module object if exists on the compartment else will return null
     */
    getModuleById(moduleId: string): Module | null {
        if(!this.hasModule(moduleId)){
            return null;
        }
        const moduleIndex = this.getModuleIndexById(moduleId)
        return this.modulesObjList[moduleIndex]
    }

    /** @returns a boolean indicating wether or not the compartment is full */
    isFull(): boolean {
        return this.freeHeight === 0;
    }

    /** checking if sizewize a module can be added 
     * @param md Module object*/ 
    canAddModule(md: Module): boolean{
        if(this.isFull() || this.hasModule(md.id)) return false
        return md.dimensions.height  <= this.freeHeight 
    }

    /** checking if can several modules can be added to comaprtment
    *   this method will return the amount of modules from the list it can add
    *   this function assumes all modules have the same dimensions
    *   @param modules an array of module objects
    *   @returns the number of modules that can be added to the compartment
    */
    canAddModules(modules: Array<Module>): number {
        if(this.isFull() || !modules || modules.length === 0) return 0
        return Math.floor(this.freeHeight / modules[0].dimensions.height)
    }

    /** a method that adds a module to the compartment
    * @param md Module object to add
    * @param index optional - indicate in which index to insert it in the ordered list, if not provided will add it to the end. it is used for the drag and drop functionality
    * @returns true successfull, else false
    */
    addModule(md: Module, index?: number): boolean{
        if(this.isFull() && !this.canAddModule(md)) return false
        if(!index && index !== 0){
            this.modulesObjList.push(md)
        }
        else {
            this.modulesObjList.splice(index, 0, md)
        }
        md.myCompartment = this
        this.freeHeight -= md.dimensions.height
        this.occupiedHeight += md.dimensions.height
        return true
    }

    /** a method that adds an array of modules to the compartment
    * @param mdArr Module objects array to add
    * @returns true successfull, else false
    */
    addModules(mdArr: Module[]): boolean{
        mdArr.forEach(md => {
            let succes = this.addModule(md)
            if(!succes) return false
        })
        return true
    }

    /** this method removes a module from the compartment and returns it
     * Throws an error if the module doesn't exists on the compartment
     * @param moduleId id of module to remove
     * @returns Module object that have been removed
     */
    removeModule(moduleId: string): Module{
        if(!this.hasModule(moduleId!)){
            throw new Error(`[Compartment ${this.name}] cannot delete module with id ${moduleId} because it doesn't exists on this compartment`)
        }
        const index = this.getModuleIndexById(moduleId)
        const md = this.modulesObjList.splice(index, 1)[0]
        md.myCompartment = undefined
        this.freeHeight += md.dimensions.height
        this.occupiedHeight -= md.dimensions.height
        return md
    }

    /** removes module at a given index on the modules objects list
     * @param index index of the module
     * @returns the removed module
     */
    removeModuleAtIndex(index: number): Module {
        if(index > this.modulesAmount - 1 ){
            throw new Error(`[Compartment ${this.name}] cannot delete module on index ${index} since there are only ${this.modulesAmount} modules on the compartment`)
        }
        const md = this.modulesObjList.splice(index, 1)[0]
        md.myCompartment = undefined
        this.freeHeight += md.dimensions.height
        this.occupiedHeight -= md.dimensions.height
        
        return md
    }

    /** Removing all modules from the compartment
     * @returns Array of removed module objects
     */
    removeAllModules(): Module[] {
        let moduleIds = this.modulesObjList.map(md => md.id)
        let removedModules: Module[] = []
        moduleIds.forEach(moduleId => {
            let mdObj = this.removeModule(moduleId)
            removedModules.push(mdObj)
        })
        return removedModules
    }
}