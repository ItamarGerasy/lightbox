import { Switch, SwitchesMap } from './Switch'
import { Dimensions, defaultSwitchDimensions } from "../components/general/generalTypes";

describe('Switch class constructor', () => {
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
    });
});

describe('SwitchesMap', () => {
    it('Should add new switch', () => {
        const switchInstance = new Switch({
            id: 's1',
            name: 'Main Switch',
            description: 'A main power switch',
            prefix: '3X16A',
            feed: 'main'
        })
        const switchesMap = new SwitchesMap()

        switchesMap.set(switchInstance.id, switchInstance)
        expect(switchesMap.get(switchInstance.id)).toEqual(switchInstance)
        expect(switchesMap.hasSwitch(switchInstance.id)).toBe(true)
        expect(switchesMap.amount).toBe(1)
        expect(switchesMap.lastId).toBe('s1')
    })
})
  