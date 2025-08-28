import axios from 'axios';

export default async function HttpPetition (data) {
  const response = await axios({
    ...data,
    validateStatus: () => true
  });

  if (response.status == 401) {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return response;
}
