//typeForComponents.tsx
export type SwitchDetails = { switchSpecs: string; switchDescription: string; switchFeed: string};
export type SwitchDetailsArrays = Array<SwitchDetails>;

// type Cmpartment represent a single cmpartment
export type Compartment = {
    id: string,
    name: string,
    feed: string,
    // modulesOrderedList will be responsible to hold the compartment modules
    // in a certain order that will be changed depending on use interactions 
    modulesOrderedList: Array<string>,
    dimensions?: {
      width: number,
      height: number,
      depth: number
    },
}
  
// type Cmpartment represent an object, key is a compartment id, and value is the compartment object
export type Compartments = Record<string, Compartment>;

// type Switch represent a single module
export type Module = {
  id: string,
  name: string,
  feed?: string,
  // switchesOrderedList will be responsible to hold the modules switches
  // in a certain order that will be changed depending on use interactions 
  switchesOrderedList: Array<string>,
  dimensions?: {
    width: number,
    height: number,
    depth: number
  },
}
  
  // type Modules represent an object, key is a module id, and value is the module object
  export type Modules = Record<string, Module>;
  
  // type Switch represent a single switch
  export type Switch = {
    id: string,
    name: string,
    description?: string,
    prefix: string,
    size: number,
    feed?: string,
    dimensions?: {
      width: number,
      height: number,
      depth: number
    }
  }
  
  // type Switches represent an object, key is a switch id, and value is the switch object
  export type Switches = Record<string, Switch>;
  
  export type GlobalState = {
    boardWidth: number,
    boardHeight: number,
    boardDepth: number,
    compartmentsOrder: Array<string>,
    compartments: Compartments,
    modules: Modules,
    switches: Switches,
  }

  export type GlobalStateContextType = {
    globalState: GlobalState;
    setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
    actions: {
      deleteSwitch: (switchId: string) => void;
      deleteModuleWithSwitches: (moduleId: string) => void;
    }
  }