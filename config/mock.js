module.exports = {

    responseObtenerPedidos: [
        {
            Folio: 49090833,
            Empresa: 'Makita',
            TipoDocumento: 'NOTA DE VTA INTERNA',
            Entidad: '76279534-5',
            Correlativo: 119376,
            NumeroDocumento: 1010101,
            StatusDescripcion: 'Aguardando Exportação'
        },
        {
            Folio: 49090834,
            Empresa: 'Makita',
            TipoDocumento: 'NOTA DE VENTA',
            Entidad: '76279534-5',
            Correlativo: 623295,
            NumeroDocumento: 1010102,
            StatusDescripcion: 'Aguardando Exportação'
        },
        {
            Folio: 49091046,
            Empresa: 'Makita',
            TipoDocumento: 'NOTA DE VTA INTERNA',
            Entidad: '76279534-5',
            Correlativo: 119377,
            NumeroDocumento: 123,
            StatusDescripcion: 'Aguardando Exportação'
        }
    ],
    
    responseExportarPedido :{
        data:{
            "pedido": 49090833,
            "exportado": {
                "date": "2024-05-13 15:25:31.915844",
                "timezone_type": 3,
                "timezone": "America/Sao_Paulo-ejemplo"
            },
       

        },
        status:200
        
    },
    
   
    responseBadRequest :{
        "exception": "Exception",
        "message": "Pedido jÃ¡ exportado"
    }
};