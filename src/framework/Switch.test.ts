import { Switch } from './Switch'
import { Dimensions, defaultSwitchDimensions } from "../components/general/generalTypes";

describe('Switch class', () => {
    it('should correctly initialize with all parameters provided', () => {
      const dimensions = { width: 10, height: 5, depth: 2 };
      const switchInstance = new Switch({
        id: '001',
        name: 'Main Switch',
        description: 'A main power switch',
        prefix: '3X16',
        dimensions: dimensions,
        feed: 'main'
      });
  
      expect(switchInstance.id).toBe('001');
      expect(switchInstance.name).toBe('Main Switch');
      expect(switchInstance.description).toBe('A main power switch');
      expect(switchInstance.prefix).toBe('3X16');
      expect(switchInstance.size).toBe(3);
      expect(switchInstance.feed).toBe('main');
      expect(switchInstance.dimensions).toEqual(dimensions);
    });
  
    it('should correctly set default values for optional parameters', () => {
      const switchInstance = new Switch({
        id: '002',
        name: 'Secondary Switch',
        description: 'A secondary power switch',
        prefix: '2X10'
      });
  
      // Assuming defaultSwitchDimensions.width = 10 for example purposes
      expect(switchInstance.id).toBe('002');
      expect(switchInstance.name).toBe('Secondary Switch');
      expect(switchInstance.description).toBe('A secondary power switch');
      expect(switchInstance.prefix).toBe('2X10');
      expect(switchInstance.size).toBe(2);
      expect(switchInstance.feed).toBe('');
      expect(switchInstance.dimensions.width).toBe(defaultSwitchDimensions.width * 2); // size * defaultWidth
    });
  });
  