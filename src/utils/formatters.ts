/**
 * Indian Rupee (INR) Formatter
 * Strict requirement: Use Indian Rupees (₹), NEVER use dollar ($).
 */
export function formatINR(amount: number, includeDecimals: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  
  if (includeDecimals) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateString;
  }
}
