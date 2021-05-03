import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../actions/cartActions";
import MessageBox from "../components/MessageBox";

export default function CartScreen(props)
{
    const productId = props.match.params.id;
    const can = props.location.search? Number(props.location.search.split('=')[1]): 1;
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const dispatch = useDispatch();

    useEffect(() => {
        if(productId)
        {
            dispatch(addToCart(productId, can));
        }
    }, [dispatch, productId, can]);
    const removeFromCartHandler = (id) =>
    {
        //Accion Borrar
    };
    const checkoutHandler = () =>
    {
        props.history.push('/signin?redirect=shipping');
    };
    
    return(
        <div className="row top">
            <div className="col-2">
                <h1>Carrito de Compras</h1>
                {
                    cartItems.length === 0?
                        <MessageBox>
                        Carrito esta vacio. <Link to="/"> Ir de Compras</Link>
                        </MessageBox>
                        :
                        (
                            <ul>
                                {
                                    cartItems.map((item) =>
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
                                                    <select value={item.can} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                    {
                                                        [...Array(item.countInStock).keys()].map(x => 
                                                            (
                                                                <option key={x+1} value = {x+1}>{x+1}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    ${item.price}
                                                </div>
                                                <div>
                                                    <button type="button" onClick={() => removeFromCartHandler(item.product)}>Borrar</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                }
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Subtotal ({cartItems.reduce((a, c) => a + c.can, 0)} items) : ${cartItems.reduce((a, c) => a + c.price * c.can, 0)}
                            </h2>
                        </li>
                        <li>
                            <button type="button" onClick={checkoutHandler} className="primary block" disabled={cartItems.length === 0}>
                                Proceder a Pagar
                            </button>
                        </li>
                    </ul>
                </div>
            </div>    
        </div>
    );
}