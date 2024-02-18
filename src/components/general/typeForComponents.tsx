import { DropResult } from "react-beautiful-dnd"
import { SwitchesMap, Switch as SwitchType } from "../../framework/Switch"
import { Module, ModulesMap } from "../../framework/Module";

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

export type GlobalState = {
  boardWidth: number,
  boardHeight: number,
  boardDepth: number,
  compartmentsOrder: Array<string>,
  compartments: Compartments,
  modules: ModulesMap<Module>,
  switches: SwitchesMap<SwitchType>,
}

export type GlobalStateContextType = {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  actions: {
    crud: {
      deleteSwitch: (switchId: string) => void;
      deleteModuleWithSwitches: (moduleId: string) => void;
      deleteCompartmentAndModules: (comratmentId: string) => void;
    },
    dndActions: {
      droppedCompratment: (result: DropResult) => void;
      droppedModule: (result: DropResult) => void;
      droppedSwitch: (result: DropResult) => void;
    }
  }
}