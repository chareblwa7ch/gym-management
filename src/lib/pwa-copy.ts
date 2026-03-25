import type { AppLanguage } from "@/lib/i18n";

type PwaCopy = {
  navLabel: string;
  headerDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  installNow: string;
  installing: string;
  installed: string;
  installedDescription: string;
  browserPromptHelp: string;
  manualTitle: string;
  manualDescription: string;
  androidTitle: string;
  androidSteps: [string, string, string];
  iosTitle: string;
  iosSteps: [string, string, string];
  desktopTitle: string;
  desktopSteps: [string, string, string];
};

const copy: Record<AppLanguage, PwaCopy> = {
  en: {
    navLabel: "Install App",
    headerDescription: "Add the dashboard to the home screen for faster access on phone, tablet, or desktop.",
    eyebrow: "Progressive Web App",
    title: "Install the dashboard",
    description: "Save ElAmidy Sports Fitness on the device home screen so it opens like a real app and is easier to reach during daily work.",
    cardTitle: "Ready to install",
    cardDescription: "If your browser supports app installation, you can add the dashboard in one tap.",
    installNow: "Install now",
    installing: "Preparing install...",
    installed: "Already installed",
    installedDescription: "This device already has the dashboard installed or opened in app mode.",
    browserPromptHelp: "If the install button does not appear, use the browser steps below.",
    manualTitle: "Manual install steps",
    manualDescription: "These instructions work even when the browser does not show an install prompt automatically.",
    androidTitle: "Android",
    androidSteps: [
      "Open the dashboard in Chrome.",
      "Tap the browser menu in the top corner.",
      "Choose Install app or Add to Home screen.",
    ],
    iosTitle: "iPhone or iPad",
    iosSteps: [
      "Open the dashboard in Safari.",
      "Tap the Share button.",
      "Choose Add to Home Screen and confirm.",
    ],
    desktopTitle: "Desktop",
    desktopSteps: [
      "Open the dashboard in Chrome or Edge.",
      "Click the install icon in the address bar.",
      "Confirm the install window.",
    ],
  },
  fr: {
    navLabel: "Installer l'app",
    headerDescription: "Ajoutez le tableau de bord a l'ecran d'accueil pour y acceder plus vite sur mobile, tablette ou ordinateur.",
    eyebrow: "Application web",
    title: "Installer le tableau de bord",
    description: "Enregistrez ElAmidy Sports Fitness sur l'ecran d'accueil de l'appareil pour l'ouvrir comme une vraie application pendant le travail quotidien.",
    cardTitle: "Pret a installer",
    cardDescription: "Si votre navigateur prend en charge l'installation, vous pouvez ajouter le tableau de bord en un seul clic.",
    installNow: "Installer maintenant",
    installing: "Preparation de l'installation...",
    installed: "Deja installee",
    installedDescription: "Cet appareil a deja le tableau de bord installe ou ouvert en mode application.",
    browserPromptHelp: "Si le bouton d'installation n'apparait pas, utilisez les etapes manuelles ci-dessous.",
    manualTitle: "Etapes manuelles",
    manualDescription: "Ces instructions fonctionnent meme si le navigateur n'affiche pas automatiquement la fenetre d'installation.",
    androidTitle: "Android",
    androidSteps: [
      "Ouvrez le tableau de bord dans Chrome.",
      "Touchez le menu du navigateur en haut.",
      "Choisissez Installer l'application ou Ajouter a l'ecran d'accueil.",
    ],
    iosTitle: "iPhone ou iPad",
    iosSteps: [
      "Ouvrez le tableau de bord dans Safari.",
      "Touchez le bouton Partager.",
      "Choisissez Ajouter a l'ecran d'accueil puis confirmez.",
    ],
    desktopTitle: "Ordinateur",
    desktopSteps: [
      "Ouvrez le tableau de bord dans Chrome ou Edge.",
      "Cliquez sur l'icone d'installation dans la barre d'adresse.",
      "Confirmez la fenetre d'installation.",
    ],
  },
  ar: {
    navLabel: "تثبيت التطبيق",
    headerDescription: "أضف لوحة التحكم إلى الشاشة الرئيسية للوصول السريع من الهاتف أو التابلت أو الكمبيوتر.",
    eyebrow: "تطبيق ويب",
    title: "تثبيت لوحة التحكم",
    description: "احفظ ElAmidy Sports Fitness على الشاشة الرئيسية للجهاز حتى يفتح مثل تطبيق حقيقي ويكون الوصول إليه أسرع أثناء العمل اليومي.",
    cardTitle: "جاهز للتثبيت",
    cardDescription: "إذا كان المتصفح يدعم تثبيت التطبيق يمكنك إضافة لوحة التحكم بضغطة واحدة.",
    installNow: "ثبت الآن",
    installing: "جاري تجهيز التثبيت...",
    installed: "تم التثبيت بالفعل",
    installedDescription: "هذا الجهاز يحتوي بالفعل على لوحة التحكم أو يفتحها في وضع التطبيق.",
    browserPromptHelp: "إذا لم يظهر زر التثبيت استخدم الخطوات اليدوية بالأسفل.",
    manualTitle: "خطوات التثبيت اليدوي",
    manualDescription: "هذه الخطوات تعمل حتى إذا لم يُظهر المتصفح نافذة التثبيت تلقائيا.",
    androidTitle: "أندرويد",
    androidSteps: [
      "افتح لوحة التحكم في متصفح Chrome.",
      "اضغط على قائمة المتصفح في الأعلى.",
      "اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.",
    ],
    iosTitle: "آيفون أو آيباد",
    iosSteps: [
      "افتح لوحة التحكم في Safari.",
      "اضغط على زر المشاركة.",
      "اختر إضافة إلى الشاشة الرئيسية ثم أكد.",
    ],
    desktopTitle: "الكمبيوتر",
    desktopSteps: [
      "افتح لوحة التحكم في Chrome أو Edge.",
      "اضغط على أيقونة التثبيت في شريط العنوان.",
      "أكد نافذة التثبيت.",
    ],
  },
};

export function getPwaCopy(language: AppLanguage) {
  return copy[language];
}
