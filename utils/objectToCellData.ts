export const objectToCellData = (obj: Object, filter?: (...args: any[]) => boolean, getKey = false): CellData[] => {
    filter = filter || (() => true)
    return Object.entries(obj)
    .filter(filter)
    .map(([key, value]) => { return { data: getKey ? key : value, type: getKey ? 'header' : 'data' }})
}