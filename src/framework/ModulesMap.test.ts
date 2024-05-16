import {Module} from "./Module"
import { ModulesMap } from "./ModulesMap"
import { Dimensions, defaultModuleDimensions } from "../components/general/generalTypes"
import { defaultMaxListeners } from "stream"

describe("ModulesMap", () => {
    it("Should Create an empty ModuleMap", () => {
        const mm = new ModulesMap()

        expect(mm.amount).toBe(0)
        expect(mm.generateIndex()).toBe("m1")
        expect(mm.lastId).toBe(undefined)
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
})