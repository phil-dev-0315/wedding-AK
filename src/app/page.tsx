import { Navigation } from '@/components/Navigation';
import {
  Hero,
  Countdown,
  Schedule,
  Gallery,
  Entourage,
  WeddingThemeSection,
  RSVPForm,
  Footer,
} from '@/components/sections';
import { weddingConfig } from '@/lib/config';

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero
        coupleNames={weddingConfig.couple.names}
        weddingDate={weddingConfig.wedding.date}
        tagline={weddingConfig.wedding.tagline}
        backgroundImage={weddingConfig.hero.backgroundImage}
      />

      {/* Countdown Timer */}
      <Countdown targetDate={weddingConfig.wedding.date} />

      {/* Event Schedule */}
      <Schedule />

      {/* Photo Gallery */}
      <Gallery />

      {/* Wedding Entourage */}
      <Entourage />

      {/* Wedding Theme & Rules */}
      <WeddingThemeSection />

      {/* RSVP Form */}
      <RSVPForm />

      {/* Footer */}
      <Footer
        coupleNames={weddingConfig.couple.names}
        weddingDate={weddingConfig.wedding.date}
        message={weddingConfig.footer.message}
        socialLinks={weddingConfig.social}
        hashtag={weddingConfig.couple.hashtag}
      />
    </main>
  );
}
