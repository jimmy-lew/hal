import { Command } from './command'

export interface LevelWizardInputs {
    stats: InputOption<string>
}

export class LevelWizardCommand extends Command {
    static instance: LevelWizardCommand
    inputOptions: LevelWizardInputs

    static getInstance() {
        return LevelWizardCommand.instance ?? (LevelWizardCommand.instance = new LevelWizardCommand())
    }

    private constructor() {
        super('Wizard')
        this.inputOptions = {
            stats: { focus: true, data: '', required: false },
        }
    }

    async execute(...args: any[]) {
        const { stats: { data: statsData } } = this.inputOptions
        const archerInstance = Wizard.getInstance()
        const statArray = await parseStatString(statsData)
        statArray.forEach(stat => archerInstance.levelUp(stat as keyof InstanceType<typeof Character>))
    }
}