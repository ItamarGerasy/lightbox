import { DropResult } from "react-beautiful-dnd"
import { SwitchesMap, Switch as SwitchType } from "../../framework/Switch"
import { Module, ModulesMap } from "../../framework/Module"
import { Compartment, CompartmentsMap } from "../../framework/Compartment"

//typeForComponents.tsx
export type SwitchDetails = { switchSpecs: string; switchDescription: string; switchFeed: string};
export type SwitchDetailsArrays = Array<SwitchDetails>;

export type GlobalState = {
  boardWidth: number,
  boardHeight: number,
  boardDepth: number,
  compartmentsOrder: Array<Compartment>,
  compartments: CompartmentsMap<Compartment>,
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