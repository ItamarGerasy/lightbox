import { Dimensions, defaultModuleDimensions } from "../components/general/generalTypes";
import { Compartment as CompartmentType } from "../framework/Compartment"
import { Switch } from "./Switch"

/** class to represent a module containning switches in  a certain oreder */
export class Module {
    id: string
    name: string
    feed: string
    /** switchesObjList will be responsible to hold the module switches ids
     * in a certain order that will be changed depending on user interactions  */
    switchesObjList: Array<Switch>
    _dimensions: Dimensions
    switchesAmount: number
    occupiedWidth: number = 0
    freeWidth: number
    /**Compartment object which conatins this Switch*/
    private _myCompartment: CompartmentType | undefined = undefined  

    /**
     * Creates an instance of a module with specified properties.
     *
     * @param {string} id - The unique identifier for the module, example: m1, m123, m346.
     * @param {string} name - The name of the module.
     * @param {string} feed - The feed for the module.
     * @param {Array<Switch>} [switchesObjList] - An optional array of switch objects to be added to the module. Each switch should have a `dimensions` property containing its width.
     * @param {Dimensions} [dimensions] - An optional dimensions object specifying the width of the module. If not provided, a default value is used.
     */
    constructor({id, name, feed, switchesObjList, dimensions}:{
        id: string,
        name: string,
        feed: string,
        switchesObjList?: Switch[],
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

    /**
     * Dimesnions object containning width, height and depth of the module
     * 
     * @property {Object} dimensions - Dimenisons object to set the module dimensions
     * @property {number} dimensions.width  
     * @property {number} dimensions.height 
     * @property {number} dimensions.depth 
     * 
     * @throws {error} throw an error if you try to set new width which is smaller then the already occupied width the function will 
     */
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

    /**
     * @returns a copy of the dimensions object of the module 
     */
    get dimensions(): Dimensions{
        return {...this._dimensions}
    }

    /**
     *  @returns this function return a colne/copy of this current module
     */
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

    /** 
     * @param switchId id of the desired switch
     * @returns the switch index on the ordered list by switch ID  
    */
    getSwitchIndexById(switchId: string): number{
        let index =  this.switchesObjList.findIndex((sw) => sw.id === switchId)
        if(index !== -1) return index
        console.warn(`[Module ${this.id}] Couldn't find switch with id: ${switchId} on module: ${this.name}`)       
        return -1
    }

    /** 
     * @param switchId id of the desired switch
     * @returns switch object by switch ID if switch doesn't exists on the module will return null
     */
    getSwitchById(switchId: string): Switch | null {
        if(!this.hasSwitch(switchId)){
            return null;
        }
        const switchIndex = this.getSwitchIndexById(switchId)
        return this.switchesObjList[switchIndex]
    }

    isFull(): boolean {
        return this.freeWidth === 0;
    }

    /**
     * checking if sizewize a switch can be added 
     * @param sw switch object
     * @returns true if the switch can be added to the module
     */
    canAddSwitch(sw: Switch): boolean {
        if(this.isFull()) return false
        return sw.dimensions.width + this.occupiedWidth < this._dimensions.width 
    }

    /**
     * checking if can several switches can be added to module
     *  
     * @param switches an array of switches with the same dimensions
     * @returns The number of switches that can be added to the module. Returns 0 if the module is full or if the `switches` array is empty.
     */
    canAddSwitches(switches: Array<Switch>): number {
        if (!switches) return 0
        if (this.isFull()) return 0
        return Math.floor(this.freeWidth / switches[0].dimensions.width)
    }

    /**
     * a method that adds a single switch to the module
     * @param sw switch object to add to the module
     * @param index index parameter indicate in which index to insert the switch object in the ordered list. if not provided will add it to the end. it is used for the drag and drop functionality
     * @returns true if operation was succesful, and false if it wasn't
     */
    addSwitch(sw: Switch, index?: number): void{
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
        this.freeWidth -= sw.dimensions.width
        this.occupiedWidth += sw.dimensions.width
    }

    /**
     * a method to add several switches to the module, they will be added to the end of the oredered list
     * @param swArr array of switches object to be added
     * @returns if successfull return true, else false
     */
    addSwitches(swArr: Array<Switch>): void {
        let amountOfSwitchesAbleToAdd = this.canAddSwitches(swArr)
        if (amountOfSwitchesAbleToAdd < swArr.length) {
            throw new Error(`[Module ${this.id}] module.addSwitches - cannot add switches since tried to add ${swArr.length} switches, and can add onlt ${amountOfSwitchesAbleToAdd}`)
        }
        swArr.forEach(swObj => this.addSwitch(swObj))    
    }

    /**
     * this method removes a switch from the module and returns it
     * @param switchId id of the switch 
     * @returns switch object. if switch with this index doesn't exist in the switch returns null
     */
    removeSwitch(switchId: string): Switch | null{
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

    /**
     * Removes switch object from the module in a spesific index from the list
     * @param {number} index switch index on the ordered list
     * @returns {Switch} the removed switch object
     * @throws an error if no switch object exists on this index
     */
    removeSwitchAtIndex(index: number): Switch {
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