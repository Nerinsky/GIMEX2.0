import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js'
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res) =>
{
    const products = await Product.find({});
    res.send(products);
})
);

productRouter.get('/seed', expressAsyncHandler(async(req, res) =>
{
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
})
);

productRouter.get('/:id', expressAsyncHandler(async (req, res) =>
{
    const product = await Product.findById(req.params.id);
    if(product)
    {
        res.send(product);
    }
    else
    {
        res.status(404).send({message:'Producto no Encontrado'});
    }
})
);

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req,res) => 
    {
        const product = new Product
        (
            {
                name:'Duvalin' + Date.now(),
                image: '/images/pro1.jpg',
                price: 20,
                category: 'Dulce',
                brand: 'De la Rosa',
                countInStock: 2,
                rating: 0,
                numReviews: 0,
                description: 'sample description'
            }
        );
        const createdProduct = await product.save();
        res.send({ message: 'Producto Creado', product: createdProduct });
    })
);

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) =>
    {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(product)
        {
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            
            const updateProduct = await product.save();
            res.send({ message: 'Producto Actualizado', product:updateProduct });
        }
        else
        {
            res.status(404).send({ message: 'Producto No Encontrado' });
        }
    })
);

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) =>
        {
            const product = await Product.findById(req.params.id);
            if(product)
            {
                const deleteProduct = await product.remove();
                res.send({ message: 'Producto Eliminado', product: deleteProduct });
            }
            else
            {
                res.status(404).send({ message: 'Producto No Encontrado' });
            }
        }
    )
);
export default productRouter;