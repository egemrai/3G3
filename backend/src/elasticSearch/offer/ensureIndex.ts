import { elasticSearchClient } from "../client"

export async function ensureListingsIndex() {
  const index = "offers"
  console.log('ensureListingsIndexe girdi')
  const exists = await elasticSearchClient.indices.exists({ index }) // indices --> Elasticsearch’te index’leri oluşturan, silen ve kontrol eden yönetim API'ı sanırım
  if (exists) return

  await elasticSearchClient.indices.create({
    index,
    mappings: {
      properties: {
        // _id: { type: "keyword" },
        
        categoryName: { type: "keyword" }, // "lol", "valorant"
        serviceName: { type: "keyword" }, // "LolAccount", "LolBoost" discriminatorKey

        sellerId: { type: "keyword" },
        sellerUsername: { type: "keyword" },

        title: {  // text tipi search için ideal, keyword de sort ve filter için. title search, filter, sort gibi bütün yerlerde kullanılabilir olduğu için aynı veriyi 2 farklı yere yazıp, 2 farklı tiple kullanmak mantıklı
          type: "text",
          fields: {
            keyword: { type: "keyword" }
          }
        },
        description: { type: "text" },

        server: { type: "keyword" },
        rank: { type: "keyword" },
        desiredRank: { type: "keyword" },
        serviceType: { type: "keyword" },

        champions: { type: "integer" },
        skins: { type: "integer" },
        duration: { type: "integer" },

        deliveryTime: { type: "integer" },
        stock: { type: "integer" },

        price: { type: "scaled_float", scaling_factor: 100 }, // 9.99$yi 9.99 * 100 = 999 şeklinde saklıyor datada, intiger daha güvenli. scaling factor 100 -> 2 basamak decimal, 10 olsaydı 1 basamak
        currency: { type: "keyword" },
        active: { type: "boolean" },

        createdAt: { type: "date" },
        updatedAt: { type: "date" }
      },
    },
  })
}