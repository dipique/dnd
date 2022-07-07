import { FC } from 'react'
import { UseQueryResult } from 'react-query'
import { DbItem, IDbActions, useItemDb } from '../db/Faunadb'
import { FormGroupCfg, ItemFormProps, ItemTableColumnDef } from '../forms'
import { IItemType, ItemTypes } from './ItemTypes'

export interface ICollection {
    name        : string
    singular    : string
    icon        : JSX.Element
    types       : ItemTypes
    dbStatus?   : string
    dbFetching? : boolean
    getNew      : () => DbItem
}

export interface RequiredItemCollectionProps<T extends DbItem> extends ICollection {
    name        : string
    singular    : string
    icon        : JSX.Element
    types       : ItemTypes
    getNew      : () => T
    formGrpCfg  : FormGroupCfg<T>
    tblColumns  : ItemTableColumnDef<T>[]
    renderForm  : FC<ItemFormProps<T>>
}

export type ItemCollectionProps<T extends DbItem> = RequiredItemCollectionProps<T> & Partial<ItemCollection<T>>

export class ItemCollection<T extends DbItem>
       implements ICollection, RequiredItemCollectionProps<T>
{
    name        : string
    singular    : string
    icon        : JSX.Element
    types       : ItemTypes
    getNew      : () => T
    formGrpCfg  : FormGroupCfg<T>
    tblColumns     : ItemTableColumnDef<T>[]
    renderForm  : FC<ItemFormProps<T>>
    items       : T[]
    dbStatus    : string
    dbFetching  : boolean
    useDb       : () => IDbActions<T>

    getId       : (item: T)              => string = (item) => `${item.type}_${item.name}`
    getTitle    : (item: T)              => string = (p: T) => `${this.types[p.type].short}: ${p.name}`
    getType     : (item: T)              => IItemType = item => this.types[item.type]
    applyFilter : (item: T, filter: any) => boolean = (p, filter) => !filter?.type || p.type === filter.type

    constructor(props: ItemCollectionProps<T>, qryResult: UseQueryResult<T[], unknown>) {
        this.name       = props.name
        this.singular   = props.singular
        this.icon       = props.icon
        this.types      = props.types
        this.getNew     = props.getNew
        this.formGrpCfg = props.formGrpCfg
        this.tblColumns    = props.tblColumns
        this.renderForm = props.renderForm
        this.items      = qryResult.data || []
        this.dbStatus   = qryResult.status
        this.dbFetching = qryResult.isFetching

        this.useDb      = () => useItemDb<T>(this.name, this.getNew)

        Object.assign(this, props)
    }
}