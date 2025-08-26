import { useEffect, useState } from 'react';
import { createActor } from 'declarations/pro_hackathon-react-backend';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Root from './pages/Root';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId } from 'declarations/pro_hackathon-react-backend/index.js';
import AuthSecurity from './pages/AuthSecurity';
import GuestSecurity from './pages/GuestSecurity';
import Create from './pages/Create';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

function App() {
  const [user, setUser] = useState({
    actor: undefined,
    authClient: undefined,
    isAuth: false,
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuth = await authClient.isAuthenticated();

    setUser((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuth
    }));
  };

  const login = async () => {
    await user.authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  };

  const logout = async () => {
    await user.authClient.logout();
    updateActor();
  };

  return (
    <Routes>
      <Route index element={<GuestSecurity isAuth={user.isAuth}>
        <Root login={login} />
      </GuestSecurity>} />
      <Route path="/dashboard" element={<AuthSecurity user={user} isAuth={user.isAuth}>
        <Dashboard user={user} logout={logout} message={message}
          success={success}
          setMessage={setMessage}
          setSuccess={setSuccess} />
      </AuthSecurity>} />
      <Route path="/create" element={<AuthSecurity isAuth={user.isAuth}>
        <Create user={user} setMessage={setMessage}
          setSuccess={setSuccess} />
      </AuthSecurity>} />
    </Routes>
  );
}

export default App;
