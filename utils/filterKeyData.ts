export const filterKeyData = <T extends string = any>(element: T[], index: number, array: T[][]) => {
    return !['cooldown', 'damage', 'healingCooldown', 'healing'].includes(element[0])
}