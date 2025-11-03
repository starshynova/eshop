import { useMediaQuery } from "react-responsive";
import MobileHeader from "./MobileHeader";
// import TabletHeader from "./TabletHeader";
import DesktopHeader from "./DesktopHeader";

export default function Header() {
  const isDesktop = useMediaQuery({ minWidth: 1481 });
//   const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1480 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isDesktop) return <DesktopHeader />;
//   if (isTablet)  return <TabletHeader />;
  if (isMobile)  return <MobileHeader />;
}