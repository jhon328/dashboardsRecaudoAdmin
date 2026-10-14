import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
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

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeaderDis from "../../components/layout/HeaderDis";

interface Movimiento {
  id?: number;
  FechaHoraMovimiento?: string;
  NombreRuta?: string;
  TelefonoTransportista?: string;
  NroFacturaAlpina?: string;
  Placa?: string;
  Planilla?: string;
  Monto?: number;
  Cedula_Usuario?: string;
  factura?: string;
  monto?: number;
}

interface DatosRecaudo {
  fecha: string;
  ruta: string;
  telefono: string;
  factura: string;
  placa: string;
  planilla: string;
  total: number;
  movimientos: Movimiento[];
}

interface Cliente {
  Nombre_Tienda: string;
  Nombres: string;
  Primer_Apellido: string;
  "2do_Apellido_opcional": string;
  Ubicacion_del_Negocio_Ciudad: string;
  Ubicacion_del_Negocio_Departamento: string;
  Direccion: string;
  Numero_Celular: string;
  nbCliente: string;
}

interface MovimientoDetalle {
  id: number;
  NroFacturaAlpina: string;
  Monto: number;
  Comercio: string;
  nombreCliente: string;
  ubicacion: string;
  telefono: string;
  nbCliente: string;
  hora: string;
  ruta: string;
  placa: string;
  planilla: string;
}

interface PagoDetalle {
  medio: string;
  monto: number;
}

const clientesDemo: Record<string, Cliente> = {
  "1001001001": {
    Nombre_Tienda: "Tienda La Esperanza",
    Nombres: "Carlos",
    Primer_Apellido: "Gómez",
    "2do_Apellido_opcional": "Pérez",
    Ubicacion_del_Negocio_Ciudad: "Cali",
    Ubicacion_del_Negocio_Departamento: "Valle del Cauca",
    Direccion: "Cra 10 # 20-30",
    Numero_Celular: "3001111111",
    nbCliente: "8100007756",
  },

  "1001001002": {
    Nombre_Tienda: "Supermercado El Sol",
    Nombres: "María",
    Primer_Apellido: "Rodríguez",
    "2do_Apellido_opcional": "López",
    Ubicacion_del_Negocio_Ciudad: "Cali",
    Ubicacion_del_Negocio_Departamento: "Valle del Cauca",
    Direccion: "Calle 15 # 30-40",
    Numero_Celular: "3012222222",
    nbCliente: "8100163222",
  },

  "1001001003": {
    Nombre_Tienda: "Tienda San José",
    Nombres: "Juan",
    Primer_Apellido: "Martínez",
    "2do_Apellido_opcional": "",
    Ubicacion_del_Negocio_Ciudad: "Palmira",
    Ubicacion_del_Negocio_Departamento: "Valle del Cauca",
    Direccion: "Carrera 5 # 10-20",
    Numero_Celular: "3023333333",
    nbCliente: "8100004211",
  },

  "1001001004": {
    Nombre_Tienda: "Mini Mercado Centro",
    Nombres: "Ana",
    Primer_Apellido: "Torres",
    "2do_Apellido_opcional": "Ramírez",
    Ubicacion_del_Negocio_Ciudad: "Cali",
    Ubicacion_del_Negocio_Departamento: "Valle del Cauca",
    Direccion: "Calle 8 # 12-15",
    Numero_Celular: "3034444444",
    nbCliente: "8100009825",
  },
};

const formatoMiles = (numero: number) => {
  return new Intl.NumberFormat("es-ES").format(
    Number(numero || 0)
  );
};

const nombreCompleto = (cliente?: Cliente) => {
  if (!cliente) {
    return "N/A";
  }

  return [
    cliente.Nombres,
    cliente.Primer_Apellido,
    cliente["2do_Apellido_opcional"],
  ]
    .filter(
      (valor) =>
        valor !== null &&
        valor !== undefined
    )
    .map((valor) => String(valor).trim())
    .filter((valor) => valor !== "")
    .join(" ") || "N/A";
};

const ubicacionCompleta = (cliente?: Cliente) => {
  if (!cliente) {
    return "N/A";
  }

  return [
    cliente.Ubicacion_del_Negocio_Ciudad,
    cliente.Ubicacion_del_Negocio_Departamento,
    cliente.Direccion,
  ]
    .filter(
      (valor) =>
        valor !== null &&
        valor !== undefined
    )
    .map((valor) => String(valor).trim())
    .filter((valor) => valor !== "")
    .join(" - ") || "N/A";
};

const formatearFecha = (fecha: string) => {
  if (!fecha) {
    return "N/A";
  }

  const [year, month, day] = fecha.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatearHora = (fechaHora?: string) => {
  if (!fechaHora) {
    return "N/A";
  }

  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) {
    return "N/A";
  }

  return fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

function DetalleRecaudo() {
  const navigate = useNavigate();

  const [busquedaFiltro, setBusquedaFiltro] = useState("");

  const [pagoSeleccionado, setPagoSeleccionado] =
    useState<MovimientoDetalle | null>(null);

  const [datosRecaudo] = useState<DatosRecaudo>(() => {
    try {
      const datosGuardados =
        localStorage.getItem("detalle_recaudo");

      if (!datosGuardados) {
        return {
          fecha: "",
          ruta: "N/A",
          telefono: "N/A",
          factura: "N/A",
          placa: "N/A",
          planilla: "N/A",
          total: 0,
          movimientos: [],
        };
      }

      const datos = JSON.parse(datosGuardados);

      return {
        fecha: datos.fecha || "",
        ruta: datos.ruta || "N/A",
        telefono: datos.telefono || "N/A",
        factura: datos.factura || "N/A",
        placa: datos.placa || "N/A",
        planilla: datos.planilla || "N/A",
        total: Number(datos.total || 0),
        movimientos: datos.movimientos || [],
      };
    } catch {
      return {
        fecha: "",
        ruta: "N/A",
        telefono: "N/A",
        factura: "N/A",
        placa: "N/A",
        planilla: "N/A",
        total: 0,
        movimientos: [],
      };
    }
  });

  const movimientosDetalle =
    useMemo<MovimientoDetalle[]>(() => {
      return datosRecaudo.movimientos.map(
        (mov, index) => {
          const cedula = String(
            mov.Cedula_Usuario || ""
          );

          const cliente = clientesDemo[cedula];

          return {
            id: mov.id ?? index,

            NroFacturaAlpina:
              mov.NroFacturaAlpina ||
              mov.factura ||
              `FAC-${1001 + index}`,

            Monto: Number(
              mov.Monto ||
              mov.monto ||
              0
            ),

            Comercio:
              cliente?.Nombre_Tienda ||
              "N/A",

            nombreCliente:
              nombreCompleto(cliente),

            ubicacion:
              ubicacionCompleta(cliente),

            telefono:
              cliente?.Numero_Celular ||
              "N/A",

            nbCliente:
              cliente?.nbCliente ||
              "N/A",

            hora:
              formatearHora(
                mov.FechaHoraMovimiento
              ),

            ruta:
              mov.NombreRuta ||
              datosRecaudo.ruta ||
              "N/A",

            placa:
              mov.Placa ||
              datosRecaudo.placa ||
              "N/A",

            planilla:
              mov.Planilla ||
              datosRecaudo.planilla ||
              "N/A",
          };
        }
      );
    }, [datosRecaudo]);

  const movimientosFiltrados =
    useMemo(() => {
      const q = busquedaFiltro
        .toLowerCase()
        .trim();

      if (!q) {
        return movimientosDetalle;
      }

      return movimientosDetalle.filter(
        (mov) =>
          mov.NroFacturaAlpina
            .toLowerCase()
            .includes(q) ||
          mov.nbCliente
            .toLowerCase()
            .includes(q) ||
          mov.nombreCliente
            .toLowerCase()
            .includes(q) ||
          mov.Comercio
            .toLowerCase()
            .includes(q) ||
          mov.ubicacion
            .toLowerCase()
            .includes(q) ||
          mov.telefono
            .toLowerCase()
            .includes(q) ||
          mov.ruta
            .toLowerCase()
            .includes(q) ||
          mov.placa
            .toLowerCase()
            .includes(q) ||
          mov.planilla
            .toLowerCase()
            .includes(q) ||
          mov.hora
            .toLowerCase()
            .includes(q)
      );
    }, [
      busquedaFiltro,
      movimientosDetalle,
    ]);


const pagosPorFactura: Record<string, PagoDetalle[]> = {
  "FAC-1001": [
    { medio: "Efectivo", monto: 50000 },
    { medio: "Pago digital", monto: 100000 },
  ],
  "FAC-1002": [
    { medio: "Microcredito", monto: 85000 },
  ],
  "FAC-1003": [
    { medio: "Pago digital", monto: 220000 },
  ],
  "FAC-1004": [
    { medio: "Pago digital", monto: 120000 },
  ],
};

const pagos: PagoDetalle[] = pagoSeleccionado
  ? pagosPorFactura[pagoSeleccionado.NroFacturaAlpina] || [
      { medio: "Pago digital", monto: pagoSeleccionado.Monto },
    ]
  : [];
  const abrirDetallePago = (
    mov: MovimientoDetalle
  ) => {
    setPagoSeleccionado(mov);
  };

  const cerrarDetallePago = () => {
    setPagoSeleccionado(null);
  };

  const regresar = () => {
    navigate(-1);
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={regresar}
              variant="text"
              sx={{
                textTransform: "none",
                color: "#3338a0",
                fontWeight: 600,
                minWidth: "auto",
                px: 0,
              }}
            >
              Regresar
            </Button>

            <Typography
              component="h1"
              sx={{
                fontSize: 24,
                fontWeight: 800,
                color: "#000",
              }}
            >
              Detalle de Recaudo
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              border: "1px solid #f1f5f9",
              borderRadius: "8px",
              mb: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(5, 1fr)",
                },
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  Fecha Recaudo
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {formatearFecha(
                    datosRecaudo.fecha
                  )}
                </Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  Ruta
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosRecaudo.ruta}
                </Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  Transportista
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosRecaudo.telefono}
                </Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  Teléfono
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosRecaudo.telefono}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  textAlign: {
                    xs: "left",
                    md: "right",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#000",
                    lineHeight: 1.2,
                  }}
                >
                  $ {formatoMiles(
                    datosRecaudo.total
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mt: 0.5,
                  }}
                >
                  Recaudo Pagos Digitales
                </Typography>
              </Box>
            </Box>
          </Paper>

          <TextField
            fullWidth
            value={busquedaFiltro}
            onChange={(event) =>
              setBusquedaFiltro(
                event.target.value
              )
            }
            placeholder="Buscar factura, cliente, comercio, ubicación o teléfono"
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      sx={{
                        color: "#6b7280",
                        fontSize: 21,
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                bgcolor: "#fff",
              },
              "& .MuiInputBase-input": {
                fontSize: 14,
              },
            }}
          />

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
                minWidth: 1200,
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "10%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Factura
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "14%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Codigo Cliente
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "16%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Cliente
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "15%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Tienda
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "19%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Ubicación
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "10%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Teléfono
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "10%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Monto
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "8%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Hora
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "8%",
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom:
                        "2px solid #e2e8f0",
                    }}
                  >
                    Pago
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {movimientosFiltrados.map(
                  (mov) => (
                    <TableRow
                      key={mov.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            "#f8fafc",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#3737a8",
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {mov.NroFacturaAlpina}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {mov.nbCliente}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "normal",
                          overflowWrap:
                            "anywhere",
                          lineHeight: 1.45,
                        }}
                      >
                        {mov.nombreCliente}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "normal",
                          overflowWrap:
                            "anywhere",
                          lineHeight: 1.45,
                        }}
                      >
                        {mov.Comercio}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "normal",
                          overflowWrap:
                            "anywhere",
                          lineHeight: 1.45,
                        }}
                      >
                        {mov.ubicacion}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {mov.telefono}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#111827",
                          fontWeight: 700,
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        $ {formatoMiles(
                          mov.Monto
                        )}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          fontSize: "13.5px",
                          color: "#374151",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {mov.hora}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "14px 16px",
                          borderBottom:
                            "1px solid #f1f5f9",
                        }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() =>
                            abrirDetallePago(
                              mov
                            )
                          }
                          sx={{
                            textTransform:
                              "none",
                            color: "#00a8e8",
                            fontSize:
                              "13.5px",
                            fontWeight: 400,
                            whiteSpace:
                              "nowrap",
                            minWidth:
                              "auto",
                            p: 0,
                            borderRadius: 0,
                            "&:hover": {
                              backgroundColor:
                                "transparent",
                              color:
                                "#0099cc",
                              textDecoration:
                                "underline",
                            },
                          }}
                        >
                          Ver pago
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {movimientosFiltrados.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{
                        padding: "30px",
                        borderBottom:
                          "none",
                        color: "#9ca3af",
                        fontSize:
                          "13.5px",
                      }}
                    >
                      No hay registros de
                      recaudo para los
                      filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Dialog
        open={Boolean(pagoSeleccionado)}
        onClose={cerrarDetallePago}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            m: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 21,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Detalle del pago
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#6b7280",
                mt: 0.5,
              }}
            >
              Factura{" "}
              {pagoSeleccionado?.NroFacturaAlpina}
            </Typography>
          </Box>

          <IconButton
            onClick={cerrarDetallePago}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            pt: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              p: 2.5,
              mb: 2.5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#6b7280",
                mb: 0.5,
              }}
            >
              Total factura
            </Typography>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              ${" "}
              {formatoMiles(
                pagoSeleccionado?.Monto || 0
              )}
            </Typography>
          </Paper>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: "#374151",
              mb: 1.5,
            }}
          >
            Medios de pago
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {pagos.map((pago) => (
              <Paper
                key={pago.medio}
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  px: 2,
                  py: 1.75,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  {pago.medio}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  $ {formatoMiles(
                    pago.monto
                  )}
                </Typography>
              </Paper>
            ))}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
          }}
        >
          <Button
            onClick={cerrarDetallePago}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              backgroundColor: "#3338a0",
              px: 3,
              "&:hover": {
                backgroundColor: "#292d86",
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DetalleRecaudo;