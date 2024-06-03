
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

    it("Should not have module (getModuleById)", () => {
        const cp = new Compartment({id: "c1"})
        expect(cp.hasModule('m1')).toBe(false)
    })

    it("Should get module by ID ", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 1})
        const [ md ] = mdArr
        const cpAtt = {
            id: 'c2',
            modulesObjList: mdArr
        }
        const cp = new Compartment(cpAtt)
        
        expect(cp.getModuleById(md.id)).toBe(md)
    })

    it("Should not get module (getModuleById)", () => {
        const cp = new Compartment({id: "c1"})
        expect(cp.getModuleById('m1')).toBe(null)
    })

    it("Should not be full", () => {
        const cp = new Compartment({id: "c1"})
        expect(cp.isFull()).toBe(false)
    })
    
    it("Should be full", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 6})
        const cp = new Compartment({id: "c1", modulesObjList: mdArr})
        expect(cp.isFull()).toBe(true)
    })

    it("Should be able to add module", () => {
        const mdMap = new ModulesMap()
        const mdArr = mdMap.createNewModulesArray({modulesAmount: 5})
        const cp = new Compartment({id: "c1", modulesObjList: mdArr})
        const [md1] = mdMap.createNewModulesArray({modulesAmount: 1})
        const [md2] = mdMap.createNewModulesArray({modulesAmount: 1, dimensions: {...defaultModuleDimensions, height: defaultModuleDimensions.height + 1}})

        expect(cp.canAddModule(md1)).toBe(true)
        expect(cp.canAddModule(md2)).toBe(false)
    })

    it("canAddModules Should return the amount of Modules the comaprtment can add", () => {
        const mdMap = new ModulesMap()
        const mdArr6 = mdMap.createNewModulesArray({modulesAmount: 6})
        const mdArr5 = mdMap.createNewModulesArray({modulesAmount: 5})
        const mdArr4 = mdMap.createNewModulesArray({modulesAmount: 4})
        const mdArr2 = mdMap.createNewModulesArray({modulesAmount: 2})
        const cp4 = new Compartment({id: "c4", modulesObjList: mdArr4})
        const cp5 = new Compartment({id: "c5", modulesObjList: mdArr5})
        const cp6 = new Compartment({id: "c6", modulesObjList: mdArr6})
        const cp0 = new Compartment({id: "c0"})

        expect(cp0.canAddModules(mdArr6)).toBe(6)
        expect(cp4.canAddModules(mdArr2)).toBe(2)
        expect(cp5.canAddModules(mdArr2)).toBe(1)
        expect(cp5.canAddModules([])).toBe(0)
        expect(cp6.canAddModules(mdArr2)).toBe(0)
    })

    it("Should not add moudle", () => {
        const mdMap = new ModulesMap()
        const mdArr6 = mdMap.createNewModulesArray({modulesAmount: 6})
        const [md] = mdMap.createNewModulesArray({modulesAmount: 1})
        const cp6 = new Compartment({id: "c6", modulesObjList: mdArr6})

        expect(cp6.addModule(mdArr6[0])).toBe(false)
        expect(cp6.addModule(md)).toBe(false)
    })

    it("Should add moudle at certain index", () => {
        const mdMap = new ModulesMap()
        const mdArr6 = mdMap.createNewModulesArray({modulesAmount: 6})
        const lastMd = mdArr6.pop()
        const cp6 = new Compartment({id: "c6", modulesObjList: mdArr6})
        
        expect(cp6.addModule(lastMd!, 3)).toBe(true)
        expect(cp6.modulesObjList[3]).toBe(lastMd)
        expect(cp6.modulesAmount).toBe(6)
        expect(cp6.isFull()).toBe(true)
    })

    it("Should add moudle to the end of the list", () => {
        const mdMap = new ModulesMap()
        const mdArr6 = mdMap.createNewModulesArray({modulesAmount: 6})
        const lastMd = mdArr6.pop()
        const cp6 = new Compartment({id: "c6", modulesObjList: mdArr6})

        expect(cp6.addModule(lastMd!)).toBe(true)
        expect(cp6.modulesObjList[5]).toBe(lastMd)
    })
})