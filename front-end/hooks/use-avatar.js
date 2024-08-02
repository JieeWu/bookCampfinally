import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAvatarLoader(clientId) {
  const [loadAvatar, setLoadAvatar] = useState('');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (clientId) {
          const response = await axios.get(`http://localhost:3002/member/avatar/${clientId}`);
          setLoadAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAvatar();
  }, [clientId]);

  return loadAvatar;
}
