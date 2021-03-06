import bcrypt from 'bcryptjs';
const data = 
{
    users: 
    [
        {
            name:'Neri',
            email:'neri@msn.com',
            password: bcrypt.hashSync('12345', 8),
            isAdmin: true,
        },
        {
            name:'Juan',
            email:'juan@msn.com',
            password: bcrypt.hashSync('12345', 8),
            isAdmin: false,
        },
    ],
    products: 
    [
        {
            name: 'Compu 1',
            category: 'Computacion',
            image: '/images/Pluma.jpg',
            price: 120,
            countInStock: 75,
            brand: 'HP',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
        },
        {
            name: 'Compu 2',
            category: 'Computacion',
            image: '/images/pro1.jpg',
            price: 100,
            countInStock: 0,
            brand: 'Azus',
            rating: 4.0,
            numReviews: 10,
            description: 'high quality product',
        },
        {
            name: 'Compu 3',
            category: 'Computacion',
            image: '/images/pro1.jpg',
            price: 220,
            countInStock: 4,
            brand: 'Gateway',
            rating: 4.8,
            numReviews: 17,
            description: 'high quality product',
        },
        {
            name: 'Compu 4',
            category: 'Computacion',
            image: '/images/pro1.jpg',
            price: 78,
            countInStock: 3,
            brand: 'HP',
            rating: 4.5,
            numReviews: 14,
            description: 'high quality product',
        },
        {
            name: 'Compu 5',
            category: 'Computacion',
            image: '/images/pro1.jpg',
            price: 65,
            countInStock: 0,
            brand: 'Lenovo',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
        },
        {
            name: 'Compu 6',
            category: 'Computacion',
            image: '/images/pro1.jpg',
            price: 139,
            countInStock: 1,
            brand: 'Mac',
            rating: 4.5,
            numReviews: 15,
            description: 'high quality product',
        },
    ],
};
export default data;