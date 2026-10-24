export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readingTimeMinutes: number;
  coverImage: string;
  tags: string[];
  tableOfContents: { id: string; text: string }[];
  content: {
    heading?: string;
    paragraph: string;
    subHeading?: string;
  }[];
  shopTheLookProductIds: string[]; // Các sản phẩm gắn thẻ trong bài viết
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'nghe-thuat-phoi-do-quiet-luxury-thanh-lich',
    title: 'Nghệ Thuật Phối Đồ Quiet Luxury — Đỉnh Cao Của Sự Thanh Lịch Đương Đại',
    subtitle: 'Vì sao giới mộ điệu ngày càng ưa chuộng vẻ đẹp tối giản không logo và tôn vinh phom dáng may đo?',
    excerpt: 'Quiet Luxury không đơn thuần là một trào lưu thời trang nhất thời, mà là triết lý sống tôn vinh chất liệu thượng hạng, đường cắt rập hoàn mỹ và sự tinh tế thầm lặng.',
    author: {
      name: 'Elena Vũ',
      role: 'Creative Director & Stylist tại TADA! Atelier',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    publishedAt: '2026-03-15T08:00:00Z',
    readingTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    tags: ['Quiet Luxury', 'Phong cách sống', 'May đo Bespoke', 'Bảo tồn giá trị'],
    tableOfContents: [
      { id: 'triet-ly', text: '1. Triết lý Quiet Luxury: Sự xa xỉ thầm lặng' },
      { id: 'chat-lieu', text: '2. Chất liệu là linh hồn của bộ trang phục' },
      { id: 'cong-thuc', text: '3. Công thức phối đồ ton-sur-ton bất hủ' },
      { id: 'shop-the-look', text: '4. Shop The Look: Gợi ý trang phục Atelier' }
    ],
    content: [
      {
        heading: '1. Triết lý Quiet Luxury: Sự xa xỉ thầm lặng',
        paragraph:
          'Giữa thời đại mà các biểu tượng logo rực rỡ và những bảng màu neon dần trở nên bão hòa, Quiet Luxury nổi lên như một tuyên ngôn đĩnh đạc của gu thẩm mỹ sâu sắc. Không phô trương tên tuổi thương hiệu, giá trị của một thiết kế Quiet Luxury đến từ độ êm ái khi chạm tay vào thớ vải, từ đường ve áo nằm phẳng phiu theo tỷ lệ xương quai xanh, và từ cảm giác tự tin tuyệt đối khi người mặc bước vào bất kỳ không gian sang trọng nào.'
      },
      {
        heading: '2. Chất liệu là linh hồn của bộ trang phục',
        paragraph:
          'Để tạo nên sự thanh lịch không gượng ép, chất liệu đóng vai trò quyết định 80% thành công. Tại xưởng may của TADA!, chúng tôi ưu tiên tuyệt đối những dòng sợi tự nhiên: lụa tơ tằm Bảo Lộc dệt chéo êm mượt, len lông cừu Merino mềm mại và dạ Cashmere nguyên bản dệt hai mặt. Những chất liệu này có khả năng "thở", giữ ấm êm dịu trong mùa đông nhưng vẫn mát lành vào những ngày giao mùa.'
      },
      {
        heading: '3. Công thức phối đồ ton-sur-ton bất hủ',
        paragraph:
          'Một trong những bí quyết phối đồ dễ ứng dụng nhất của các quý cô Paris là bảng màu đơn sắc hoặc tương đồng (monochrome). Bạn có thể kết hợp áo sơ mi lụa tơ tằm màu kem vani cùng blazer màu lạc đà (camel) và quần âu ống suông màu ngà. Sự phân tầng sắc thái nhẹ nhàng tạo nên chiều sâu thị giác đầy quyến rũ mà không cần bất kỳ họa tiết cầu kỳ nào.'
      }
    ],
    shopTheLookProductIds: ['p-1', 'p-2', 'p-3']
  },
  {
    slug: 'huong-dan-bao-quan-lua-to-tam-va-cashmere',
    title: 'Cẩm Nang Bảo Quản Lụa Tơ Tằm & Dạ Cashmere Luôn Mới Sau Nhiều Năm',
    subtitle: 'Bí quyết giặt là, bảo dưỡng và bảo quản chất liệu tự nhiên cao cấp theo chuẩn Boutique quốc tế.',
    excerpt: 'Những bộ trang phục xa xỉ xứng đáng được nâng niu bằng quy trình chăm sóc chuyên biệt để sợi vải luôn giữ được độ bóng sáng và phom dáng nguyên bản.',
    author: {
      name: 'Minh Tuấn',
      role: 'Master Tailor tại TADA! Fashion Atelier',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    publishedAt: '2026-03-20T09:30:00Z',
    readingTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80',
    tags: ['Chăm sóc trang phục', 'Lụa tơ tằm', 'Cashmere', 'Mẹo Atelier'],
    tableOfContents: [
      { id: 'nguyen-tac-giat', text: '1. Quy tắc vàng khi giặt chất liệu lụa' },
      { id: 'bao-quan-cashmere', text: '2. Cách bảo quản len Cashmere không bị xù lông' },
      { id: 'treo-do', text: '3. Lựa chọn móc treo và túi bọc chuyên dụng' }
    ],
    content: [
      {
        heading: '1. Quy tắc vàng khi giặt chất liệu lụa',
        paragraph:
          'Lụa tơ tằm là một loại sợi protein tự nhiên nhạy cảm với nhiệt độ và hóa chất tẩy rửa mạnh. Hãy luôn giặt tay bằng nước lạnh với dầu gội đầu dịu nhẹ hoặc nước giặt chuyên dụng cho lụa. Tuyệt đối không vắt xoắn; thay vào đó, hãy cuộn áo trong một chiếc khăn bông khô ráo để thấm hút bớt nước trước khi phơi ở nơi thoáng gió, tránh ánh nắng trực tiếp.'
      },
      {
        heading: '2. Cách bảo quản len Cashmere không bị xù lông',
        paragraph:
          'Áo len cashmere không nên giặt quá thường xuyên. Sau mỗi lần mặc, bạn chỉ cần treo áo ở nơi thoáng khí trong vài giờ để bay mùi tự nhiên. Khi cất tủ dài ngày, hãy gập gọn gàng và đặt trong túi vải cotton thoáng khí cùng túi gỗ tuyết tùng (cedar blocks) để xua đuổi côn trùng mà không để lại mùi hóa chất khó chịu.'
      },
      {
        heading: '3. Lựa chọn móc treo và túi bọc chuyên dụng',
        paragraph:
          'Những chiếc áo blazer cấu trúc hay đầm dạ hội cần được giữ trên móc gỗ có độ dày đệm vai phù hợp để tránh làm biến dạng ve áo và đường ráp nách. Tránh xa các loại túi bọc bằng nilon kín gió vì chúng giữ ẩm và dễ sinh ẩm mốc cho sợi vải tự nhiên.'
      }
    ],
    shopTheLookProductIds: ['p-4', 'p-5']
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
