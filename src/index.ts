import express from "express"
import type { Request, Response } from "express"
import router from "./index.route.ts"

const app = express()

app.use(express.json({
    limit: "50mb"
}))

app.listen(process.env["PORT"] || 3000, () => {
    console.log("Server is running on port", process.env["PORT"] || 3000)
})
app.get("/health-check", (req: Request, res: Response) => {
    return res.status(200).json({
        status: true, message: "Server started..."
    })
})

app.use(router)