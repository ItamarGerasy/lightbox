import { Switch } from "./Switch"
import { SwitchesMap } from "./SwitchesMap"
import { Dimensions, defaultSwitchDimensions } from "../components/general/generalTypes"
import exp from "constants"

describe("SwtichesMap", () => {
    
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

})