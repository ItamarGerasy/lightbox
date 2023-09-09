// Compartment.tsx
import { CompartmentStyle, ModulesList } from './Compartmen.styles'
import Module from './Module';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './general/StrictModeDroppable'
import { useGlobalState } from './MainAppState';
import { Compartment as CompartmentType, Modules } from './general/typeForComponents';
import { Title } from './GeneralStyles.styles'

type InnerModulesListProps = {
  modulesOrderedList: Array<string>;
  modules: Modules;
}

class InnerModulesList extends React.Component<InnerModulesListProps> {
  
  shouldComponentUpdate(nextProps: InnerModulesListProps) {
    if (nextProps === this.props) {
      return false;
    }
    return true;
  }

  render(): React.ReactNode{
    const { modules, modulesOrderedList } = this.props;

    return modulesOrderedList.map((moduleId, index) => (
      <Module key={moduleId} module={modules[moduleId]} index={index} />))
  }
}

interface CompartmentProps {
  compartment: CompartmentType;
  index: number;
}

export const Compartment: React.FC<CompartmentProps> = ({ compartment, index }) => {
  const {globalState} = useGlobalState()

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
          {/* dragged component handle, which is the title of the compratment   */}
          <Title {...provided.dragHandleProps}>
            {compartment.id}
          </Title>

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



