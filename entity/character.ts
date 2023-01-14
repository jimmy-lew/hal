export class Character {
    level: number
    health: number
    damage: number
    cooldown: number
    healing: number
    healingCooldown: number
    dps: number
    regen: number
    movement: number

    constructor(level = 1, damage = 0, cooldown = 1, health = 100, movement = 50) {
        this.level = level
        this.damage = damage
        this.cooldown = cooldown
        this.health = health
        this.movement = movement
        this.healing = 0.2
        this.healingCooldown = 2

        this.dps = this.getDPS()
        this.regen = this.getRegen()
    }

    getDPS() {
        return this.damage / this.cooldown
    }

    getRegen() {
        return (this.health * this.healing) / this.healingCooldown
    }

    levelUp(stat: keyof Character) {
        this.level++

        switch (stat) {
            case 'damage':
                this.damage *= 1.1
                break;

            case 'cooldown':
                this.cooldown *= 0.9
                break;
            
            case 'health':
                this.health *= 1.1
                break;

            case 'movement':
                this.movement *= 1.1
                break;

            case 'healing':
                this.healing *= 1.2
                break;

            case 'healingCooldown':
                this.healingCooldown *= 0.9
                break;
        
            default:
                break;
        }
    }
}