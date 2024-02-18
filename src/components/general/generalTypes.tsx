export type Dimensions = {
    width: number,
    height: number,
    depth: number
}

export const defaultSwitchDimensions: Dimensions = {
    width: 17.5,
    height: 85,
    depth: 69
}

export const defaultModuleDimensions: Dimensions = {
    width: defaultSwitchDimensions.width * 10,
    height: 85,
    depth: 69
} 