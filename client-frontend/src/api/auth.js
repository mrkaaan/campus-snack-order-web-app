// src/api/auth.js
import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

export function loginGuest () {
  return request({
    url: '/auth/login-guest',
    method: 'POST'
  })
}

export function register (data) {
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  })
}
