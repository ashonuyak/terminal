import axios from './http.service';

export default Object.freeze({
  user: {
    defaultHandler: (body: { command: string; location: string }) =>
      axios.post('commands', body),
    cd: (body: { destination: string; location: string }) =>
      axios.post('commands/cd', body),
  },
});
