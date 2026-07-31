import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../data/navItems";

const RecentTabsContext = createContext(null);

// 🟢 เก็บ "ประวัติหน้าที่เคยกดดู" แบบ MRU (Most Recently Used)
// - ทุกครั้งที่เปลี่ยนหน้าไปยังหน้าที่อยู่ใน navItems -> เพิ่มเป็นแท็บ
// - ถ้าหน้านั้นมีแท็บอยู่แล้ว -> ย้ายมาไว้หัวแถวแทนที่จะเพิ่มซ้ำ
// - มีฟังก์ชันปิดแท็บ (closeTab) ถ้าปิดแท็บที่กำลังเปิดอยู่ จะพาไปแท็บถัดไปให้อัตโนมัติ
export function RecentTabsProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const matched = navItems.find((item) => item.path === location.pathname);
    if (!matched) return; // หน้าที่ไม่อยู่ในเมนู (เช่นหน้า 404) ไม่ต้องขึ้นแท็บ

    setTabs((prev) => {
      const withoutCurrent = prev.filter((t) => t.path !== matched.path);
      return [matched, ...withoutCurrent];
    });
  }, [location.pathname]);

  const closeTab = useCallback(
    (path) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.path !== path);
        if (location.pathname === path) {
          navigate(next[0]?.path || "/");
        }
        return next;
      });
    },
    [location.pathname, navigate]
  );

  return (
    <RecentTabsContext.Provider value={{ tabs, closeTab }}>
      {children}
    </RecentTabsContext.Provider>
  );
}

export function useRecentTabs() {
  const ctx = useContext(RecentTabsContext);
  if (!ctx) {
    throw new Error("useRecentTabs ต้องถูกเรียกภายใน <RecentTabsProvider>");
  }
  return ctx;
}