// src/api/auth.js
import request from '@/utils/request'

export function getProducts (data) {
  console.log(data.keyword)
  return request({
    url: '/check/getProducts',
    method: 'GET',
    params: {
      merchantId: data.merchantId
    }
  })
}

export function saveProduct (data) {
  return request({
    url: '/check/saveProduct',
    method: 'POST',
    data
  })
}
