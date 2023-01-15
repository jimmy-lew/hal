import { Command } from './command'

export interface LevelUpInputs {
    entity: InputOption<string>,
    stats: InputOption<string>
}

export class LevelUpCommand extends Command {
    static instance: LevelUpCommand
    inputOptions: LevelUpInputs

    static getInstance() {
        return LevelUpCommand.instance ?? (LevelUpCommand.instance = new LevelUpCommand())
    }

    private constructor() {
        super('Level Up')
        this.inputOptions = {
            entity: { focus: true, data: '', required: true },
            stats: { focus: false, data: '', required: false },
        }
    }
    
    async execute(...args: any[]) {
        const { entity: { data: entityData }, stats: { data: statsData } } = this.inputOptions
        const characterRepoInstance = await CharacterRepository.getInstance()
        const { data, error } = await characterRepoInstance.searchForChar(entityData)
        if (error || !data) return console.log(`No character found for ${entityData} | Error: ${error} | Data: ${data}`)
        const { alias } = data
        const statArray = await parseStatString(statsData)
        statArray.forEach(stat => this.levelUp(alias, stat as keyof InstanceType<typeof Character>))
    }

    levelUp(entity: string, stat = 'damage' as keyof InstanceType<typeof Character>) {
        console.log(`Leveling up ${entity}...`)
        switch (entity) {
            case 'archer':
                Archer.getInstance().levelUp(stat)
                break
            case 'knight':
                Knight.getInstance().levelUp(stat)
                break
            case 'wizard':
                Wizard.getInstance().levelUp(stat)
                break
            default:
                break
        }
    }
}