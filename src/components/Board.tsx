// Board.tsx
import { BoardStyle, Compartments, BoardH } from './Board.styles'
import { Compartment } from './Compartment'
import React from 'react';
import { StrictModeDroppable } from './general/StrictModeDroppable'
import { useBoard } from '../hooks/BoardHook'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import { BoardMenu } from './Menus/BoardMenu'
import CollapseMenu from './general/CollapseMenu'

const Board: React.FC = () => {
  const { board, actions } = useBoard()

  const generateCompartmentsFromIndexList = (): React.ReactNode => {
    return board.compObjList.map((compartment, index) => (
      <Compartment key={compartment.id} compartment={compartment} index={index} />
    ));
  }

  const onDragEnd:OnDragEndResponder = (result) => {
    const { destination, source, type } = result;

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // drop logic for type 'compartment'
    if (type === 'compartment'){
      actions.dndActions.droppedCompratment(result)
      return
    }

    // drop logic for type 'module'
    if (type === 'module'){
      actions.dndActions.droppedModule(result);
      return
    }

    // drop logic for type 'switch'
    if (type === 'switch'){
      actions.dndActions.droppedSwitch(result)
    }
  }

  const BoardHeader = ({dimensions, name}:{dimensions: {width: number, height: number, depth: number}, name: string}) => {
    return (
      <BoardH>
        <CollapseMenu Menu={BoardMenu} menuProps={{}} orientation="horizontal" fontSize="small" />
        Name: {name}, Dimensions: Width: {dimensions.width}, Height: {dimensions.height}, Depth: {dimensions.depth}
      </BoardH>
    )
  }

  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="board" type='compartment' direction="horizontal">
          {(provided) => (
              <BoardStyle 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              >
                <BoardHeader dimensions={board.dimensions} name={board.name} />
                <Compartments>
                  {generateCompartmentsFromIndexList()}
                  {provided.placeholder}
                </Compartments>
              </BoardStyle>
          )}
        </StrictModeDroppable>
      </DragDropContext>
  )
}

export default Board
