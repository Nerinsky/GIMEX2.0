import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) =>
        {
            const seller = req.query.seller || '';
            const sellerFilter = seller ? { seller } : {};

            const orders = await Order.find({...sellerFilter}).populate('user', 'name');
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
                    seller: req.body.orderItems[0].seller,
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
        const order = await Order.findById(req.params.id).populate('user', 'email name');
        if(order)
        {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { id: req.body.id, status: req.body.status, update_time: req.body.update_time, email_addres: req.body.email_addres};
            const updatedOrder = await order.save();
            mailgun().messages().send(
                {
                    from: 'GINEIT <neri@msn.com>',
                    to: `${order.user.name} <${order.user.email}>`,
                    subject: `Nuevo Pedido ${order._id}`,
                    html: payOrderEmailTemplate(order),
                },
                (error, body) =>
                {
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        console.log(body);
                    }
                }
            );
            res.send({ message: 'Pedido Pagado', order: updatedOrder });
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