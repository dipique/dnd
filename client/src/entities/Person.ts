export class Person {
    name: string = ''
    type: string = ''
    img?: string = ''
    player?: string = ''
    birthplace?: string = ''
    gender?: string = ''
    age?: number
    race?: string = ''
    class?: string = ''
    subclass?: string = ''
    height?: string = ''
    weight?: string = ''
    hair?: string = ''
    eyes?: string = ''
    description?: string = ''
}

export const PersonTypes = {
    pc: "Player Character",
    npc: "Non-Player Character",
    lore: "Lore Character"
} as const