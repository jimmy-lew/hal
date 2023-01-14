import { Character } from './character'

export class Knight extends Character {
    constructor(level = 1) {
        super(level, 40, 1.5, 400, 80)
    }
}