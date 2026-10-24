/**
 * Xử lý chống tấn công CSV Injection (Formula Injection / CWE-1236)
 * Nếu ô dữ liệu bắt đầu bằng một trong các ký tự nguy hiểm (=, +, -, @, \t, \r)
 * thì bắt buộc thêm dấu nháy đơn (') ở đầu để ngăn Excel / Sheets tự ý thực thi mã.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Chống CSV Injection
  const firstChar = str.charAt(0);
  if (['=', '+', '-', '@', '\t', '\r'].includes(firstChar)) {
    str = `'${str}`;
  }

  // Escape dấu ngoặc kép đôi
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}
