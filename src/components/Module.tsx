// Module.tsx
import { ModuleStyle } from "./Module.styles";
import { Module as ModuleType, Switches } from "./general/typeForComponents";
import { useGlobalState, withGlobalState } from "./MainAppState";
import Switch from "./Switches/Switch";
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./general/StrictModeDroppable";
import { SwitchesList } from "./Module.styles";
import { ModuleMenu } from './ModuleMenu'
import { FlexBox } from "./general/GeneralStyles.styles";
import Collapse from '@mui/material/Collapse';

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
  const [isHovered, setIsHovered] = useState(false);
  const { globalState } = useGlobalState()

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <Draggable draggableId={module.id} index={index} >
      {(provided, snapshot) => (
        // dnd droppable component for switches
        <ModuleStyle  
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Collapse orientation="horizontal" in={isHovered}>
            <ModuleMenu provided={provided} module={module} />
          </Collapse>
          {/* dnd droppable component for modules */}
          <StrictModeDroppable droppableId={module.id} type='switch' direction="horizontal">
            {(provided, snapshot) => {
              // the next code line is used to cancel isHover in case the hover is for DND purpose 
              // eslint-disable-next-line no-lone-blocks 
              {if(snapshot.isDraggingOver){setIsHovered(false)}}
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
