import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path='/' render={() => (<div>Home</div>)} />
                    <Route path='/login' render={() => (<div>Login</div>)} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
