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

export interface IItemCollection<T extends DbItem> extends ICollection {
    getNew: () => T
    useDbHook: () => IDbActions<T>
    getId: (item: T) => string,
    getTitle: (item: T) => string,
    items: T[]
    dbStatus: string
    dbFetching: boolean
    formGrpCfg: FormGroupCfg<T>
    getType: (item: T) => IItemType
    columns: ItemTableColumnDef<T>[]
    applyFilter?: (item: T, filter: any) => boolean
    renderForm: FC<ItemFormProps<T>>
    useDb: () => IDbActions<T>
}