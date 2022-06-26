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

export const getAll = (collection: string) => client.query(
   Map(
      Paginate(Documents(Collection(collection))),
      Lambda(x => Get(x))
   )
)

export const getById = (collection: string, id: string) => client.query(
   Get(Ref(Collection(collection), id))
)

export const create = (collection: string, data: IDbItem) => client.query(
   Create(Collection(collection), { data })
)

export const remove = (collection: string, id: string) => client.query(
   Delete(Ref(Collection(collection), id))
)

export const update = (collection: string, data: IDbItem, id: string) => client.query(
   Update(Ref(Collection(collection), id), { data })
)

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