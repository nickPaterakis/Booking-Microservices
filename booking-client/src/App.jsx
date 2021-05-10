import React from 'react';
import 'react-dates/lib/css/_datepicker.css';
import './styles/main.scss';
import { Route, Switch } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import keycloak from './utils/keycloak';
import { getUserDetailsMe, saveUserDetailsMe } from './api/UserService';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import 'react-dates/initialize';
import Home from './pages/Home';
import Layout from './hoc/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Properties from './pages/Properties';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import Property from './pages/Property';
import { setUser } from './store/actions/userActions';
import Spinner from './components/UI/Spinner';

function App() {
  const initOptions = { pkceMethod: 'S256' };
  const dispatch = useDispatch();

  const handleOnEvent = async (event, error) => {
    if (event === 'onAuthSuccess') {
      if (keycloak.authenticated) {
        let response = await getUserDetailsMe(keycloak.token);
        if (response.status === 500) {
          const userExtra = {
            firstName: keycloak.tokenParsed.given_name,
            lastName: keycloak.tokenParsed.family_name,
            email: keycloak.tokenParsed.email,
          };
          response = await saveUserDetailsMe(keycloak.token, userExtra);
          console.log(`UserExtra created for ${keycloak.tokenParsed.email}`);
        }
        dispatch(setUser(response.data));
      }
    }
  };

  const routes = (
    <Switch>
      <Route path="/properties">
        <Properties />
      </Route>
      <Route path="/property/:id">
        <Property />
      </Route>
      <PrivateRoute roles={['user']} path="/profile">
        <Profile />
      </PrivateRoute>
      <Route path="/reservations">
        <Reservations />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
  return (
    <div className="App">
      <ReactKeycloakProvider 
        authClient={keycloak}
        initOptions={initOptions}
        LoadingComponent={<Spinner />}
        onEvent={(event, error) => handleOnEvent(event, error)}
      >
        <Layout>
          {routes}
        </Layout>
      </ReactKeycloakProvider>
   
    </div>
  );
}

export default App;