export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF8F3] px-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-[#E8E4DC] border-t-[#C7A66A] animate-spin" />
      </div>
      <p className="mt-4 font-editorial text-sm text-[#8A7158] tracking-widest uppercase">
        TADA! Atelier
      </p>
      <span className="text-[11px] text-[#747069] mt-1">Đang tải trải nghiệm thời trang...</span>
    </div>
  );
}
