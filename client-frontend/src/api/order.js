import request from '@/utils/request'

export function insertOrder (data) {
  return request({
    url: '/order/insert',
    method: 'POST',
    data
  })
}

export function getOrder (data) {
  return request({
    url: `/order/${data.merchantId}/getOrder?page=${data.page}&limit=${data.limit}`,
    method: 'GET'
  })
}
