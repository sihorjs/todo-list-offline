import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';

const OfflineStatus = () => {
  const [online, setOnline] = useState(true);

  const setOnlineStatus = useCallback(() => setOnline(true), []);
  const setOfflineStatus = useCallback(() => setOnline(false), []);

  useEffect(() => {
    window.addEventListener('online', setOnlineStatus);
    window.addEventListener('offline', setOfflineStatus);

    return () => {
      window.removeEventListener('online', setOnlineStatus);
      window.removeEventListener('offline', setOfflineStatus);
    };
  }, [setOfflineStatus, setOnlineStatus]);

  return !online && <Alert severity="error">The application is in offline mode</Alert>;
};

export default OfflineStatus;
