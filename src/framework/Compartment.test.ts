
import { ModulesMap } from "./ModulesMap"
import { defaultModuleDimensions, defaultSwitchDimensions, defaultCompartmentDimensions } from "../components/general/generalTypes"
import { Compartment } from "./Compartment"

describe("Module", () => {

    it("Should Create a compartment with default values", () => {
        const cp = new Compartment({id: 'c1'})

        expect(cp.dimensions.depth).toBe(defaultCompartmentDimensions.depth)
        expect(cp.dimensions.width).toBe(defaultCompartmentDimensions.width)
        expect(cp.dimensions.height).toBe(defaultCompartmentDimensions.height)
        expect(cp.feed).toBe("")
        expect(cp.freeHeight).toBe(cp.dimensions.height)
        expect(cp.isFull()).toBe(false)
        expect(cp.modulesAmount).toBe(0)
        expect(cp.modulesObjList).toEqual([])
        expect(cp.name).toBe(`compartment${cp.id.substring(1)}`)
    })

    it("Should create compratment with modules", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 5})
        const cpAtt = {
            id: 'c2',
            name: 'compartment else',
            feed: 'PC',
            modulesObjList: mdArr,
            dimensions: {...defaultCompartmentDimensions, depth: 20}
        }
        const cp = new Compartment(cpAtt)

        expect(cp.dimensions.depth).toBe(cpAtt.dimensions.depth)
        expect(cp.modulesAmount).toBe(5)
        expect(cp.feed).toBe(cpAtt.feed)
        expect(cp.name).toBe(cpAtt.name)
        expect(cp.occupiedHeight).toBe(defaultModuleDimensions.height * 5) 
        expect(cp.freeHeight).toBe(cp.dimensions.height - cp.occupiedHeight)
    })
    
    it("Should Create a Clone", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 5})
        const cpAtt = {
            id: 'c2',
            name: 'compartment else',
            feed: 'PC',
            modulesObjList: mdArr,
            dimensions: defaultCompartmentDimensions
        }
        const cp = new Compartment(cpAtt)
        const clone = cp.clone()

        expect(cp.name).toEqual(clone.name)
        expect(cp.id).toEqual(clone.id)
        expect(cp.feed).toEqual(clone.feed)
        expect(cp.modulesObjList[0].id).toEqual(clone.modulesObjList[0].id)
        expect(cp.freeHeight).toEqual(clone.freeHeight)
        expect(cp.occupiedHeight).toEqual(clone.occupiedHeight)
    })

    it("Should return Module index by id (getModuleIndexById)", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 1})
        const [ md ] = mdArr
        const cpAtt = {
            id: 'c2',
            modulesObjList: mdArr
        }
        const cp = new Compartment(cpAtt)
        
        expect(cp.getModuleIndexById(md.id)).toBe(0)
    })

    it("Should return Module index as -1 if id is not found (getModuleIndexById)", () => {
        const cp = new Compartment({id: 'c1'})
        
        expect(cp.getModuleIndexById('a')).toBe(-1)
    })

    it("Should have module (hasModule)", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 1})
        const cpAtt = {
            id: 'c2',
            modulesObjList: mdArr
        }
        const cp = new Compartment(cpAtt)
        
        expect(cp.hasModule(mdArr[0].id)).toBe(true)
    })

    it("Should not have module (hasModule)", () => {
        const cp = new Compartment({id: "c1"})
        expect(cp.hasModule('m1')).toBe(false)
    })
})