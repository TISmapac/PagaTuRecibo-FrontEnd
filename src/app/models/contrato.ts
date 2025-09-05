export interface ResContrato {
    total: number;
    contratos: Contrato[];
}

export interface Contrato{
    id:                     number;
    contrato:               number;
    nombre:                 string;
    direccion:              string;
    colonia:                string;
    estatus:                string;
    tarifa:                 string;
    giro:                   string;
    adeuda:                 number;
    region:                 number;
    adeuda_reconex_total:   number;
    meses_adeudo:           number;
    fecha_suspension:       Date;
    multas:                 number;
    msg:                    String;
    flag_reconexion:        number;
    reconexion:             number;
    adeuda_padron:          number;
    fecha_vencimiento:      String;
    mes_facturado:          String;
}