/**
 * Format a number as Indian Rupees (INR)
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  options: { 
    displaySymbol?: boolean, 
    compact?: boolean 
  } = {}
): string => {
  const { 
    displaySymbol = true, 
    compact = false 
  } = options;

  // Define formatter with Indian locale and INR currency
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    // Remove symbol as we'll add it manually for better control
    currencyDisplay: 'code',
    // Use compact notation for large numbers if compact is true
    notation: compact ? 'compact' : 'standard',
    // Ensure compact notation is still human-readable
    compactDisplay: 'short',
    // Minimum number of fraction digits
    minimumFractionDigits: 0,
    // Maximum number of fraction digits
    maximumFractionDigits: 0,
  });

  // Format the amount and remove the "INR" code that the formatter adds
  const formattedAmount = formatter.format(amount).replace('INR', '').trim();
  
  // Return with or without the ₹ symbol based on the displaySymbol option
  return displaySymbol ? `₹${formattedAmount}` : formattedAmount;
};