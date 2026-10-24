'use client';

import React, { useMemo } from 'react';
import { VIETNAM_PROVINCES } from '@/data/vietnam-address-data';

interface AddressCascadeSelectProps {
  province: string;
  district: string;
  ward: string;
  onChange: (address: { province: string; district: string; ward: string }) => void;
  disabled?: boolean;
}

export function AddressCascadeSelect({
  province,
  district,
  ward,
  onChange,
  disabled = false
}: AddressCascadeSelectProps) {
  // Tìm Tỉnh/Thành đang chọn
  const currentProvinceData = useMemo(() => {
    return VIETNAM_PROVINCES.find(
      (p) => p.name.toLowerCase() === province.toLowerCase() || p.id.toLowerCase() === province.toLowerCase()
    );
  }, [province]);

  // Danh sách Quận/Huyện tương ứng
  const availableDistricts = useMemo(() => {
    return currentProvinceData?.districts || [];
  }, [currentProvinceData]);

  // Tìm Quận/Huyện đang chọn
  const currentDistrictData = useMemo(() => {
    return availableDistricts.find(
      (d) => d.name.toLowerCase() === district.toLowerCase() || d.id.toLowerCase() === district.toLowerCase()
    );
  }, [availableDistricts, district]);

  // Danh sách Phường/Xã tương ứng
  const availableWards = useMemo(() => {
    return currentDistrictData?.wards || [];
  }, [currentDistrictData]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvName = e.target.value;
    onChange({
      province: newProvName,
      district: '',
      ward: ''
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistName = e.target.value;
    onChange({
      province,
      district: newDistName,
      ward: ''
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWardName = e.target.value;
    onChange({
      province,
      district,
      ward: newWardName
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. Tỉnh / Thành Phố */}
      <div>
        <label htmlFor="select-province" className="block text-xs font-medium text-[#171613] mb-1">
          Tỉnh / Thành Phố <span className="text-[#B83A3A]">*</span>
        </label>
        <select
          id="select-province"
          value={province}
          onChange={handleProvinceChange}
          disabled={disabled}
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E8E4DC] bg-white text-[#171613] focus:outline-none focus:border-[#8A7158] transition-colors"
        >
          <option value="">-- Chọn Tỉnh / TP --</option>
          {VIETNAM_PROVINCES.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Quận / Huyện */}
      <div>
        <label htmlFor="select-district" className="block text-xs font-medium text-[#171613] mb-1">
          Quận / Huyện <span className="text-[#B83A3A]">*</span>
        </label>
        <select
          id="select-district"
          value={district}
          onChange={handleDistrictChange}
          disabled={disabled || !province}
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E8E4DC] bg-white text-[#171613] focus:outline-none focus:border-[#8A7158] transition-colors disabled:bg-[#FAF8F3] disabled:text-[#A8A29E]"
        >
          <option value="">{province ? '-- Chọn Quận / Huyện --' : '-- Chọn Tỉnh trước --'}</option>
          {availableDistricts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Phường / Xã */}
      <div>
        <label htmlFor="select-ward" className="block text-xs font-medium text-[#171613] mb-1">
          Phường / Xã <span className="text-[#B83A3A]">*</span>
        </label>
        <select
          id="select-ward"
          value={ward}
          onChange={handleWardChange}
          disabled={disabled || !district}
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E8E4DC] bg-white text-[#171613] focus:outline-none focus:border-[#8A7158] transition-colors disabled:bg-[#FAF8F3] disabled:text-[#A8A29E]"
        >
          <option value="">{district ? '-- Chọn Phường / Xã --' : '-- Chọn Huyện trước --'}</option>
          {availableWards.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
