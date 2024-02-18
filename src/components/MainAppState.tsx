import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Compartments, GlobalState, GlobalStateContextType } from './general/typeForComponents';
import { DropResult } from 'react-beautiful-dnd';
import { SwitchesMap, Switch as SwitchObj } from '../framework/Switch';
import { Module, ModulesMap } from '../framework/Module';
import { defaultSwitchDimensions } from './general/generalTypes';

const s1 = new SwitchObj(
  {id:'s1', name:'switch1', description:'lighting', prefix:'1X16A', feed:"PC",  dimensions:defaultSwitchDimensions})
const s2 = new SwitchObj(
  {id:'s2', name:'switch2', description:'aircon', prefix:'2X16A',  feed:"PC", dimensions:defaultSwitchDimensions})
const s3 = new SwitchObj(
  {id:'s3', name:'switch3', description:'aircon', prefix:'3X16A',  feed:"PC", dimensions:defaultSwitchDimensions})
const s4 = new SwitchObj(
  {id:'s4', name:'switch4', description:'aircon', prefix:'4X16A',  feed:"PC", dimensions: defaultSwitchDimensions})
const switchesArr = [s1, s2, s3, s4]  
const m1 = new Module(
  { id: 'm1', name: 'module1', feed: 'PC', switchesObjList: [s1, s2]})
const m2 = new Module(
  {id: 'm2', name: 'module2', feed: 'PC', switchesObjList: [s3, s4]})
const modulesArr = [m1, m2]  


export const initialAppGlobalState:GlobalState = {
  boardWidth: 200,
  boardHeight: 200,
  boardDepth: 50,
  compartmentsOrder: ['c-1', 'c-2'],
  compartments: {
    'c-1':
    { id: 'c-1',
      name: 'compartment1',
      feed: 'PC',
      modulesOrderedList: ['m1', 'm2'],
      dimensions: {
        width: 200,
        height: 200,
        depth: 50
      }, 
    },
    'c-2':
    { id: 'c-2',
      name: 'compartment2',
      feed: 'PC',
      modulesOrderedList: [],
      dimensions: {
        width: 200,
        height: 200,
        depth: 50
      }, 
    },
  } as Compartments,
  modules: new ModulesMap(modulesArr),
  switches: new SwitchesMap(switchesArr)
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);
// Define the type for the children prop
interface GlobalStateProviderProps {
  children: ReactNode;
}
export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>(initialAppGlobalState);

  const actions = {
    crud: {
      deleteSwitch: (switchId: string) => {
        const newGlobalState = {...globalState}
      
        // validating switch id exists
        if ( !(newGlobalState.switches.hasSwitch(switchId))){
            throw new Error(`switch ID ${switchId} doesn't exist`);
        }
        // removing switch from the switches map
        const switchToRemove = newGlobalState.switches.get(switchId)
        let parentModule = switchToRemove!.myModule

        if(!parentModule){
          for (const [moduleId, moduleObj] of Object.entries(newGlobalState.modules)) {
              if(moduleObj.getSwitchIndexById(switchId) !== -1){
                  parentModule = moduleObj
              }
          }
        }

        if (!parentModule){
            throw new Error(`no parent module found for switch: ${switchId}`);
        }
      
        // removing switch from the module and switches map
        parentModule.removeSwitch(switchId)
        newGlobalState.switches.removeSwitch(switchId)
      
        setGlobalState(newGlobalState)
      },
      deleteModuleWithSwitches: (moduleId: string) => {
        let parentCompartment
        const module = globalState.modules.get(moduleId)
        const newGlobalState = {...globalState}
        const switchesToDelete = module!.switchesObjList
  
        // validating module id exists
        if ( !(moduleId in newGlobalState.modules)){
            throw new Error(`module ID ${moduleId} doesn't exist`);
        }
        // // removing module from the modules map
        // delete newGlobalState.modules.get(moduleId)
  
        // finding the parent compartment
        // eslint-disable-next-line
        for (const [compartmentId, compartmentObj] of Object.entries(newGlobalState.compartments)) {
            if(compartmentObj.modulesOrderedList.indexOf(moduleId) !== -1){
                parentCompartment = compartmentObj
            }
        }
        if (!parentCompartment){
            throw new Error(`no parent compartment found for module: ${moduleId}`);
        }
  
        // removing module ID from the compratment modules list
        const moduleIndex = parentCompartment.modulesOrderedList.indexOf(moduleId)
        parentCompartment.modulesOrderedList.splice(moduleIndex, 1)
  
        // removing switches from global state
        for( const sw of switchesToDelete ){
          newGlobalState.switches.removeSwitch(sw.id)
        }
        console.log(`deleted module: ${JSON.stringify(module!.id)}`)
        setGlobalState(newGlobalState)
      },
      deleteCompartmentAndModules: (compartmentId: string) => {
        const newGlobalState = {...globalState}
        const compartment = newGlobalState.compartments[compartmentId]
        const modulesToDelete = compartment.modulesOrderedList // array of module IDs
        let switchesToDelete: Array<string> = [] // array of switched IDs

        // validating module id exists
        if ( !(compartmentId in globalState.compartments)){
          throw new Error(`module ID ${compartmentId} doesn't exist`);
        }
        
        // for(const moduleId of modulesToDelete){
        //   const module = newGlobalState.modules[moduleId]
        //   switchesToDelete = switchesToDelete.concat(module.switchesObjList)
        //   delete newGlobalState.modules[moduleId]
        // }

        for(const switchId of switchesToDelete){
          newGlobalState.switches.removeSwitch(switchId)
        }
        
        delete newGlobalState.compartments[compartmentId]

        // removing module ID from the compratment modules list
        const compartmentIndex = newGlobalState.compartmentsOrder.indexOf(compartmentId)
        newGlobalState.compartmentsOrder.splice(compartmentIndex, 1)
        
        console.log(`new global state: ${JSON.stringify(newGlobalState)}`)
        setGlobalState(newGlobalState)
      }
    },
    dndActions: {
      droppedCompratment: (result: DropResult) => {
        const { destination, source, draggableId } = result;
  
        const newCompartmentsOrder = Array.from(globalState.compartmentsOrder);
        newCompartmentsOrder.splice(source.index, 1);
        // @ts-ignore destination might be null, we verified it before
        newCompartmentsOrder.splice(destination.index, 0, draggableId);
  
        // Update the global state with the new order
        setGlobalState((prevState) => ({
          ...prevState,
          compartmentsOrder: newCompartmentsOrder,
        }));  
      },
      droppedModule: (result: DropResult) => {
        const { destination, source, draggableId} = result;
    
        if(!destination){
          return;
        }
    
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
      },
      droppedSwitch: (result: DropResult) => {
        const { destination, source } = result;
    
        if(!destination){
          return;
        }

        const newGlobalState = {...globalState}
        const homeModule = newGlobalState.modules.get(source.droppableId)
        const foreignModule = newGlobalState.modules.get(destination.droppableId)
  
        if (homeModule === foreignModule) {
          const sw = homeModule!.removeSwitchAtIndex(source.index)
          homeModule!.addSwitch(sw, destination.index)
  
          setGlobalState(newGlobalState);
          return;
        } else {
          // removing module id from the home module list
          const sw = homeModule!.removeSwitchAtIndex(source.index)
          foreignModule!.addSwitch(sw, destination.index)
  
          setGlobalState(newGlobalState);
        }
      },
    }
  }
  
  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState, actions }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const withGlobalState = <P extends object>(
  WrappedComponent: React.ComponentType<P & GlobalStateContextType>
) => {
  return (props: P) => {
    const { globalState , setGlobalState, actions} = useGlobalState();

    return <WrappedComponent globalState={globalState} setGlobalState={setGlobalState} actions={actions} {...props} />;
  };
};
