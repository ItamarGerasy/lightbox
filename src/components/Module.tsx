// Module.tsx
import { ModuleStyle } from "./Module.styles";
import { Module as ModuleType, Switches, GlobalStateContextType } from "./general/typeForComponents";
import { withGlobalState } from "./MainAppState";
import Switch from "./Switches/Switch";
import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./general/StrictModeDroppable";
import { SwitchesList } from "./Module.styles";
import { InfoDragRemove } from './general/InfoDragRemove'

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
    
    return (
      <Draggable draggableId={module.id} index={this.props.index}>
        {(provided, snapshot) => (
          // dnd droppable component for switches
          <ModuleStyle  
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <InfoDragRemove provided={provided} module={this.props.module} />
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
