const sql = require('mssql');
const { obtenerPedidos, obtenerDocumento } = require('../services/pedidosService.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');

jest.mock('mssql');

describe('obtenerPedidos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    xit('debería devolver los pedidos correspondientes', async () => {
        // Mockear la conexión a la base de datos
        connectToDatabase.mockResolvedValueOnce();

        // Mockear el resultado de la consulta
        const expectedRecordset = [{ id: 1, Folio: '123456' }];
        sql.query.mockResolvedValueOnce({ recordset: expectedRecordset });

        // Llamar a la función a probar
        const result = await obtenerPedidos('123456');

        // Verificar que se realizó la conexión a la base de datos y la consulta
        expect(connectToDatabase).toHaveBeenCalledWith('Telecontrol');
        expect(sql.query).toHaveBeenCalledWith(
            `SELECT * FROM Telecontrol.dbo.Pedidos where Folio = '123456'`
        );

        // Verificar que devolvió los pedidos correspondientes
        expect(result).toEqual(expectedRecordset);
    });

  
});
