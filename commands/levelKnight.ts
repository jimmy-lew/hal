import { Command } from './command'

export interface LevelKnightInputs {
    stats: InputOption<string>
}

export class LevelKnightCommand extends Command {
    static instance: LevelKnightCommand
    inputOptions: LevelKnightInputs

    static getInstance() {
        return LevelKnightCommand.instance ?? (LevelKnightCommand.instance = new LevelKnightCommand())
    }

    private constructor() {
        super('Knight', 'levelKnight')
        this.inputOptions = {
            stats: { focus: true, data: '', required: false },
        }
    }

    async execute(...args: any[]) {
        const { stats: { data: statsData } } = this.inputOptions
        const archerInstance = Knight.getInstance()
        const statArray = await parseStatString(statsData)
        statArray.forEach(stat => archerInstance.levelUp(stat as keyof InstanceType<typeof Character>))
    }
}