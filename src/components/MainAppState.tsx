import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { Switch as SwitchObj } from '../framework/Switch'
import { SwitchesMap } from '../framework/SwitchesMap'
import { Module } from '../framework/Module'
import { ModulesMap } from '../framework/ModulesMap'
import { Compartment } from "../framework/Compartment"
import { CompartmentsMap } from '../framework/ComaprtmentsMap'
import { defaultSwitchDimensions } from './general/generalTypes'

export type GlobalState = {
  boardWidth: number,
  boardHeight: number,
  boardDepth: number,
  compartmentsOrder: Compartment[],
  compartments: CompartmentsMap,
  modules: ModulesMap,
  switches: SwitchesMap
}

export type GlobalStateContextType = {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  actions: {
    misc:{
      getCloneGlobalState: () => GlobalState
    },
    crud: {
      deleteSwitch: (switchId: string) => void
      deleteModuleWithSwitches: (moduleId: string) => void
      deleteCompartmentAndModules: (comratmentId: string) => void
      addSwitchesToOneModule: (switchesToAdd: Array<SwitchObj>) => boolean
      addSwitchesToSeveralModules: (switchesToAdd: Array<SwitchObj>) => boolean
      addModuleAndAddSwitches: (switchesToAdd: Array<SwitchObj>) => boolean
    },
    dndActions: {
      droppedCompratment: (result: DropResult) => void
      droppedModule: (result: DropResult) => void
      droppedSwitch: (result: DropResult) => void
    }
  }
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);
// Define the type for the children prop
interface GlobalStateProviderProps {
  children: ReactNode;
}
export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>(initialAppGlobalState);

  const actions = {
    misc: {
      getCloneGlobalState: () => {
        return {
          boardWidth: globalState.boardWidth,
          boardHeight: globalState.boardHeight,
          boardDepth: globalState.boardDepth,
          compartmentsOrder: globalState.compartmentsOrder.map(cm => cm.clone()),
          compartments: globalState.compartments.clone(),
          modules: globalState.modules.clone(),
          switches: globalState.switches.clone()
        } as GlobalState}
    },
    crud: {
      deleteSwitch: (switchId: string) => {
        const newGlobalState = {...globalState}
      
        // validating switch id exists
        if ( !(newGlobalState.switches.hasSwitch(switchId))){
            throw new Error(`[deleteSwitch()] switch ID ${switchId} doesn't exist`);
        }
        // removing switch from the switches map
        const switchToRemove = newGlobalState.switches.removeSwitch(switchId)
        let parentModule = switchToRemove!.myModule

        if(!parentModule && !newGlobalState.modules.getParentModuleOfSwitchById(switchId)){
          throw new Error(`no parent module found for switch: ${switchId}`)
        }
      
        // removing switch from the module and switches map
        parentModule!.removeSwitch(switchId)
        setGlobalState(newGlobalState)
      },
      deleteModuleWithSwitches: (moduleId: string) => {
        // validating module with given id exists
        if(!globalState.modules.hasModule(moduleId)){
          throw new Error(`[deleteModuleWithSwitches()] module with id:${moduleId} doesn't exists`)
        }
        const module = globalState.modules.get(moduleId)
        const parentCompartment = module!.myCompartment ? module!.myCompartment : globalState.compartments.getParentCompartmentOfModuleById(moduleId)
        const newGlobalState = {...globalState}
  
        // removing module from the modules map
        newGlobalState.modules.removeModule(moduleId)

        // removing switches from switches map
        newGlobalState.switches.removeSwitches(module!.switchesObjList) 
        
        if (parentCompartment){
            // removing module from the compratment modules list
            parentCompartment!.removeModule(moduleId)
        }
  
 
        setGlobalState(newGlobalState)
      },
      deleteCompartmentAndModules: (compartmentId: string) => {
        // validating compartment with given id exists
        if(!globalState.compartments.hasCompartment(compartmentId)){
          throw new Error(`[deleteCompartmentAndModules()] comaprtment with id:${compartmentId} doesn't exists`)
        }
        const newGlobalState = {...globalState}
        let switchesToDelete: Array<SwitchObj> = []
        const compartment = newGlobalState.compartments.get(compartmentId)
        // removing all modules from the compartment
        const modulesToDelete = compartment.removeAllModules()

        // collecting all switches objects on the compartment modules
        modulesToDelete.forEach(mdObj => switchesToDelete.concat(mdObj.switchesObjList))

        // removing switches from the map
        newGlobalState.switches.removeSwitches(switchesToDelete)

        //removing modules from the map
        newGlobalState.modules.removeModules(modulesToDelete)

        //removing compartment from the map
        newGlobalState.compartments.removeCompartment(compartmentId)

        // removing for the compartments list that renders the compartments on the
        newGlobalState.compartmentsOrder = newGlobalState.compartmentsOrder.filter(cm => cm.id !== compartmentId)
        
        setGlobalState(newGlobalState)
      },
      addSwitchesToOneModule: (switchesToAdd: Array<SwitchObj>): boolean => {
        // this function adds all given switches to one module
        // returns "true" if it's succesful, and false if the switches coud not been add to a single module
        const newGlobalState = {...globalState}

        // checking if all switches can be added to one module
        const module = newGlobalState.modules.canOneModuleFitSwitches(switchesToAdd)
        if(!module) return false

        console.log(`Going to add all ${switchesToAdd.length} switches to one module ${module.name} `)
        module.addSwitches(switchesToAdd)
        setGlobalState(newGlobalState)
        return true
      },
      addSwitchesToSeveralModules: (switchesToAdd: Array<SwitchObj>): boolean => {
        const newGlobalState = {...globalState}

        //checking if can fit switches in several modules
        let amountOfSwitchesThatCanFit = newGlobalState.modules.canSomeModulesFitSwitches(switchesToAdd)
        if(amountOfSwitchesThatCanFit < switchesToAdd.length) return false

        newGlobalState.modules.addSwitchesToSeveralModules(switchesToAdd)
        setGlobalState(newGlobalState)
        return true
      },
      /**
       * Create and add new models to existing compartments in order to fit in all given switches
       * If there isn't enough space on existing compartments will not add any modules and will return false
       * Designed to be used when addSwitchesToSeveralModules failed and there is no room in existing modules for the switches 
       * @param switchesToAdd Array of switch objects to add
       * @returns true if sucsessful, false if not.
       */
      addModuleAndAddSwitches: (switchesToAdd: SwitchObj[]): boolean => {
        
        const newGlobalState = {...globalState}

        let totalSwitchesToAdd = switchesToAdd.length
        let switchesInExistingModules = 0
        let swWidth = switchesToAdd[0].dimensions.width
        let swHeight = switchesToAdd[0].dimensions.height
        
        const modulesToSwitches = newGlobalState.modules.getModuleFreeSlotsMap(switchesToAdd)
        const compartmentFreeSlots = newGlobalState.compartments.getCompartmentsFreeSlotsMap(undefined, switchesToAdd[0].dimensions.height)
        const compartmentToModules: { [key: string]: number } = {};
        const compartmentToSwitches: { [key: string]: number } = {}

        // take into account the switches that can be added into existing modules
        modulesToSwitches.forEach(swAmount => {
          totalSwitchesToAdd -= swAmount
          switchesInExistingModules += swAmount
        })

        for(const [cmId, mdAmount] of compartmentFreeSlots.entries()){

          const cmObj = newGlobalState.compartments.get(cmId)
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
          newGlobalState.modules.addSwitchesToSeveralModules(swichesForExistingModules)
        }

        // Adding the required Modules
        for(const [cmId, mdAmount] of Object.entries(compartmentToModules)){
          const cm = newGlobalState.compartments.get(cmId)
          const mdParams = {
            modulesAmount: mdAmount, 
            feed: cm.feed, 
            dimensions: {...cm.dimensions, height: swHeight}
          }
          console.log(`Adding ${mdAmount} modules to compartment ${cmId}`)
          const newModules = newGlobalState.modules.createNewModulesArray(mdParams)
          newModules.forEach(md => cm.addModule(md))
        }

        newGlobalState.modules.addSwitchesToSeveralModules(switchesForNewModules)

        setGlobalState(newGlobalState)
      
        return true
      }

    },
    // drag and drop actions
    dndActions: {
      droppedCompratment: (result: DropResult) => {
        const { destination, source } = result;
  
        const newCompartmentsOrder = Array.from(globalState.compartmentsOrder);
        const [compartment] = newCompartmentsOrder.splice(source.index, 1);
        // @ts-ignore destination might be null, we verified it before
        newCompartmentsOrder.splice(destination.index, 0, compartment);
  
        // Update the global state with the new order
        setGlobalState((prevState) => ({
          ...prevState,
          compartmentsOrder: newCompartmentsOrder,
        }));  
      },
      droppedModule: (result: DropResult) => {
        const { destination, source } = result;
        const newState = {...globalState}
        if(!destination){
          return;
        }
    
        const homeCompartment = newState.compartments.get(source.droppableId)
        const foreignCompartment = newState.compartments.get(destination.droppableId)

        const module = homeCompartment?.removeModuleAtIndex(source.index)
        foreignCompartment?.addModule(module!, destination.index)
  
        setGlobalState(newState);
      },
      droppedSwitch: (result: DropResult) => {
        const { destination, source } = result;
    
        if(!destination) return

        const newGlobalState = {...globalState}
        const homeModule = newGlobalState.modules.get(source.droppableId)
        const foreignModule = newGlobalState.modules.get(destination.droppableId)

        const sw = homeModule!.removeSwitchAtIndex(source.index)
        foreignModule!.addSwitch(sw, destination.index)

        setGlobalState(newGlobalState);
      
      },
    }
  }
  
  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState, actions }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const withGlobalState = <P extends object>(
  WrappedComponent: React.ComponentType<P & GlobalStateContextType>
) => {
  return (props: P) => {
    const { globalState , setGlobalState, actions} = useGlobalState();

    return <WrappedComponent globalState={globalState} setGlobalState={setGlobalState} actions={actions} {...props} />;
  };
};

const s1 = new SwitchObj(
  {id:'s1', name:'switch1', description:'lighting', prefix:'1X16A', feed:"PC",  dimensions:defaultSwitchDimensions})
const s2 = new SwitchObj(
  {id:'s2', name:'switch2', description:'aircon', prefix:'2X16A',  feed:"PC", dimensions:{...defaultSwitchDimensions, width: 17.5 * 2}})
const s3 = new SwitchObj(
  {id:'s3', name:'switch3', description:'aircon', prefix:'3X16A',  feed:"PC", dimensions:{...defaultSwitchDimensions, width: 17.5 * 3}})
const s4 = new SwitchObj(
  {id:'s4', name:'switch4', description:'aircon', prefix:'4X16A',  feed:"PC", dimensions: {...defaultSwitchDimensions, width: 17.5 * 4}})
const switchesArr = [s1, s2, s3, s4]  
const m1 = new Module(
  { id: 'm1', name: 'module1', feed: 'PC', switchesObjList: [s1, s2]})
const m2 = new Module(
  {id: 'm2', name: 'module2', feed: 'PC', switchesObjList: [s3, s4]})
const modulesArr = [m1, m2]  

const c1 = new Compartment(
  {id: 'c1', name: 'compartment1', feed: 'PC', modulesObjList: [m1, m2]}
)
const c2 = new Compartment(
  {id: 'c2', name: 'compartment2', feed: 'PC', modulesObjList: []} 
)
const compsArray = [c1, c2]


export const initialAppGlobalState:GlobalState = {
  boardWidth: 200,
  boardHeight: 200,
  boardDepth: 50,
  compartmentsOrder: [c1, c2],
  compartments: new CompartmentsMap(compsArray),
  modules: new ModulesMap(modulesArr),
  switches: new SwitchesMap(switchesArr)
}

