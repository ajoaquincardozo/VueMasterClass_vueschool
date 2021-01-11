import firebase from 'firebase/app'
import 'firebase/database'
import { helpers as vuelidateHelpers } from 'vuelidate/lib/validators'

export const uniqueUsername = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }

  return new Promise((resolve) => {
    firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const supportedImageFile = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }

  const supported = ['jpg', 'jpeg', 'gif', 'png', 'svg']
  const suffix = value.split('.').pop()
  return supported.includes(suffix)
}

export const responseOk = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    fetch(value)
    .then(response => resolve(response.ok))
    .catch(() => resolve(false))
  })
}

export const uniqueEmail = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }

  return new Promise((resolve) => {
    firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}
