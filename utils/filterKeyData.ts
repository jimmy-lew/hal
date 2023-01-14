export const filterKeyData = (element: [string, any], index?: number, array?: [string, any][]) => {
    return element[0] !== 'cooldown'
    && element[0] !== 'damage'
    && element[0] !== 'healingCooldown'
    && element[0] !== 'healing'
}