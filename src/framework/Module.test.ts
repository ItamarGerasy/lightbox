import {Module} from "./Module"
import { ModulesMap } from "./ModulesMap"
import { SwitchesMap } from "./SwitchesMap"
import { Dimensions, defaultModuleDimensions, defaultSwitchDimensions } from "../components/general/generalTypes"
import { defaultMaxListeners } from "stream"
import exp from "constants"

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

})