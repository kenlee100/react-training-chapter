export function createRequestInstance(axios) {
  const { VITE_URL } = import.meta.env
  const service = axios.create({
    baseURL: VITE_URL,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json'
    },
    timeout: 60 * 1000
  })
  
  service.interceptors.request.use(
    (config) => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  service.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      const {
        response: {
          data: { message },
          status
        }
      } = error
      switch (status) {
        case 400:
        case 401:
        case 404:
          console.error(message)
          alert(message)
          break
        default:
          console.log(error);
      }
      return Promise.reject(error)
    }
  )
  return service
}
