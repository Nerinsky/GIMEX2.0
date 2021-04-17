import axios from "axios"
import { CART_ADD_ITEM } from "../constants/cartConstants";

export const addToCart = (productId, can) => async(dispatch, getState) =>
{
    const {data} = await axios.get(`/api/products/${productId}`);
    dispatch(
        {
            type: CART_ADD_ITEM,
            payload:
            {
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                product: data._id,
                can,
            },
        });
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}