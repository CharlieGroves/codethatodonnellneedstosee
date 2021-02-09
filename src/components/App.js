import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Signup from './Signup';
import Game from './Game';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../AuthContext';

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>
              <Route path='/signup' component={Signup} />
              <Route path='/' component={Login} />
              <PrivateRoute path='/game' component={Game} />
            </Switch>
          </AuthProvider>
        </Router>
  );
}

export default App;
