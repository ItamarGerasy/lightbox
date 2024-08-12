// helpers.ts
// helpers functions for project
// Author: Itamar Gerasy

import { Board } from "./Board"

/** Return a default board, have 4 switches of sizes 1,2,3,4. has 2 Modules each containes 2 switches and 2 comaprtments one of which is empty */
export const createDefaultBoard = (): Board => {
    const initialBoard = new Board("Board")
    const sw1 = initialBoard.switches.createNewSwitch('lighting', '1X16A', "PC", 'switch1')
    const sw2 = initialBoard.switches.createNewSwitch('aircon', '2X16A', "PC", 'switch1')
    const sw3 = initialBoard.switches.createNewSwitch('aircon', '3X16A', "PC", 'switch1')
    const sw4 = initialBoard.switches.createNewSwitch('aircon', '4X16A', "PC", 'switch1')
    const [md1, md2] = initialBoard.modules.createNewModulesArray({modulesAmount: 2})
    md1.addSwitches([sw1, sw2])
    md2.addSwitches([sw3, sw4])
    initialBoard.createCompartment({name: 'compartment1', moduleObjList: [md1, md2]})
    initialBoard.createCompartment({name: 'compartment2', moduleObjList: []})
  
    return initialBoard
  }