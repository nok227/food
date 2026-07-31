import { useLocation, useNavigate } from "react-router-dom";
import { useRecentTabs } from "../context/RecentTabsContext";

// 🟢 แถบ "ประวัติหน้าที่เคยกดดู" (คล้ายแท็บของเว็บจีนสไตล์ vue-element-admin)
// - กดที่แท็บ -> ไปหน้านั้น
// - กด ✕ -> ปิดแท็บนั้นออก
// - แท็บที่เพิ่งกดล่าสุดจะถูกย้ายมาไว้หัวแถวเสมอ (จัดการอยู่ใน RecentTabsContext)
function TabsBar() {
  const { tabs, closeTab } = useRecentTabs();
  const navigate = useNavigate();
  const location = useLocation();

  if (tabs.length === 0) return null;

  return (
    <div className="shrink-0 bg-white border-b border-gray-200 px-3 sm:px-8 overflow-x-auto">
      <div className="flex gap-2 py-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <div
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium cursor-pointer border transition select-none ${
                isActive
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.path);
                }}
                aria-label={`ปิดแท็บ ${tab.label}`}
                className={`rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none transition ${
                  isActive ? "hover:bg-amber-600" : "hover:bg-gray-300"
                }`}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TabsBar;