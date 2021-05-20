import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props)
{
    const userSignin = useSelector(state => state.userSignin)
    const { userInfo } = userSignin;
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;
    if(!userInfo)
    {
        props.history.push('/signin')
    }
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postal, setPostal] = useState(shippingAddress.postal);
    const [state, setState] = useState(shippingAddress.state);
    const dispatch = useDispatch();
    const submitHandler = (e) =>
    {
        e.preventDefault();
        dispatch(saveShippingAddress({fullName, address, city, postal, state}))
        props.history.push('/payment');
        //dispatch accion que guarda direccion de envio
    }
    return(
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Dirección de Envio</h1>
                </div>
                <div>
                    <label htmlFor="fullName">Nombre Completo</label>
                    <input type="text" id="fullName" placeholder="Ingresa tu Nombre Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required></input>
                </div>
                <div>
                    <label htmlFor="address">Dirección</label>
                    <input type="text" id="address" placeholder="Ingresa tu Dirección" value={address} onChange={(e) => setAddress(e.target.value)} required></input>
                </div>
                <div>
                    <label htmlFor="city">Ciudad</label>
                    <input type="text" id="city" placeholder="Ingresa tu Ciudad" value={city} onChange={(e) => setCity(e.target.value)} required></input>
                </div>
                <div>
                    <label htmlFor="postal">Codigo Postal</label>
                    <input type="text" id="postal" placeholder="Ingresa tu Codigo Postal" value={postal} onChange={(e) => setPostal(e.target.value)} required></input>
                </div>
                <div>
                    <label htmlFor="state">Estado</label>
                    <input type="text" id="state" placeholder="Ingresa tu Estadp" value={state} onChange={(e) => setState(e.target.value)} required></input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit"> Continuar </button>
                </div>
            </form>
        </div>
    )
}