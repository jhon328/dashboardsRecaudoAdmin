import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HeaderDis from "../../components/layout/HeaderDis";

interface RegistroConciliacion {
  id: number;
  recaudo: number;
  codigo: string;
  fecha: string;
  hora: string;
  clienteId: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  comercio: string;
  departamento: string;
  ciudad: string;
  empresa: string;
  codigoProducto: string;
  cantidad: number;
  placa: string;
  transportista: string;
  ruta: string;
}

const datosDemo: RegistroConciliacion[] = [
  {
    id: 1,
    recaudo: 150000,
    codigo: "FAC-1001",
    fecha: "30/09/2026",
    hora: "08:15:00",
    clienteId: "8100007756",
    cedula: "1001001001",
    nombres: "Carlos",
    apellidos: "Gómez Pérez",
    comercio: "Tienda La Esperanza",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-001",
    cantidad: 1,
    placa: "ABC123",
    transportista: "3001234567",
    ruta: "Ruta Norte",
  },
  {
    id: 2,
    recaudo: 85000,
    codigo: "FAC-1002",
    fecha: "30/09/2026",
    hora: "09:20:00",
    clienteId: "8100163222",
    cedula: "1001001002",
    nombres: "María",
    apellidos: "Rodríguez López",
    comercio: "Supermercado El Sol",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-001",
    cantidad: 1,
    placa: "ABC123",
    transportista: "3001234567",
    ruta: "Ruta Norte",
  },
  {
    id: 3,
    recaudo: 220000,
    codigo: "FAC-1003",
    fecha: "30/09/2026",
    hora: "10:30:00",
    clienteId: "8100004211",
    cedula: "1001001003",
    nombres: "Juan",
    apellidos: "Martínez",
    comercio: "Tienda San José",
    departamento: "Valle del Cauca",
    ciudad: "Palmira",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-002",
    cantidad: 1,
    placa: "XYZ789",
    transportista: "3109876543",
    ruta: "Ruta Sur",
  },
  {
    id: 4,
    recaudo: 120000,
    codigo: "FAC-1004",
    fecha: "29/09/2026",
    hora: "11:00:00",
    clienteId: "8100009825",
    cedula: "1001001004",
    nombres: "Ana",
    apellidos: "Torres Ramírez",
    comercio: "Mini Mercado Centro",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-003",
    cantidad: 1,
    placa: "DEF456",
    transportista: "3155555555",
    ruta: "Ruta Centro",
  },
];

const formatearMiles = (numero: number) => {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(Number(numero || 0));
};

const formatearFecha = (fecha: string) => {
  if (!fecha) {
    return "";
  }

  const [dia, mes, ano] = fecha.split("/");

  return `${ano}-${mes}-${dia}`;
};

interface ResumenDiario {
  fecha: string;
  recaudo: number;
  registros: RegistroConciliacion[];
}

function ConciliacionMensual() {
  const navigate = useNavigate();

  const [mesAnoSeleccionado, setMesAnoSeleccionado] =
    useState("");

  const [distribuidorSeleccionado, setDistribuidorSeleccionado] =
    useState("");

  const filas = useMemo<ResumenDiario[]>(() => {
    if (!mesAnoSeleccionado) {
      return [];
    }

    const registrosMes = datosDemo.filter((fila) => {
      const [, mes, ano] = fila.fecha.split("/");

      return (
        `${ano}-${mes}` === mesAnoSeleccionado &&
        fila.empresa === distribuidorSeleccionado
      );
    });

    const agrupados = registrosMes.reduce<
      Record<string, ResumenDiario>
    >((acumulado, fila) => {
      if (!acumulado[fila.fecha]) {
        acumulado[fila.fecha] = {
          fecha: fila.fecha,
          recaudo: 0,
          registros: [],
        };
      }

      acumulado[fila.fecha].recaudo += fila.recaudo;
      acumulado[fila.fecha].registros.push(fila);

      return acumulado;
    }, {});

    return Object.values(agrupados).sort((a, b) => {
      const fechaA = formatearFecha(a.fecha);
      const fechaB = formatearFecha(b.fecha);

      return fechaB.localeCompare(fechaA);
    });
  }, [mesAnoSeleccionado, distribuidorSeleccionado]);

  const verDetalle = (fila: ResumenDiario) => {
    const primerRegistro = fila.registros[0];

    localStorage.setItem(
      "detalle-conciliacion-mensual",
      JSON.stringify({
        fecha: fila.fecha,
        recaudo: fila.recaudo,
        distribuidor: distribuidorSeleccionado,
        codigo: primerRegistro?.codigo || "N/A",
        hora: primerRegistro?.hora || "N/A",
        clienteId: primerRegistro?.clienteId || "N/A",
        cedula: primerRegistro?.cedula || "N/A",
        nombres: primerRegistro?.nombres || "N/A",
        apellidos: primerRegistro?.apellidos || "",
        comercio: primerRegistro?.comercio || "N/A",
        departamento: primerRegistro?.departamento || "N/A",
        ciudad: primerRegistro?.ciudad || "N/A",
        empresa: primerRegistro?.empresa || "N/A",
        codigoProducto: primerRegistro?.codigoProducto || "N/A",
        cantidad: primerRegistro?.cantidad || 0,
        placa: primerRegistro?.placa || "N/A",
        transportista: primerRegistro?.transportista || "N/A",
        ruta: primerRegistro?.ruta || "N/A",
        registros: fila.registros,
      })
    );

    navigate("/detalle-conciliacion-mensual");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <HeaderDis />

      <Box
        component="main"
        sx={{
          width: "100%",
          px: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },
          py: {
            xs: 2,
            sm: 3,
          },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#000",
              mb: 3,
            }}
          >
            Conciliación Mensual
          </Typography>

          {/* Filtros: mes y distribuidor */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              mb: 3,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Mes y Año"
              type="month"
              value={mesAnoSeleccionado}
              onChange={(event) =>
                setMesAnoSeleccionado(event.target.value)
              }
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  "aria-label": "Mes y Año",
                },
              }}
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  bgcolor: "#fff",
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  color: "#374151",
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            />

            <TextField
              select
              label="Distribuidor"
              value={distribuidorSeleccionado}
              onChange={(event) =>
                setDistribuidorSeleccionado(event.target.value)
              }
              size="small"
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  bgcolor: "#fff",
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  color: "#374151",
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="SURTIALIMENTOS">
                SURTIALIMENTOS
              </MenuItem>

              <MenuItem value="SUPER80">
                SUPER80
              </MenuItem>
            </TextField>
          </Box>

          {/* Estado inicial */}
          {!mesAnoSeleccionado && (
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                minHeight: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                border: "1px solid #f1f5f9",
                borderRadius: "8px",
                bgcolor: "#fff",
              }}
            >
              <CalendarMonthOutlinedIcon
                sx={{
                  color: "#9ca3af",
                  fontSize: 22,
                }}
              />

              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: 14,
                }}
              >
                Seleccione un mes y un año
              </Typography>
            </Paper>
          )}

          {/* Sin registros para el filtro */}
          {mesAnoSeleccionado && filas.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #f1f5f9",
                borderRadius: "8px",
                bgcolor: "#fff",
              }}
            >
              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: 14,
                  textAlign: "center",
                  px: 2,
                }}
              >
                No hay datos para el distribuidor y mes seleccionados.
              </Typography>
            </Paper>
          )}

          {/* Tabla de conciliación */}
          {mesAnoSeleccionado && filas.length > 0 && (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: "8px",
                overflowX: "auto",
                border: "1px solid #f1f5f9",
              }}
            >
              <Table
                sx={{
                  width: "100%",
                  minWidth: 700,
                  borderCollapse: "collapse",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "35%",
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "12px 16px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Fecha
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "35%",
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "12px 16px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Recaudo
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "30%",
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "12px 16px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filas.map((fila) => (
                    <TableRow
                      key={fila.fecha}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <TextField
                          type="date"
                          value={formatearFecha(fila.fecha)}
                          disabled
                          size="small"
                          slotProps={{
                            htmlInput: {
                              "aria-label": `Fecha ${fila.fecha}`,
                            },
                          }}
                          sx={{
                            width: 170,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "6px",
                              bgcolor: "#f8fafc",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: 13.5,
                              color: "#374151",
                              py: 1,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#111827",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        $ {formatearMiles(fila.recaudo)}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={() => verDetalle(fila)}
                          sx={{
                            minWidth: "auto",
                            padding: 0,
                            color: "#00a8e8",
                            fontSize: "13.5px",
                            fontWeight: 400,
                            textTransform: "none",
                            borderRadius: 0,
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "#0099cc",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ConciliacionMensual;