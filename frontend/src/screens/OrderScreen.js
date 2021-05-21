import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function OrderScreen(props)
{ 
    const orderId = props.match.params.id;
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const dispatch = useDispatch();
    
    useEffect(() =>
    {
        dispatch(detailsOrder(orderId));
    }, [dispatch, orderId]);

    return loading? 
    (
    <LoadingBox></LoadingBox>
    ):
    error? 
    (
    <MessageBox variant="danger">{error}</MessageBox>
    ):
    (
        <div>
            <h1>Pedido { order._id }</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Envío</h2>
                                <p>
                                    <strong>Nombre</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Dirección:</strong> {order.shippingAddress.address},{order.shippingAddress.city},
                                    {order.shippingAddress.postal},{order.shippingAddress.state}
                                </p>
                                {
                                    order.isDelivered ? 
                                    (
                                        <MessageBox variant="success">Entregado en {order.deliveredAt}</MessageBox>
                                    ) : 
                                    (
                                        <MessageBox variant= "danger">No Entregado</MessageBox>
                                    )
                                }
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Pago</h2>
                                <p>
                                    <strong>Metodo:</strong> {order.paymentMethod}
                                </p>
                                {
                                    order.isPaid ? 
                                    (
                                        <MessageBox variant="success">Pagado en {order.paidAt}</MessageBox>
                                    ) : 
                                    (
                                        <MessageBox variant= "danger">No Pagado</MessageBox>
                                    )
                                }
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Orden de Pedido</h2>
                                <ul>
                                    {
                                        order.orderItems.map((item) =>
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
                                        <div>${order.itemsPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Envío</div>
                                        <div>${order.shippingPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>IVA</div>
                                        <div>${order.ivaPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>
                                            <strong>Total</strong>
                                        </div>
                                        <div>
                                            <strong>${order.totalPrice.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </li>                                
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}