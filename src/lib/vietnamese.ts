/**
 * Tiện ích chuẩn hóa tiếng Việt cho tìm kiếm không dấu và chịu lỗi gõ
 * Tuân thủ chuẩn NFD, chuyển chữ thường, bỏ dấu thanh, đ/Đ -> d/D
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .trim();
}

/**
 * Kiểm tra xem query có khớp với target không (hỗ trợ cả có dấu và không dấu)
 */
export function matchSearchQuery(target: string, query: string): boolean {
  if (!target || !query) return false;
  const normalizedTarget = removeVietnameseTones(target);
  const normalizedQuery = removeVietnameseTones(query);

  if (normalizedTarget.includes(normalizedQuery)) return true;

  // Tách từng từ khóa để kiểm tra nếu khách gõ đảo từ hoặc gõ cụm
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    return queryWords.every((word) => normalizedTarget.includes(word));
  }

  return false;
}
