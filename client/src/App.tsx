import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import './App.css';
import { ThemeProvider, theme, CSSReset } from "@chakra-ui/core";

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CSSReset />
                <Router>
                    <Switch>
                        <Route exact path='/' render={() => (<div>Home</div>)} />
                        <Route path='/login' render={() => (<div>Login</div>)} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
