import {
  Heart, Brain, Shield, Leaf, Sparkles, Star, Award, Globe, Users, Zap,
  FlaskConical, Microscope, Dna, HeartPulse, ShieldCheck, Radio, Smile,
  Crown, Gem, Target, Rocket, TrendingUp, BarChart3, PieChart,
  Package, ShoppingBag, ShoppingCart, CreditCard, Truck, MapPin,
  Phone, Mail, MessageCircle, Send, Bell, Calendar, Clock, Timer,
  Camera, Image, Video, Play, Music, Headphones,
  Sun, Moon, CloudSun, Droplets, Wind, Flame,
  Home, Building, Warehouse, Store, Landmark,
  User, UserPlus, UserCheck, UsersRound, Baby,
  BookOpen, GraduationCap, FileText, Clipboard, PenTool,
  Lightbulb, Settings, Wrench, Puzzle, Layers,
  ArrowRight, ArrowUpRight, ExternalLink, Link, Share2,
  Check, CheckCircle, CircleDot, BadgeCheck, ThumbsUp,
  Eye, Search, Filter, SlidersHorizontal,
  Wifi, Smartphone, Monitor, Tablet, Laptop,
  Lock, Key, Fingerprint, ScanFace,
  Dumbbell, Activity, Stethoscope, Pill, Syringe,
  Apple, Salad, Coffee, Wine, UtensilsCrossed,
  TreePine, Mountain, Waves, Sunrise,
  HandHeart, Handshake, HeartHandshake, Megaphone,
  Percent, DollarSign, Coins, Banknote, Receipt,
  type LucideIcon,
} from "lucide-react"

export interface IconEntry {
  name: string
  component: LucideIcon
  category: string
}

export const ICON_CATEGORIES = [
  "Salud",
  "Ciencia",
  "Negocio",
  "Comercio",
  "Social",
  "Comunicacion",
  "Naturaleza",
  "Tecnologia",
  "General",
] as const

export const ICON_LIBRARY: IconEntry[] = [
  // Salud
  { name: "Heart", component: Heart, category: "Salud" },
  { name: "HeartPulse", component: HeartPulse, category: "Salud" },
  { name: "Brain", component: Brain, category: "Salud" },
  { name: "Shield", component: Shield, category: "Salud" },
  { name: "ShieldCheck", component: ShieldCheck, category: "Salud" },
  { name: "Stethoscope", component: Stethoscope, category: "Salud" },
  { name: "Pill", component: Pill, category: "Salud" },
  { name: "Syringe", component: Syringe, category: "Salud" },
  { name: "Activity", component: Activity, category: "Salud" },
  { name: "Dumbbell", component: Dumbbell, category: "Salud" },
  { name: "Smile", component: Smile, category: "Salud" },
  { name: "Baby", component: Baby, category: "Salud" },
  { name: "HandHeart", component: HandHeart, category: "Salud" },

  // Ciencia
  { name: "FlaskConical", component: FlaskConical, category: "Ciencia" },
  { name: "Microscope", component: Microscope, category: "Ciencia" },
  { name: "Dna", component: Dna, category: "Ciencia" },
  { name: "Radio", component: Radio, category: "Ciencia" },
  { name: "Leaf", component: Leaf, category: "Ciencia" },
  { name: "Sparkles", component: Sparkles, category: "Ciencia" },
  { name: "Lightbulb", component: Lightbulb, category: "Ciencia" },
  { name: "Puzzle", component: Puzzle, category: "Ciencia" },
  { name: "Layers", component: Layers, category: "Ciencia" },

  // Negocio
  { name: "TrendingUp", component: TrendingUp, category: "Negocio" },
  { name: "BarChart3", component: BarChart3, category: "Negocio" },
  { name: "PieChart", component: PieChart, category: "Negocio" },
  { name: "Target", component: Target, category: "Negocio" },
  { name: "Rocket", component: Rocket, category: "Negocio" },
  { name: "Crown", component: Crown, category: "Negocio" },
  { name: "Award", component: Award, category: "Negocio" },
  { name: "Gem", component: Gem, category: "Negocio" },
  { name: "Zap", component: Zap, category: "Negocio" },
  { name: "Star", component: Star, category: "Negocio" },
  { name: "Megaphone", component: Megaphone, category: "Negocio" },
  { name: "Handshake", component: Handshake, category: "Negocio" },
  { name: "HeartHandshake", component: HeartHandshake, category: "Negocio" },

  // Comercio
  { name: "ShoppingBag", component: ShoppingBag, category: "Comercio" },
  { name: "ShoppingCart", component: ShoppingCart, category: "Comercio" },
  { name: "Package", component: Package, category: "Comercio" },
  { name: "CreditCard", component: CreditCard, category: "Comercio" },
  { name: "Truck", component: Truck, category: "Comercio" },
  { name: "Store", component: Store, category: "Comercio" },
  { name: "DollarSign", component: DollarSign, category: "Comercio" },
  { name: "Percent", component: Percent, category: "Comercio" },
  { name: "Coins", component: Coins, category: "Comercio" },
  { name: "Banknote", component: Banknote, category: "Comercio" },
  { name: "Receipt", component: Receipt, category: "Comercio" },

  // Social
  { name: "Users", component: Users, category: "Social" },
  { name: "UsersRound", component: UsersRound, category: "Social" },
  { name: "User", component: User, category: "Social" },
  { name: "UserPlus", component: UserPlus, category: "Social" },
  { name: "UserCheck", component: UserCheck, category: "Social" },
  { name: "Globe", component: Globe, category: "Social" },
  { name: "Share2", component: Share2, category: "Social" },
  { name: "ThumbsUp", component: ThumbsUp, category: "Social" },

  // Comunicacion
  { name: "Phone", component: Phone, category: "Comunicacion" },
  { name: "Mail", component: Mail, category: "Comunicacion" },
  { name: "MessageCircle", component: MessageCircle, category: "Comunicacion" },
  { name: "Send", component: Send, category: "Comunicacion" },
  { name: "Bell", component: Bell, category: "Comunicacion" },
  { name: "Headphones", component: Headphones, category: "Comunicacion" },

  // Naturaleza
  { name: "Sun", component: Sun, category: "Naturaleza" },
  { name: "Moon", component: Moon, category: "Naturaleza" },
  { name: "CloudSun", component: CloudSun, category: "Naturaleza" },
  { name: "Droplets", component: Droplets, category: "Naturaleza" },
  { name: "Wind", component: Wind, category: "Naturaleza" },
  { name: "Flame", component: Flame, category: "Naturaleza" },
  { name: "TreePine", component: TreePine, category: "Naturaleza" },
  { name: "Mountain", component: Mountain, category: "Naturaleza" },
  { name: "Waves", component: Waves, category: "Naturaleza" },
  { name: "Sunrise", component: Sunrise, category: "Naturaleza" },
  { name: "Apple", component: Apple, category: "Naturaleza" },
  { name: "Salad", component: Salad, category: "Naturaleza" },
  { name: "Coffee", component: Coffee, category: "Naturaleza" },

  // Tecnologia
  { name: "Smartphone", component: Smartphone, category: "Tecnologia" },
  { name: "Monitor", component: Monitor, category: "Tecnologia" },
  { name: "Laptop", component: Laptop, category: "Tecnologia" },
  { name: "Wifi", component: Wifi, category: "Tecnologia" },
  { name: "Lock", component: Lock, category: "Tecnologia" },
  { name: "Key", component: Key, category: "Tecnologia" },
  { name: "Fingerprint", component: Fingerprint, category: "Tecnologia" },
  { name: "ScanFace", component: ScanFace, category: "Tecnologia" },
  { name: "Settings", component: Settings, category: "Tecnologia" },

  // General
  { name: "Check", component: Check, category: "General" },
  { name: "CheckCircle", component: CheckCircle, category: "General" },
  { name: "BadgeCheck", component: BadgeCheck, category: "General" },
  { name: "ArrowRight", component: ArrowRight, category: "General" },
  { name: "ArrowUpRight", component: ArrowUpRight, category: "General" },
  { name: "ExternalLink", component: ExternalLink, category: "General" },
  { name: "Link", component: Link, category: "General" },
  { name: "Eye", component: Eye, category: "General" },
  { name: "Search", component: Search, category: "General" },
  { name: "Calendar", component: Calendar, category: "General" },
  { name: "Clock", component: Clock, category: "General" },
  { name: "Timer", component: Timer, category: "General" },
  { name: "Camera", component: Camera, category: "General" },
  { name: "Image", component: Image, category: "General" },
  { name: "Video", component: Video, category: "General" },
  { name: "Play", component: Play, category: "General" },
  { name: "BookOpen", component: BookOpen, category: "General" },
  { name: "GraduationCap", component: GraduationCap, category: "General" },
  { name: "FileText", component: FileText, category: "General" },
  { name: "PenTool", component: PenTool, category: "General" },
  { name: "Home", component: Home, category: "General" },
  { name: "MapPin", component: MapPin, category: "General" },
  { name: "Building", component: Building, category: "General" },
]

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_LIBRARY.map(i => [i.name, i.component])
)

export const ALL_ICON_NAMES = ICON_LIBRARY.map(i => i.name)
