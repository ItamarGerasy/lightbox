// Module.tsx
import { ModuleStyle } from "./Module.styles";
import { Module as ModuleType, Switches, GlobalStateContextType } from "./typeForComponents";
import { withGlobalState } from "./MainAppState";
import Switch from "./Switch";
import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./StrictModeDroppable";
import { SwitchesList } from "./Module.styles";
import { InfoDragRemove } from './InfoDragRemove'

type InnerSwitchesListProps = {
  switchesOrderedList: Array<string>;
  switches: Switches;
}

class InnerSwitchesList extends React.Component<InnerSwitchesListProps> {
  
  shouldComponentUpdate(nextProps: InnerSwitchesListProps) {
    if (nextProps === this.props) {
      return false;
    }
    return true;
  }

  render(): React.ReactNode{
    const { switches, switchesOrderedList } = this.props;

    return switchesOrderedList.map((moduleId, index) => (
      <Switch key={moduleId} switch={switches[moduleId]} index={index} />))
  }
}

type ModuleProps = {
  module: ModuleType;
  index: number;
}

class Module extends React.Component<GlobalStateContextType & ModuleProps>{

  shouldComponentUpdate(nextProps: ModuleProps) {
    if (nextProps === this.props) {
      return false;
    }
    return true;
  }
  
  render(): React.ReactNode {
    const { globalState } = this.props;
    const module = this.props.module
    const dimensions = module.dimensions
    const moduleDimensionsString = dimensions ? `width:${dimensions.width} height: ${dimensions.height} depth:${dimensions.depth}` : '';
    const modleInfoString = `Name: ${module.name} \n Feed: ${module.feed} \n Switches: ${module.switchesOrderedList.length} \n ${moduleDimensionsString}`;
    
    
    return (
      <Draggable draggableId={module.id} index={this.props.index}>
        {(provided, snapshot) => (
          // dnd droppable component for switches
          <ModuleStyle  
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <InfoDragRemove provided={provided} infoStr={modleInfoString} />
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
}
export default withGlobalState(Module)
