// SwitchesMap.ts
// Author: Itamar Gerasy
import { Switch } from "./Switch"
import { Dimensions } from "../components/general/generalTypes"

/**this class is basically a map of switches with some extra properties */ 
export class SwitchesMap {    
    private switchesMap: { [key: string]: Switch } = {}
    private _amount: number = 0
    /** The ID of the last switch inserted into the map */
    lastId: string | undefined = undefined
    
    /**
     * Constructor for Switches map 
     * 
     * option 1: do not pass any argument, will initialize empty map 
     * 
     * option 2: pass an array of switches , in that case we assume all switches 
     * 
     * id's on the array are different
     * */ 
    constructor(switchesArray?: Switch[]){
        if(!switchesArray){
            return
        }

        this.addSwitches(switchesArray)
        switchesArray.forEach((sw) => {
            
        });
    }

    /** removes a switch from the switches map and returns the switch object
     * 
    * you can pass a switch object or switch id to be removed
    * 
    * if the switch doesn't exist on the map an error will be thrown 
    * */
    removeSwitch(sw: Switch | string): Switch {
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

    /** removes several switches from the map and returns an array of the removed switches */
    removeSwitches(switchesIds: Array<string|Switch>): Array<Switch> {
        const deletedSwitches: Array<Switch> = []
        switchesIds.forEach(id => deletedSwitches.push(this.removeSwitch(id)))
        return deletedSwitches
    }

    /**Method to check if a switch with given id exists */
    hasSwitch(switchId: string): boolean {
        return switchId in this.switchesMap
    }

    /**Custom property to get the number of switches */
    get amount(): number {
        return this._amount
    }

    /** getter and setter for switches by id */
    get(id: string): Switch | null {
        if(!this.hasSwitch(id)) return null
        return this.switchesMap[id]
    }

    /** set a new switch in the map */
    set(id: string, newSwitch: Switch): void {
        if (this.hasSwitch(newSwitch.id)) {
            console.log(`Switches map already have switch with id: ${newSwitch.id}`)
            return
        }
        this._amount++
        this.lastId = id
        this.switchesMap[id] = newSwitch;
    }

    /**this function creates a colne/copy of the current SwitchesMap */
    clone(): SwitchesMap {
        const switchesArr = Object.values(this.switchesMap).map(sw => sw.clone() as Switch)
        return new SwitchesMap(switchesArr)
    }

    addSwitches(swithesArr: Array<Switch>): void {
        swithesArr.forEach((sw) => this.set(sw.id, sw))
    }

    /**function to generate new index based on all exsisting indexes for example
     * if the latest switch added has the index of "s123" the function will return 124 */
    generateIndex(): string {
        if(!this.lastId){
            return "s1"
        }
        let newHigestIndex = Number(this.lastId.substring(1)) + 1
        return `s${newHigestIndex}`
    }

    /** Creates an array of switch objects with same parameters to all switches */
    createNewSwitchesArray(switchesAmount: number, description: string, prefix: string, feed: string, name?: string, 
        dimensions?: Dimensions): Array<Switch> {
        // this function returns a new array of switches, that all have the same parameters but different ids

        let switchArr = new Array(switchesAmount).fill(null)
        switchArr = switchArr.map((_, i) => this.createNewSwitch(description, prefix, feed, name, dimensions))
        return switchArr
    }
    
    /**Factory function for Switch object, adds it to the map and returns it */
    createNewSwitch(description: string, prefix: string, feed: string, name?: string, dimensions?: Dimensions): Switch {
        let newId = this.generateIndex() // new index of the shape: s23, s11, s123
        const switchParams = {
            id: `${newId}`, 
            name: name || `switch${newId.substring(1)}`, 
            description: description, 
            prefix: prefix, 
            feed: feed,  
            dimensions: dimensions 
        }
        const sw = new Switch(switchParams)
        this.set(sw.id, sw)
        return sw
    }
}