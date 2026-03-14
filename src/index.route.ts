import { Router } from "express";
import esRoutes from "./es-entry/es.routes.ts"

const router = Router()

router.use("/api/v1", esRoutes)

export default router