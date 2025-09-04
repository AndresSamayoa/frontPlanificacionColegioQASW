import axios from 'axios';

export default async function HttpPetition (data) {
  const response = await axios({
    ...data,
    headers: {
      ...data.headers,
      auth_token: localStorage.getItem('token')
    },
    validateStatus: () => true
  });

  if (response.status == 401) {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return response;
}
