import React from 'react';
import Menu from './components/Menu'
import About from "./components/About"

const App: React.FC = () => {
    
    return (
        <div className="App">
            <Menu />
            <About />
        </div>
    );
}

export default App;