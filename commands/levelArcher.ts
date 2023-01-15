import { Command } from './command'

export interface LevelArcherInputs {
    stats: InputOption<string>
}

export class LevelArcherCommand extends Command {
    static instance: LevelArcherCommand
    inputOptions: LevelArcherInputs

    static getInstance() {
        return LevelArcherCommand.instance ?? (LevelArcherCommand.instance = new LevelArcherCommand())
    }

    private constructor() {
        super('Archer', 'levelArcher')
        this.inputOptions = {
            stats: { focus: true, data: '', required: false },
        }
    }

    async execute(...args: any[]) {
        const { stats: { data: statsData } } = this.inputOptions
        const archerInstance = Archer.getInstance()
        const statArray = await parseStatString(statsData)
        statArray.forEach(stat => archerInstance.levelUp(stat as keyof InstanceType<typeof Character>))
    }
}