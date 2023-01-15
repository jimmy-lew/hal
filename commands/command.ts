import { Ref } from 'vue'

export class Command implements ISearchable {
    static id = 0
    _id: number
    command: string
    searchOptions = { type: "command" } as const

    constructor(command: string) {
        this._id = Command.id
        Command.id++
        this.command = command
    }

    async execute(...args: any[]) {
        throw new Error('Method not implemented.')
    }
}