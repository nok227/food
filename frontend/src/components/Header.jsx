// 🟢 Header: แสดงชื่อเว็บ + ปุ่มแฮมเบอร์เกอร์ (โชว์เฉพาะจอมือถือ) สำหรับเปิด Sidebar
function Header({ onMenuClick }) {
  return (
    <header className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center gap-3">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="เปิดเมนู"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
        Food Ordering Menu
      </h1>
    </header>
  );
}

export default Header;