'use client';

import { Chart, registerables } from 'chart.js';

if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

export {};
