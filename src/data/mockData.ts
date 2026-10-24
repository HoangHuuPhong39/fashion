import { Product, Brand, Category, Order, CampaignBanner } from '@/types';

export const BRANDS: Brand[] = [
  {
    "id": "gia-studios",
    "name": "Gia Studios",
    "slug": "gia-studios",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2018,
    "story": "Thương hiệu thời trang đương đại Việt Nam được sáng lập bởi NTK Lâm Gia Khang. Lấy cảm hứng từ nét đẹp tối giản, phom dáng thanh thoát và nghệ thuật thủ công tinh xảo, Gia Studios mang vẻ đẹp phụ nữ hiện đại vươn tầm quốc tế.",
    "aesthetic": "Minimalist Contemporary Elegance",
    "logo": "https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "subtle-studios",
    "name": "Subtle Studios",
    "slug": "subtle-studios",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2015,
    "story": "Khởi nguồn từ Hà Nội, Subtle Studios tôn vinh sự mộc mạc của chất liệu tự nhiên như lụa tơ tằm, linen và cotton dệt tay. Thiết kế tôn sùng vẻ đẹp tĩnh tại và sự tự do của cơ thể phụ nữ Á Đông.",
    "aesthetic": "Artisanal Serenity & Relaxed Tailoring",
    "logo": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "duc-studio",
    "name": "Duc Studio",
    "slug": "duc-studio",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2020,
    "story": "Đại diện cho tiếng nói phá cách, dí dỏm nhưng không kém phần sắc sảo của thế hệ thiết kế trẻ Sài Gòn. Cấu trúc deconstructive độc bản với những đường rã rập bất đối xứng đầy nghệ thuật.",
    "aesthetic": "Avant-Garde Architectural Playfulness",
    "logo": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "nosbyn",
    "name": "Nosbyn Studio",
    "slug": "nosbyn",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2013,
    "story": "Định nghĩa phong cách thời trang công sở và dạo phố chuẩn mực với đường cắt dứt khoát, gam màu trung tính nhã nhặn và chất vải bền vững theo năm tháng.",
    "aesthetic": "Smart Timeless Chic",
    "logo": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "routine",
    "name": "Routine",
    "slug": "routine",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2013,
    "story": "Thương hiệu thời trang nam nữ phong cách hiện đại, dẫn đầu về các dòng sản phẩm Smart-Casual cao cấp, tôn vinh phom dáng và sự thoải mái tối ưu của vóc dáng Việt.",
    "aesthetic": "Modern Daily Essentials & Smart Casual",
    "logo": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "dottie",
    "name": "Dottie",
    "slug": "dottie",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2013,
    "story": "Thương hiệu thời trang nữ tiên phong của giới trẻ Việt Nam, cân bằng hoàn hảo giữa nét nữ tính thanh lịch và cá tính năng động, tự tin tỏa sáng.",
    "aesthetic": "Chic Feminine & Trendsetting",
    "logo": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "lseoul",
    "name": "LSEOUL",
    "slug": "lseoul",
    "isLocalBrand": true,
    "country": "Việt Nam",
    "foundedYear": 2017,
    "story": "Tự hào là thương hiệu Local Brand Việt Nam vươn tầm châu Á được nhiều thần tượng Kpop và ngôi sao quốc tế lựa chọn, nổi bật với phong cách quyến rũ, sắc sảo và hiện đại.",
    "aesthetic": "Glamourous Pop Chic & Avant-Garde",
    "logo": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "lemaire",
    "name": "Lemaire",
    "slug": "lemaire",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 1991,
    "story": "Đỉnh cao của phong cách Parisian Quiet Luxury dưới sự dẫn dắt của Christophe Lemaire & Sarah-Linh Tran. Tủ quần áo mô-đun tinh xảo được chế tác từ chất liệu xa xỉ nhất nước Pháp và Ý.",
    "aesthetic": "Parisian Quiet Luxury",
    "logo": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "ader-error",
    "name": "ADER Error",
    "slug": "ader-error",
    "isLocalBrand": false,
    "country": "Hàn Quốc",
    "foundedYear": 2014,
    "story": "Biểu tượng thời trang đường phố đương đại Seoul với triết lý \"But near missed things\", tập trung vào những chi tiết bất quy tắc và sự phối màu tài tình.",
    "aesthetic": "Seoul Street Modernism",
    "logo": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "zara",
    "name": "Zara",
    "slug": "zara",
    "isLocalBrand": false,
    "country": "Tây Ban Nha",
    "foundedYear": 1975,
    "story": "Thương hiệu thời trang quốc tế hàng đầu thế giới với tốc độ cập nhật xu hướng nhanh nhất trên sàn runway quốc tế, mang đến các thiết kế sang trọng với tính ứng dụng cao.",
    "aesthetic": "Contemporary Runway Trends",
    "logo": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "uniqlo",
    "name": "Uniqlo",
    "slug": "uniqlo",
    "isLocalBrand": false,
    "country": "Nhật Bản",
    "foundedYear": 1984,
    "story": "Triết lý LifeWear trứ danh từ Nhật Bản: trang phục đơn giản, chất lượng hoàn hảo, bền vững theo thời gian và mang lại sự êm ái tuyệt đối cho người mặc.",
    "aesthetic": "Japanese Pure LifeWear",
    "logo": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "mango",
    "name": "Mango",
    "slug": "mango",
    "isLocalBrand": false,
    "country": "Tây Ban Nha",
    "foundedYear": 1984,
    "story": "Mang phong vị Địa Trung Hải ấm áp, lãng mạn và tinh tế. Bộ sưu tập của Mango hướng đến sự thanh lịch hiện đại cho những phụ nữ và quý ông thành thị.",
    "aesthetic": "Mediterranean Elegance",
    "logo": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "cos",
    "name": "COS",
    "slug": "cos",
    "isLocalBrand": false,
    "country": "Thụy Điển",
    "foundedYear": 2007,
    "story": "Nổi tiếng với những phom dáng hình học tối giản, tôn vinh cấu trúc kiến trúc và vật liệu tái chế bền vững. Mỗi món đồ là một tác phẩm thời trang sống mãi với thời gian.",
    "aesthetic": "Architectural Minimalist Luxury",
    "logo": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "jacquemus",
    "name": "Jacquemus",
    "slug": "jacquemus",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 2009,
    "story": "Bắt nguồn từ miền Nam nước Pháp đầy nắng và hoa oải hương. Simon Porte Jacquemus tạo nên cơn sốt toàn cầu với những chiếc túi da mini và thiết kế phóng khoáng đậm chất thơ.",
    "aesthetic": "French Riviera Poetry & Iconic Accessories",
    "logo": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "chanel",
    "name": "Chanel",
    "slug": "chanel",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 1910,
    "story": "Đỉnh cao xa xỉ của Haute Couture và phụ kiện biểu tượng thế giới. Sự kết hợp hoàn mỹ giữa vẻ đẹp cổ điển vượt thời gian và đẳng cấp hoàng gia Paris.",
    "aesthetic": "French Haute Couture & Timeless Opulence",
    "logo": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&auto=format&fit=crop&q=80"
  },
  {
    "id": "chrome-hearts",
    "name": "Chrome Hearts",
    "slug": "chrome-hearts",
    "isLocalBrand": false,
    "country": "Hoa Kỳ",
    "foundedYear": 1988,
    "story": "Biểu tượng tối thượng của phong cách Luxury Biker & Gothic Rock Hollywood. Nổi tiếng toàn cầu với chi tiết bạc chạm khắc .925 thủ công và chất lượng da thuộc tinh xảo độc nhất.",
    "aesthetic": "Gothic Luxury & Sterling Silver High-Street",
    "logo": "https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/chrome-hearts-ma1-bomber-cream.jpg"
  },
  {
    "id": "lacoste",
    "name": "Lacoste",
    "slug": "lacoste",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 1933,
    "story": "Di sản thể thao nước Pháp được sáng lập bởi nhà vô địch quần vợt René Lacoste. Nổi danh với áo cá sấu Petit Piqué và phong cách Parisian Preppy thanh lịch vượt thời gian.",
    "aesthetic": "French Sport Elegance & Timeless Piqué",
    "logo": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/lacoste-hooded-knit-cardigan-navy.jpg"
  },
  {
    "id": "burberry",
    "name": "Burberry",
    "slug": "burberry",
    "isLocalBrand": false,
    "country": "Vương quốc Anh",
    "foundedYear": 1856,
    "story": "Di sản thời trang hoàng gia Anh Quốc với họa tiết Vintage Check và áo khoác Gabardine Trench Coat huyền thoại. Biểu tượng của sự sang trọng, lịch lãm và chuẩn mực quý tộc London.",
    "aesthetic": "British Heritage & Signature Check Modernism",
    "logo": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/burberry-vintage-check-cardigan-camel.jpg"
  },
  {
    "id": "polo-ralph-lauren",
    "name": "Polo Ralph Lauren",
    "slug": "polo-ralph-lauren",
    "isLocalBrand": false,
    "country": "Hoa Kỳ",
    "foundedYear": 1967,
    "story": "Đỉnh cao phong cách thượng lưu Mỹ (Old Money Aesthetic) với biểu tượng kỵ mã Polo, áo sơ mi Oxford chỉn chu và áo len cáp vặn thừng kinh điển.",
    "aesthetic": "American Old Money & Ivy League Elegance",
    "logo": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/ralph-lauren-vneck-cardigan-camel.jpg"
  },
  {
    "id": "gucci",
    "name": "Gucci",
    "slug": "gucci",
    "isLocalBrand": false,
    "country": "Ý",
    "foundedYear": 1921,
    "story": "Nhà mốt hàng đầu Florence với di sản may đo thủ công Ý, họa tiết sọc Web xanh đỏ trứ danh và biểu tượng Monogram GG vĩ đại của làng mốt thế giới.",
    "aesthetic": "Italian High-Glamour & Maximalist Elegance",
    "logo": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/gucci-harrington-bomber-cream.jpg"
  },
  {
    "id": "louis-vuitton",
    "name": "Louis Vuitton",
    "slug": "louis-vuitton",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 1854,
    "story": "Đế chế xa xỉ Paris nổi tiếng với nghệ thuật chế tác rương hòm và các bộ sưu tập thời trang Monogram, Damier làm say đắm giới mộ điệu toàn cầu.",
    "aesthetic": "French Haute Luxury & Iconic Monogram",
    "logo": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/louis-vuitton-starlight-galaxy-cardigan.jpg"
  },
  {
    "id": "dior",
    "name": "Dior",
    "slug": "dior",
    "isLocalBrand": false,
    "country": "Pháp",
    "foundedYear": 1946,
    "story": "Khởi nguồn từ New Look huyền thoại, Christian Dior định nghĩa lại vẻ đẹp lộng lẫy và kỹ nghệ may đo Haute Couture đỉnh cao kinh đô ánh sáng Paris.",
    "aesthetic": "Parisian Haute Couture & Oblique Prestige",
    "logo": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/dior-oblique-bomber-black.jpg"
  },
  {
    "id": "loro-piana",
    "name": "Loro Piana",
    "slug": "loro-piana",
    "isLocalBrand": false,
    "country": "Ý",
    "foundedYear": 1924,
    "story": "Chuẩn mực xa xỉ thầm lặng (Quiet Luxury) nước Ý với nguồn nguyên liệu len Cashmere quý hiếm, Vicuña và len siêu mịn được dệt tỉ mỉ bậc nhất thế giới.",
    "aesthetic": "Ultimate Quiet Luxury & Cashmere Perfection",
    "logo": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/loro-piana-zip-knit-bomber-black.jpg"
  },
  {
    "id": "adidas-originals",
    "name": "Adidas Originals",
    "slug": "adidas-originals",
    "isLocalBrand": false,
    "country": "Đức",
    "foundedYear": 1949,
    "story": "Dòng sản phẩm di sản của Adidas với biểu tượng cỏ 3 lá Trefoil, gắn liền với phong cách Terrace Retro Football, áo Beckenbauer và văn hóa đường phố.",
    "aesthetic": "Retro Terrace Football & Iconic Beckenbauer",
    "logo": "https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/adidas-varsity-bomber-tracksuit.jpg"
  },
  {
    "id": "nike",
    "name": "Nike",
    "slug": "nike",
    "isLocalBrand": false,
    "country": "Hoa Kỳ",
    "foundedYear": 1964,
    "story": "Thương hiệu thể thao số 1 thế giới với dấu Swoosh huyền thoại, dẫn đầu công nghệ vải Dri-FIT ADV và các bộ sưu tập hợp tác thể thao câu lạc bộ đỉnh cao.",
    "aesthetic": "Athletic Innovation & Club Street Performance",
    "logo": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/nike-psg-strike-tracksuit-navy.jpg"
  },
  {
    "id": "dolce-gabbana",
    "name": "Dolce & Gabbana",
    "slug": "dolce-gabbana",
    "isLocalBrand": false,
    "country": "Ý",
    "foundedYear": 1985,
    "story": "Bản sắc Địa Trung Hải nồng nàn và kỹ nghệ may đo Sartorial đỉnh cao của nước Ý, đem lại phong thái tự tin, sang trọng và đầy cuốn hút.",
    "aesthetic": "Italian Sartorial Tailoring & Mediterranean Glamour",
    "logo": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80",
    "bannerImage": "/images/products/dolce-gabbana-tailored-trousers-cream.jpg"
  }
];

export const CATEGORIES: Category[] = [
  {
    "id": "women",
    "name": "Nữ",
    "slug": "nu",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    "count": 128
  },
  {
    "id": "men",
    "name": "Nam",
    "slug": "nam",
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    "count": 96
  },
  {
    "id": "kids",
    "name": "Trẻ em",
    "slug": "tre-em",
    "image": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format&fit=crop&q=80",
    "count": 48
  },
  {
    "id": "jackets",
    "name": "Áo khoác",
    "slug": "ao-khoac",
    "image": "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    "count": 54
  },
  {
    "id": "knitwear",
    "name": "Áo len & Cardigan",
    "slug": "ao-len",
    "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
    "count": 42
  },
  {
    "id": "dresses",
    "name": "Váy & Đầm",
    "slug": "vay-dam",
    "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
    "count": 85
  },
  {
    "id": "trousers",
    "name": "Quần dài & Âu",
    "slug": "quan",
    "image": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
    "count": 64
  },
  {
    "id": "shirts",
    "name": "Áo thun & Sơ mi",
    "slug": "ao-thun",
    "image": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop&q=80",
    "count": 72
  },
  {
    "id": "bags",
    "name": "Túi xách",
    "slug": "tui-xach",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    "count": 49
  },
  {
    "id": "shoes",
    "name": "Giày dép",
    "slug": "giay-dep",
    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
    "count": 57
  },
  {
    "id": "accessories",
    "name": "Phụ kiện",
    "slug": "phu-kien",
    "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
    "count": 33
  },
  {
    "id": "local-brand",
    "name": "Local Brands",
    "slug": "local-brands",
    "image": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop&q=80",
    "count": 110
  },
  {
    "id": "do-bo",
    "name": "Đồ bộ & Tracksuits",
    "slug": "do-bo",
    "image": "/images/products/adidas-varsity-bomber-tracksuit.jpg",
    "count": 48
  }
];

export const PRODUCTS: Product[] = [
  {
    "id": "lum-01",
    "name": "Áo khoác dạ Cashmere dáng dài Oversized Trench",
    "slug": "ao-khoac-da-cashmere-dang-dai",
    "brand": "Lemaire",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 910000,
    "originalPrice": 1090000,
    "discountPercentage": 17,
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 8,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Mocha",
        "hex": "#8A7158"
      },
      {
        "name": "Be Champagne",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Chiếc áo khoác dạ mang tính biểu tượng của phong cách Quiet Luxury. Dệt từ 85% Cashmere nguyên bản kết hợp 15% Lụa Mulberry tự nhiên. Phom dáng suông rộng phóng khoáng, ve áo cổ điển tinh xảo cùng đai thắt eo nhấn nhá tỉ lệ cơ thể.",
    "material": "85% Cashmere Thượng hạng, 15% Mulberry Silk, Lót lụa tơ tằm dệt jacquard.",
    "careInstructions": [
      "Giặt khô chuyên dụng (Dry clean only)",
      "Không sấy nóng, không vắt xoắn",
      "Ủi bàn là hơi nước ở nhiệt độ thấp nhất",
      "Treo bằng móc gỗ bản rộng kèm túi bảo quản chống bụi"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-02",
    "name": "Đầm lụa cát xẻ tà nghệ thuật Silk Midi Dress",
    "slug": "dam-lua-cat-xe-ta-nghe-thuat",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 650000,
    "originalPrice": 4200000,
    "discountPercentage": 85,
    "rating": 5,
    "reviewCount": 46,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Giao hỏa tốc 2h HCM / 24-48h Toàn quốc",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Kem Ivory",
        "hex": "#FAF8F3"
      },
      {
        "name": "Đen Noir",
        "hex": "#171613"
      },
      {
        "name": "Be Nude",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M"
    ],
    "description": "Tuyệt tác đầm lụa cát mềm rũ từ nhà thiết kế Lâm Gia Khang. Đường cắt bias-cut ôm nhẹ theo đường cong cơ thể, cổ thuyền thanh nhã và đường xẻ tà quyến rũ vừa vặn cho các buổi tiệc dạ hội trang trọng hoặc sự kiện tinh tế.",
    "material": "100% Lụa cát Bảo Lộc cao cấp, độ rủ tự nhiên, thoáng khí và êm ái trên làn da.",
    "careInstructions": [
      "Khuyến khích giặt tay nhẹ nhàng với dầu gội hoặc sữa tắm dịu nhẹ",
      "Phơi trong bóng râm, tránh ánh nắng trực tiếp",
      "Ủi mặt trái với nhiệt độ lụa hoặc là hơi nước"
    ],
    "featured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "isSale": true
  },
  {
    "id": "lum-04",
    "name": "Sơ mi lụa tơ tằm cổ mở Deconstructed Silk Shirt",
    "slug": "so-mi-lua-to-tam-co-mo",
    "brand": "Duc Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "LIMITED"
    ],
    "category": "nu",
    "subCategory": "ao-thun",
    "price": 590000,
    "rating": 4.9,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Hàng có sẵn - Giao 24h-48h",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Kem Ivory",
        "hex": "#FAF8F3"
      },
      {
        "name": "Be Nâu Mocha",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Mẫu sơ mi mang cảm hứng Avant-garde với vạt áo vặn xoắn bất đối xứng độc quyền từ Duc Studio. Chi tiết cổ mở phóng khoáng, hàng cúc xà cừ tự nhiên khắc laser tinh xảo.",
    "material": "100% Lụa Habotai Việt Nam dệt thủ công.",
    "careInstructions": [
      "Giặt tay với nước lạnh",
      "Không dùng chất tẩy mạnh",
      "Ủi hơi nước mặt trái"
    ],
    "featured": true,
    "isBestSeller": true,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "lum-05",
    "name": "Quần tây ống suông xếp ly Wide-Leg Pleated Trousers",
    "slug": "quan-tay-ong-suong-xep-ly",
    "brand": "Nosbyn Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "quan",
    "price": 650000,
    "originalPrice": 810000,
    "discountPercentage": 20,
    "rating": 4.7,
    "reviewCount": 54,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Có sẵn tại kho HCM - Giao nhanh 1-2 ngày",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Be Champagne",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Noir",
        "hex": "#171613"
      },
      {
        "name": "Xám Khói",
        "hex": "#9E9E9E"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế quần âu lưng cao với hai ly xếp sâu kinh điển tạo hiệu ứng kéo dài đôi chân tối đa. Chất vải twill co giãn nhẹ, giữ nếp phẳng phiu suốt cả ngày làm việc.",
    "material": "70% Polyester tái chế cao cấp, 28% Rayon, 2% Spandex.",
    "careInstructions": [
      "Giặt máy chu kỳ nhẹ hoặc giặt tay",
      "Treo dọc theo nếp gấp ly",
      "Ủi nhiệt độ vừa"
    ],
    "featured": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-06",
    "name": "Cardigan dệt kim Mohair sợi phồng Artisanal Soft Cardigan",
    "slug": "cardigan-det-kim-mohair-soi-phong",
    "brand": "Subtle Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-len",
    "price": 670000,
    "rating": 5,
    "reviewCount": 19,
    "inStock": true,
    "stockCount": 7,
    "estimatedDelivery": "Hàng thủ công số lượng giới hạn - Giao 2-3 ngày",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Kem Ivory",
        "hex": "#FAF8F3"
      },
      {
        "name": "Nâu Mocha Nhạt",
        "hex": "#A89279"
      }
    ],
    "sizes": [
      "Freesize"
    ],
    "description": "Chiếc cardigan được đan thủ công từ sợi len Mohair cao cấp nhẹ như mây nhưng giữ ấm vượt trội. Phom dáng thụng nhẹ lãng mạn, cúc áo chế tác từ gỗ sồi nguyên khối.",
    "material": "60% Kid Mohair, 30% Polyamide, 10% Wool Merino.",
    "careInstructions": [
      "Chỉ giặt tay trong nước lạnh với dầu gội len",
      "Trải phẳng trên khăn bông để phơi khô, tuyệt đối không treo móc đứng"
    ],
    "featured": true,
    "isNewArrival": true,
    "originalPrice": 820000,
    "discountPercentage": 18,
    "isSale": true
  },
  {
    "id": "lum-09",
    "name": "Đầm tiệc nhung đen cúp ngực Corset Velvet Mini Dress",
    "slug": "dam-tiec-nhung-den-cup-nguc-lseoul",
    "brand": "LSEOUL",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "LIMITED"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 580000,
    "originalPrice": 730000,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewCount": 68,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Giao hỏa tốc 2-4h nội thành",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Nhung Noir",
        "hex": "#171613"
      },
      {
        "name": "Đỏ Bordeaux",
        "hex": "#B83A3A"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M"
    ],
    "description": "Thiết kế cúp ngực tôn dáng với gọng corset định hình eo thon, chất liệu nhung tuyết bắt sáng cuốn hút được hàng loạt ngôi sao K-Pop ưa chuộng.",
    "material": "100% Velvet Silk cao cấp, co giãn nhẹ.",
    "careInstructions": [
      "Giặt khô hoặc giặt hấp",
      "Không vắt sấy nóng"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-10",
    "name": "Áo blazer nữ phom ngắn Cropped Double-Breasted Blazer",
    "slug": "ao-blazer-nu-phom-ngan-dottie",
    "brand": "Dottie",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 910000,
    "originalPrice": 1090000,
    "discountPercentage": 17,
    "rating": 4.8,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 22,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Be Cát Sáng",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Tuyền",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M"
    ],
    "description": "Blazer dáng lửng trẻ trung dễ phối đồ cùng quần cạp cao hoặc chân váy, vải đứng form tôn trọn tỷ lệ cơ thể.",
    "material": "Chất vải biên gân nhập khẩu giữ form chống nhăn.",
    "careInstructions": [
      "Giặt máy chu kỳ êm",
      "Ủi bàn là nhiệt độ vừa"
    ],
    "featured": false,
    "isSale": true
  },
  {
    "id": "lum-11",
    "name": "Áo sơ mi Linen dáng suông Relaxed Organic Shirt",
    "slug": "ao-so-mi-linen-dang-suong-cos",
    "brand": "COS",
    "origin": "international_order",
    "originCountry": "Thụy Điển",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nu",
    "subCategory": "ao-thun",
    "price": 430000,
    "rating": 4.9,
    "reviewCount": 25,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Order 7-10 ngày (Store COS Châu Âu)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Sữa Off-White",
        "hex": "#FAF8F3"
      },
      {
        "name": "Xanh Khói Sage",
        "hex": "#8A9A86"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế mang DNA kiến trúc tối giản của thương hiệu COS. Đường may tinh giản giấu chỉ, vạt tà xẻ cao thanh lịch.",
    "material": "100% Pure Organic Linen thoáng mát.",
    "careInstructions": [
      "Giặt nước lạnh",
      "Ủi khi áo còn ẩm"
    ],
    "featured": false,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "lum-03",
    "name": "Blazer dệt len Wool Structured Double-Breasted Nam",
    "slug": "blazer-det-len-wool-structured-nam",
    "brand": "ADER Error",
    "origin": "international_order",
    "originCountry": "Hàn Quốc",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 750000,
    "originalPrice": 900000,
    "discountPercentage": 17,
    "rating": 4.8,
    "reviewCount": 22,
    "inStock": true,
    "stockCount": 5,
    "estimatedDelivery": "Dự kiến 7-10 ngày (Hàng order trực tiếp Seoul)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xám Than Anthracite",
        "hex": "#2B2B2B"
      },
      {
        "name": "Xanh Navy Đậm",
        "hex": "#1A2332"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "description": "Áo blazer hai hàng khuy phom hộp hiện đại đặc trưng của làn sóng thời trang Seoul. Cầu vai định hình sắc sảo, đường xẻ lưng kép linh hoạt và lớp lót cupro cao cấp tạo cảm giác thoải mái tối đa.",
    "material": "90% Wool Merino dệt chéo, 10% Cashmere blend, lót trong 100% Cupro dệt kim.",
    "careInstructions": [
      "Giặt khô định kỳ 2-3 tháng/lần",
      "Sau khi mặc dùng bàn chải lông ngựa chải bụi nhẹ nhàng",
      "Treo móc có đệm vai để giữ form áo hoàn hảo"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "lum-08",
    "name": "Áo sơ mi lụa Poplin phom rộng Men Relaxed Silk-Cotton Shirt",
    "slug": "ao-so-mi-lua-poplin-phom-rong-nam",
    "brand": "ADER Error",
    "origin": "international_order",
    "originCountry": "Hàn Quốc",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 430000,
    "originalPrice": 540000,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewCount": 17,
    "inStock": true,
    "stockCount": 9,
    "estimatedDelivery": "Dự kiến 7-10 ngày (Order Hàn Quốc)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Tinh Khiết",
        "hex": "#FFFFFF"
      },
      {
        "name": "Xanh Pastel Khói",
        "hex": "#B0C4DE"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "description": "Sơ mi cao cấp với độ bóng mờ sang trọng từ sợi tơ lụa kết hợp cotton Pima Ai Cập. Cổ áo đứng form, đường chỉ may 21 mũi/inch siêu mật độ.",
    "material": "60% Pima Cotton, 40% Mulberry Silk.",
    "careInstructions": [
      "Giặt nhẹ ở 30 độ C",
      "Ủi mặt trái với nhiệt độ thích hợp"
    ],
    "featured": false,
    "isSale": true
  },
  {
    "id": "lum-12",
    "name": "Quần tây nam xếp ly ống đứng Relaxed Pleated Trousers",
    "slug": "quan-tay-nam-xep-ly-lemaire",
    "brand": "Lemaire",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "quan",
    "price": 450000,
    "rating": 5,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Order Boutique Paris 8-12 ngày",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Mocha",
        "hex": "#8A7158"
      },
      {
        "name": "Đen Than",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "46 (S)",
      "48 (M)",
      "50 (L)"
    ],
    "description": "Mẫu quần âu kinh điển của Lemaire với độ rủ và đường xếp ly tuyệt mỹ, tạo nên thần thái quý ông Paris thanh lịch, tự tại.",
    "material": "100% Wool Gabardine dệt mật độ cao từ xưởng dệt Ý.",
    "careInstructions": [
      "Giặt khô chuyên dụng",
      "Treo móc thẳng nếp ly"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": false
  },
  {
    "id": "lum-13",
    "name": "Áo Polo len dệt kim Fine Merino Wool Polo",
    "slug": "ao-polo-len-det-kim-routine",
    "brand": "Routine",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 770000,
    "originalPrice": 940000,
    "discountPercentage": 18,
    "rating": 4.9,
    "reviewCount": 75,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Giao nhanh 1-2 ngày toàn quốc",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Be Champagne",
        "hex": "#E8D7BD"
      },
      {
        "name": "Xanh Navy",
        "hex": "#1E293B"
      },
      {
        "name": "Đen Than",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chất liệu len dệt kim siêu mịn, cổ sơ mi bẻ thanh lịch, ôm nhẹ bắp tay và ngực mang lại diện mạo lịch lãm phong độ.",
    "material": "Sợi len pha cotton cao cấp chống nhăn chống bai dão.",
    "careInstructions": [
      "Giặt nhẹ nước lạnh",
      "Phơi nằm ngang"
    ],
    "featured": false,
    "isSale": true,
    "isBestSeller": true
  },
  {
    "id": "lum-14",
    "name": "Áo khoác da lộn Faux Suede Bomber Jacket Nam",
    "slug": "ao-khoac-da-lon-zara-men",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1070000,
    "rating": 4.7,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Order 7-10 ngày (Store Zara Tây Ban Nha)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Da Bò Caramel",
        "hex": "#8A5D3B"
      },
      {
        "name": "Xám Xi Măng",
        "hex": "#6B7280"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "description": "Mẫu áo khoác bomber da lộn dáng suông hiện đại với đường viền bo dệt kim co giãn, khóa kéo kim loại mạ bạc cổ điển.",
    "material": "Da lộn sinh học Faux Suede mềm mại và lớp lót gió cản gió.",
    "careInstructions": [
      "Giặt khô nhẹ nhàng",
      "Bảo quản nơi khô ráo thoáng mát"
    ],
    "featured": true,
    "isNewArrival": true,
    "originalPrice": 1280000,
    "discountPercentage": 16,
    "isSale": true
  },
  {
    "id": "lum-15",
    "name": "Áo sơ mi Oxford Supima Cotton dệt mật độ cao",
    "slug": "ao-so-mi-oxford-supima-uniqlo",
    "brand": "Uniqlo",
    "origin": "in_stock_ready",
    "originCountry": "Nhật Bản",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 510000,
    "rating": 4.9,
    "reviewCount": 92,
    "inStock": true,
    "stockCount": 45,
    "estimatedDelivery": "Giao hỏa tốc 2-4h nội thành",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Tinh",
        "hex": "#FFFFFF"
      },
      {
        "name": "Xanh Da Trời Nhạt",
        "hex": "#C2D9ED"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Sơ mi Oxford chuẩn mực từ bông Supima quý hiếm chiếm chưa tới 1% sản lượng bông thế giới, cho bề mặt mịn màng và độ bền tuyệt hảo.",
    "material": "100% Bông Supima Cotton cao cấp.",
    "careInstructions": [
      "Giặt máy giặt thường",
      "Là ủi hơi nước nhiệt độ trung bình"
    ],
    "featured": false,
    "isBestSeller": true,
    "isSale": false
  },
  {
    "id": "lum-16",
    "name": "Váy xoè bèo nhún lụa cotton cho bé gái Little Princess Dress",
    "slug": "vay-xoe-beo-nhun-lua-cotton-be-gai",
    "brand": "TADA! Kids",
    "origin": "in_stock_ready",
    "originCountry": "Việt Nam",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "tre-em",
    "subCategory": "be-gai",
    "price": 380000,
    "originalPrice": 480000,
    "discountPercentage": 21,
    "rating": 5,
    "reviewCount": 34,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Giao nhanh 1-2 ngày toàn quốc",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Hồng Phấn Pastel",
        "hex": "#F3D1DC"
      },
      {
        "name": "Trắng Kem Bơ",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "2-3 tuổi",
      "4-5 tuổi",
      "6-7 tuổi",
      "8-9 tuổi"
    ],
    "description": "Chiếc váy đầm xinh xắn với lớp lót 100% cotton organic êm ái trên làn da nhạy cảm của bé. Đường may giấu kín không gây ngứa ngáy hay khó chịu.",
    "material": "Lụa tơ nhân tạo mềm mại lót trong 100% Cotton Organic an toàn tuyệt đối.",
    "careInstructions": [
      "Giặt tay hoặc túi giặt",
      "Nước giặt dịu nhẹ cho bé"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-17",
    "name": "Bộ vest lịch lãm bé trai Mini Gentleman Blazer Suit",
    "slug": "bo-vest-lich-lam-be-trai-zara-kids",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "tre-em",
    "subCategory": "be-trai",
    "price": 830000,
    "rating": 4.8,
    "reviewCount": 16,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Order 7-10 ngày (Zara Kids Châu Âu)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Navy Lịch Lãm",
        "hex": "#1E293B"
      },
      {
        "name": "Be Sữa Nhã Nhặn",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "3-4 tuổi",
      "5-6 tuổi",
      "7-8 tuổi",
      "9-10 tuổi"
    ],
    "description": "Set vest 2 món gồm áo blazer phom ôm nhẹ và quần âu lưng chun co giãn tiện lợi, phù hợp cho bé dự tiệc cưới, sinh nhật và lễ hội.",
    "material": "Vải tuýt-xi mềm chống nhăn thoáng mát.",
    "careInstructions": [
      "Giặt nhẹ hoặc giặt khô",
      "Ủi hơi nước"
    ],
    "featured": false,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "lum-18",
    "name": "Áo len đan tay cổ tròn Cotton Len Hữu Cơ Trẻ Em",
    "slug": "ao-len-dan-tay-cotton-huu-co-uniqlo-kids",
    "brand": "Uniqlo",
    "origin": "in_stock_ready",
    "originCountry": "Nhật Bản",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "tre-em",
    "subCategory": "ao-len",
    "price": 520000,
    "originalPrice": 630000,
    "discountPercentage": 17,
    "rating": 4.9,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Vàng Mù Tạt Ấm Áp",
        "hex": "#E5A93C"
      },
      {
        "name": "Nâu Hạt Dẻ",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "100cm",
      "110cm",
      "120cm",
      "130cm"
    ],
    "description": "Chất len đan kim đôi siêu mịn không xổ lông, giữ ấm vượt trội trong những ngày se lạnh cho bé tha hồ vận động thoải mái.",
    "material": "100% Cotton hữu cơ mềm mại không châm chích.",
    "careInstructions": [
      "Giặt máy ở chế độ giặt nhẹ",
      "Phơi mặt phẳng"
    ],
    "featured": false,
    "isSale": true
  },
  {
    "id": "lum-07",
    "name": "Túi xách da bê Croissant Leather Bag dáng bán nguyệt",
    "slug": "tui-xach-da-be-croissant-leather-bag",
    "brand": "Lemaire",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "tui-xach",
    "price": 710000,
    "originalPrice": 26800000,
    "discountPercentage": 97,
    "rating": 5,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Order từ Boutique Lemaire Paris (10-14 ngày kèm bill box seal)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Đậm Dark Chocolate",
        "hex": "#3B2F2F"
      },
      {
        "name": "Đen Mờ Matte Black",
        "hex": "#1C1C1C"
      }
    ],
    "sizes": [
      "Small (Dài 35cm)",
      "Medium (Dài 46cm)"
    ],
    "description": "Biểu tượng kinh điển của nhà mốt Lemaire. Chiếc túi hình bánh sừng bò được may ghép thủ công từ da bê nappa thuộc thảo mộc nguyên bản. Khóa kéo kim loại sơn tĩnh điện đồng màu.",
    "material": "100% Da bê Nappa Tây Ban Nha nguyên tấm cao cấp.",
    "careInstructions": [
      "Lau sạch bằng khăn mềm ẩm, thoa kem dưỡng da định kỳ",
      "Bảo quản trong dustbag và nhét giấy giữ dáng túi"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-19",
    "name": "Túi da mini Le Bambino Mini Leather Shoulder Bag",
    "slug": "tui-da-mini-le-bambino-jacquemus",
    "brand": "Jacquemus",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "tui-xach",
    "price": 950000,
    "originalPrice": 18200000,
    "discountPercentage": 95,
    "rating": 5,
    "reviewCount": 52,
    "inStock": true,
    "stockCount": 4,
    "estimatedDelivery": "Order trực tiếp Boutique Paris 8-12 ngày full seal box",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Ngà Pure Ivory",
        "hex": "#FAF8F3"
      },
      {
        "name": "Hồng Đào Candy Pink",
        "hex": "#F472B6"
      },
      {
        "name": "Đen Nhám Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "Mini (17.5 x 9 x 6 cm)"
    ],
    "description": "Chiếc túi mini biểu tượng gây sốt toàn cầu của Jacquemus với quai cầm tay thanh thoát, logo kim loại mạ vàng sang trọng và dây đeo chéo tháo rời.",
    "material": "100% Da bê mịn Calfskin cao cấp nhập khẩu Pháp.",
    "careInstructions": [
      "Bảo quản trong túi vải chống ẩm",
      "Tránh tiếp xúc hóa chất dầu mỡ"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "lum-20",
    "name": "Thắt lưng da bê khoá cài mạ vàng champagne Timeless Belt",
    "slug": "that-lung-da-be-khoa-vang-chanel",
    "brand": "Chanel",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "LIMITED"
    ],
    "category": "phu-kien",
    "subCategory": "that-lung",
    "price": 440000,
    "rating": 5,
    "reviewCount": 29,
    "inStock": true,
    "stockCount": 2,
    "estimatedDelivery": "Bay Air từ Paris (Boutique Rue Cambon) 10-14 ngày",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Noir",
        "hex": "#171613"
      },
      {
        "name": "Nâu Bò Thuần",
        "hex": "#8A5D3B"
      }
    ],
    "sizes": [
      "75cm",
      "80cm",
      "85cm"
    ],
    "description": "Chiếc thắt lưng bản nhỏ 2.5cm chế tác từ da bê mịn thượng hạng kết hợp khoá logo mạ vàng champagne phay xước tinh xảo.",
    "material": "100% Da bê tự nhiên nước Pháp.",
    "careInstructions": [
      "Lau khăn khô mềm",
      "Tránh gấp gãy form"
    ],
    "featured": true,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "lum-21",
    "name": "Giày cao gót mũi nhọn lụa satin The Bow Heeled Pumps",
    "slug": "giay-cao-got-mui-nhon-lua-satin-gia-studios",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "giay-dep",
    "price": 490000,
    "rating": 4.9,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 8,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "depositRequired": false,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Kem Lụa",
        "hex": "#FAF8F3"
      },
      {
        "name": "Đen Tuyền",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39"
    ],
    "description": "Đôi giày cao gót 7cm chế tác thủ công tinh tế với nơ thắt điêu khắc độc quyền Gia Studios, lót đệm êm nâng niu từng bước chân phái đẹp.",
    "material": "Lụa Satin nhập khẩu Ý, đế da thật bền bỉ.",
    "careInstructions": [
      "Tránh đi dưới trời mưa lớn",
      "Đánh xi dưỡng lụa chuyên dụng"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": false
  },
  {
    "id": "lum-22",
    "name": "Giày Loafer đế bệt da bóng Chunky Sole Leather Loafer",
    "slug": "giay-loafer-de-bet-da-bong-ader-error",
    "brand": "ADER Error",
    "origin": "international_order",
    "originCountry": "Hàn Quốc",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "phu-kien",
    "subCategory": "giay-dep",
    "price": 790000,
    "rating": 4.8,
    "reviewCount": 19,
    "inStock": true,
    "stockCount": 5,
    "estimatedDelivery": "Order Seoul 7-10 ngày",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Bóng Glass Leather",
        "hex": "#171613"
      },
      {
        "name": "Nâu Rượu Vang",
        "hex": "#4A1521"
      }
    ],
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "description": "Thiết kế loafer hiện đại với đế răng cưa chunky cá tính, chi tiết tag kim loại xanh signature đặc trưng của ADER Error Seoul.",
    "material": "Da bóng tự nhiên bóng gương và đế cao su đúc nguyên khối siêu nhẹ.",
    "careInstructions": [
      "Vệ sinh bằng dung dịch làm sạch đồ da",
      "Dùng cây giữ form giày"
    ],
    "featured": false,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "lum-23",
    "name": "Kính râm gọng Acetate mắt mèo Geometric Sunglasses",
    "slug": "kinh-ram-gong-acetate-mat-meo-cos",
    "brand": "COS",
    "origin": "international_order",
    "originCountry": "Thụy Điển",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "phu-kien",
    "subCategory": "phu-kien",
    "price": 320000,
    "rating": 4.9,
    "reviewCount": 22,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Order 7-10 ngày (Store Châu Âu)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Mực Đậm",
        "hex": "#171613"
      },
      {
        "name": "Đồi Mồi Nâu Hổ Phách",
        "hex": "#8A5D3B"
      }
    ],
    "sizes": [
      "Freesize"
    ],
    "description": "Chiếc kính mắt hình học góc cạnh ấn tượng với tròng mắt phân cực chống tia UV400 bảo vệ mắt toàn diện.",
    "material": "Gọng Acetate cellulose tái sinh thân thiện môi trường.",
    "careInstructions": [
      "Lau khăn microfiber chuyên dụng",
      "Bảo quản trong hộp cứng"
    ],
    "featured": false,
    "isNewArrival": true,
    "isSale": false
  },
  {
    "id": "mau-01",
    "name": "Áo Thun Raglan Tay Dài Chrome Hearts Horseshoe L/S Tee",
    "slug": "ao-thun-raglan-tay-dai-chrome-hearts-horseshoe",
    "brand": "Chrome Hearts",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 430000,
    "originalPrice": 16800000,
    "discountPercentage": 97,
    "rating": 5,
    "reviewCount": 32,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Dự kiến 7-10 ngày (Bay Air từ Los Angeles)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/chrome-hearts-raglan-l-tee.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Phối Đen",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chiếc áo thun tay dài raglan mang họa tiết móng ngựa Horseshoe kinh điển in mặt sau, tay áo phối màu đen trắng tương phản sắc nét cùng logo chữ thập Gothic đặc trưng Chrome Hearts Hollywood.",
    "material": "100% Cotton Heavyweight cao cấp của Mỹ, mực in cao thành dập nổi sắc nét.",
    "careInstructions": [
      "Giặt khô hoặc giặt tay nước lạnh",
      "Ủi mặt trái nhiệt độ thấp",
      "Không dùng chất tẩy mạnh"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-02",
    "name": "Áo Cardigan Dệt Kim Có Mũ Lacoste Navy Knit Zip Hooded",
    "slug": "ao-cardigan-det-kim-co-mu-lacoste-navy",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 520000,
    "originalPrice": 630000,
    "discountPercentage": 17,
    "rating": 4.9,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-hooded-knit-cardigan-navy.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Navy",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo khoác len dệt kim có mũ trùm với khóa zip kim loại chắc chắn, gam màu xanh navy sang trọng kết hợp logo cá sấu xanh thêu ngực tinh tế.",
    "material": "80% Fine Merino Wool chải kỹ, 20% Polyamide giữ phom chống bai giãn.",
    "careInstructions": [
      "Giặt tay nhẹ nhàng với nước lạnh",
      "Phơi phẳng trong bóng râm"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-03",
    "name": "Bộ Tracksuit Nỉ Cổ Bomber Adidas Originals Varsity 3-Stripes Set",
    "slug": "bo-tracksuit-ni-co-bomber-adidas-varsity",
    "brand": "Adidas Originals",
    "origin": "in_stock_ready",
    "originCountry": "Đức",
    "badges": [
      "HÀNG CÓ SẴN",
      "LIMITED"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 900000,
    "originalPrice": 4800000,
    "discountPercentage": 81,
    "rating": 4.9,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/adidas-varsity-bomber-tracksuit.jpg"
    ],
    "colors": [
      {
        "name": "Đen Trắng Varsity",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Trọn bộ quần áo thể thao phong cách bóng chày Varsity retro của Adidas Originals. Cổ áo bo sọc thể thao kinh điển, chất vải nỉ da cá dày dặn đứng phom.",
    "material": "70% Cotton hữu cơ, 30% Recycled Polyester dệt thể thao.",
    "careInstructions": [
      "Giặt máy chế độ êm",
      "Ủi nhiệt độ trung bình"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-04",
    "name": "Bộ Tracksuit Huấn Luyện Đội Tuyển Đức Adidas DFB White Tracksuit",
    "slug": "bo-tracksuit-huan-luyen-tuyen-duc-adidas-dfb",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 850000,
    "originalPrice": 1060000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 8,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Frankfurt)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-germany-training-tracksuit-white.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Ngà Phối Đen",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Phiên bản đồng phục huấn luyện đội tuyển Đức với quốc huy DFB thêu chỉ vàng gold sắc nét, tông màu trắng thanh lịch cùng dải 3 sọc đối xứng.",
    "material": "Vải dệt thể thao cao cấp mềm nhẹ, thoát ẩm công nghệ AEROREADY.",
    "careInstructions": [
      "Giặt nước lạnh",
      "Không ngâm trong chất tẩy"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-05",
    "name": "Áo Gió Thể Thao Adidas Originals Sage Green Windbreaker",
    "slug": "ao-gio-the-thao-adidas-sage-green",
    "brand": "Adidas Originals",
    "origin": "in_stock_ready",
    "originCountry": "Đức",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 830000,
    "originalPrice": 3600000,
    "discountPercentage": 77,
    "rating": 4.8,
    "reviewCount": 22,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/adidas-windbreaker-sage-green.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Xô Thơm Sage Green",
        "hex": "#9CA3AF"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo khoác gió nhẹ màu xanh xô thơm Sage Green cực kỳ bắt mắt và hiện đại. Chống gió và kháng nước nhẹ, phù hợp thời tiết giao mùa.",
    "material": "100% Recycled Nylon ripstop chống bám bụi và kháng nước.",
    "careInstructions": [
      "Giặt máy chế độ nhẹ",
      "Phơi khô tự nhiên"
    ],
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-06",
    "name": "Áo Polo Piqué Tay Dài Lacoste Classic White L/S Polo",
    "slug": "ao-polo-pique-tay-dai-lacoste-white",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 470000,
    "originalPrice": 590000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 51,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-long-sleeve-polo-white.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Tinh Khiết",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Polo tay dài trắng tinh khôi dệt piqué xốp 100% cotton trứ danh từ Lacoste. Bo cổ dệt kim chống bai xù cùng nút cài xà cừ khắc chìm.",
    "material": "100% Petit Piqué Cotton Pháp cao cấp.",
    "careInstructions": [
      "Giặt máy với đồ sáng màu",
      "Ủi hơi nước nhẹ nhàng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-07",
    "name": "Áo Khoác Bomber Lụa Satin Chrome Hearts MA-1 Cream Dagger Zip",
    "slug": "ao-khoac-bomber-chrome-hearts-ma1-cream",
    "brand": "Chrome Hearts",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 2050000,
    "originalPrice": 75000000,
    "discountPercentage": 97,
    "rating": 5,
    "reviewCount": 19,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Dự kiến 10-14 ngày (Hàng xách tay cao cấp kèm bảo hiểm)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/chrome-hearts-ma1-bomber-cream.jpg"
    ],
    "colors": [
      {
        "name": "Kem Sữa Champagne",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "description": "Tuyệt tác áo bomber lụa satin MA-1 màu kem sang trọng của Chrome Hearts. Điểm nhấn là đầu kéo khóa Dagger bạc đúc 925 nguyên khối và nút tán bạc hoa văn hoa chữ thập độc bản.",
    "material": "Lụa Satin dệt chéo cao cấp của Nhật, phụ kiện bạc đúc .925 Sterling Silver.",
    "careInstructions": [
      "Giặt khô chuyên dụng cao cấp",
      "Bảo quản trong bao áo chống ẩm"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-08",
    "name": "Áo Polo Dệt Kim Lụa Burberry EKD Silk-Cotton Black Knit Polo",
    "slug": "ao-polo-det-kim-burberry-ekd-black",
    "brand": "Burberry",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 1170000,
    "originalPrice": 1430000,
    "discountPercentage": 18,
    "rating": 5,
    "reviewCount": 26,
    "inStock": true,
    "stockCount": 7,
    "estimatedDelivery": "Dự kiến 7-10 ngày (Bay Air từ London)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/burberry-ekd-knit-polo-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo polo dệt kim đen tuyền sang trọng từ hỗn hợp lụa Mulberry và cotton Ai Cập. Thêu biểu tượng hiệp sĩ cưỡi ngựa Equestrian Knight tinh tế.",
    "material": "55% Silk, 45% Cotton Ai Cập dệt kim gauge 18 siêu mịn.",
    "careInstructions": [
      "Giặt khô hoặc giặt tay nhẹ",
      "Phơi nằm ngang"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-09",
    "name": "Áo Polo Piqué Tay Dài Lacoste Classic Black L/S Polo",
    "slug": "ao-polo-pique-tay-dai-lacoste-black",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 590000,
    "originalPrice": 4100000,
    "discountPercentage": 86,
    "rating": 4.9,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 16,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-long-sleeve-polo-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Phiên bản polo tay dài đen huyền bí của Lacoste. Tôn trọn phom ngực và vai của quý ông, dễ dàng kết hợp cùng quần âu hoặc chinos.",
    "material": "100% Petit Piqué Cotton cao cấp.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Không dùng thuốc tẩy"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-10",
    "name": "Áo Khoác Retro Tuyển Anh Adidas Originals England Track Jacket",
    "slug": "ao-khoac-retro-tuyen-anh-adidas-england",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 700000,
    "originalPrice": 4300000,
    "discountPercentage": 84,
    "rating": 4.9,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 9,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ châu Âu)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-england-track-jacket-white.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Tuyển Anh",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Tái hiện tinh hoa terrace football của tuyển Anh với huy hiệu Ba Chú Sư Tử Three Lions thêu ngực và dải sọc retro dọc tay áo.",
    "material": "52% Cotton, 48% Recycled Polyester dệt interlock dầy dặn.",
    "careInstructions": [
      "Giặt máy nước lạnh",
      "Ủi mặt trái"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-11",
    "name": "Áo Gió Thể Thao Tuyển Đức Adidas DFB Burgundy Windbreaker",
    "slug": "ao-gio-tuyen-duc-adidas-dfb-burgundy",
    "brand": "Adidas Originals",
    "origin": "in_stock_ready",
    "originCountry": "Đức",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 680000,
    "originalPrice": 3950000,
    "discountPercentage": 83,
    "rating": 4.8,
    "reviewCount": 25,
    "inStock": true,
    "stockCount": 11,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/adidas-germany-windbreaker-burgundy.jpg"
    ],
    "colors": [
      {
        "name": "Đỏ Rượu Vang Burgundy",
        "hex": "#B83A3A"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Gam màu đỏ mận Burgundy quý phái của đội tuyển Đức, phom áo gió thể thao thoải mái bảo vệ cơ thể khỏi gió lạnh.",
    "material": "100% Recycled Polyester dệt trơn kháng nước.",
    "careInstructions": [
      "Giặt máy nhiệt độ bình thường",
      "Không sấy nhiệt cao"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-12",
    "name": "Áo Khoác Beckenbauer Tây Ban Nha Adidas Spain Track Jacket",
    "slug": "ao-khoac-beckenbauer-tay-ban-nha-adidas-spain",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 900000,
    "originalPrice": 4500000,
    "discountPercentage": 80,
    "rating": 4.9,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Madrid)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-spain-track-jacket-hanger.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Navy Hoàng Gia",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Mẫu áo khoác Beckenbauer trứ danh mang huy hiệu hoàng gia Tây Ban Nha RFEF, chất vải interlock dầy dặn ôm vừa vặn.",
    "material": "Vải dệt thể thao dầy cao cấp của Adidas.",
    "careInstructions": [
      "Giặt nước lạnh",
      "Phơi bóng râm"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-13",
    "name": "Áo Cardigan Thêu Hoa Dạ Nguyệt Dior Floral Cashmere Knit Cardigan",
    "slug": "ao-cardigan-theu-hoa-dior-floral-cashmere",
    "brand": "Dior",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 1090000,
    "originalPrice": 52000000,
    "discountPercentage": 98,
    "rating": 5,
    "reviewCount": 18,
    "inStock": true,
    "stockCount": 4,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris kèm hóa đơn)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/dior-floral-knit-cardigan-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Họa Tiết Hoa Trắng",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Tuyệt phẩm cardigan dệt kim từ Cashmere và lụa tơ tằm nguyên chất. Họa tiết hoa cúc trắng dạ nguyệt thêu tay thủ công theo tinh thần Haute Couture của Christian Dior Paris.",
    "material": "70% Cashmere nguyên chất, 30% Mulberry Silk Ý.",
    "careInstructions": [
      "Chỉ giặt khô chuyên dụng",
      "Bảo quản bằng móc gỗ độn vai"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-14",
    "name": "Áo Sơ Mi Oxford Cotton Lacoste Slim Fit Navy Shirt",
    "slug": "ao-so-mi-oxford-cotton-lacoste-navy",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 510000,
    "originalPrice": 3400000,
    "discountPercentage": 85,
    "rating": 4.8,
    "reviewCount": 40,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-oxford-shirt-navy.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Navy Đậm",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chất liệu vải Oxford dày dặn dệt vân hạt tổ ong đặc trưng, cổ cài nút button-down phong độ và logo cá sấu xanh đặc trưng.",
    "material": "100% Oxford Cotton cao cấp.",
    "careInstructions": [
      "Giặt máy ở 40 độ C",
      "Ủi hơi nước khi còn hơi ẩm"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-15",
    "name": "Quần Tây Xếp Ly D&G Tailored Pleated Trousers Cream",
    "slug": "quan-tay-xep-ly-dolce-gabbana-cream",
    "brand": "Dolce & Gabbana",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "quan",
    "price": 550000,
    "originalPrice": 23000000,
    "discountPercentage": 98,
    "rating": 4.9,
    "reviewCount": 21,
    "inStock": true,
    "stockCount": 5,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Milan)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/dolce-gabbana-tailored-trousers-cream.jpg"
    ],
    "colors": [
      {
        "name": "Kem Sữa Ivory",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "46 (S)",
      "48 (M)",
      "50 (L)",
      "52 (XL)"
    ],
    "description": "Quần tây may đo xếp ly kép tinh xảo phong cách may đo Sartorial nước Ý. Màu kem sữa thanh lịch, tag kim loại khắc logo Dolce & Gabbana Milano ở túi sau.",
    "material": "98% Virgin Wool Ý, 2% Elastane co giãn nhẹ.",
    "careInstructions": [
      "Giặt khô chuyên dụng",
      "Ủi ly chuẩn mực"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-16",
    "name": "Áo Polo Len Vặn Thừng Lacoste Chocolate Cable Knit Polo",
    "slug": "ao-polo-len-van-thung-lacoste-chocolate",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 570000,
    "originalPrice": 5600000,
    "discountPercentage": 90,
    "rating": 5,
    "reviewCount": 36,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-cable-knit-polo-brown.jpg"
    ],
    "colors": [
      {
        "name": "Nâu Sô-cô-la Chocolate",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chiếc polo len vặn thừng Cable Knit màu nâu sô-cô-la ấm áp. Đậm chất Paris Parisian Chic, mang lại diện mạo đĩnh đạc và cuốn hút.",
    "material": "100% Pure Merino Wool siêu mịn không gây ngứa ráp.",
    "careInstructions": [
      "Giặt tay với xà phòng len chuyên dụng",
      "Phơi phẳng trên khăn"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-17",
    "name": "Áo Len Cổ Khóa Half-Zip Louis Vuitton Monogram Oatmeal Sweater",
    "slug": "ao-len-co-khoa-louis-vuitton-monogram-oatmeal",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 1170000,
    "originalPrice": 1430000,
    "discountPercentage": 18,
    "rating": 5,
    "reviewCount": 24,
    "inStock": true,
    "stockCount": 4,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-halfzip-knit-oatmeal.jpg"
    ],
    "colors": [
      {
        "name": "Màu Yến Mạch Oatmeal",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo len cổ kéo khóa half-zip dệt họa tiết Monogram dập nổi tinh xảo của Louis Vuitton. Màu yến mạch ấm áp, đầu khóa kéo khắc tên thương hiệu mạ vàng mờ.",
    "material": "90% Wool, 10% Cashmere thượng hạng.",
    "careInstructions": [
      "Giặt khô",
      "Bảo quản nơi khô ráo thoáng khí"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-18",
    "name": "Áo Nỉ Dệt Họa Tiết Louis Vuitton Disrupted Monogram Olive Crewneck",
    "slug": "ao-ni-louis-vuitton-disrupted-monogram-olive",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 730000,
    "originalPrice": 44000000,
    "discountPercentage": 98,
    "rating": 4.9,
    "reviewCount": 29,
    "inStock": true,
    "stockCount": 5,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-monogram-crewneck-olive.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Ô-liu Olive Green",
        "hex": "#524E48"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo cổ tròn crewneck dệt jacquard hiệu ứng Monogram xáo trộn độc đáo. Tông màu xanh ô-liu trầm tĩnh đem đến phong cách thời trang đương đại độc đáo.",
    "material": "Hỗn hợp Cashmere và Cotton đan sợi đôi êm ái.",
    "careInstructions": [
      "Giặt khô chuyên dụng",
      "Ủi nhiệt độ thấp"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-19",
    "name": "Áo Polo Dệt Jacquard Gucci GG Supreme Black Knit Polo",
    "slug": "ao-polo-gucci-gg-supreme-black",
    "brand": "Gucci",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 1010000,
    "originalPrice": 24500000,
    "discountPercentage": 96,
    "rating": 5,
    "reviewCount": 33,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Florence)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/gucci-gg-jacquard-polo-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Phối Họa Tiết GG",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Polo dệt kim jacquard phủ toàn bộ biểu tượng GG Supreme màu than chì trên nền đen nhánh, viền cổ dệt sọc thể thao kinh điển phong cách Gucci.",
    "material": "100% Cotton Ý dệt jacquard cao cấp.",
    "careInstructions": [
      "Giặt khô hoặc giặt tay nước mát"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-20",
    "name": "Áo Cardigan Cổ Chữ V Louis Vuitton Embroidered V-Neck Black",
    "slug": "ao-cardigan-louis-vuitton-vneck-black",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 850000,
    "originalPrice": 1040000,
    "discountPercentage": 18,
    "rating": 5,
    "reviewCount": 16,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-vneck-cardigan-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo khoác len cardigan cổ V đen tuyền với cúc sừng tự nhiên khắc laser chữ ký LV, thêu nổi hoa monogram tinh xảo ở góc áo.",
    "material": "85% Virgin Wool siêu mềm, 15% Silk tơ tằm.",
    "careInstructions": [
      "Chỉ giặt khô",
      "Gấp gọn bảo quản phẳng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-21",
    "name": "Áo Cardigan Cổ Bóng Chày Lacoste Emerald Baseball Cardigan",
    "slug": "ao-cardigan-lacoste-emerald-baseball",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 770000,
    "originalPrice": 6500000,
    "discountPercentage": 88,
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 13,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-baseball-cardigan-green.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Lục Bảo Emerald",
        "hex": "#2D5A27"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Phong cách Varsity Cardigan đậm chất học đường Pháp với sắc xanh lục bảo tươi mới, viền gấu và tay bo sọc kem tương phản.",
    "material": "100% Cotton dệt kim dầy dặn chống bai.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Phơi khô trên mặt phẳng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-22",
    "name": "Áo Polo Dệt Len Vặn Thừng Lacoste Heather Grey Cable Knit Polo",
    "slug": "ao-polo-len-van-thung-lacoste-grey",
    "brand": "Lacoste",
    "origin": "in_stock_ready",
    "originCountry": "Pháp",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 720000,
    "originalPrice": 5600000,
    "discountPercentage": 87,
    "rating": 4.9,
    "reviewCount": 44,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/lacoste-cable-knit-polo-grey.jpg"
    ],
    "colors": [
      {
        "name": "Xám Ghi Heather Grey",
        "hex": "#94A3B8"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Mẫu polo dệt len vặn thừng màu xám lông chuột sang trọng, mang lại cảm giác ấm áp và diện mạo chuẩn quý tộc phương Tây.",
    "material": "100% Wool Merino dệt sợi đôi giữ nhiệt tối ưu.",
    "careInstructions": [
      "Giặt tay nước mát",
      "Không vắt xoắn"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-23",
    "name": "Áo Khoác Len Kéo Khóa Polo Ralph Lauren Heather Grey Full-Zip Cardigan",
    "slug": "ao-khoac-len-ralph-lauren-fullzip-grey",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 990000,
    "originalPrice": 7600000,
    "discountPercentage": 87,
    "rating": 4.9,
    "reviewCount": 35,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-fullzip-cardigan-grey.jpg"
    ],
    "colors": [
      {
        "name": "Xám Ghi Heather",
        "hex": "#94A3B8"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Cardigan kéo khóa 2 chiều hoàn thiện bằng chất len Pima Cotton mềm mại đặc trưng nhà Ralph Lauren. Thêu kỵ mã Polo màu navy trên ngực.",
    "material": "100% Cotton Pima chải mịn.",
    "careInstructions": [
      "Giặt máy chế độ êm",
      "Ủi nhiệt độ trung bình"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-24",
    "name": "Áo Khoác Bomber Dệt Kim Dior Oblique Jacquard Black Bomber",
    "slug": "ao-khoac-bomber-dior-oblique-black",
    "brand": "Dior",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1690000,
    "originalPrice": 2030000,
    "discountPercentage": 17,
    "rating": 5,
    "reviewCount": 20,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/dior-oblique-bomber-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Jacquard Oblique",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Họa tiết Dior Oblique dệt ẩn chìm tone đen sắc nét trên chất liệu dệt kim dày dặn, phom dáng bomber thanh thoát và hiện đại.",
    "material": "Len Merino và lụa dệt jacquard cấu trúc hai lớp.",
    "careInstructions": [
      "Chỉ giặt khô chuyên dụng"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-25",
    "name": "Áo Len Cổ Khóa Polo Ralph Lauren Cornflower Blue Quarter-Zip Sweater",
    "slug": "ao-len-ralph-lauren-quarterzip-blue",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 570000,
    "originalPrice": 5200000,
    "discountPercentage": 89,
    "rating": 4.8,
    "reviewCount": 47,
    "inStock": true,
    "stockCount": 16,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-quarterzip-blue.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Hoa Bắp Cornflower Blue",
        "hex": "#60A5FA"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Sắc xanh hoa bắp tươi trẻ chuẩn mực phong cách Preppy Mỹ, cổ khóa kéo kéo cao giữ ấm cổ khi thời tiết se lạnh.",
    "material": "100% Combed Cotton mềm thoáng.",
    "careInstructions": [
      "Giặt máy nước mát",
      "Phơi bóng mát"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-26",
    "name": "Áo Polo Tay Dài Louis Vuitton Damier Collar Black Long Sleeve Polo",
    "slug": "ao-polo-louis-vuitton-damier-collar-black",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 390000,
    "originalPrice": 490000,
    "discountPercentage": 20,
    "rating": 5,
    "reviewCount": 27,
    "inStock": true,
    "stockCount": 5,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-polo-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Cổ Damier",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Polo tay dài đen sang trọng của Louis Vuitton với điểm nhấn dệt hoa văn bàn cờ Damier tinh xảo tại cổ áo và nẹp nút cúc xà cừ.",
    "material": "100% Pima Cotton dệt piqué mịn mượt.",
    "careInstructions": [
      "Giặt tay nước lạnh",
      "Ủi hơi nước nhẹ nhàng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-27",
    "name": "Áo Cardigan Cổ Tim Polo Ralph Lauren Camel Hair V-Neck Cardigan",
    "slug": "ao-cardigan-ralph-lauren-vneck-camel",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 770000,
    "originalPrice": 8100000,
    "discountPercentage": 90,
    "rating": 5,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 11,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-vneck-cardigan-camel.jpg"
    ],
    "colors": [
      {
        "name": "Vàng Cát Lạc Đà Camel",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Biểu tượng của phong cách thượng lưu Old Money New York. Gam màu vàng cát Camel thanh nhã, cúc sừng dệt rãnh và phom rủ mềm mại tuyệt đối.",
    "material": "Len lông lạc đà tự nhiên phối Cashmere cao cấp.",
    "careInstructions": [
      "Giặt khô hoặc giặt tay chuyên dụng cho len",
      "Phơi nằm ngang"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-28",
    "name": "Áo Polo Len Dệt Burberry Check Placket Espresso Knit Polo",
    "slug": "ao-polo-len-burberry-check-placket-espresso",
    "brand": "Burberry",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 1010000,
    "originalPrice": 20500000,
    "discountPercentage": 95,
    "rating": 4.9,
    "reviewCount": 23,
    "inStock": true,
    "stockCount": 7,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ London)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/burberry-knit-polo-espresso.jpg"
    ],
    "colors": [
      {
        "name": "Nâu Cà Phê Espresso",
        "hex": "#524E48"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chất len dệt mỏng màu nâu than cà phê Espresso, nẹp cổ giấu họa tiết kẻ sọc Burberry Vintage Check huyền thoại đậm chất Luân Đôn.",
    "material": "100% Fine Merino Wool nguyên chất.",
    "careInstructions": [
      "Giặt khô chuyên dụng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-29",
    "name": "Áo Khoác Bomber Cổ Nhung Gucci Harrington Cream Jacket",
    "slug": "ao-khoac-bomber-gucci-harrington-cream",
    "brand": "Gucci",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1930000,
    "originalPrice": 48000000,
    "discountPercentage": 96,
    "rating": 5,
    "reviewCount": 15,
    "inStock": true,
    "stockCount": 4,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Florence)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/gucci-harrington-bomber-cream.jpg"
    ],
    "colors": [
      {
        "name": "Kem Be Sữa Cổ Nâu",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Dáng áo Harrington cổ điển nước Ý với cổ lót nhung tăm Corduroy màu nâu sang trọng, lót lụa hoa văn GG bên trong vạt áo.",
    "material": "Cotton Gabardine kháng gió, cổ lót nhung tăm tơ tằm thượng hạng.",
    "careInstructions": [
      "Giặt khô chuyên dụng cao cấp"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-30",
    "name": "Áo Khoác Thể Thao Phối Màu Louis Vuitton Technical Monogram Windbreaker",
    "slug": "ao-khoac-the-thao-louis-vuitton-technical-windbreaker",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1810000,
    "originalPrice": 70000000,
    "discountPercentage": 97,
    "rating": 5,
    "reviewCount": 22,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-colorblock-jacket-white.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Phối Mảng Màu Monogram",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo khoác gió thể thao cao cấp từ vải kỹ thuật dập chìm họa tiết Monogram, thiết kế khối màu colorblock tương phản đầy năng động.",
    "material": "Vải dù kỹ thuật cao cấp chống nước nhẹ dệt jacquard.",
    "careInstructions": [
      "Giặt tay nhẹ nhàng",
      "Không sấy nhiệt"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-31",
    "name": "Áo Cardigan Kéo Khóa Burberry Vintage Check Jacquard Zip Cardigan",
    "slug": "ao-cardigan-burberry-vintage-check-camel",
    "brand": "Burberry",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-len",
    "price": 1090000,
    "originalPrice": 30000000,
    "discountPercentage": 96,
    "rating": 5,
    "reviewCount": 30,
    "inStock": true,
    "stockCount": 8,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ London)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/burberry-vintage-check-cardigan-camel.jpg"
    ],
    "colors": [
      {
        "name": "Kẻ Caro Vintage Check",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Dệt jacquard họa tiết kẻ ô kinh điển Vintage Check màu be lạc đà, kéo khóa 2 chiều hoàn thiện bằng da thuộc cao cấp.",
    "material": "100% Wool Merino dệt sợi đôi đanh mịn.",
    "careInstructions": [
      "Giặt khô",
      "Phơi nằm ngang"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-32",
    "name": "Áo Khoác Dệt Kim Louis Vuitton Starlight Galaxy Monogram Zip Cardigan",
    "slug": "ao-khoac-louis-vuitton-starlight-galaxy",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1570000,
    "originalPrice": 78000000,
    "discountPercentage": 98,
    "rating": 5,
    "reviewCount": 14,
    "inStock": true,
    "stockCount": 2,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-starlight-galaxy-cardigan.jpg"
    ],
    "colors": [
      {
        "name": "Dải Ngân Hà Galaxy Đen Bạc",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Họa tiết Starlight Monogram lấp lánh như bầu trời đêm dệt jacquard sợi kim tuyến tinh xảo bậc nhất của Louis Vuitton Paris.",
    "material": "Cashmere, Silk và sợi kim tuyến Lurex dệt jacquard.",
    "careInstructions": [
      "Chỉ giặt khô chuyên dụng cao cấp"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-33",
    "name": "Áo Cardigan Dệt Hiệp Sĩ Burberry EKD Full-Zip Black Knit Cardigan",
    "slug": "ao-cardigan-burberry-ekd-fullzip-black",
    "brand": "Burberry",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 930000,
    "originalPrice": 32000000,
    "discountPercentage": 97,
    "rating": 4.9,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ London)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/burberry-ekd-jacquard-cardigan-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Hiệp Sĩ EKD",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Biểu tượng hiệp sĩ cưỡi ngựa Equestrian Knight dệt chìm to bản sau lưng áo, len merino dệt hai lớp đanh chắc giữ ấm xuất sắc.",
    "material": "100% Fine Merino Wool.",
    "careInstructions": [
      "Giặt khô",
      "Ủi nhiệt độ thấp"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-34",
    "name": "Bộ Tracksuit Beckenbauer Tuyển Tây Ban Nha Adidas RFEF Full Set Navy",
    "slug": "bo-tracksuit-beckenbauer-tay-ban-nha-adidas-navy",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 700000,
    "originalPrice": 5900000,
    "discountPercentage": 88,
    "rating": 4.9,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 11,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ châu Âu)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-spain-tracksuit-flatlay.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Hải Quân RFEF",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Trọn bộ áo khoác và quần track pants tuyển Tây Ban Nha, phối sọc đỏ vàng rực rỡ mang hào khí xứ sở bò tót.",
    "material": "Vải dệt thể thao Beckenbauer Interlock dầy dặn cao cấp.",
    "careInstructions": [
      "Giặt máy nước mát",
      "Không ủi trực tiếp lên logo"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-35",
    "name": "Bộ Tracksuit Retro CLB Arsenal Adidas Originals Burgundy Tracksuit",
    "slug": "bo-tracksuit-retro-clb-arsenal-adidas-burgundy",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "LIMITED"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 650000,
    "originalPrice": 810000,
    "discountPercentage": 20,
    "rating": 5,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 9,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ London)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-arsenal-tracksuit-burgundy.jpg"
    ],
    "colors": [
      {
        "name": "Đỏ Mận Burgundy Arsenal",
        "hex": "#B83A3A"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Phiên bản hoài niệm màu đỏ mận của pháo thủ Arsenal với khẩu đại bác mạ vàng gold thêu sắc nét trên ngực và hông quần.",
    "material": "Chất vải thun thể thao mềm mịn cao cấp.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Phơi bóng râm"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-36",
    "name": "Bộ Tracksuit Beckenbauer Tuyển Đức Adidas DFB White/Black Retro Set",
    "slug": "bo-tracksuit-beckenbauer-tuyen-duc-adidas-white-black",
    "brand": "Adidas Originals",
    "origin": "in_stock_ready",
    "originCountry": "Đức",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 900000,
    "originalPrice": 5900000,
    "discountPercentage": 85,
    "rating": 5,
    "reviewCount": 49,
    "inStock": true,
    "stockCount": 16,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/adidas-germany-tracksuit-white-black.jpg"
    ],
    "colors": [
      {
        "name": "Trắng Ngà Phối Đen DFB",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Tượng đài bất tử của dòng Beckenbauer Tracksuit với màu trắng ngà phối đen tuyền, 4 ngôi sao World Cup thêu sắc sảo.",
    "material": "52% Cotton, 48% Recycled Polyester dệt interlock dày dặn đứng phom.",
    "careInstructions": [
      "Giặt máy chế độ nhẹ",
      "Ủi nhiệt độ thấp"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-37",
    "name": "Bộ Tracksuit CLB Manchester United Adidas Originals Forest Green Set",
    "slug": "bo-tracksuit-clb-manchester-united-adidas-green",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "LIMITED"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 850000,
    "originalPrice": 1060000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 8,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Manchester)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-manchester-united-tracksuit-green.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Rừng Forest Green",
        "hex": "#2D5A27"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Tông xanh rêu Forest Green tôn vinh nguồn cội Newton Heath của Quỷ Đỏ, logo retro cổ điển dập nổi ấn tượng.",
    "material": "Vải thun thể thao co giãn thoải mái.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Không dùng thuốc tẩy"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-38",
    "name": "Bộ Tracksuit CLB Juventus Adidas Originals All-Black Tracksuit Set",
    "slug": "bo-tracksuit-clb-juventus-adidas-allblack",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 800000,
    "originalPrice": 5500000,
    "discountPercentage": 85,
    "rating": 4.8,
    "reviewCount": 30,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Turin)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-juventus-tracksuit-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Tuyền All-Black",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Vẻ đẹp tối giản đầy quyền lực của Bà Đầm Già Juventus thành Turin với sắc đen tuyền chủ đạo và đường 3 sọc thanh lịch.",
    "material": "Chất vải thun thể thao cao cấp mềm mịn.",
    "careInstructions": [
      "Giặt nước lạnh",
      "Phơi nơi râm mát"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-39",
    "name": "Bộ Tracksuit Sân Khách Tuyển Đức Adidas DFB Retro Mint Green Set",
    "slug": "bo-tracksuit-san-khach-tuyen-duc-adidas-mint",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 750000,
    "originalPrice": 940000,
    "discountPercentage": 20,
    "rating": 5,
    "reviewCount": 35,
    "inStock": true,
    "stockCount": 7,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Đức)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-germany-away-tracksuit-mint.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Bạc Hà Mint Green",
        "hex": "#9CA3AF"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Sắc xanh bạc hà Mint Green thanh lịch tái hiện áo đấu sân khách vô địch Euro 96 huyền thoại của cỗ xe tăng Đức.",
    "material": "Vải thể thao interlock cao cấp.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Ủi nhiệt độ thấp"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-40",
    "name": "Bộ Tracksuit 3 Sao Tuyển Argentina Adidas AFA 3-Stars Navy Tracksuit",
    "slug": "bo-tracksuit-3-sao-tuyen-argentina-adidas-navy",
    "brand": "Adidas Originals",
    "origin": "in_stock_ready",
    "originCountry": "Đức",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 850000,
    "originalPrice": 1060000,
    "discountPercentage": 20,
    "rating": 5,
    "reviewCount": 52,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/adidas-argentina-tracksuit-navy.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Hải Quân Argentina",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Phiên bản kỷ niệm 3 ngôi sao vô địch thế giới của La Albiceleste, huy hiệu vàng AFA và biểu tượng Mặt Trời Tháng Năm Sol de Mayo kiêu hãnh.",
    "material": "Chất vải dệt thể thao cao cấp đanh mịn.",
    "careInstructions": [
      "Giặt máy nước lạnh",
      "Không ủi trực tiếp lên họa tiết"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-41",
    "name": "Bộ Tracksuit Retro Noel Gallagher Oasis Adidas Sky Blue Tracksuit",
    "slug": "bo-tracksuit-oasis-adidas-skyblue",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "LIMITED"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 800000,
    "originalPrice": 5800000,
    "discountPercentage": 86,
    "rating": 4.9,
    "reviewCount": 29,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Anh Quốc)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/adidas-oasis-tracksuit-skyblue.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Da Trời Sky Blue",
        "hex": "#60A5FA"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Màu xanh Sky Blue biểu tượng của trào lưu Britpop thập niên 90 gắn liền với hai anh em Gallagher ban nhạc huyền thoại Oasis.",
    "material": "Chất vải dệt thể thao phong cách vintage dầy dặn.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Phơi khô tự nhiên"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-42",
    "name": "Bộ Tracksuit Thi Đấu CLB Paris Saint-Germain Nike PSG Strike Dri-FIT Set",
    "slug": "bo-tracksuit-psg-nike-strike-navy",
    "brand": "Nike",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 750000,
    "originalPrice": 940000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 34,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/nike-psg-strike-tracksuit-navy.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Đen Midnight Navy",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Đồng phục thi đấu công nghệ cao của câu lạc bộ nhà giàu Paris Saint-Germain với công nghệ thoát ẩm Dri-FIT ADV và huy hiệu PSG kim loại nổi bật.",
    "material": "Nike Dri-FIT ADV siêu co giãn bốn chiều.",
    "careInstructions": [
      "Giặt máy nước mát",
      "Không dùng chất làm mềm vải"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-43",
    "name": "Quần Jeans Nam Dáng Suông Mài Vintage Luxury Washed Denim Trousers",
    "slug": "quan-jeans-nam-dang-suong-luxury-washed-denim",
    "brand": "Chrome Hearts",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "quan",
    "price": 500000,
    "originalPrice": 32000000,
    "discountPercentage": 98,
    "rating": 5,
    "reviewCount": 21,
    "inStock": true,
    "stockCount": 4,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Los Angeles)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/luxury-washed-denim-jeans.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Denim Mài Vintage",
        "hex": "#60A5FA"
      }
    ],
    "sizes": [
      "29",
      "30",
      "31",
      "32",
      "34"
    ],
    "description": "Chất liệu vải denim dệt biên Selvedge Nhật Bản dày 14oz mài sờn thủ công từng đường nét, đinh tán và nút cài chạm khắc hoa văn hoa chữ thập bằng bạc .925 nguyên chất.",
    "material": "100% Selvedge Cotton Denim Nhật Bản.",
    "careInstructions": [
      "Lộn trái giặt nước lạnh",
      "Không giặt sấy nhiệt cao"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-44",
    "name": "Áo Cardigan Cổ Kimono Dệt Hoa Louis Vuitton Monogram Flower Kimono",
    "slug": "ao-cardigan-louis-vuitton-monogram-flower-kimono",
    "brand": "Louis Vuitton",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM",
      "LIMITED"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1170000,
    "originalPrice": 1430000,
    "discountPercentage": 18,
    "rating": 5,
    "reviewCount": 15,
    "inStock": true,
    "stockCount": 3,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Paris)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/louis-vuitton-kimono-cardigan-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Họa Tiết Monogram Vàng Kem",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế vạt chéo lấy cảm hứng từ áo Kimono truyền thống kết hợp hoa bốn cánh Monogram kinh điển của Pháp. Sự giao thoa hoàn mỹ giữa văn hóa Á Đông và Haute Horlogerie Paris.",
    "material": "80% Cashmere nguyên chất, 20% Lụa Mulberry.",
    "careInstructions": [
      "Chỉ giặt khô chuyên dụng cao cấp"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-45",
    "name": "Áo Khoác Dệt Kim Cashmere Loro Piana Ribbed Zip Knit Bomber Black",
    "slug": "ao-khoac-cashmere-loro-piana-ribbed-zip-black",
    "brand": "Loro Piana",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-khoac",
    "price": 1690000,
    "originalPrice": 82000000,
    "discountPercentage": 98,
    "rating": 5,
    "reviewCount": 18,
    "inStock": true,
    "stockCount": 2,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Milan)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/loro-piana-zip-knit-bomber-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Tuyệt Đối Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "48 (M)",
      "50 (L)",
      "52 (XL)"
    ],
    "description": "Tuyệt tác của khái niệm Quiet Luxury. Chế tác từ 100% Cashmere tơ mềm mại thu hoạch thủ công tại thảo nguyên Mông Cổ, khóa kéo hai chiều mạ palladium sang trọng.",
    "material": "100% Cashmere thượng hạng tuyển chọn.",
    "careInstructions": [
      "Giặt khô chuyên dụng đặc biệt"
    ],
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-46",
    "name": "Áo Sơ Mi Oxford Dài Tay Polo Ralph Lauren Slim Fit Khaki Beige Shirt",
    "slug": "ao-so-mi-ralph-lauren-slimfit-khaki",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 550000,
    "originalPrice": 690000,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-oxford-shirt-khaki.jpg"
    ],
    "colors": [
      {
        "name": "Be Khaki Ấm Áp",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Áo sơ mi Oxford cúc cài button-down màu be Khaki nhã nhặn, tôn da và cực kỳ dễ phối cùng quần âu xám hoặc jeans xanh.",
    "material": "100% Cotton Oxford dệt tổ ong thoáng khí.",
    "careInstructions": [
      "Giặt máy ở 40 độ C",
      "Ủi phẳng khi còn ẩm"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-47",
    "name": "Áo Sơ Mi Oxford Dài Tay Polo Ralph Lauren Slim Fit Deep Navy Shirt",
    "slug": "ao-so-mi-ralph-lauren-slimfit-navy",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 510000,
    "originalPrice": 3700000,
    "discountPercentage": 86,
    "rating": 4.9,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-oxford-shirt-navy.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Navy Đậm",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Gam màu xanh navy đậm Deep Navy quyền lực và nam tính. Logo kỵ mã Polo thêu màu đỏ tương phản nổi bật.",
    "material": "100% Cotton Oxford cao cấp.",
    "careInstructions": [
      "Giặt máy với đồ cùng màu",
      "Ủi ở nhiệt độ cotton"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-48",
    "name": "Áo Sơ Mi Oxford Dài Tay Polo Ralph Lauren Slim Fit Noir Black Shirt",
    "slug": "ao-so-mi-ralph-lauren-slimfit-black",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 470000,
    "originalPrice": 590000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-oxford-shirt-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Tuyệt Đối Noir",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Màu đen huyền bí tạo nét nam tính đĩnh đạc, chất vải cotton Oxford mềm dày bền bỉ theo thời gian.",
    "material": "100% Cotton Oxford nguyên bản.",
    "careInstructions": [
      "Giặt máy ở 30 độ C",
      "Không dùng nước tẩy clo"
    ],
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false,
    "isSale": true
  },
  {
    "id": "mau-49",
    "name": "Áo Sơ Mi Oxford Dài Tay Polo Ralph Lauren Slim Fit Light Blue Shirt",
    "slug": "ao-so-mi-ralph-lauren-slimfit-lightblue",
    "brand": "Polo Ralph Lauren",
    "origin": "in_stock_ready",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "HÀNG CÓ SẴN",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 430000,
    "originalPrice": 3700000,
    "discountPercentage": 88,
    "rating": 5,
    "reviewCount": 56,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành) hoặc 1-2 ngày toàn quốc",
    "depositRequired": false,
    "depositPercentage": 0,
    "images": [
      "/images/products/ralph-lauren-oxford-shirt-blue.jpg"
    ],
    "colors": [
      {
        "name": "Xanh Da Trời Nhạt Light Blue",
        "hex": "#60A5FA"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Mẫu áo sơ mi quốc dân của mọi quý ông công sở và sự kiện lịch lãm. Gam màu xanh baby light blue thanh thoát, dễ chịu.",
    "material": "100% Oxford Cotton cao cấp.",
    "careInstructions": [
      "Giặt máy ở 40 độ C",
      "Ủi hơi nước phẳng phiu"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "mau-50",
    "name": "Áo Polo Thêu Ong Cổ Kẻ Sọc Gucci Web Collar Bee Embroidered Black Polo",
    "slug": "ao-polo-gucci-web-collar-bee-black",
    "brand": "Gucci",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 510000,
    "originalPrice": 22000000,
    "discountPercentage": 98,
    "rating": 5,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 6,
    "estimatedDelivery": "Dự kiến 8-12 ngày (Bay Air từ Florence)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "/images/products/gucci-web-bee-polo-black.jpg"
    ],
    "colors": [
      {
        "name": "Đen Cổ Sọc Xanh Đỏ Web",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chiếc polo đen lịch lãm của Gucci với cổ dệt sọc Web xanh đỏ đặc trưng, đính hình con ong Bee thêu chỉ ánh kim metallic tinh xảo.",
    "material": "100% Cotton Piqué Ý mềm mát.",
    "careInstructions": [
      "Giặt khô hoặc giặt tay nước mát nhẹ nhàng"
    ],
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-vay-01",
    "name": "Đầm Lụa Satin Cổ Yếm Dáng Dài Thướt Tha The Aurelia Maxi Dress",
    "slug": "dam-lua-satin-co-yem-the-aurelia-maxi-dress",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 980000,
    "originalPrice": 1250000,
    "discountPercentage": 22,
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Giao nhanh 2-3 ngày toàn quốc",
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Vàng Champagne",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Tuyển",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Chất liệu lụa satin tơ tằm dệt bóng mờ sang trọng, thiết kế cổ yếm khoét lưng quyến rũ cho các buổi tiệc tối và dạ hội cao cấp.",
    "material": "100% Silk Satin Tơ Tằm Bảo Lộc",
    "careInstructions": [
      "Giặt khô hoặc giặt hấp chuyên dụng",
      "Ủi ở nhiệt độ thấp mặt trái"
    ],
    "featured": true,
    "isNewArrival": true,
    "isSale": true
  },
  {
    "id": "nu-vay-02",
    "name": "Váy Midi Cúp Ngực Phối Ren Thêu Tinh Xảo Corset Lace Midi Dress",
    "slug": "vay-midi-cup-nguc-phoi-ren-corset-lace-midi-dress",
    "brand": "LSEOUL",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "LIMITED"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 890000,
    "originalPrice": 1100000,
    "discountPercentage": 19,
    "rating": 4.8,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Giao nhanh 24-48h",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Ngà Ivory",
        "hex": "#FAF8F3"
      },
      {
        "name": "Hồng Pastel",
        "hex": "#FAD2E1"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế dáng cúp ngực nâng form kết hợp ren hoa thêu tay điệu đà, phù hợp cho sự kiện, tiệc cưới và hẹn hò lãng mạn.",
    "material": "Ren Cotton cao cấp lót lụa tơ sống",
    "careInstructions": [
      "Giặt tay nhẹ nhàng bằng dầu gội hoặc sữa tắm",
      "Không vắt xoắn"
    ],
    "featured": true,
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-vay-03",
    "name": "Đầm Lụa Xếp Ly Dáng Xòe Nghệ Thuật The Pleated Silk Evening Gown",
    "slug": "dam-lua-xep-ly-dang-xoe-the-pleated-silk-evening-gown",
    "brand": "Subtle Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 1150000,
    "originalPrice": 1450000,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewCount": 29,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Hỏa tốc 2-4h (Nội thành HCM/HN)",
    "images": [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Emerald",
        "hex": "#0F5132"
      },
      {
        "name": "Đỏ Ruby",
        "hex": "#842029"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M"
    ],
    "description": "Kỹ thuật dập ly thủ công tạo hiệu ứng chuyển động gợn sóng mềm mại theo từng bước chân. Đẳng cấp thẩm mỹ Quiet Luxury đương đại.",
    "material": "Lụa Organza cao cấp dập ly",
    "careInstructions": [
      "Giặt khô bảo vệ cấu trúc ly",
      "Bảo quản bằng móc treo chuyên dụng"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nu-vay-04",
    "name": "Đầm Bodycon Cắt Xẻ Cut-Out Táo Bạo Noir Seduction Dress",
    "slug": "dam-bodycon-cut-out-noir-seduction-dress",
    "brand": "LSEOUL",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 750000,
    "originalPrice": 950000,
    "discountPercentage": 21,
    "rating": 4.7,
    "reviewCount": 56,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Giao hàng 2-3 ngày",
    "images": [
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Quyền Lực",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M"
    ],
    "description": "Form ôm body tôn trọn đường cong cơ thể với đường cắt xẻ hông tinh tế, chất vải thun nhung co giãn đàn hồi cao cấp.",
    "material": "Vải nhung tuyết co giãn 4 chiều",
    "careInstructions": [
      "Giặt máy chế độ nhẹ trong túi giặt"
    ],
    "isSale": true
  },
  {
    "id": "nu-vay-05",
    "name": "Váy Sơ Mi Thắt Đai Eo Tối Giản Belted Linen Shirtdress",
    "slug": "vay-so-mi-that-dai-eo-belted-linen-shirtdress",
    "brand": "Nosbyn Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 680000,
    "rating": 4.8,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Hàng có sẵn - Giao ngay",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Sữa",
        "hex": "#FAF8F3"
      },
      {
        "name": "Xanh Navy",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế sơ mi thanh lịch cho nàng công sở hiện đại, kèm đai thắt eo tạo tỷ lệ cơ thể hoàn hảo và sự chỉn chu tuyệt đối.",
    "material": "100% Organic Linen dệt thoáng khí",
    "careInstructions": [
      "Giặt nước lạnh",
      "Ủi khi vải còn hơi ẩm"
    ],
    "isNewArrival": true
  },
  {
    "id": "nu-vay-06",
    "name": "Váy Hoa Nhí Vintage Phối Ren Cổ Vuông French Romantic Dress",
    "slug": "vay-hoa-nhi-french-romantic-dress",
    "brand": "Dottie",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "vay-dam",
    "price": 490000,
    "originalPrice": 650000,
    "discountPercentage": 25,
    "rating": 4.8,
    "reviewCount": 68,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Hàng có sẵn - Giao 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Hoa Nhí Vàng",
        "hex": "#E5A93C"
      },
      {
        "name": "Hoa Nhí Xanh",
        "hex": "#94A3B8"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Họa tiết hoa nhí phong cách đồng quê Pháp nhẹ nhàng, tay phồng bo chun đáng yêu cùng cổ vuông khoe trọn xương quai xanh.",
    "material": "Vải Chiffon tơ mềm mại thoáng mát",
    "careInstructions": [
      "Giặt máy nhẹ",
      "Không phơi trực tiếp dưới nắng gắt"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-khoac-01",
    "name": "Áo Khoác Dạ Tweed Tiểu Thư Viền Kim Tuyến Parisian Tweed Jacket",
    "slug": "ao-khoac-da-tweed-parisian-tweed-jacket",
    "brand": "Chanel",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 1350000,
    "originalPrice": 1750000,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewCount": 47,
    "inStock": true,
    "stockCount": 14,
    "estimatedDelivery": "Dự kiến 7-10 ngày (Order Pháp)",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Phối Trắng",
        "hex": "#171613"
      },
      {
        "name": "Kem Vanilla",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Biểu tượng kinh điển của nhà mốt Paris với kỹ thuật dệt sợi Tweed đan xen ánh kim sa lấp lánh và hàng cúc kim loại mạ vàng chạm khắc.",
    "material": "Dạ Tweed len dệt thủ công lót lụa Camisole",
    "careInstructions": [
      "Giặt khô cao cấp",
      "Ủi hơi nước đứng"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nu-khoac-02",
    "name": "Áo Trench Coat Dáng Dài Thắt Đai Cổ Điển Heritage Trench Coat",
    "slug": "ao-trench-coat-dang-dai-heritage-trench-coat",
    "brand": "Burberry",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 1650000,
    "originalPrice": 2100000,
    "discountPercentage": 21,
    "rating": 5,
    "reviewCount": 36,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Order 7-12 ngày trực tiếp từ London",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Kaki Be Honey",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Jet Black",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Chất vải Gabardine trượt nước bền bỉ, lót họa tiết kẻ ca-rô Vintage Check hoàng gia Anh Quốc. Phom dáng dài sang trọng bất chấp thời tiết.",
    "material": "100% Cotton Gabardine chống thấm nước",
    "careInstructions": [
      "Giặt khô chuyên dụng"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nu-khoac-03",
    "name": "Blazer May Đo Phom Hộp Minimalist Structured Tailored Blazer",
    "slug": "blazer-may-do-phom-hop-minimalist-blazer",
    "brand": "Subtle Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 950000,
    "rating": 4.8,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 22,
    "estimatedDelivery": "Hàng có sẵn - Giao 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xám Than Chì",
        "hex": "#334155"
      },
      {
        "name": "Nâu Mocha",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Đường cắt may tối giản với cầu vai độn định hình cấu trúc sắc nét. Dễ dàng phối cùng quần tây hoặc chân váy lụa cho vẻ ngoài quyền lực.",
    "material": "Len pha Viscose cao cấp đứng phom",
    "careInstructions": [
      "Giặt khô hoặc giặt tay nhẹ"
    ],
    "isNewArrival": true
  },
  {
    "id": "nu-khoac-04",
    "name": "Áo Khoác Dạ Ép Lông Cừu Phom Ngắn Cropped Wool Coat",
    "slug": "ao-khoac-da-ep-long-cuu-cropped-wool-coat",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-khoac",
    "price": 1190000,
    "originalPrice": 1550000,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewCount": 33,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Giao nhanh toàn quốc 2-3 ngày",
    "images": [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Lạc Đà Camel",
        "hex": "#C78238"
      },
      {
        "name": "Kem Yến Mạch",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M"
    ],
    "description": "Chất liệu dạ ép hai mặt từ lông cừu nguyên chất siêu nhẹ nhưng giữ ấm tuyệt vời. Phom dáng lửng trẻ trung hack dáng chân dài.",
    "material": "90% Wool Lông Cừu, 10% Cashmere",
    "careInstructions": [
      "Giặt khô chuyên dụng lông thú"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-len-01",
    "name": "Áo Len Cổ Lọ Dệt Vặn Thừng Cashmere Cable-Knit Turtleneck",
    "slug": "ao-len-co-lo-det-van-thung-cashmere-turtleneck",
    "brand": "COS",
    "origin": "international_order",
    "originCountry": "Vương quốc Anh",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nu",
    "subCategory": "ao-len",
    "price": 650000,
    "originalPrice": 850000,
    "discountPercentage": 24,
    "rating": 4.8,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Giao nhanh 3-5 ngày",
    "images": [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Kem Bơ",
        "hex": "#FAF8F3"
      },
      {
        "name": "Xanh Rêu Olive",
        "hex": "#4B5563"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Chất len mềm mịn không dính dặm, họa tiết dệt vặn thừng kinh điển đem lại hơi thở ấm áp chuẩn phong cách Nordic Thu Đông.",
    "material": "Len Merino pha Cashmere hữu cơ",
    "careInstructions": [
      "Giặt tay bằng nước lạnh",
      "Phơi nằm ngang trên mặt phẳng"
    ],
    "isSale": true
  },
  {
    "id": "nu-len-02",
    "name": "Cardigan Dệt Kim Cúc Xà Cừ Artisanal Pearl Button Cardigan",
    "slug": "cardigan-det-kim-cuc-xa-cu-pearl-cardigan",
    "brand": "Dottie",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "ao-len",
    "price": 450000,
    "originalPrice": 580000,
    "discountPercentage": 22,
    "rating": 4.7,
    "reviewCount": 52,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Giao hàng 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Hồng Phấn Mơ",
        "hex": "#FAD2E1"
      },
      {
        "name": "Be Khói",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Sợi len lông thỏ nhân tạo mềm mại bồng bềnh như mây, điểm xuyết dàn cúc ngọc trai xà cừ óng ánh tinh xảo.",
    "material": "Len sợi lông mềm mại cao cấp",
    "careInstructions": [
      "Giặt tay nhẹ nhàng",
      "Tránh vắt xoắn"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-len-03",
    "name": "Áo Sweater Dệt Kim Cổ Chữ V Oversize Relaxed V-Neck Knit",
    "slug": "ao-sweater-det-kim-co-v-oversize",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nu",
    "subCategory": "ao-len",
    "price": 520000,
    "rating": 4.8,
    "reviewCount": 34,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Order 5-7 ngày",
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Ghi Xám Nhạt",
        "hex": "#CBD5E1"
      },
      {
        "name": "Nâu Cà Phê",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Phom dáng thụng lười biếng phóng khoáng, cổ chữ V gợi cảm giúp thon gọn gương mặt và dễ dàng layering với áo sơ mi bên trong.",
    "material": "Sợi Cotton Dệt Kim hỗn hợp len",
    "careInstructions": [
      "Giặt máy chế độ len nhẹ"
    ],
    "isNewArrival": true
  },
  {
    "id": "nu-len-04",
    "name": "Áo Cardigan Họa Tiết Quả Trám Vintage Argyle Knit Cardigan",
    "slug": "ao-cardigan-hoa-tiet-qua-tram-argyle-cardigan",
    "brand": "Mango",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "nu",
    "subCategory": "ao-len",
    "price": 580000,
    "originalPrice": 750000,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Giao nhanh 3-5 ngày",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Xanh Vintage",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "S",
      "M"
    ],
    "description": "Họa tiết quả trám cổ điển đậm chất nữ sinh đại học Anh Quốc, mang đến nét hoài niệm và thanh lịch cho ngày se lạnh.",
    "material": "Len sợi hữu cơ dệt mật độ cao",
    "careInstructions": [
      "Giặt tay nước lạnh"
    ],
    "isSale": true
  },
  {
    "id": "nu-somi-01",
    "name": "Áo Sơ Mi Lụa Tơ Tằm Cổ Bèo Thắt Nơ Tie-Neck Silk Blouse",
    "slug": "ao-so-mi-lua-to-tam-co-beo-that-no-silk-blouse",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "ao-thun",
    "price": 690000,
    "originalPrice": 890000,
    "discountPercentage": 22,
    "rating": 4.9,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 16,
    "estimatedDelivery": "Giao nhanh 24-48h",
    "images": [
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Ngọc Trai",
        "hex": "#FAF8F3"
      },
      {
        "name": "Xanh Pastel",
        "hex": "#93C5FD"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Thiết kế dải nơ dài duyên dáng thả rơi trước ngực, tay áo xếp ly nhẹ nhàng khẳng định phong cách quý cô tri thức.",
    "material": "100% Lụa Habotai cao cấp",
    "careInstructions": [
      "Ủi mặt trái ở nhiệt độ thấp"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nu-somi-02",
    "name": "Áo Blouse Ren Tay Bồng Tiểu Thư Victorian Lace Blouse",
    "slug": "ao-blouse-ren-tay-bong-victorian-lace-blouse",
    "brand": "Dottie",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "ao-thun",
    "price": 420000,
    "originalPrice": 550000,
    "discountPercentage": 24,
    "rating": 4.8,
    "reviewCount": 63,
    "inStock": true,
    "stockCount": 35,
    "estimatedDelivery": "Hàng có sẵn - Giao 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Tinh Khôi",
        "hex": "#FFFFFF"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Chất ren thêu họa tiết hoa nổi 3D, cổ áo đính ngọc trai tinh tế và tay áo phồng xếp ly mang hơi thở quý tộc châu Âu.",
    "material": "Ren Cotton mềm lót vải thun lụa mát",
    "careInstructions": [
      "Giặt tay nhẹ trong nước lạnh"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-somi-03",
    "name": "Áo Thun Gân Ôm Body Cổ Vuông Tôn Dáng Ribbed Square-Neck Tee",
    "slug": "ao-thun-gan-om-body-co-vuong-ribbed-square-neck-tee",
    "brand": "Routine",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "ao-thun",
    "price": 290000,
    "rating": 4.7,
    "reviewCount": 88,
    "inStock": true,
    "stockCount": 50,
    "estimatedDelivery": "Giao ngay trong 24h",
    "images": [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Basic",
        "hex": "#171613"
      },
      {
        "name": "Nâu Cacao",
        "hex": "#8A7158"
      },
      {
        "name": "Trắng Bơ",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Vải cotton tăm co giãn 4 chiều ôm sát tôn eo thon, thiết kế cổ vuông hiện đại khoe trọn xương quai xanh quyến rũ.",
    "material": "95% Cotton Spandex cao cấp",
    "careInstructions": [
      "Giặt máy bình thường"
    ],
    "isNewArrival": true
  },
  {
    "id": "nu-quan-01",
    "name": "Quần Âu Nữ Cạp Cao Xếp Ly Ống Suông High-Waisted Pleated Trousers",
    "slug": "quan-au-nu-cap-cao-xep-ly-high-waisted-pleated-trousers",
    "brand": "Nosbyn Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nu",
    "subCategory": "quan",
    "price": 590000,
    "originalPrice": 750000,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewCount": 54,
    "inStock": true,
    "stockCount": 28,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Be Cát Sáng",
        "hex": "#E8D7BD"
      },
      {
        "name": "Đen Tuyển",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Phom dáng suông rộng thời thượng tạo hiệu ứng kéo dài chân, chi tiết xếp ly đôi trước bụng giúp che khuyết điểm khéo léo.",
    "material": "Vải Tuyết Mưa dệt mật độ cao chống nhăn",
    "careInstructions": [
      "Giặt máy ở chế độ nhẹ"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nu-quan-02",
    "name": "Chân Váy Lụa Satin Dáng Dài Xẻ Tà Midi Silk Slip Skirt",
    "slug": "chan-vay-lua-satin-dang-dai-midi-silk-slip-skirt",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND"
    ],
    "category": "nu",
    "subCategory": "quan",
    "price": 520000,
    "originalPrice": 680000,
    "discountPercentage": 24,
    "rating": 4.8,
    "reviewCount": 46,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Giao hàng 2-3 ngày",
    "images": [
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Rêu Bạc",
        "hex": "#64748B"
      },
      {
        "name": "Champagne Ánh Kim",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "description": "Chất vải lụa tơ bóng bẩy chuyển màu theo góc sáng, độ rủ tuyệt đối ôm nhẹ hông và xòe nhẹ đuôi cá uyển chuyển.",
    "material": "Lụa Satin dệt sợi mịn chống xước",
    "careInstructions": [
      "Ủi nhiệt độ thấp mặt trong"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "nu-quan-03",
    "name": "Quần Jeans Ống Suông Rộng Cạp Cao Vintage Wash Denim Trousers",
    "slug": "quan-jeans-ong-suong-vintage-wash-denim",
    "brand": "Routine",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "nu",
    "subCategory": "quan",
    "price": 490000,
    "rating": 4.8,
    "reviewCount": 72,
    "inStock": true,
    "stockCount": 40,
    "estimatedDelivery": "Hàng có sẵn - Giao 24h",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Denim Nhạt",
        "hex": "#60A5FA"
      },
      {
        "name": "Xanh Indigo Cổ Điển",
        "hex": "#1E3A8A"
      }
    ],
    "sizes": [
      "26",
      "27",
      "28",
      "29",
      "30"
    ],
    "description": "Chất liệu Denim 100% cotton dệt chéo dày dặn chuẩn form, kỹ thuật mài wash màu loang vintage thời thượng tôn vòng 3.",
    "material": "100% Heavyweight Cotton Denim",
    "careInstructions": [
      "Giặt lộn trái, tránh ngâm chất tẩy"
    ],
    "isNewArrival": true
  },
  {
    "id": "treem-gai-01",
    "name": "Váy Xòe Công Chúa Bèo Nhún Phối Ren Thêu Little Rose Princess Dress",
    "slug": "vay-xoe-cong-chua-beo-nhun-little-rose-princess-dress",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "tre-em",
    "subCategory": "be-gai",
    "price": 360000,
    "originalPrice": 480000,
    "discountPercentage": 25,
    "rating": 4.9,
    "reviewCount": 27,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Order 5-7 ngày",
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Hồng Phấn Pastel",
        "hex": "#FAD2E1"
      },
      {
        "name": "Trắng Tinh",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "90 (1-2T)",
      "100 (2-3T)",
      "110 (3-4T)",
      "120 (5-6T)"
    ],
    "description": "Chất liệu voan lưới mềm lót 100% cotton kháng khuẩn bảo vệ làn da non nớt của bé, tầng váy phồng bồng bềnh công chúa.",
    "material": "Lớp ngoài Voan lưới mỏng nhẹ, lót 100% Organic Cotton",
    "careInstructions": [
      "Giặt tay nhẹ nhàng trong túi giặt"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "treem-gai-02",
    "name": "Set Váy Yếm Kẻ Ca Rô Kèm Áo Tiểu Thư Tay Phồng Bé Gái",
    "slug": "set-vay-yem-ke-ca-ro-ao-tay-phong-be-gai",
    "brand": "Uniqlo",
    "origin": "international_order",
    "originCountry": "Nhật Bản",
    "badges": [
      "ORDER QUỐC TẾ",
      "HÀNG CÓ SẴN"
    ],
    "category": "tre-em",
    "subCategory": "be-gai",
    "price": 320000,
    "originalPrice": 420000,
    "discountPercentage": 24,
    "rating": 4.8,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Hàng có sẵn - Giao 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Ca Rô Nâu Vintage",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "90",
      "100",
      "110",
      "120",
      "130"
    ],
    "description": "Set đồ phối hoàn hảo gồm áo sơ mi cổ bèo tiểu thư và váy yếm dạ len ca rô xinh xắn cho bé dạo phố hay đi tiệc cùng ba mẹ.",
    "material": "Vải dạ len pha cotton không kích ứng",
    "careInstructions": [
      "Giặt máy nước ấm"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "treem-gai-03",
    "name": "Váy Đầm Dệt Kim Xòe Tầng Cotton Hữu Cơ Bé Gái Soft Organic Knit",
    "slug": "vay-dam-det-kim-cotton-huu-co-be-gai",
    "brand": "Mango",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "tre-em",
    "subCategory": "be-gai",
    "price": 290000,
    "rating": 4.7,
    "reviewCount": 21,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Giao nhanh 3-4 ngày",
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Vàng Mù Tạt",
        "hex": "#E5A93C"
      },
      {
        "name": "Cam Đất",
        "hex": "#EA580C"
      }
    ],
    "sizes": [
      "100",
      "110",
      "120",
      "130"
    ],
    "description": "Sợi len cotton tự nhiên dệt mịn, độ co giãn thoải mái cho bé thỏa sức nô đùa hoạt động cả ngày dài.",
    "material": "100% Certified Organic Cotton",
    "careInstructions": [
      "Giặt máy chế độ nhẹ"
    ],
    "isNewArrival": true
  },
  {
    "id": "treem-trai-01",
    "name": "Set Đồ Vest Công Tử Bé Trai Lịch Lãm Kèm Nơ Cổ Gentleman Suit Set",
    "slug": "set-do-vest-cong-tu-be-trai-gentleman-suit",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "tre-em",
    "subCategory": "be-trai",
    "price": 450000,
    "originalPrice": 590000,
    "discountPercentage": 24,
    "rating": 4.9,
    "reviewCount": 32,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Order 5-7 ngày",
    "images": [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Navy Hoàng Gia",
        "hex": "#1E293B"
      },
      {
        "name": "Ghi Xám Lịch Lãm",
        "hex": "#64748B"
      }
    ],
    "sizes": [
      "90",
      "100",
      "110",
      "120",
      "130"
    ],
    "description": "Gồm áo vest form chuẩn, quần âu lưng thun co giãn thoải mái và nơ cổ bảnh bao, hoàn hảo cho bé chụp hình thôi nôi và dự tiệc.",
    "material": "Vải Kaki Tuyết Mưa pha Cotton cao cấp mềm êm",
    "careInstructions": [
      "Giặt khô hoặc giặt tay"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "treem-trai-02",
    "name": "Set Áo Polo & Quần Short Năng Động Bé Trai Summer Sporty Set",
    "slug": "set-ao-polo-quan-short-be-trai-summer-sporty",
    "brand": "Uniqlo",
    "origin": "international_order",
    "originCountry": "Nhật Bản",
    "badges": [
      "ORDER QUỐC TẾ",
      "HÀNG CÓ SẴN"
    ],
    "category": "tre-em",
    "subCategory": "be-trai",
    "price": 280000,
    "rating": 4.8,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Giao ngay 24h",
    "images": [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Phối Xanh Dương",
        "hex": "#3B82F6"
      },
      {
        "name": "Vàng Kem Phối Ghi",
        "hex": "#FDE047"
      }
    ],
    "sizes": [
      "100",
      "110",
      "120",
      "130",
      "140"
    ],
    "description": "Chất liệu thun cá sấu mắt chim thấm hút mồ hôi tối ưu, quần short cạp chun co giãn cho bé thoải mái chạy nhảy.",
    "material": "100% Piqué Cotton mềm mại",
    "careInstructions": [
      "Giặt máy thoải mái"
    ],
    "isBestSeller": true
  },
  {
    "id": "treem-trai-03",
    "name": "Bộ Quần Áo Thể Thao Nỉ Bông Bé Trai Khủng Long Dino Active Tracksuit",
    "slug": "bo-the-thao-ni-bong-be-trai-dino-active",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "tre-em",
    "subCategory": "be-trai",
    "price": 350000,
    "originalPrice": 450000,
    "discountPercentage": 22,
    "rating": 4.8,
    "reviewCount": 36,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Giao 2-4 ngày",
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Xanh Lá Rừng",
        "hex": "#15803D"
      },
      {
        "name": "Xanh Thép",
        "hex": "#475569"
      }
    ],
    "sizes": [
      "100",
      "110",
      "120",
      "130"
    ],
    "description": "Bộ thể thao nỉ da cá ấm áp với chi tiết 3 sọc kinh điển bên hông và hình in khủng long ngộ nghĩnh mà các bé trai cực kỳ yêu thích.",
    "material": "Nỉ Cotton lót bông giữ ấm cao cấp",
    "careInstructions": [
      "Giặt máy chế độ thường"
    ],
    "isSale": true
  },
  {
    "id": "treem-len-01",
    "name": "Áo Len Dệt Kim Họa Tiết Gấu Bắc Cực Bé Gái & Bé Trai Unisex",
    "slug": "ao-len-det-kim-hoa-tiet-gau-tre-em",
    "brand": "Uniqlo",
    "origin": "international_order",
    "originCountry": "Nhật Bản",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "tre-em",
    "subCategory": "ao-len",
    "price": 260000,
    "originalPrice": 350000,
    "discountPercentage": 26,
    "rating": 4.9,
    "reviewCount": 50,
    "inStock": true,
    "stockCount": 35,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đỏ Noel",
        "hex": "#B83A3A"
      },
      {
        "name": "Trắng Bông Tuyết",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "90",
      "100",
      "110",
      "120",
      "130"
    ],
    "description": "Chất len sợi mềm mịn kháng khuẩn, dệt hình gấu đáng yêu mang lại cảm giác ấm áp và tươi vui cho mùa lễ hội cuối năm.",
    "material": "Len Acrylic pha Cotton sợi mềm không ngứa",
    "careInstructions": [
      "Giặt máy ở túi giặt len"
    ],
    "isSale": true
  },
  {
    "id": "pk-tui-01",
    "name": "Túi Xách Da Kẹp Nách Dáng Bán Nguyệt The Crescent Leather Shoulder Bag",
    "slug": "tui-xach-da-kep-nach-the-crescent-leather-shoulder-bag",
    "brand": "Gia Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "tui-xach",
    "price": 790000,
    "originalPrice": 990000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewCount": 48,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Giao nhanh 24-48h",
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Bò Cổ Điển",
        "hex": "#8A7158"
      },
      {
        "name": "Đen Jet Black",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "One Size (24x15x7 cm)"
    ],
    "description": "Kiệt tác túi xách kẹp nách phong cách tối giản với đường cong bán nguyệt trứ danh, da bê tự nhiên dập nổi logo thương hiệu mạ vàng.",
    "material": "100% Da bê Nappa nguyên tấm lót nhung",
    "careInstructions": [
      "Lau nhẹ bằng khăn ẩm mềm, tránh dính nước"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "pk-tui-02",
    "name": "Túi Tote Da Bò Sáp Cỡ Lớn Đựng Vừa Laptop Minimalist Work Tote",
    "slug": "tui-tote-da-bo-sap-co-lon-minimalist-work-tote",
    "brand": "Subtle Studios",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND"
    ],
    "category": "phu-kien",
    "subCategory": "tui-xach",
    "price": 680000,
    "rating": 4.8,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 20,
    "estimatedDelivery": "Giao hàng 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Tuyển",
        "hex": "#171613"
      },
      {
        "name": "Nâu Espresso",
        "hex": "#4B3621"
      }
    ],
    "sizes": [
      "One Size (38x28x12 cm)"
    ],
    "description": "Túi tote công sở chứa trọn laptop 14-15 inch và tài liệu, quai đeo vai trợ lực êm ái thích hợp cho người đi làm và doanh nhân.",
    "material": "Da tổng hợp PU sáp cao cấp chống trầy xước",
    "careInstructions": [
      "Vệ sinh bằng xi dưỡng da chuyên dụng"
    ],
    "isBestSeller": true
  },
  {
    "id": "pk-tui-03",
    "name": "Túi Đeo Chéo Chần Quả Trám Khóa Xoay Kim Loại Mạ Vàng The Quilted Crossbody",
    "slug": "tui-deo-cheo-chan-qua-tram-the-quilted-crossbody",
    "brand": "Chanel",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "tui-xach",
    "price": 1150000,
    "originalPrice": 1450000,
    "discountPercentage": 21,
    "rating": 5,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 10,
    "estimatedDelivery": "Order 7-10 ngày từ Paris",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Huyền Bí",
        "hex": "#171613"
      },
      {
        "name": "Trắng Kem Ivory",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "One Size (20x13x6 cm)"
    ],
    "description": "Họa tiết chần bông hình quả trám kinh điển, dây xích luồn da thanh mảnh cùng khóa xoay kim loại mạ vàng 18K sang trọng bất hủ.",
    "material": "Da cừu Caviar chống trầy xước bền bỉ",
    "careInstructions": [
      "Bảo quản trong túi dustbag khi không sử dụng"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "pk-giay-01",
    "name": "Giày Cao Gót Mũi Nhọn Da Bóng Gót Mảnh Stiletto Pumps 7cm",
    "slug": "giay-cao-got-mui-nhon-stiletto-pumps-7cm",
    "brand": "Zara",
    "origin": "international_order",
    "originCountry": "Tây Ban Nha",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "phu-kien",
    "subCategory": "giay-dep",
    "price": 590000,
    "originalPrice": 750000,
    "discountPercentage": 21,
    "rating": 4.8,
    "reviewCount": 65,
    "inStock": true,
    "stockCount": 22,
    "estimatedDelivery": "Giao nhanh 2-3 ngày",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Bóng Quyền Lực",
        "hex": "#171613"
      },
      {
        "name": "Nude Tôn Chân",
        "hex": "#E8D7BD"
      }
    ],
    "sizes": [
      "35",
      "36",
      "37",
      "38",
      "39"
    ],
    "description": "Mũi giày vuốt nhọn thanh thoát kéo dài bàn chân, độ cao 7cm chuẩn tỷ lệ cân đối giúp bước đi tự tin, êm chân suốt cả ngày.",
    "material": "Da bóng lót đệm cao su non êm ái",
    "careInstructions": [
      "Lau sạch bằng khăn mềm sau khi sử dụng"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "pk-giay-02",
    "name": "Giày Loafer Da Thật Khóa Kim Loại Horsebit Penny Loafers Nam & Nữ",
    "slug": "giay-loafer-da-that-horsebit-penny-loafers",
    "brand": "Gucci",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "giay-dep",
    "price": 850000,
    "originalPrice": 1100000,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 16,
    "estimatedDelivery": "Order 7-10 ngày từ Milan",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Cà Phê Cháy",
        "hex": "#4B3621"
      },
      {
        "name": "Đen Jet Black",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42"
    ],
    "description": "Di sản giày lười phong cách Sartorial Ý với chi tiết móng ngựa khóa kim loại Horsebit kinh điển, đế cao su khâu viền chắc chắn.",
    "material": "Da bò Calfskin thuộc thảo mộc thủ công",
    "careInstructions": [
      "Đánh xi thường xuyên giữ độ bóng mềm"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "pk-giay-03",
    "name": "Giày Sneaker Thể Thao Da Lộn Phối Màu Retro Vintage Runner",
    "slug": "giay-sneaker-da-lon-retro-vintage-runner",
    "brand": "Adidas Originals",
    "origin": "international_order",
    "originCountry": "Đức",
    "badges": [
      "ORDER QUỐC TẾ",
      "HÀNG CÓ SẴN"
    ],
    "category": "phu-kien",
    "subCategory": "giay-dep",
    "price": 720000,
    "rating": 4.9,
    "reviewCount": 84,
    "inStock": true,
    "stockCount": 30,
    "estimatedDelivery": "Giao ngay trong 24h",
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Phối Xám Khói",
        "hex": "#E2E8F0"
      },
      {
        "name": "Xanh Vintage",
        "hex": "#3B82F6"
      }
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "description": "Phong cách Terrace cổ điển thập niên 80 với thân giày da lộn cao cấp, đế kẹo cao su gum bám đường êm ái cho mọi trang phục.",
    "material": "Da lộn tự nhiên kết hợp vải dệt lưới thoáng khí",
    "careInstructions": [
      "Dùng bàn chải da lộn chuyên dụng"
    ],
    "isNewArrival": true
  },
  {
    "id": "pk-thatlung-01",
    "name": "Thắt Lưng Da Bò Nguyên Miếng Khóa Kim Loại Classic Leather Belt",
    "slug": "that-lung-da-bo-nguyen-mieng-classic-belt",
    "brand": "Polo Ralph Lauren",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "phu-kien",
    "subCategory": "that-lung",
    "price": 380000,
    "originalPrice": 480000,
    "discountPercentage": 21,
    "rating": 4.8,
    "reviewCount": 46,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Hàng có sẵn - Giao 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Bò Cổ Điển",
        "hex": "#8A7158"
      },
      {
        "name": "Đen Jet Black",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "95cm",
      "105cm",
      "115cm"
    ],
    "description": "Gia công từ da bò mộc tự nhiên nguyên tấm dày 3.8mm không bong tróc, mặt khóa kim loại đúc nguyên khối chống gỉ sét bền bỉ.",
    "material": "100% Da bò nguyên miếng Top-Grain",
    "careInstructions": [
      "Tránh ngâm nước và tiếp xúc hóa chất"
    ],
    "isSale": true
  },
  {
    "id": "pk-thatlung-02",
    "name": "Thắt Lưng Nữ Bản Nhỏ Mặt Khóa Tròn Mạ Vàng Dainty Waist Belt",
    "slug": "that-lung-nu-ban-nho-mat-khoa-tron-dainty-belt",
    "brand": "Nosbyn Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "HÀNG CÓ SẴN"
    ],
    "category": "phu-kien",
    "subCategory": "that-lung",
    "price": 260000,
    "rating": 4.8,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 35,
    "estimatedDelivery": "Giao hàng 24h",
    "images": [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen",
        "hex": "#171613"
      },
      {
        "name": "Nâu Caramel",
        "hex": "#D97706"
      }
    ],
    "sizes": [
      "One Size (95cm, có lỗ điều chỉnh)"
    ],
    "description": "Bản dây 1.5cm thanh mảnh lý tưởng để thắt váy đầm, áo blazer hoặc quần tây công sở, tạo điểm nhấn eo thon quyến rũ.",
    "material": "Da nhân tạo mềm mịn không nứt gãy",
    "careInstructions": [
      "Lau sạch bằng khăn khô"
    ],
    "isNewArrival": true
  },
  {
    "id": "pk-kinh-01",
    "name": "Kính Râm Mắt Mèo Gọng Acetate Chống Tia UV400 Cat-Eye Sunglasses",
    "slug": "kinh-ram-mat-meo-gong-acetate-cat-eye-sunglasses",
    "brand": "Jacquemus",
    "origin": "international_order",
    "originCountry": "Pháp",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "phu-kien",
    "subCategory": "phu-kien",
    "price": 490000,
    "originalPrice": 650000,
    "discountPercentage": 25,
    "rating": 4.9,
    "reviewCount": 55,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Giao nhanh 2-3 ngày",
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Bóng",
        "hex": "#171613"
      },
      {
        "name": "Đồi Mồi Tortoiseshell",
        "hex": "#8A7158"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Phom kính mắt mèo góc cạnh thời thượng chuẩn phong cách Parisian Chic, tròng kính phân cực polarized chống chói và tia UV400 tuyệt đối.",
    "material": "Gọng Acetate cao cấp, tròng kính Polycarbonate chống xước",
    "careInstructions": [
      "Vệ sinh bằng khăn lau microfiber chuyên dụng kèm hộp"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "pk-kinh-02",
    "name": "Vòng Cổ Ngọc Trai Nước Ngọt Phối Mặt Dây Bạc .925 Pearl Pendant Necklace",
    "slug": "vong-co-ngoc-trai-nuoc-ngot-pearl-necklace",
    "brand": "Chrome Hearts",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ"
    ],
    "category": "phu-kien",
    "subCategory": "phu-kien",
    "price": 450000,
    "originalPrice": 590000,
    "discountPercentage": 24,
    "rating": 4.9,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Giao hàng 3-4 ngày",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Trắng Ánh Ngọc Trai",
        "hex": "#FAF8F3"
      }
    ],
    "sizes": [
      "Dây 45cm + 5cm mắt nối"
    ],
    "description": "Sự kết hợp giữa nét quý phái của ngọc trai tự nhiên và nét cá tính của mặt dây chữ thập bạc Sterling, xu hướng trang sức Unisex được săn đón nhất.",
    "material": "Ngọc trai nước ngọt nuôi tự nhiên, khóa Bạc S925",
    "careInstructions": [
      "Tránh xịt nước hoa trực tiếp lên ngọc trai"
    ],
    "isBestSeller": true,
    "isSale": true
  },
  {
    "id": "duc-studio-02",
    "name": "Quần Ống Suông Xẻ Gấu Avant-Garde Deconstructed Trousers",
    "slug": "quan-ong-suong-avant-garde-duc-studio",
    "brand": "Duc Studio",
    "origin": "vietnam_local_brand",
    "originCountry": "Việt Nam",
    "badges": [
      "LOCAL BRAND",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "quan",
    "price": 620000,
    "originalPrice": 780000,
    "discountPercentage": 21,
    "rating": 4.8,
    "reviewCount": 26,
    "inStock": true,
    "stockCount": 18,
    "estimatedDelivery": "Giao nhanh 1-2 ngày",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Tuyển",
        "hex": "#171613"
      },
      {
        "name": "Xám Xi Măng",
        "hex": "#94A3B8"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Thiết kế cấu trúc phi đối xứng với đường xẻ tà gấu quần phá cách, chất vải đứng phom đặc trưng của Duc Studio.",
    "material": "Vải Kaki Tuyết Mưa dệt mật độ cao",
    "careInstructions": [
      "Giặt máy ở chế độ thường"
    ],
    "isSale": true
  },
  {
    "id": "dg-02",
    "name": "Áo Sơ Mi Lụa Họa Tiết Baroque Dolce & Gabbana Silk Party Shirt",
    "slug": "ao-so-mi-lua-baroque-dolce-gabbana",
    "brand": "Dolce & Gabbana",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 890000,
    "originalPrice": 1150000,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 12,
    "estimatedDelivery": "Order 7-10 ngày từ Milan",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Vàng Hoàng Gia Phối Đen",
        "hex": "#E5A93C"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Họa tiết hoa văn vương giả Baroque Ý rực rỡ trên nền vải lụa tơ tằm bóng nhẹ, mang lại vẻ ngoài xa hoa cuốn hút.",
    "material": "100% Lụa Tơ Tằm Ý",
    "careInstructions": [
      "Giặt khô hoặc giặt hấp chuyên nghiệp"
    ],
    "isSale": true
  },
  {
    "id": "loro-piana-02",
    "name": "Áo Polo Dệt Len Fine Merino Wool Loro Piana Espresso Knit",
    "slug": "ao-polo-det-len-fine-merino-loro-piana",
    "brand": "Loro Piana",
    "origin": "international_order",
    "originCountry": "Ý",
    "badges": [
      "ORDER QUỐC TẾ",
      "PREMIUM"
    ],
    "category": "nam",
    "subCategory": "ao-thun",
    "price": 750000,
    "originalPrice": 950000,
    "discountPercentage": 21,
    "rating": 5,
    "reviewCount": 24,
    "inStock": true,
    "stockCount": 15,
    "estimatedDelivery": "Order 7-10 ngày từ Ý",
    "depositRequired": true,
    "depositPercentage": 50,
    "images": [
      "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Nâu Espresso",
        "hex": "#4B3621"
      },
      {
        "name": "Xanh Navy Đậm",
        "hex": "#1E293B"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Sợi len Merino siêu mảnh đan dệt theo cấu trúc thoáng khí độc quyền của nhà mốt Loro Piana, mềm nhẹ như làn da thứ hai.",
    "material": "100% Superfine Extra-Fine Merino Wool",
    "careInstructions": [
      "Giặt tay bằng nước lạnh với dầu gội len"
    ],
    "featured": true,
    "isSale": true
  },
  {
    "id": "nike-02",
    "name": "Bộ Quần Áo Thể Thao Gió Nike Windrunner Tracksuit Black/White",
    "slug": "bo-the-thao-gio-nike-windrunner-tracksuit",
    "brand": "Nike",
    "origin": "international_order",
    "originCountry": "Hoa Kỳ",
    "badges": [
      "ORDER QUỐC TẾ",
      "HÀNG CÓ SẴN"
    ],
    "category": "do-bo",
    "subCategory": "do-bo",
    "price": 720000,
    "originalPrice": 890000,
    "discountPercentage": 19,
    "rating": 4.8,
    "reviewCount": 58,
    "inStock": true,
    "stockCount": 25,
    "estimatedDelivery": "Giao nhanh 24h",
    "images": [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&auto=format&fit=crop&q=85"
    ],
    "colors": [
      {
        "name": "Đen Phối Trắng",
        "hex": "#171613"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "description": "Họa tiết chữ V Chevron 26 độ kinh điển của dòng Windrunner, chất vải dù dùi cản gió chống nước mưa nhẹ và lót lưới thoáng mát.",
    "material": "100% Polyester Taffeta cản gió chống nước",
    "careInstructions": [
      "Giặt máy ở nhiệt độ thường"
    ],
    "isBestSeller": true,
    "isSale": true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderCode: 'TD-984210',
    createdAt: '2026-10-20T14:30:00Z',
    status: 'shipping',
    statusLabel: 'Đang vận chuyển',
    subtotal: 1370000,
    shippingFee: 0,
    discountAmount: 100000,
    total: 1270000,
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    trackingNumber: 'VNPOST-884920412',
    carrier: 'VNPost Nhanh',
    shippingAddress: {
      fullName: 'Trần Minh Anh',
      phone: '0908 123 456',
      email: 'minhanh.tran@gmail.com',
      address: 'Căn hộ 18.04, Tháp B2, Sarimi Sala, 10 Mai Chí Thọ',
      city: 'TP. Hồ Chí Minh',
      district: 'Thành phố Thủ Đức',
      ward: 'Phường An Lợi Đông'
    },
    items: [
      {
        productId: 'nu-vay-01',
        productName: 'Đầm Lụa Satin Cổ Yếm Dáng Dài The Aurelia Maxi Dress',
        brand: 'Gia Studios',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=85',
        color: 'Vàng Champagne',
        size: 'M',
        price: 980000,
        quantity: 1,
        origin: 'vietnam_local_brand',
        estimatedDelivery: 'Giao nhanh 1-2 ngày'
      },
      {
        productId: 'nu-somi-03',
        productName: 'Áo Thun Gân Ôm Body Cổ Vuông Tôn Dáng',
        brand: 'Routine',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&auto=format&fit=crop&q=85',
        color: 'Đen Basic',
        size: 'S',
        price: 290000,
        quantity: 1,
        origin: 'vietnam_local_brand',
        estimatedDelivery: 'Giao nhanh 1-2 ngày'
      }
    ]
  },
  {
    id: 'ord-102',
    orderCode: 'TD-983105',
    createdAt: '2026-10-15T09:15:00Z',
    status: 'delivered',
    statusLabel: 'Giao hàng thành công',
    subtotal: 750000,
    shippingFee: 30000,
    discountAmount: 0,
    total: 780000,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    trackingNumber: 'GHN-9938210',
    carrier: 'Giao Hàng Nhanh',
    shippingAddress: {
      fullName: 'Trần Minh Anh',
      phone: '0908 123 456',
      email: 'minhanh.tran@gmail.com',
      address: 'Căn hộ 18.04, Tháp B2, Sarimi Sala, 10 Mai Chí Thọ',
      city: 'TP. Hồ Chí Minh',
      district: 'Thành phố Thủ Đức',
      ward: 'Phường An Lợi Đông'
    },
    items: [
      {
        productId: 'mau-36',
        productName: 'Bộ Tracksuit Beckenbauer Tuyển Đức DFB Retro Set',
        brand: 'Adidas Originals',
        image: '/images/products/adidas-germany-tracksuit-white-black.jpg',
        color: 'Trắng Ngà Phối Đen',
        size: 'L',
        price: 750000,
        quantity: 1,
        origin: 'in_stock_ready',
        estimatedDelivery: 'Đã giao'
      }
    ]
  }
];

export const ORDERS_DATA: Order[] = MOCK_ORDERS;

export const CAMPAIGNS: CampaignBanner[] = [
  {
    id: 'camp-01',
    title: 'Bộ Sưu Tập Thu Đông 2026',
    subtitle: 'Trench coat dạ cashmere, cardigan dệt kim và blazer phom dáng kiến trúc đương đại',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&auto=format&fit=crop&q=85',
    tag: 'CAMPAIGN THU ĐÔNG 2026',
    link: '/shop?collection=thu-dong'
  },
  {
    id: 'camp-02',
    title: 'Quiet Luxury & Minimalist',
    subtitle: 'Vẻ đẹp tĩnh tại từ chất liệu lụa tơ tằm, da Nappa và len Merino từ Lemaire & Gia Studios',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=85',
    tag: 'QUIET LUXURY ESSENTIALS',
    link: '/shop?collection=quiet-luxury'
  }
];

export const CAMPAIGN_DATA = CAMPAIGNS;
