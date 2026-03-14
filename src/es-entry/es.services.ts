import { Client } from "@elastic/elasticsearch";
import type { TMichelinData } from "./es.types.ts";

export class EsService {
    private esClient: Client
    constructor(esClient: Client) {
        this.esClient = esClient
    }

    async createIndex(indexName: string) {
        try {
            const indexExists = await this.esClient.indices.exists({ index: indexName })

            if (indexExists) {
                return { status: false, message: `[${indexName}]: already exists` }
            }

            await this.esClient.indices.create({ index: indexName })

            return { status: true, message: `[${indexName}]: Index created` }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async listIndices() {
        try {
            const response = await this.esClient.indices.get({
                index: "*"
            })
            return { status: true, message: "Indices listed", data: response }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async deleteIndex(indexName: string) {
        try {
            const indexExists = await this.esClient.indices.exists({ index: indexName })

            if (!indexExists) {
                return { status: false, message: `[${indexName}]: does not exist` }
            }

            await this.esClient.indices.delete({ index: indexName })

            return { status: true, message: "Index deleted" }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async createDocument(index: string, document: TMichelinData) {
        try {
            const response = await this.esClient.index({
                index,
                document
            })

            return { status: true, message: "Document created", data: response }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async bulkCreateDocument(index: string, document: TMichelinData[]) {
        try {
            const operations = document.flatMap((doc) => {
                return [{ index: { _index: index } }, doc]
            })


        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async listDocuments(index: string) {
        try {
            const response = await this.esClient.search({
                index,
                query: {
                    match_all: {}
                }
            })
            return { status: true, message: "Documents listed", data: response }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }

    async searchDocuments(index: string, value: string, field: string) {
        try {
            const response = await this.esClient.search({
                index,
                query: {
                    bool: {
                        must: [
                            {
                                match_phrase_prefix: {
                                    [field]: value
                                }
                            }
                        ]
                    }
                }
            }, {
                ignore: [404],
                maxRetries: 3
            })
            return { status: true, message: "Documents searched", data: response }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }
}