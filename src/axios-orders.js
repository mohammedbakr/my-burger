import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://my-burger-7d79b.firebaseio.com/'
})

export default instance
