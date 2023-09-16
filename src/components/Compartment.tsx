// Compartment.tsx
import { CompartmentStyle, ModulesList } from './Compartmen.styles'
import Module from './Module';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './general/StrictModeDroppable'
import { useGlobalState } from './MainAppState';
import { Compartment as CompartmentType, Modules } from './general/typeForComponents';
import { ColumnFlexBox, FlexBox, Title } from './general/GeneralStyles.styles'
import Collapse from '@mui/material/Collapse';
import { CompartmentMenu } from './CompartmentMenu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClickAwayListener from '@mui/material/ClickAwayListener';

type InnerModulesListProps = {
  modulesOrderedList: Array<string>;
  modules: Modules;
}

const InnerModulesList: React.FC<InnerModulesListProps> = ( { modules, modulesOrderedList } ) => {
    return (
      <ColumnFlexBox>
        {modulesOrderedList.map((moduleId: string, index: number) => (
          <Module key={moduleId} module={modules[moduleId]} index={index} />)
        )}
      </ColumnFlexBox>
    )
}

interface CompartmentProps {
  compartment: CompartmentType;
  index: number;
}

export const Compartment: React.FC<CompartmentProps> = ({ compartment, index }) => {
  const {globalState} = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((isOpen => !isOpen))
  }

  return (
    // dnd Draggable
    <Draggable draggableId={compartment.id} index={index}> 
    {(provided, snapshot) => (

        // actual dragged component
        <CompartmentStyle 
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <FlexBox style={{height: "10%", flex: 0}}>
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>  
                  <IconButton aria-label="options" onClick={toggleOpen} hidden={isOpen} sx={{width: "10px"}}>
                    <MoreVertIcon fontSize='small'/>
                  </IconButton>
            </ClickAwayListener>
            <Collapse orientation="horizontal" in={isOpen}>
              <CompartmentMenu compartment={compartment} />
            </Collapse>

            {/* dragged component handle, which is the title of the compratment   */}
            <Title {...provided.dragHandleProps}>
              {compartment.name}
            </Title>
          </FlexBox>
          {/* dnd droppable component for modules */}
          <StrictModeDroppable droppableId={compartment.id} type='module' direction="vertical">
            {(provided, snapshot) => {
              return(
                <ModulesList 
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}>
                  <InnerModulesList modulesOrderedList={compartment.modulesOrderedList} modules={globalState.modules}/>
                  {provided.placeholder}
                </ModulesList>
              )
            }}
          </StrictModeDroppable>
        </CompartmentStyle>
    )}
    </Draggable>
  );
};



