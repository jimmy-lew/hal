import { Ref } from 'vue'

export class Character {
    level: Ref<number>
    health: Ref<number>
    damage: number
    cooldown: number
    healing: number
    healingCooldown: number
    dps: Ref<number>
    regen: Ref<number>
    movement: Ref<number>

    constructor(level = 1, damage = 0, cooldown = 1, health = 100, movement = 50) {
        this.level = ref(level)
        this.damage = damage
        this.cooldown = cooldown
        this.health = ref(health)
        this.movement = ref(movement)
        this.healing = 0.2
        this.healingCooldown = 2

        this.dps = ref(this.damage / this.cooldown)
        this.regen = ref((this.health.value * this.healing) / this.healingCooldown)
    }

    recomputeStats() {
        this.dps.value = this.damage / this.cooldown
        this.regen.value = (this.health.value * this.healing) / this.healingCooldown
    }

    levelUp(stat: keyof Character = 'damage') {
        this.level.value++

        switch (stat) {
            case 'damage':
                this.damage *= 1.1
                break;
                
            case 'cooldown':
                this.cooldown *= 0.9
                break;
            
            case 'health':
                this.health.value *= 1.1
                break;

            case 'movement':
                this.movement.value *= 1.1
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

        this.recomputeStats()
    }
}