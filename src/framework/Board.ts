// Board.ts
// Author: Itamar Gerasy
import { Switch} from "./Switch"
import { SwitchesMap } from "./SwitchesMap"
import { Module } from "./Module"
import { ModulesMap } from "./ModulesMap"
import { Compartment } from "./Compartment"
import { CompartmentsMap } from "./ComaprtmentsMap"
import { Dimensions, defaultBoardDimensions, defaultCompartmentDimensions } from "../components/general/generalTypes"


/** class to represent the entire switch board */
export class Board {
    private _dimensions
    public name
    public compObjList: Compartment[] = []
    public compartments: CompartmentsMap
    public modules: ModulesMap
    public switches: SwitchesMap
    public freeWidth

    /**
     * Constructor to creat an empty board
     * @param dimensions An optional dimensions object specifying the width, heighet, depth of the board. If not provided, a default value {@link defaultBoardDimensions} is used.
     */ 
    constructor(name?: string, dimensions?: Dimensions) {
        this.name = name ? name : "Board"
        this._dimensions = dimensions ? dimensions : defaultBoardDimensions
        this.freeWidth = this._dimensions.width
        this.compObjList = []
        this.compartments = new CompartmentsMap()
        this.modules = new ModulesMap()
        this.switches = new SwitchesMap()
    }

    /** Board Dimensions, a copy of the dimesnions object of the board */
    get dimensions(): Dimensions {
        return { ...this._dimensions }
    }

    /** Sets some or all dimensions of the board if possible
     * @param dimensions An object contanning width, height or depth properties
     * @throws error if the new dimensions are not possible to set
      */
    set dimensions({width, height, depth}:{width?: number, height?: number, depth?: number}) {

        if(width){
            if(width < this._dimensions.width && width < this.minimumWidthToSet()){
                throw new Error(`[${this.name}] Setting the width to ${width} is not possible because the minimum width to set the board is ${this.minimumWidthToSet()}`)
            }
            this._dimensions.width = width
        }

        if(height){
            if(height < this._dimensions.height && height < this.minimumHeightToSet()){
                throw new Error(`[${this.name}] Setting the height to ${height} is not possible because the minimum height to set the board is ${this.minimumHeightToSet()}`)
            }
            this._dimensions.height = height
        }

        if(depth){
            if(depth < this._dimensions.depth && depth < this.minimumDepthToSet()){
                throw new Error(`[${this.name}] Setting the depth to ${depth} is not possible because the minimum depth to set the board is ${this.minimumDepthToSet()}`)
            }
            this._dimensions.depth = depth
        }
    }

    /** Creates new compratment on the board 
     * @param name name of the compartment
     * @param feed optional - feed of the compartment
     * @param moduleObjList optional - list of modules objects in the compartment
     * @param dimensions optional - dimensions of the compartment, if not provided will use {@link defaultCompartmentDimensions}
     * 
     * @returns true if succesfully created, false otherwise
    */
    createEmptyCompartment({name, feed = "", moduleObjList = [], dimensions = defaultCompartmentDimensions}:{
        name: string 
        feed?: string,
        moduleObjList?: Module[],
        dimensions?: Dimensions
    }): boolean {

        if(dimensions.depth > this.dimensions.depth){
            console.warn(`[${this.name}] Cannot create new compartment with depth of ${dimensions.depth} because the board depth is only ${this.dimensions.depth}`)
            return false
        }

        if(dimensions.height > this.dimensions.height){
            console.warn(`[${this.name}] Cannot create new compartment with height of ${dimensions.height} because the board height is only ${this.dimensions.height}`)
            return false
        }

        if(dimensions.width > this.freeWidth){
            console.warn(`[${this.name}] Cannot create new compartment with width of ${dimensions.width} because the board width is only ${this.freeWidth}`)
            return false
        }

        const cm = this.compartments.createNewComaprtment({name, feed, moduleObjList, dimensions})
        this.compObjList.push(cm)
        this.freeWidth -= cm.dimensions.width

        return true
    }

    /** Returs the minimum width that can be set on the board */
    minimumWidthToSet(): number {
        return this.compObjList.reduce((totalWidth, cm) => totalWidth + cm.dimensions.width, 0)
    }

    /** Returs the minimum height that can be set on the board */
    minimumHeightToSet(): number {
        return this.compObjList.reduce((maxHeight, cm) => Math.max(maxHeight, cm.dimensions.height), 0)
    }

    /** Returs the minimum depth that can be set on the board */
    minimumDepthToSet(): number {
        return this.compObjList.reduce((maxDepth, cm) => Math.max(maxDepth, cm.dimensions.depth), 0)
    }
}