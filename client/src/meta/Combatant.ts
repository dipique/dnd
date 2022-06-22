import 'reflect-metadata'
import { Person } from '../entities'

export const CMB_PROPS_KEY = 'COMBATANT_PROPS'

const getCmbMeta = (target: object): string[] => Reflect.getMetadata(CMB_PROPS_KEY, target.constructor) || []
const setCmbMeta = (target: object, values: string[]) => Reflect.defineMetadata(CMB_PROPS_KEY, values, target.constructor)

export function combatant(target: object, propertyKey: string) {
    const cols = getCmbMeta(target)
    cols.push(propertyKey)
    setCmbMeta(target, cols)
}

export const isPropCombatant = (propName: string, target?: object) => getCmbMeta(target || new Person()).includes(propName)
