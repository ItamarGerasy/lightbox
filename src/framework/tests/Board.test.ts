import { Board } from "../Board";
import { defaultBoardDimensions, defaultSwitchDimensions, defaultModuleDimensions, defaultCompartmentDimensions } from "../../components/general/generalTypes";

describe("Board", () => {

    it("Should Create an empty Board", () => {
        const board = new Board()

        expect(board.name).toBe("Board")
        expect(board.dimensions.width).toBe(defaultBoardDimensions.width)
        expect(board.dimensions.height).toBe(defaultBoardDimensions.height)
        expect(board.dimensions.depth).toBe(defaultBoardDimensions.depth)

        expect(board.freeWidth).toBe(defaultBoardDimensions.width)

        expect(board.compObjList).toEqual([])
    })

    it("Should Create an empty comaprtment and add it to the board", () => {
        const board = new Board()
        let succes = board.createCompartment({name: 'comp1'})
        const cm = board.compObjList[0]

        expect(succes).toBe(true)
        expect(cm.name).toBe('comp1')
        expect(board.compartments.get(cm.id)).toBe(cm)
        expect(board.freeWidth).toBe(board.dimensions.width - cm.dimensions.width)
    })


    it('Should add 3 compartments to the board', () => {
        const board = new Board()

        board.createCompartment({name: 'comp1'})
        board.createCompartment({name: 'comp2'})
        board.createCompartment({name: 'comp3'})

        expect(board.compObjList.length).toBe(3)
        expect(board.freeWidth).toBe(0)
        expect(board.compartments.amount).toBe(3)
    })

    it('Should fail to create a compartment if the sizes are too big', () => {
        const board = new Board()
        let tryWidth = board.createCompartment({name: 'comp1', dimensions: {width: defaultBoardDimensions.width + 1, height: 1, depth: 1}})
        let tryHeight = board.createCompartment({name: 'comp1', dimensions: {width: 1, height: defaultBoardDimensions.height + 1, depth: 1}})
        let tryDepth = board.createCompartment({name: 'comp1', dimensions: {width: 1, height: 1, depth: defaultBoardDimensions.depth + 1}})
        expect(tryDepth).toBe(false)
        expect(tryHeight).toBe(false)
        expect(tryWidth).toBe(false)
    })

    it('Should fail to add compartment if free width is not big enough', () => {
        const board = new Board()

        let goodPath = board.createCompartment({name: 'comp1', dimensions: {width: board.dimensions.width, height: 1, depth: 1}})
        expect(goodPath).toBe(true)

        let badPath = board.createCompartment({name: 'comp1', dimensions: {width: 1, height: 1, depth: 1}})
        expect(badPath).toBe(false) 
    })

    it('Shoudl succesfully change dimesnsions of board', () => {
        const board = new Board()
        board.createCompartment({name: 'comp1'})
        const cm = board.compObjList[0]

        board.dimensions = { width: cm.dimensions.width, height: cm.dimensions.height, depth: cm.dimensions.depth }

        expect(board.dimensions.width).toBe(cm.dimensions.width)
        expect(board.dimensions.height).toBe(cm.dimensions.height)
        expect(board.dimensions.depth).toBe(cm.dimensions.depth)
    })

    it('Should fail to change dimesnsions of board if the sizes are too big', () => {
        const board = new Board()
        board.createCompartment({name: 'comp1'})
        const cm = board.compObjList[0]
        
        expect(() => board.dimensions = { width: cm.dimensions.width - 1, height: cm.dimensions.height, depth: cm.dimensions.depth}).toThrow()
        expect(() => board.dimensions = { width: cm.dimensions.width, height: cm.dimensions.height - 1, depth: cm.dimensions.depth}).toThrow()
        expect(() => board.dimensions = { width: cm.dimensions.width, height: cm.dimensions.height, depth: cm.dimensions.depth - 1}).toThrow()
    })

    it("Should remove compartment and all its modules", () => {
        const board = new Board()
        const swArr1 = board.switches.createNewSwitchesArray(3, "des1", "1X16A", "feed1")
        const swArr2 = board.switches.createNewSwitchesArray(3, "des2", "2X16A", "feed2")
        const [md1, md2] = board.modules.createNewModulesArray({modulesAmount: 2})
        md1.addSwitches(swArr1)
        md2.addSwitches(swArr2)
        board.createCompartment({name: 'comp1', moduleObjList: [md1, md2]})
        
        expect(board.compartments.amount).toBe(1)
        expect(board.modules.amount).toBe(2)
        expect(board.switches.amount).toBe(6)

        const cm = board.compartments.get('c1')
        expect(board.compartments.hasCompartment(cm.id)).toBeTruthy()
        expect(cm.modulesAmount).toBe(2)

        board.deleteCompartmentAndModules(cm.id)

        expect(board.compartments.amount).toBe(0)
        expect(board.modules.amount).toBe(0)
        expect(board.switches.amount).toBe(0)
        expect(board.compObjList).toEqual([])
        expect(board.freeWidth).toBe(board.dimensions.width)
        expect(board.compartments.hasCompartment(cm.id)).toBeFalsy()
        expect(() => board.compartments.get(cm.id)).toThrow()
    })


    it('Should clear the board and all its compartments and modules', () => {
        const board = new Board()
        console.log(`defaultSwitchDimensions: ${JSON.stringify(defaultSwitchDimensions)} \n
        defaultModuleDimensions: ${JSON.stringify(defaultModuleDimensions)} \n
        defaultCompartmentDimensions: ${JSON.stringify(defaultCompartmentDimensions)} \n
        defaultBoardDimensions: ${JSON.stringify(defaultBoardDimensions)}`)
        expect(board.freeWidth).toBe(board.dimensions.width)
        expect(board.dimensions.width).toBe(defaultBoardDimensions.width)
        expect(board.dimensions.width).toBe(175 * 3)

        const swArr1 = board.switches.createNewSwitchesArray(3, "des1", "1X16A", "feed1")
        const swArr2 = board.switches.createNewSwitchesArray(3, "des2", "2X16A", "feed2")
        const [md1, md2] = board.modules.createNewModulesArray({modulesAmount: 2})
        md1.addSwitches(swArr1)
        md2.addSwitches(swArr2)
        board.createCompartment({name: 'comp1', moduleObjList: [md1, md2]})
        expect(board.freeWidth).toBe(board.dimensions.width - 175)

        const swArr3 = board.switches.createNewSwitchesArray(3, "des1", "1X16A", "feed1")
        const swArr4 = board.switches.createNewSwitchesArray(3, "des2", "2X16A", "feed2")
        const [md3, md4] = board.modules.createNewModulesArray({modulesAmount: 2})
        md3.addSwitches(swArr3)
        md4.addSwitches(swArr4)
        board.createCompartment({name: 'comp2', moduleObjList: [md3, md4]})
        expect(board.freeWidth).toBe(board.dimensions.width - 175 * 2)

        expect(board.compartments.amount).toBe(2)
        expect(board.compObjList.length).toBe(2)
        expect(board.modules.amount).toBe(4)
        expect(board.switches.amount).toBe(12)

        board.clearBoard()

        expect(board.compartments.amount).toBe(0)
        expect(board.modules.amount).toBe(0)
        expect(board.switches.amount).toBe(0)
        expect(board.compObjList).toEqual([])
        expect(board.freeWidth).toBe(board.dimensions.width)
    })
})