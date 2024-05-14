const sql = require('mssql');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const mock = require('../config/mock.js');
const logger = require('../config/logger.js'); // Importa el logger




/**
 * Obtenemos Pedido para setear el correlativo y tipoDocumento.
 * @param {*} idPedido 
 * @returns 
 */
async function obtenerPedidos(){
    try {
        await connectToDatabase('Telecontrol');

        const consulta = `SELECT Folio,Empresa , TipoDocumento,Entidad,Correlativo,NumeroDocumento , StatusDescripcion FROM Telecontrol.dbo.Pedidos`;
        const result = await sql.query(consulta);
        
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
        const ETAPA = 'Inicio';
        const data =  {
            folio : pedido.Folio,
            empresa : pedido.Empresa,
            tipoDocumento : pedido.TipoDocumento,
            correlativo : pedido.Correlativo

        }

        await connectToDatabase('DTEBdQMakita');

        const consulta = `SELECT FolioExterno, Empresa, TipoDocumento, Correlativo, Etapa, Entidad
        FROM DTEBdQMakita.dbo.Documento 
        WHERE FolioExterno = '${data.folio}'
        and Empresa = '${data.empresa}'
        and TipoDocumento = '${data.tipoDocumento}'
        and Correlativo =${data.correlativo}
        and Etapa= '${ETAPA}'`;
        
        const result = await sql.query(consulta);

        await closeDatabaseConnection();

        return result.recordset[0];
    
    } catch (error) {
        console.error('Error al consultar tabla documento:', error.message);
        throw error;
    }
}

/**
 * Enviamos objeto con numero de pedido a exportar
 * @param {*} pedidoExportar 
 * @returns 
 */
async function exportarPedido(pedidoExportar){
    try{
        
        let idPedido = pedidoExportar.FolioExterno;
        console.log("este es el pedido que se va a exportasr" , idPedido);
        /*const url = `https://api2.telecontrol.com.br/posvenda-pedido/pedidos/pedido/${idPedido}`;
        
        const response = await axios.put( url, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Application-Key': '3d137dea1d13220aa9a10ee57d69f6b30d247f28',
                'Access-Env': 'HOMOLOGATION',
                'X-Custom-Header': 'value'
            }
        })*/

        let response = mock.responseExportarPedido;
       
        response.numeroReal = idPedido; 
        
        return response;

    }catch (error) {
        console.error('Error al exportar pedidos:', error.message);
        throw error;
    }
}


module.exports = {
    obtenerPedidos , consultarEstadoPedido , exportarPedido
};
