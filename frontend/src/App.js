import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

function App() {
return (
  <BrowserRouter>
    <div className="grid-container">
      <header className="row">
        <div>
          <a className="brand" href="/">
            GIMEX
          </a>
        </div>
        <div>
          <a href="/cart">Carrito</a>
          <a href="/signin">Registrase</a>
        </div>
      </header>
      <main>
        <Route path="/product/:id" component={ProductScreen}></Route>
        <Route path="/" component={HomeScreen} exact></Route>
      </main>
      <footer className="row center">ITGAM-GIMEX-NERI All right reserved</footer>
    </div>
  </BrowserRouter>
  );
}

export default App;