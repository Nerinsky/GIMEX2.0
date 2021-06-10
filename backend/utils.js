import jwt from "jsonwebtoken";
import mg from 'mailgun-js';
export const generateToken = (user) =>
{
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
        }, process.env.JWT_SECRET || 'cosassecretas', 
        {
            expiresIn: '30d'
        });
};

export const isAuth = (req, res, next) =>
{
    const authorization = req.headers.authorization;
    if(authorization)
    {
        const token = authorization.slice(7, authorization.length); //abcdef token
        jwt.verify(token, process.env.JWT_SECRET || 'cosassecretas', (err, decode) =>
        {
            if(err)
            {
                res.status(401).send({ message: 'Token Invalido' });
            }
            else
            {
                req.user = decode;
                next();
            }
        })
    }
    else
    {
        res.status(401).send({ message: 'No Token' });
    }
}

export const isAdmin = (req, res, next) =>
{
    if(req.user && req.user.isAdmin)
    {
        next();
    }
    else
    {
        res.status(401).send({ message: 'Token de Administrador Invalido' });
    }
}

export const isSeller = (req, res, next) =>
{
    if(req.user && req.user.isSeller)
    {
        next();
    }
    else
    {
        res.status(401).send({ message: 'TOken de Vendedor Invalido' });
    }
} 

export const isSellerOrAdmin = (req, res, next) =>
{
    if(req.user && (req.user.isSeller || req.user.isAdmin))
    {
        next();
    }
    else
    {
        res.status(401).send({ message: 'Token de Administrador o Vendedor Invalido' })
    }
};

export const mailgun = () =>
mg
(
    {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
);

export const payOrderEmailTemplate = order =>
{
    return `<h1>Gracias por comprar en GINEIT</h1>
    <p> Hola ${order.user.name},</p>
    <p>Hemos terminado de procesar su pedido.</p>
    <h2>[Pedido ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>Producto</strong></td>
    <td><strong>Cantidad</strong></td>
    <td><strong align="right">Precio</strong></td>
    </thead>
    <tbody>
    ${order.orderItems.map(item => ` 
            <tr>
            <td>${item.name}</td>
            <td align="center">${item.can}</td>
            <td align="right">$${item.price.toFixed(2)}</td>
            </tr>
    `
        ).join('\n')
    }
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Precio de Artículos:</td>
    <td align="right">$${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">IVA:</td>
    <td align="right">$${order.ivaPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Costo de Envío:</td>
    <td align="right">$${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Precio Total:</td>
    <td align="right">$${order.totalprice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Metodo de Pago:</td>
    <td align="right">$${order.paymentMethod}</td>
    </tr>
    </table>
    <h2>Dirección de Envío</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.state},<br/>
    ${order.shippingAddress.postal}<br/>
    </p>
    <hr/>
    <p>
    Gracias por su Compra.
    </p>
    `;
};