import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { Switch} from '../framework/Switch'
import { Board } from '../framework/Board'
import { createDefaultBoard } from '../framework/helpers'

export type BoardContextType = {
  board: Board
  setBoard: React.Dispatch<React.SetStateAction<Board>>
  actions: {
    crud: {
      deleteSwitch: (switchId: string) => void
      deleteModuleWithSwitches: (moduleId: string) => void
      deleteCompartmentAndModules: (comratmentId: string) => void
      addSwitches: (switchesToAdd: Switch[]) => boolean
    },
    dndActions: {
      droppedCompratment: (result: DropResult) => void
      droppedModule: (result: DropResult) => void
      droppedSwitch: (result: DropResult) => void
    }
  }
}

const initialBoard = createDefaultBoard()

const BoardContext = createContext<BoardContextType | undefined>(undefined)
// Define the type for the children prop
interface BoardProviderProps {
  children: ReactNode
}
export const BoardContextProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<Board>(initialBoard)

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
      addSwitches: (switchesToAdd: Switch[]): boolean => {
        const newBoard = board.clone()
        let sucsess = newBoard.addSwitches(switchesToAdd)

        if(!sucsess) return false

        setBoard(newBoard)
        return true
      }
    },
    // drag and drop actions
    dndActions: {
      droppedCompratment: (result: DropResult) => {
        const { destination, source } = result
        
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
        const { destination, source } = result
        const newBoard = board.clone()
        if(!destination) return
    
        const homeCompartment = newBoard.compartments.get(source.droppableId)
        const foreignCompartment = newBoard.compartments.get(destination.droppableId)

        const module = homeCompartment?.removeModuleAtIndex(source.index)
        foreignCompartment?.addModule(module!, destination.index)
  
        setBoard(newBoard)
      },
      droppedSwitch: (result: DropResult) => {
        const { destination, source } = result
    
        if(!destination) return

        const newBoard = board.clone()
        const homeModule = newBoard.modules.get(source.droppableId)
        const foreignModule = newBoard.modules.get(destination.droppableId)

        const sw = homeModule!.removeSwitchAtIndex(source.index)
        foreignModule!.addSwitch(sw, destination.index)

        setBoard(newBoard)
      },
    }
  }
  
  return (
    <BoardContext.Provider value={{ board, setBoard, actions }}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext)
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider')
  }
  return context
}

export const withBoard = <P extends object>(
  WrappedComponent: React.ComponentType<P & BoardContextType>
) => {
  return (props: P) => {
    const { board , setBoard, actions} = useBoard()

    return <WrappedComponent board={board} setBoard={setBoard} actions={actions} {...props} />
  }
}
