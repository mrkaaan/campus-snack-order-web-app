import request from '@/utils/request'

export function getMerchants () {
  return request({
    url: '/merchants',
    method: 'GET'
  })
}

export function getMerchantsPaging (query) {
  return request({
    url: `/merchants?page=${query.page}&limit=${query.limit}`,
    method: 'GET'
  })
}

export function getMerchantDetails (id) {
  return request({
    url: `/merchants/${id}`,
    method: 'GET'
  })
}

export function getMerchantProductsByCate (id) {
  return request({
    url: `/merchants/${id}/productsByCate`,
    method: 'GET'
  })
}

export function getMerchantProducts (id) {
  return request({
    url: `/merchants/${id}/products`,
    method: 'GET'
  })
}
