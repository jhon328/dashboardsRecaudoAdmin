import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import SearchIcon from "@mui/icons-material/Search";
import HeaderDis from "../../components/layout/HeaderDis";

interface Movimiento {
  FechaHoraMovimiento: string;
  NombreRuta: string;
  TelefonoTransportista: string;
  NroFacturaAlpina: string;
  Placa: string;
  Planilla: string;
  Monto: number;
  Cedula_Usuario: string;
  TipoRecaudo: "DIGITAL" | "EFECTIVO" | "MICROCREDITO";
}

interface MovimientoAgrupado {
  ruta: string;
  telefono: string;
  facturas: Set<string>;
  placas: Set<string>;
  planillas: Set<string>;
  movimientos: Movimiento[];
  totalRecaudado: number;
  totalDigital: number;
  totalEfectivo: number;
  facturaTexto: string;
  placaTexto: string;
  planillaTexto: string;
  totalMicrocredito: number;
}

function RecaudoDiario() {
  const navigate = useNavigate();

  const [movimientosEnlace, setMovimientosEnlace] =
    useState<Movimiento[]>([]);

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState(new Date().toISOString().substring(0, 10));

  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [rutaSeleccionada, setRutaSeleccionada] = useState("");

  const formatoMiles = (numero: number) => {
    return new Intl.NumberFormat("es-CO", {
      maximumFractionDigits: 0,
    }).format(Number(numero || 0));
  };

  const fechaFormateada = useMemo(() => {
    if (!fechaSeleccionada) return "";

    const [year, month, day] = fechaSeleccionada.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [fechaSeleccionada]);

  const movimientosDelDia = useMemo(() => {
    return movimientosEnlace.filter((mov) => {
      const fechaMov = mov.FechaHoraMovimiento?.substring(0, 10);
      return fechaMov === fechaSeleccionada;
    });
  }, [movimientosEnlace, fechaSeleccionada]);

  const rutasDisponibles = useMemo(() => {
    const rutas = movimientosDelDia
      .map((mov) => mov.NombreRuta)
      .filter(Boolean);

    return [...new Set(rutas)].sort();
  }, [movimientosDelDia]);

  const listaAgrupada = useMemo(() => {
    const mapa = new Map<string, MovimientoAgrupado>();

    movimientosDelDia.forEach((mov) => {
      const key = `${mov.NombreRuta}_${mov.TelefonoTransportista}`;
      
      if (!mapa.has(key)) {
        mapa.set(key, {
          ruta: mov.NombreRuta || "N/A",
          telefono: mov.TelefonoTransportista || "N/A",
          facturas: new Set<string>(),
          placas: new Set<string>(),
          planillas: new Set<string>(),
          movimientos: [],
          totalRecaudado: 0,
          totalDigital: 0,
          totalEfectivo: 0,
          facturaTexto: "",
          placaTexto: "",
          planillaTexto: "",
          totalMicrocredito: 0,
        });
      }

      const item = mapa.get(key)!;
      const monto = Number(mov.Monto || 0);

      item.movimientos.push(mov);
      item.totalRecaudado += monto;

      if (mov.NroFacturaAlpina) {
        item.facturas.add(mov.NroFacturaAlpina);
      }

      if (mov.Placa) {
        item.placas.add(mov.Placa);
      }

      if (mov.Planilla) {
        item.planillas.add(mov.Planilla);
      }

      if (mov.TipoRecaudo === "DIGITAL") {
        item.totalDigital += monto;
      }

      if (mov.TipoRecaudo === "EFECTIVO") {
        item.totalEfectivo += monto;
      }

      if (mov.TipoRecaudo === "MICROCREDITO") {
          item.totalMicrocredito += monto;
      }

    });

    let resultado = Array.from(mapa.values()).map((item) => ({
      ...item,
      facturaTexto:
        Array.from(item.facturas).join(", ") || "N/A",
      placaTexto:
        Array.from(item.placas).join(", ") || "N/A",
      planillaTexto:
        Array.from(item.planillas).join(", ") || "N/A",
    }));

    if (rutaSeleccionada) {
      resultado = resultado.filter(
        (item) => item.ruta === rutaSeleccionada
      );
    }

    const q = busquedaFiltro.toLowerCase().trim();

    if (q) {
      resultado = resultado.filter(
        (item) =>
          item.ruta.toLowerCase().includes(q) ||
          item.telefono.toString().includes(q) ||
          item.placaTexto.toLowerCase().includes(q) ||
          item.planillaTexto.toLowerCase().includes(q)
      );
    }

    return resultado;
  }, [
    movimientosDelDia,
    rutaSeleccionada,
    busquedaFiltro,
  ]);

  const totalRecaudo = useMemo(() => {
    return movimientosDelDia
      .filter(
        (mov) =>
          !rutaSeleccionada ||
          mov.NombreRuta === rutaSeleccionada
      )
      .reduce((acc, mov) => acc + Number(mov.Monto || 0), 0);
  }, [movimientosDelDia, rutaSeleccionada]);

  const totalRecaudoDigital = useMemo(() => {
    return movimientosDelDia
      .filter(
        (mov) =>
          (!rutaSeleccionada ||
            mov.NombreRuta === rutaSeleccionada) &&
          mov.TipoRecaudo === "DIGITAL"
      )
      .reduce((acc, mov) => acc + Number(mov.Monto || 0), 0);
  }, [movimientosDelDia, rutaSeleccionada]);

  const totalRecaudoEfectivo = useMemo(() => {
    return movimientosDelDia
      .filter(
        (mov) =>
          (!rutaSeleccionada ||
            mov.NombreRuta === rutaSeleccionada) &&
          mov.TipoRecaudo === "EFECTIVO"
      )
      .reduce((acc, mov) => acc + Number(mov.Monto || 0), 0);
  }, [movimientosDelDia, rutaSeleccionada]);

  useEffect(() => {
    // Datos de ejemplo.
    // Reemplázalos por los datos reales de tu backend.

    setMovimientosEnlace([
      {
        FechaHoraMovimiento: "2026-09-30T08:15:00",
        NombreRuta: "Ruta Norte",
        TelefonoTransportista: "3001234567",
        NroFacturaAlpina: "FAC-1001",
        Placa: "ABC123",
        Planilla: "PL-001",
        Monto: 150000,
        Cedula_Usuario: "1001001001",
        TipoRecaudo: "DIGITAL",
      },
      {
        FechaHoraMovimiento: "2026-09-30T09:20:00",
        NombreRuta: "Ruta Norte",
        TelefonoTransportista: "3001234567",
        NroFacturaAlpina: "FAC-1002",
        Placa: "ABC123",
        Planilla: "PL-001",
        Monto: 85000,
        Cedula_Usuario: "1001001002",
        TipoRecaudo: "EFECTIVO",
      },
      {
        FechaHoraMovimiento: "2026-09-30T10:30:00",
        NombreRuta: "Ruta Sur",
        TelefonoTransportista: "3109876543",
        NroFacturaAlpina: "FAC-1003",
        Placa: "XYZ789",
        Planilla: "PL-002",
        Monto: 220000,
        Cedula_Usuario: "1001001003",
        TipoRecaudo: "DIGITAL",
      },
      {
        FechaHoraMovimiento: "2026-09-29T11:00:00",
        NombreRuta: "Ruta Centro",
        TelefonoTransportista: "3155555555",
        NroFacturaAlpina: "FAC-1004",
        Placa: "DEF456",
        Planilla: "PL-003",
        Monto: 120000,
        Cedula_Usuario: "1001001004",
        TipoRecaudo: "EFECTIVO",
      },
    ]);
  }, []);

  const verDetalle = (item: MovimientoAgrupado) => {
    localStorage.setItem(
      "detalle_recaudo",
      JSON.stringify({
        fecha: fechaSeleccionada,
        ruta: item.ruta,
        telefono: item.telefono,
        factura: item.facturaTexto,
        placa: item.placaTexto,
        planilla: item.planillaTexto,
        total: item.totalRecaudado,
        totalDigital: item.totalDigital,
        totalEfectivo: item.totalEfectivo,
        movimientos: item.movimientos,
      })
    );

    navigate("/recaudo/detalle");
  };

  const cambiarRuta = (event: SelectChangeEvent) => {
    setRutaSeleccionada(event.target.value);
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
          px: { xs: 1.5, sm: 2, md: 2.5 },
          py: { xs: 2, sm: 3 },
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
          <Typography
            component="h1"
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#000",
              mb: 3,
            }}
          >
            Recaudo Diario
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
              mb: 3,
              width: "100%",
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <TextField
                label="Fecha"
                type="date"
                value={fechaSeleccionada}
                onChange={(event) =>
                  setFechaSeleccionada(event.target.value)
                }
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    "aria-label": "Fecha de recaudo",
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

              <FormControl size="small" sx={{ width: 220 }}>
                <InputLabel>Ruta</InputLabel>

                <Select
                  value={rutaSeleccionada}
                  label="Ruta"
                  onChange={cambiarRuta}
                  sx={{
                    borderRadius: "6px",
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  <MenuItem value="">Todas las rutas</MenuItem>

                  {rutasDisponibles.map((ruta) => (
                    <MenuItem key={ruta} value={ruta}>
                      {ruta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                textAlign: "right",
                pr: { xs: 1, sm: 2, md: 3 },
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
                $ {formatoMiles(totalRecaudo)}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6b7280",
                  mt: 0.5,
                }}
              >
                Total Recaudado Día
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0284c7",
                  mt: 1,
                }}
              >
                Digital: $ {formatoMiles(totalRecaudoDigital)}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#15803d",
                  mt: 0.5,
                }}
              >
                Efectivo: $ {formatoMiles(totalRecaudoEfectivo)}
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            value={busquedaFiltro}
            onChange={(event) =>
              setBusquedaFiltro(event.target.value)
            }
            placeholder="Buscar por ruta, transportista, teléfono, placa o planilla"
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
                minWidth: 1250,
                borderCollapse: "collapse",
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "Ruta",
                    "Planilla",
                    "Teléfono",
                    "Placa",
                    "Total Recaudado",
                    "Total Recaudo Digital",
                    "Total Recaudo Efectivo",
                    "Acciones",
                  ].map((columna) => (
                    <TableCell
                      key={columna}
                      sx={{
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "12px 16px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {columna}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {listaAgrupada.map((item, index) => (
                  <TableRow
                    key={`${item.ruta}-${item.telefono}-${index}`}
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
                      {item.ruta}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13.5px",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.planillaTexto}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13.5px",
                        color: "#111827",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.telefono}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13.5px",
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.placaTexto}
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
                      $ {formatoMiles(item.totalRecaudado)}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13.5px",
                        color: "#0284c7",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      $ {formatoMiles(item.totalDigital)}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13.5px",
                        color: "#15803d",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      $ {formatoMiles(item.totalEfectivo)}
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <Button
                        onClick={() => verDetalle(item)}
                        variant="text"
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
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {listaAgrupada.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        padding: "30px",
                        borderBottom: "none",
                        color: "#9ca3af",
                        fontSize: "13.5px",
                      }}
                    >
                      No hay registros de recaudo para los
                      filtros seleccionados.
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

export default RecaudoDiario;