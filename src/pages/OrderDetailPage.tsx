import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  Navbar,
  EmptyState,
  GlobalButton,
  GlobalTypography,
  StatusChip,
} from '@/components/common';
import { ordersApi } from '@/api/ordersApi';
import { useOrderStore } from '@/stores';
import type { Order } from '@/types/order';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cachedOrder = useOrderStore((state) => state.selectedOrder);
  const setStoreOrder = useOrderStore((state) => state.setSelectedOrder);

  const isMatch = Boolean(cachedOrder && cachedOrder.id === id);
  const [order, setOrder] = useState<Order | null>(() => (isMatch ? cachedOrder : null));
  const [isLoading, setIsLoading] = useState<boolean>(() => !isMatch);
  const [error, setError] = useState<string | null>(null);

  const missingIdError = !id ? 'Identificador de pedido no proporcionado.' : null;
  const displayError = error || missingIdError;

  const loadData = useCallback(async (orderId: string, signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrderById(orderId, signal);
      if (!signal?.aborted) {
        if (!data) {
          setError('No se encontró el pedido solicitado.');
        } else {
          setOrder(data);
          setStoreOrder(data);
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!signal?.aborted) {
        setError('Ocurrió un error al cargar el detalle del pedido. Verifica tu conexión o intenta nuevamente.');
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [setStoreOrder]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    ordersApi
      .getOrderById(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          if (!data) {
            setError('No se encontró el pedido solicitado.');
          } else {
            setOrder(data);
            setStoreOrder(data);
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setError('Ocurrió un error al cargar el detalle del pedido. Verifica tu conexión o intenta nuevamente.');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id, setStoreOrder]);

  const handleBack = useCallback(() => {
    navigate('/pedidos');
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    if (id) {
      loadData(id);
    }
  }, [id, loadData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const formattedDates = useMemo(() => {
    if (!order) return { created: 'N/A', updated: 'N/A' };
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return {
      created: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('es-MX', options)
        : 'N/A',
      updated: order.updatedAt
        ? new Date(order.updatedAt).toLocaleDateString('es-MX', options)
        : 'Sin modificaciones',
    };
  }, [order]);

  const financialSummary = useMemo(() => {
    if (!order) return { unitPrice: 0, quantity: 1, total: 0 };
    const unitPrice = Number(order.precio ?? 0);
    const quantity = Number(order.cantidad ?? 1);
    const total = Number(order.total ?? (unitPrice * quantity));
    return { unitPrice, quantity, total };
  }, [order]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pb: { xs: 6, sm: 8 } }}>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 2.5, sm: 3.5, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: { xs: 2.5, md: 3 },
          }}
        >
          <GlobalButton
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: '#475569',
              alignSelf: { xs: 'flex-start', sm: 'center' },
              '&:hover': { color: '#0F172A', backgroundColor: '#F1F5F9' },
            }}
          >
            Volver a pedidos
          </GlobalButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <GlobalButton
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              loading={isLoading}
              sx={{ height: 38 }}
            >
              Recargar
            </GlobalButton>

            {order && (
              <GlobalButton
                variant="outlined"
                size="small"
                startIcon={<PrintOutlinedIcon />}
                onClick={handlePrint}
                sx={{
                  height: 38,
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F1F5F9' },
                }}
              >
                Imprimir Comprobante
              </GlobalButton>
            )}
          </Box>
        </Box>

        {/* Estado de carga */}
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
              </Grid>
            </Grid>
          </Box>
        ) : displayError || !order ? (
          <EmptyState
            title={displayError || 'No se encontró el pedido'}
            description="El identificador de pedido solicitado no existe o fue eliminado."
            actionLabel="Ir al listado de pedidos"
            onAction={handleBack}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                p: { xs: 2.5, sm: 3 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                    <GlobalTypography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: '#0F172A',
                        fontSize: { xs: '1.35rem', sm: '1.65rem' },
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Pedido {order.codigoProducto}
                    </GlobalTypography>
                    <StatusChip status={order.statusPedido} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B' }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
                    <GlobalTypography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      Registrado el {formattedDates.created}
                    </GlobalTypography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    textAlign: { xs: 'left', sm: 'right' },
                    backgroundColor: '#F8FAFC',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #E2E8F0',
                    minWidth: 160,
                  }}
                >
                  <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', fontWeight: 600 }}>
                    TOTAL DEL PEDIDO
                  </GlobalTypography>
                  <GlobalTypography
                    variant="h5"
                    sx={{ fontWeight: 800, color: '#E10098', letterSpacing: '-0.01em' }}
                  >
                    ${financialSummary.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </GlobalTypography>
                </Box>
              </Box>
            </Card>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Inventory2OutlinedIcon sx={{ color: '#E10098', fontSize: 24 }} />
                      <GlobalTypography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.125rem' }}>
                        Detalle del Producto
                      </GlobalTypography>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        p: 2,
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2,
                        border: '1px solid #E2E8F0',
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Box>
                        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                          Código de Referencia
                        </GlobalTypography>
                        <GlobalTypography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {order.codigoProducto}
                        </GlobalTypography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                          <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            Cantidad
                          </GlobalTypography>
                          <Chip
                            label={`${financialSummary.quantity} unidad${financialSummary.quantity > 1 ? 'es' : ''}`}
                            size="small"
                            sx={{ fontWeight: 600, backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1' }}
                          />
                        </Box>

                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            Precio Unitario
                          </GlobalTypography>
                          <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                            ${financialSummary.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </GlobalTypography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Resumen Financiero */}
                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed #E2E8F0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                        <GlobalTypography variant="body2" sx={{ color: '#64748B' }}>
                          Subtotal ({financialSummary.quantity} item{financialSummary.quantity > 1 ? 's' : ''}):
                        </GlobalTypography>
                        <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                          ${financialSummary.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </GlobalTypography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                        <GlobalTypography variant="body2" sx={{ color: '#64748B' }}>
                          Costo de envío:
                        </GlobalTypography>
                        <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                          Gratis
                        </GlobalTypography>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                        <GlobalTypography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          Total Pagado:
                        </GlobalTypography>
                        <GlobalTypography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          ${financialSummary.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </GlobalTypography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Columna Derecha: Cliente y Entrega */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Tarjeta de Cliente */}
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <PersonOutlinedIcon sx={{ color: '#0284C7', fontSize: 22 }} />
                        <GlobalTypography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          Información del Cliente
                        </GlobalTypography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            Nombre completo
                          </GlobalTypography>
                          <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                            {order.nombreCliente || 'Cliente no asignado'}
                          </GlobalTypography>
                        </Box>

                        {order.clienteId && (
                          <Box sx={{ mt: 1 }}>
                            <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                              ID Cliente
                            </GlobalTypography>
                            <GlobalTypography variant="caption" sx={{ fontFamily: 'monospace', color: '#475569' }}>
                              {order.clienteId}
                            </GlobalTypography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Tarjeta de Entrega y Envío */}
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <LocalShippingOutlinedIcon sx={{ color: '#E10098', fontSize: 22 }} />
                        <GlobalTypography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          Logística y Envío
                        </GlobalTypography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                            ID Entrega
                          </GlobalTypography>
                          <Chip
                            label={order.entregaId}
                            size="small"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              backgroundColor: '#F1F5F9',
                              color: '#334155',
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationOnOutlinedIcon sx={{ color: '#64748B', fontSize: 20, mt: 0.2 }} />
                          <Box>
                            <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                              Dirección de entrega
                            </GlobalTypography>
                            <GlobalTypography variant="body2" sx={{ color: '#334155', lineHeight: 1.4 }}>
                              {order.direccionEnvio || 'Dirección de envío no especificada'}
                            </GlobalTypography>
                          </Box>
                        </Box>

                        {order.statusEntrega && (
                          <Box>
                            <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                              Estatus de Entrega
                            </GlobalTypography>
                            <Chip
                              label={order.statusEntrega}
                              size="small"
                              sx={{
                                mt: 0.5,
                                backgroundColor: '#EFF6FF',
                                color: '#1D4ED8',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrderDetailPage;
