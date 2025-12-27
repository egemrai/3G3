import { Client } from "@elastic/elasticsearch"
import env from "../utils/validateEnv"

const node = env.ELASTICSEARCH_URL ?? "http://localhost:9200"

export const elasticSearchClient = new Client({
  node,
  // dev'de genelde gerekmez; prod'da https/auth gelince burada ayarlarsın
  // auth: { username: "elastic", password: "..." },
  // tls: { rejectUnauthorized: false },
})