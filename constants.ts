import { University } from './types';

export const UNIVERSITIES: University[] = [
  {
    id: 'uol',
    name: 'University of London',
    degrees: [
      {
        id: 'bsc-cs',
        name: 'BSc Computer Science',
        fees: {
          currency: '£',
          initialPayment: 1200,
          monthlyInstallment: 450,
          numberOfInstallments: 36,
        },
      },
      {
        id: 'bsc-ba',
        name: 'BSc Business Admin',
        fees: {
          currency: '£',
          initialPayment: 1000,
          monthlyInstallment: 400,
          numberOfInstallments: 36,
        },
      },
      {
        id: 'mba-gl',
        name: 'Global MBA',
        fees: {
          currency: '£',
          initialPayment: 2500,
          monthlyInstallment: 800,
          numberOfInstallments: 24,
        },
      },
    ],
  },
  {
    id: 'us-state',
    name: 'State University of New York',
    degrees: [
      {
        id: 'bs-psych',
        name: 'BS Psychology',
        fees: {
          currency: '$',
          initialPayment: 1500,
          monthlyInstallment: 650,
          numberOfInstallments: 48,
        },
      },
      {
        id: 'mba-us',
        name: 'MBA (Executive)',
        fees: {
          currency: '$',
          initialPayment: 3000,
          monthlyInstallment: 950,
          numberOfInstallments: 18,
        },
      },
    ],
  },
  {
    id: 'eu-biz',
    name: 'European Business School',
    degrees: [
      {
        id: 'mim',
        name: 'Masters in Management',
        fees: {
          currency: '€',
          initialPayment: 2000,
          monthlyInstallment: 550,
          numberOfInstallments: 12,
        },
      },
      {
        id: 'dba',
        name: 'Doctor of Business Admin',
        fees: {
          currency: '€',
          initialPayment: 4000,
          monthlyInstallment: 1200,
          numberOfInstallments: 36,
        },
      },
    ],
  },
];