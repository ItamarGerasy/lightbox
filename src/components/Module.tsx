// Module.tsx
import { ModuleStyle } from "./Module.styles";
import { Module as ModuleType, Switches } from "./general/typeForComponents";
import { useGlobalState, withGlobalState } from "./MainAppState";
import Switch from "./Switches/Switch";
import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./general/StrictModeDroppable";
import { SwitchesList } from "./Module.styles";
import { InfoDragRemove } from './general/InfoDragRemove'
import { FlexBox } from "./general/GeneralStyles.styles";

type InnerSwitchesListProps = {
  switchesOrderedList: Array<string>;
  switches: Switches;
}

const InnerSwitchesList: React.FC<InnerSwitchesListProps> = ({switchesOrderedList, switches}) => {
    return (
    <FlexBox>
      {switchesOrderedList.map((moduleId: string, index: number) => (
        <Switch key={moduleId} switch={switches[moduleId]} index={index} />
      ))}
    </FlexBox>)
}

type ModuleProps = {
  module: ModuleType;
  index: number;
}

const Module: React.FC<ModuleProps> = ({module, index}) => {
  const { globalState } = useGlobalState()
  
  return (
    <Draggable draggableId={module.id} index={index}>
      {(provided, snapshot) => (
        // dnd droppable component for switches
        <ModuleStyle  
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <InfoDragRemove provided={provided} module={module} />
          {/* dnd droppable component for modules */}
          <StrictModeDroppable droppableId={module.id} type='switch' direction="horizontal">
            {(provided, snapshot) => {
              return(
                <SwitchesList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                  <InnerSwitchesList switches={globalState.switches} switchesOrderedList={module.switchesOrderedList} />
                  {provided.placeholder}
                </SwitchesList>
              )
            }}
          </StrictModeDroppable>
        </ModuleStyle> 
      )}
    </Draggable>
  );    

}
export default withGlobalState(Module)
