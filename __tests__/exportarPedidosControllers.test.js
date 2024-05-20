const { obtenerPedidos, consultarEstadoPedido, exportarPedido ,updatePedido } = require('../services/pedidosService.js');
const { exportOrder } = require('../controllers/exportarPedidoControllers.js');
const mock = require('../config/mock.js');

jest.mock('../services/pedidosService.js');


describe('exportarPedidos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('proceso exitoso 404 No existe data para Exportar', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce(mock.responseObtenerEmpty);
   

    // Simular solicitud y respuesta
    const req =  {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Llamar a la función a probar
    await exportOrder(req, res);

    // Verificar que la función responda con el estado 404 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'No existe data para Exportar' });
  });

  it('proceso exitoso 200 proceso exitoso', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce([
      { id: 1, Folio: '49091285' },
      { id: 2, Folio: '49091286' }
    ]);
    consultarEstadoPedido
    .mockResolvedValueOnce({FolioExterno: '49091285',Etapa: 'Procesado'})
    .mockResolvedValueOnce({FolioExterno: '49091286',Etapa: 'Procesado'});
  
    // Mock de exportarPedido para devolver éxito en la exportación
    exportarPedido.mockResolvedValueOnce({ status: 200, pedido: '49091285' });
    exportarPedido.mockResolvedValueOnce({ status: 200, pedido: '49091286' });

    updatePedido.mockResolvedValueOnce({ status: 'updated' });
    updatePedido.mockResolvedValueOnce({ status: 'updated' });

   

    // Simular solicitud y respuesta
    const req =  {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),}
  

    // Llamar a la función a probar
    await exportOrder(req, res);

    // Verificar que la función responda con el estado 200 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      pedidosExportados: ['49091285', '49091286'],
      pedidosNoExportados: []
    });
  });

  it('proceso distinto a 200 entra al else arrayDataNoExportada ', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce([
      { id: 1, Folio: '49091285' },
      { id: 2, Folio: '49091286' }
    ]);
    consultarEstadoPedido
    .mockResolvedValueOnce({FolioExterno: '49091285',Etapa: 'Procesado'})
    .mockResolvedValueOnce({FolioExterno: '49091286',Etapa: 'Procesado'});
  
    // Mock de exportarPedido para devolver éxito en la exportación
    exportarPedido.mockResolvedValueOnce({ status: 400, pedido: '49091285' });
    exportarPedido.mockResolvedValueOnce({ status: 400, pedido: '49091286' });

    updatePedido.mockResolvedValueOnce({ status: 'updated' });
    updatePedido.mockResolvedValueOnce({ status: 'updated' });

   

    // Simular solicitud y respuesta
    const req =  {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),}
  

    // Llamar a la función a probar
    await exportOrder(req, res);

    // Verificar que la función responda con el estado 200 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      pedidosExportados: [],
      pedidosNoExportados: ['49091285', '49091286']
  });
  });

  it('proceso con etapa distinta a Procesado ', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce([
      { id: 1, Folio: '49091285' },
      { id: 2, Folio: '49091286' }
    ]);
    consultarEstadoPedido
      .mockResolvedValueOnce({FolioExterno: '49091285',Etapa: 'Inicio'})
      .mockResolvedValueOnce({FolioExterno: '49091286',Etapa: 'Inicio'});
  
    // Mock de exportarPedido para devolver éxito en la exportación
    exportarPedido.mockResolvedValueOnce({ status: 400, pedido: '49091285' });
    exportarPedido.mockResolvedValueOnce({ status: 400, pedido: '49091286' });

    updatePedido.mockResolvedValueOnce({ status: 'updated' });
    updatePedido.mockResolvedValueOnce({ status: 'updated' });

   

    // Simular solicitud y respuesta
    const req =  {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),}
  

    // Llamar a la función a probar
    await exportOrder(req, res);

    // Verificar que la función responda con el estado 200 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      pedidosExportados: [],
      pedidosNoExportados: ['49091285', '49091286']
    });
  });

  it('maneja errores correctamente', async () => {
    // Mock para lanzar un error al llamar a obtenerPedidos
    obtenerPedidos.mockRejectedValueOnce(new Error('Error de prueba'));

    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await exportOrder(req, res);

    // Verificar que la respuesta tenga el código y mensaje correctos
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error interno del servidor' });
});
 

});
