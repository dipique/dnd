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

export interface IDbItem {
   id: string
}

interface FaunaInnerRef {
   id: string
   collection?: FaunaRef
}

interface FaunaRef {
   value: FaunaInnerRef
}

export class FaunaItem<T> {
   ref: FaunaRef
   ts: string = ''
   data: T

   constructor(data: T, ref: FaunaRef) {
       this.data = data
       this.ref = ref
   }

   static getId<T>(item: FaunaItem<T>): string {
       return item.ref.value.id
   }

   static withId<T>(item: FaunaItem<T>): T {
       return {
           ...item.data,
           id: FaunaItem.getId(item)
       } as T
   }
}

export class FaunaCollection<T> {
   data: FaunaItem<T>[] = []

   static getItems<T>(col: FaunaCollection<T>): T[] {
       return col.data.map(FaunaItem.withId)
   }
}

const getSingle = async (item: FaunaItem<any> | Promise<FaunaItem<any>>): Promise<any> =>
   item instanceof Promise ? item.then(FaunaItem.withId) : FaunaItem.withId(item)

const getMany = async (items: FaunaCollection<any> | Promise<FaunaCollection<any>>): Promise<any[]> =>
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
      console.log('getAll')
      return getAll(this.collection)
   }

   getById(id: string) {
      console.log('getById')
      return getById(this.collection, id)
   }

   get(id?: string) {
      console.log('get')
      return id ? getById(this.collection, id) : getAll(this.collection)
   }

   create(data: IDbItem) {
      return create(this.collection, data)
   }

   delete(id: string) {
      return remove(this.collection, id)
   }

   update(data: IDbItem, id: string) {
      console.log('update', id)
      return update(this.collection, data, id)
   }
}