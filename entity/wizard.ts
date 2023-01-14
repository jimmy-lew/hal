import { Character } from './character'

export class Wizard extends Character {
    static instance: Wizard

    static getInstance() {
        return Wizard.instance || (Wizard.instance = new Wizard())
    }

    private constructor(level = 1) {
        super(level, 50, 2, 150, 60)
    }
}