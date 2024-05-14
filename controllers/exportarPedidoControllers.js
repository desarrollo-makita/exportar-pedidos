const { obtenerPedidos, consultarEstadoPedido, exportarPedido} = require('../services/pedidosService.js');
const mock = require('../config/mock.js');
const logger = require('../config/logger.js'); // Importa el logger


async function exportOrder(req, res) {
    try {
        
        let dataExportar = [];
        let exportarPedidoRes;
        const response = await obtenerPedidos();      
        
        if(response.length > 0 ){
            for(pedido of response){
                
                const responseExportar  = await consultarEstadoPedido(pedido);
                exportarPedidoRes = await exportarPedido(responseExportar);
            }

            console.log("arreglo para mandar a exportar" , exportarPedidoRes);
            
            res.status(200).json({mensaje : `Se exporto el pedido : ${exportarPedidoRes.pedido} con Exito `});  
        }else{
            res.status(404).json({ mensaje: 'No existe data para Exportar' });
        }
        

       
       
    } catch (error) {
        console.error('Error al obtener los documentos [exportarPedidoControllers]:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}


module.exports = {
    exportOrder
};
