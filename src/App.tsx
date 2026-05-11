import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import {
  Menu, X, MessageCircle, Send, Phone, Mail, Clock, Activity,
  Brain, Scissors, Star, CheckCircle, ArrowRight, Zap, Shield,
  Heart, Bot, User, Minimize2, Facebook, Linkedin, Award, Users,
  TrendingUp, Calendar, ChevronDown, Quote, MapPin, ChevronRight,
} from "lucide-react";

const BRAND = {
  green: "#8CC63F",
  greenDark: "#6a9e2a",
  greenLight: "#a8d75a",
  blue: "#1B9AAA",
  blueDark: "#0e6b77",
  blueLight: "#2dbdd0",
  white: "#FFFFFF",
  offWhite: "#F0F8FF",
  navy: "#0A2540",
  navyMid: "#0D3156",
  navyLight: "#1A4570",
  muted: "#5A7A90",
  mutedLight: "#8AAFC0",
  orange: "#F7941D",
};

// ONLY background 1 and background 2
const BG_IMAGES = [
  "/images/background1.png",
  "/images/background2.png",
];

const PHONE = "+254718344444";
const WHATSAPP_NUMBER = "254718344444";
const EMAIL = "alignphysiotherapyclinic@gmail.com";
const INSTAGRAM = "https://www.instagram.com/alignphysiotherapykenya/";
const FACEBOOK = "https://www.facebook.com/people/Align-Physiotherapy-Sports-Clinic/100085870523880/";
const LINKEDIN = "https://ke.linkedin.com/in/pt-mary-kungu-bb81a091";
const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6!2d36.7290664!3d-1.3411852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a6bf7445dc1%3A0x1!2sAlign+Physiotherapy!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske";
const WA_BOOK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Align%20Physiotherapy%2C%20I%27d%20like%20to%20book%20an%20appointment.`;
const WA_GENERAL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Align%20Physiotherapy%2C%20I%27d%20like%20to%20inquire%20about%20your%20services.`;

interface ChatMessage { id: number; role: "bot" | "user"; text: string; timestamp: Date; }
type ChatStep = "greeting" | "ask_name" | "ask_injury" | "ask_date" | "ask_contact" | "confirm" | "done";
interface BookingData { name: string; injury: string; date: string; contact: string; }

function InstagramIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const SERVICES = [
  { icon: Activity, title: "Sports Injury Rehabilitation", subtitle: "Peak Performance Recovery", description: "Comprehensive biomechanical assessment and precision rehabilitation for acute and chronic sports injuries.", features: ["Biomechanical Assessment", "Return-to-Sport Protocols", "Taping & Strapping", "Performance Optimisation"], accent: BRAND.green, tag: "Most Requested" },
  { icon: Brain, title: "Neuro-Musculoskeletal Therapy", subtitle: "Holistic Neural Rehabilitation", description: "Advanced rehabilitation targeting the intricate interplay between your nervous system and musculoskeletal architecture.", features: ["Manual Therapy", "Dry Needling", "Pain Neuroscience", "Postural Realignment"], accent: BRAND.blue, tag: "Specialist Care" },
  { icon: Scissors, title: "Post-Surgical Rehabilitation", subtitle: "Structured Surgical Recovery", description: "Evidence-based, phased rehabilitation following orthopaedic surgery.", features: ["Oedema Management", "Scar Tissue Work", "Progressive Loading", "Functional Restoration"], accent: BRAND.orange, tag: "Post-Op Care" },
  { icon: Heart, title: "Chronic Pain Management", subtitle: "Liberation from Persistent Pain", description: "A transformative, multi-dimensional approach to persistent pain.", features: ["Pain Science Education", "Graded Exercise Therapy", "Lifestyle Integration", "Mind-Body Techniques"], accent: "#2196F3", tag: "Life-Changing" },
  { icon: TrendingUp, title: "Postural Correction", subtitle: "Alignment & Ergonomic Excellence", description: "Precision postural programs addressing imbalances at their source.", features: ["3D Postural Analysis", "Core Architecture", "Ergonomic Consultation", "Movement Re-education"], accent: BRAND.green, tag: "Preventive" },
  { icon: Zap, title: "Personalised Treatment Plans", subtitle: "Your Unique Recovery Blueprint", description: "Every treatment plan is a bespoke blueprint crafted around your condition and goals.", features: ["Comprehensive Assessment", "Goal Architecture", "Home Programme Design", "Progress Analytics"], accent: BRAND.blue, tag: "Bespoke" },
];

const REASONS = [
  { icon: Shield, title: "Evidence-Based Excellence", text: "Every protocol grounded in cutting-edge clinical research. No guesswork — only proven methodologies.", stat: "100%", statLabel: "Research-Backed" },
  { icon: Zap, title: "Accelerated Recovery", text: "Goal-oriented, structured progression to maximise recovery without compromising long-term outcomes.", stat: "4–6", statLabel: "Sessions to Relief" },
  { icon: Heart, title: "Patient-First Philosophy", text: "We listen before we treat. Your goals and lived experience architect every care decision.", stat: "98%", statLabel: "Satisfaction Rate" },
  { icon: Award, title: "Elite Qualifications", text: "Advanced-trained physiotherapists continuously sharpening expertise through professional development.", stat: "8+", statLabel: "Years of Excellence" },
];

const HOURS = [
  { day: "Monday – Friday", time: "7:00 AM – 6:30 PM", open: true },
  { day: "Saturday", time: "7:00 AM – 6:30 PM", open: true },
  { day: "Sunday", time: "Closed", open: false },
];

const TESTIMONIALS = [
  { name: "David M.", role: "Marathon Runner · Nairobi", text: "After my ACL injury, I thought my running career was finished at 34. Align's precision rehabilitation had me crossing finish lines again in just over 4 months. This is world-class care.", rating: 5, condition: "ACL Rehabilitation", initials: "DM" },
  { name: "Amina K.", role: "Corporate Executive · Westlands", text: "Years of debilitating chronic back pain dissolved after 6 sessions. They didn't just treat symptoms, they decoded why my body was suffering. I live without pain for the first time in a decade.", rating: 5, condition: "Chronic Back Pain", initials: "AK" },
  { name: "Brian O.", role: "Post-Surgical Patient", text: "My total knee replacement recovery was orchestrated with exceptional precision and warmth. The results surpassed every expectation. I walk freely — something I'd forgotten was possible.", rating: 5, condition: "Post-Surgical Rehab", initials: "BO" },
  { name: "Grace N.", role: "Professional Footballer", text: "Align's sports rehabilitation protocol understood the urgency of competitive sport. They rebuilt my ankle with precision and got me back on the pitch before the season ended.", rating: 5, condition: "Ankle Rehabilitation", initials: "GN" },
  { name: "James K.", role: "Software Engineer · Karen", text: "PT Mary's postural correction programme eliminated years of neck pain and tension headaches in three weeks. The ergonomic assessment transformed my workspace and wellbeing.", rating: 5, condition: "Postural Correction", initials: "JK" },
  { name: "Sarah W.", role: "Yoga Instructor · Langata", text: "Recurring shoulder pain that threatened my practice was resolved with extraordinary precision. They understood my specific mobility requirements and restored me fully within 5 weeks.", rating: 5, condition: "Shoulder Rehabilitation", initials: "SW" },
];

const FAQS = [
  { q: "Do I need a referral to book at Align?", a: "No referral is required. You may book directly with us. However, if your doctor has provided referral documentation or medical reports, please bring them — they enrich our understanding of your condition." },
  { q: "What should I wear to my first session?", a: "Comfortable, loose-fitting clothing that provides easy access to the area being treated. Shorts for knee or hip conditions; a vest or loose top for shoulder, neck, or back concerns." },
  { q: "How long does each session last?", a: "Your initial assessment is 60 minutes — a comprehensive evaluation covering your condition, goals, history, and commencement of treatment. Follow-up sessions are typically 45 minutes." },
  { q: "How many sessions will I need?", a: "Most patients experience meaningful improvement within 4–6 sessions. Following your initial assessment, we provide a clear treatment plan with realistic timelines." },
  { q: "Do you partner with insurance providers?", a: "We work with several Kenyan medical insurance providers and corporate wellness programmes. Please share your insurer's details when booking." },
  { q: "Do you offer home visit physiotherapy?", a: "Yes. For patients unable to travel due to their condition, we offer home visits. Contact us directly via phone or WhatsApp to discuss arrangements." },
  { q: "Where exactly is the clinic located?", a: "We are situated along Lang'ata Road in the Karen/Lang'ata area of Nairobi. Plus Code: MP5H+JJP Nairobi. WhatsApp us for precise directions." },
];

const BOT_RESPONSES: Record<ChatStep, (data?: Partial<BookingData>) => string> = {
  greeting: () => "Welcome to **Align Physiotherapy & Sports Injury Clinic**. 🌿\n\nI'm your personal AI Receptionist. I'm here to:\n• 📅 Schedule your appointment\n• 💬 Answer any questions\n• 📍 Help you find us in Karen, Nairobi\n\nHow may I assist you today?",
  ask_name: () => "I'd be honoured to arrange an appointment for you. 😊\n\nMay I begin with your **full name**?",
  ask_injury: (d) => `Thank you, **${d?.name}**. 🙏\n\nCould you briefly describe your **condition or injury**?\n\n_(e.g., knee pain, sports injury, back pain, post-surgery recovery)_`,
  ask_date: (d) => `We have specialists who excel in treating **${d?.injury}**.\n\nWhat is your **preferred date and time**?\n\n🕐 We're available Monday–Saturday, 7:00 AM – 6:30 PM`,
  ask_contact: (d) => `We'll prioritise a slot around **${d?.date}** for you. ✨\n\nYour **phone number or email address** so our team can confirm?`,
  confirm: (d) => `✅ **Booking Request Confirmed!**\n\n**Name:** ${d?.name}\n**Condition:** ${d?.injury}\n**Date:** ${d?.date}\n**Contact:** ${d?.contact}\n\nOur team will reach out **within 1–2 hours**. 📱`,
  done: () => `Is there anything else I can assist with?\n\n📍 Lang'ata Road, Karen/Langata, Nairobi\n📞 +254 718 344444\n📧 alignphysiotherapyclinic@gmail.com\n\nWe look forward to your visit. 💚`,
};

const STEP_ORDER: ChatStep[] = ["greeting", "ask_name", "ask_injury", "ask_date", "ask_contact", "confirm", "done"];

function renderBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong> : <span key={i}>{part}</span>
  );
}

function SEOHead() {
  useEffect(() => {
    document.title = "Align Physiotherapy & Sports Injury Clinic | Karen, Nairobi";
  }, []);
  return null;
}

function GlobalStyles() {
  useEffect(() => {
    const id = "align-global-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; background: #0A2540; color: #0A2540; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0A2540; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #8CC63F, #1B9AAA); border-radius: 4px; }
      .chat-scroll::-webkit-scrollbar { width: 3px; }
      .chat-scroll::-webkit-scrollbar-thumb { background: rgba(140,198,63,0.3); border-radius: 3px; }
      input, select, textarea { font-family: 'Inter', sans-serif; }
      @keyframes pulse-wa { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,0.4)} 50%{box-shadow:0 0 0 16px rgba(37,211,102,0)} }
      .wa-pulse { animation: pulse-wa 2.5s ease-in-out infinite; }
      @keyframes typing { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      .typing-dot:nth-child(1){animation:typing 1.2s ease-in-out infinite 0s}
      .typing-dot:nth-child(2){animation:typing 1.2s ease-in-out infinite 0.2s}
      .typing-dot:nth-child(3){animation:typing 1.2s ease-in-out infinite 0.4s}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes kb0 { 0%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.07) translate(-1.5%,-1%)} 100%{transform:scale(1) translate(0,0)} }
      @keyframes kb1 { 0%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.07) translate(1.5%,1%)} 100%{transform:scale(1) translate(0,0)} }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem", background: dark ? "rgba(255,255,255,0.15)" : "rgba(27,154,170,0.1)", color: dark ? "#FFFFFF" : BRAND.blue, border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "rgba(27,154,170,0.25)"}` }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BRAND.green, display: "inline-block" }} />
      {children}
    </motion.div>
  );
}

// ── CINEMATIC SLIDESHOW — only 2 images ──────────────────────────────────────
function CinematicSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % BG_IMAGES.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
      {BG_IMAGES.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === idx ? 1 : 0,
          transition: "opacity 2s ease-in-out",
          animation: `${i === 0 ? "kb0" : "kb1"} 16s ease-in-out infinite`,
          willChange: "opacity, transform",
        }} />
      ))}
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,37,64,0.80) 0%,rgba(10,37,64,0.60) 50%,rgba(10,37,64,0.78) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to top,rgba(10,37,64,0.85),transparent)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom,rgba(10,37,64,0.60),transparent)" }} />
    </div>
  );
}

// ── Section wrapper — just a coloured overlay on top of the fixed slideshow ──
function SectionBg({ children, light, style: extra }: { children: React.ReactNode; light?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", ...extra }}>
      <div style={{ position: "absolute", inset: 0, background: light ? "rgba(240,248,255,0.94)" : "rgba(10,37,64,0.91)", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── NAVBAR — WHITE BACKGROUND, BIGGER LOGO ───────────────────────────────────
function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const u = scrollY.on("change", v => setScrolled(v > 60));
    return u;
  }, [scrollY]);

  const NAV = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Why Align", href: "#why-us" },
    { label: "Team", href: "#team" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#location" },
  ];

  return (
    <motion.nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "#ffffff",
        transition: "all 0.3s ease",
        padding: scrolled ? "6px 0" : "12px 0",
        borderBottom: "1px solid #eee",
        width: "100%", // Ensures it doesn't exceed screen
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo - Made larger for mobile visibility */}
        <a href="#" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo1.jpg"
            alt="Logo"
            style={{
              height: scrolled ? "45px" : "55px", // Taller than before
              width: "auto",
              mixBlendMode: "multiply" 
            }}
          />
        </a>

        {/* Desktop Links (Hidden on mobile) */}
        <div className="desktop-nav" style={{ display: "none", gap: "25px" }}>
          {NAV.map(l => (
            <a key={l.label} href={l.href} style={{ textDecoration: "none", color: BRAND.navy, fontWeight: 600, fontSize: "0.9rem" }}>{l.label}</a>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Phone Link - HIDDEN ON MOBILE to save space */}
          <a href={`tel:${PHONE}`} className="phone-link" style={{ display: "none", alignItems: "center", gap: "5px", textDecoration: "none", color: BRAND.navy, fontWeight: 700, fontSize: "0.8rem", padding: "8px 12px", background: "#f5f5f5", borderRadius: "50px" }}>
            <Phone size={14} color={BRAND.green} /> {PHONE}
          </a>

          <button onClick={onBookNow} style={{ padding: "10px 18px", borderRadius: "50px", background: BRAND.green, color: "white", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
            Book Now
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-toggle" style={{ background: "none", border: "none", cursor: "pointer", color: BRAND.navy, display: "flex", alignItems: "center" }}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{ background: "white", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", borderTop: "1px solid #eee" }}>
          {NAV.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: BRAND.navy, fontWeight: 600, fontSize: "1.1rem" }}>{l.label}</a>
          ))}
          <a href={`tel:${PHONE}`} style={{ color: BRAND.green, fontWeight: 700, textDecoration: "none" }}>Call: {PHONE}</a>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .phone-link { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
// ── HERO — white card REMOVED, clean full-width hero ─────────────────────────
function HeroSection({ onBookNow }: { onBookNow: () => void }) {
  const [phase, setPhase] = useState(0);
  const phrases = ["Restore Movement.", "Reclaim Life.", "Redefine Limits.", "Return Stronger."];
  useEffect(() => { const t = setInterval(() => setPhase(p => (p + 1) % phrases.length), 3500); return () => clearInterval(t); }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", zIndex: 10 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", width: "100%", paddingTop: "130px", paddingBottom: "80px" }}>

        {/* Single centered column — no white card box */}
        <div style={{ maxWidth: "820px" }}>

          {/* Location pill */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "9999px", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BRAND.green, animation: "pulse 2s infinite" }} />
            Karen · Lang'ata · Nairobi, Kenya
            <span style={{ padding: "2px 8px", borderRadius: "9999px", background: "rgba(140,198,63,0.3)", fontSize: "0.62rem" }}>Open Mon–Sat</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem,9vw,7rem)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.0, marginBottom: "4px", textShadow: "0 2px 30px rgba(10,37,64,0.5)" }}>
            We Help You
          </motion.h1>

          {/* Animated phrase */}
          <div style={{ height: "clamp(4rem,10vw,7.5rem)", overflow: "hidden", marginBottom: "28px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={phase}
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem,9vw,7rem)", fontWeight: 900, fontStyle: "italic", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.0 }}>
                {phrases[phase]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.7 }}
            style={{ width: "90px", height: "3px", background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue})`, marginBottom: "28px", transformOrigin: "left", borderRadius: "2px" }} />

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ fontSize: "clamp(1.1rem,2.5vw,1.35rem)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, maxWidth: "620px", marginBottom: "40px" }}>
            Nairobi's premier physiotherapy clinic — where{" "}
            <span style={{ color: BRAND.greenLight, fontWeight: 500 }}>evidence-based science</span> meets{" "}
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>compassionate human care</span>{" "}
            to engineer extraordinary recoveries.
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "36px", marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
            {[
              { value: "500+", label: "Lives Transformed" },
              { value: "8+", label: "Years of Excellence" },
              { value: "98%", label: "Patient Satisfaction" },
              { value: "6", label: "Specialist Services" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: BRAND.green, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.62)", marginTop: "5px" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "32px" }}>
            <motion.button onClick={onBookNow}
              whileHover={{ scale: 1.04, boxShadow: "0 14px 45px rgba(140,198,63,0.65)" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 32px", borderRadius: "9999px", fontSize: "1rem", fontWeight: 700, color: "white", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, border: "none", cursor: "pointer", boxShadow: "0 8px 30px rgba(140,198,63,0.45)" }}>
              <Calendar style={{ width: "19px", height: "19px" }} />
              Book Your Assessment
              <ArrowRight style={{ width: "17px", height: "17px" }} />
            </motion.button>

            <motion.a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 28px", borderRadius: "9999px", fontSize: "1rem", fontWeight: 600, color: "white", textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
              <WhatsAppIcon style={{ width: "19px", height: "19px", color: "#25D366" }} />
              WhatsApp Us
            </motion.a>

            <motion.a href={`tel:${PHONE}`}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 24px", borderRadius: "9999px", fontSize: "1rem", fontWeight: 600, color: "white", textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <Phone style={{ width: "18px", height: "18px", color: BRAND.green }} />
              {PHONE}
            </motion.a>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex" }}>
              {["DM", "AK", "BO", "GN", "JK"].map((init, i) => (
                <div key={i} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: "white", marginLeft: i > 0 ? "-10px" : 0, background: `hsl(${150 + i * 30},45%,35%)`, zIndex: 5 - i }}>
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "3px" }}>
                {[...Array(5)].map((_, i) => <Star key={i} style={{ width: "14px", height: "14px", fill: BRAND.orange, color: BRAND.orange }} />)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)" }}>
                Trusted by <strong style={{ color: "#fff" }}>500+ patients</strong> across Nairobi
              </div>
            </div>
          </motion.div>
        </div>

        {/* Location + hours info strip at bottom */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
          style={{ marginTop: "56px", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <MapPin style={{ width: "15px", height: "15px", color: BRAND.green }} />
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>Lang'ata Road, Karen/Lang'ata, Nairobi</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Clock style={{ width: "15px", height: "15px", color: BRAND.green }} />
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>Mon–Sat: 7:00 AM – 6:30 PM</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Phone style={{ width: "15px", height: "15px", color: BRAND.green }} />
            <a href={`tel:${PHONE}`} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.88)", fontWeight: 500, textDecoration: "none" }}>{PHONE}</a>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 2 }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Scroll to Explore</div>
        <ChevronDown style={{ width: "18px", height: "18px", color: BRAND.green }} />
      </motion.div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </section>
  );
}// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const storyBeats = [
    {
      chapter: "The Beginning",
      text: "It started with a question: why should world-class physiotherapy be a privilege? Along Lang'ata Road in Karen, Nairobi, a clinic was born to change that.",
    },
    {
      chapter: "The Conviction",
      text: "PT Mary Kungu built Align on a simple truth — pain is not a life sentence. With every patient, she brings both clinical precision and genuine human warmth.",
    },
    {
      chapter: "Today",
      text: "500+ lives moved better. 8 years of evidence-based care. One unwavering belief: treat the person, not just the condition.",
    },
  ];

  return (
    <SectionBg light style={{ padding: "120px 0" }}>
      <section id="about" ref={ref}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{ display: "grid", gap: "80px", alignItems: "center" }}
            className="about-grid"
          >
            {/* ── LEFT: Story ── */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>Our Story</SectionLabel>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem,5vw,4rem)",
                  fontWeight: 900,
                  color: BRAND.navy,
                  lineHeight: 1.1,
                  marginBottom: "20px",
                }}
              >
                Where Precision Meets{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: `linear-gradient(135deg,${BRAND.green},${BRAND.blue})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Compassion.
                </span>
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "3px",
                  background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue})`,
                  marginBottom: "40px",
                  borderRadius: "2px",
                }}
              />

              {/* ── Story Beats ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                  marginBottom: "40px",
                }}
              >
                {storyBeats.map((beat, i) => (
                  <motion.div
                    key={beat.chapter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
                  >
                    {/* Timeline dot + line */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            i === 0
                              ? BRAND.green
                              : i === 1
                              ? BRAND.blue
                              : BRAND.navy,
                          marginTop: "4px",
                          boxShadow: `0 0 0 3px ${
                            i === 0
                              ? "rgba(140,198,63,0.25)"
                              : i === 1
                              ? "rgba(27,154,170,0.25)"
                              : "rgba(10,37,64,0.2)"
                          }`,
                        }}
                      />
                      {i < storyBeats.length - 1 && (
                        <div
                          style={{
                            width: "2px",
                            flex: 1,
                            minHeight: "36px",
                            background: "rgba(10,37,64,0.12)",
                            marginTop: "6px",
                            borderRadius: "2px",
                          }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color:
                            i === 0
                              ? BRAND.green
                              : i === 1
                              ? BRAND.blue
                              : BRAND.navy,
                          marginBottom: "8px",
                        }}
                      >
                        {beat.chapter}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.2rem",
                          color: "#2d3748",          // ← darker for visibility
                          lineHeight: 1.85,
                          margin: 0,
                          fontWeight: 500,           // ← slightly bolder
                        }}
                      >
                        {beat.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Mission & Vision — white box restored ── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    icon: Heart,
                    title: "Our Mission",
                    text: "To restore movement, dissolve pain, and empower every patient to live their fullest life.",
                    accent: BRAND.green,
                  },
                  {
                    icon: Star,
                    title: "Our Vision",
                    text: "To be East Africa's most trusted physiotherapy clinic — synonymous with clinical excellence.",
                    accent: BRAND.blue,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -4 }}
                      style={{
                        background: "rgba(255,255,255,0.98)",   // ← white box restored
                        border: `1px solid rgba(27,154,170,0.15)`,
                        borderRadius: "16px",
                        padding: "22px",
                        boxShadow: "0 4px 24px rgba(10,37,64,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: `${item.accent}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <Icon
                          style={{
                            width: "18px",
                            height: "18px",
                            color: item.accent,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontWeight: 800,          // ← bolder
                          fontSize: "0.9rem",       // ← slightly larger
                          color: BRAND.navy,
                          marginBottom: "8px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",      // ← larger
                          color: "#4a5568",         // ← darker muted
                          lineHeight: 1.7,
                          fontWeight: 500,
                        }}
                      >
                        {item.text}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Value Badges ── */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "Patient-Centred",
                  "Evidence-Based",
                  "Results-Driven",
                  "Compassionate",
                  "Professional",
                ].map((v) => (
                  <span
                    key={v}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "9999px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: "rgba(27,154,170,0.08)",
                      color: BRAND.blue,
                      border: "1px solid rgba(27,154,170,0.22)",
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Clinic Image only — Mary card removed ── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ position: "relative" }}>
                {/* ── Main clinic / team photo ── */}
                <motion.div
                  whileHover={{ y: -8 }}
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 40px 80px rgba(10,37,64,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "480px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src="/images/teamleader.png"
                      alt="Align Physiotherapy Team"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                        if (el.parentElement) {
                          el.parentElement.style.background = `linear-gradient(135deg,${BRAND.green},${BRAND.blue})`;
                          el.parentElement.style.display = "flex";
                          el.parentElement.style.alignItems = "center";
                          el.parentElement.style.justifyContent = "center";
                          el.parentElement.innerHTML = `<span style="font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;color:white;text-align:center">Align<br/>Physiotherapy</span>`;
                        }
                      }}
                    />
                    {/* Subtle bottom overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100px",
                        background:
                          "linear-gradient(to top, rgba(10,37,64,0.35), transparent)",
                      }}
                    />
                    {/* Bottom text overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        right: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        Align Physiotherapy & Sports Injury Clinic
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.8)",
                          marginTop: "2px",
                        }}
                      >
                        Lang'ata Road, Karen · Nairobi, Kenya
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Floating badge: Years ── */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "-16px",
                    background: "white",
                    border: "1px solid rgba(140,198,63,0.3)",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    boxShadow: "0 8px 25px rgba(10,37,64,0.14)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: BRAND.green,
                      lineHeight: 1,
                    }}
                  >
                    8+
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: BRAND.muted,
                      fontWeight: 600,
                      marginTop: "3px",
                    }}
                  >
                    Years Exp.
                  </div>
                </motion.div>

                {/* ── Floating badge: Patients ── */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  style={{
                    position: "absolute",
                    bottom: "100px",
                    left: "-16px",
                    background: "white",
                    border: "1px solid rgba(27,154,170,0.3)",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    boxShadow: "0 8px 25px rgba(10,37,64,0.14)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: BRAND.blue,
                      lineHeight: 1,
                    }}
                  >
                    500+
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: BRAND.muted,
                      fontWeight: 600,
                      marginTop: "3px",
                    }}
                  >
                    Happy Patients
                  </div>
                </motion.div>

                {/* ── Left accent line ── */}
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    bottom: "40px",
                    left: "-4px",
                    width: "3px",
                    borderRadius: "2px",
                    background: `linear-gradient(180deg,${BRAND.green},${BRAND.blue})`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <style>{`
        @media(min-width:1024px){
          .about-grid{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </SectionBg>
  );
}
// ── SERVICES ──────────────────────────────────────────────────────────────────
function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <SectionBg style={{ padding: "120px 0" }}>
      <section id="services">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "64px" }}>
            <SectionLabel dark>Our Specialities</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "12px" }}>
              Comprehensive Care,<span style={{ fontStyle: "italic", color: BRAND.green }}> Extraordinary Outcomes.</span>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 auto" }}>
              Six specialist services, one unwavering commitment — your complete recovery.
            </p>
          </motion.div>
          <div style={{ display: "grid", gap: "20px" }} className="services-grid">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }}
                  whileHover={{ y: -6 }} onClick={() => setActive(active === i ? null : i)}
                  style={{ background: active === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)", border: `1px solid ${active === i ? service.accent + "50" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", padding: "28px", cursor: "pointer", transition: "all 0.4s ease", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${service.accent},transparent)`, opacity: active === i ? 1 : 0, transition: "opacity 0.3s" }} />
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${service.accent}20`, border: `1px solid ${service.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: "21px", height: "21px", color: service.accent }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "3px" }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{service.title}</h3>
                        <span style={{ padding: "3px 10px", borderRadius: "9999px", fontSize: "0.63rem", fontWeight: 700, background: `${service.accent}20`, color: service.accent, border: `1px solid ${service.accent}30` }}>{service.tag}</span>
                      </div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: service.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>{service.subtitle}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.7, marginBottom: "14px" }}>{service.description}</p>
                  <AnimatePresence>
                    {active === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                          {service.features.map(feat => (
                            <div key={feat} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>
                              <CheckCircle style={{ width: "13px", height: "13px", color: service.accent, flexShrink: 0 }} />{feat}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <a href={WA_BOOK} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: service.accent, textDecoration: "none" }}>
                      Book This Service <ArrowRight style={{ width: "13px", height: "13px" }} />
                    </a>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>{active === i ? "▲ Less" : "▼ More"}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: "48px" }}>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>Unsure which service you need? We'll guide you.</p>
            <motion.a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "9999px", fontSize: "0.9375rem", fontWeight: 600, color: "white", textDecoration: "none", background: "#25D366" }}>
              <WhatsAppIcon style={{ width: "18px", height: "18px" }} />Free Consultation on WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>
      <style>{`@media(min-width:768px){.services-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(min-width:1280px){.services-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
    </SectionBg>
  );
}

// ── WHY US ────────────────────────────────────────────────────────────────────
function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <SectionBg light style={{ padding: "120px 0" }}>
      <section id="why-us" ref={ref}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gap: "64px", alignItems: "center" }} className="whyus-grid">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <SectionLabel>Why Choose Align</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, color: BRAND.navy, lineHeight: 1.1, marginBottom: "20px" }}>
                Excellence is Not<br /><span style={{ fontStyle: "italic", color: BRAND.green }}>An Accident.</span>
              </h2>
              <div style={{ width: "60px", height: "3px", background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue})`, marginBottom: "24px", borderRadius: "2px" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: BRAND.muted, lineHeight: 1.9, marginBottom: "28px" }}>
                At Align, every decision is engineered around your complete, lasting recovery. We don't follow trends. We follow evidence.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
                {[{ v: "20+", l: "Sports Disciplines" }, { v: "50+", l: "Conditions Managed" }, { v: "4–6", l: "Sessions to Relief" }, { v: "98%", l: "Satisfaction" }].map((s, i) => (
                  <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ y: -4 }}
                    style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(27,154,170,0.12)", borderRadius: "14px", padding: "18px 14px", boxShadow: "0 4px 15px rgba(10,37,64,0.06)" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.65rem", fontWeight: 800, color: BRAND.blue }}>{s.v}</div>
                    <div style={{ fontSize: "0.72rem", color: BRAND.muted }}>{s.l}</div>
                  </motion.div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <a href={`tel:${PHONE}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 500, color: BRAND.green, textDecoration: "none", background: "rgba(140,198,63,0.1)", border: "1px solid rgba(140,198,63,0.25)" }}>
                  <Phone style={{ width: "14px", height: "14px" }} />{PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 500, color: BRAND.blue, textDecoration: "none", background: "rgba(27,154,170,0.08)", border: "1px solid rgba(27,154,170,0.2)" }}>
                  <Mail style={{ width: "14px", height: "14px" }} />Email Us
                </a>
              </div>
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {REASONS.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.div key={r.title} initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} whileHover={{ x: 8 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: "16px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(27,154,170,0.1)", borderRadius: "18px", padding: "22px", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(10,37,64,0.06)" }}>
                    <div style={{ flexShrink: 0, textAlign: "center", minWidth: "60px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(140,198,63,0.1)", border: "1px solid rgba(140,198,63,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                        <Icon style={{ width: "20px", height: "20px", color: BRAND.green }} />
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 800, color: BRAND.blue }}>{r.stat}</div>
                      <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted }}>{r.statLabel}</div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "0.9375rem", color: BRAND.navy, marginBottom: "5px" }}>{r.title}</h4>
                      <p style={{ fontSize: "0.8375rem", color: BRAND.muted, lineHeight: 1.7 }}>{r.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(min-width:1024px){.whyus-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
    </SectionBg>
  );
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function TeamSection() {
  return (
    <SectionBg style={{ padding: "120px 0" }}>
      <section id="team">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionLabel dark>Our Practitioners</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
              The Expert Behind<span style={{ fontStyle: "italic", color: BRAND.green }}> Your Recovery.</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
            style={{ borderRadius: "28px", overflow: "hidden", marginBottom: "32px", background: "rgba(255,255,255,0.96)", border: "1px solid rgba(140,198,63,0.2)", boxShadow: "0 40px 80px rgba(10,37,64,0.4)" }}>
            <div style={{ height: "3px", background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue},${BRAND.orange})` }} />
            <div style={{ display: "grid", alignItems: "center" }} className="team-grid">
              <div style={{ padding: "40px 36px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "9999px", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", background: "rgba(140,198,63,0.12)", color: BRAND.green, border: "1px solid rgba(140,198,63,0.25)" }}>
                  <Award style={{ width: "11px", height: "11px" }} />Clinic Director · Lead Physiotherapist
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: BRAND.navy, marginBottom: "6px" }}>PT Mary Kungu</h3>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: BRAND.green, marginBottom: "16px" }}>BSc. Physiotherapy · Certified Sports Rehabilitation Specialist</p>
                <p style={{ fontSize: "0.9rem", color: BRAND.muted, lineHeight: 1.8, marginBottom: "24px" }}>
                  PT Mary Kungu is the visionary founder of Align — a physiotherapist of exceptional calibre whose passion for restoring human potential drives every aspect of our clinic. Her expertise spans sports injury rehabilitation, complex musculoskeletal conditions, and chronic pain management.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "24px" }}>
                  {["Sports Rehabilitation", "Manual Therapy", "Musculoskeletal Physio", "Chronic Pain", "Postural Correction", "Biomechanics"].map(s => (
                    <span key={s} style={{ padding: "4px 11px", borderRadius: "9999px", fontSize: "0.68rem", fontWeight: 600, background: "rgba(27,154,170,0.08)", color: BRAND.blue, border: "1px solid rgba(27,154,170,0.2)" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <a href={LINKEDIN} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: 600, color: "white", textDecoration: "none", background: "#0077B5" }}>
                    <Linkedin style={{ width: "14px", height: "14px" }} />LinkedIn
                  </a>
                  <a href={WA_BOOK} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: 600, color: BRAND.green, textDecoration: "none", background: "rgba(140,198,63,0.1)", border: "1px solid rgba(140,198,63,0.3)" }}>
                    <Calendar style={{ width: "14px", height: "14px" }} />Book with Mary
                  </a>
                </div>
              </div>
              <div className="team-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <div style={{ position: "relative" }}>
                  <motion.div animate={{ boxShadow: [`0 0 40px rgba(140,198,63,0.3)`,`0 0 80px rgba(140,198,63,0.5)`,`0 0 40px rgba(140,198,63,0.3)`] }} transition={{ duration: 3, repeat: Infinity }}
                    style={{ width: "220px", height: "220px", borderRadius: "50%", overflow: "hidden", border: `4px solid ${BRAND.green}` }}>
                    <img src="/images/teamleader.png" alt="PT Mary Kungu"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                        const p = el.parentElement;
                        if (p) { p.style.background = `linear-gradient(135deg,${BRAND.green},${BRAND.blue})`; p.innerHTML = `<span style="font-family:'Playfair Display',serif;font-size:5rem;font-weight:900;color:white;display:flex;align-items:center;justify-content:center;width:100%;height:100%">MK</span>`; }
                      }} />
                  </motion.div>
                  <div style={{ position: "absolute", bottom: "-8px", right: "-8px", width: "52px", height: "52px", borderRadius: "50%", background: BRAND.orange, border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award style={{ width: "22px", height: "22px", color: "white" }} />
                  </div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}
                    style={{ position: "absolute", top: "-16px", left: "-60px", background: "white", border: "1px solid rgba(140,198,63,0.3)", borderRadius: "12px", padding: "10px 14px", boxShadow: "0 8px 20px rgba(10,37,64,0.12)" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: BRAND.green }}>8+</div>
                    <div style={{ fontSize: "0.62rem", color: BRAND.muted }}>Years Exp.</div>
                  </motion.div>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    style={{ position: "absolute", bottom: "-12px", left: "-70px", background: "white", border: "1px solid rgba(27,154,170,0.3)", borderRadius: "12px", padding: "10px 14px", boxShadow: "0 8px 20px rgba(10,37,64,0.12)" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: BRAND.blue }}>500+</div>
                    <div style={{ fontSize: "0.62rem", color: BRAND.muted }}>Patients</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <div style={{ display: "grid", gap: "14px" }} className="facilities-grid">
            {[
              { icon: Shield, title: "Modern Therapeutic Equipment", text: "State-of-the-art rehabilitation technology for accelerated recovery." },
              { icon: Users, title: "Private Assessment Suites", text: "Confidential rooms where focused one-on-one care is never compromised." },
              { icon: Award, title: "Elite Clinical Team", text: "Continuously developing specialists at the pinnacle of physiotherapy excellence." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                  style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "18px", padding: "26px", textAlign: "center", backdropFilter: "blur(10px)" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "rgba(140,198,63,0.15)", border: "1px solid rgba(140,198,63,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <Icon style={{ width: "22px", height: "22px", color: BRAND.green }} />
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#fff", marginBottom: "7px" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.8375rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <style>{`
        @media(min-width:768px){.team-grid{grid-template-columns:1fr 1fr!important;}.team-avatar{display:flex!important;}.facilities-grid{grid-template-columns:repeat(3,1fr)!important;}}
        @media(max-width:767px){.team-avatar{display:none!important;}}
      `}</style>
    </SectionBg>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <SectionBg light style={{ padding: "120px 0" }}>
      <section id="testimonials">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionLabel>Patient Stories</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, color: BRAND.navy, lineHeight: 1.1, marginBottom: "12px" }}>
              Stories of<span style={{ fontStyle: "italic", color: BRAND.green }}> Transformation.</span>
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "2px" }}>{[...Array(5)].map((_, i) => <Star key={i} style={{ width: "15px", height: "15px", fill: BRAND.orange, color: BRAND.orange }} />)}</div>
              <span style={{ fontWeight: 700, color: BRAND.navy }}>5.0</span>
              <span style={{ color: BRAND.muted, fontSize: "0.85rem" }}>· Based on patient feedback across Nairobi</span>
            </div>
          </motion.div>

          <div style={{ display: "none" }} className="testimonials-desktop">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -7 }}
                  style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(27,154,170,0.12)", borderRadius: "20px", padding: "26px", boxShadow: "0 8px 30px rgba(10,37,64,0.08)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue})` }} />
                  <Quote style={{ width: "26px", height: "26px", color: BRAND.blue, opacity: 0.3, marginBottom: "10px" }} />
                  <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>{[...Array(t.rating)].map((_, idx) => <Star key={idx} style={{ width: "12px", height: "12px", fill: BRAND.orange, color: BRAND.orange }} />)}</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: BRAND.navy, lineHeight: 1.75, marginBottom: "18px", fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg,${BRAND.green},${BRAND.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "white" }}>{t.initials}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: BRAND.navy }}>{t.name}</div>
                        <div style={{ fontSize: "0.72rem", color: BRAND.muted }}>{t.role}</div>
                      </div>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "9999px", fontSize: "0.62rem", fontWeight: 600, background: "rgba(140,198,63,0.1)", color: BRAND.green, border: "1px solid rgba(140,198,63,0.25)" }}>{t.condition}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="testimonials-mobile">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(27,154,170,0.15)", borderRadius: "20px", padding: "26px", boxShadow: "0 8px 30px rgba(10,37,64,0.08)" }}>
                <Quote style={{ width: "22px", height: "22px", color: BRAND.blue, opacity: 0.4, marginBottom: "10px" }} />
                <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>{[...Array(TESTIMONIALS[current].rating)].map((_, i) => <Star key={i} style={{ width: "12px", height: "12px", fill: BRAND.orange, color: BRAND.orange }} />)}</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: BRAND.navy, lineHeight: 1.75, marginBottom: "18px", fontStyle: "italic" }}>"{TESTIMONIALS[current].text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg,${BRAND.green},${BRAND.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "white" }}>{TESTIMONIALS[current].initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: BRAND.navy }}>{TESTIMONIALS[current].name}</div>
                    <div style={{ fontSize: "0.72rem", color: BRAND.muted }}>{TESTIMONIALS[current].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "20px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => { setCurrent(i); setAuto(false); }}
                  style={{ borderRadius: "9999px", border: "none", cursor: "pointer", transition: "all 0.3s", background: i === current ? BRAND.blue : "rgba(27,154,170,0.25)", width: i === current ? "24px" : "8px", height: "8px", padding: 0 }} />
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: "40px" }}>
            <motion.a href={WA_BOOK} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "9999px", fontSize: "0.9375rem", fontWeight: 600, color: "white", textDecoration: "none", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})` }}>
              <Calendar style={{ width: "17px", height: "17px" }} />Begin Your Transformation<ArrowRight style={{ width: "15px", height: "15px" }} />
            </motion.a>
          </motion.div>
        </div>
      </section>
      <style>{`@media(min-width:768px){.testimonials-desktop{display:block!important;}.testimonials-mobile{display:none!important;}}@media(max-width:767px){.testimonials-mobile{display:block!important;}}`}</style>
    </SectionBg>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SectionBg style={{ padding: "120px 0" }}>
      <section>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionLabel dark>Common Questions</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
              Questions,<span style={{ fontStyle: "italic", color: BRAND.green }}> Answered.</span>
            </h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{ background: open === i ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)", border: `1px solid ${open === i ? "rgba(140,198,63,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: "14px", overflow: "hidden", marginBottom: "4px", transition: "all 0.3s" }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "14px" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: open === i ? "#fff" : "rgba(255,255,255,0.88)", flex: 1, lineHeight: 1.5 }}>{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: open === i ? BRAND.green : "rgba(140,198,63,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ChevronDown style={{ width: "15px", height: "15px", color: open === i ? "white" : BRAND.green }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div style={{ padding: "0 22px 18px", fontSize: "0.9rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginTop: "40px", padding: "28px", borderRadius: "20px", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: "8px" }}>Still have a question?</h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.62)", marginBottom: "18px" }}>Our team responds within minutes.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, color: "white", textDecoration: "none", background: "#25D366" }}>
                <WhatsAppIcon style={{ width: "15px", height: "15px" }} />WhatsApp Us
              </a>
              <a href={`tel:${PHONE}`}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.88)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.09)" }}>
                <Phone style={{ width: "13px", height: "13px", color: BRAND.green }} />Call {PHONE}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </SectionBg>
  );
}

// ── BOOKING ───────────────────────────────────────────────────────────────────
function BookingSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", date: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const msg = `Hello Align Physiotherapy!%0A%0A*New Booking Request*%0A*Name:* ${form.name}%0A*Phone:* ${form.phone}%0A*Email:* ${form.email}%0A*Service:* ${form.service}%0A*Date:* ${form.date}%0A*Notes:* ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    window.open(`mailto:${EMAIL}?subject=${encodeURIComponent(`Booking - ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service}\nDate: ${form.date}\nNotes: ${form.message}`)}`);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };
  const inp: React.CSSProperties = { width: "100%", padding: "13px 15px", borderRadius: "12px", fontSize: "0.9rem", background: "rgba(255,255,255,0.92)", border: "1px solid rgba(27,154,170,0.2)", color: BRAND.navy, outline: "none", fontFamily: "Inter,sans-serif", transition: "border-color 0.2s" };

  return (
    <SectionBg light style={{ padding: "120px 0" }}>
      <section id="booking">
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "48px" }}>
            <SectionLabel>Book an Appointment</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.5rem)", fontWeight: 900, color: BRAND.navy, lineHeight: 1.1 }}>
              Your Journey Begins<span style={{ fontStyle: "italic", color: BRAND.green }}> Here.</span>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: BRAND.muted, marginTop: "10px" }}>
              Complete the form below. We confirm within 1–2 hours via WhatsApp or email.
            </p>
          </motion.div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "56px 28px", borderRadius: "24px", background: "rgba(255,255,255,0.98)", border: "1px solid rgba(140,198,63,0.2)", boxShadow: "0 20px 60px rgba(10,37,64,0.1)" }}>
                <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle style={{ width: "34px", height: "34px", color: "white" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.875rem", fontWeight: 800, color: BRAND.navy, marginBottom: "10px" }}>Booking Request Sent!</h3>
                <p style={{ color: BRAND.muted, marginBottom: "24px" }}>We'll confirm within 1–2 hours via WhatsApp or email.</p>
                <button onClick={() => setSent(false)} style={{ padding: "10px 22px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, color: BRAND.green, background: "rgba(140,198,63,0.1)", border: "1px solid rgba(140,198,63,0.25)", cursor: "pointer" }}>Book Another</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}
                style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(27,154,170,0.12)", borderRadius: "24px", padding: "36px", boxShadow: "0 20px 60px rgba(10,37,64,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-grid">
                  {[{ label: "Full Name *", name: "name", type: "text", placeholder: "e.g. John Kamau", required: true },
                    { label: "Phone Number *", name: "phone", type: "tel", placeholder: "+254 7XX XXX XXX", required: true },
                    { label: "Email Address", name: "email", type: "email", placeholder: "your@email.com", required: false }].map(f => (
                    <div key={f.name} style={{ gridColumn: "span 1" }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: BRAND.navy, marginBottom: "7px" }}>{f.label}</label>
                      <input type={f.type} name={f.name} value={(form as Record<string, string>)[f.name]} onChange={handle} required={f.required} placeholder={f.placeholder} style={inp}
                        onFocus={e => (e.currentTarget.style.borderColor = BRAND.blue)} onBlur={e => (e.currentTarget.style.borderColor = "rgba(27,154,170,0.2)")} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "span 1" }}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: BRAND.navy, marginBottom: "7px" }}>Service Needed *</label>
                    <select name="service" value={form.service} onChange={handle} required style={{ ...inp, color: form.service ? BRAND.navy : BRAND.muted }}
                      onFocus={e => (e.currentTarget.style.borderColor = BRAND.blue)} onBlur={e => (e.currentTarget.style.borderColor = "rgba(27,154,170,0.2)")}>
                      <option value="" disabled>Select a service</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      <option value="Not sure — need consultation">Not sure — need consultation</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: BRAND.navy, marginBottom: "7px" }}>Preferred Date *</label>
                    <input type="date" name="date" value={form.date} onChange={handle} required min={new Date().toISOString().split("T")[0]} style={inp}
                      onFocus={e => (e.currentTarget.style.borderColor = BRAND.blue)} onBlur={e => (e.currentTarget.style.borderColor = "rgba(27,154,170,0.2)")} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: BRAND.navy, marginBottom: "7px" }}>Describe your condition</label>
                    <textarea name="message" value={form.message} onChange={handle} rows={4} placeholder="Tell us about your injury or condition..."
                      style={{ ...inp, resize: "none" }}
                      onFocus={e => (e.currentTarget.style.borderColor = BRAND.blue)} onBlur={e => (e.currentTarget.style.borderColor = "rgba(27,154,170,0.2)")} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginTop: "20px" }}>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px", borderRadius: "9999px", fontSize: "0.9375rem", fontWeight: 700, color: "white", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? <><span style={{ width: "15px", height: "15px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />Sending...</> : <><Send style={{ width: "16px", height: "16px" }} />Submit Booking Request</>}
                  </motion.button>
                  <p style={{ fontSize: "0.78rem", color: BRAND.muted }}>🔒 Completely confidential.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      <style>{`@media(max-width:640px){.form-grid{grid-template-columns:1fr!important;}.form-grid>div{grid-column:span 1!important;}}`}</style>
    </SectionBg>
  );
}

// ── LOCATION ──────────────────────────────────────────────────────────────────
function LocationSection({ onBookNow }: { onBookNow: () => void }) {
  const isOpen = new Date().toLocaleDateString("en-KE", { weekday: "long" }) !== "Sunday";
  return (
    <SectionBg style={{ padding: "120px 0" }}>
      <section id="location">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionLabel dark>Find Us</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
              Visit Align<span style={{ fontStyle: "italic", color: BRAND.green }}> in Karen, Nairobi.</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gap: "24px", alignItems: "stretch" }} className="location-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(27,154,170,0.15)", borderRadius: "20px", padding: "26px", boxShadow: "0 8px 30px rgba(10,37,64,0.25)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(140,198,63,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin style={{ width: "19px", height: "19px", color: BRAND.green }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: BRAND.navy }}>Our Location</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isOpen ? "#22c55e" : "#ef4444", animation: isOpen ? "pulse 2s infinite" : "none" }} />
                      <span style={{ fontSize: "0.72rem", color: isOpen ? BRAND.green : "#ef4444" }}>{isOpen ? "Open Now" : "Closed Today"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: BRAND.blue, marginBottom: "4px" }}>Align Physiotherapy & Sports Injury Clinic</div>
                <div style={{ fontSize: "0.875rem", color: BRAND.muted, lineHeight: 1.6, marginBottom: "18px" }}>Lang'ata Road<br />Karen/Lang'ata Area, Nairobi, Kenya<br /><span style={{ fontSize: "0.72rem" }}>Plus Code: MP5H+JJP Nairobi</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "14px", borderTop: "1px solid rgba(27,154,170,0.1)" }}>
                  {[
                    { href: `tel:${PHONE}`, icon: <Phone style={{ width: "13px", height: "13px", color: BRAND.green }} />, bg: "rgba(140,198,63,0.1)", text: PHONE },
                    { href: `mailto:${EMAIL}`, icon: <Mail style={{ width: "13px", height: "13px", color: BRAND.blue }} />, bg: "rgba(27,154,170,0.1)", text: EMAIL, small: true },
                    { href: WA_GENERAL, icon: <WhatsAppIcon style={{ width: "13px", height: "13px", color: "#25D366" }} />, bg: "rgba(37,211,102,0.1)", text: "WhatsApp Chat", ext: true },
                  ].map((item, i) => (
                    <a key={i} href={item.href} target={item.ext ? "_blank" : undefined} rel={item.ext ? "noopener noreferrer" : undefined}
                      style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: item.small ? "0.72rem" : "0.85rem", color: BRAND.muted, textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = BRAND.navy)} onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                      <span style={{ wordBreak: "break-all" }}>{item.text}</span>
                    </a>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "7px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(27,154,170,0.1)" }}>
                  {[{ href: INSTAGRAM, label: "Instagram", icon: <InstagramIcon style={{ width: "13px", height: "13px", color: "#E1306C" }} /> }, { href: FACEBOOK, label: "Facebook", icon: <Facebook style={{ width: "13px", height: "13px", color: "#1877F2" }} /> }, { href: LINKEDIN, label: "LinkedIn", icon: <Linkedin style={{ width: "13px", height: "13px", color: "#0077B5" }} /> }].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "9999px", fontSize: "0.68rem", fontWeight: 500, color: BRAND.muted, textDecoration: "none", background: "rgba(27,154,170,0.06)", border: "1px solid rgba(27,154,170,0.12)" }}>
                      {s.icon}{s.label}
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                style={{ background: "rgba(255,255,255,0.94)", border: "1px solid rgba(27,154,170,0.12)", borderRadius: "20px", padding: "22px", boxShadow: "0 8px 30px rgba(10,37,64,0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(140,198,63,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock style={{ width: "16px", height: "16px", color: BRAND.green }} />
                  </div>
                  <span style={{ fontWeight: 700, color: BRAND.navy, fontFamily: "'Playfair Display', serif" }}>Clinic Hours</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "18px" }}>
                  {HOURS.map(h => (
                    <div key={h.day} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: BRAND.muted }}>{h.day}</span>
                      <span style={{ padding: "3px 11px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 600, background: !h.open ? "rgba(239,68,68,0.08)" : "rgba(140,198,63,0.1)", color: !h.open ? "#ef4444" : BRAND.green }}>{h.time}</span>
                    </div>
                  ))}
                </div>
                <motion.button onClick={onBookNow} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", padding: "11px", borderRadius: "12px", fontSize: "0.875rem", fontWeight: 700, color: "white", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, border: "none", cursor: "pointer" }}>
                  Book an Appointment
                </motion.button>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(27,154,170,0.2)", boxShadow: "0 20px 60px rgba(10,37,64,0.3)", minHeight: "500px" }}>
              <iframe title="Align Physiotherapy Location" src={MAPS_EMBED} width="100%" height="100%" style={{ border: 0, minHeight: "500px", display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
          </div>
        </div>
      </section>
      <style>{`@media(min-width:1024px){.location-grid{grid-template-columns:380px 1fr!important;}}`}</style>
    </SectionBg>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection({ onBookNow }: { onBookNow: () => void }) {
  return (
    <SectionBg style={{ padding: "120px 0" }}>
      <section>
        <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle,rgba(140,198,63,0.1),transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BRAND.green, animation: "pulse 2s infinite" }} />Your Recovery Awaits
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.0, marginBottom: "18px" }}>
            Don't Wait Another<br />
            <span style={{ fontStyle: "italic", background: `linear-gradient(135deg,${BRAND.green},${BRAND.blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Day in Pain.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: "540px", margin: "0 auto 36px" }}>
            Our expert team in Karen/Lang'ata is ready to craft your personalised recovery journey. Available Monday–Saturday, 7:00 AM – 6:30 PM.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
            <motion.button onClick={onBookNow} whileHover={{ scale: 1.04, boxShadow: "0 16px 50px rgba(140,198,63,0.55)" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "15px 34px", borderRadius: "9999px", fontSize: "1rem", fontWeight: 700, color: "white", background: `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, border: "none", cursor: "pointer" }}>
              <Calendar style={{ width: "20px", height: "20px" }} />Book Your Assessment
            </motion.button>
            <motion.a href={WA_BOOK} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "15px 30px", borderRadius: "9999px", fontSize: "1rem", fontWeight: 700, color: "white", textDecoration: "none", background: "#25D366" }}>
              <WhatsAppIcon style={{ width: "20px", height: "20px" }} />WhatsApp: {PHONE}
            </motion.a>
          </div>
          <p style={{ marginTop: "20px", fontSize: "0.875rem", color: "rgba(255,255,255,0.55)" }}>
            📍 Lang'ata Road, Karen/Lang'ata, Nairobi &nbsp;·&nbsp; Mon–Sat: 7:00 AM – 6:30 PM
          </p>
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ── FOOTER — fully visible white text on dark ─────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: BRAND.navy, borderTop: `3px solid ${BRAND.green}`, padding: "64px 0 32px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gap: "40px", paddingBottom: "48px", borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: "32px" }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img src="/images/logo.jpg" alt="Align Physiotherapy"
                style={{ height: "64px", width: "auto", objectFit: "contain" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1rem", color: "#FFFFFF" }}>Align Physiotherapy</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: BRAND.green }}>& Sports Injury Clinic</div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "280px", marginBottom: "20px" }}>
              Expert physiotherapy along Lang'ata Road, Karen/Lang'ata, Nairobi. Led by PT Mary Kungu — engineering extraordinary recoveries.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { href: INSTAGRAM, icon: <InstagramIcon style={{ width: "16px", height: "16px", color: "#E1306C" }} />, label: "Instagram" },
                { href: FACEBOOK, icon: <Facebook style={{ width: "16px", height: "16px", color: "#1877F2" }} />, label: "Facebook" },
                { href: LINKEDIN, icon: <Linkedin style={{ width: "16px", height: "16px", color: "#0077B5" }} />, label: "LinkedIn" },
                { href: WA_GENERAL, icon: <WhatsAppIcon style={{ width: "16px", height: "16px", color: "#25D366" }} />, label: "WhatsApp" },
              ].map(s => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }}
                  style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", textDecoration: "none" }}
                  aria-label={s.label}>{s.icon}</motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "18px", letterSpacing: "0.05em" }}>Our Services</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = BRAND.green)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}>
                    <ChevronRight style={{ width: "12px", height: "12px", color: BRAND.green, flexShrink: 0 }} />{s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "18px", letterSpacing: "0.05em" }}>Contact Us</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "13px" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <MapPin style={{ width: "14px", height: "14px", color: BRAND.green, flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>Lang'ata Road, Karen/Lang'ata<br />Nairobi, Kenya</span>
              </li>
              <li>
                <a href={`tel:${PHONE}`} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                  <Phone style={{ width: "14px", height: "14px", color: BRAND.green }} />{PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "rgba(255,255,255,0.72)", textDecoration: "none", wordBreak: "break-all" }}>
                  <Mail style={{ width: "14px", height: "14px", color: BRAND.blue, flexShrink: 0 }} />{EMAIL}
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <Clock style={{ width: "14px", height: "14px", color: BRAND.orange, flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.72)" }}>
                  Mon–Sat: 7:00 AM – 6:30 PM<br />
                  <span style={{ color: "#fc8181" }}>Sunday: Closed</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — fully visible */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
            © {new Date().getFullYear()} Align Physiotherapy & Sports Injury Clinic. All rights reserved.
          </span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
            Professional Physiotherapy · Karen/Lang'ata, Nairobi, Kenya
          </span>
        </div>
      </div>
      <style>{`@media(min-width:768px){.footer-grid{grid-template-columns:1.5fr 1fr 1fr!important;}}`}</style>
    </footer>
  );
}

// ── WHATSAPP BUTTON ───────────────────────────────────────────────────────────
function WhatsAppButton() {
  const [tip, setTip] = useState(true);
  useEffect(() => { const t = setTimeout(() => setTip(false), 5000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: "96px", left: "20px", zIndex: 200 }}>
      <AnimatePresence>
        {tip && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: "68px", left: 0, whiteSpace: "nowrap", background: "rgba(255,255,255,0.98)", color: BRAND.navy, fontSize: "0.8rem", fontWeight: 500, padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(27,154,170,0.2)", boxShadow: "0 8px 25px rgba(10,37,64,0.15)" }}>
            💬 Chat with us!
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
        className="wa-pulse"
        style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 25px rgba(37,211,102,0.5)", textDecoration: "none" }}
        aria-label="WhatsApp">
        <WhatsAppIcon style={{ width: "28px", height: "28px", color: "white" }} />
      </motion.a>
    </div>
  );
}

// ── AI CHAT ───────────────────────────────────────────────────────────────────
function AIChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<ChatStep>("greeting");
  const [booking, setBooking] = useState<Partial<BookingData>>({});
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => {
    if (open && !ready) { setReady(true); setTimeout(() => { setMessages([{ id: Date.now(), role: "bot", text: BOT_RESPONSES.greeting(), timestamp: new Date() }]); setStep("ask_name"); }, 400); }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, ready]);

  const addBot = useCallback((text: string) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); setMessages(p => [...p, { id: Date.now(), role: "bot", text, timestamp: new Date() }]); }, 1200 + Math.random() * 500);
  }, []);

  const send = useCallback(() => {
    const t = input.trim(); if (!t) return;
    setMessages(p => [...p, { id: Date.now(), role: "user", text: t, timestamp: new Date() }]);
    setInput("");
    const b = { ...booking }; let next: ChatStep = step;
    if (step === "ask_name") { b.name = t; next = "ask_injury"; }
    else if (step === "ask_injury") { b.injury = t; next = "ask_date"; }
    else if (step === "ask_date") { b.date = t; next = "ask_contact"; }
    else if (step === "ask_contact") { b.contact = t; next = "confirm"; }
    else next = "done";
    setBooking(b); setStep(next); addBot(BOT_RESPONSES[next](b));
    if (next === "confirm") {
      const msg = `Hello!%0A%0A*AI Chat Booking*%0A*Name:* ${b.name}%0A*Condition:* ${b.injury}%0A*Date:* ${b.date}%0A*Contact:* ${b.contact}`;
      setTimeout(() => { window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank"); addBot(BOT_RESPONSES.done()); setStep("done"); }, 2500);
    }
  }, [input, step, booking, addBot]);

  const reset = () => { setMessages([]); setStep("greeting"); setBooking({}); setReady(false); setTyping(false); setInput(""); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "fixed", bottom: "96px", right: "20px", zIndex: 200, width: "min(380px,calc(100vw - 40px))", maxHeight: "560px", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid rgba(27,154,170,0.2)", boxShadow: "0 30px 80px rgba(10,37,64,0.25)" }}>
          <div style={{ padding: "15px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyMid})`, borderBottom: "1px solid rgba(27,154,170,0.2)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(140,198,63,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot style={{ width: "17px", height: "17px", color: BRAND.green }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>Align AI Receptionist</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)" }}>Online · Instant response</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={reset} style={{ fontSize: "0.68rem", padding: "4px 9px", borderRadius: "9999px", color: BRAND.green, background: "rgba(140,198,63,0.15)", border: "none", cursor: "pointer" }}>Reset</button>
              <button onClick={onClose} style={{ width: "27px", height: "27px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Minimize2 style={{ width: "13px", height: "13px" }} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "3px", padding: "7px 14px", background: "rgba(240,248,255,0.8)", borderBottom: "1px solid rgba(27,154,170,0.08)", flexShrink: 0 }}>
            {(["ask_name","ask_injury","ask_date","ask_contact","confirm"] as ChatStep[]).map(s => {
              const si = STEP_ORDER.indexOf(s), ci = STEP_ORDER.indexOf(step);
              return <div key={s} style={{ height: "3px", flex: 1, borderRadius: "9999px", background: ci > si ? BRAND.green : ci === si ? "rgba(140,198,63,0.5)" : "rgba(27,154,170,0.1)", transition: "background 0.4s" }} />;
            })}
          </div>

          <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0, background: "#F0F8FF" }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: "flex", gap: "8px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end", background: m.role === "bot" ? `linear-gradient(135deg,${BRAND.navy},${BRAND.navyMid})` : `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})` }}>
                  {m.role === "bot" ? <Bot style={{ width: "13px", height: "13px", color: BRAND.green }} /> : <User style={{ width: "13px", height: "13px", color: "white" }} />}
                </div>
                <div style={{ maxWidth: "80%", borderRadius: "13px", padding: "9px 13px", fontSize: "0.8rem", lineHeight: 1.6, borderBottomRightRadius: m.role === "user" ? "4px" : undefined, borderBottomLeftRadius: m.role === "bot" ? "4px" : undefined, background: m.role === "user" ? `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})` : "rgba(255,255,255,0.96)", color: m.role === "user" ? "white" : BRAND.navy, border: m.role === "bot" ? "1px solid rgba(27,154,170,0.1)" : "none" }}>
                  {m.text.split("\n").map((line, i) => <p key={i} style={{ marginTop: i > 0 ? "4px" : 0 }}>{renderBold(line)}</p>)}
                  <p style={{ fontSize: "0.58rem", marginTop: "4px", opacity: 0.5, textAlign: m.role === "user" ? "right" : "left" }}>
                    {m.timestamp.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${BRAND.navy},${BRAND.navyMid})` }}>
                  <Bot style={{ width: "13px", height: "13px", color: BRAND.green }} />
                </div>
                <div style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(27,154,170,0.1)", borderRadius: "13px", borderBottomLeftRadius: "4px", padding: "11px 15px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: BRAND.green, display: "inline-block" }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {step === "ask_name" && messages.length <= 2 && (
            <div style={{ padding: "0 13px 9px", display: "flex", flexWrap: "wrap", gap: "5px", flexShrink: 0, background: "#F0F8FF" }}>
              {["Sports injury", "Back pain", "Post-surgery", "Neck pain", "Chronic pain"].map(q => (
                <button key={q} onClick={() => setInput(q)}
                  style={{ fontSize: "0.68rem", padding: "4px 9px", borderRadius: "9999px", border: "1px solid rgba(27,154,170,0.25)", color: BRAND.blue, background: "rgba(27,154,170,0.06)", cursor: "pointer" }}>{q}</button>
              ))}
            </div>
          )}

          <div style={{ padding: "11px 13px", borderTop: "1px solid rgba(27,154,170,0.1)", background: "rgba(255,255,255,0.98)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "8px", background: "rgba(240,248,255,0.8)", border: "1px solid rgba(27,154,170,0.2)", borderRadius: "11px", padding: "7px 11px", alignItems: "center" }}>
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
                placeholder={step === "ask_name" ? "Your full name..." : step === "ask_injury" ? "Describe your condition..." : step === "ask_date" ? "Preferred date & time..." : step === "ask_contact" ? "Phone or email..." : "Type here..."}
                disabled={typing || step === "done"}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.8rem", color: BRAND.navy, fontFamily: "Inter,sans-serif" }} />
              <button onClick={send} disabled={!input.trim() || typing || step === "done"}
                style={{ width: "28px", height: "28px", borderRadius: "8px", background: input.trim() && !typing && step !== "done" ? `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})` : "rgba(140,198,63,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: !input.trim() || typing || step === "done" ? 0.4 : 1, transition: "all 0.2s" }}>
                <Send style={{ width: "12px", height: "12px", color: "white" }} />
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: "0.58rem", marginTop: "5px", color: BRAND.muted }}>
              Urgent? Call <a href={`tel:${PHONE}`} style={{ color: BRAND.green }}>{PHONE}</a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── CHAT TOGGLE ───────────────────────────────────────────────────────────────
function ChatToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 7000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
      <AnimatePresence>
        {hint && !open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(255,255,255,0.98)", color: BRAND.navy, fontSize: "0.8rem", fontWeight: 500, padding: "8px 13px", borderRadius: "12px", border: "1px solid rgba(27,154,170,0.2)", boxShadow: "0 8px 25px rgba(10,37,64,0.15)", whiteSpace: "nowrap" }}>
            🤖 Book via AI Chat!
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => { onClick(); setHint(false); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        style={{ width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: open ? `linear-gradient(135deg,${BRAND.navy},${BRAND.navyMid})` : `linear-gradient(135deg,${BRAND.green},${BRAND.greenDark})`, boxShadow: open ? "0 8px 25px rgba(10,37,64,0.3)" : "0 8px 30px rgba(140,198,63,0.5)" }}
        aria-label="Toggle AI Chat">
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X style={{ width: "24px", height: "24px", color: "white" }} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle style={{ width: "24px", height: "24px", color: "white" }} /></motion.div>}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ── SCROLL TOP ────────────────────────────────────────────────────────────────
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const h = () => setShow(window.scrollY > 600); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          style={{ position: "fixed", bottom: "96px", right: "90px", zIndex: 200, width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(27,154,170,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 15px rgba(10,37,64,0.2)" }}>
          <ChevronDown style={{ width: "18px", height: "18px", color: BRAND.blue, transform: "rotate(180deg)" }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ── ANNOUNCEMENT BAR ──────────────────────────────────────────────────────────
function AnnouncementBar() {
  const [show, setShow] = useState(true);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  useEffect(() => { spring.set(1); }, [spring]);
  if (!show) return null;
  return (
    <div style={{ position: "relative", zIndex: 1001, padding: "10px 40px", textAlign: "center", fontSize: "0.8rem", fontWeight: 500, color: "#fff", background: `linear-gradient(90deg,${BRAND.green},${BRAND.blue})` }}>
      ✨ Now accepting new patients in Karen/Lang'ata, Nairobi ·{" "}
      <a href={WA_BOOK} target="_blank" rel="noopener noreferrer" style={{ color: "white", fontWeight: 700, textDecoration: "underline" }}>Reserve your consultation →</a>
      <button onClick={() => setShow(false)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)" }}>
        <X style={{ width: "14px", height: "14px" }} />
      </button>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const book = () => setChatOpen(true);

  return (
    <>
      <SEOHead />
      <GlobalStyles />
      {/* Fixed cinematic slideshow — bg1 & bg2 ONLY */}
      <CinematicSlideshow />
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
        <AnnouncementBar />
        <Navbar onBookNow={book} />
        <main>
          <HeroSection onBookNow={book} />
          <AboutSection />
          <ServicesSection />
          <WhyUsSection />
          <TeamSection />
          <TestimonialsSection />
          <FAQSection />
          <BookingSection />
          <LocationSection onBookNow={book} />
          <CTASection onBookNow={book} />
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
      <AIChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <ChatToggle open={chatOpen} onClick={() => setChatOpen(!chatOpen)} />
      <ScrollTop />
    </>
  );
}
