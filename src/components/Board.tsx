// Board.tsx
import { BoardStyle } from './Board.styles';
import { Compartment } from './Compartment';
import React from 'react';
import { StrictModeDroppable } from './StrictModeDroppable'
import { useGlobalState } from './MainAppState';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';



// const handleSwitchDelete: RemovingItemsType['handleSwitchDelete'] = 
//   (event: React.MouseEvent<HTMLElement>, switchId: string) => {

//     let parentModule
//     console.log(`switch to remove: ${switchId}`)
//     // validating switch id exists
//     if ( !(switchId in globalState.switches)){
//         throw new Error(`switch ID ${switchId} doesn't exist`);
//     }
//     // removing switch from the switches map
//     delete globalState.switches[switchId]

//     // finding the parent module
//     // eslint-disable-next-line
//     for (const [moduleId, moduleObj] of Object.entries(globalState.modules)) {
//         if(moduleObj.switchesOrderedList.indexOf(switchId) >= 0 ){
//             parentModule = moduleObj
//         }
//     }
//     if (!parentModule){
//         throw new Error(`no parent module found for switch: ${switchId}`);
//     }

//     // removing switch from the module switches list
//     const switchIndex = parentModule.switchesOrderedList.indexOf(switchId)
//     parentModule.switchesOrderedList.splice(switchIndex, 1)
//   };


const Board: React.FC = () => {
  const { globalState, setGlobalState } = useGlobalState()

  function generateCompartmentsFromIndexList(): React.ReactNode{
    const compartments = globalState.compartments
    return globalState.compartmentsOrder.map((compartmentId, index) => (
      <Compartment key={compartmentId} compartment={compartments[compartmentId]} index={index} />
    ));
  }

  const onDragEnd:OnDragEndResponder = (result) => {
    const { destination, source, draggableId, type } = result;

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
      const newCompartmentsOrder = Array.from(globalState.compartmentsOrder);
      newCompartmentsOrder.splice(source.index, 1);
      newCompartmentsOrder.splice(destination.index, 0, draggableId);

      // Update the global state with the new order
      setGlobalState((prevState) => ({
        ...prevState,
        compartmentsOrder: newCompartmentsOrder,
      }));  
      return;
    }
    // end of drop logic for type 'compartment'

    // drop logic for type 'module'
    if (type === 'module'){
      const homeCompartment = globalState.compartments[source.droppableId];
      const homeModulesList = homeCompartment.modulesOrderedList

      const foreignCompartment = globalState.compartments[destination.droppableId];

      if (homeCompartment === foreignCompartment) {
        const newModulesList = Array.from(homeModulesList);
        newModulesList.splice(source.index, 1);
        newModulesList.splice(destination.index, 0, draggableId);

        const newHome = {
          ...homeCompartment,
          modulesOrderedList: newModulesList,
        };

        const newState = {
          ...globalState,
          compartments: {
            ...globalState.compartments,
            [newHome.id]: newHome,
          },
        };

        setGlobalState(newState);
        return;
      } else {
        const foreignModulesList = [...foreignCompartment.modulesOrderedList]
        // removing module id from the source list
        const newHomeModulesList = Array.from(homeModulesList)
        newHomeModulesList.splice(source.index, 1);

        const newHome = {
          ...homeCompartment,
          modulesOrderedList: newHomeModulesList
        };
        // adding the module id to the destination list                       
        foreignModulesList.splice(destination.index, 0, draggableId);

        const newForeign = {
          ...foreignCompartment,
          modulesOrderedList: foreignModulesList
        };
        
        const newState = {
          ...globalState,
          compartments: {
            ...globalState.compartments,
            [newHome.id]: newHome,
            [newForeign.id]: newForeign
          }
        };

        setGlobalState(newState);
        return;
      }
    }
    // end of drop logic for type 'module'

    // drop logic for type 'switch'
    if (type === 'switch'){
      const homeModule = globalState.modules[source.droppableId]
      const homeSwitchesList = homeModule.switchesOrderedList;

      const foreignModule = globalState.modules[destination.droppableId];

      if (homeModule === foreignModule) {
        const newSwitchesList = Array.from(homeSwitchesList);
        newSwitchesList.splice(source.index, 1);
        newSwitchesList.splice(destination.index, 0, draggableId);

        const newHome = {
          ...homeModule,
          switchesOrderedList: newSwitchesList,
        };

        const newState = {
          ...globalState,
          modules: {
            ...globalState.modules,
            [newHome.id]: newHome,
          },
        };

        setGlobalState(newState);
        return;
      } else {
        const foreignModulesList = [...foreignModule.switchesOrderedList]
        // removing module id from the source list
        const newHomeModulesList = Array.from(homeSwitchesList)
        newHomeModulesList.splice(source.index, 1);

        const newHome = {
          ...homeModule,
          switchesOrderedList: newHomeModulesList
        };
        // adding the module id to the destination list                       
        foreignModulesList.splice(destination.index, 0, draggableId);

        const newForeign = {
          ...foreignModule,
          switchesOrderedList: foreignModulesList
        };
        
        const newState = {
          ...globalState,
          modules: {
            ...globalState.modules,
            [newHome.id]: newHome,
            [newForeign.id]: newForeign
          }
        };

        setGlobalState(newState);
        return;
      }
    }
    // end of drop logic for type 'switch'
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
