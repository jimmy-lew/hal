import { Character } from './character'

export class Wizard extends Character {
    constructor(level = 1) {
        super(level, 50, 2, 150, 60)
    }
}