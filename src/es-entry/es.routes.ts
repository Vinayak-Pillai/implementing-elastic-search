import { Router } from "express";
import { EsController } from "./es.controller.ts";
import { EsService } from "./es.services.ts";
import { esClient } from "../elastic-search-client.ts";

const router = Router()

const esController = new EsController(new EsService(esClient))

router.route("/create-index").post(esController.createIndex)
router.route("/list-indices").get(esController.listIndices)
router.route("/delete-index").delete(esController.deleteIndex)
router.route("/create-document").post(esController.createDocument)
router.route("/list-documents").get(esController.listDocuments)
router.route("/search-documents").post(esController.searchDocuments)

export default router