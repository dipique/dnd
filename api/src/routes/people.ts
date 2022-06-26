import express, { Request, Response } from 'express'
import { DB } from '../services/db'

const router = express.Router()
const root = 'people'
const db = new DB(root)

// router.all('*', (req: Request, res: Response, next: express.NextFunction) => {
//    console.log('params', req.params)
//    console.log('query', req.query)
//    console.log('method', req.method)
//    next()
// })

router.get(`/${root}`, async (req: Request, res: Response) =>
   req.query.id ? res.json(await db.getById(req.query.id as string)) : res.json(await db.getAll())
)

router.patch(`/${root}`, async (req: Request, res: Response) =>
   res.send(await db.update(await req.body, req.query.id as string))
)

router.post(`/${root}`, async (req: Request, res: Response) =>
   res.send(await db.create(await req.body))
)

router.delete(`/${root}`, async (req: Request, res: Response) =>
   res.send(await db.delete(req.query.id as string))
)

export { router }