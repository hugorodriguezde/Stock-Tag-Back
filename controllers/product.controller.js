const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const ProductHistory = require('../models/ProductHistory');

exports.createProduct = async (req, res) => {
    try{
        let product;

        const token = req.header('Authorization').split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;
      
        product = new Product({
            ...req.body,
            userId: userId, 
        });

        await product.save();

        const productHistory = new ProductHistory({
            productId: product._id,
            productName: product.name,
            action: 'created'
        });

        await productHistory.save();

        res.send(product);
    }
    catch(error){
        console.log(error);
        res.status(500).send(`Error: ${error.message}`);
    }
}

exports.getProducts = async (req, res) => {
    try {
       
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;
    
        const products = await Product.find({ userId: userId });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
};

exports.editProduct = async (req, res) => {
    try{
        const {name, category, quantity} = req.body;
        let product = await Product.findById(req.params.id);

        // Check if product exists and belongs to the user
        if (!product || product.userId.toString() !== req.user._id.toString()){
            return res.status(404).json({msg: 'Product doesn´t exist'});
        }

        // Update the product
        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ product });
    }
    catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.getProduct = async (req, res) => {
    try{
        let product = await Product.findById(req.params.id);

        if (!product){
            res.status(404).json({msg: 'Product doesn´t exist'});
        }

        res.json(product);
    }
    catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.deleteProduct = async (req, res) => {
    try{
        let product = await Product.findById(req.params.id);

        if (!product){
            res.status(404).json({msg: 'Product doesn´t exist'});
        }

        await Product.findOneAndDelete({_id: req.params.id});

        const productHistory = new ProductHistory({
            productId: req.params.id,
            productName: product.name,
            action: 'removed'
        });

        await productHistory.save();

        res.json({msg: 'Product deleted succesfully'})
    }
    catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.addProductToUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        const product = new Product(req.body);
        await product.save();

        user.products.push(product);
        await user.save();

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }

};
exports.getProductHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await ProductHistory.find({ userId: userId }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
};