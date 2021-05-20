import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import CartSecreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';

function App() 
{
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const userSignin = useSelector(state => state.userSignin);
  const {userInfo} = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () =>
  {
    dispatch(signout());
  }
  return(
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              GIMEX
            </Link>
          </div>
          <div>
            <Link to="/cart">Carrito
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            {
              userInfo ? 
              (
                <div className="dropdown">
                <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i>{' '} </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="#signout" onClick={ signoutHandler }>Salir</Link>
                  </li>
                </ul>
                </div>
              ):
              (
                <Link to="/signin">Registrarse</Link>
              )
            }
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartSecreen}></Route>
          <Route path="/product/:id" component={ProductScreen}></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
        </main>
        <footer className="row center">ITGAM-GIMEX-NERI All right reserved</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;