import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js'
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res) =>
{
    const name = req.query.name || '';
    const category = req.query.category || '';
    const seller = req.query.seller || '';
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};

    const products = await Product.find({...sellerFilter, ...nameFilter, ...categoryFilter,}).populate('seller', 'seller.name seller.logo');
    res.send(products);
})
);

productRouter.get('/categories', expressAsyncHandler(async (req,res) => 
        {
            const categories = await Product.find().distinct('category');
            res.send(categories);
        }
    )
)

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

productRouter.post('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req,res) => 
    {
        const product = new Product
        (
            {
                name:'Ingrese Producto' + Date.now(),
                seller: req.user._id,
                image: '/images/pro1.jpg',
                price: 0,
                category: 'Ingrese Categoría',
                brand: 'Ingrese Marca',
                countInStock: 0,
                rating: 0,
                numReviews: 0,
                description: 'Ingrese Descripción'
            }
        );
        const createdProduct = await product.save();
        res.send({ message: 'Producto Creado', product: createdProduct });
    })
);

productRouter.put('/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) =>
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

productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async (req, res) =>
        {
            const productId = req.params.id;
            const product = await Product.findById(productId);
            if(product)
            {
                if(product.reviews.find(x => x.name === req.user.name))
                {
                    return res.status(400).send({ message: 'Ya envío una reseña' });
                }
                const review = { name: req.user.name, rating: Number(req.body.rating), comment: req.body.comment };
                product.reviews.push(review);
                product.numReviews = product.reviews.length;
                product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
                const updatedProduct = await product.save();
                res.status(201).send({ message: 'Reseña Creada', review: updatedProduct.reviews[updatedProduct.reviews.length - 1] });
            }
            else
            {
                res.status(404).send({ message: 'Producto No Encontrado' });
            }
        }
    )
);
export default productRouter;