import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Compartments, Modules, Switches, GlobalState, GlobalStateContextType } from './general/typeForComponents';

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
      modulesOrderedList: ['m-1', 'm-2'],
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
modules: {
  'm-1': {
    id: 'm-1',
    name: 'module1',
      feed: 'PC',
      switchesOrderedList: ['s-1', 's-2'],
      dimensions: {
        width: 10000,
        height: 85,
        depth: 69
      },
    },
    'm-2': {
      id: 'm-2',
      name: 'module2',
      feed: 'PC',
      switchesOrderedList: ['s-3', 's-4'],
      dimensions: {
        width: 10000,
        height: 85,
        depth: 69
      },
    }
  } as Modules,
  switches: {
    's-1': {
      id: 's-1',
      name: 'switch1',
      description: 'lighting',
      prefix: '1X16A',
      size: 1,
      feed: "PC",
      dimensions: {
        width: 17.5,
        height: 85,
        depth: 69
      } 
    },
    's-2': {
      id: 's-2',
      name: 'switch2',
      description: 'aircon',
      prefix: '2X16A',
      size: 2,
      feed: "PC",
      dimensions: {
        width: 17.5,
        height: 85,
        depth: 69
      } 
    },
    's-3': {
      id: 's-3',
      name: 'switch3',
      description: 'aircon',
      prefix: '3X16A',
      size: 3,
      feed: "PC",
      dimensions: {
        width: 17.5,
        height: 85,
        depth: 69
      } 
    },
    's-4': {
      id: 's-4',
      name: 'switch4',
      description: 'aircon',
      prefix: '4X16A',
      size: 4,
      feed: "PC",
      dimensions: {
        width: 17.5,
        height: 85,
        depth: 69
      } 
    },
  } as Switches
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);
// Define the type for the children prop
interface GlobalStateProviderProps {
  children: ReactNode;
}
export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>(initialAppGlobalState);

  const actions = {
    deleteSwitch: (switchId: string) => {
      let parentModule
      const newGlobalState = {...globalState}
    
      // validating switch id exists
      if ( !(switchId in newGlobalState.switches)){
          throw new Error(`switch ID ${switchId} doesn't exist`);
      }
      // removing switch from the switches map
      delete newGlobalState.switches[switchId]
    
      // finding the parent module
      // eslint-disable-next-line
      for (const [moduleId, moduleObj] of Object.entries(newGlobalState.modules)) {
          if(moduleObj.switchesOrderedList.indexOf(switchId) !== -1){
              parentModule = moduleObj
          }
      }
      if (!parentModule){
          throw new Error(`no parent module found for switch: ${switchId}`);
      }
    
      // removing switch from the module switches list
      const switchIndex = parentModule.switchesOrderedList.indexOf(switchId)
          parentModule.switchesOrderedList.splice(switchIndex, 1)
    
      setGlobalState(newGlobalState)
    },
    deleteModuleWithSwitches: (moduleId: string) => {
      let parentCompartment
      const module = globalState.modules[moduleId]
      const newGlobalState = {...globalState}
      const switchesToDelete = module.switchesOrderedList

      // validating module id exists
      if ( !(moduleId in newGlobalState.modules)){
          throw new Error(`module ID ${moduleId} doesn't exist`);
      }
      // removing module from the modules map
      delete newGlobalState.modules[moduleId]

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
      for( const switchId in switchesToDelete ){
          delete newGlobalState.switches[switchId]
      }

      setGlobalState(newGlobalState)
    },
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
