import http from 'k6/http'
import { check } from 'k6'

export default function () {
  // const res = http.get('http://localhost:5000/api/elasticSearch/getOffersViaElasticSearch/?serviceName=LolAccount&filter=&sort=Lowest%20price&page=1')
  const res = http.get('https://elugemna.store/api/elasticSearch/getOffersViaElasticSearch/?serviceName=LolAccount&filter=&sort=Lowest%20price&page=1')

  check(res, {
    'status 200 mü?': (r) => r.status === 200,
  })
}