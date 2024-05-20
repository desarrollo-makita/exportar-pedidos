const { obtenerPedidos , consultarEstadoPedido , exportarPedido, updatePedido } = require('../services/pedidosService.js');
const database = require('../config/database.js');
const sql = require('mssql');
const mock = require('../config/mock.js');
const axios = require('axios');

jest.mock('mssql');


describe('obtenerPedidos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debe devolver los pedidos cuando la consulta es exitosa', async () => {
        // Configuramos el mock de sql.query para devolver directamente el objeto pedidosServices
        sql.query.mockResolvedValueOnce(mock.pedidosServices);
        
        // Burlamos connectToDatabase y closeDatabaseConnection
        jest.spyOn(database, 'connectToDatabase').mockImplementationOnce(() => Promise.resolve());
        jest.spyOn(database, 'closeDatabaseConnection').mockImplementationOnce(() => Promise.resolve()); // <-- Aquí se realiza la burla
        
        // Llamamos a la función que queremos probar
        const pedidos = await obtenerPedidos();
    
        // Verificamos que la función devuelve los datos esperados
        expect(pedidos).toEqual(mock.pedidosServices.recordset);
    
        // Verificamos que se realizó la consulta SQL con una cadena de consulta
        expect(sql.query).toHaveBeenCalledWith(expect.any(String));
    
    });

    it('debe devolver el estado del pedido cuando la consulta es exitosa', async () => {
        const pedido = {
            Folio: 49091286,
            Empresa: 'Makita',
            TipoDocumento: 'NOTA DE VTA INTERNA',
            Correlativo: 120498
        };

        const mockResult = {"recordset":[{"FolioExterno":49091286,"Empresa":"Makita","TipoDocumento":"NOTA DE VTA INTERNA","Correlativo":120498,"Etapa":"Inicio","Entidad":"76279534-5"}]}

        sql.query.mockResolvedValueOnce(mockResult);
         // Burlamos connectToDatabase y closeDatabaseConnection
         jest.spyOn(database, 'connectToDatabase').mockImplementationOnce(() => Promise.resolve());
         jest.spyOn(database, 'closeDatabaseConnection').mockImplementationOnce(() => Promise.resolve()); // <-- Aquí se realiza la burla

        const result = await consultarEstadoPedido(pedido);

        expect(result).toEqual(mockResult.recordset[0]);

         // Verificamos que se realizó la consulta SQL con una cadena de consulta
         expect(sql.query).toHaveBeenCalledWith(expect.any(String));
       
      
    });

    it('debería exportar un pedido correctamente', async () => {
        // Mock para axios
        const axiosResponse = { status: 200, data: { message: 'Pedido exportado correctamente' } };
        jest.spyOn(axios, 'put').mockResolvedValue(axiosResponse);

        // Pedido de ejemplo
        const pedidoExportar = { FolioExterno: '123456' };

        // Llama a la función exportarPedido
        const result = await exportarPedido(pedidoExportar);

        // Verifica que la llamada a axios.put se hizo con los parámetros correctos
        expect(axios.put).toHaveBeenCalledWith(
            'https://api2.telecontrol.com.br/posvenda-pedido/pedidos/pedido/123456',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Application-Key': '3d137dea1d13220aa9a10ee57d69f6b30d247f28',
                    'Access-Env': 'HOMOLOGATION'
                }
            }
        );

        // Verifica que la función devuelve los datos esperados
        expect(result).toEqual({ message: 'Pedido exportado correctamente', status: 200 });

        // Restaura axios.put para su comportamiento original
        axios.put.mockRestore();
    });

    it('updatePedido', async () => {
        const pedido = 49091286;

        const mockResult = { rowsAffected: 1 }

        sql.query.mockResolvedValueOnce(mockResult);
         // Burlamos connectToDatabase y closeDatabaseConnection
         jest.spyOn(database, 'connectToDatabase').mockImplementationOnce(() => Promise.resolve());
         jest.spyOn(database, 'closeDatabaseConnection').mockImplementationOnce(() => Promise.resolve()); // <-- Aquí se realiza la burla

        const result = await updatePedido(pedido);

        expect(result).toEqual({ rowsAffected: 1 });
       
      
    });

  

});
