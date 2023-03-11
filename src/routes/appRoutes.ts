import express from 'express'
import { home, copyData } from './../controller/appController';
const appRouter = express.Router()

appRouter.get('/', home)

appRouter.post('/copy-dir', copyData)

export = appRouter