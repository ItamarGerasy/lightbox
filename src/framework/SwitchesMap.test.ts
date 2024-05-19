import { SwitchesMap } from "./SwitchesMap"
import { defaultSwitchDimensions } from "../components/general/generalTypes"

describe("SwtichesMap", () => {
    
    it('Should create a switchesMap with switches array', () => {
        const swMap1 = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        const swArr = swMap1.createNewSwitchesArray(3, description, prefix, feed)

        const swMap2 = new SwitchesMap(swArr)
        expect(swMap2.amount).toBe(3)
        expect(swMap2.lastId).toBe('s3')
        expect(swMap2.get(swArr[0].id)).toBe(swArr[0])
    })

    it("Should create a single switch with required parameters only", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        const sw = swMap.createNewSwitch(description, prefix, feed)

        // check the switch created
        expect(sw).not.toBeNull()
        expect(sw.dimensions.depth).toEqual(defaultSwitchDimensions.depth)
        expect(sw.dimensions.width).toEqual(defaultSwitchDimensions.width)
        expect(sw.dimensions.height).toEqual(defaultSwitchDimensions.height)
        expect(sw.description).toBe(description)
        expect(sw.prefix).toBe(prefix)
        expect(sw.feed).toBe(feed)

        // check the switches map
        expect(swMap.amount).toEqual(1)
        expect(swMap.lastId).toEqual(sw.id)
        expect(swMap.lastId).toEqual("s1")
        expect(swMap.generateIndex()).toEqual("s2")
        expect(swMap.get(sw.id)).toBe(sw)
        expect(swMap.hasSwitch(sw.id)).toBe(true)
    })

    it("Should create switches array with required parameters only", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        const swArr = swMap.createNewSwitchesArray(3, description, prefix, feed)
        const [s1, s2, s3] = swArr

        expect(swArr.length).toBe(3)
        expect(s1).not.toBeNull()
        expect(s2).not.toBeNull()
        expect(s3).not.toBeNull()
        expect(s1.size + s2.size + s3.size).toBe(3)
    })

    it("Should have switch", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        let [s1, s2, s3] = swMap.createNewSwitchesArray(3, description, prefix, feed)

        expect(swMap.hasSwitch(s1.id)).toBe(true)
        expect(swMap.hasSwitch(s2.id)).toBe(true)
        expect(swMap.hasSwitch(s3.id)).toBe(true)
    })

    it("Should not have switch", () => {
        const swMap = new SwitchesMap()

        expect(swMap.hasSwitch("s5")).toBe(false)
    })

    it("Should remove a switch", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        let swArr = swMap.createNewSwitchesArray(3, description, prefix, feed)

        let removedSw = swMap.removeSwitch(swArr[2].id)
        expect(swMap.amount).toBe(2)
        expect(swMap.lastId).toBe(swArr[1].id)
        expect(swMap.hasSwitch(removedSw.id)).toBe(false)

    })

    it("Should remove several switches", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        let swArr = swMap.createNewSwitchesArray(3, description, prefix, feed)
        let [s1, s2, s3] = swArr
        let [rs1, rs2, rs3] = swMap.removeSwitches(swArr)

        expect(s1).toBe(rs1)
        expect(s2).toBe(rs2)
        expect(s3).toBe(rs3)
        expect(swMap.amount).toBe(0)
        expect(swMap.generateIndex()).toBe('s1')
    })

    it("Should throw error while trying to remove non esiting switch", () => {
        const swMap = new SwitchesMap()
        expect(() => {swMap.removeSwitch("s3")}).toThrow(Error)
    })

    it("Should not set existing switch", () => {
        const swMap = new SwitchesMap()
        let description = "some description"
        let prefix = "1X16A"
        let feed = " some feed"
        let swArr = swMap.createNewSwitchesArray(3, description, prefix, feed)
        let [s1, s2, s3] = swArr

        swMap.set('s1', s1)

        expect(swMap.amount).toBe(3)
        expect(swMap.lastId).toBe('s3')
        expect(swMap.generateIndex()).toBe('s4')
    })

    it("Should get null if switch doesn't exists", () => {
        const swMap = new SwitchesMap()
        let sw = swMap.get('s1')
        expect(sw).toBeNull
    })

})