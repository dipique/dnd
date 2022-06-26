import express, { Request, Response } from 'express'
import { DB } from '../services/db'

const router = express.Router()
const root = 'people'
const db = new DB('people')

// router.all('*', (req: Request, res: Response, next: NextFunction) => {
// })

router.get(`/${root}`, async (req: Request, res: Response) =>
   res.send(await db.getAll())
)

router.patch(`/${root}?:id`, async (req: Request, res: Response) =>
   res.send(await db.update(await req.body, req.query.id as string))
)

router.get(`/${root}?:id`, async (req: Request, res: Response) =>
   res.send(await db.getById(req.query.id as string))
)

router.post(`/${root}?:id`, async (req: Request, res: Response) =>
   res.send(await db.create(await req.body))
)

router.delete(`/${root}?:id`, async (req: Request, res: Response) =>
   res.send(await db.delete(req.query.id as string))
)

export { router }