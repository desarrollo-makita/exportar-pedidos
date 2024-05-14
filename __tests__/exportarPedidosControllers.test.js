const { obtenerPedidos } = require('../services/pedidosService.js');
const { getLinkDocument } = require('../controllers/getLinkDocumentControllers');
const mock = require('../config/mock.js');

jest.mock('../services/pedidosService.js');


describe('exportarPedidos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('proceso exitoso 200', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce(mock.pedidos);
    obtenerDocumento.mockResolvedValueOnce(mock.responseDocumento);

    // Simular solicitud y respuesta
    const req = { params: { idPedido: '123456' } }; // Asegúrate de pasar correctamente el idPedido aquí
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Llamar a la función a probar
    await getLinkDocument(req, res);

    // Verificar que la función responda con el estado 404 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      pedido: mock.responseDocumento.FolioExterno,
      entidad: mock.responseDocumento.Entidad,
      correlativo: mock.responseDocumento.Correlativo,
      url: mock.responseDocumento.URL
    });
  });

  it('proceso exitoso 200', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce(mock.pedidos);
    obtenerDocumento.mockResolvedValueOnce(mock.responseDocumentoNull);

    // Simular solicitud y respuesta
    const req = { params: { idPedido: '123456' } }; // Asegúrate de pasar correctamente el idPedido aquí
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Llamar a la función a probar
    await getLinkDocument(req, res);

    // Verificar que la función responda con el estado 404 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({mensaje: 'No se encontro documento para el correlativo 119343'});
  });

 

  it('no se encuentran pedidos por numero de pedido 404', async () => {
    // Mockear la respuesta de obtenerPedidos
    obtenerPedidos.mockResolvedValueOnce(mock.pedidosNotFound);

    // Simular solicitud y respuesta
    const req = { params: { idPedido: '123456' } }; // Asegúrate de pasar correctamente el idPedido aquí
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Llamar a la función a probar
    await getLinkDocument(req, res);

    // Verificar que la función responda con el estado 404 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'No se encontro el pedido 123456' });
  });


  it('maneja correctamente los errores', async () => {
    // Mockear la respuesta de obtenerPedidos para que arroje una excepción
    obtenerPedidos.mockRejectedValueOnce(new Error('Error al obtener pedidos'));

    // Simular solicitud y respuesta
    const req = { params: { idPedido: '123456' } };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Llamar a la función a probar
    await getLinkDocument(req, res);

    // Verificar que la función responda con el estado 500 y el mensaje adecuado
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error interno del servidor' });
});

});
