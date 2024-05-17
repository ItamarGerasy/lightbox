import { Dimensions, defaultSwitchDimensions } from "../components/general/generalTypes";
import { Module } from "./Module"

/**This class represents an electric switch */
export class Switch {
    id: string
    name: string
    description: string
    /** 
     * prefix of the switch, of specific format. first number is the size, second number is the Voltage of the switch 
     * @example 3X16A, 1X40A
     * */
    prefix: string   
    readonly size: number
    feed?: string
    private _dimensions: Dimensions
    /** Module object which contains this switch */
    private _myModule!: Module | undefined

    /**
     * Creates a switch object
     * @param id switch id
     * @param name switch name
     * @param description switch description
     * @param prefix switch prefix, example: 1X16A, 3X40A
     * @param feed switch power feed
     */
    constructor({id, name, description, prefix, dimensions, feed}:{
        id: string, 
        name: string, 
        description: string,
        prefix: string,
        dimensions?: Dimensions, 
        feed?: string
    }){
        this.id = id
        this.name = name
        this.description = description
        this.prefix = prefix
        this.size = Number(prefix.charAt(0)) // always gonna be a single digit
        this._dimensions = dimensions ? {...dimensions} : {
            ...defaultSwitchDimensions, 
            width: this.size * defaultSwitchDimensions.width
        } 
        this.feed = feed ? feed : ""
    }

    /** myModule property, be sure to pass a pointer and not a copy in order
    * for removeSwitch to do it job well (removing the switch from the module)
    * important notice: this function doesn't add the switch itself to the module property
    * make sure to use module properties for that 
    * */
    set myModule(module: Module | undefined){
        this._myModule = module
    }

    /**returns a pointer to the module object which contains this switch */
    get myModule(): Module | undefined{
        return this._myModule
    }

    /**dimension property, returns a copy */
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

    /** returns a copy of the dimensions object of the switch */ 
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

    /**this function return a colne/copy of this current switch */ 
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