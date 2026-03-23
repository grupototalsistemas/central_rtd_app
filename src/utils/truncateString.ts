export function truncateString(str: string, maxLength: number = 20): string {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's already within the limit
  } else {
    // Truncate the string and add an ellipsis
    return str.slice(0, maxLength - 3) + '...';
    // Adjust maxLength by 3 to account for the '...' characters
  }
}
