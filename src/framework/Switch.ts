import { Dimensions } from "../components/general/generalTypes";
import { Module as ModuleType } from "./Module"

export class Switch {
    id: string
    name: string
    description: string
    prefix: string   // prefix of the switch, of specific format. example: 3X16 first number is the size, second number is the Voltage of the switch
    readonly size: number
    feed?: string
    private _dimensions: Dimensions
    private _myModule!: ModuleType | undefined // Module object which conatins this Switch

    constructor({id, name, description, prefix, dimensions, feed}:{
        id: string, 
        name: string, 
        description: string,
        prefix: string,
        dimensions: Dimensions, 
        feed?: string
    }){
        this.id = id
        this.name = name
        this.description = description
        this.prefix = prefix
        this.size = Number(prefix.charAt(0)) // always gonna be a single digit
        this._dimensions = {...dimensions}
        this.feed = feed ? feed : ""
    }

    // setter for myModule property, be sure to pass a pointer and not a copy in order
    // for removeSwitch to do it job well (removing the switch from the module)
    // important notice: this function doesn't add the switch itself to the module property
    // make sure to use module properties for that
    set myModule(module: ModuleType | undefined){
        this._myModule = module
    }

    // returns a pointer to the module object which contains this switch
    get myModule(): ModuleType | undefined{
        return this._myModule
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

    // returns a copy of the dimensions object of the switch
    get dimensions(): Dimensions{
        return {...this._dimensions}
    }

    removeSwitch(): void {
        console.log(`[${this.name}] id: ${this.id} is going to be deleted`)
        this.id = "-1"
        if(this._myModule){
            this._myModule.removeSwitch(this.id)
        }
    }

    // this function return a colne/copy of this current switch
    clone(): Switch {
        const params = {
            id: this.id,
            name: this.name,
            description: this.description,
            prefix: this.prefix,
            dimensions: {...this.dimensions},
            feed: this.feed
        }
        const cloneSwitch = new Switch(params)
        cloneSwitch.myModule = this.myModule
        return cloneSwitch
    }
}

export class SwitchesMap<SwitchType extends Switch> {
    // this class is basically a map of switches with some extra properties
    private switchesMap: { [key: string]: SwitchType } = {}
    private _amount: number = 0
    lastId: string | undefined = undefined
    
    // Constructor for Switches map
    // option 1: do not pass any argument, will initialize empty map
    // option 2: pass an array of switches , in that case we assume all switches 
    // id's on the array are different
    constructor(switchesArray?: SwitchType[]){
        if(!switchesArray){
            return
        }

        switchesArray.forEach((sw) => {
            this.switchesMap[sw.id] = sw;
            if (!this.lastId || sw.id > this.lastId) {
                this.lastId = sw.id;
            }
            this._amount++;
        });
    }

    // removes a switch from the switches map and returns the switch object
    // you can pass a switch object or switch id
    // if the switch doesn't exist on the map an error will be thrown
    removeSwitch(sw: SwitchType | string): SwitchType {
        let id = typeof sw === 'string' ? sw : sw.id
        if (!this.hasSwitch(id)) {
            throw new Error(`[SwitchesMap] switch with id ${id} doesn't exsits in the map`)
        }
        if (id === this.lastId){
            // if the switch we want to remove has the latest index
            // we set the latest index as the largest index before that
            const ids = Object.keys(this.switchesMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        this._amount--
        const deletedSwitch = this.switchesMap[id]
        delete this.switchesMap[id]
        return deletedSwitch
    }

    // removes several switches from the map and returns an array of the removed switches
    removeSwitches(switchesIds: Array<string|SwitchType>): Array<SwitchType> {
        const deletedSwitches: Array<SwitchType> = []
        switchesIds.forEach(id => deletedSwitches.push(this.removeSwitch(id)))
        return deletedSwitches
    }

    // Method to check if a switch with given id exists
    hasSwitch(switchId: string): boolean {
        return switchId in this.switchesMap
    }

    // Custom property to get the number of switches
    get amount(): number {
        return this._amount
    }

    // getter and setter for switches by id
    get(id: string): Switch | null {
        if(!this.hasSwitch(id)) return null
        return this.switchesMap[id]
    }

    set(id: string, newSwitch: SwitchType): void {
        this._amount++
        this.lastId = id
        this.switchesMap[id] = newSwitch;
    }

    // this function creates a colne/copy of the current SwitchesMap
    clone(): SwitchesMap<SwitchType> {
        const switchesArr = Object.values(this.switchesMap).map(sw => sw.clone() as SwitchType)
        return new SwitchesMap<SwitchType>(switchesArr)
    }

    addSwitch(newSwitch: SwitchType): void {
        if (this.hasSwitch(newSwitch.id)) {
            console.log(`Switches map already have switch with id: ${newSwitch.id}`)
            return
        }
        this.set(newSwitch.id, newSwitch)
    }

    addSwitches(swithesArr: Array<SwitchType>): void {
        for(const sw of swithesArr) {
            console.log(`trying to add switch: ${sw}`)
            this.addSwitch(sw)
        }
    }

    // function to generate new index based on all exsisting indexes for example
    // if the latest switch added has the index of "s123" the function will return 124
    generateIndex(): string {
        if(!this.lastId){
            return "s1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `s${newHigestIndex}`
    }
}