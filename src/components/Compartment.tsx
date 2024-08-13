// Compartment.tsx
import { CompartmentStyle, ModulesList } from './Compartmen.styles'
import Module from './Module'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { StrictModeDroppable } from './general/StrictModeDroppable'
import { Compartment as CompartmentType } from '../framework/Compartment'
import { Module as ModuleType } from '../framework/Module'
import { ColumnFlexBox, FlexBox, Title } from './general/GeneralStyles.styles'
import { CompartmentMenu } from './Menus/CompartmentMenu'
import CollapseMenu from './general/CollapseMenu'

type InnerModulesListProps = {
  modulesOrderedList: Array<ModuleType>
}

const InnerModulesList: React.FC<InnerModulesListProps> = ( { modulesOrderedList } ) => {
    return (
      <ColumnFlexBox>
        {modulesOrderedList.map((module: ModuleType, index: number) => (
          <Module key={module.id} module={module} index={index} />)
        )}
      </ColumnFlexBox>
    )
}

interface CompartmentProps {
  compartment: CompartmentType
  index: number
}

export const Compartment: React.FC<CompartmentProps> = ({ compartment, index }) => {

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
            <CollapseMenu Menu={CompartmentMenu} menuProps={{ compartment: compartment }} 
            orientation="horizontal" fontSize="small" />

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
                  <InnerModulesList modulesOrderedList={compartment.modulesObjList}/>
                  {provided.placeholder}
                </ModulesList>
              )
            }}
          </StrictModeDroppable>
        </CompartmentStyle>
    )}
    </Draggable>
  )
}
