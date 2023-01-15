import { search as lyraSearch } from "@lyrasearch/lyra";
import { Lyra } from "@lyrasearch/lyra/dist/types"

export interface CharacterItem { _id: number; alias: string }

export class CharacterRepository {
    static instance: CharacterRepository
    db!: Lyra<Schema>
    data: CharacterItem[]

    static async getInstance() {
        if (CharacterRepository.instance) return CharacterRepository.instance
        CharacterRepository.instance = new CharacterRepository()
        await CharacterRepository.instance.init()
        return CharacterRepository.instance
    }

    private constructor() {
        this.data = [
            { _id: 0, alias: 'archer' },
            { _id: 1, alias: 'knight' },
            { _id: 2, alias: 'wizard' },
        ]
    }
    
    async init() {
        this.db = await createLyraDB({
            _id: 'number',
            alias: 'string'
        }, this.data)
    }

    async searchForChar(term: string) {
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