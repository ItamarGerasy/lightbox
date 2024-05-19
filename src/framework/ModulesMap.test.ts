import {Module} from "./Module"
import { ModulesMap } from "./ModulesMap"
import { SwitchesMap } from "./SwitchesMap"
import { Dimensions, defaultModuleDimensions } from "../components/general/generalTypes"
import exp from "constants"

describe("ModulesMap", () => {
    it("Should Create an empty ModuleMap", () => {
        const mm = new ModulesMap()

        expect(mm.amount).toBe(0)
        expect(mm.generateIndex()).toBe("m1")
        expect(mm.lastId).toBe(undefined)
    })

    it("Should Create a module from modules array", () => {
        const m1 = new ModulesMap()
        const mdArr = m1.createNewModulesArray({modulesAmount: 4})

        const m2 = new ModulesMap(mdArr)

        expect(m2.amount).toBe(4)
        expect(m2.generateIndex()).toBe('m5')
        expect(m2.lastId).toBe('m4')
        expect(m2.get('m4')).toBe(mdArr[mdArr.length-1])
    })

    it("Should create a single module, with default params", () => {
        const mm = new ModulesMap()
        const md = mm.createNewModule({feed: "", dimensions: defaultModuleDimensions})

        // module verification
        expect(md.dimensions.height).toBe(defaultModuleDimensions.height)
        expect(md.dimensions.width).toBe(defaultModuleDimensions.width)
        expect(md.dimensions.depth).toBe(defaultModuleDimensions.depth)
        expect(md.feed).toBe("")
        expect(md.id).toBe('m1')
        expect(md.name).toBe('module1')
        expect(md.freeWidth).toBe(defaultModuleDimensions.width)
        expect(md.occupiedWidth).toBe(0)

        // ModulesMap verification
        expect(mm.amount).toBe(1)
        expect(mm.generateIndex()).toBe("m2")
        expect(mm.lastId).toBe('m1')
        expect(mm.get(md.id)).toBe(md)
    })

    it("Should Create a Modules Array", () => {
        const mm = new ModulesMap()
        const mdArr = mm.createNewModulesArray({modulesAmount: 2})
        const [md1, md2] = mdArr

        expect(md1).not.toBeNull
        expect(md2).not.toBeNull
        expect(md1.dimensions.height).toBe(defaultModuleDimensions.height)
        expect(md1.dimensions.width).toBe(defaultModuleDimensions.width)
        expect(md1.dimensions.depth).toBe(defaultModuleDimensions.depth)
        expect(mm.amount).toBe(2)
        expect(mm.generateIndex()).toBe("m3")
        expect(mm.lastId).toBe('m2')
        expect(mm.get(md1.id)).toBe(md1)
        expect(mm.get(md2.id)).toBe(md2)
    })

    it("Should have a module (hasModule)", () => {
        const mm = new ModulesMap()
        const md = mm.createNewModule({feed: "", dimensions: defaultModuleDimensions})

        expect(mm.hasModule(md.id)).toBe(true)
    })

    it("Should not have module (hasModule)", () => {
        const mm = new ModulesMap()
        expect(mm.hasModule("s3")).toBe(false)
    })

    it("Should throw error when trying to get a non-existing module", () => {
        const mm = new ModulesMap()
    
        expect(() => mm.get("s1")).toThrow(Error)
    });
    
    it("Should set a module", () => {
        const mm = new ModulesMap();
        const md = new Module({id: "m3", name: "module3", feed: ""})
        mm.set(md.id, md)

        expect(mm.amount).toBe(1)
        expect(mm.lastId).toBe(md.id)
        expect(mm.get(md.id)).toBe(md)
    })

    it("Should not set module with id which already exists", () => {
        const mm = new ModulesMap()
        const mdOut = new Module({id: "m1", name: "module3", feed: ""})
        const mdIn = mm.createNewModule({name: "module3", feed: ""})
        
        expect(mm.amount).toBe(1)
        expect(mm.lastId).toBe('m1')
        expect(mm.get(mdIn.id)).toBe(mdIn)
    })

    it("Should retrun parent module of given switch", () => {
        const mm = new ModulesMap()
        const md = mm.createNewModule({name: "module1", feed: ""})

        const swMap = new SwitchesMap()
        const swArr = swMap.createNewSwitchesArray(3, "", "1X16A", "")
        const [s1, s2, s3] = swArr

        md.addSwitches(swArr)

        expect(mm.getParentModuleOfSwitchById(s1.id)).toBe(md)
        expect(mm.getParentModuleOfSwitchById(s2.id)).toBe(md)
        expect(mm.getParentModuleOfSwitchById(s3.id)).toBe(md)
    })

    it("Should get first module that can add switches", () => {
        const mdMap = new ModulesMap()
        const [md1, md2] = mdMap.createNewModulesArray({modulesAmount: 2})

        const swMap = new SwitchesMap()
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "")
        md1.addSwitches(swArr)

        expect(mdMap.getFirstModuleThatCanAddSwitch(swArr[0])).toBe(md2)
    })

    it("Should return free slots map", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        
        const md1 = mdMap.createNewModule({})
        const md2 = mdMap.createNewModule({dimensions: {...defaultModuleDimensions, width: 17.5}})
        const md3 = mdMap.createNewModule({dimensions: {...defaultModuleDimensions, width: 52.5}})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "")
        const expectedMap = { 
            [md1.id]: md1.canAddSwitches(swArr), 
            [md2.id]: md2.canAddSwitches(swArr),
            [md3.id]: md3.canAddSwitches(swArr) 
        } 
        const givenMap = mdMap.getModuleFreeSlotsMap(swArr)

        expect(mdMap.get(md1.id)).toBe(md1)
        expect(mdMap.get(md2.id)).toBe(md2)
        expect(mdMap.get(md3.id)).toBe(md3)
        expect(givenMap.get(md1.id)).toBe(expectedMap[md1.id])
        expect(givenMap.get(md2.id)).toBe(expectedMap[md2.id])
        expect(givenMap.get(md3.id)).toBe(expectedMap[md3.id])
    })

    it("Should return one module that can fit all switches", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")

        const returnMd = mdMap.canOneModuleFitSwitches(swArr)

        expect(returnMd).toBe(md)
    })

    it("Should not return one module that can fit all switches", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(11, "", "1X16A", "", "")

        const returnMd = mdMap.canOneModuleFitSwitches(swArr)

        expect(returnMd).toBeNull
    })

    it("Should not fit 0 switches 2 modules", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        const md1 = mdMap.createNewModule({})
        const md2 = mdMap.createNewModule({})
        const swArr1 = swMap.createNewSwitchesArray(5, "", "2X16A", "", "")
        const swArr2 = swMap.createNewSwitchesArray(5, "", "2X16A", "", "")
        md1.addSwitches(swArr1)
        md2.addSwitches(swArr2)

        expect(md1.switchesAmount).toBe(5)
        expect(md2.switchesAmount).toBe(5)
        expect(mdMap.canSomeModulesFitSwitches(swArr1)).toBe(0)

    })

    it("Should fit 3 switches on 3 modules", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        const md1 = mdMap.createNewModule({})
        const md2 = mdMap.createNewModule({})
        const md3 = mdMap.createNewModule({})
        const swArr1 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
        const swArr2 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
        const swArr3 = swMap.createNewSwitchesArray(9, "", "1X16A", "", "")
        const swArrToAdd = swMap.createNewSwitchesArray(3, "", "1X16A", "", "")
        md1.addSwitches(swArr1)
        md2.addSwitches(swArr2)
        md3.addSwitches(swArr3)

        expect(mdMap.canSomeModulesFitSwitches(swArr3)).toBe(3)

    })
})