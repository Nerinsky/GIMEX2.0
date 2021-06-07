import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() 
{
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate, } = userUpdateProfile;

    const dispatch = useDispatch();
    useEffect(() => 
    {
        if(!user)
        {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch( detailsUser(userInfo._id) );
        }
        else
        {
            setName(user.name);
            setEmail(user.email);
            if(user.seller)
            {
                setSellerName(user.seller.name);
                setSellerLogo(user.seller.logo);
                setSellerDescription(user.seller.description)
            }
        }
    }, [dispatch, userInfo._id, user]);
    
    
    const submitHandler = (e) => 
    {
        e.preventDefault();
        if (password !== confirmPassword)
        {
            alert('Las Contraseñas no coinciden')
        }
        else
        {
            dispatch(updateUserProfile(  {userId: user._id, name, email, password, sellerName, sellerLogo, sellerDescription} ));
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Actualizar Datos</h1>
                </div>
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) :
                error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                        {errorUpdate && (<MessageBox variant="danger">{errorUpdate}</MessageBox>)}
                        {successUpdate && (<MessageBox variant="success">Datos Actualizados Correctamente</MessageBox>)}
                        <div>
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ingrese Nombre"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Correo Electronico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Ingrese Correo Electronico"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Ingrese Nueva Contraseña"
                                onChange={e => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirme Contraseña</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme Nueva Contraseña"
                                onChange={e => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        {
                            user.isSeller &&
                            (
                                <>
                                    <h2>Vendedor</h2>
                                    <div>
                                        <label html="sellerName">Nombre de Vendedor</label>
                                        <input id="sellerName" type="text" placeholder="Ingrese Nombre del Vendedor" value={ sellerName } onChange={e => setSellerName(e.target.value)}></input>
                                    </div>
                                    <div>
                                        <label html="sellerLogo">Logo de Vendedor</label>
                                        <input id="sellerLogo" type="text" placeholder="Ingrese Logo del Vendedor" value={ sellerLogo } onChange={e => setSellerLogo(e.target.value)}></input>
                                    </div>
                                    <div>
                                        <label html="sellerDescription">Descripcion de Vendedor</label>
                                        <input id="sellerDescription" type="text" placeholder="Ingrese Descripcion del Vendedor" value={ sellerDescription } onChange={e => setSellerDescription(e.target.value)}></input>
                                    </div>
                                </>
                            )
                        }
                        <div>
                            <label />
                            <button className="primary" type="submit">
                                Actualizar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}