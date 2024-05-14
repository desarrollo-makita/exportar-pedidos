const { obtenerPedidos, consultarEstadoPedido, exportarPedido} = require('../services/pedidosService.js');
const mock = require('../config/mock.js');
const logger = require('../config/logger.js');


async function exportOrder(req, res) {
    try {
        logger.info('Inicio de la función exportOrder [exportarPedidoControllers]');
        let dataExportar = [];
        let exportarPedidoRes;
        const response = await obtenerPedidos();      
        
        if(response.length > 0 ){
            for(pedido of response){
              
                // const responseExportar  = await consultarEstadoPedido(pedido);
                
                const responseExportar = {"FolioExterno":"100100100","Empresa":"Makita","TipoDocumento":"NOTA DE VENTA","Correlativo":630935,"Etapa":"Procesado NV Interna","Entidad":"76279534-5"}
                logger.debug(`responseExportar : ${JSON.stringify(responseExportar)}`);
                if (responseExportar.Etapa === "Procesado NV Interna" || responseExportar.Etapa === "Procesado") {
                    
                    logger.info(`Pedido a exportar ${responseExportar.FolioExterno} `);
                    
                    const exportarRes  = await exportarPedido(responseExportar);
                    dataExportar.push(exportarRes.pedido);
                    
                    logger.info(`exportarRes :  ${exportarRes}` );
                
                }else{
                    logger.info(`El pedido ${responseExportar.FolioExterno} Se encuentra en etapa ${responseExportar.Etapa} `);
                }
            }
            
            res.status(200).json({mensaje : `Se exportaron los pedidos con Exito `});
            logger.info(`Se exportaron los pedidos con Exito los siguientes pedidos ${dataExportar} `);  
        }else{
            logger.info('No existe data para Exportar');
            res.status(404).json({ mensaje: 'No existe data para Exportar' });
        }
    } catch (error) {
        logger.error(`Error al obtener los documentos [exportarPedidoControllers]: ${error}`);
      
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}


module.exports = {
    exportOrder
};
