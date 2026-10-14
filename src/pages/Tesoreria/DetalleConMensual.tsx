import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeaderDis from "../../components/layout/HeaderDis";

interface RegistroDetalle {
  id?: number;
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
}

interface DatosDetalle {
  fecha: string;
  recaudo: number;
  codigo: string;
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
  registros: RegistroDetalle[];
}

const formatoMiles = (numero: number) => {
  return new Intl.NumberFormat("es-ES").format(
    Number(numero || 0)
  );
};

const formatearFecha = (fecha: string) => {
  if (!fecha) {
    return "N/A";
  }

  const partes = fecha.split("/");

  if (partes.length !== 3) {
    return fecha;
  }

  const [dia, mes, ano] = partes;

  const date = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia)
  );

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const datosIniciales: DatosDetalle = {
  fecha: "",
  recaudo: 0,
  codigo: "N/A",
  hora: "N/A",
  clienteId: "N/A",
  cedula: "N/A",
  nombres: "N/A",
  apellidos: "",
  comercio: "N/A",
  departamento: "N/A",
  ciudad: "N/A",
  empresa: "N/A",
  codigoProducto: "N/A",
  cantidad: 0,
  placa: "N/A",
  transportista: "N/A",
  registros: [],
};

function DetalleConMensual() {
  const navigate = useNavigate();

  const [busquedaFiltro, setBusquedaFiltro] = useState("");

  const [datosDetalle] = useState<DatosDetalle>(() => {
    try {
      const datosGuardados = localStorage.getItem(
        "detalle-conciliacion-mensual"
      );

      if (!datosGuardados) {
        return datosIniciales;
      }

      const datos = JSON.parse(datosGuardados);

      return {
        fecha: datos.fecha || "",
        recaudo: Number(datos.recaudo || 0),
        codigo: datos.codigo || "N/A",
        hora: datos.hora || "N/A",
        clienteId: datos.clienteId || "N/A",
        cedula: datos.cedula || "N/A",
        nombres: datos.nombres || "N/A",
        apellidos: datos.apellidos || "",
        comercio: datos.comercio || "N/A",
        departamento: datos.departamento || "N/A",
        ciudad: datos.ciudad || "N/A",
        empresa: datos.empresa || "N/A",
        codigoProducto: datos.codigoProducto || "N/A",
        cantidad: Number(datos.cantidad || 0),
        placa: datos.placa || "N/A",
        transportista: datos.transportista || "N/A",
        registros: Array.isArray(datos.registros)
          ? datos.registros
          : [],
      };
    } catch {
      return datosIniciales;
    }
  });

  const registrosFiltrados = useMemo(() => {
    const q = busquedaFiltro.toLowerCase().trim();

    if (!q) {
      return datosDetalle.registros;
    }

    return datosDetalle.registros.filter((registro) => {
      return (
        registro.codigo.toLowerCase().includes(q) ||
        registro.clienteId.toLowerCase().includes(q) ||
        registro.cedula.toLowerCase().includes(q) ||
        registro.nombres.toLowerCase().includes(q) ||
        registro.apellidos.toLowerCase().includes(q) ||
        registro.comercio.toLowerCase().includes(q) ||
        registro.departamento.toLowerCase().includes(q) ||
        registro.ciudad.toLowerCase().includes(q) ||
        registro.empresa.toLowerCase().includes(q) ||
        registro.codigoProducto.toLowerCase().includes(q) ||
        registro.placa.toLowerCase().includes(q) ||
        registro.transportista.toLowerCase().includes(q)
      );
    });
  }, [busquedaFiltro, datosDetalle.registros]);

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
                fontSize: {
                  xs: 22,
                  sm: 24,
                },
                fontWeight: 800,
                color: "#000",
              }}
            >
              Detalle de Conciliación Mensual
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              border: "1px solid #e5e7eb",
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
                  Fecha
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {formatearFecha(datosDetalle.fecha)}
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
                  Factura
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosDetalle.codigo}
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
                  Cliente ID
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosDetalle.clienteId}
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
                  Documento
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {datosDetalle.cedula}
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
                    fontSize: {
                      xs: 24,
                      sm: 28,
                    },
                    fontWeight: 800,
                    color: "#000",
                    lineHeight: 1.2,
                  }}
                >
                  $ {formatoMiles(datosDetalle.recaudo)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mt: 0.5,
                  }}
                >
                  Recaudo
                </Typography>
              </Box>
            </Box>
          </Paper>

          <TextField
            fullWidth
            value={busquedaFiltro}
            onChange={(event) =>
              setBusquedaFiltro(event.target.value)
            }
            placeholder="Buscar factura, cliente, documento, tienda, ubicación, distribuidor o placa"
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
              overflowY: "hidden",
              border: "1px solid #f1f5f9",
            }}
          >
            <Table
              sx={{
                width: "100%",
                minWidth: 1400,
                borderCollapse: "collapse",
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    ["Factura", "9%"],
                    ["Valor", "10%"],
                    ["Fecha Pago", "9%"],
                    ["Hora Pago", "8%"],
                    ["Cliente ID", "10%"],
                    ["Documento", "9%"],
                    ["Nombre y Apellido", "14%"],
                    ["Tienda", "12%"],
                    ["Departamento / Ciudad", "14%"],
                    ["Distribuidor", "11%"],
                    ["Planilla", "9%"],
                    ["Placa", "8%"],
                    ["Nombre Conductor", "15%"],
                  ].map(([titulo, ancho]) => (
                    <TableCell
                      key={titulo}
                      sx={{
                        width: ancho,
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "12px 16px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {titulo}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {registrosFiltrados.map((registro, index) => (
                  <TableRow
                    key={
                      registro.id ??
                      `${registro.codigo}-${index}`
                    }
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#3338a0",
                        fontWeight: 600,
                        fontSize: "13.5px",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.codigo}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "13.5px",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      $ {formatoMiles(registro.recaudo)}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.fecha}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.hora}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#374151",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.clienteId}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#374151",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.cedula}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      {[registro.nombres, registro.apellidos]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      {registro.comercio}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "normal",
                        lineHeight: 1.45,
                      }}
                    >
                      <Box>{registro.departamento}</Box>
                      <Box>{registro.ciudad}</Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      {registro.empresa}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.codigoProducto}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registro.placa}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: "13.5px",
                        color: "#4b5563",
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      {registro.transportista}
                    </TableCell>
                  </TableRow>
                ))}

                {registrosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      align="center"
                      sx={{
                        padding: "30px",
                        borderBottom: "none",
                        color: "#9ca3af",
                        fontSize: "13.5px",
                      }}
                    >
                      No hay registros para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default DetalleConMensual;