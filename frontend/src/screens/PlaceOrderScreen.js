import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen(props)
{
    const cart = useSelector((state) => state.cart);
    if(!cart.paymentMethod)
    {
        props.history.push('/payment');
    }
    const orderCreate = useSelector(state => state.orderCreate);
    const { loading, success, error, order } = orderCreate; 
    const toPrice = (num) => Number(num.toFixed(2)); //5.456 = "5.45" = 5.45
    cart.itemsPrice = toPrice(
        cart.cartItems.reduce((a, c) => a + c.can * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 10 ? toPrice(0) : toPrice(5);
    cart.ivaPrice = toPrice(0.16 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.ivaPrice;
    const dispatch = useDispatch();
    const placeOrderHandler = () =>
    {
        dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
    };
    useEffect(() =>
    {
        if(success)
        {
            props.history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, order, props.history, success]);

    return(
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Envío</h2>
                                <p>
                                    <strong>Nombre</strong> {cart.shippingAddress.fullName} <br />
                                    <strong>Dirección:</strong> {cart.shippingAddress.address},{cart.shippingAddress.city},
                                    {cart.shippingAddress.postal},{cart.shippingAddress.state}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Pago</h2>
                                <p>
                                    <strong>Metodo:</strong> {cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Orden de Pedido</h2>
                                <ul>
                                    {
                                        cart.cartItems.map((item) =>
                                        (
                                            <li key={item.product}>
                                                <div className="row">
                                                    <div>
                                                        <img src={item.image} alt={item.name} className="small"></img>
                                                    </div>
                                                    <div className="min-30">
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </div>
                                                    <div>
                                                        {item.can} x ${item.price} = ${item.can * item.price}
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="col-1">
                        <div className="card card-body">
                            <ul>
                                <li>
                                    <h2>Descripcion del Pedido</h2>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Productos</div>
                                        <div>${cart.itemsPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Envío</div>
                                        <div>${cart.shippingPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>IVA</div>
                                        <div>${cart.ivaPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>
                                            <strong>Total</strong>
                                        </div>
                                        <div>
                                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <button type="button" onClick={placeOrderHandler} className="primary block" disabled={cart.cartItems.length ===0}>
                                        Realizar Pedido
                                    </button>
                                </li>
                                {loading && <LoadingBox></LoadingBox>}
                                {error && <MessageBox variant="danger">{error}</MessageBox>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}