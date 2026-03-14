import type { Request, Response } from "express";
import { EsService } from "./es.services.ts";

export class EsController {
    private esService: EsService
    constructor(esService: EsService) {
        this.esService = esService
        this.createIndex = this.createIndex.bind(this)
        this.listIndices = this.listIndices.bind(this)
        this.deleteIndex = this.deleteIndex.bind(this)
        this.createDocument = this.createDocument.bind(this)
        this.listDocuments = this.listDocuments.bind(this)
        this.searchDocuments = this.searchDocuments.bind(this)
    }

    async createIndex(req: Request, res: Response) {
        try {
            console.log(req.body, "index body")
            const resposne = await this.esService.createIndex(req.body.index)

            return res.status(200).json(resposne)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }

    async listIndices(req: Request, res: Response) {
        try {
            const response = await this.esService.listIndices()

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }

    async deleteIndex(req: Request, res: Response) {
        try {
            const response = await this.esService.deleteIndex(req.body.index)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }

    async createDocument(req: Request, res: Response) {
        try {
            const response = await this.esService.createDocument(req.body.index, req.body.document)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }

    async listDocuments(req: Request, res: Response) {
        try {
            const response = await this.esService.listDocuments(req.body.index)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }

    async searchDocuments(req: Request, res: Response) {
        try {
            const response = await this.esService.searchDocuments(req.body.index, req.body.value, req.body.field)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                status: false, message: (error as Error).message
            })
        }
    }
}