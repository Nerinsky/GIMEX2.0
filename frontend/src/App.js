import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import CartSecreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserListScreen from './screens/UserListScreen';

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
                    <Link to="/profile">Perfil del Usuario </Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Historial de Pedidos</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={ signoutHandler }>Salir</Link>
                  </li>
                </ul>
                </div>
              ):
              (
                <Link to="/signin">Usuario</Link>
              )
            }
            {
              userInfo && userInfo.isAdmin &&
              (
                <div className="dropdown">
                  <Link to="#admin">
                    Administrador <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/dashboard">Tablero</Link>
                    </li>
                    <li>
                      <Link to="/productlist">Productos</Link>
                    </li>
                    <li>
                      <Link to="/orderlist">Pedidos</Link>
                    </li>
                    <li>
                      <Link to="/userlist">Usuarios</Link>
                    </li>
                  </ul>
                </div>
              )
            }
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartSecreen}></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <PrivateRoute path="/profile/" component={ProfileScreen}></PrivateRoute>
          <AdminRoute path="/productlist" component={ProductListScreen}></AdminRoute>
          <AdminRoute path="/orderlist" component={OrderListScreen}></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
          <Route path="/" component={HomeScreen} exact></Route> 
        </main>
        <footer className="row center">ITGAM-GIMEX-NERI Todos los Derechos Reservados</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;