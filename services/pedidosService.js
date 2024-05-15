const sql = require('mssql');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const mock = require('../config/mock.js');
const logger = require('../config/logger.js'); // Importa el logger
const axios = require('axios');




/**
 * Obtenemos Pedido para setear el correlativo y tipoDocumento.
 * @param {*} idPedido 
 * @returns 
 */
async function obtenerPedidos(){
    try {
        logger.info('Inicio de la función obtenerPedidos [pedidosService]');
        await connectToDatabase('Telecontrol');

        const consulta = `SELECT Folio,Empresa , TipoDocumento,Entidad,Correlativo,NumeroDocumento , StatusDescripcion FROM Telecontrol.dbo.Pedidos`;
        const result = await sql.query(consulta);
        logger.debug(`result ${JSON.stringify(result)}`);
        await closeDatabaseConnection();
        
        return result.recordset;
    } catch (error) {
        logger.error('Error al obtener pedidos', { error:  error.message });
        throw error;
    }
}

/**
 * Consultamos estado del pedido dentro del workFlow y taremos pedidos con etapa en estado Inicio
 * @param {*} pedido 
 * @returns 
 */
async function consultarEstadoPedido(pedido){
    try {
        logger.info(`Inicio de la función consultarEstadoPedido [pedidosService] : ${JSON.stringify(pedido)}`);
       
        const data =  {
            folio : pedido.Folio,
            empresa : pedido.Empresa,
            tipoDocumento : pedido.TipoDocumento,
            correlativo : pedido.Correlativo

        }

        logger.debug(`request : ${JSON.stringify(data)}`);
        await connectToDatabase('DTEBdQMakita');

        const consulta = `SELECT FolioExterno, Empresa, TipoDocumento, Correlativo, Etapa, Entidad
        FROM DTEBdQMakita.dbo.Documento 
        WHERE FolioExterno = '${data.folio}'
        and Empresa = '${data.empresa}'
        and TipoDocumento = '${data.tipoDocumento}'
        and Correlativo =${data.correlativo}`;
        
        logger.debug(` consulta  : ${consulta}`);
        
        
        const result = await sql.query(consulta);
        
        logger.debug(`result : ${JSON.stringify(result)}`);
        
        await closeDatabaseConnection();

        return result.recordset[0];
    
    } catch (error) {
        logger.error(`Error consultaPedido : ${JSON.stringify(error.message)}`);
        throw error;
    }
}

/**
 * Enviamos objeto con numero de pedido a exportar
 * @param {*} pedidoExportar 
 * @returns 
 */
async function exportarPedido(pedidoExportar){
    let idPedido = pedidoExportar.FolioExterno;
    try{
       
        logger.info(`Iniciamos funcion exportarPedido : ${idPedido}`);
        const url = `https://api2.telecontrol.com.br/posvenda-pedido/pedidos/pedido/${idPedido}`;

        const headers = {
            'Content-Type': 'application/json',
            'Access-Application-Key': '3d137dea1d13220aa9a10ee57d69f6b30d247f28',
            'Access-Env': 'HOMOLOGATION',
        };
        
        logger.info(`Url  ${url} `);
        
        const response = await axios.put(url, {}, { headers });
        
        logger.debug(`Respuesta de la API exportar pedido ${JSON.stringify(response.status)}`);
        response.data.status = response.status;
       
        return response.data;

    }catch (error) {
        if (error.response && error.response.status != 200) {
            // Realiza acciones específicas para el código de estado 404
            console.log("La solicitud no se encontró en el servidor #################", error.response.data , idPedido);
            return {error : error.response.data , pedido : idPedido , status:  error.response.status  };
           
        }
       
    }
}


module.exports = {
    obtenerPedidos , consultarEstadoPedido , exportarPedido
};
