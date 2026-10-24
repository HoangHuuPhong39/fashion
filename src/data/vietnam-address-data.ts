export interface WardData {
  id: string;
  name: string;
}

export interface DistrictData {
  id: string;
  name: string;
  wards: WardData[];
}

export interface ProvinceData {
  id: string;
  name: string;
  isMetropolitan?: boolean; // Hà Nội / TP.HCM (giao nhanh, cước nội thành rẻ hơn)
  districts: DistrictData[];
}

export const VIETNAM_PROVINCES: ProvinceData[] = [
  {
    id: 'HN',
    name: 'Hà Nội',
    isMetropolitan: true,
    districts: [
      {
        id: 'HN_HK',
        name: 'Quận Hoàn Kiếm',
        wards: [
          { id: 'HN_HK_HB', name: 'Phường Hàng Bạc' },
          { id: 'HN_HK_HG', name: 'Phường Hàng Gai' },
          { id: 'HN_HK_TB', name: 'Phường Tràng Tiền' },
          { id: 'HN_HK_CB', name: 'Phường Cửa Đông' }
        ]
      },
      {
        id: 'HN_BD',
        name: 'Quận Ba Đình',
        wards: [
          { id: 'HN_BD_CG', name: 'Phường Cống Vị' },
          { id: 'HN_BD_DM', name: 'Phường Đội Cấn' },
          { id: 'HN_BD_GV', name: 'Phường Giảng Võ' },
          { id: 'HN_BD_KD', name: 'Phường Kim Mã' }
        ]
      },
      {
        id: 'HN_CG',
        name: 'Quận Cầu Giấy',
        wards: [
          { id: 'HN_CG_DH', name: 'Phường Dịch Vọng Hậu' },
          { id: 'HN_CG_NW', name: 'Phường Nghĩa Đô' },
          { id: 'HN_CG_NT', name: 'Phường Nghĩa Tân' },
          { id: 'HN_CG_MH', name: 'Phường Mai Dịch' }
        ]
      },
      {
        id: 'HN_TX',
        name: 'Quận Thanh Xuân',
        wards: [
          { id: 'HN_TX_NH', name: 'Phường Nhân Chính' },
          { id: 'HN_TX_TXB', name: 'Phường Thanh Xuân Bắc' },
          { id: 'HN_TX_KTD', name: 'Phường Khương Đình' }
        ]
      },
      {
        id: 'HN_HBT',
        name: 'Quận Hai Bà Trưng',
        wards: [
          { id: 'HN_HBT_BM', name: 'Phường Bách Khoa' },
          { id: 'HN_HBT_DS', name: 'Phường Đồng Tâm' },
          { id: 'HN_HBT_LC', name: 'Phường Lê Đại Hành' }
        ]
      },
      {
        id: 'HN_DD',
        name: 'Quận Đống Đa',
        wards: [
          { id: 'HN_DD_TC', name: 'Phường Trung Tự' },
          { id: 'HN_DD_LTK', name: 'Phường Láng Hạ' },
          { id: 'HN_DD_ODC', name: 'Phường Ô Chợ Dừa' }
        ]
      },
      {
        id: 'HN_TH',
        name: 'Quận Tây Hồ',
        wards: [
          { id: 'HN_TH_QA', name: 'Phường Quảng An' },
          { id: 'HN_TH_XT', name: 'Phường Xuân La' },
          { id: 'HN_TH_YD', name: 'Phường Yên Phụ' }
        ]
      }
    ]
  },
  {
    id: 'HCM',
    name: 'Hồ Chí Minh',
    isMetropolitan: true,
    districts: [
      {
        id: 'HCM_Q1',
        name: 'Quận 1',
        wards: [
          { id: 'HCM_Q1_BN', name: 'Phường Bến Nghé' },
          { id: 'HCM_Q1_BT', name: 'Phường Bến Thành' },
          { id: 'HCM_Q1_DK', name: 'Phường Đa Kao' },
          { id: 'HCM_Q1_TC', name: 'Phường Tân Định' }
        ]
      },
      {
        id: 'HCM_Q3',
        name: 'Quận 3',
        wards: [
          { id: 'HCM_Q3_V6', name: 'Phường Võ Thị Sáu' },
          { id: 'HCM_Q3_P1', name: 'Phường 1' },
          { id: 'HCM_Q3_P2', name: 'Phường 2' }
        ]
      },
      {
        id: 'HCM_BT',
        name: 'Quận Bình Thạnh',
        wards: [
          { id: 'HCM_BT_P19', name: 'Phường 19' },
          { id: 'HCM_BT_P22', name: 'Phường 22' },
          { id: 'HCM_BT_P25', name: 'Phường 25' }
        ]
      },
      {
        id: 'HCM_PN',
        name: 'Quận Phú Nhuận',
        wards: [
          { id: 'HCM_PN_P1', name: 'Phường 1' },
          { id: 'HCM_PN_P2', name: 'Phường 2' },
          { id: 'HCM_PN_P9', name: 'Phường 9' }
        ]
      },
      {
        id: 'HCM_TD',
        name: 'TP. Thủ Đức',
        wards: [
          { id: 'HCM_TD_TT', name: 'Phường Thảo Điền' },
          { id: 'HCM_TD_AP', name: 'Phường An Phú' },
          { id: 'HCM_TD_BC', name: 'Phường Bình Chiểu' }
        ]
      },
      {
        id: 'HCM_Q7',
        name: 'Quận 7',
        wards: [
          { id: 'HCM_Q7_TM', name: 'Phường Tân Mỹ' },
          { id: 'HCM_Q7_TP', name: 'Phường Tân Phong' },
          { id: 'HCM_Q7_PT', name: 'Phường Phú Thuận' }
        ]
      }
    ]
  },
  {
    id: 'DN',
    name: 'Đà Nẵng',
    isMetropolitan: false,
    districts: [
      {
        id: 'DN_HC',
        name: 'Quận Hải Châu',
        wards: [
          { id: 'DN_HC_TB', name: 'Phường Thuận Phước' },
          { id: 'DN_HC_TC', name: 'Phường Thạch Thang' },
          { id: 'DN_HC_HD', name: 'Phường Hòa Cường Bắc' }
        ]
      },
      {
        id: 'DN_ST',
        name: 'Quận Sơn Trà',
        wards: [
          { id: 'DN_ST_AH', name: 'Phường An Hải Bắc' },
          { id: 'DN_ST_PN', name: 'Phường Phước Mỹ' }
        ]
      },
      {
        id: 'DN_TK',
        name: 'Quận Thanh Khê',
        wards: [
          { id: 'DN_TK_VD', name: 'Phường Vĩnh Trung' },
          { id: 'DN_TK_TH', name: 'Phường Tam Thuận' }
        ]
      }
    ]
  },
  {
    id: 'HP',
    name: 'Hải Phòng',
    isMetropolitan: false,
    districts: [
      {
        id: 'HP_HB',
        name: 'Quận Hồng Bàng',
        wards: [
          { id: 'HP_HB_HQ', name: 'Phường Hoàng Văn Thụ' },
          { id: 'HP_HB_MQ', name: 'Phường Minh Khai' }
        ]
      },
      {
        id: 'HP_NC',
        name: 'Quận Ngô Quyền',
        wards: [
          { id: 'HP_NC_CD', name: 'Phường Cầu Đất' },
          { id: 'HP_NC_LC', name: 'Phường Lạc Viên' }
        ]
      }
    ]
  },
  {
    id: 'CT',
    name: 'Cần Thơ',
    isMetropolitan: false,
    districts: [
      {
        id: 'CT_NK',
        name: 'Quận Ninh Kiều',
        wards: [
          { id: 'CT_NK_TA', name: 'Phường Tân An' },
          { id: 'CT_NK_AB', name: 'Phường An Bình' }
        ]
      }
    ]
  },
  {
    id: 'BD',
    name: 'Bình Dương',
    isMetropolitan: false,
    districts: [
      {
        id: 'BD_TDM',
        name: 'TP. Thủ Dầu Một',
        wards: [
          { id: 'BD_TDM_PC', name: 'Phường Phú Cường' },
          { id: 'BD_TDM_HB', name: 'Phường Hiệp Thành' }
        ]
      },
      {
        id: 'BD_TA',
        name: 'TP. Thuận An',
        wards: [
          { id: 'BD_TA_LT', name: 'Phường Lái Thiêu' },
          { id: 'BD_TA_AH', name: 'Phường An Phú' }
        ]
      }
    ]
  },
  {
    id: 'DNAI',
    name: 'Đồng Nai',
    isMetropolitan: false,
    districts: [
      {
        id: 'DNAI_BH',
        name: 'TP. Biên Hòa',
        wards: [
          { id: 'DNAI_BH_TT', name: 'Phường Trung Dũng' },
          { id: 'DNAI_BH_TH', name: 'Phường Tân Hiệp' }
        ]
      }
    ]
  },
  {
    id: 'QNH',
    name: 'Quảng Ninh',
    isMetropolitan: false,
    districts: [
      {
        id: 'QNH_HL',
        name: 'TP. Hạ Long',
        wards: [
          { id: 'QNH_HL_BC', name: 'Phường Bãi Cháy' },
          { id: 'QNH_HL_HG', name: 'Phường Hòn Gai' }
        ]
      }
    ]
  },
  {
    id: 'KH',
    name: 'Khánh Hòa',
    isMetropolitan: false,
    districts: [
      {
        id: 'KH_NT',
        name: 'TP. Nha Trang',
        wards: [
          { id: 'KH_NT_LC', name: 'Phường Lộc Thọ' },
          { id: 'KH_NT_PL', name: 'Phường Phước Long' }
        ]
      }
    ]
  },
  {
    id: 'OTHER',
    name: 'Tỉnh/Thành Khác',
    isMetropolitan: false,
    districts: [
      {
        id: 'OTHER_D',
        name: 'Quận/Huyện trung tâm',
        wards: [{ id: 'OTHER_W', name: 'Phường/Xã trung tâm' }]
      }
    ]
  }
];
