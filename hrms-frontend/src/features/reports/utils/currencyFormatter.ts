/**
 * Currency and Number Formatting Utility for Reports & BI
 * Supports configured currencies (RM, USD, SGD, EUR, GBP)
 * Formats high numbers cleanly (e.g. RM 18.15M, RM 850K, RM 25,430)
 * Avoids unnecessary float precision (e.g. 18,148,517.507)
 */

export interface FormattedCurrency {
  formatted: string;
  exact: string;
  currency: string;
}

export const formatCurrencyValue = (
  amount: number | string | undefined | null,
  currency: string = 'RM'
): FormattedCurrency => {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  const exact = `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const abs = Math.abs(num);
  let formatted = '';

  if (abs >= 1_000_000) {
    const val = (num / 1_000_000).toFixed(2);
    formatted = `${currency} ${val.replace(/\.00$/, '')}M`;
  } else if (abs >= 1_000) {
    const val = (num / 1_000).toFixed(1);
    formatted = `${currency} ${val.replace(/\.0$/, '')}K`;
  } else {
    formatted = `${currency} ${Math.round(num).toLocaleString('en-US')}`;
  }

  return { formatted, exact, currency };
};

export const formatCompactNumber = (val: number | string | undefined | null): string => {
  const num = typeof val === 'number' ? val : Number(val) || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};
