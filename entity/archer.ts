import { Character } from './character'

export class Archer extends Character {
    constructor(level = 1) {
        super(level, 35, 1, 200, 100)
    }
}