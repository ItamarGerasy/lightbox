// Board.ts
// Author: Itamar Gerasy
import { Switch} from "./Switch"
import { SwitchesMap } from "./SwitchesMap"
import { Module } from "./Module"
import { ModulesMap } from "./ModulesMap"
import { Compartment } from "./Compartment"
import { CompartmentsMap } from "./CompartmentsMap"
import { Dimensions, defaultBoardDimensions, defaultCompartmentDimensions } from "../components/general/generalTypes"


/** class to represent the entire switch board */
export class Board {
    private _dimensions
    public name
    /** Ordered list of compartments on the board from left to right */
    public compObjList: Compartment[] = []
    /** A map containning all the compartments on the board and some extra fucntions */
    public compartments: CompartmentsMap
    /** A map containning all the moduless on the board and some extra fucntions */
    public modules: ModulesMap
    /** A map containning all the switches on the board and some extra fucntions */
    public switches: SwitchesMap
    /** Free width of the board */
    public freeWidth 

    /**
     * Constructor to creat an empty board
     * @param dimensions An optional dimensions object specifying the width, heighet, depth of the board. If not provided, a default value {@link defaultBoardDimensions} is used.
     */ 
    constructor(name?: string, dimensions?: Dimensions) {
        this.name = name ? name : "Board"
        this._dimensions = dimensions ? dimensions : {...defaultBoardDimensions}
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
    createCompartment({name, feed = "", moduleObjList = [], dimensions = defaultCompartmentDimensions}:{
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
            console.warn(`[${this.name}] Cannot create new compartment with width of ${dimensions.width} because the board free width is only ${this.freeWidth}`)
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

    /**  this function adds all given switches to one module
    * @returns "true" if it's succesful, and "false" if the switches coud not have been added
    */
    addSwitchesToOneModule(switchesToAdd: Array<Switch>): boolean {
        // checking if all switches can be added to one module
        const module = this.modules.canOneModuleFitSwitches(switchesToAdd)
        if(!module) return false

        console.log(`[${this.name}] Going to add all ${switchesToAdd.length} switches to one module ${module.name} `)
        module.addSwitches(switchesToAdd)

        return true
    }

    /**  this function adds all given switches to several different modules
    * @returns "true" if it's succesful, and "false" if the switches coud not have been added
    */
    addSwitchesToSeveralModules(switchesToAdd: Array<Switch>): boolean {

        //checking if can fit switches in several modules
        let amountOfSwitchesThatCanFit = this.modules.canSomeModulesFitSwitches(switchesToAdd)
        if(amountOfSwitchesThatCanFit < switchesToAdd.length) return false

        this.modules.addSwitchesToSeveralModules(switchesToAdd)
        return true
    }

    /**
     * Create and add new models to existing compartments in order to fit in all given switches
     * If there isn't enough space on existing compartments will not add any modules and will return false
     * Designed to be used when addSwitchesToSeveralModules failed and there is no room in existing modules for the switches 
     * @param switchesToAdd Array of switch objects to add
     * @returns true if sucsessful, false if not.
     */
    addModuleAndAddSwitches(switchesToAdd: Switch[]): boolean {

        let totalSwitchesToAdd: number = switchesToAdd.length
        let switchesInExistingModules: number = 0
        let swWidth: number = switchesToAdd[0].dimensions.width
        let swHeight: number = switchesToAdd[0].dimensions.height
        
        const modulesToSwitches = this.modules.getModuleFreeSlotsMap(switchesToAdd)
        const compartmentFreeSlots = this.compartments.getCompartmentsFreeSlotsMap(undefined, switchesToAdd[0].dimensions.height)
        const compartmentToModules: { [key: string]: number } = {}
        const compartmentToSwitches: { [key: string]: number } = {}

        // take into account the switches that can be added into existing modules
        modulesToSwitches.forEach(swAmount => {
            totalSwitchesToAdd -= swAmount
            switchesInExistingModules += swAmount
        })

        for(const [cmId, mdAmount] of compartmentFreeSlots.entries()){

            const cmObj = this.compartments.get(cmId)
            let cmWidth = cmObj.dimensions.width
            let swPerModuleInCm = Math.floor(cmWidth / swWidth)
            // calculating amount of switches that will fit the compartment
            let switchesInCm = swPerModuleInCm * mdAmount

            // in case the available space in the compartment can't hold all the desired switches
            if(switchesInCm < totalSwitchesToAdd) {
                console.log(`Compartment ${cmId} can't fit all remainning switches ${totalSwitchesToAdd}, he can fit ${switchesInCm} switches in ${mdAmount} modules`)           
                // this compartment will have to add all the possible modules he can, and all the switches he can
                compartmentToModules[cmId] = mdAmount
                compartmentToSwitches[cmId] = switchesInCm
                totalSwitchesToAdd -= switchesInCm
                continue
            }

            // in case the available space in the compartment can hold all the desired switches
            let amountOfNewModulesNeeded = Math.ceil(totalSwitchesToAdd / swPerModuleInCm)
            compartmentToModules[cmId] = amountOfNewModulesNeeded
            compartmentToSwitches[cmId] = totalSwitchesToAdd
            console.log(`Compartment ${cmId} can fit all remainning switches ${totalSwitchesToAdd}, he can fit ${switchesInCm} switches in ${mdAmount} modules. \n
            and will need to add ${amountOfNewModulesNeeded} modules`)
            totalSwitchesToAdd = 0
            break
        }

        if (totalSwitchesToAdd > 0) {
            console.log(`There isn't enough space in existing compartments to add ${totalSwitchesToAdd} switches, even with adding modules`)
            return false
        }

        // Adds the switches first to existing modules
        const swichesForExistingModules = switchesToAdd.slice(0, switchesInExistingModules)
        const switchesForNewModules = switchesToAdd.slice(switchesInExistingModules)
        if(switchesInExistingModules){
            console.log(`Adding ${switchesInExistingModules} switches to existing modules`)
            this.modules.addSwitchesToSeveralModules(swichesForExistingModules)
        }

        // Adding the required Modules
        for(const [cmId, mdAmount] of Object.entries(compartmentToModules)){
                const cm = this.compartments.get(cmId)
                const mdParams = {
                modulesAmount: mdAmount, 
                feed: cm.feed, 
                dimensions: {...cm.dimensions, height: swHeight}
            }
            console.log(`Adding ${mdAmount} modules to compartment ${cmId}`)
            const newModules = this.modules.createNewModulesArray(mdParams)
            newModules.forEach(md => cm.addModule(md))
        }

        this.modules.addSwitchesToSeveralModules(switchesForNewModules)
        
        return true
    }

    /**Deletes a single switch from the board.
    * @param switchId - the id of the switch to be deleted
    */
    deleteSwitch(switchId: string): void {
        // removing switch from the switches map
        const switchToRemove = this.switches.removeSwitch(switchId)
        let parentModule = switchToRemove.myModule
        
        if(!parentModule && !this.modules.getParentModuleOfSwitchById(switchId)){
          throw new Error(`no parent module found for switch: ${switchId}`)
        }
      
        // removing switch from the module and switches map
        parentModule!.removeSwitch(switchId)
    }

    /**Deletes a single module and all his switches from the board.
    * @param moduleId - the id of the module to be deleted
    */
    deleteModuleWithSwitches(moduleId: string): void {
        // validating module with given id exists
        if(!this.modules.hasModule(moduleId)){
          throw new Error(`[deleteModuleWithSwitches()] module with id:${moduleId} doesn't exists`)
        }
        const module = this.modules.get(moduleId)
        const parentCompartment = module!.myCompartment ? module!.myCompartment : this.compartments.getParentCompartmentOfModuleById(moduleId)
  
        // removing module from the modules map
        this.modules.removeModule(moduleId)

        // removing switches from switches map
        this.switches.removeSwitches(module!.switchesObjList) 

        //removing switches from module
        module.switchesObjList.forEach(sw => module.removeSwitch(sw.id))
        
        if (parentCompartment){
            // removing module from the compratment modules list
            parentCompartment!.removeModule(moduleId)
        }
    }

    /**Deletes a single compartment and all his modules and switches from the board.
    * @param comaprtmentId - the id of the compartment to be deleted
    */
    deleteCompartmentAndModules = (compartmentId: string): void => {
        // validating compartment with given id exists
        if(!this.compartments.hasCompartment(compartmentId)){
          throw new Error(`[deleteCompartmentAndModules()] comaprtment with id:${compartmentId} doesn't exists`)
        }

        let switchesToDelete: Array<Switch> = []
        const compartment = this.compartments.get(compartmentId)
        this.freeWidth += compartment.dimensions.width

        // removing all modules from the compartment
        const modulesToDelete = compartment.removeAllModules()
        
        // collecting all switches objects on the compartment modules
        modulesToDelete.forEach(mdObj => switchesToDelete.push(...mdObj.switchesObjList))
        // removing switches from the map
        this.switches.removeSwitches(switchesToDelete)

        //removing modules from the map
        this.modules.removeModules(modulesToDelete)

        //removing compartment from the map
        this.compartments.removeCompartment(compartmentId)

        // removing for the compartments list that renders the compartments on the
        this.compObjList = this.compObjList.filter(cm => cm.id !== compartmentId)
    }

    /** Clears all the compartments on the board */
    clearBoard(): void {
        this.compartments.forEach((compartmentObj, compartmentId) => {
            this.deleteCompartmentAndModules(compartmentId)
        })
    }

    /** Creates a clone of the board */
    clone(): Board {
        const cloneBoard = new Board(this.name, this.dimensions)
        const cloneModules: Module[] =[]
        const cloneSwitches: Switch[] = []

        // this will create a clone of all compartments,these compartments will hold clones of the modules
        // and the clone modules will have clones of switches
        cloneBoard.compartments = this.compartments.clone()

        // creating a clone list of ordered compartments
        this.compObjList.forEach(cm => cloneBoard.compObjList.push(cloneBoard.compartments.get(cm.id)))

        // creating a clone list of switches and modules
        cloneBoard.compartments.forEach(cm => cloneModules.push(...cm.modulesObjList))
        cloneModules.forEach(md => cloneSwitches.push(...md.switchesObjList))

        // adding to empty switchesmap and modules map the clones
        cloneModules.forEach(md => cloneBoard.modules.set(md))
        cloneBoard.switches.addSwitches(cloneSwitches)

        return cloneBoard
    }
}