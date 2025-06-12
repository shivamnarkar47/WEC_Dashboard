// components/icons.tsx
import {
  ClockIcon as Clock,
  BarChartIcon as BarChart2,
  MagnifyingGlassIcon as Search,
  LapTimerIcon as LapTimer,
  DashboardIcon as Dashboard,
  CalendarIcon as Calendar,
  ChevronRightIcon as ChevronRight,
  ChevronDownIcon as ChevronDown,
  CircleIcon as Circle,
} from "@radix-ui/react-icons";

import {
  CastIcon as Cast,
  FlagIcon as Flag,
  GaugeIcon as Speedometer,
  GroupIcon as Team,
  Gauge as Gauge,
  Timer as Timer,
  Users as Users,
  Settings as Settings,
  RefreshCw as Refresh,
  AlertCircle as AlertCircle,
  CheckCircle as CheckCircle,
  XCircle as XCircle,
  ChevronUp as ChevronUp,
  ChevronLeft as ChevronLeft,
  Plus as Plus,
  Minus as Minus,
  Info as Info,
  ExternalLink as ExternalLink,
  Download as Download,
  Upload as Upload,
  Menu as Menu,
  X as Close,
  Loader,
} from "lucide-react";

export const Icons = {
  clock: Clock,
  barChart: BarChart2,
  cast: Cast,
  search: Search,
  lapTimer: LapTimer,
  dashboard: Dashboard,
  speedometer: Speedometer,
  team: Team,
  calendar: Calendar,
  flag: Flag,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  circle: Circle,
  gauge: Gauge,
  spinner: Loader,
  timer: Timer,
  users: Users,
  settings: Settings,
  refresh: Refresh,
  alert: AlertCircle,
  check: CheckCircle,
  x: XCircle,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  plus: Plus,
  minus: Minus,
  info: Info,
  externalLink: ExternalLink,
  download: Download,
  upload: Upload,
  menu: Menu,
  close: Close,

  // Custom racing-specific icons
  podium: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8h14M5 8a2 2 0 1 0 0-4H3v16h18V4h-2a2 2 0 1 0 0 4M5 8v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  ),
  racingHelmet: (classname: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={classname}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  racingFlag: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  tire: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
  loading: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

export type Icon = keyof typeof Icons;
