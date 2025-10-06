import express from 'express';

export function setupKalplaRoutes(app: express.Application) {
  // Kalpla program info
  app.get('/api/kalpla', (req, res) => {
    res.json({
      name: 'Kalpla Startup Mentorship Program',
      description: 'Transform your startup idea into reality with our comprehensive 12-month mentorship program.',
      features: [
        'Expert mentorship from industry leaders',
        'Structured 12-month curriculum',
        'Live interactive sessions',
        'Real-world project assignments',
        'Networking opportunities',
        'Certification upon completion'
      ],
      pricing: {
        amount: 49999,
        currency: 'INR',
        discount: '50% off original price'
      }
    });
  });
}
