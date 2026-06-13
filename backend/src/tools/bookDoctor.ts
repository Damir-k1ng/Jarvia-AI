import type { BookDoctorResult, ToolMode } from '../types/index.js';

export async function bookDoctor(
  userMessage: string,
  mode: ToolMode = 'demo'
): Promise<BookDoctorResult> {
  if (mode === 'demo') {
    await new Promise(resolve => setTimeout(resolve, 500));

    const doctors = [
      { name: 'Айгуль Серикова', specialty: 'Терапевт' },
      { name: 'Ерлан Нурланов', specialty: 'Кардиолог' },
      { name: 'Гульнара Абдуллаева', specialty: 'Педиатр' },
    ];

    const clinics = [
      'Поликлиника №5',
      'Медицинский центр "Здоровье"',
      'Городская больница №1',
    ];

    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    const randomClinic = clinics[Math.floor(Math.random() * clinics.length)];
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    return {
      success: true,
      mode: 'demo',
      doctorName: randomDoctor?.name || null,
      specialty: randomDoctor?.specialty || null,
      appointmentTime: tomorrow.toISOString(),
      clinicName: randomClinic || null,
      speak: `Записал вас к ${randomDoctor?.specialty.toLowerCase()} ${randomDoctor?.name} на завтра в 10 утра в ${randomClinic}`,
      errorCode: null,
    };
  }

  try {
    throw new Error('Live mode not implemented yet');
  } catch (error) {
    return {
      success: false,
      mode: 'live',
      doctorName: null,
      specialty: null,
      appointmentTime: null,
      clinicName: null,
      speak: 'Извините, не удалось записать к врачу. Попробуйте позже.',
      errorCode: 'API_NOT_AVAILABLE',
    };
  }
}
