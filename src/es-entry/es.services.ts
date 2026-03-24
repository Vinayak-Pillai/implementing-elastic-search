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

    async deleteIndices(indices: string[]) {
        try {
            const response = await this.esClient.indices.delete({
                index: indices,
                ignore_unavailable: true
            })

            return { status: true, message: "Indices deleted", data: response }
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

            const response = await this.esClient.bulk({
                operations,
                refresh: true
            })

            return { status: true, message: "Documents bulk created", data: response }
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


    /*     code to pass as payload
    {
            "index": "michelin_v6",
            "searchFields": [
                {
                    "field": "city",
                    "value": "new "
                }
            ],
            "mustNot": [
                {
                    "field": "cuisine",
                    "value": "Contemporary"
                },
                {
                    "field": "cuisine",
                    "value": "Japanese"
                }
            ],
            "sort": [
                {
                    "field": "star",
                    "order": "asc"
                },
                {
                    "field": "price",
                    "order": "asc"
                }
            ],
            "range": [
                {
                    "field": "star",
                    "gte": 2
                },
                {
                    "field": "price",
                    "gte": 20
                }
            ]
        } */


    async searchDocuments(index: string, searchFields: { field: string, value: string }[], sort?: { field: string, order: "asc" | "desc" }[], range?: { field: string, gte?: number, lte?: number }[], mustNot?: { field: string, value: string }[]) {
        try {
            const operations: Record<string, any>[] = []
            if (range && range.length > 0) {
                range.forEach(rangeField => {
                    if (rangeField.gte || rangeField.lte) {

                        operations.push({
                            range: {
                                [rangeField.field]: {
                                    ...(rangeField.gte && { gte: rangeField.gte }),
                                    ...(rangeField.lte && { lte: rangeField.lte })
                                }
                            }
                        })
                    }
                })
            }

            const mustBoolOperations = searchFields.map(searchField => ({
                match_phrase_prefix: {
                    [searchField.field]: searchField.value,
                },
            }))

            const mustNotOperations = mustNot?.map(mn => {
                return { match_phrase_prefix: { [mn.field]: mn.value } }
            })

            console.log(JSON.stringify({
                must: mustBoolOperations,
                ...(operations.length > 0 && { filter: operations }),
                ...(mustNotOperations && mustNotOperations.length > 0 && { must_not: mustNotOperations })
            }, null, 2))

            const response = await this.esClient.search({
                index,
                query: {
                    bool: {
                        must: mustBoolOperations,
                        ...(operations.length > 0 && { filter: operations }),
                        ...(mustNotOperations && mustNotOperations.length > 0 && { must_not: mustNotOperations })
                    },
                },
                ...(sort && sort.length > 0 && {
                    sort: sort.map(sortField => {
                        return { [sortField.field]: sortField.order }
                    })
                }),
            }, {
                ignore: [404],
                maxRetries: 3
            })

            const sanitizedResponse = response?.hits?.hits?.map(hit => {
                return { ...hit._source as {}, _id: hit._id, _score: hit._score }
            }) || response
            return { status: true, message: "Documents searched", data: sanitizedResponse }
        } catch (error) {
            console.log(error)
            return { status: false, message: (error as Error).message }
        }
    }
}