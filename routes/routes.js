const express = require('express');
const router = express.Router();
const { exportOrder } = require('../controllers/exportarPedidoControllers');

router.get('/exportar-pedido', exportOrder);

module.exports = router;
