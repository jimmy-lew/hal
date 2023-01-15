import { search as lyraSearch } from "@lyrasearch/lyra";
import { Lyra } from "@lyrasearch/lyra/dist/types"

export interface StatItem { _id: number; alias: string }

export class StatsRepository {
    static instance: StatsRepository
    db!: Lyra<Schema>
    data: StatItem[]

    static async getInstance() {
        if (StatsRepository.instance) return StatsRepository.instance
        StatsRepository.instance = new StatsRepository()
        await StatsRepository.instance.init()
        return StatsRepository.instance
    }

    private constructor() {
        this.data = [
            { _id: 0, alias: 'damage' },
            { _id: 1, alias: 'cooldown' },
            { _id: 2, alias: 'health' },
            { _id: 3, alias: 'movement' },
            { _id: 4, alias: 'healing' },
            { _id: 5, alias: 'healingCooldown' },
            { _id: 6, alias: 'hc' },
            { _id: 7, alias: 'cd' },
            { _id: 8, alias: 'hl' },
            { _id: 9, alias: 'dmg' },
            { _id: 10, alias: 'mv' },
        ]
    }
    
    async init() {
        this.db = await createLyraDB({
            _id: 'number',
            alias: 'string'
        }, this.data)
    }

    async searchForStat(term: string) {
        const res = await lyraSearch(this.db,  {
            term,
            properties: '*',
            limit: 1,
        })

        if (res.count <= 0) return { data: null, error: true }
        const [{ document: { _id } }] = res.hits

        return { data: this.data[_id], error: false }
    }
}