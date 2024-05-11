import request from '@/utils/request'

export function insertOrder (data) {
  return request({
    url: '/order/insert',
    method: 'POST',
    data
  })
}

export function getMerchantOrder (data) {
  return request({
    url: `/order/getMerchantOrder/${data.merchantId}`,
    method: 'GET'
  })
}

export function getUserOrder (data) {
  return request({
    url: `/order/getUserOrder/${data.userId}`,
    method: 'GET'
  })
}

export function searchOrders (data) {
  return request({
    url: '/order/search', // 假设后端接口的路径是 /order/search
    method: 'GET',
    params: {
      // 将所有搜索条件作为查询参数传递
      merchantId: data.merchantId,
      userId: data.accountId,
      orderId: data.orderId,
      productId: data.productId,
      productType: data.productType,
      minSalePrice: data.minSalePrice,
      maxSalePrice: data.maxSalePrice,
      minOriginalPrice: data.minOriginalPrice,
      maxOriginalPrice: data.maxOriginalPrice,
      startTime: data.startTime,
      endTime: data.endTime,
      pickupNumber: data.pickupNumber,
      page: data.page,
      limit: data.limit
    }
  })
}

export function updateOrder (data) {
  return request({
    url: '/order/updateOrder', // 假设后端接口的路径是 /order/search
    method: 'POST',
    data
  })
}

export function deleteOrder (data) {
  return request({
    url: '/order/deleteOrder', // 假设后端接口的路径是 /order/search
    method: 'POST',
    data
  })
}
