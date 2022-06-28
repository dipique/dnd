import express, { Request, Response } from 'express'
import { DB } from '../services/db'

const router = express.Router()
const root = 'places'
const db = new DB(root)

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