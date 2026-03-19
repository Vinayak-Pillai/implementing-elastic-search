import { esClient } from "./elastic-search-client.ts"

const updateAllPrices = async () => {
    try {
        await esClient.updateByQuery({
            index: 'michelin',
            refresh: true,
            script: {
                lang: 'painless',
                source: `
                int randomPrice=(int)(Math.random()*100)+10;
                ctx._source.price=randomPrice;
            `
            },
            query: {
                match_all: {}
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// updateAllPrices()

const reIndexPricing = async () => {
    try {
        await esClient.indices.create({
            index: 'michelin_v6',
            mappings: {
                properties: {
                    name: { type: 'text' },
                    year: { type: 'integer' },
                    location: { type: 'geo_point' },
                    city: { type: 'text' },
                    cuisine: { type: 'text' },
                    price_level: { type: 'integer' },
                    star: { type: 'integer' }
                }
            }
        });
        await esClient.reindex({
            source: { index: "michelin" },
            dest: { index: "michelin_v6" },
            script: {
                lang: 'painless',
                source: `
                    if(ctx._source.pin!=null && ctx._source.pin.location!=null){
                        ctx._source.location=[Double.parseDouble(ctx._source.pin.location.lon),Double.parseDouble(ctx._source.pin.location.lat)];
                    }
                    ctx._source.remove('pin');
                `,
            }
        })
    } catch (error) {
        console.log(error)
    }
}

reIndexPricing()