const { obtenerPedidos, consultarEstadoPedido, exportarPedido , updatePedido} = require('../services/pedidosService.js');
const mock = require('../config/mock.js');
const logger = require('../config/logger.js');


async function exportOrder(req, res) {
    try {
        logger.info('Inicio de la función exportOrder [exportarPedidoControllers]');
        let arrayDataExportada = [];
        let arrayDataNoExportada = [];
        const response = await obtenerPedidos();      

        if (response.length > 0) {
            for (const pedido of response) {
                try {
                    const responseEstadoPedido = await consultarEstadoPedido(pedido);
                    logger.debug(`responseEstadoPedido : ${JSON.stringify(responseEstadoPedido)}`);

                    if (responseEstadoPedido && (responseEstadoPedido.Etapa === "Procesado NV Interna" || responseEstadoPedido.Etapa === "Procesado")) {
                        logger.info(`Pedido a exportar ${JSON.stringify(responseEstadoPedido.FolioExterno)} `);

                        const exportarRes = await exportarPedido(responseEstadoPedido);
                        logger.info(`exportarRes : ${JSON.stringify(exportarRes)}`);

                        if (exportarRes.status === 200) {
                            arrayDataExportada.push(exportarRes.pedido);
                            logger.info(`Lista de pedidos exportados con éxito: ${JSON.stringify(arrayDataExportada)}`);

                            const updatepedido = await updatePedido(exportarRes.pedido);
                            logger.info(`UPDATE ${JSON.stringify(updatepedido)} `);
                        } else {
                            arrayDataNoExportada.push(exportarRes.pedido);
                            logger.info(`Lista de pedidos NO exportados: ${JSON.stringify(arrayDataNoExportada)}`);
                        }
                    } else {
                        logger.info(`El pedido ${JSON.stringify(responseEstadoPedido.FolioExterno)} se encuentra en etapa ${JSON.stringify(responseEstadoPedido.Etapa)} `);
                        arrayDataNoExportada.push(responseEstadoPedido.FolioExterno);
                    }
                } catch (error) {
                    // Capturar errores individuales en cada iteración del pedido
                    logger.error(`Error procesando pedido ${pedido.FolioExterno}: ${error}`);
                    arrayDataNoExportada.push(pedido.FolioExterno); // Puedes manejar estos pedidos como no exportados
                }
            }

            res.status(200).json({
                pedidosExportados: arrayDataExportada,
                pedidosNoExportados: arrayDataNoExportada
            });

        } else {
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
