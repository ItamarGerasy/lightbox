import {Module} from "../Module"
import { ModulesMap } from "../ModulesMap"
import { SwitchesMap } from "../SwitchesMap"
import { defaultModuleDimensions, defaultSwitchDimensions } from "../../components/general/generalTypes"

describe("Module", () => {

    it("Should Create a module", () => {
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})

        expect(md).not.toBeNull()
        expect(md.dimensions.width).toEqual(defaultModuleDimensions.width)
        expect(md.dimensions.height).toEqual(defaultModuleDimensions.height)
        expect(md.dimensions.depth).toEqual(defaultModuleDimensions.depth)
        expect(md.isFull()).toBe(false)
        expect(md.freeWidth).toBe(md.dimensions.width)
    })

    it("Should create a module from switch array", () => {
        const swMap = new SwitchesMap()
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        const md = new Module({feed: "", id: "m1", name:"module 1", switchesObjList: swArr})

        expect(md.freeWidth).toBe(0)
        expect(md.occupiedWidth).toBe(md.dimensions.width)
        expect(md.switchesObjList.length).toBe(10)
    })

    it('Should add a single switch', () => {
        const swMap = new SwitchesMap()
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})
        const sw = swMap.createNewSwitch("", "1X16A", "", "")

        md.addSwitch(sw)
        expect(md.freeWidth).toBe(md.dimensions.width - sw.dimensions.width)
        expect(md.occupiedWidth).toBe(sw.dimensions.width)
        expect(md.switchesAmount).toBe(1)
        expect(md.isFull()).toBe(false)
    })

    it("should be able to add 10 switches", () => {
        const swMap = new SwitchesMap()
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        let amountOfSwitchesCanAdd = md.canAddSwitches(swArr)

        expect(swArr[0].dimensions.width).toBe(defaultSwitchDimensions.width)
        expect(amountOfSwitchesCanAdd).toBe(10)
    })

    it("Should not be able to add any switches", () => {
        const swMap = new SwitchesMap()
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        md.addSwitches(swArr)
        let amountOfSwitchesCanAdd = md.canAddSwitches(swArr)

        expect(amountOfSwitchesCanAdd).toBe(0)
    })

    it("can add switch", () => {
        const swMap = new SwitchesMap()
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})
        const [s1, s2] = swMap.createNewSwitchesArray(2, "", "1X16A", "", "")

        expect(md.canAddSwitch(s1)).toBe(true)
    })

    it("cannot add switch", () => {
        const swMap = new SwitchesMap()
        const mdMap = new ModulesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        md.addSwitches(swArr)

        expect(md.canAddSwitch(swArr[0])).toBe(false)
    })

    it("Should be full", () => {
        const mdMap = new ModulesMap()
        const swMap = new SwitchesMap()
        const md = mdMap.createNewModule({})
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")

        md.addSwitches(swArr)
        expect(md.freeWidth).toEqual(0)
        expect(md.isFull()).toBe(true)
    })

    it("Should throw error, when removing switch in index and index doesn't exsits", () => {
        const swMap = new SwitchesMap()
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        const md = new Module({feed: "", id: "m1", name:"module 1", switchesObjList: swArr})

        expect(() => md.removeSwitchAtIndex(11)).toThrow(Error)
    })

    it("Should remove switch at index", () => {
        const swMap = new SwitchesMap()
        const swArr = swMap.createNewSwitchesArray(10, "", "1X16A", "", "")
        const md = new Module({feed: "", id: "m1", name:"module 1", switchesObjList: swArr})

        const sw = md.removeSwitchAtIndex(0)
        expect(sw.id).toBe('s1')
        expect(md.switchesObjList.length).toBe(9)
        expect(md.switchesAmount).toBe(9)
        expect(md.getSwitchById(sw.id)).toBeNull()
        expect(md.hasSwitch(sw.id)).toBe(false)
        expect(md.switchesObjList[0].id).toBe('s2')
    })
})