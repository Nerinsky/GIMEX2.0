import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) =>
        {
            const orders = await Order.find({}).populate('user', 'name');
            res.send(orders);
        }
    )
);

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => 
{
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}))

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) =>
    {
        if(req.body.orderItems.length === 0)
        {
            res.status(400).send({ message: 'El carrito esta vacio' });
        }
        else
        {
            const order = new Order(
                {
                    orderItems: req.body.orderItems,
                    shippingAddress: req.body.shippingAddress,
                    paymentMethod: req.body.paymentMethod,
                    itemsPrice: req.body.itemsPrice,
                    shippingPrice: req.body.shippingPrice,
                    ivaPrice: req.body.ivaPrice,
                    totalPrice: req.body.totalPrice,
                    user: req.user._id,
                }
            );
            const createdOrder = await order.save();
            res.status(201).send({ message: 'Nuevo Pedido Creado', order: createdOrder });
        }
    })
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => 
    {
        const order = await Order.findById(req.params.id);
        if(order)
        {
            res.send(order);
        }
        else
        {
            res.status(404).send({ message: 'Orden no Encontrada' });
        }
    })
);

orderRouter.put('/id:/pay', isAuth, expressAsyncHandler(async (req, res) => 
    {
        const order = await Order.findById(req.params.id);
        if(order)
        {
            order.isPaid = true;
            order.paisAt = Date.now();
            order.paymentResult = { id: req.body.id, status: req.body.status, update_time: req.body.update_time, email_addres: req.body.email_addres};
            const updateOrder = await order.save();
            res.send({ message: 'Pedido Pagado', order: updateOrder });
        }
        else
        {
            res.status(404).send({ message: 'Order No Encontrada' });
        }
    })
);

orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) =>
    {
        const order = await Order.findById(req.params.id);
        if(order)
        {
            const deleteOrder = await order.remove();
            res.send({ message: 'Pedido Borrado', order: deleteOrder });
        }
        else
        {
            res.status(404).send({ message: 'Pedio No Encontrado' });
        }
    })
);

orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async (req, res) =>
    {
        const order = await Order.findById(req.params.id);
        if(order)
        {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.send({ message: 'Pedido Entregado', order: updatedOrder });
        }
        else
        {
            res.status(404).send({ message: 'Pedido no Enocntrado' })
        }
    })
);

export default orderRouter;