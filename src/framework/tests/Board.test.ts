import { Board } from "../Board";
import { Switch } from "../Switch"
import { defaultBoardDimensions, defaultSwitchDimensions, defaultModuleDimensions, defaultCompartmentDimensions } from "../../components/general/generalTypes";
import exp from "constants";

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

    test("Should create switches array with all parameters", () => {
        const board = new Board()
        const [cm1] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 1})

        const fullSwArr = board.switches.createNewSwitchesArray(9, "des", "1X16A", "feed") 
        console.log(JSON.stringify(fullSwArr.map(sw => sw.id)))
        expect(fullSwArr.length).toBe(9)
        expect(board.switches.amount).toBe(9)
        
        const mdArr = board.modules.createNewModulesArray({modulesAmount: 6})
        expect(mdArr.length).toBe(6)
        expect(board.modules.amount).toBe(6)
        
        mdArr.forEach(md => { 
            md.addSwitches(fullSwArr)
            expect(md.switchesAmount).toBe(9)
        })
        cm1.addModules(mdArr)
        expect(cm1.modulesAmount).toBe(6)
        
        const swToAdd = board.switches.createNewSwitchesArray(6, "des", "1X16A", "feed")
        console.log(JSON.stringify(swToAdd.map(sw => sw.id)))
        expect(swToAdd.length).toBe(6)
        expect(board.switches.amount).toBe(15)
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


    it('Should delete a switch from the board', () => {
        const board = new Board()
        const swArr = board.switches.createNewSwitchesArray(2, "des", "1X16A", "feed")
        const [module1] = board.modules.createNewModulesArray({modulesAmount: 1})
        module1.addSwitches(swArr)
        board.createCompartment({name: 'comp1', moduleObjList: [module1]})

        expect(board.switches.amount).toBe(2)

        const swToDelete = swArr[0]
        console.log(`switch to be deleted ${swToDelete.id}`)
        board.deleteSwitch(swToDelete.id)

        expect(board.switches.amount).toBe(1)
        expect(module1.switchesAmount).toBe(1)
        expect(module1.switchesObjList[0].id).toBe('s2')

    })


    describe('Board.Clone()', () => {

        const board = new Board()

        const swArr1 = board.switches.createNewSwitchesArray(3, "des1", "1X16A", "feed1")
        const swArr2 = board.switches.createNewSwitchesArray(3, "des2", "2X16A", "feed2")
        const [md1, md2] = board.modules.createNewModulesArray({modulesAmount: 2})
        md1.addSwitches(swArr1)
        md2.addSwitches(swArr2)
        board.createCompartment({name: 'comp1', moduleObjList: [md1, md2]})

        const cloneBoard = board.clone()

        it('Should clone board properties', () => {
            expect(cloneBoard.dimensions).not.toBe(board.dimensions)
            expect(cloneBoard.dimensions.width).toBe(board.dimensions.width)
            expect(cloneBoard.dimensions.height).toBe(board.dimensions.height)
            expect(cloneBoard.dimensions.depth).toBe(board.dimensions.depth)
            expect(cloneBoard.name).toBe(board.name)
        })

        it('Should clone the compartments', () => {
            expect(cloneBoard.compartments.amount).toBe(board.compartments.amount)
            expect(cloneBoard.compObjList).toEqual(board.compObjList)

            cloneBoard.compartments.forEach(cloneCm => {
                const originalCm = board.compartments.get(cloneCm.id)
                expect(originalCm).not.toBeNull()
                expect(cloneCm).not.toBe(originalCm)
                expect(cloneCm).toEqual(originalCm)
            })
        })


        it('Should clone the modules', () => {
            expect(cloneBoard.modules.amount).toBe(board.modules.amount)

            cloneBoard.modules.forEach((cloneModule, id) => {
                const originalModule = board.modules.get(id)
                expect(originalModule).not.toBeNull()
                expect(cloneModule).not.toBe(originalModule)
                expect(cloneModule).toEqual(originalModule)
                expect(cloneModule.myCompartment).not.toBe(originalModule.myCompartment)
                expect(cloneModule.myCompartment).toEqual(originalModule.myCompartment)
            })
        })

        it('Should delete module with switches', () => {
            const board = new Board()
            const swArr1 = board.switches.createNewSwitchesArray(3, "des1", "1X16A", "feed1")
            const swArr2 = board.switches.createNewSwitchesArray(3, "des2", "2X16A", "feed2")
            const [md1, md2] = board.modules.createNewModulesArray({modulesAmount: 2})
            md1.addSwitches(swArr1)
            md2.addSwitches(swArr2)
            board.createCompartment({name: 'comp1', moduleObjList: [md1, md2]})
            const compartment = board.compartments.get('c1')
            
            const originalAmountModules = board.modules.amount
            const originalAmountSwitches = board.switches.amount
            const originalAmountCompartments = board.compartments.amount
            
            board.deleteModuleWithSwitches(md1.id)
            
            expect(md1.myCompartment).toBeUndefined()
            expect(board.modules.amount).toBe(originalAmountModules - 1)
            expect(board.switches.amount).toBe(originalAmountSwitches - swArr1.length)
            expect(board.compartments.amount).toBe(originalAmountCompartments)
            expect(compartment.modulesObjList.length).toBe(1)
        })

        it('Should clone the switches', () => {
            expect(cloneBoard.switches.amount).toBe(board.switches.amount)

            cloneBoard.switches.forEach((cloneSwitch, id) => {
                const originalSwitch = board.switches.get(id)
                expect(originalSwitch).not.toBeNull()
                expect(cloneSwitch).not.toBe(originalSwitch)
                expect(cloneSwitch).toEqual(originalSwitch)
                expect(cloneSwitch.myModule).not.toBe(originalSwitch!.myModule)
                expect(cloneSwitch.myModule).toEqual(originalSwitch!.myModule)
            })
        })
    })

    
    describe('addSwitchesToOneModule', () => {
        it('Should add Switches to one module', () => {
            const board = new Board()
            
            const swArr1 = board.switches.createNewSwitchesArray(2, "", "5X16A", "")
            const swArr2 = board.switches.createNewSwitchesArray(2, "", "5X16A", "")
            const swArr3 = board.switches.createNewSwitchesArray(1, "", "5X16A", "")
            const newSwArr = board.switches.createNewSwitchesArray(5, "", "1X16A", "")

            const md1 = board.modules.createNewModule({switchesObjList: swArr1})
            const md2 = board.modules.createNewModule({switchesObjList: swArr2})
            const md3 = board.modules.createNewModule({switchesObjList: swArr3})

            expect(md1.isFull()).toBeTruthy()
            expect(md2.isFull()).toBeTruthy()
            expect(md3.isFull()).toBeFalsy()

            let succes = board.addSwitchesToOneModule(newSwArr)

            expect(succes).toBeTruthy()
            expect(md3.isFull()).toBeTruthy()
            expect(md3.switchesObjList).toEqual([...swArr3, ...newSwArr])

        })
    
        it('Should not add switches to one module', () => {
            const board = new Board()

            const swArr = board.switches.createNewSwitchesArray(3, "des", "1X16A", "feed")
            const newSwArr = board.switches.createNewSwitchesArray(8, "des", "1X16A", "feed")

            const md1 = board.modules.createNewModule({switchesObjList: swArr})

            expect(md1.switchesAmount).toBe(3)

            let succes = board.addSwitchesToOneModule(newSwArr)

            expect(md1.switchesAmount).toBe(3)
            expect(succes).toBeFalsy()
        })
    })

    describe('addSwitchesToSeveralModules', () => {
        it('Should not be able to add switches to several modules', () => {
            const board = new Board()
            let swAmount = 8
            const swArr = board.switches.createNewSwitchesArray(swAmount, "des", "1X16A", "feed")
            const md1 = board.modules.createNewModule({switchesObjList: swArr})
            const md2 = board.modules.createNewModule({switchesObjList: swArr})

            let succes = board.addSwitchesToSeveralModules(swArr)
            expect(succes).toBeFalsy()
            expect(md1.switchesAmount).toBe(swAmount)
            expect(md2.switchesAmount).toBe(swAmount)
        })

        it('Should be able to add switches to one module', () => {
            const board = new Board()
            const copySwArr: Switch[] = []
            const fillingSwArr = board.switches.createNewSwitchesArray(5, "des", "2X16A", "feed")
            const swArr = board.switches.createNewSwitchesArray(3, "des", "1X16A", "feed")

            swArr.forEach(sw => copySwArr.push(sw))

            const EmptyMd = board.modules.createNewModule({})
            const fullMd = board.modules.createNewModule({switchesObjList: fillingSwArr})
            expect(fullMd.isFull).toBeTruthy()

            let succes = board.addSwitchesToSeveralModules(swArr)
            expect(succes).toBeTruthy()
            expect(EmptyMd.switchesObjList).toEqual(copySwArr)
            expect(EmptyMd.switchesAmount).toBe(copySwArr.length)
        })

        it('Should be able to add switches to several modules', () => {
            const board = new Board()
            const swArr9 = board.switches.createNewSwitchesArray(9, "des", "1X16A", "feed")
            const swArr5 = board.switches.createNewSwitchesArray(5, "des", "1X16A", "feed")
            const mdArr = board.modules.createNewModulesArray({modulesAmount: 5})

            mdArr.forEach(md =>  md.addSwitches(swArr9))
            const succes = board.addSwitchesToSeveralModules(swArr5)

            expect(succes).toBeTruthy()
            mdArr.forEach(md => {
                expect(md.switchesAmount).toBe(10)
                expect(md.isFull).toBeTruthy()
            })
        })
    })


    describe('addModuleAndAddSwitches', () => {
        it('Cannot do it if there is no space', () => {
            const board = new Board()
            const [cm1, cm2 ] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 2})

            const fillMdArr = board.modules.createNewModulesArray({modulesAmount: 12})
            const fillSwArr = board.switches.createNewSwitchesArray(9, "des", "1X16A", "feed")
            expect(fillSwArr.length).toBe(9)
            fillMdArr.forEach(md => {
                md.addSwitches(fillSwArr)
            })
            
            cm1.addModules(fillMdArr.splice(0, 6))
            cm2.addModules(fillMdArr.splice(0, 6))

            const swToAdd = board.switches.createNewSwitchesArray(13, "des", "1X16A", "feed")

            let succes = board.addModuleAndAddSwitches(swToAdd)

            expect(cm1.modulesAmount).toBe(6)
            expect(cm2.modulesAmount).toBe(6)
            fillMdArr.forEach(md => {
                expect(md.switchesAmount).toBe(9)
            })
            expect(succes).toBeFalsy()

        })

        it('Can do it to single compartment empty', () => {
            const board = new Board()
            const [cm1] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 1})

            const swToAdd = board.switches.createNewSwitchesArray(60, "des", "1X16A", "feed")
            let succes = board.addModuleAndAddSwitches(swToAdd)

            expect(succes).toBeTruthy()
            expect(board.switches.amount).toBe(60)
            expect(board.modules.amount).toBe(6)
            expect(cm1.modulesAmount).toBe(6)
            expect(cm1.isFull()).toBeTruthy()
        })

        it('Can do it to single compartment which is full, but have place for some switches', () => {
            const board = new Board()
            const [cm1] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 1})

            const fullSwArr = board.switches.createNewSwitchesArray(9, "des", "1X16A", "feed") 
            const mdArr = board.modules.createNewModulesArray({modulesAmount: 6})
            mdArr.forEach(md =>  md.addSwitches(fullSwArr))
            cm1.addModules(mdArr)

            const swToAdd = board.switches.createNewSwitchesArray(6, "des", "1X16A", "feed")
            let succes = board.addModuleAndAddSwitches(swToAdd)

            expect(succes).toBeTruthy()
            expect(board.switches.amount).toBe(15)
            expect(board.modules.amount).toBe(6)
            expect(cm1.modulesAmount).toBe(6)
            expect(cm1.isFull()).toBeTruthy()
            mdArr.forEach(md => {
                expect(md.switchesAmount).toBe(10)
                expect(md.isFull).toBeTruthy()
                expect(md.myCompartment).toBe(cm1)
            })
        })

        test('Can do it only in one compartments which adds one module', () => {
            const board = new Board()
            const [cm1, cm2, cm3] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 3})
            const fullSwArr = board.switches.createNewSwitchesArray(9, "des", "1X16A", "feed") 
            const almostFullMdArr = board.modules.createNewModulesArray({modulesAmount: 5})
            const fullMdArr = board.modules.createNewModulesArray({modulesAmount: 6})

            almostFullMdArr.forEach(md =>  {
                md.addSwitches(fullSwArr)
                expect(md.switchesAmount).toBe(fullSwArr.length)
                expect(md.freeWidth).toBe(defaultSwitchDimensions.width)
            })

            fullMdArr.forEach(md =>  {
                md.addSwitches(fullSwArr)
                expect(md.switchesAmount).toBe(fullSwArr.length)
            })

            cm1.addModules(fullMdArr)
            cm2.addModules(almostFullMdArr)
            cm3.addModules(fullMdArr)

            expect(cm1.modulesAmount).toBe(fullMdArr.length)
            expect(cm2.modulesAmount).toBe(almostFullMdArr.length)   
            expect(cm3.modulesAmount).toBe(fullMdArr.length)

            const swToAdd = board.switches.createNewSwitchesArray(3, "des", "2X16A", "feed")
            let succes = board.addModuleAndAddSwitches(swToAdd)

            expect(succes).toBeTruthy()
            expect(cm1.modulesAmount).toBe(fullMdArr.length)
            expect(cm2.modulesObjList[cm1.modulesAmount-1].switchesAmount).toBe(3)
            expect(cm2.modulesAmount).toBe(almostFullMdArr.length+1)   
            expect(cm3.modulesAmount).toBe(fullMdArr.length)


        })

        test('Can do it over several compartments that need to add modules', () => {
            const board = new Board()
            const [cm1, cm2, cm3] = board.compartments.createNewComaprtmentsArray({compartmentsAmount: 3})
            const fullSwArr = board.switches.createNewSwitchesArray(10, "des", "1X16A", "feed") 
            const almostFullMdArr = board.modules.createNewModulesArray({modulesAmount: 5})

            almostFullMdArr.forEach(md =>  md.addSwitches(fullSwArr))
            cm1.addModules(almostFullMdArr)
            cm2.addModules(almostFullMdArr)
            cm3.addModules(almostFullMdArr)

            const swToAdd = board.switches.createNewSwitchesArray(15, "des", "2X16A", "feed")
            let succes = board.addModuleAndAddSwitches(swToAdd)

            expect(succes).toBeTruthy()
            expect(cm1.modulesAmount).toBe(almostFullMdArr.length+1)
            expect(cm2.modulesAmount).toBe(almostFullMdArr.length+1)
            expect(cm3.modulesAmount).toBe(almostFullMdArr.length+1)
            expect(cm1.modulesObjList[cm1.modulesAmount-1].switchesAmount).toBe(5)
            expect(cm2.modulesObjList[cm1.modulesAmount-1].switchesAmount).toBe(5)
            expect(cm3.modulesObjList[cm1.modulesAmount-1].switchesAmount).toBe(5)
            expect(cm1.modulesObjList[cm1.modulesAmount-1].isFull()).toBeTruthy()
            expect(cm2.modulesObjList[cm1.modulesAmount-1].isFull()).toBeTruthy()
            expect(cm3.modulesObjList[cm1.modulesAmount-1].isFull()).toBeTruthy()

        })    
    })
})