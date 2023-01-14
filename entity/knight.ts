import { Character } from './character'

export class Knight extends Character {
    static instance: Knight

    static getInstance() {
        return Knight.instance || (Knight.instance = new Knight())
    }

    private constructor(level = 1) {
        super(level, 40, 1.5, 400, 80)
    }
}