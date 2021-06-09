import Rating from "../components/Rating";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { createReview, detailsProduct } from "../actions/productActions";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";

export default function ProductScreen(props) 
{
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const [can, setCantidad] = useState(1);
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product} = productDetails;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const
    {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
    } = productReviewCreate;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() =>
    {
        if(successReviewCreate)
        {
            window.alert('Reseña Enviada Exitosamente');
            setRating('');
            setComment('');
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
        }
        dispatch(detailsProduct(productId));
    }, [dispatch, productId, successReviewCreate]);
    const addToCartHandler = () =>
    {
        props.history.push(`/cart/${productId}?can=${can}`);
    };
    const submitHandler = e => 
    {
        e.preventDefault();
        if(comment && rating)
        {
            dispatch(createReview(productId, { rating, comment, name: userInfo.name }));
        }
        else
        {
            alert('Ingrese Comentario y Calificación');
        }
    }
    return (
        <div>
            {loading? (<LoadingBox></LoadingBox>)
            :
            error? (<MessageBox variant="danger">{error}</MessageBox>)
            :(
            <div>
            <Link to="/">Regresar Inicio</Link>
            <div className="row top">
                <div className="col-2">
                    <img className="large" src={product.image} alt={product.name}></img>
                </div>
                    <div className="col-1">
                        <ul>
                            <li>
                                <h1>{product.name}</h1>
                            </li>
                            <li>
                                <Rating
                                    rating={product.rating}
                                    numReviews={product.numReviews}
                                ></Rating>
                            </li>
                            <li>Marca : {product.brand}</li>
                            <li>Precio : ${product.price}</li>
                            <li>
                                Descripcion:
                                    <p>{product.description}</p>
                            </li>
                        </ul>
                    </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <div className="row">
                                    <div>Precio</div>
                                        <div className="price">${product.price}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Status</div>
                                        <div>
                                            {
                                                product.countInStock > 0 ? (
                                                    <span className="success">Disponible</span>
                                                ) : (
                                                        <span className="danger">No Disponoble</span>
                                                    )
                                            }
                                    </div>
                                </div>
                            </li>
                            {
                                product.countInStock > 0 && 
                                (
                                    <>
                                        <li>
                                            <div className="row">
                                                <div>Cantidad</div>
                                                <div>
                                                    <select value={can} onChange={e => setCantidad(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map(x => 
                                                                (
                                                                    <option key={x+1} value = {x+1}>{x+1}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <button onClick={addToCartHandler} className="primary block">Agregar al Carrito</button>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <h2 id="reviews">Reseñas</h2>
                {
                    product.reviews.length === 0 &&
                    (
                        <MessageBox>No hay Reseñas</MessageBox>
                    )
                }
                <ul>
                    {
                        product.reviews.map(review =>
                                (
                                    <li key={review._id}>
                                        <strong>{ review.name }</strong>
                                        <Rating rating={ review.rating } caption=" "></Rating>
                                        <p>{ review.createdAt.substring(0, 10) }</p>
                                        <p>{ review.comment }</p>
                                    </li>
                                )
                            )
                    }
                    <li>
                        {
                            userInfo ?
                            (
                                <form className="form" onSubmit= { submitHandler }>
                                    <div>
                                        <h2>Escribe una Reseña</h2>
                                    </div>
                                    <div>
                                        <label htmlFor="rating">Calificación</label>
                                        <select id="rating" value={ rating } onChange={ e => setRating(e.target.value) }>
                                            <option value="1">1- Muy Mala</option>
                                            <option value="2">2- Mala</option>
                                            <option value="3">3- Regular</option>
                                            <option value="4">4- Buena</option>
                                            <option value="5">5- Excelente</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="comment">Comentario</label>
                                        <textarea id="comment" value={ comment } onChange={ e => setComment(e.target.value) }></textarea>
                                    </div>
                                    <div>
                                        <label />
                                        <button className="primary" type="submit">Enviar</button>
                                    </div>
                                    <div>
                                        {
                                            loadingReviewCreate && <LoadingBox></LoadingBox>
                                        }
                                        {
                                            errorReviewCreate && 
                                            (
                                                <MessageBox variant="danger">{errorReviewCreate}</MessageBox>
                                            )
                                        }
                                    </div>
                                </form>
                            ) :
                            (
                                <MessageBox>Necesita <Link to="/signin">Acceder</Link> para escribir una reseña</MessageBox>
                            )
                        }
                    </li>
                </ul>
            </div>
        </div>
            )}
        </div>
        
    );
}