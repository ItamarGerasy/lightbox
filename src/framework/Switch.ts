import { Dimensions } from "../components/general/generalTypes";
import { Module as ModuleType } from "../components/general/typeForComponents"

export class Switch {
    id: string
    name: string
    description: string
    prefix: string   // prefix of the switch, of specific format. example: 3X16 first number is the size, second number is the Voltage of the switch
    readonly size: number
    feed?: string
    _dimensions: Dimensions
    _myModule!: ModuleType // Module object which conatins this Switch

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
    set myModule(module: ModuleType){
        this._myModule = module
    }

    // returns a pointer to the module object which contains this switch
    get myModule(): ModuleType{
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
        this.myModule.removeSwitch(this.id)
    }
}

export class SwitchesMap<SwitchType  extends Switch> {
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

    // Method to remove a switch associated with an id
    removeSwitch(id: string): void {
        if (!this.hasSwitch(id)) {
            return
        }
        const switchToDelete = this.switchesMap[id]
        if (switchToDelete.id == this.lastId){
            // if the switch we want to remove has the latest index
            // we set the latest index as the largest index before that
            const ids = Object.keys(this.switchesMap);
            ids.sort().pop();
            this.lastId = ids.pop()
        }
        delete this.switchesMap[id]
        this._amount--
    }

    // Method to check if a switch with given id exists
    hasSwitch(switchId: string): boolean {
        return switchId in this.switchesMap
    }

    // Custom property to get the number of switches
    get amount(): number {
        return this._amount
    }

    // Indexer implementation for getting and setting values
    get(id: string): Switch | undefined {
        // used to get a values from SwitchesMap like you would from a normal map
        return this.switchesMap[id]
    }

    set(id: string, newSwitch: SwitchType): void {
        // used to add to set a switchs in the switches map as you would a normal map
        // example:
        // const switches = new SwitchesMap<SwitchType>();
        // Switches[switch1.id] = switch1;
        // Switches[switch2.id] = switch2;
        this._amount++
        this.lastId = id
        this.switchesMap[id] = newSwitch;
    }

    addSwitch(newSwitch: SwitchType): void {
        if (this.hasSwitch(newSwitch.id)) {
            console.log(`Switches map already have switch with id: ${newSwitch.id}`)
            return
        }
        this.set(newSwitch.id, newSwitch) 
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