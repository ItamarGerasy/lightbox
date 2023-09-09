

const mockData = {
    switches: {
        'switch-1': {
            id: 'switch-1',
            name: 'switch1',
            prefix: '1X10A',
            description: 'north lighting',
            feed: 'PC',
            specs: {
                width: 17.5,
                height: 85,
                depth: 69
            }
        },
        'switch-2': {
            id: 'switch-2',
            name: 'switch2',
            prefix: '1X12A',
            description: 'east lighting',
            feed: 'Generator',
            specs: {
                width: 17.5,
                height: 85,
                depth: 69
            }
        }
    },
    modules: {
        'module-1': {
            id: 'module-1',
            name: 'lighting',
            switchIds: ['switch-1', 'switch-2'],
            specs: {
                width: 264,
                height: 85,
            }
        }
    },
    compartments: {
        'compratment-1':{
            id: 'compratment-1',
            name: 'PC compartment',
            feed: 'PC',
            modulesIds: ['module-1'],
            specs: {
                width: 265,
                height: 265,
            }
        }
    },
    switchOrder: ['switch-1', 'switch-2'],
    moduleOrder: ['module-1'],
    compartmentsOrder: ['compartment-1']
}

export default mockData