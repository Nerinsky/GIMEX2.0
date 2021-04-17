import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartActions";

export default function CartScreen(props)
{
    const productId = props.match.params.id;
    const can = props.location.search? Number(props.location.search.split('=')[1]): 1;
    const dispatch = useDispatch();

    useEffect(() => {
        if(productId)
        {
            dispatch(addToCart(productId, can));
        }
    }, [dispatch, productId, can]);
    return(
        <div>
            <h1>Cart Screen</h1>
            <p>
                Agregar al Carrito: ProductoID: {productId} Cantidad: {can}
            </p>
        </div>
    );
}