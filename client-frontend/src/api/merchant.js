import request from '@/utils/request'

export function getMerchants () {
  return request({
    url: '/merchants',
    method: 'GET'
  })
}
