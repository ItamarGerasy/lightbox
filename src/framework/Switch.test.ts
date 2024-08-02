import { Switch } from './Switch'
import { SwitchesMap } from './SwitchesMap'
import { defaultSwitchDimensions } from "../components/general/generalTypes";
import { ModulesMap } from './ModulesMap';

describe('Switch', () => {
    it('should correctly initialize with all parameters provided', () => {
      const dimensions = { width: 10, height: 5, depth: 2 };
      const switchInstance = new Switch({
        id: 's1',
        name: 'Main Switch',
        description: 'A main power switch',
        prefix: '3X16A',
        dimensions: dimensions,
        feed: 'main'
      })
  
      expect(switchInstance.id).toBe('s1');
      expect(switchInstance.name).toBe('Main Switch');
      expect(switchInstance.description).toBe('A main power switch');
      expect(switchInstance.prefix).toBe('3X16A');
      expect(switchInstance.size).toBe(3);
      expect(switchInstance.feed).toBe('main');
      expect(switchInstance.dimensions).toEqual(dimensions);
    });
  
    it('should correctly set default values for optional parameters', () => {
      const switchInstance = new Switch({
        id: 's2',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10A'
      });
  
      // Assuming defaultSwitchDimensions.width = 10 for example purposes
      expect(switchInstance.id).toBe('s2');
      expect(switchInstance.name).toBe('Secondary Switch');
      expect(switchInstance.description).toBe('A secondary power switch');
      expect(switchInstance.prefix).toBe('2X10A');
      expect(switchInstance.size).toBe(2);
      expect(switchInstance.feed).toBe('');
      expect(switchInstance.dimensions.width).toBe(defaultSwitchDimensions.width * 2); // size * defaultWidth
    })

    it("Should set _myModule one added to a module", () => {
      const mdMap = new ModulesMap()
      const md = mdMap.createNewModule({})
      const sw = new Switch({
        id: 's2',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10A'
      })
      md.addSwitch(sw)

      expect(sw.myModule).toBe(md)
    })

    it("Should remove switch", () => {
      const mdMap = new ModulesMap()
      const md = mdMap.createNewModule({})
      const sw = new Switch({
        id: 's2',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10A'
      })
      md.addSwitch(sw)
      sw.removeSwitch()

      expect(md.hasSwitch('s2')).toBe(false)
      expect(md.occupiedWidth).toBe(0)
      expect(sw.id).toBe('-1')
      expect(sw.myModule).toBeUndefined()
    })

    it("Should clone switch", () => {
      const sw = new Switch({
        id: 's2',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10A'
      })

      const clone = sw.clone()

      expect(sw.description).toBe(clone.description)
      expect(sw.name).toBe(clone.name)
      expect(sw.id).toBe(clone.id)
      expect(sw.myModule).toBe(clone.myModule)
      expect(sw.prefix).toBe(clone.prefix)
      expect(sw.dimensions.width).toBe(clone.dimensions.width)
      expect(sw.dimensions.height).toBe(clone.dimensions.height)
      expect(sw.dimensions.depth).toBe(clone.dimensions.depth)
    })

    it("Should set dimensions", () => {
      const sw = new Switch({
        id: 's2',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10A'
      })

      sw.dimensions = {width: 43}
      sw.dimensions = {height: 43, depth: 43}

      expect(sw.dimensions.width).toBe(43)
      expect(sw.dimensions.height).toBe(43)
      expect(sw.dimensions.depth).toBe(43)
    })
})

  