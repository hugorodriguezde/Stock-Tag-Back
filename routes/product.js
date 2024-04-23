const router = require('express').Router();
const productController = require('../controllers/product.controller');
const validateToken = require('./validate-token');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', validateToken, productController.editProduct);
router.delete('/:id', validateToken, productController.deleteProduct);
router.post('/:userId/products', validateToken, productController.addProductToUser);
router.get('/', validateToken, productController.getProductHistory);

module.exports = router;