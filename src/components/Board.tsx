// Board.tsx
import { BoardStyle } from './Board.styles'
import { Compartment } from './Compartment'
import React from 'react';
import { StrictModeDroppable } from './general/StrictModeDroppable'
import { useGlobalState } from './MainAppState'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'

const Board: React.FC = () => {
  const { globalState, actions } = useGlobalState()

  const generateCompartmentsFromIndexList = (): React.ReactNode => {
    return globalState.compartmentsOrder.map((compartment, index) => (
      <Compartment key={compartment.id} compartment={compartment} index={index} />
    ));
  }

  const onDragEnd:OnDragEndResponder = (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // drop logic for type 'compartment'
    if (type === 'compartment'){
      actions.dndActions.droppedCompratment(result)
      return;
    }

    // drop logic for type 'module'
    if (type === 'module'){
      actions.dndActions.droppedModule(result);
      return;
    }

    // drop logic for type 'switch'
    if (type === 'switch'){
      actions.dndActions.droppedSwitch(result)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="board" type='compartment' direction="horizontal">
        {(provided) => (
            <BoardStyle 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            >
              {generateCompartmentsFromIndexList()}
              {provided.placeholder}
            </BoardStyle>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default Board;
