export const parseStatString = async (statString: string) => {
    const statRepoInstance = await StatsRepository.getInstance()
    const statArray = statString.split(',').map(stat => stat.trim())
    const dirtyAliasArray = await Promise.all(statArray.map(async (stat) => {
        const { data } = await statRepoInstance.searchForStat(stat)
        return data ? data.alias : ''
    }))
    const aliasArray = dirtyAliasArray
        .filter(alias => alias !== '')
        .map(alias => {
            switch (alias) {
                case 'hc':
                    return 'healingCooldown'
                case 'cd':
                    return 'cooldown'
                case 'hl':
                    return 'healing'
                case 'dmg':
                    return 'damage'
                case 'mv':
                    return 'movement'
                default:
                    return alias
            }
    })

    return aliasArray.length > 0 ? aliasArray : ['damage']
}