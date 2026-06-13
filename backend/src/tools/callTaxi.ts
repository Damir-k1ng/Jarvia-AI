import type { CallTaxiResult, ToolMode } from '../types/index.js';

export async function callTaxi(
  userMessage: string,
  mode: ToolMode = 'demo'
): Promise<CallTaxiResult> {
  if (mode === 'demo') {
    await new Promise(resolve => setTimeout(resolve, 500));

    const drivers = [
      { name: 'Ерлан', car: 'Toyota Camry', plate: 'А 777 БВ' },
      { name: 'Асхат', car: 'Hyundai Sonata', plate: 'В 555 КС' },
      { name: 'Нурлан', car: 'Kia Optima', plate: 'С 888 АА' },
    ];

    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const eta = Math.floor(Math.random() * 8) + 3;
    const price = Math.floor(Math.random() * 1000) + 800;

    return {
      success: true,
      mode: 'demo',
      driverName: randomDriver?.name || null,
      carModel: randomDriver?.car || null,
      plateNumber: randomDriver?.plate || null,
      etaMinutes: eta,
      priceEstimate: price,
      currency: 'KZT',
      speak: `Такси вызвано. Водитель ${randomDriver?.name} на ${randomDriver?.car} приедет через ${eta} минут. Номер машины ${randomDriver?.plate}. Стоимость примерно ${price} тенге.`,
      errorCode: null,
    };
  }

  try {
    throw new Error('Live mode not implemented yet');
  } catch (error) {
    return {
      success: false,
      mode: 'live',
      driverName: null,
      carModel: null,
      plateNumber: null,
      etaMinutes: null,
      priceEstimate: null,
      currency: 'KZT',
      speak: 'Извините, не удалось вызвать такси. Попробуйте позже.',
      errorCode: 'API_NOT_AVAILABLE',
    };
  }
}
