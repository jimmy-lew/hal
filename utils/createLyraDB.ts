import { create, insert } from '@lyrasearch/lyra'
import { PropertiesSchema } from '@lyrasearch/lyra/dist/types'

export const createLyraDB = async <T extends PropertiesSchema>(schemaObj: T, data: any[]) => {
    const db = ref( create({
        schema: schemaObj
    }))

    for (const item of data) {
        insert(await db.value, item)
    }

    return db
}