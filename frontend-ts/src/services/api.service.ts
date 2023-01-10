import axios from './http.service';

export default Object.freeze({
  user: {
    defaultHandler: (body: {
      command: string;
      location: string;
      role: string;
    }) => axios.post('commands', body),
    cd: (body: { destination: string; location: string }) =>
      axios.post('commands/cd', body),
    auth: (body: { name: string; password: string }) =>
      axios.post('auth/sign-in', body),
    customize: (body: {
      id: string;
      backgroundColor?: string;
      textColor?: string;
    }) => axios.post('customization/update', body),
  },
});
