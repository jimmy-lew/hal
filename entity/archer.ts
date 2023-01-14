import { Character } from './character'

export class Archer extends Character {
    static instance: Archer

    static getInstance() {
        return Archer.instance || (Archer.instance = new Archer())
    }

    private constructor(level = 1) {
        super(level, 35, 1, 200, 100)
    }
}