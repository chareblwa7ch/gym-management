"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Loader2,
  MonitorSmartphone,
  Share2,
  Smartphone,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPwaCopy } from "@/lib/pwa-copy";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function PwaInstallPanel() {
  const { language } = useLanguage();
  const copy = useMemo(() => getPwaCopy(language), [language]);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstalling(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const canPromptInstall = Boolean(deferredPrompt) && !isInstalled;
  const installButtonLabel = isInstalled
    ? copy.installed
    : isInstalling
      ? copy.installing
      : copy.installNow;

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="border-border/70 bg-card/88 surface-shadow">
        <CardHeader className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/10">
              <Download className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-[1.7rem]">{copy.cardTitle}</CardTitle>
              <CardDescription className="mt-1 text-sm leading-6">
                {copy.cardDescription}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
          {isInstalled ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{copy.installed}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {copy.installedDescription}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              className="sm:min-w-[12rem]"
              onClick={handleInstall}
              disabled={!canPromptInstall || isInstalling || isInstalled}
            >
              {isInstalling ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
              {installButtonLabel}
            </Button>
            <Badge variant="muted" className="justify-center rounded-full px-4 py-3 text-sm font-medium sm:justify-start">
              {copy.browserPromptHelp}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/84">
        <CardHeader className="space-y-2 p-5 sm:p-6">
          <CardTitle className="text-2xl sm:text-[1.65rem]">{copy.manualTitle}</CardTitle>
          <CardDescription className="text-sm leading-6">
            {copy.manualDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Smartphone className="size-5" />
              </div>
              <p className="text-base font-semibold">{copy.androidTitle}</p>
            </div>
            <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
              {copy.androidSteps.map((step, index) => (
                <li key={step}>
                  <span className="me-2 font-semibold text-foreground">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-700 dark:text-sky-300">
                <Share2 className="size-5" />
              </div>
              <p className="text-base font-semibold">{copy.iosTitle}</p>
            </div>
            <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
              {copy.iosSteps.map((step, index) => (
                <li key={step}>
                  <span className="me-2 font-semibold text-foreground">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-700 dark:text-amber-300">
                <MonitorSmartphone className="size-5" />
              </div>
              <p className="text-base font-semibold">{copy.desktopTitle}</p>
            </div>
            <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
              {copy.desktopSteps.map((step, index) => (
                <li key={step}>
                  <span className="me-2 font-semibold text-foreground">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
