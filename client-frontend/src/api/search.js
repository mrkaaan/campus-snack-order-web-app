// src/api/auth.js
import request from '@/utils/request'

export function searchMerchants (data) {
  console.log(data.keyword)
  return request({
    url: '/search/merchants',
    method: 'GET',
    params: {
      keyword: data.keyword
    }
  })
}

export function searchProducts (data) {
  return request({
    url: '/search/products',
    method: 'GET',
    query: {
      keyword: data.keyword
    }
  })
}
