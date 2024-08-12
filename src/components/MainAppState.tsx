import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { Switch as SwitchObj } from '../framework/Switch'
import { Board } from '../framework/Board'

export type GlobalStateContextType = {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  actions: {
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

/** Return a default board, have 4 switches of sizes 1,2,3,4. has 2 Modules each containes 2 switches and 2 comaprtments one of which is empty */
const createDefaultBoard = (): Board => {
  const initialBoard = new Board("Board")
  const sw1 = initialBoard.switches.createNewSwitch('lighting', '1X16A', "PC", 'switch1')
  const sw2 = initialBoard.switches.createNewSwitch('aircon', '2X16A', "PC", 'switch1')
  const sw3 = initialBoard.switches.createNewSwitch('aircon', '3X16A', "PC", 'switch1')
  const sw4 = initialBoard.switches.createNewSwitch('aircon', '4X16A', "PC", 'switch1')
  const [md1, md2] = initialBoard.modules.createNewModulesArray({modulesAmount: 2})
  md1.addSwitches([sw1, sw2])
  md2.addSwitches([sw3, sw4])
  initialBoard.createCompartment({name: 'compartment1', moduleObjList: [md1, md2]})
  initialBoard.createCompartment({name: 'compartment2', moduleObjList: []})

  return initialBoard
}

export const initialBoard = createDefaultBoard()

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);
// Define the type for the children prop
interface GlobalStateProviderProps {
  children: ReactNode;
}
export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<Board>(initialBoard);

  const actions = {
    crud: {
      deleteSwitch: (switchId: string) => {
        const newBoard = board.clone()
      
        // validating switch id exists
        if ( !(newBoard.switches.hasSwitch(switchId))){
            throw new Error(`[deleteSwitch()] switch ID ${switchId} doesn't exist`);
        }
        // removing switch from the switches map
        const switchToRemove = newBoard.switches.removeSwitch(switchId)
        let parentModule = switchToRemove!.myModule

        if(!parentModule && !newBoard.modules.getParentModuleOfSwitchById(switchId)){
          throw new Error(`no parent module found for switch: ${switchId}`)
        }
      
        // removing switch from the module and switches map
        parentModule!.removeSwitch(switchId)
        setBoard(newBoard)
      },
      deleteModuleWithSwitches: (moduleId: string) => {
        // validating module with given id exists
        if(!board.modules.hasModule(moduleId)){
          throw new Error(`[deleteModuleWithSwitches()] module with id:${moduleId} doesn't exists`)
        }
        const newBoard = board.clone()
        const module = newBoard.modules.get(moduleId)
        const parentCompartment = module!.myCompartment ? module!.myCompartment : newBoard.compartments.getParentCompartmentOfModuleById(moduleId)
  
        // removing module from the modules map
        newBoard.modules.removeModule(moduleId)

        // removing switches from switches map
        newBoard.switches.removeSwitches(module!.switchesObjList) 
        
        if (parentCompartment){
            // removing module from the compratment modules list
            console.log(`removing module ${moduleId} from compartment ${parentCompartment.id}`)
            parentCompartment!.removeModule(moduleId)
        }
  
        setBoard(newBoard)
      },
      deleteCompartmentAndModules: (compartmentId: string) => {
        // validating compartment with given id exists
        if(!board.compartments.hasCompartment(compartmentId)){
          throw new Error(`[deleteCompartmentAndModules()] comaprtment with id:${compartmentId} doesn't exists`)
        }
        const newBoard = board.clone()
        let switchesToDelete: Array<SwitchObj> = []
        const compartment = newBoard.compartments.get(compartmentId)
        // removing all modules from the compartment
        const modulesToDelete = compartment.removeAllModules()

        // collecting all switches objects on the compartment modules
        modulesToDelete.forEach(mdObj => switchesToDelete.concat(mdObj.switchesObjList))

        // removing switches from the map
        newBoard.switches.removeSwitches(switchesToDelete)

        //removing modules from the map
        newBoard.modules.removeModules(modulesToDelete)

        //removing compartment from the map
        newBoard.compartments.removeCompartment(compartmentId)

        // removing for the compartments list that renders the compartments on the
        newBoard.compObjList = newBoard.compObjList.filter(cm => cm.id !== compartmentId)
        
        setBoard(newBoard)
      },
      addSwitchesToOneModule: (switchesToAdd: Array<SwitchObj>): boolean => {
        // this function adds all given switches to one module
        // returns "true" if it's succesful, and false if the switches coud not been add to a single module
        const newBoard = board.clone()

        // checking if all switches can be added to one module
        const module = newBoard.modules.canOneModuleFitSwitches(switchesToAdd)
        if(!module) return false

        console.log(`Going to add all ${switchesToAdd.length} switches to one module ${module.name} `)
        module.addSwitches(switchesToAdd)
        setBoard(newBoard)
        return true
      },
      addSwitchesToSeveralModules: (switchesToAdd: Array<SwitchObj>): boolean => {
        const newBoard = board.clone()

        //checking if can fit switches in several modules
        let amountOfSwitchesThatCanFit = newBoard.modules.canSomeModulesFitSwitches(switchesToAdd)
        if(amountOfSwitchesThatCanFit < switchesToAdd.length) return false

        newBoard.modules.addSwitchesToSeveralModules(switchesToAdd)
        setBoard(newBoard)
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
        
        const newBoard = board.clone()

        let totalSwitchesToAdd = switchesToAdd.length
        let switchesInExistingModules = 0
        let swWidth = switchesToAdd[0].dimensions.width
        let swHeight = switchesToAdd[0].dimensions.height
        
        const modulesToSwitches = newBoard.modules.getModuleFreeSlotsMap(switchesToAdd)
        const compartmentFreeSlots = newBoard.compartments.getCompartmentsFreeSlotsMap(undefined, switchesToAdd[0].dimensions.height)
        const compartmentToModules: { [key: string]: number } = {};
        const compartmentToSwitches: { [key: string]: number } = {}

        // take into account the switches that can be added into existing modules
        modulesToSwitches.forEach(swAmount => {
          totalSwitchesToAdd -= swAmount
          switchesInExistingModules += swAmount
        })

        for(const [cmId, mdAmount] of compartmentFreeSlots.entries()){

          const cmObj = newBoard.compartments.get(cmId)
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
          newBoard.modules.addSwitchesToSeveralModules(swichesForExistingModules)
        }

        // Adding the required Modules
        for(const [cmId, mdAmount] of Object.entries(compartmentToModules)){
          const cm = newBoard.compartments.get(cmId)
          const mdParams = {
            modulesAmount: mdAmount, 
            feed: cm.feed, 
            dimensions: {...cm.dimensions, height: swHeight}
          }
          console.log(`Adding ${mdAmount} modules to compartment ${cmId}`)
          const newModules = newBoard.modules.createNewModulesArray(mdParams)
          newModules.forEach(md => cm.addModule(md))
        }

        newBoard.modules.addSwitchesToSeveralModules(switchesForNewModules)

        setBoard(newBoard)
      
        return true
      }

    },
    // drag and drop actions
    dndActions: {
      droppedCompratment: (result: DropResult) => {
        const { destination, source } = result;
        
        const newBoard = board.clone()
        const newCompartmentsOrder = Array.from(newBoard.compObjList)
        const [compartment] = newCompartmentsOrder.splice(source.index, 1)
        // @ts-ignore destination might be null, we verified it before
        newCompartmentsOrder.splice(destination.index, 0, compartment)
        newBoard.compObjList = newCompartmentsOrder
  
        // Update the global state with the new order
        setBoard(newBoard)
      },
      droppedModule: (result: DropResult) => {
        const { destination, source } = result;
        const newBoard = board.clone()
        if(!destination) return
    
        const homeCompartment = newBoard.compartments.get(source.droppableId)
        const foreignCompartment = newBoard.compartments.get(destination.droppableId)

        const module = homeCompartment?.removeModuleAtIndex(source.index)
        foreignCompartment?.addModule(module!, destination.index)
  
        setBoard(newBoard);
      },
      droppedSwitch: (result: DropResult) => {
        const { destination, source } = result
    
        if(!destination) return

        const newBoard = board.clone()
        const homeModule = newBoard.modules.get(source.droppableId)
        const foreignModule = newBoard.modules.get(destination.droppableId)

        const sw = homeModule!.removeSwitchAtIndex(source.index)
        foreignModule!.addSwitch(sw, destination.index)

        setBoard(newBoard);
      
      },
    }
  }
  
  return (
    <GlobalStateContext.Provider value={{ board, setBoard, actions }}>
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
    const { board , setBoard, actions} = useGlobalState();

    return <WrappedComponent board={board} setBoard={setBoard} actions={actions} {...props} />;
  };
};






