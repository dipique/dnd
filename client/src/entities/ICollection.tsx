import { FC } from 'react'
import { DbItem, IDbActions } from '../db/Faunadb'
import { FormGroupCfg, ItemFormProps, ItemTableColumnDef } from '../forms'
import { IItemType, ItemTypes } from './ItemTypes'

export interface ICollection {
    name: string
    singular: string
    icon: JSX.Element,
    types: ItemTypes
}

export class RequiredItemCollectionProps<T extends DbItem> {
    name: string      = ''
    singular: string  = ''
    icon: JSX.Element = <></>
    types: ItemTypes  = {}
    getNew: ()        => T = () => ({} as T)
    formGrpCfg: FormGroupCfg<T> = {}
    items: T[]        = [] // try to remove
    dbStatus: string  = '' // try to remove
    dbFetching: boolean = false // try to remove
    columns: ItemTableColumnDef<T>[] = []
    renderForm: FC<ItemFormProps<T>> = () => <></>
    useDbHook: () => IDbActions<T> = () => ({} as IDbActions<T>) // try to remove
    useDb: () => IDbActions<T> = () => ({} as IDbActions<T>) // try to remove
}

export type ItemCollectionProps<T extends DbItem> = RequiredItemCollectionProps<T> & Partial<ItemCollection<T>>

export class ItemCollection<T extends DbItem>
       extends RequiredItemCollectionProps<T>
       implements ICollection
{
    getId:       (item: T) => string = (item) => `${item.type}_${item.name}`
    getTitle:    (item: T) => string = (p: T) => `${this.types[p.type].short}: ${p.name}`
    getType:     (item: T) => IItemType = item => this.types[item.type]
    applyFilter: (item: T, filter: any) => boolean = (p, filter) => !filter?.type || p.type === filter.type

    constructor(props: ItemCollectionProps<T>) {
        super()
        Object.assign(this, props)
    }
}