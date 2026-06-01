import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

export default function PageContainer({
  role,
  title,
  subtitle,
  actions,
  children,
  showBottomNav = true,
  headerCompact = false,
  contentClassName = "",
}) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar role={role} />
      <div className="flex-1">
        <AppHeader title={title} subtitle={subtitle} actions={actions} compact={headerCompact} />
        <main className={`mx-auto w-full max-w-6xl px-3 py-4 pb-24 sm:px-4 sm:py-5 sm:pb-28 md:px-8 md:py-6 md:pb-10 ${contentClassName}`}>{children}</main>
      </div>
      {showBottomNav ? <BottomNav role={role} /> : null}
    </div>
  );
}
