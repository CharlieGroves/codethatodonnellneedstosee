import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Signup from './Signup';
import Game from './Game';
import Login from './Login';
import Username from './Username'
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../AuthContext';

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>
              <Route path='/signup' component={Signup} />
              <Route exact path='/' component={Login} />
              <PrivateRoute path='/game' component={Game} />
              <PrivateRoute path='/username' component={Username} />
            </Switch>
          </AuthProvider>
        </Router>
  );
}

export default App;
