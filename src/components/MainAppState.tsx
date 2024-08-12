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
        newBoard.deleteSwitch(switchId)
        setBoard(newBoard)
      },
      deleteModuleWithSwitches: (moduleId: string) => {
        const newBoard = board.clone()
        newBoard.deleteModuleWithSwitches(moduleId)
        setBoard(newBoard)
      },
      deleteCompartmentAndModules: (compartmentId: string) => {
        const newBoard = board.clone()
        newBoard.deleteCompartmentAndModules(compartmentId)
        setBoard(newBoard)
      },
      addSwitchesToOneModule: (switchesToAdd: Array<SwitchObj>): boolean => {
        // this function adds all given switches to one module
        // returns "true" if it's succesful, and false if the switches coud not been add to a single module
        const newBoard = board.clone()
        let sucsess = newBoard.addSwitchesToOneModule(switchesToAdd)

        if(!sucsess) return false

        setBoard(newBoard)
        return true
      },
      addSwitchesToSeveralModules: (switchesToAdd: Array<SwitchObj>): boolean => {
        const newBoard = board.clone()

        let sucsess = newBoard.addSwitchesToSeveralModules(switchesToAdd)

        if(!sucsess) return false

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

        let sucsess = newBoard.addModuleAndAddSwitches(switchesToAdd)

        if(!sucsess) return false

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






