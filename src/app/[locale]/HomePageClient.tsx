"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Gift,
  Sparkles,
  Armchair,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} animate-pulse rounded-xl border border-border bg-white/5`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid 卡片与模块锚点的一一对应（顺序即首页模块顺序）
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "food-guide",
  "cash-farming-guide",
  "best-upgrades",
  "views-likes-followers-guide",
  "room-mansion-guide",
  "updates-community",
];

// 模块顶部装饰图标（与 Tools Grid 卡片图标一致）
const MODULE_ICONS: Record<string, string> = {
  codes: "Gift",
  "beginner-guide": "GraduationCap",
  "food-guide": "UtensilsCrossed",
  "cash-farming-guide": "Coins",
  "best-upgrades": "Armchair",
  "views-likes-followers-guide": "Users",
  "room-mansion-guide": "Crown",
  "updates-community": "Newspaper",
};

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.streamamukbangwiki.wiki";

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((cur) => (cur === code ? null : cur)), 2000);
    } catch {
      setCopiedCode(null);
    }
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Stream a Mukbang Wiki",
        description:
          "Complete Stream a Mukbang Wiki covering codes, foods, cash farming, setup upgrades, mansion progression, and beginner tips for the food streaming simulator on Roblox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Stream a Mukbang - Food Streaming Simulator on Roblox",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Stream a Mukbang Wiki",
        alternateName: "Stream a Mukbang",
        url: siteUrl,
        description:
          "Complete Stream a Mukbang Wiki resource hub for codes, foods, cash farming, setup upgrades, and mansion progression guides on Roblox",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Stream a Mukbang Wiki - Food Streaming Simulator on Roblox",
        },
        sameAs: [
          "https://www.roblox.com/games/131234167969699/Stream-a-Mukbang",
          "https://www.roblox.com/communities/566259038/vibing-games",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Stream a Mukbang",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Simulator", "Mukbang", "Casual", "Tycoon"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/131234167969699/Stream-a-Mukbang",
        },
      },
      {
        "@type": "VideoObject",
        name: "Stream a Mukbang Gameplay",
        description:
          "Stream a Mukbang live eating gameplay on Roblox — eat food, attract viewers, earn Cash, and upgrade your streaming setup.",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/7eF8O3RqIjI",
        url: "https://www.youtube.com/watch?v=7eF8O3RqIjI",
      },
    ],
  };

  const m = t.modules;
  const robloxGameUrl =
    "https://www.roblox.com/games/131234167969699/Stream-a-Mukbang";
  const robloxCommunityUrl =
    "https://www.roblox.com/communities/566259038/vibing-games";

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ============ Hero Section ============ */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="scroll-reveal mb-8 text-center">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <Gift className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href={robloxGameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-white/10 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ============ Video Section（紧随 Hero） ============ */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="7eF8O3RqIjI"
              title="Stream a Mukbang Gameplay"
            />
          </div>
        </div>
      </section>

      {/* ============ Tools Grid - 8 Navigation Cards（视频区之后、Latest Updates 之前） ============ */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group cursor-pointer rounded-xl border border-border bg-card p-4 text-left transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] transition-colors group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ Module 1: Stream a Mukbang Codes ============ */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["codes"]}
            eyebrow={m.streamMukbangCodes.eyebrow}
            title={m.streamMukbangCodes.title}
            subtitle={m.streamMukbangCodes.subtitle}
            intro={m.streamMukbangCodes.intro}
          />

          {/* Code cards */}
          <div className="scroll-reveal mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {m.streamMukbangCodes.codes.map((c: any, index: number) => {
              const isCopied = copiedCode === c.code;
              return (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                      <Check className="h-3.5 w-3.5" />
                      {c.status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Reward: <span className="font-semibold text-foreground">{c.reward}</span>
                    </span>
                  </div>
                  <div className="mb-4 flex items-center gap-3">
                    <code className="flex-1 rounded-lg border border-dashed border-[hsl(var(--nav-theme)/0.5)] bg-background px-4 py-3 text-lg font-bold tracking-wider text-[hsl(var(--nav-theme-light))]">
                      {c.code}
                    </code>
                    <button
                      onClick={() => copyCode(c.code)}
                      aria-label={`Copy code ${c.code}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--nav-theme))] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)]"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.note}</p>
                </div>
              );
            })}
          </div>

          {/* Expired note */}
          <div className="scroll-reveal mb-8 rounded-xl border border-border bg-white/5 p-5 md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="text-base font-bold md:text-lg">Expired Codes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {m.streamMukbangCodes.expiredNote}
            </p>
          </div>

          {/* How to redeem */}
          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6">
            <div className="mb-3 flex items-center gap-2 md:mb-4">
              <Gift className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="text-base font-bold md:text-lg">How to Redeem Codes</h3>
            </div>
            <ol className="space-y-2">
              {m.streamMukbangCodes.howTo.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 广告位 4 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ============ Module 2: Stream a Mukbang Beginner Guide ============ */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["beginner-guide"]}
            eyebrow={m.streamMukbangBeginnerGuide.eyebrow}
            title={m.streamMukbangBeginnerGuide.title}
            subtitle={m.streamMukbangBeginnerGuide.subtitle}
            intro={m.streamMukbangBeginnerGuide.intro}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.streamMukbangBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                  <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 3: Stream a Mukbang Food Guide ============ */}
      <section id="food-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["food-guide"]}
            eyebrow={m.streamMukbangFoodGuide.eyebrow}
            title={m.streamMukbangFoodGuide.title}
            subtitle={m.streamMukbangFoodGuide.subtitle}
            intro={m.streamMukbangFoodGuide.intro}
          />

          {/* Desktop table */}
          <div className="scroll-reveal hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)] text-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Food</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Cost</th>
                  <th className="px-5 py-3 font-semibold">Stream Use</th>
                </tr>
              </thead>
              <tbody>
                {m.streamMukbangFoodGuide.foods.map((f: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                      {f.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{f.category}</td>
                    <td className="px-5 py-4 text-muted-foreground">{f.cost}</td>
                    <td className="px-5 py-4 text-muted-foreground">{f.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="scroll-reveal grid grid-cols-1 gap-3 md:hidden">
            {m.streamMukbangFoodGuide.foods.map((f: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                    {f.name}
                  </h3>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5 text-xs">
                    {f.category}
                  </span>
                </div>
                <p className="mb-1 text-xs text-muted-foreground">Cost: {f.cost}</p>
                <p className="text-sm text-muted-foreground">{f.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 4: Stream a Mukbang Cash Farming Guide ============ */}
      <section
        id="cash-farming-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["cash-farming-guide"]}
            eyebrow={m.streamMukbangCashFarming.eyebrow}
            title={m.streamMukbangCashFarming.title}
            subtitle={m.streamMukbangCashFarming.subtitle}
            intro={m.streamMukbangCashFarming.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {m.streamMukbangCashFarming.stages.map((s: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold md:text-lg">{s.stage}</h3>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.focus}
                </p>
                <p className="mb-3 text-sm text-muted-foreground">{s.method}</p>
                <div className="mt-auto rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-3">
                  <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                    Spending Priority
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.priority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ Module 5: Stream a Mukbang Best Upgrades ============ */}
      <section id="best-upgrades" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["best-upgrades"]}
            eyebrow={m.streamMukbangBestUpgrades.eyebrow}
            title={m.streamMukbangBestUpgrades.title}
            subtitle={m.streamMukbangBestUpgrades.subtitle}
            intro={m.streamMukbangBestUpgrades.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2">
            {m.streamMukbangBestUpgrades.upgrades.map((u: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Armchair className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="text-lg font-bold">{u.name}</h3>
                  </div>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                    {u.priority}
                  </span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{u.role}</p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Timing: </span>
                  {u.timing}
                </p>
                <div className="mt-auto flex items-start gap-2 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <p className="text-sm text-muted-foreground">{u.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 6: Stream a Mukbang Views, Likes and Followers Guide ============ */}
      <section
        id="views-likes-followers-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["views-likes-followers-guide"]}
            eyebrow={m.streamMukbangAudience.eyebrow}
            title={m.streamMukbangAudience.title}
            subtitle={m.streamMukbangAudience.subtitle}
            intro={m.streamMukbangAudience.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {m.streamMukbangAudience.stats.map((s: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {s.name}
                  </h3>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{s.generatedBy}</p>
                <p className="mb-3 text-sm text-muted-foreground">{s.use}</p>
                <div className="mt-auto flex items-start gap-2 border-t border-border pt-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <p className="text-sm text-muted-foreground">{s.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ============ Module 7: Stream a Mukbang Room and Mansion Guide ============ */}
      <section id="room-mansion-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["room-mansion-guide"]}
            eyebrow={m.streamMukbangRoomMansion.eyebrow}
            title={m.streamMukbangRoomMansion.title}
            subtitle={m.streamMukbangRoomMansion.subtitle}
            intro={m.streamMukbangRoomMansion.intro}
          />

          <div className="scroll-reveal space-y-4">
            {m.streamMukbangRoomMansion.stages.map((s: any, index: number) => (
              <div
                key={index}
                className="relative rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="flex items-center gap-3 md:w-56 md:flex-shrink-0">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {s.stage}
                    </span>
                    <h3 className="text-base font-bold leading-tight md:text-lg">
                      {s.name}
                    </h3>
                  </div>
                  <div className="flex-1">
                    <p className="mb-3 text-sm text-muted-foreground">{s.focus}</p>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {s.upgrades.map((u: string, ui: number) => (
                        <span
                          key={ui}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs"
                        >
                          <Check className="h-3 w-3 text-[hsl(var(--nav-theme-light))]" />
                          {u}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-[hsl(var(--nav-theme)/0.05)] p-3">
                        <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          Goal
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.goal}</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Move On When
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {s.moveOn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 8: Stream a Mukbang Updates and Community ============ */}
      <section
        id="updates-community"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MODULE_ICONS["updates-community"]}
            eyebrow={m.streamMukbangUpdates.eyebrow}
            title={m.streamMukbangUpdates.title}
            subtitle={m.streamMukbangUpdates.subtitle}
            intro={m.streamMukbangUpdates.intro}
          />

          {/* Timeline */}
          <div className="scroll-reveal relative mb-10 space-y-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6">
            {m.streamMukbangUpdates.entries.map((e: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] h-4 w-4 rounded-full border-2 border-background bg-[hsl(var(--nav-theme))]" />
                <div className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1 text-xs">
                      {e.category}
                    </span>
                  </div>
                  <h3 className="mb-1 font-bold">{e.headline}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{e.details}</p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))]">
                    {e.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Official links */}
          <div className="scroll-reveal">
            <h3 className="mb-4 text-center text-lg font-bold md:text-xl">
              Official Stream a Mukbang Links
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {m.streamMukbangUpdates.officialLinks.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
                >
                  <ExternalLink className="mt-0.5 h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <div>
                    <p className="font-bold group-hover:text-[hsl(var(--nav-theme-light))]">
                      {link.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Latest Updates Section（模块之后） ============ */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* 广告位 7 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ FAQ Section ============ */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ============ CTA Section ============ */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ Footer ============ */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={robloxGameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href={robloxCommunityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=7eF8O3RqIjI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================
 * 模块统一头部（图标 + eyebrow + 标题 + 副标题 + intro）
 * ============================================ */
function ModuleHeader({
  icon,
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
}) {
  return (
    <div className="scroll-reveal mb-8 text-center md:mb-12">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] md:h-12 md:w-12">
          <DynamicIcon
            name={icon}
            className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
          />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] md:text-sm">
          {eyebrow}
        </span>
      </div>
      <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mb-4 max-w-3xl text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}
