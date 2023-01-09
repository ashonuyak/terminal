import axios from './http.service'

export default Object.freeze({
  user: {
    defaultHandler: (params) => axios.post('commands', params),
    cd: (params) => axios.post('commands/cd', params),
  },
})
