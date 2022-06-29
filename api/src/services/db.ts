import {
   Client, Map, Ref,
   Collection, Documents, Paginate, Lambda,
   Create, Update, Delete, Get
} from 'faunadb'

const client = new Client({
   secret: process.env.FUANA_CLIENT_SECRET || '',
   domain: process.env.FAUNA_DOMAIN,
   port: 443,
   scheme: 'https',
})

export interface ILink {
   id: string
   collection: string
   description: string
}

export interface IDbItem {
   id: string
   type: string
   name: string
   image?: string

   links?: ILink[]
}

interface FaunaInnerRef {
   id: string
   collection?: FaunaRef
}

interface FaunaRef {
   value: FaunaInnerRef
}

export class FaunaItem<T extends IDbItem> {
   ref: FaunaRef
   ts: string = ''
   data: T

   constructor(data: T, ref: FaunaRef) {
       this.data = data
       this.ref = ref
   }

   static getId<T extends IDbItem>(item: FaunaItem<T>): string {
       return item.ref.value.id
   }

   static withId<T extends IDbItem>(item: FaunaItem<T>): T {
       return {
           ...item.data,
           id: FaunaItem.getId(item)
       } as T
   }
}

export class FaunaCollection<T extends IDbItem> {
   data: FaunaItem<T>[] = []

   static getItems<T extends IDbItem>(col: FaunaCollection<T>): T[] {
       return col.data.map(FaunaItem.withId)
   }
}

const getSingle = async (item: FaunaItem<IDbItem> | Promise<FaunaItem<IDbItem>>): Promise<IDbItem> =>
   item instanceof Promise ? item.then(FaunaItem.withId) : FaunaItem.withId(item)

const getMany = async (items: FaunaCollection<IDbItem> | Promise<FaunaCollection<IDbItem>>): Promise<IDbItem[]> =>
   items instanceof Promise ? items.then(FaunaCollection.getItems) : FaunaCollection.getItems(items)

export const getAll = async (collection: string) => getMany(client.query(
   Map(
      Paginate(Documents(Collection(collection))),
      Lambda(x => Get(x))
   )
))

export const getById = (collection: string, id: string) => getSingle(client.query(
   Get(Ref(Collection(collection), id))
))

export const create = (collection: string, data: IDbItem) => client.query(
   Create(Collection(collection), { data })
)

export const remove = (collection: string, id: string) => client.query(
   Delete(Ref(Collection(collection), id))
)

export const update = (collection: string, data: IDbItem, id: string) => getSingle(client.query(
   Update(Ref(Collection(collection), id), { data })
))

export class DB {
   collection: string

   constructor(collection: string) {
      this.collection = collection
   }

   getAll() {
      return getAll(this.collection)
   }

   getById(id: string) {
      return getById(this.collection, id)
   }

   get(id?: string) {
      return id ? getById(this.collection, id) : getAll(this.collection)
   }

   create(data: IDbItem) {
      return create(this.collection, data)
   }

   delete(id: string) {
      return remove(this.collection, id)
   }

   update(data: IDbItem, id: string) {
      return update(this.collection, data, id)
   }
}