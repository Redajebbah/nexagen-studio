import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════
   NEXAGEN STUDIO — World-Class Digital Agency
   Internationalized: EN · FR · AR (RTL)
   
   i18n Architecture:
   - React Context-based translation system (mirrors next-intl API)
   - URL hash routing: #/en, #/fr, #/ar
   - RTL auto-detection for Arabic
   - IBM Plex Sans Arabic for Arabic typography
   - All text extracted to translation objects (portable to /messages/*.json)
   ═══════════════════════════════════════════════════════════════════ */

// ═══ TRANSLATIONS (matches /messages/*.json files) ═══
const messages = {
  en: {
    nav: { services: "Services", about: "About", process: "Process", work: "Work", contact: "Contact", startProject: "Start a Project" },
    hero: { badge: "Digital Studio · AI-Powered", line1: "We design systems", line2: "that", line3: "think.", subtitle: "We merge elegant design with artificial intelligence to build digital products that adapt, learn, and scale with your ambition.", cta1: "Start Your Project", cta2: "View Our Work", stat1Num: "150+", stat1Label: "Projects", stat2Num: "98%", stat2Label: "Satisfaction", stat3Num: "40+", stat3Label: "AI Systems", scroll: "Scroll" },
    services: {
      label: "Services", title: "Capabilities built for", titleAccent: "the intelligent era.",
      description: "From concept to scale, we deliver end-to-end digital solutions powered by AI, automation, and modern engineering.",
      items: [
        { title: "Web Development", description: "High-performance web applications built with modern frameworks. Scalable architecture, blazing speed, flawless execution." },
        { title: "AI Integration", description: "Embedding machine learning and LLMs into your products. From recommendation engines to natural language interfaces." },
        { title: "Intelligent Solutions", description: "Smart business systems that adapt to real-time data. Predictive analytics, automated decisions, continuous learning." },
        { title: "Process Automation", description: "Streamlining operations through intelligent workflows. Eliminate repetitive tasks and reclaim hundreds of hours." },
        { title: "AI Problem Solving", description: "Complex challenges, elegant solutions. We apply advanced AI where traditional methods fall short." },
        { title: "Digital Optimization", description: "Maximizing every digital touchpoint. Performance tuning, conversion optimization, data-driven UX refinement." },
      ],
      learnMore: "Learn more",
    },
    about: {
      label: "About", title: "We don't just build websites.", titleAccent: "We build intelligence.",
      p1: "Nexagen is a digital studio operating at the intersection of design and artificial intelligence. We engineer systems that are beautiful, alive with data, and continuously evolving.",
      p2: "Every project is an opportunity to push boundaries. We build products that think, adapt, and scale — so your business always stays ahead.",
      stat1: "Projects shipped", stat2: "Client retention", stat3: "Countries served", stat4: "AI integrations",
    },
    process: {
      label: "Process", title: "From vision to", titleAccent: "velocity.",
      description: "A methodology refined over hundreds of projects. Structured enough to deliver, flexible enough to innovate.",
      steps: [
        { title: "Understand", desc: "Deep research, stakeholder interviews, and market analysis to define the perfect strategy." },
        { title: "Design", desc: "From wireframes to high-fidelity prototypes. Every pixel intentional, every interaction considered." },
        { title: "Build", desc: "Clean, modular code. Modern stack. Rigorous testing. Engineered to last and scale." },
        { title: "Launch", desc: "Seamless deployment with monitoring, optimization, and zero-downtime delivery." },
        { title: "Scale", desc: "Post-launch iteration driven by real data. Continuous improvement, growing impact." },
      ],
    },
    portfolio: {
      label: "Selected Work", title: "Projects that speak.",
      items: [
        { title: "Meridian AI Dashboard", category: "Data Intelligence" },
        { title: "Stratos Commerce", category: "E-Commerce Platform" },
        { title: "Pulse Neural Engine", category: "Machine Learning" },
        { title: "Vertex Automation", category: "Workflow Systems" },
      ],
    },
    testimonials: {
      label: "Testimonials", title: "Trusted by innovators.",
      items: [
        { quote: "Nexagen transformed our digital infrastructure completely. The AI systems they engineered increased our operational efficiency by 340%. Their work is genuinely on another level.", author: "Sarah Chen", role: "CTO, Meridian Labs" },
        { quote: "Their approach to automation saved us over 200 hours monthly. Every solution felt intentional, precise, and built for the long term. A partnership that redefined our trajectory.", author: "Marcus Rivera", role: "CEO, Stratos Ventures" },
        { quote: "The platform they designed doesn't just look exceptional — it thinks. Adaptive, intelligent, endlessly scalable. The best investment we've made this decade.", author: "Elena Volkov", role: "Founder, Pulse Analytics" },
      ],
    },
    cta: { title: "Ready to build something", titleAccent: "extraordinary?", description: "Let's explore how intelligent digital solutions can accelerate your business. No pressure — just a conversation.", button: "Let's Talk →" },
    contact: { label: "Contact", title: "Start your project.", description: "Tell us what you're building. We'll respond within 24 hours to discuss how we can help.", email: "hello@nexagen.studio", phName: "Your name", phEmail: "Your email", phType: "Project type (e.g., Web App, AI Integration)", phMsg: "Tell us about your project...", submit: "Send Message →" },
    footer: { tagline: "Engineering intelligent digital experiences that move businesses forward.", studioCol: "Studio", connectCol: "Connect", copyright: "© 2026 Nexagen Studio", madeWith: "Engineered with intelligence" },
    chatbot: { title: "Nexia", subtitle: "Studio AI", welcome: "Hi! I'm Nexia, Nexagen Studio's AI assistant. Ask me anything about our services, process, or how we can help build your next project.", placeholder: "Ask me anything...", send: "Send", powered: "Powered by Claude" },
  },

  fr: {
    nav: { services: "Services", about: "À propos", process: "Processus", work: "Projets", contact: "Contact", startProject: "Lancer un projet" },
    hero: { badge: "Studio Digital · Propulsé par l'IA", line1: "Nous concevons des systèmes", line2: "qui", line3: "pensent.", subtitle: "Nous fusionnons design élégant et intelligence artificielle pour créer des produits numériques qui s'adaptent, apprennent et évoluent avec votre ambition.", cta1: "Lancer votre projet", cta2: "Voir nos projets", stat1Num: "150+", stat1Label: "Projets", stat2Num: "98%", stat2Label: "Satisfaction", stat3Num: "40+", stat3Label: "Systèmes IA", scroll: "Défiler" },
    services: {
      label: "Services", title: "Des compétences conçues pour", titleAccent: "l'ère intelligente.",
      description: "Du concept au déploiement, nous livrons des solutions numériques complètes propulsées par l'IA, l'automatisation et l'ingénierie moderne.",
      items: [
        { title: "Développement Web", description: "Applications web haute performance construites avec des frameworks modernes. Architecture évolutive, rapidité optimale, exécution irréprochable." },
        { title: "Intégration IA", description: "Intégration de l'apprentissage automatique et des LLM dans vos produits. Des moteurs de recommandation aux interfaces conversationnelles." },
        { title: "Solutions Intelligentes", description: "Systèmes métier adaptatifs en temps réel. Analytique prédictive, décisions automatisées, apprentissage continu." },
        { title: "Automatisation des Processus", description: "Optimisation des opérations grâce à des workflows intelligents. Éliminez les tâches répétitives et récupérez des centaines d'heures." },
        { title: "Résolution par l'IA", description: "Des défis complexes, des solutions élégantes. Nous appliquons l'IA avancée là où les méthodes traditionnelles échouent." },
        { title: "Optimisation Digitale", description: "Maximisation de chaque point de contact numérique. Optimisation des performances, de la conversion et de l'expérience utilisateur." },
      ],
      learnMore: "En savoir plus",
    },
    about: {
      label: "À propos", title: "Nous ne créons pas que des sites web.", titleAccent: "Nous créons de l'intelligence.",
      p1: "Nexagen est un studio digital opérant à l'intersection du design et de l'intelligence artificielle. Nous concevons des systèmes à la fois esthétiques, alimentés par les données et en constante évolution.",
      p2: "Chaque projet est une occasion de repousser les limites. Nous construisons des produits qui pensent, s'adaptent et évoluent — pour que votre entreprise garde toujours une longueur d'avance.",
      stat1: "Projets livrés", stat2: "Taux de rétention", stat3: "Pays servis", stat4: "Intégrations IA",
    },
    process: {
      label: "Processus", title: "De la vision à la", titleAccent: "vélocité.",
      description: "Une méthodologie affinée sur des centaines de projets. Assez structurée pour livrer, assez flexible pour innover.",
      steps: [
        { title: "Comprendre", desc: "Recherche approfondie, entretiens et analyse de marché pour définir la stratégie idéale." },
        { title: "Concevoir", desc: "Des wireframes aux prototypes haute fidélité. Chaque pixel est intentionnel, chaque interaction est réfléchie." },
        { title: "Construire", desc: "Code propre et modulaire. Stack moderne. Tests rigoureux. Conçu pour durer et évoluer." },
        { title: "Lancer", desc: "Déploiement fluide avec surveillance, optimisation et livraison sans interruption." },
        { title: "Évoluer", desc: "Itération post-lancement guidée par les données. Amélioration continue, impact croissant." },
      ],
    },
    portfolio: {
      label: "Travaux sélectionnés", title: "Des projets qui parlent.",
      items: [
        { title: "Meridian AI Dashboard", category: "Intelligence des données" },
        { title: "Stratos Commerce", category: "Plateforme E-Commerce" },
        { title: "Pulse Neural Engine", category: "Apprentissage automatique" },
        { title: "Vertex Automation", category: "Systèmes de workflows" },
      ],
    },
    testimonials: {
      label: "Témoignages", title: "La confiance des innovateurs.",
      items: [
        { quote: "Nexagen a complètement transformé notre infrastructure numérique. Les systèmes IA qu'ils ont conçus ont augmenté notre efficacité opérationnelle de 340%. Leur travail est d'un tout autre niveau.", author: "Sarah Chen", role: "CTO, Meridian Labs" },
        { quote: "Leur approche de l'automatisation nous a fait économiser plus de 200 heures par mois. Chaque solution était intentionnelle, précise et pensée pour le long terme.", author: "Marcus Rivera", role: "PDG, Stratos Ventures" },
        { quote: "La plateforme qu'ils ont conçue n'est pas seulement exceptionnelle visuellement — elle pense. Adaptative, intelligente, infiniment évolutive.", author: "Elena Volkov", role: "Fondatrice, Pulse Analytics" },
      ],
    },
    cta: { title: "Prêt à construire quelque chose", titleAccent: "d'extraordinaire ?", description: "Explorons ensemble comment des solutions numériques intelligentes peuvent accélérer votre entreprise. Sans engagement — juste une conversation.", button: "Parlons-en →" },
    contact: { label: "Contact", title: "Lancez votre projet.", description: "Dites-nous ce que vous construisez. Nous vous répondrons sous 24 heures.", email: "hello@nexagen.studio", phName: "Votre nom", phEmail: "Votre email", phType: "Type de projet (ex: Application Web, Intégration IA)", phMsg: "Parlez-nous de votre projet...", submit: "Envoyer le message →" },
    footer: { tagline: "Nous concevons des expériences numériques intelligentes qui font avancer les entreprises.", studioCol: "Studio", connectCol: "Suivez-nous", copyright: "© 2026 Nexagen Studio", madeWith: "Conçu avec intelligence" },
    chatbot: { title: "Nexia", subtitle: "IA du Studio", welcome: "Bonjour ! Je suis Nexia, l'assistante IA de Nexagen Studio. Posez-moi des questions sur nos services, notre processus ou comment nous pouvons vous aider.", placeholder: "Posez votre question...", send: "Envoyer", powered: "Propulsé par Claude" },
  },

  ar: {
    nav: { services: "خدماتنا", about: "من نحن", process: "منهجيتنا", work: "أعمالنا", contact: "تواصل معنا", startProject: "ابدأ مشروعك" },
    hero: { badge: "استوديو رقمي · مدعوم بالذكاء الاصطناعي", line1: "نصمّم أنظمة", line2: "تستطيع أن", line3: "تفكّر.", subtitle: "ندمج بين التصميم الراقي والذكاء الاصطناعي لبناء منتجات رقمية تتكيّف وتتعلّم وتنمو مع طموحاتكم.", cta1: "ابدأ مشروعك", cta2: "استعرض أعمالنا", stat1Num: "+150", stat1Label: "مشروع", stat2Num: "98%", stat2Label: "رضا العملاء", stat3Num: "+40", stat3Label: "نظام ذكاء اصطناعي", scroll: "مرّر" },
    services: {
      label: "خدماتنا", title: "قدرات مصمّمة لعصر", titleAccent: "الذكاء الاصطناعي.",
      description: "من الفكرة إلى التوسّع، نقدّم حلولاً رقمية متكاملة مدعومة بالذكاء الاصطناعي والأتمتة والهندسة الحديثة.",
      items: [
        { title: "تطوير المواقع والتطبيقات", description: "تطبيقات ويب عالية الأداء مبنية بأحدث التقنيات. بنية قابلة للتوسّع، سرعة فائقة، وتنفيذ متقن." },
        { title: "دمج الذكاء الاصطناعي", description: "دمج تقنيات التعلّم الآلي والنماذج اللغوية الكبيرة في منتجاتكم. من محركات التوصية إلى الواجهات التفاعلية الذكية." },
        { title: "حلول ذكية للأعمال", description: "أنظمة أعمال ذكية تتكيّف مع البيانات الفورية. تحليلات تنبؤية، قرارات آلية، وتعلّم مستمر." },
        { title: "أتمتة العمليات", description: "تبسيط العمليات التشغيلية من خلال سير عمل ذكي. تخلّص من المهام المتكررة واستعد مئات الساعات." },
        { title: "حل المشكلات بالذكاء الاصطناعي", description: "تحديات معقّدة وحلول أنيقة. نطبّق الذكاء الاصطناعي المتقدّم حيث تعجز الطرق التقليدية." },
        { title: "التحسين الرقمي", description: "تعظيم أداء كل نقطة اتصال رقمية. تحسين الأداء والتحويلات وتجربة المستخدم المبنية على البيانات." },
      ],
      learnMore: "اكتشف المزيد",
    },
    about: {
      label: "من نحن", title: "لا نبني مواقع إلكترونية فحسب.", titleAccent: "نبني ذكاءً رقمياً.",
      p1: "نيكساجن هو استوديو رقمي يعمل عند نقطة التقاء التصميم والذكاء الاصطناعي. نهندس أنظمة جميلة وحيّة بالبيانات ومتطوّرة باستمرار.",
      p2: "كل مشروع هو فرصة لتجاوز الحدود. نبني منتجات تفكّر وتتكيّف وتتوسّع — ليبقى عملكم دائماً في الطليعة.",
      stat1: "مشروع مُنجز", stat2: "معدّل الاحتفاظ", stat3: "دولة نخدمها", stat4: "تكامل ذكاء اصطناعي",
    },
    process: {
      label: "منهجيتنا", title: "من الرؤية إلى", titleAccent: "الانطلاق.",
      description: "منهجية مُحسّنة عبر مئات المشاريع. منظّمة بما يكفي للإنجاز، ومرنة بما يكفي للابتكار.",
      steps: [
        { title: "الفهم", desc: "بحث معمّق، مقابلات مع أصحاب المصلحة، وتحليل للسوق لتحديد الاستراتيجية المثالية." },
        { title: "التصميم", desc: "من الهياكل الأولية إلى النماذج عالية الدقة. كل بكسل مقصود، وكل تفاعل مدروس." },
        { title: "البناء", desc: "كود نظيف ومعياري. تقنيات حديثة. اختبارات صارمة. مصمّم ليدوم ويتوسّع." },
        { title: "الإطلاق", desc: "نشر سلس مع المراقبة والتحسين والتسليم دون أي توقّف." },
        { title: "التوسّع", desc: "تطوير مستمر بعد الإطلاق مبني على بيانات حقيقية. تحسين دائم وتأثير متزايد." },
      ],
    },
    portfolio: {
      label: "أعمال مختارة", title: "مشاريع تتحدّث عن نفسها.",
      items: [
        { title: "Meridian AI Dashboard", category: "ذكاء البيانات" },
        { title: "Stratos Commerce", category: "منصة تجارة إلكترونية" },
        { title: "Pulse Neural Engine", category: "التعلّم الآلي" },
        { title: "Vertex Automation", category: "أنظمة سير العمل" },
      ],
    },
    testimonials: {
      label: "آراء العملاء", title: "موثوق به من قبل المبتكرين.",
      items: [
        { quote: "حوّل نيكساجن بنيتنا التحتية الرقمية بالكامل. أنظمة الذكاء الاصطناعي التي هندسوها رفعت كفاءتنا التشغيلية بنسبة 340%. عملهم في مستوى آخر تماماً.", author: "سارة تشن", role: "المدير التقني، Meridian Labs" },
        { quote: "نهجهم في الأتمتة وفّر لنا أكثر من 200 ساعة شهرياً. كل حل كان مدروساً ودقيقاً ومصمّماً للمدى الطويل. شراكة أعادت تعريف مسارنا.", author: "ماركوس ريفيرا", role: "الرئيس التنفيذي، Stratos Ventures" },
        { quote: "المنصة التي صمّموها ليست فقط استثنائية بصرياً — إنها تفكّر. تكيّفية، ذكية، قابلة للتوسّع بلا حدود. أفضل استثمار قمنا به هذا العقد.", author: "إلينا فولكوف", role: "المؤسِّسة، Pulse Analytics" },
      ],
    },
    cta: { title: "مستعد لبناء شيء", titleAccent: "استثنائي؟", description: "دعنا نستكشف كيف يمكن للحلول الرقمية الذكية تسريع نمو أعمالك. بدون التزام — مجرد حوار.", button: "← لنتحدّث" },
    contact: { label: "تواصل معنا", title: "ابدأ مشروعك.", description: "أخبرنا بما تبنيه. سنردّ خلال 24 ساعة لمناقشة كيف يمكننا المساعدة.", email: "hello@nexagen.studio", phName: "اسمك", phEmail: "بريدك الإلكتروني", phType: "نوع المشروع (مثال: تطبيق ويب، دمج ذكاء اصطناعي)", phMsg: "حدّثنا عن مشروعك...", submit: "← إرسال الرسالة" },
    footer: { tagline: "نهندس تجارب رقمية ذكية تدفع الأعمال نحو الأمام.", studioCol: "الاستوديو", connectCol: "تابعنا", copyright: "© 2026 Nexagen Studio", madeWith: "صُنع بذكاء" },
    chatbot: { title: "نيكسيا", subtitle: "مساعد الاستوديو الذكي", welcome: "مرحباً! أنا نيكسيا، المساعد الذكي لاستوديو نيكساجن. اسألني عن خدماتنا أو كيف يمكننا مساعدتك في مشروعك القادم.", placeholder: "اسألني أي شيء...", send: "إرسال", powered: "مدعوم بكلود" },
  },
};

// ═══ DESIGN TOKENS (CSS variables — themed via [data-theme]) ═══
const T = {
  bg: "var(--bg)", bgAlt: "var(--bg-alt)", bgCard: "var(--bg-card)",
  text: "var(--c-text)", textMuted: "var(--c-text-muted)", textDim: "var(--c-text-dim)",
  accent: "var(--accent)", accentAlt: "var(--accent-alt)",
  border: "var(--border)", borderHover: "var(--border-hover)",
};

// ═══ THEME CONTEXT ═══
const ThemeContext = createContext({ isDark: false, toggle: () => {} });
function useThemeMode() { return useContext(ThemeContext); }

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("nexagen-theme");
    return saved ? saved === "dark" : false;
  });
  const toggle = useCallback(() => setIsDark((d) => !d), []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("nexagen-theme", isDark ? "dark" : "light");
  }, [isDark]);
  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

function ThemeToggle({ mobile = false }) {
  const { isDark, toggle } = useThemeMode();
  return (
    <button data-hover onClick={toggle} title={isDark ? "Light mode" : "Dark mode"} style={{
      background: "none", border: `1px solid ${T.border}`, borderRadius: "2rem",
      padding: mobile ? "0.5rem 1.5rem" : "0.3rem 0.7rem",
      cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
      color: T.textDim, fontSize: mobile ? "1rem" : "0.82rem", fontFamily: "var(--f-body)",
      fontWeight: 500, transition: "all 0.3s", letterSpacing: "0.03em",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
    >
      <span style={{ fontSize: mobile ? "1.1rem" : "0.9rem", lineHeight: 1 }}>{isDark ? "☀" : "☽"}</span>
      {mobile && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}

// ═══ i18n CONTEXT ═══
const I18nContext = createContext({ locale: "en", t: messages.en, isRTL: false, setLocale: () => {} });

function useT() {
  return useContext(I18nContext);
}

function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const hash = window.location.hash.replace("#/", "").split("/")[0];
    return ["en", "fr", "ar"].includes(hash) ? hash : "en";
  });

  const setLocale = useCallback((l) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.location.hash = `/${l}`;
  }, []);

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace("#/", "").split("/")[0];
      if (["en", "fr", "ar"].includes(hash)) setLocaleState(hash);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isRTL = locale === "ar";

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", locale);
  }, [locale, isRTL]);

  return (
    <I18nContext.Provider value={{ locale, t: messages[locale], isRTL, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// ═══ HOOKS ═══
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useMouse() {
  const pos = useRef({ x: 0.5, y: 0.5, cx: 0, cy: 0 });
  const [, tick] = useState(0);
  useEffect(() => {
    let frame;
    const h = (e) => {
      pos.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, cx: e.clientX, cy: e.clientY };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => tick((n) => n + 1));
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => { window.removeEventListener("mousemove", h); cancelAnimationFrame(frame); };
  }, []);
  return pos.current;
}

function useSmoothVal(target, lerp = 0.08) {
  const v = useRef(target);
  const [s, setS] = useState(target);
  useEffect(() => {
    let raf;
    const go = () => { v.current += (target - v.current) * lerp; setS(v.current); raf = requestAnimationFrame(go); };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, [target, lerp]);
  return s;
}

// ═══ THREE.JS HERO ═══
function HeroScene({ mouse }) {
  const mountRef = useRef(null);
  const refs = useRef({});
  useEffect(() => {
    const c = mountRef.current; if (!c) return;
    let w = c.clientWidth, h = c.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100); camera.position.z = 4.5;
    const geo = new THREE.IcosahedronGeometry(1.6, 64);
    const orig = geo.attributes.position.array.slice();
    const sphere = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.08, roughness: 0.3, metalness: 0.8 }));
    scene.add(sphere);
    const wf = new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 20), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.06, wireframe: true }));
    scene.add(wf);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.03 }));
    scene.add(inner);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.008, 8, 128), new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.15 }));
    ring1.rotation.x = Math.PI * 0.45; scene.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.005, 8, 128), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.08 }));
    ring2.rotation.x = Math.PI * 0.6; ring2.rotation.y = Math.PI * 0.3; scene.add(ring2);
    const pN = 500, pPos = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) { const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1), r = 2.2+Math.random()*3; pPos[i*3]=r*Math.sin(ph)*Math.cos(th); pPos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pPos[i*3+2]=r*Math.cos(ph); }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.015, transparent: true, opacity: 0.4, sizeAttenuation: true }));
    scene.add(particles);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dl = new THREE.DirectionalLight(0x00e5a0, 0.6); dl.position.set(3, 3, 5); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x5eead4, 0.3); dl2.position.set(-3, -2, 3); scene.add(dl2);
    scene.add(new THREE.PointLight(0x00e5a0, 0.5, 10));
    refs.current = { renderer, scene, camera, geo, orig, sphere, wf, inner, ring1, ring2, particles };
    const clock = new THREE.Clock(); let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate); const t = clock.getElapsedTime();
      const pos = geo.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) { const ox=orig[i],oy=orig[i+1],oz=orig[i+2]; const n=Math.sin(ox*2.5+t*0.8)*Math.cos(oy*2.5+t*0.6)*Math.sin(oz*2.5+t*0.7)*0.12; pos[i]=ox*(1+n); pos[i+1]=oy*(1+n); pos[i+2]=oz*(1+n); }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
      sphere.rotation.y=t*0.08; sphere.rotation.x=t*0.05; wf.rotation.y=t*0.06; wf.rotation.x=t*0.04; inner.rotation.y=-t*0.1; ring1.rotation.z=t*0.1; ring2.rotation.z=-t*0.07; particles.rotation.y=t*0.015; particles.rotation.x=t*0.008;
      renderer.render(scene, camera);
    };
    animate();
    const onR = () => { w=c.clientWidth; h=c.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",onR); renderer.dispose(); if(c.contains(renderer.domElement))c.removeChild(renderer.domElement); };
  }, []);
  useEffect(() => { const s=refs.current; if(!s.camera)return; s.camera.position.x+=((mouse.x-0.5)*2-s.camera.position.x)*0.02; s.camera.position.y+=(-(mouse.y-0.5)*1.2-s.camera.position.y)*0.02; s.camera.lookAt(0,0,0); }, [mouse.x, mouse.y]);
  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

// ═══ LOADING ═══
function LoadingScreen({ onDone }) {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState("loading");
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => { p += Math.random()*18+4; if(p>=100){p=100;clearInterval(iv);setTimeout(()=>setPhase("exit"),300);setTimeout(onDone,1100);} setProg(Math.min(p,100)); }, 100);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <div style={{ position:"fixed",inset:0,zIndex:10000,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:phase==="exit"?0:1,transition:"opacity 0.8s cubic-bezier(.4,0,0,1)",pointerEvents:phase==="exit"?"none":"auto" }}>
      <div style={{ fontFamily:"var(--f-display)",fontWeight:900,fontSize:"1.5rem",letterSpacing:"-0.04em",color:T.text,marginBottom:"3rem" }}>nexa<span style={{color:T.accent}}>gen</span></div>
      <div style={{ width:180,height:1,background:"rgba(255,255,255,0.06)",borderRadius:1,overflow:"hidden" }}><div style={{ height:"100%",width:`${prog}%`,background:`linear-gradient(90deg,${T.accent},${T.accentAlt})`,transition:"width 0.2s" }} /></div>
      <span style={{ fontFamily:"var(--f-body)",fontSize:"0.65rem",letterSpacing:"0.25em",color:T.textDim,marginTop:"1.5rem",textTransform:"uppercase" }}>{Math.round(prog)}%</span>
    </div>
  );
}

// ═══ ANIMATION PRIMITIVES ═══
function SplitText({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal(0.15);
  const { isRTL } = useT();
  const text = typeof children === "string" ? children : "";
  if (isRTL) {
    return (
      <div ref={ref} style={{ overflow: "hidden", ...style }}>
        <span style={{ display:"inline-block", transform: vis ? "translateY(0)" : "translateY(100%)", opacity: vis ? 1 : 0, transition: `transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, opacity 0.6s ease ${delay}s` }}>{text}</span>
      </div>
    );
  }
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.28em" }}>
        {words.map((word, wi) => (
          <span key={wi} style={{ display: "inline-flex", overflow: "hidden" }}>
            {word.split("").map((ch, ci) => {
              const idx = charIdx++;
              return (<span key={ci} style={{ display:"inline-block", transform:vis?"translateY(0) rotate(0)":"translateY(115%) rotate(4deg)", opacity:vis?1:0, transition:`transform 0.7s cubic-bezier(.16,1,.3,1) ${delay+idx*0.022}s, opacity 0.5s ease ${delay+idx*0.022}s` }}>{ch}</span>);
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

function WordReveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal(0.15);
  const { isRTL } = useT();
  const text = typeof children === "string" ? children : "";
  if (isRTL) {
    return (<span ref={ref} style={{ display:"inline-block", overflow:"hidden", ...style }}><span style={{ display:"inline-block", transform:vis?"translateY(0)":"translateY(100%)", opacity:vis?1:0, transition:`transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, opacity 0.6s ease ${delay}s` }}>{text}</span></span>);
  }
  const words = text.split(" ");
  return (
    <span ref={ref} style={{ display: "inline", ...style }}>
      {words.map((w, i) => (<span key={i} style={{ display:"inline-block",overflow:"hidden",marginRight:"0.25em" }}><span style={{ display:"inline-block",transform:vis?"translateY(0)":"translateY(100%)",opacity:vis?1:0,transition:`transform 0.8s cubic-bezier(.16,1,.3,1) ${delay+i*0.04}s, opacity 0.6s ease ${delay+i*0.04}s` }}>{w}</span></span>))}
    </span>
  );
}

function Reveal({ children, delay = 0, direction = "up", className = "", style = {} }) {
  const [ref, vis] = useReveal(0.1);
  const { isRTL } = useT();
  let d = { up:[0,50], down:[0,-50], left:[50,0], right:[-50,0], none:[0,0] }[direction] || [0,50];
  if (isRTL && (direction==="left"||direction==="right")) d = [-d[0], d[1]];
  return (<div ref={ref} className={className} style={{ transform:vis?"translate3d(0,0,0)":`translate3d(${d[0]}px,${d[1]}px,0)`, opacity:vis?1:0, transition:`transform 1s cubic-bezier(.16,1,.3,1) ${delay}s, opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`, willChange:"transform, opacity", ...style }}>{children}</div>);
}

function Magnetic({ children, strength = 0.25, style = {} }) {
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  return (<div ref={ref} style={{ ...style, transform:`translate3d(${off.x}px,${off.y}px,0)`, transition:"transform 0.4s cubic-bezier(.4,0,.2,1)" }}
    onMouseMove={(e) => { const r=ref.current.getBoundingClientRect(); setOff({ x:(e.clientX-r.left-r.width/2)*strength, y:(e.clientY-r.top-r.height/2)*strength }); }}
    onMouseLeave={() => setOff({ x:0, y:0 })}>{children}</div>);
}

function Label({ children }) {
  const [ref, vis] = useReveal();
  const { isRTL } = useT();
  return (<div ref={ref} style={{ marginBottom:"1.5rem" }}>
    <span style={{ display:"inline-flex",alignItems:"center",gap:"0.6rem",fontFamily:"var(--f-body)",fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:T.accent,opacity:vis?1:0,transform:vis?"translateX(0)":`translateX(${isRTL?"20px":"-20px"})`,transition:"all 0.8s cubic-bezier(.16,1,.3,1)",direction:"ltr" }}>
      <span style={{ width:24,height:1,background:T.accent,display:"inline-block" }} />{children}
    </span>
  </div>);
}

function LineReveal({ delay = 0, color = T.border }) {
  const [ref, vis] = useReveal();
  const { isRTL } = useT();
  return (<div ref={ref} style={{ overflow:"hidden",height:1 }}><div style={{ height:1,background:color,transform:vis?"scaleX(1)":"scaleX(0)",transformOrigin:isRTL?"right":"left",transition:`transform 1.2s cubic-bezier(.16,1,.3,1) ${delay}s` }} /></div>);
}

// ═══ CURSOR ═══
function Cursor({ mouse }) {
  const [hov, setHov] = useState(false);
  const sx = useSmoothVal(mouse.cx, 0.15);
  const sy = useSmoothVal(mouse.cy, 0.15);
  useEffect(() => { const el=document.elementFromPoint(mouse.cx,mouse.cy); setHov(!!el&&(el.tagName==="A"||el.tagName==="BUTTON"||!!el.closest("a,button,[data-hover]"))); }, [mouse.cx, mouse.cy]);
  const sz = hov ? 56 : 20;
  return (<>
    <div style={{ position:"fixed",left:sx-sz/2,top:sy-sz/2,width:sz,height:sz,borderRadius:"50%",border:`1px solid ${hov?T.accent:"var(--cursor-ring)"}`,background:hov?"rgba(0,229,160,0.06)":"transparent",transition:"width 0.35s cubic-bezier(.4,0,.2,1),height 0.35s cubic-bezier(.4,0,.2,1),border-color 0.3s,background 0.3s",pointerEvents:"none",zIndex:9999,mixBlendMode:"difference" }} />
    <div style={{ position:"fixed",left:mouse.cx-2.5,top:mouse.cy-2.5,width:5,height:5,borderRadius:"50%",background:T.accent,pointerEvents:"none",zIndex:9999 }} />
  </>);
}

// ═══ LANGUAGE SWITCHER ═══
function LangSwitcher({ mobile = false }) {
  const { locale, setLocale, isRTL } = useT();
  const langs = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "ar", label: "عر" },
  ];
  return (
    <div style={{ display:"flex", alignItems:"center", gap: mobile ? "1rem" : "0.15rem", direction: "ltr" }}>
      {langs.map((l, i) => (
        <button
          key={l.code}
          data-hover
          onClick={() => setLocale(l.code)}
          style={{
            background: locale === l.code ? "rgba(0,229,160,0.12)" : "transparent",
            border: locale === l.code ? `1px solid ${T.borderHover}` : "1px solid transparent",
            borderRadius: mobile ? "2rem" : "0.4rem",
            padding: mobile ? "0.5rem 1.5rem" : "0.3rem 0.55rem",
            fontFamily: l.code === "ar" ? "var(--f-ar)" : "var(--f-body)",
            fontSize: mobile ? "1rem" : "0.7rem",
            fontWeight: locale === l.code ? 700 : 500,
            color: locale === l.code ? T.accent : T.textDim,
            letterSpacing: l.code === "ar" ? "0" : "0.05em",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

// ═══ SERVICE COLORS & DETAILS ═══
const serviceColors = ["#00e5a0","#5eead4","#a78bfa","#fbbf24","#f472b6","#60a5fa"];

const serviceDetails = [
  {
    detail: "We build lightning-fast, scalable web applications using the latest in React, Next.js, and edge-native architectures. Every line of code is purpose-built for performance, accessibility, and long-term maintainability.",
    features: [
      { icon: "⚡", label: "Sub-second load times", desc: "Optimized bundles, CDN delivery, and smart caching strategies." },
      { icon: "🏗️", label: "Scalable architecture", desc: "Modular design systems built to grow with your product." },
      { icon: "♿", label: "Accessibility first", desc: "WCAG 2.1 AA compliance baked into every component." },
      { icon: "📱", label: "Responsive by default", desc: "Pixel-perfect across all devices and screen sizes." },
    ],
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "Vercel", "PostgreSQL"],
  },
  {
    detail: "We embed the most powerful AI models directly into your product — from intelligent chatbots and recommendation engines to semantic search and multi-modal pipelines. Your product becomes a thinking machine.",
    features: [
      { icon: "🧠", label: "LLM Integration", desc: "GPT-4, Claude, Gemini — we connect the best models to your workflow." },
      { icon: "🔍", label: "Semantic Search", desc: "Vector embeddings for lightning-fast contextual retrieval." },
      { icon: "💬", label: "Conversational AI", desc: "Custom chatbots fine-tuned on your data and brand voice." },
      { icon: "🔮", label: "Predictive Models", desc: "Forecast trends and behaviors with trained ML pipelines." },
    ],
    tags: ["OpenAI", "Claude API", "LangChain", "Pinecone", "Python", "RAG"],
  },
  {
    detail: "We design intelligent business systems that observe, learn, and respond to real-time data. From dynamic pricing engines to self-healing infrastructure, your operations evolve continuously.",
    features: [
      { icon: "📊", label: "Real-time Analytics", desc: "Live dashboards that surface insights the moment they matter." },
      { icon: "🤖", label: "Adaptive Systems", desc: "Rules engines and ML models that improve with every data point." },
      { icon: "🛡️", label: "Anomaly Detection", desc: "Automated alerts when patterns break or risks emerge." },
      { icon: "🔄", label: "Continuous Learning", desc: "Models that retrain on new data without human intervention." },
    ],
    tags: ["TensorFlow", "Apache Kafka", "Redis", "ClickHouse", "FastAPI", "Docker"],
  },
  {
    detail: "We map, optimize, and automate your most time-consuming workflows. From document processing to multi-system orchestration, we reclaim hundreds of hours per month for your team.",
    features: [
      { icon: "⚙️", label: "Workflow Automation", desc: "End-to-end process orchestration across all your tools." },
      { icon: "📄", label: "Document Intelligence", desc: "AI extraction from PDFs, emails, and forms at scale." },
      { icon: "🔗", label: "API Integration", desc: "Seamlessly connect any stack — CRM, ERP, SaaS, and more." },
      { icon: "📈", label: "ROI Tracking", desc: "Real-time dashboards showing time and cost savings." },
    ],
    tags: ["n8n", "Zapier", "Make", "Python", "REST APIs", "Webhooks"],
  },
  {
    detail: "We take on the hard problems other agencies refuse. Complex data pipelines, impossible deadlines, legacy system migrations, multi-modal AI research — this is where we thrive.",
    features: [
      { icon: "🧩", label: "Complex Problem Solving", desc: "We dissect hard problems into elegant, solvable components." },
      { icon: "🔬", label: "AI Research & Prototyping", desc: "Rapid prototypes that validate your riskiest assumptions fast." },
      { icon: "🏚️", label: "Legacy Modernization", desc: "Migrate decade-old systems without breaking what works." },
      { icon: "🎯", label: "Custom AI Models", desc: "Fine-tuned models trained specifically for your domain." },
    ],
    tags: ["PyTorch", "HuggingFace", "CUDA", "Rust", "GraphQL", "Kubernetes"],
  },
  {
    detail: "We forensically audit your digital presence and eliminate every point of friction. From Core Web Vitals to conversion funnels, we turn data into measurable revenue growth.",
    features: [
      { icon: "🚀", label: "Performance Tuning", desc: "Core Web Vitals optimization for top search rankings." },
      { icon: "🎨", label: "Conversion Design", desc: "A/B tested UX improvements that move the needle." },
      { icon: "📉", label: "Funnel Analysis", desc: "Identify and eliminate every drop-off point in your user journey." },
      { icon: "🌐", label: "SEO Engineering", desc: "Technical SEO that drives compounding organic growth." },
    ],
    tags: ["GA4", "Mixpanel", "Hotjar", "Lighthouse", "Semrush", "Figma"],
  },
];

// ═══ SERVICE MODAL ═══
function ServiceModal({ service, color, onClose }) {
  const { isRTL } = useT();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 420);
  }, [onClose]);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [handleClose]);
  if (!service) return null;
  const detail = serviceDetails[service.index];
  const c = color;
  const isVisible = mounted && !closing;
  return (
    <div onClick={handleClose} style={{ position:"fixed",inset:0,zIndex:10000,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",opacity:isVisible?1:0,transition:"opacity 0.4s cubic-bezier(.4,0,.2,1)" }}>
      <div onClick={(e)=>e.stopPropagation()} style={{ background:"var(--bg-card)",borderRadius:"1.75rem",border:`1px solid ${c}28`,maxWidth:760,width:"100%",maxHeight:"90vh",overflowY:"auto",position:"relative",transform:isVisible?"translateY(0) scale(1)":"translateY(48px) scale(0.95)",opacity:isVisible?1:0,transition:"transform 0.45s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1)",boxShadow:`0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px ${c}22`,direction:isRTL?"rtl":"ltr",scrollbarWidth:"thin",scrollbarColor:`${c}33 transparent` }}>
        {/* ── Header ── */}
        <div style={{ background:`linear-gradient(135deg, ${c}20 0%, ${c}08 50%, transparent 100%)`,borderBottom:`1px solid ${c}18`,padding:"3rem 3rem 2.5rem",position:"relative",overflow:"hidden",borderRadius:"1.75rem 1.75rem 0 0",textAlign:isRTL?"right":"left" }}>
          <div style={{ position:"absolute",top:"-30%",[isRTL?"left":"right"]:"-10%",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle, ${c}35, transparent 70%)`,filter:"blur(60px)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",inset:0,opacity:0.035,backgroundImage:`linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none" }} />
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.75rem",flexDirection:isRTL?"row-reverse":"row",position:"relative" }}>
            <div style={{ width:72,height:72,borderRadius:18,background:`linear-gradient(135deg, ${c}30, ${c}14)`,border:`1px solid ${c}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",boxShadow:`0 8px 32px ${c}30`,animation:"float-s 3s ease-in-out infinite" }}>{service.icon}</div>
            <button data-hover onClick={handleClose} style={{ background:"var(--bg-alt)",border:"1px solid var(--border)",borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--c-text-muted)",fontSize:"1rem",cursor:"pointer",transition:"all 0.35s cubic-bezier(.4,0,.2,1)",flexShrink:0 }} onMouseEnter={(e)=>{ e.currentTarget.style.background=`${c}22`; e.currentTarget.style.borderColor=c; e.currentTarget.style.color=c; e.currentTarget.style.transform="rotate(90deg)"; }} onMouseLeave={(e)=>{ e.currentTarget.style.background="var(--bg-alt)"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--c-text-muted)"; e.currentTarget.style.transform="rotate(0deg)"; }}>✕</button>
          </div>
          <h2 style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:800,fontSize:"clamp(1.5rem,3vw,2.1rem)",color:"var(--c-text)",letterSpacing:isRTL?"0":"-0.025em",marginBottom:"1rem",lineHeight:1.1,position:"relative" }}>{service.title}</h2>
          <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"1rem",lineHeight:1.75,color:"var(--c-text-muted)",maxWidth:520,fontWeight:300,position:"relative" }}>{detail.detail}</p>
        </div>
        {/* ── Features ── */}
        <div style={{ padding:"2.5rem 3rem" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"1rem",marginBottom:"2.5rem" }}>
            {detail.features.map((f, i) => <FeatureItem key={i} feature={f} color={c} index={i} />)}
          </div>
          {/* ── Tech tags ── */}
          <div style={{ borderTop:"1px solid var(--border)",paddingTop:"1.75rem" }}>
            <p style={{ fontFamily:"var(--f-body)",fontSize:"0.68rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--c-text-dim)",marginBottom:"1rem",fontWeight:600 }}>Tech Stack</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"0.6rem",justifyContent:isRTL?"flex-end":"flex-start" }}>
              {detail.tags.map((tag) => (
                <span key={tag} style={{ fontFamily:"var(--f-body)",fontSize:"0.78rem",fontWeight:500,padding:"0.35rem 0.9rem",borderRadius:"2rem",background:`${c}12`,border:`1px solid ${c}28`,color:c,letterSpacing:"0.02em" }}>{tag}</span>
              ))}
            </div>
          </div>
          {/* ── CTA ── */}
          <div style={{ marginTop:"2.5rem" }}>
            <ModalCTA color={c} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ feature, color, index }) {
  const [h, setH] = useState(false);
  const { isRTL } = useT();
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ padding:"1.25rem 1.5rem",borderRadius:"1rem",background:h?`${color}0e`:"var(--bg-alt)",border:`1px solid ${h?color+"33":"var(--border)"}`,transition:"all 0.35s cubic-bezier(.4,0,.2,1)",transform:h?"translateY(-3px)":"translateY(0)",textAlign:isRTL?"right":"left",animationDelay:`${index*0.07}s` }}>
      <span style={{ fontSize:"1.3rem",display:"block",marginBottom:"0.6rem" }}>{feature.icon}</span>
      <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:700,fontSize:"0.88rem",color:"var(--c-text)",marginBottom:"0.35rem" }}>{feature.label}</p>
      <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.82rem",lineHeight:1.55,color:"var(--c-text-muted)",fontWeight:300 }}>{feature.desc}</p>
    </div>
  );
}

function ModalCTA({ color }) {
  const [h, setH] = useState(false);
  return (
    <button data-hover onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{ fontFamily:"var(--f-body)",fontWeight:600,fontSize:"0.9rem",padding:"0.85rem 2.25rem",borderRadius:"2rem",background:h?color:`${color}18`,color:h?"#08090d":color,border:`1px solid ${color}44`,cursor:"pointer",transition:"all 0.3s cubic-bezier(.4,0,.2,1)",letterSpacing:"0.02em",boxShadow:h?`0 8px 24px ${color}44`:"none",transform:h?"translateY(-2px)":"translateY(0)" }}>Start this project →</button>
  );
}

// ═══ SERVICE CARD ═══
function ServiceCard({ icon, title, description, learnMore, index, color, onClick }) {
  const [h, setH] = useState(false);
  const { isRTL } = useT();
  const c = color || T.accent;
  return (
    <Reveal delay={index * 0.08} style={{ height: "100%" }}>
      <div data-hover onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ height:"100%",padding:"2.5rem 2rem",borderRadius:"1.25rem",background:h?`${c}05`:T.bgCard,border:`1px solid ${h?c+"44":T.border}`,transition:"all 0.5s cubic-bezier(.4,0,.2,1)",transform:h?"translateY(-8px)":"translateY(0)",position:"relative",overflow:"hidden",cursor:"pointer",textAlign:isRTL?"right":"left",boxShadow:h?`0 20px 60px ${c}18`:"none" }}>
        <div style={{ position:"absolute",top:0,[isRTL?"left":"right"]:0,width:160,height:160,background:`radial-gradient(circle at ${isRTL?"top left":"top right"},${h?c+"14":c+"05"},transparent)`,transition:"background 0.5s" }} />
        <div style={{ position:"absolute",inset:0,opacity:h?0.025:0,backgroundImage:`linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,backgroundSize:"32px 32px",transition:"opacity 0.5s",pointerEvents:"none" }} />
        <div style={{ width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:"1.75rem",background:h?`linear-gradient(135deg,${c},${c}bb)`:`${c}14`,color:h?"#08090d":c,transition:"all 0.5s cubic-bezier(.4,0,.2,1)",transform:h?"scale(1.08) rotate(-4deg)":"scale(1) rotate(0deg)",boxShadow:h?`0 8px 24px ${c}44`:"none",position:"relative" }}>{icon}</div>
        <h3 style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:700,fontSize:"1.15rem",color:T.text,marginBottom:"0.75rem",letterSpacing:isRTL?"0":"-0.01em",position:"relative" }}>{title}</h3>
        <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.9rem",lineHeight:1.7,color:T.textMuted,position:"relative" }}>{description}</p>
        <div style={{ marginTop:"1.5rem",display:"flex",alignItems:"center",gap:"0.5rem",fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontWeight:600,fontSize:"0.8rem",color:c,opacity:h?1:0,transform:h?"translateX(0)":`translateX(${isRTL?"12px":"-12px"})`,transition:"all 0.4s cubic-bezier(.4,0,.2,1) 0.08s",position:"relative" }}>
          {learnMore} <span style={{ fontSize:"1rem" }}>{isRTL ? "←" : "→"}</span>
        </div>
      </div>
    </Reveal>
  );
}

// ═══ PROCESS ITEM ═══
function ProcessItem({ number, title, desc, index }) {
  const [h, setH] = useState(false);
  const { isRTL } = useT();
  return (
    <Reveal delay={index * 0.1}>
      <div data-hover onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ display:"flex",alignItems:"flex-start",gap:"2rem",padding:"2rem 0",cursor:"pointer",flexDirection:isRTL?"row-reverse":"row",textAlign:isRTL?"right":"left" }}>
        <div style={{ flexShrink:0,width:56,height:56,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--f-serif)",fontSize:"1.25rem",fontStyle:"italic",border:`1px solid ${h?T.accent:T.border}`,color:h?T.accent:T.textMuted,background:h?"rgba(0,229,160,0.06)":"transparent",transition:"all 0.5s cubic-bezier(.4,0,.2,1)",transform:h?"scale(1.1)":"scale(1)" }}>{number}</div>
        <div>
          <h4 style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:700,fontSize:"1.3rem",letterSpacing:isRTL?"0":"-0.01em",color:h?T.accent:T.text,marginBottom:"0.4rem",transition:"color 0.4s" }}>{title}</h4>
          <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.9rem",lineHeight:1.7,color:T.textMuted,maxWidth:380 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ═══ PROJECT CARD ═══
function ProjectCard({ title, category, color, index }) {
  const [h, setH] = useState(false);
  const { isRTL } = useT();
  return (
    <Reveal delay={index * 0.1}>
      <div data-hover onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ position:"relative",borderRadius:"1.25rem",overflow:"hidden",cursor:"pointer",aspectRatio:index%3===1?"3/4":"4/5",background:T.bgCard,border:`1px solid ${T.border}` }}>
        <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${color}22,${color}08)`,transition:"opacity 0.6s",opacity:h?1:0.5 }} />
        <div style={{ position:"absolute",top:"50%",left:"50%",width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${color}30,transparent)`,transform:h?"translate(-50%,-50%) scale(3)":"translate(-50%,-50%) scale(1)",transition:"transform 0.8s cubic-bezier(.16,1,.3,1)",filter:"blur(30px)" }} />
        <div style={{ position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(${color}40 1px,transparent 1px),linear-gradient(90deg,${color}40 1px,transparent 1px)`,backgroundSize:"40px 40px" }} />
        <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"2rem",background:"linear-gradient(transparent,rgba(10,10,16,0.88))",textAlign:isRTL?"right":"left" }}>
          <span style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.65rem",letterSpacing:isRTL?"0":"0.15em",textTransform:isRTL?"none":"uppercase",color,fontWeight:600,opacity:0.9 }}>{category}</span>
          <h3 style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:700,fontSize:"1.3rem",color:"#e8e6e1",marginTop:"0.3rem",letterSpacing:isRTL?"0":"-0.01em" }}>{title}</h3>
        </div>
        <div style={{ position:"absolute",top:"1.25rem",[isRTL?"left":"right"]:"1.25rem",width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#e8e6e1",fontSize:"0.9rem",opacity:h?1:0,transform:h?"translate(0,0)":`translate(${isRTL?"-8px":"8px"},-8px)`,transition:"all 0.5s cubic-bezier(.16,1,.3,1)" }}>{isRTL?"↖":"↗"}</div>
      </div>
    </Reveal>
  );
}

// ═══ TESTIMONIALS ═══
function Testimonials() {
  const { t, isRTL } = useT();
  const data = t.testimonials.items;
  const [active, setActive] = useState(0);
  useEffect(() => { const iv=setInterval(()=>setActive((a)=>(a+1)%data.length),6000); return()=>clearInterval(iv); }, [data.length]);
  return (
    <div style={{ maxWidth:700,margin:"0 auto",position:"relative",minHeight:250,textAlign:isRTL?"right":"left" }}>
      {data.map((item, i) => (
        <div key={i} style={{ position:i===active?"relative":"absolute",inset:0,opacity:i===active?1:0,transform:i===active?"translateY(0) scale(1)":"translateY(15px) scale(0.98)",transition:"all 0.9s cubic-bezier(.16,1,.3,1)",pointerEvents:i===active?"auto":"none" }}>
          <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-serif)",fontSize:"clamp(1.15rem,2.5vw,1.65rem)",lineHeight:1.7,color:T.text,fontStyle:isRTL?"normal":"italic",marginBottom:"2rem",fontWeight:isRTL?400:300 }}>"{item.quote}"</p>
          <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-display)",fontWeight:700,fontSize:"0.95rem",color:T.text }}>{item.author}</p>
          <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.8rem",color:T.textDim,marginTop:"0.2rem" }}>{item.role}</p>
        </div>
      ))}
      <div style={{ display:"flex",gap:"0.5rem",marginTop:"2.5rem",justifyContent:isRTL?"flex-end":"flex-start" }}>
        {data.map((_, i) => (<button key={i} onClick={()=>setActive(i)} style={{ width:i===active?40:8,height:4,borderRadius:2,border:"none",background:i===active?T.accent:T.border,transition:"all 0.5s cubic-bezier(.4,0,.2,1)",cursor:"pointer" }} />))}
      </div>
    </div>
  );
}

// ═══ STAT ═══
function Stat({ end, suffix = "", label }) {
  const [ref, vis] = useReveal(0.3);
  const [val, setVal] = useState(0);
  const { isRTL } = useT();
  useEffect(() => { if(!vis)return; const dur=2200,start=performance.now(); const tick=(now)=>{ const p=Math.min((now-start)/dur,1); setVal(Math.round((1-Math.pow(1-p,4))*end)); if(p<1)requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, [vis, end]);
  return (
    <div ref={ref} style={{ textAlign: isRTL ? "right" : "left" }}>
      <span style={{ fontFamily:"var(--f-serif)",fontSize:"clamp(2.5rem,5vw,3.5rem)",color:T.text,fontWeight:300,fontStyle:"italic" }}>{val}{suffix}</span>
      <p style={{ fontFamily:isRTL?"var(--f-ar)":"var(--f-body)",fontSize:"0.8rem",color:T.textDim,marginTop:"0.4rem",letterSpacing:isRTL?"0":"0.05em" }}>{label}</p>
    </div>
  );
}

// ═══ GRAIN ═══
function Grain() {
  return <div style={{ position:"fixed",inset:0,zIndex:9998,pointerEvents:"none",opacity:0.03,mixBlendMode:"overlay",background:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />;
}

// ═══ ROBOT BUTTON ═══
function RobotButton({ open, onClick, isRTL }) {
  const [wave, setWave]       = useState(false);
  const [bubble, setBubble]   = useState(false);
  const [shakeKey, setShake]  = useState(0);
  const [msgIdx, setMsgIdx]   = useState(0);
  const msgs = ["Chat with me! 💬", "Ask anything! 🤖", "Hey there! 👋"];
  const side  = isRTL ? "left" : "right";

  useEffect(() => {
    if (open) return;
    const t1 = setTimeout(() => { setWave(true);  setTimeout(() => setWave(false),  1600); }, 1600);
    const t2 = setTimeout(() => { setBubble(true); setTimeout(() => setBubble(false), 3200); }, 2400);
    const iv = setInterval(() => {
      setShake(k => k + 1);
      setTimeout(() => { setWave(true);  setTimeout(() => setWave(false),  1600); }, 350);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % msgs.length);
        setBubble(true);
        setTimeout(() => setBubble(false), 3200);
      }, 900);
    }, 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, [open]);

  return (
    <div data-hover onClick={onClick} style={{ position:"fixed", bottom:24, [side]:24, zIndex:9991, cursor:"pointer" }}>

      {/* ── expanding glow ring at base ── */}
      {!open && <div style={{ position:"absolute", bottom:0, left:"50%", width:62, height:62, borderRadius:"50%", border:"1.5px solid var(--accent)", animation:"rb-ring 2.4s ease-out infinite", pointerEvents:"none" }} />}

      {/* ── speech bubble ── */}
      {!open && bubble && (
        <div style={{ position:"absolute", bottom:90, [isRTL?"right":"left"]:-4, background:"var(--bg-card)", border:"1px solid var(--border-hover)", borderRadius: isRTL ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding:"7px 14px", whiteSpace:"nowrap", fontSize:"0.72rem", fontFamily:"var(--f-body)", fontWeight:600, color:"var(--c-text)", boxShadow:"0 6px 24px rgba(0,0,0,0.15)", animation:"rb-bubble 3.2s ease-in-out forwards", pointerEvents:"none", zIndex:1 }}>
          {msgs[msgIdx]}
        </div>
      )}

      {open ? (
        /* ── CLOSE STATE ── */
        <div style={{ width:54, height:54, borderRadius:"50%", background:"var(--bg-card)", border:"1.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--c-text-muted)", fontSize:"1.05rem", boxShadow:"0 4px 24px rgba(0,0,0,0.2)", animation:"rb-open-pop 0.5s cubic-bezier(.16,1,.3,1)", transition:"all 0.25s" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.color="var(--c-text)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--c-text-muted)"; }}
        >✕</div>
      ) : (
        /* ── ROBOT ── */
        <div key={shakeKey} style={{ animation: shakeKey > 0 ? "rb-shake 0.75s ease-in-out" : "none", display:"inline-block" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", animation:"rb-float 3.4s ease-in-out infinite", filter:"drop-shadow(0 6px 18px rgba(0,229,160,0.32)) drop-shadow(0 3px 8px rgba(0,0,0,0.45))", transition:"filter 0.3s, transform 0.3s", userSelect:"none" }}
            onMouseEnter={e=>{ e.currentTarget.style.filter="drop-shadow(0 9px 28px rgba(0,229,160,0.58)) drop-shadow(0 4px 10px rgba(0,0,0,0.55))"; e.currentTarget.style.transform="scale(1.1)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.filter="drop-shadow(0 6px 18px rgba(0,229,160,0.32)) drop-shadow(0 3px 8px rgba(0,0,0,0.45))"; e.currentTarget.style.transform="scale(1)"; }}
          >
            {/* ── Antenna ── */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)", animation:"rb-led 1.3s ease-in-out infinite" }} />
              <div style={{ width:2, height:12, background:"linear-gradient(to bottom, var(--accent) 0%, var(--rb-mid) 100%)", borderRadius:1 }} />
            </div>

            {/* ── Head ── */}
            <div style={{ width:48, height:38, background:"linear-gradient(150deg, var(--rb-dark) 0%, var(--rb-mid) 55%, var(--rb-deep) 100%)", borderRadius:13, border:"1.5px solid var(--rb-rim)", position:"relative", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.1), inset 0 -2px 5px rgba(0,0,0,0.55), 3px 4px 12px rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, animation:"rb-scan 4.8s ease-in-out infinite 0.6s", overflow:"hidden" }}>
              {/* top visor gloss */}
              <div style={{ position:"absolute", top:3, left:5, right:5, height:9, borderRadius:"9px 9px 0 0", background:"linear-gradient(to bottom, rgba(255,255,255,0.09), transparent)", pointerEvents:"none" }} />
              {/* eyes */}
              {[0, 0.2].map((d, i) => (
                <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"var(--accent)", animation:`rb-blink 3.8s ease-in-out infinite ${d}s, rb-eye-breathe 2.5s ease-in-out infinite ${d*2}s`, flexShrink:0 }} />
              ))}
              {/* ear plates */}
              {[["left","to right","borderRight"],["right","to left","borderLeft"]].map(([s, grad, removeBorder]) => (
                <div key={s} style={{ position:"absolute", [s]:-5, top:"50%", transform:"translateY(-50%)", width:6, height:16, background:`linear-gradient(${grad}, var(--rb-deep), var(--rb-dark))`, borderRadius: s==="left" ? "3px 0 0 3px" : "0 3px 3px 0", border:"1px solid var(--rb-rim)", [removeBorder]:"none" }} />
              ))}
            </div>

            {/* ── Neck segments ── */}
            <div style={{ display:"flex", gap:4, marginTop:1 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:5, background:"var(--rb-mid)", border:"1px solid var(--rb-rim)", borderRadius:2 }} />)}
            </div>

            {/* ── Body ── */}
            <div style={{ width:56, height:36, background:"linear-gradient(155deg, var(--rb-dark) 0%, var(--rb-mid) 45%, var(--rb-deep) 100%)", borderRadius:12, border:"1.5px solid var(--rb-rim)", position:"relative", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.07), inset 0 -3px 7px rgba(0,0,0,0.6), 3px 6px 18px rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"visible" }}>
              {/* shoulder gloss */}
              <div style={{ position:"absolute", top:2, left:7, right:7, height:5, borderRadius:"7px 7px 0 0", background:"linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)", pointerEvents:"none" }} />
              {/* chest panel */}
              <div style={{ width:24, height:15, borderRadius:5, background:"linear-gradient(135deg, rgba(0,229,160,0.22), rgba(0,229,160,0.05))", border:"1px solid var(--accent)", animation:"rb-chest 2.2s ease-in-out infinite", display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"var(--accent)", opacity:0.85 }} />)}
              </div>
              {/* left arm */}
              <div style={{ position:"absolute", left:-13, top:2, width:13, height:24, background:"linear-gradient(to right, var(--rb-deep), var(--rb-dark))", borderRadius:"5px 0 0 8px", border:"1.5px solid var(--rb-rim)", borderRight:"none", transformOrigin:"top right", animation: wave ? "rb-wave 0.5s ease-in-out 3" : "none" }} />
              {/* left hand nub */}
              <div style={{ position:"absolute", left:-15, bottom:3, width:8, height:8, borderRadius:"50%", background:"var(--rb-mid)", border:"1px solid var(--rb-rim)" }} />
              {/* right arm */}
              <div style={{ position:"absolute", right:-13, top:2, width:13, height:24, background:"linear-gradient(to left, var(--rb-deep), var(--rb-dark))", borderRadius:"0 5px 8px 0", border:"1.5px solid var(--rb-rim)", borderLeft:"none" }} />
              {/* right hand nub */}
              <div style={{ position:"absolute", right:-15, bottom:3, width:8, height:8, borderRadius:"50%", background:"var(--rb-mid)", border:"1px solid var(--rb-rim)" }} />
            </div>

            {/* ── Legs ── */}
            <div style={{ display:"flex", gap:10, marginTop:2 }}>
              {[0,1].map(i => <div key={i} style={{ width:15, height:11, background:"linear-gradient(to bottom, var(--rb-dark), var(--rb-deep))", borderRadius:"0 0 5px 5px", border:"1.5px solid var(--rb-rim)", borderTop:"none" }} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ CHATBOT ═══
function Chatbot() {
  const { t, isRTL, locale } = useT();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => [{ role: "assistant", content: t.chatbot.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fb = isRTL ? "var(--f-ar)" : "var(--f-body)";

  useEffect(() => { setMsgs([{ role: "assistant", content: t.chatbot.welcome }]); }, [locale]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...msgs, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const apiMsgs = next.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMsgs }) });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value);
        setMsgs((prev) => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: u[u.length - 1].content + chunk }; return u; });
      }
    } catch {
      setMsgs((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Please try again." }; return u; });
    }
    setLoading(false);
  };

  return (<>
    {/* Panel */}
    <div style={{ position:"fixed", bottom:96, [isRTL?"left":"right"]:24, width:"min(360px,calc(100vw - 48px))", maxHeight:520, background:T.bgAlt, border:`1px solid ${open?T.borderHover:T.border}`, borderRadius:"1.25rem", display:"flex", flexDirection:"column", overflow:"hidden", zIndex:9990, boxShadow:"var(--shadow-panel)", opacity:open?1:0, transform:open?"translateY(0) scale(1)":"translateY(16px) scale(0.97)", pointerEvents:open?"auto":"none", transition:"all 0.4s cubic-bezier(.16,1,.3,1)" }}>
      {/* Header */}
      <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:T.bgCard, flexDirection:isRTL?"row-reverse":"row" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", flexDirection:isRTL?"row-reverse":"row" }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.accentAlt})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.95rem", color:T.bg, fontWeight:700, flexShrink:0 }}>✦</div>
          <div style={{ textAlign:isRTL?"right":"left" }}>
            <div style={{ fontFamily:"var(--f-display)", fontWeight:800, fontSize:"0.88rem", color:T.text, letterSpacing:"-0.02em" }}>{t.chatbot.title}</div>
            <div style={{ fontFamily:fb, fontSize:"0.6rem", color:T.accent, letterSpacing:"0.12em", textTransform:"uppercase" }}>{t.chatbot.subtitle}</div>
          </div>
        </div>
        <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontSize:"1rem", padding:"0.25rem", display:"flex", alignItems:"center", transition:"color 0.2s" }} onMouseEnter={(e)=>e.target.style.color=T.text} onMouseLeave={(e)=>e.target.style.color=T.textDim}>✕</button>
      </div>
      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem", scrollbarWidth:"thin", scrollbarColor:"rgba(0,229,160,0.15) transparent" }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?(isRTL?"flex-start":"flex-end"):(isRTL?"flex-end":"flex-start") }}>
            <div style={{ maxWidth:"85%", padding:"0.75rem 1rem", borderRadius:msg.role==="user"?"1rem 1rem 0.25rem 1rem":"1rem 1rem 1rem 0.25rem", background:msg.role==="user"?T.accent:T.bgCard, color:msg.role==="user"?T.bg:T.text, fontFamily:fb, fontSize:"0.85rem", lineHeight:1.65, border:`1px solid ${msg.role==="user"?"transparent":T.border}`, textAlign:isRTL?"right":"left", direction:isRTL?"rtl":"ltr", whiteSpace:"pre-wrap" }}>
              {msg.content || (loading && i===msgs.length-1 ? (
                <span style={{ display:"inline-flex", gap:4, alignItems:"center", height:16 }}>
                  {[0,1,2].map((j)=>(<span key={j} style={{ width:5, height:5, borderRadius:"50%", background:T.textMuted, display:"inline-block", animation:`dot-bounce 1.2s ${j*0.18}s ease-in-out infinite` }} />))}
                </span>
              ) : null)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{ padding:"0.875rem 1.25rem", borderTop:`1px solid ${T.border}`, display:"flex", gap:"0.5rem", flexDirection:isRTL?"row-reverse":"row" }}>
        <input ref={inputRef} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={t.chatbot.placeholder} dir={isRTL?"rtl":"ltr"} style={{ flex:1, padding:"0.65rem 1rem", borderRadius:"2rem", border:`1px solid ${T.border}`, background:T.bg, fontFamily:fb, fontSize:"0.85rem", color:T.text, outline:"none", transition:"border-color 0.2s", textAlign:isRTL?"right":"left" }} onFocus={(e)=>e.target.style.borderColor=T.accent} onBlur={(e)=>e.target.style.borderColor=T.border} />
        <button onClick={send} disabled={!input.trim()||loading} data-hover style={{ padding:"0.65rem 1.1rem", borderRadius:"2rem", border:"none", background:input.trim()&&!loading?T.accent:"rgba(0,229,160,0.12)", color:input.trim()&&!loading?T.bg:T.textDim, fontFamily:fb, fontWeight:700, fontSize:"0.78rem", cursor:input.trim()&&!loading?"pointer":"default", transition:"all 0.2s", whiteSpace:"nowrap" }}>{t.chatbot.send}</button>
      </div>
      {/* Footer */}
      <div style={{ padding:"0.35rem", textAlign:"center", borderTop:`1px solid ${T.border}` }}>
        <span style={{ fontFamily:fb, fontSize:"0.58rem", color:T.textDim, letterSpacing:"0.08em" }}>{t.chatbot.powered}</span>
      </div>
    </div>

    {/* Robot Button */}
    <RobotButton open={open} onClick={()=>{ setOpen((o)=>!o); if(!open) setTimeout(()=>inputRef.current?.focus(), 420); }} isRTL={isRTL} />
  </>);
}

// ═══════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════
function AppContent() {
  const mouse = useMouse();
  const { locale, t, isRTL, setLocale } = useT();
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setSY] = useState(0);
  const [navVis, setNavVis] = useState(true);
  const [menuOpen, setMenu] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const lastY = useRef(0);
  const onDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const h = () => { const y=window.scrollY; setNavVis(y<80||y<lastY.current-5); lastY.current=y; setSY(y); };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const icons = ["◇", "⬡", "◈", "⟁", "◎", "⬢"];
  const projectColors = ["#00e5a0", "#5eead4", "#f0abfc", "#fbbf24"];
  const navSections = [
    { key: "services", label: t.nav.services },
    { key: "about", label: t.nav.about },
    { key: "process", label: t.nav.process },
    { key: "work", label: t.nav.work },
    { key: "contact", label: t.nav.contact },
  ];

  const ff = isRTL ? "var(--f-ar)" : "var(--f-display)";
  const fb = isRTL ? "var(--f-ar)" : "var(--f-body)";
  const fs = "var(--f-serif)";
  const ta = isRTL ? "right" : "left";

  return (<>
    {!loaded && <LoadingScreen onDone={onDone} />}
    <Grain />
    <Chatbot />
    <div className="hm"><Cursor mouse={mouse} /></div>

    {/* ═══ NAV ═══ */}
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"1.25rem clamp(1.5rem,4vw,3rem)",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrollY>60?"var(--bg-glass)":"transparent",backdropFilter:scrollY>60?"blur(24px) saturate(1.2)":"none",borderBottom:`1px solid ${scrollY>60?T.border:"transparent"}`,transform:navVis?"translateY(0)":"translateY(-100%)",transition:"all 0.5s cubic-bezier(.4,0,.2,1)" }}>
      <Magnetic strength={0.15}>
        <div data-hover onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{ fontFamily:"var(--f-display)",fontWeight:900,fontSize:"1.3rem",letterSpacing:"-0.04em",cursor:"pointer",direction:"ltr" }}>
          <span style={{color:T.text}}>nexa</span><span style={{color:T.accent}}>gen</span>
          <span style={{ display:"inline-block",width:5,height:5,borderRadius:"50%",background:T.accent,marginLeft:1,verticalAlign:"super" }} />
        </div>
      </Magnetic>

      <div className="hm" style={{ display:"flex",alignItems:"center",gap:"2rem" }}>
        {navSections.map((s) => (
          <button key={s.key} className="nl" onClick={()=>scrollTo(s.key)} style={{ background:"none",border:"none",fontFamily:fb,fontSize:"0.82rem",fontWeight:500,color:T.textMuted,letterSpacing:isRTL?"0":"0.02em",transition:"color 0.3s" }}
            onMouseEnter={(e)=>e.currentTarget.style.color=T.text} onMouseLeave={(e)=>e.currentTarget.style.color=T.textMuted}>{s.label}</button>
        ))}
        <LangSwitcher />
        <ThemeToggle />
        <Magnetic strength={0.2}>
          <button data-hover onClick={()=>scrollTo("contact")} style={{ padding:"0.6rem 1.6rem",borderRadius:"3rem",border:`1px solid ${T.accent}`,background:"transparent",color:T.accent,fontFamily:fb,fontWeight:600,fontSize:"0.82rem",transition:"all 0.35s",whiteSpace:"nowrap" }}
            onMouseEnter={(e)=>{e.currentTarget.style.background=T.accent;e.currentTarget.style.color=T.bg;}} onMouseLeave={(e)=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.accent;}}>{t.nav.startProject}</button>
        </Magnetic>
      </div>

      <button className="hd" onClick={()=>setMenu(!menuOpen)} style={{ background:"none",border:"none",display:"flex",flexDirection:"column",gap:menuOpen?0:5,padding:8 }}>
        {[0,1,2].map((i)=><span key={i} style={{ display:"block",height:1.5,width:i===1?18:24,background:T.text,borderRadius:1,transition:"all 0.3s",opacity:menuOpen&&i===1?0:1,transform:menuOpen?(i===0?"rotate(45deg) translateY(1px)":i===2?"rotate(-45deg) translateY(-1px)":""):"none" }} />)}
      </button>
    </nav>

    {/* MOBILE MENU */}
    <div style={{ position:"fixed",inset:0,zIndex:999,background:"var(--bg-overlay)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.5rem",opacity:menuOpen?1:0,pointerEvents:menuOpen?"auto":"none",transition:"opacity 0.4s" }}>
      {navSections.map((s,i) => (
        <button key={s.key} onClick={()=>scrollTo(s.key)} style={{ background:"none",border:"none",fontFamily:ff,fontSize:"2rem",fontWeight:800,color:T.text,transform:menuOpen?"translateY(0)":"translateY(20px)",opacity:menuOpen?1:0,transition:`all 0.5s cubic-bezier(.16,1,.3,1) ${i*0.06}s` }}>{s.label}</button>
      ))}
      <div style={{ marginTop: "1rem", display:"flex", gap:"1rem", alignItems:"center" }}><LangSwitcher mobile /><ThemeToggle mobile /></div>
    </div>

    {/* ═══ HERO ═══ */}
    <section style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden" }}>
      <HeroScene mouse={mouse} />
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 70% at 50% 50%,transparent 30%,var(--bg-vignette))",pointerEvents:"none",zIndex:1 }} />
      <div style={{ position:"relative",zIndex:2,width:"100%",maxWidth:1200,margin:"0 auto",padding:"10rem clamp(1.5rem,4vw,3rem) 6rem",textAlign:ta }}>
        <Reveal delay={0.3}>
          <span style={{ display:"inline-flex",alignItems:"center",gap:"0.75rem",fontFamily:fb,fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:T.accent,marginBottom:"2.5rem",direction:"ltr" }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:T.accent,boxShadow:`0 0 12px ${T.accent}`,position:"relative" }}>
              <span style={{ position:"absolute",inset:-6,borderRadius:"50%",border:`1px solid ${T.accent}`,animation:"pulse-g 2.5s infinite",opacity:0.3 }} />
            </span>
            {t.hero.badge}
          </span>
        </Reveal>
        <div style={{ maxWidth:850 }}>
          <SplitText delay={0.4} style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2.8rem,7.5vw,6rem)",lineHeight:1.0,letterSpacing:isRTL?"0":"-0.04em",color:T.text,marginBottom:"0.15em" }}>{t.hero.line1}</SplitText>
          <div style={{ display:"flex",flexWrap:"wrap",alignItems:"baseline",gap:"0 0.3em",justifyContent:isRTL?"flex-end":"flex-start" }}>
            <SplitText delay={0.7} style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2.8rem,7.5vw,6rem)",lineHeight:1.0,letterSpacing:isRTL?"0":"-0.04em",color:T.text }}>{t.hero.line2}</SplitText>
            <SplitText delay={0.8} style={{ fontFamily:isRTL?ff:fs,fontWeight:isRTL?900:300,fontStyle:isRTL?"normal":"italic",fontSize:"clamp(2.8rem,7.5vw,6rem)",lineHeight:1.0,letterSpacing:isRTL?"0":"-0.02em",color:T.accent }}>{t.hero.line3}</SplitText>
          </div>
        </div>
        <Reveal delay={1.1}>
          <p style={{ maxWidth:440,marginTop:"2.5rem",fontFamily:fb,fontSize:"1.05rem",lineHeight:1.75,color:T.textMuted,fontWeight:300 }}>{t.hero.subtitle}</p>
        </Reveal>
        <Reveal delay={1.3}>
          <div style={{ display:"flex",gap:"1rem",marginTop:"3rem",flexWrap:"wrap",justifyContent:isRTL?"flex-end":"flex-start" }}>
            <Magnetic strength={0.2}>
              <button data-hover onClick={()=>scrollTo("contact")} style={{ padding:"1rem 2.5rem",borderRadius:"4rem",border:"none",background:T.accent,color:T.bg,fontFamily:fb,fontWeight:700,fontSize:"0.9rem",boxShadow:`0 0 40px rgba(0,229,160,0.25)`,transition:"all 0.35s" }}
                onMouseEnter={(e)=>e.target.style.boxShadow=`0 0 60px rgba(0,229,160,0.4)`} onMouseLeave={(e)=>e.target.style.boxShadow=`0 0 40px rgba(0,229,160,0.25)`}>{t.hero.cta1}</button>
            </Magnetic>
            <Magnetic strength={0.15}>
              <button data-hover onClick={()=>scrollTo("work")} style={{ padding:"1rem 2.5rem",borderRadius:"4rem",border:`1px solid ${T.border}`,background:"transparent",backdropFilter:"blur(10px)",color:T.textMuted,fontFamily:fb,fontWeight:600,fontSize:"0.9rem",transition:"all 0.35s" }}
                onMouseEnter={(e)=>{e.currentTarget.style.borderColor=T.borderHover;e.currentTarget.style.color=T.text;}} onMouseLeave={(e)=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMuted;}}>{t.hero.cta2}</button>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={1.5}>
          <div style={{ display:"flex",gap:"clamp(2rem,5vw,4rem)",marginTop:"clamp(4rem,8vw,7rem)",flexWrap:"wrap",justifyContent:isRTL?"flex-end":"flex-start" }}>
            {[[t.hero.stat1Num,t.hero.stat1Label],[t.hero.stat2Num,t.hero.stat2Label],[t.hero.stat3Num,t.hero.stat3Label]].map(([n,l],i)=>(
              <div key={i} style={{ display:"flex",alignItems:"baseline",gap:"0.5rem" }}>
                <span style={{ fontFamily:fs,fontSize:"1.8rem",color:T.text,fontWeight:300,fontStyle:"italic" }}>{n}</span>
                <span style={{ fontFamily:fb,fontSize:"0.75rem",color:T.textDim,fontWeight:500,letterSpacing:isRTL?"0":"0.05em" }}>{l}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <Reveal delay={1.8}><div style={{ position:"absolute",bottom:"2.5rem",left:"50%",transform:"translateX(-50%)",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem" }}>
        <span style={{ fontFamily:"var(--f-body)",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",color:T.textDim }}>{t.hero.scroll}</span>
        <div style={{ width:1,height:36,background:`linear-gradient(180deg,${T.textDim},transparent)`,animation:"float-s 2.5s ease-in-out infinite" }} />
      </div></Reveal>
    </section>

    {/* ═══ SERVICES ═══ */}
    <section id="services" style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,4vw,3rem)",maxWidth:1200,margin:"0 auto" }}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"3rem",alignItems:"end",marginBottom:"5rem",textAlign:ta }}>
        <div>
          <Label>{t.services.label}</Label>
          <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,4vw,3.2rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em" }}>{t.services.title}</SplitText>
          <div style={{ marginTop:"0.15em" }}><WordReveal style={{ fontFamily:isRTL?ff:fs,fontWeight:isRTL?900:300,fontStyle:isRTL?"normal":"italic",fontSize:"clamp(2rem,4vw,3.2rem)",color:T.accent }}>{t.services.titleAccent}</WordReveal></div>
        </div>
        <Reveal delay={0.2} direction="left"><p style={{ fontFamily:fb,fontSize:"0.95rem",lineHeight:1.75,color:T.textMuted,fontWeight:300,maxWidth:400 }}>{t.services.description}</p></Reveal>
      </div>
      <LineReveal />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"1.25rem",marginTop:"3rem" }}>
        {t.services.items.map((s, i) => <ServiceCard key={i} icon={icons[i]} title={s.title} description={s.description} learnMore={t.services.learnMore} index={i} color={serviceColors[i]} onClick={()=>setActiveService({icon:icons[i],title:s.title,index:i})} />)}
      </div>
      {activeService && <ServiceModal service={activeService} color={serviceColors[activeService.index]} onClose={()=>setActiveService(null)} />}
    </section>

    {/* ═══ ABOUT ═══ */}
    <section id="about" style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,4vw,3rem)",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"20%",[isRTL?"left":"right"]:"-10%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,160,0.04),transparent 60%)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ maxWidth:1200,margin:"0 auto",textAlign:ta }}>
        <div style={{ maxWidth:800,marginBottom:"4rem" }}>
          <Label>{t.about.label}</Label>
          <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,5vw,3.5rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em" }}>{t.about.title}</SplitText>
          <div style={{ marginTop:"0.15em" }}><WordReveal style={{ fontFamily:isRTL?ff:fs,fontWeight:isRTL?900:300,fontStyle:isRTL?"normal":"italic",fontSize:"clamp(2rem,5vw,3.5rem)",color:T.accent }}>{t.about.titleAccent}</WordReveal></div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"4rem" }}>
          <div>
            <Reveal delay={0.1}><p style={{ fontFamily:fb,fontSize:"1.05rem",lineHeight:1.8,color:T.textMuted,fontWeight:300,marginBottom:"1.5rem" }}>{t.about.p1}</p></Reveal>
            <Reveal delay={0.2}><p style={{ fontFamily:fb,fontSize:"1.05rem",lineHeight:1.8,color:T.textMuted,fontWeight:300 }}>{t.about.p2}</p></Reveal>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2.5rem" }}>
            <Stat end={150} suffix="+" label={t.about.stat1} />
            <Stat end={98} suffix="%" label={t.about.stat2} />
            <Stat end={12} label={t.about.stat3} />
            <Stat end={40} suffix="+" label={t.about.stat4} />
          </div>
        </div>
      </div>
    </section>

    {/* ═══ PROCESS ═══ */}
    <section id="process" style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,4vw,3rem)",background:T.bgAlt,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1200,margin:"0 auto",textAlign:ta }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"4rem" }}>
          <div>
            <Label>{t.process.label}</Label>
            <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,4vw,3rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em" }}>{t.process.title}</SplitText>
            <div style={{ marginTop:"0.15em" }}><WordReveal style={{ fontFamily:isRTL?ff:fs,fontWeight:isRTL?900:300,fontStyle:isRTL?"normal":"italic",fontSize:"clamp(2rem,4vw,3rem)",color:T.accent }}>{t.process.titleAccent}</WordReveal></div>
            <Reveal delay={0.2}><p style={{ fontFamily:fb,fontSize:"0.95rem",lineHeight:1.75,color:T.textMuted,fontWeight:300,maxWidth:360,marginTop:"1.5rem" }}>{t.process.description}</p></Reveal>
          </div>
          <div>
            {t.process.steps.map((s,i)=>(<div key={i}>{i>0&&<LineReveal delay={i*0.05} color={T.border} />}<ProcessItem number={`0${i+1}`} title={s.title} desc={s.desc} index={i} /></div>))}
          </div>
        </div>
      </div>
    </section>

    {/* ═══ PORTFOLIO ═══ */}
    <section id="work" style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,4vw,3rem)" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:"4rem" }}>
          <Label>{t.portfolio.label}</Label>
          <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,4vw,3.2rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em",display:"inline-block" }}>{t.portfolio.title}</SplitText>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.25rem" }}>
          {t.portfolio.items.map((p,i)=><ProjectCard key={i} title={p.title} category={p.category} color={projectColors[i]} index={i} />)}
        </div>
      </div>
    </section>

    {/* ═══ TESTIMONIALS ═══ */}
    <section style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,4vw,3rem)",background:T.bgAlt,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1200,margin:"0 auto",textAlign:ta }}>
        <div style={{ marginBottom:"4rem" }}>
          <Label>{t.testimonials.label}</Label>
          <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,4vw,3rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em" }}>{t.testimonials.title}</SplitText>
        </div>
        <Reveal><Testimonials /></Reveal>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section style={{ padding:"clamp(5rem,10vw,8rem) clamp(1.5rem,4vw,3rem)",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,160,0.06),transparent 50%)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative" }}>
        <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2.2rem,5vw,4rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em",display:"inline-block" }}>{t.cta.title}</SplitText>
        <div style={{ marginTop:"0.1em" }}><WordReveal style={{ fontFamily:isRTL?ff:fs,fontWeight:isRTL?900:300,fontStyle:isRTL?"normal":"italic",fontSize:"clamp(2.2rem,5vw,4rem)",color:T.accent }}>{t.cta.titleAccent}</WordReveal></div>
        <Reveal delay={0.3}><p style={{ fontFamily:fb,fontSize:"1.05rem",lineHeight:1.75,color:T.textMuted,fontWeight:300,maxWidth:450,margin:"2rem auto 2.5rem" }}>{t.cta.description}</p></Reveal>
        <Reveal delay={0.4}>
          <Magnetic strength={0.2}>
            <button data-hover onClick={()=>scrollTo("contact")} style={{ padding:"1.1rem 3.5rem",borderRadius:"4rem",border:"none",background:T.accent,color:T.bg,fontFamily:fb,fontWeight:700,fontSize:"0.95rem",boxShadow:`0 0 50px rgba(0,229,160,0.3)`,transition:"all 0.35s" }}
              onMouseEnter={(e)=>e.target.style.boxShadow=`0 0 70px rgba(0,229,160,0.45)`} onMouseLeave={(e)=>e.target.style.boxShadow=`0 0 50px rgba(0,229,160,0.3)`}>{t.cta.button}</button>
          </Magnetic>
        </Reveal>
      </div>
    </section>

    {/* ═══ CONTACT ═══ */}
    <section id="contact" style={{ padding:"clamp(5rem,10vw,8rem) clamp(1.5rem,4vw,3rem)",borderTop:`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1200,margin:"0 auto",textAlign:ta }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"4rem" }}>
          <div>
            <Label>{t.contact.label}</Label>
            <SplitText style={{ fontFamily:ff,fontWeight:900,fontSize:"clamp(2rem,4vw,3rem)",lineHeight:1.05,letterSpacing:isRTL?"0":"-0.03em" }}>{t.contact.title}</SplitText>
            <Reveal delay={0.2}><p style={{ fontFamily:fb,fontSize:"0.95rem",lineHeight:1.75,color:T.textMuted,fontWeight:300,marginTop:"1.5rem",maxWidth:360 }}>{t.contact.description}</p></Reveal>
            <Reveal delay={0.3}><div style={{ marginTop:"2.5rem",display:"flex",flexDirection:"column",gap:"1rem" }}>
              {[t.contact.email, "Twitter / X", "LinkedIn"].map((item,i)=>(<span key={i} style={{ fontFamily:fb,fontSize:"0.85rem",color:T.textDim,fontWeight:500 }}>{item}</span>))}
            </div></Reveal>
          </div>
          <Reveal delay={0.15}>
            <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
              {[{ph:t.contact.phName,type:"text"},{ph:t.contact.phEmail,type:"email"},{ph:t.contact.phType,type:"text"}].map((f,i)=>(
                <input key={i} type={f.type} placeholder={f.ph} dir={isRTL?"rtl":"ltr"} style={{ padding:"1rem 1.25rem",borderRadius:"0.75rem",border:`1px solid ${T.border}`,background:T.bgCard,fontFamily:fb,fontSize:"0.9rem",color:T.text,fontWeight:400,transition:"all 0.3s",textAlign:ta }} />
              ))}
              <textarea placeholder={t.contact.phMsg} rows={5} dir={isRTL?"rtl":"ltr"} style={{ padding:"1rem 1.25rem",borderRadius:"0.75rem",border:`1px solid ${T.border}`,background:T.bgCard,fontFamily:fb,fontSize:"0.9rem",color:T.text,fontWeight:400,resize:"vertical",transition:"all 0.3s",textAlign:ta }} />
              <Magnetic strength={0.15}>
                <button data-hover style={{ padding:"1rem 2.5rem",borderRadius:"4rem",border:"none",background:T.accent,color:T.bg,fontFamily:fb,fontWeight:700,fontSize:"0.9rem",alignSelf:isRTL?"flex-end":"flex-start",boxShadow:`0 0 30px rgba(0,229,160,0.2)`,transition:"all 0.35s" }}
                  onMouseEnter={(e)=>e.target.style.boxShadow=`0 0 50px rgba(0,229,160,0.35)`} onMouseLeave={(e)=>e.target.style.boxShadow=`0 0 30px rgba(0,229,160,0.2)`}>{t.contact.submit}</button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* ═══ FOOTER ═══ */}
    <footer style={{ padding:"4rem clamp(1.5rem,4vw,3rem) 2rem",borderTop:`1px solid ${T.border}`,maxWidth:1200,margin:"0 auto",textAlign:ta }}>
      <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"3rem",marginBottom:"3rem",flexDirection:isRTL?"row-reverse":"row" }}>
        <div>
          <div style={{ fontFamily:"var(--f-display)",fontWeight:900,fontSize:"1.4rem",letterSpacing:"-0.04em",marginBottom:"0.75rem",direction:"ltr",textAlign:ta }}>
            nexa<span style={{color:T.accent}}>gen</span><span style={{ display:"inline-block",width:5,height:5,borderRadius:"50%",background:T.accent,marginLeft:1,verticalAlign:"super" }} />
          </div>
          <p style={{ fontFamily:fb,fontSize:"0.82rem",color:T.textDim,maxWidth:260,lineHeight:1.65,fontWeight:300 }}>{t.footer.tagline}</p>
        </div>
        <div style={{ display:"flex",gap:"4rem",flexWrap:"wrap" }}>
          {[{t:t.footer.studioCol,l:navSections.map(s=>s.label),k:navSections.map(s=>s.key)},{t:t.footer.connectCol,l:["Twitter / X","LinkedIn","Dribbble","GitHub"],k:[]}].map((col,i)=>(
            <div key={i}>
              <h4 style={{ fontFamily:ff,fontWeight:700,fontSize:"0.8rem",color:T.text,marginBottom:"1rem",letterSpacing:isRTL?"0":"0.02em" }}>{col.t}</h4>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.6rem" }}>
                {col.l.map((lnk,j)=>(<button key={j} data-hover onClick={()=>col.k[j]?scrollTo(col.k[j]):null} style={{ background:"none",border:"none",textAlign:ta,fontFamily:fb,fontSize:"0.82rem",color:T.textDim,padding:0,fontWeight:400,transition:"color 0.3s" }} onMouseEnter={(e)=>e.currentTarget.style.color=T.text} onMouseLeave={(e)=>e.currentTarget.style.color=T.textDim}>{lnk}</button>))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <LineReveal />
      <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",paddingTop:"1.5rem",flexDirection:isRTL?"row-reverse":"row" }}>
        <span style={{ fontFamily:fb,fontSize:"0.75rem",color:T.textDim }}>{t.footer.copyright}</span>
        <span style={{ fontFamily:fb,fontSize:"0.75rem",color:T.textDim }}>{t.footer.madeWith}</span>
      </div>
    </footer>
  </>);
}

// ═══ ROOT EXPORT ═══
export default function NexagenStudio() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}
