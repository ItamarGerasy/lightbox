import { Dimensions, defaultModuleDimensions } from "../components/general/generalTypes";
import { Compartment as CompartmentType } from "../framework/Compartment"
import {Switch as SwitchType} from "./Switch"

export class Module {
    id: string
    name: string
    feed: string
    // switchesObjList will be responsible to hold the module switches ids
    // in a certain order that will be changed depending on user interactions 
    switchesObjList: Array<SwitchType>
    _dimensions: Dimensions
    switchesAmount: number
    occupiedWidth: number = 0
    freeWidth: number
    private _myCompartment: CompartmentType | undefined = undefined  // Compartment object which conatins this Switch

    constructor({id, name, feed, switchesObjList, dimensions}:{
        id: string,
        name: string,
        feed: string,
        switchesObjList?: Array<SwitchType>,
        dimensions?: Dimensions
    }){
        this.id = id
        this.name = name
        this.feed = feed
        this._dimensions = dimensions ? dimensions : defaultModuleDimensions
        this.switchesObjList = switchesObjList ? switchesObjList : []
        
        // setting myModule property of each switch added to this module
        // and updating the occupied width and free width property 
        this.switchesObjList.forEach((sw) => {
            sw.myModule = this
            this.occupiedWidth += sw.dimensions.width
        })
        this.freeWidth = this._dimensions.width - this.occupiedWidth
        this.switchesAmount = this.switchesObjList.length
    }

    get myCompartment(): CompartmentType | undefined{
        return this._myCompartment
    }

    set myCompartment(compartment: CompartmentType | undefined){
        this._myCompartment = compartment
    }

    // setter for the switch dimensions, you can set some or all of the dimensions
    set dimensions({width, height, depth}:{
        width?: number;
        height?: number;
        depth?: number;
    }){
        // in case you want to decrease the width of a module so some of the switches inside it will no longer fit in
        if(width && this.occupiedWidth > width){
            throw new Error(`[Module ${this.id}] cannot change width to be smaller since there are too many switches in the module \n
            will not perform any action`)
        }
        // in case you want to decrease the height of a module which have switches in it already
        if(height && height < this._dimensions.height && this.switchesAmount !== 0){
            throw new Error(`[Module ${this.id}] cannot change height of module which already populated with switches`)
        }
        // in case you want to decrease the depth of a module which have switches in it already
        if(depth && depth < this._dimensions.depth && this.switchesAmount !== 0){
            throw new Error(`[Module ${this.id}] cannot change depth of module which already populated with switches`)
        }
        this._dimensions = {
            width: width ? width : this._dimensions.width,
            height: height ? height : this._dimensions.height,
            depth: depth ? depth : this._dimensions.depth,
        }
    }

    // returns a copy of the dimensions object of the module
    get dimensions(): Dimensions{
        return {...this._dimensions}
    }

    // this function return a colne/copy of this current module
    clone(): Module {
        const params = {
            id: this.id,
            name: this.name,
            feed: this.feed,
            switchesObjList: this.switchesObjList.map( sw => sw.clone()),
            dimensions: {...this.dimensions}
        }
        const cloneModule = new Module(params)
        cloneModule.myCompartment = this.myCompartment
        return cloneModule
    }

    hasSwitch(switchId: string): boolean {
        return this.getSwitchIndexById(switchId) !== -1
    }

    getSwitchIndexById(switchId: string): number{
        let index =  this.switchesObjList.findIndex((sw) => sw.id === switchId)
        if(index !== -1) return index
        console.warn(`[Module ${this.id}] Couldn't find switch with id: ${switchId} on module: ${this.name}`)       
        return -1
    }

    getSwitchById(switchId: string): SwitchType | null {
        if(!this.hasSwitch(switchId)){
            return null;
        }
        const switchIndex = this.getSwitchIndexById(switchId)
        return this.switchesObjList[switchIndex]
    }

    isFull(): boolean {
        return this.freeWidth === 0;
    }

    // checking if sizewize a switch can be added
    canAddSwitch(sw: SwitchType): boolean {
        if(this.isFull()) return false
        return sw.dimensions.width + this.occupiedWidth < this._dimensions.width 
    }

    // checking if can several switches can be added to module
    // this method will return the amount of switches from the list it can add
    // parameter: switches - and array of switches with the same dimensions
    canAddSwitches(switches: Array<SwitchType>): number {
        if (!switches) return 0
        if (this.isFull()) return 0
        return Math.floor(this.freeWidth / (switches[0].dimensions.width * switches.length))
    }

    // a method that adds a switch to the module
    // if successfull return true, else false
    addSwitch(sw: SwitchType, index?: number): void{
        // index parameter indicate in which index to insert it in the ordered list
        // if not provided will add it to the end
        // it is used for the drag and drop functionality
        if(!this.canAddSwitch(sw)) {
            throw new Error(`[${module.id}] couldn't add switch since the module is either full or switch is bigger then free space on module \n
            Please make sure to use moduleObj.canAddSwitch() and recive the value true before calling addSwitch()`)
        }
        if(!index || index === 0){
            this.switchesObjList.push(sw)
        } else {
            this.switchesObjList.splice(index, 0, sw)
        }
        sw.myModule = this
        this.switchesAmount++
    }

    // a method to add switches to the module
    // if successfull return true, else false
    addSwitches(swArr: Array<SwitchType>): void {
        let amountOfSwitchesAbleToAdd = this.canAddSwitches(swArr)
        if (amountOfSwitchesAbleToAdd < swArr.length) {
            throw new Error(`[Module ${this.id}] module.addSwitches - cannot add switches since tried to add ${swArr.length} switches, and can add onlt ${amountOfSwitchesAbleToAdd}`)
        }
        swArr.forEach(swObj => this.addSwitch(swObj))    
    }

    removeSwitch(switchId: string): SwitchType | null{
        // this method removes a switch from the module and returns it
        // if this index doesn't exist in the switch returns null
        if(!this.hasSwitch(switchId)){
            throw new Error(`[Modul ${this.name}] cannot delete switch with id ${switchId} because it doesn't exists on this module`)
        }
        const index = this.getSwitchIndexById(switchId)
        const sw = this.removeSwitchAtIndex(index)
        sw!.myModule = undefined
        this.freeWidth += sw!.dimensions.width
        this.occupiedWidth -= sw!.dimensions.width
        this.switchesAmount--
        return sw
    }

    removeSwitchAtIndex(index: number): SwitchType {
        if(index > this.switchesAmount){
            throw new Error(`[Module ${this.name}] cannot delete switch on index ${index} since there are only ${this.switchesAmount} switches on the module`)
        }
        const [sw] = this.switchesObjList.splice(index, 1)
        sw.myModule = undefined
        this.switchesAmount--
        return sw
    }

    toString(): string {
        return `[Module ${this.name}] id: ${this.id} has ${this.switchesAmount} switches`
    }
}

export class ModulesMap<ModuleType  extends Module> {
    // this class is basically a map of modules with some extra properties
    private modulesMap: { [key: string]: ModuleType } = {}
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    // Constructor for Modules map
    // option 1: do not pass any argument, will initialize empty map
    // option 2: pass an array of modules , in that case we assume all modules 
    // id's on the array are different
    constructor(modulesArray?: ModuleType[]){
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

    // removes a module from the modulees map and returns the module object
    // you can pass a module object or module id
    // if the module doesn't exist on the map an error will be thrown
    removeModule(md: string|ModuleType): ModuleType {
        let id = typeof md === 'string' ? md : md.id
        if (!this.hasModule(id)) {
            throw new Error(`[ModulesMap] module with id: ${id} cannot be deleted from map since it doesn't exists in the map`)
        }

        const moduleToDelete = this.modulesMap[id]
        if (moduleToDelete.id === this.lastId){
            // if the module we want to remove has the latest index
            // we set the latest index as the largest index before that
            const ids = Object.keys(this.modulesMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        delete this.modulesMap[id]
        this._amount--

        return moduleToDelete
    }

    // removes several modules from the map and returns an array of the removed modules
    removeModules(modules: Array<string|ModuleType>): Array<ModuleType>{
        const deletedModules: Array<ModuleType> = []
        modules.forEach(md => deletedModules.push(this.removeModule(md)))
        return deletedModules
    }

    // Method to check if a module with given id exists
    hasModule(moduleId: string): boolean {
        return moduleId in this.modulesMap
    }

    // Custom property to get the number of modules
    get amount(): number {
        return this._amount
    }

    // get module with given id if doesn't exists returns null
    get(id: string): Module {
        if(!this.hasModule(id)) {
            throw new Error(`[ModulesMap] module with id: ${id} doesn't exsit on the map \n modules map ids: ${Object.keys(this.modulesMap)}`)
        }
        return this.modulesMap[id]
    }

    set(id: string, newModule: ModuleType): void {
        this._amount++
        this.lastId = id
        this.modulesMap[id] = newModule;
    }

    addModule(newModule: ModuleType): void {
        if (this.hasModule(newModule.id)) {
            console.log(`Modules map already have module with id: ${newModule.id}`)
            return
        }
        this.set(newModule.id, newModule)
        this._amount++ 
    }

    // function to generate new index based on all exsisting indexes for example
    // if the latest module added has the index of "m123" the function will return m124
    generateIndex(): string {
        if(!this.lastId){
            return "m1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `m${newHigestIndex}`
    }

    getParentModuleOfSwitchById(id: string): ModuleType | null {
        let parentModule = null
        Object.values(this.modulesMap).forEach((md) => {
            if(md.getSwitchIndexById(id) !== -1){
                parentModule = md
            }
        })
        return parentModule
    }

    getFirstModuleThatCanAddSwitch(sw: SwitchType): ModuleType | null {
        Object.values(this.modulesMap).forEach((md) => {
            if(md.canAddSwitch(sw)){
                return md
            }
        })
        return null
    }

    canOneModuleFitSwitches(swArr: Array<SwitchType>): ModuleType | null {
        // this function takes an array of identical size switch objects and checks if there
        // is a single module who can fit all of them.
        // if there is one the fucntion will return this module object
        // if not this function will return null
        const freeSlotsMap = this.getModuleFreeSlotsMap(swArr)
        let moduleToReturn: Module | null = null
        freeSlotsMap.forEach((swNum, moduleId) => {
            if (moduleToReturn) return
            if (swNum >= swArr.length) moduleToReturn = this.get(moduleId)
        })
        return moduleToReturn
    }

    canSomeModulesFitSwitches(swArr: Array<SwitchType>): number {
        // this function designed to be used after  canOneModuleFitSwitches() 
        // checks for the amount of switches that can be added to existing switches
        const moduleFreeSlotsMap = this.getModuleFreeSlotsMap(swArr)
        let totalFreeSlots: number = 0 
        moduleFreeSlotsMap.forEach(swNum => totalFreeSlots += swNum)
        return totalFreeSlots
    }

    getModuleFreeSlotsMap(swArr: Array<SwitchType>): Map<string, number> {
        // this function recives an array of switch objects and returns a map
        // key is module id and value is number of switches it can add to itself
        // assuming all switches are the same size
        const output = new Map()
        Object.values(this.modulesMap).forEach((mdObj) => {
            output.set(mdObj.id, mdObj.canAddSwitches(swArr)) 
        })
        return output
    }

    addSwitchesToSeveralModules(swArr: Array<SwitchType>): boolean {
        // this function will add the switches to available modules, might add them all to one module if he has the capacity
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

    // this function creates a colne/copy of the current ModulesMap
    clone(): ModulesMap<ModuleType> {
        const modulesArr = Object.values(this.modulesMap).map(md => md.clone() as ModuleType)
        return new ModulesMap<ModuleType>(modulesArr)
    }
}