import {Module} from "./Module"
import { ModulesMap } from "./ModulesMap"
import { Dimensions } from "../components/general/generalTypes"

describe("ModulesMap", () => {
    it("Should Create an empty ModuleMap", () => {
        const mm = new ModulesMap()

        expect(mm.amount).toBe(0)
        expect(mm.generateIndex()).toBe("m1")
        expect(mm.lastId).toBe(undefined)
    })
})