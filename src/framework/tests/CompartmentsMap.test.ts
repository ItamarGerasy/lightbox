import {Module} from "../Module"
import { ModulesMap } from "../ModulesMap"
import { SwitchesMap } from "../SwitchesMap"
import { CompartmentsMap } from "../ComaprtmentsMap"
import { defaultCompartmentDimensions } from "../../components/general/generalTypes"

describe("CompartmentsMap", () => {
    it("Should Create an empty CompartmentsMap", () => {
        const cm = new CompartmentsMap()
        
        expect(cm.amount).toBe(0)
        expect(cm.generateIndex()).toBe("c1")
        expect(cm.lastId).toBe(undefined)
    })
    
    it("Should create a single comaprtment, with default params", () => {
        const compMap = new CompartmentsMap()
        const cm = compMap.createNewComaprtment({})

        // module verification
        expect(cm.dimensions.height).toBe(defaultCompartmentDimensions.height)
        expect(cm.dimensions.width).toBe(defaultCompartmentDimensions.width)
        expect(cm.dimensions.depth).toBe(defaultCompartmentDimensions.depth)
        expect(cm.feed).toBe("")
        expect(cm.id).toBe('c1')
        expect(cm.name).toBe('compartment1')
        expect(cm.freeHeight).toBe(defaultCompartmentDimensions.height)
        expect(cm.occupiedHeight).toBe(0)

        // ComaprtmentMap verification
        expect(compMap.amount).toBe(1)
        expect(compMap.generateIndex()).toBe("c2")
        expect(compMap.lastId).toBe('c1')
        expect(compMap.get(cm.id)).toBe(cm)
    })

    it("Should Create a compartment map from comaprtment array", () => {
        const c1 = new CompartmentsMap()
        const cmArr = c1.createNewComaprtmentsArray({compartmentsAmount: 4})

        const c2 = new CompartmentsMap(cmArr)

        expect(c2.amount).toBe(4)
        expect(c2.generateIndex()).toBe('c5')
        expect(c2.lastId).toBe('c4')
        expect(c2.get('c4')).toBe(cmArr[cmArr.length-1])
    })


    it("Should Create a Comaprtment Array", () => {
        const cmMap = new CompartmentsMap()
        const cmArr = cmMap.createNewComaprtmentsArray({compartmentsAmount: 2})
        const [cm1, cm2] = cmArr

        expect(cm1).not.toBeNull
        expect(cm2).not.toBeNull
        expect(cm1.dimensions.height).toBe(defaultCompartmentDimensions.height)
        expect(cm1.dimensions.width).toBe(defaultCompartmentDimensions.width)
        expect(cm1.dimensions.depth).toBe(defaultCompartmentDimensions.depth)
        expect(cmMap.amount).toBe(2)
        expect(cmMap.generateIndex()).toBe("c3")
        expect(cmMap.lastId).toBe('c2')
        expect(cmMap.get(cm1.id)).toBe(cm1)
        expect(cmMap.get(cm2.id)).toBe(cm2)
    })

    it("Should Iterate through the switches map", () => {
        const cmMap = new CompartmentsMap()
        let dimensions = defaultCompartmentDimensions
        let feed = " some feed"
        let compartmentsAmount = 3

        let cmArr = cmMap.createNewComaprtmentsArray({compartmentsAmount, feed, dimensions})
        let ids = cmArr.map(cm => cm.id)
        let counter = 0

        cmMap.forEach((mapCm, mapId) => {
            counter++
            const foundCm = cmArr.find(arrSw => arrSw === mapCm)
            const foundId = ids.find(arrId => arrId === mapId)
            expect(foundCm).toBe(mapCm)
            expect(foundId).toBe(mapId)
        })

        expect(counter).toBe(compartmentsAmount)
    })

    // it("Should have a module (hasModule)", () => {
    //     const mm = new ModulesMap()
    //     const md = mm.createNewModule({feed: "", dimensions: defaultModuleDimensions})

    //     expect(mm.hasModule(md.id)).toBe(true)
    // })

    // it("Should not have module (hasModule)", () => {
    //     const mm = new ModulesMap()
    //     expect(mm.hasModule("s3")).toBe(false)
    // })

    // it("Should throw error when trying to get a non-existing module", () => {
    //     const mm = new ModulesMap()
    
    //     expect(() => mm.get("s1")).toThrow(Error)
    // });
    
    // it("Should set a module", () => {
    //     const mm = new ModulesMap();
    //     const md = new Module({id: "m3", name: "module3", feed: ""})
    //     mm.set(md.id, md)

    //     expect(mm.amount).toBe(1)
    //     expect(mm.lastId).toBe(md.id)
    //     expect(mm.get(md.id)).toBe(md)
    // })

    // it("Should not set module with id which already exists", () => {
    //     const mm = new ModulesMap()
    //     const mdOut = new Module({id: "m1", name: "module3", feed: ""})
    //     const mdIn = mm.createNewModule({name: "module3", feed: ""})
        
    //     expect(mm.amount).toBe(1)
    //     expect(mm.lastId).toBe('m1')
    //     expect(mm.get(mdIn.id)).toBe(mdIn)
    // })

    // it("Should retrun parent module of given switch", () => {
    //     const mm = new ModulesMap()
    //     const md = mm.createNewModule({name: "module1", feed: ""})

    //     const swMap = new SwitchesMap()
    //     const swArr = swMap.createNewSwitchesArray(3, "", "1X16A", "")
    //     const [s1, s2, s3] = swArr

    //     md.addSwitches(swArr)

    //     expect(mm.getParentModuleOfSwitchById(s1.id)).toBe(md)
    //     expect(mm.getParentModuleOfSwitchById(s2.id)).toBe(md)
    //     expect(mm.getParentModuleOfSwitchById(s3.id)).toBe(md)
    // })

    // it("Should get first module that can add switches", () => {
    //     const mdMap = new ModulesMap()
    //     const [md1, md2] = mdMap.createNewModulesArray({modulesAmount: 2})

    //     const swMap = new SwitchesMap()
    //     const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "")
    //     md1.addSwitches(swArr)

    //     expect(mdMap.getFirstModuleThatCanAddSwitch(swArr[0])).toBe(md2)
    // })

    // it("Should return free slots map", () => {
    //     const mdMap = new ModulesMap()
    //     const swMap = new SwitchesMap()
        
    //     const md1 = mdMap.createNewModule({})
    //     const md2 = mdMap.createNewModule({dimensions: {...defaultModuleDimensions, width: 17.5}})
    //     const md3 = mdMap.createNewModule({dimensions: {...defaultModuleDimensions, width: 52.5}})
    //     const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "")
    //     const expectedMap = { 
    //         [md1.id]: md1.canAddSwitches(swArr), 
    //         [md2.id]: md2.canAddSwitches(swArr),
    //         [md3.id]: md3.canAddSwitches(swArr) 
    //     } 
    //     const givenMap = mdMap.getModuleFreeSlotsMap(swArr)

    //     expect(mdMap.get(md1.id)).toBe(md1)
    //     expect(mdMap.get(md2.id)).toBe(md2)
    //     expect(mdMap.get(md3.id)).toBe(md3)
    //     expect(givenMap.get(md1.id)).toBe(expectedMap[md1.id])
    //     expect(givenMap.get(md2.id)).toBe(expectedMap[md2.id])
    //     expect(givenMap.get(md3.id)).toBe(expectedMap[md3.id])
    // })

    // it("Should return one module that can fit all switches", () => {
    //     const mdMap = new ModulesMap()
    //     const swMap = new SwitchesMap()
    //     const md = mdMap.createNewModule({})
    //     const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")

    //     const returnMd = mdMap.canOneModuleFitSwitches(swArr)

    //     expect(returnMd).toBe(md)
    // })

    // it("Should not return one module that can fit all switches", () => {
    //     const mdMap = new ModulesMap()
    //     const swMap = new SwitchesMap()
    //     const md = mdMap.createNewModule({})
    //     const swArr = swMap.createNewSwitchesArray(11, "", "1X16A", "", "")

    //     const returnMd = mdMap.canOneModuleFitSwitches(swArr)

    //     expect(returnMd).toBeNull
    // })

    // it("Should not fit 0 switches 2 modules", () => {
    //     const mdMap = new ModulesMap()
    //     const swMap = new SwitchesMap()
    //     const md1 = mdMap.createNewModule({})
    //     const md2 = mdMap.createNewModule({})
    //     const swArr1 = swMap.createNewSwitchesArray(5, "", "2X16A", "", "")
    //     const swArr2 = swMap.createNewSwitchesArray(5, "", "2X16A", "", "")
    //     md1.addSwitches(swArr1)
    //     md2.addSwitches(swArr2)

    //     expect(md1.switchesAmount).toBe(5)
    //     expect(md2.switchesAmount).toBe(5)
    //     expect(mdMap.canSomeModulesFitSwitches(swArr1)).toBe(0)

    // })

    // it("Should fit 3 switches on 3 modules", () => {
    //     const mdMap = new ModulesMap()
    //     const swMap = new SwitchesMap()
    //     const md1 = mdMap.createNewModule({})
    //     const md2 = mdMap.createNewModule({})
    //     const md3 = mdMap.createNewModule({})
    //     const swArr1 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
    //     const swArr2 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
    //     const swArr3 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
    //     const swArrToAdd = swMap.createNewSwitchesArray(3, "", "1X16A", "", "")
    //     md1.addSwitches(swArr1)
    //     md2.addSwitches(swArr2)
    //     md3.addSwitches(swArr3)

    //     expect(mdMap.canSomeModulesFitSwitches(swArr3)).toBe(3)
    // })

    // it("Should Create a clone", () => {
    //     const mdMap = new ModulesMap()
    //     mdMap.createNewModulesArray({modulesAmount: 4})
    //     const mmClone = mdMap.clone()
    //     const md2 = mdMap.get('m2')
    //     const cl2 = mmClone.get('m2')
        
    //     expect(mdMap.amount).toBe(mmClone.amount)
    //     expect(md2.freeWidth).toBe(cl2.freeWidth)
    // })

    // it("Should throw an error whenn trying to remove non existing module", () => {
    //     const mdMap = new ModulesMap()
    //     expect(() => {mdMap.removeModule('m1')}).toThrow(Error)
    // })

    // it("Should remove module with last ID", () => {
    //     const mdMap = new ModulesMap()
    //     const mdArr = mdMap.createNewModulesArray({modulesAmount: 2})
    //     let md2 = mdMap.removeModule(mdArr[1].id)

    //     expect(md2).toBe(mdArr[1])
    //     expect(mdMap.lastId).toBe(mdArr[0].id)
    //     expect(mdMap.amount).toBe(1)
    // })
})