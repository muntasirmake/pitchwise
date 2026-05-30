const primaryCta = "Get Pitch OS for $29";
const secondaryCta = "Get a Free Pitch Deck Audit";

export function Hero() {
  return (
    <main className="min-h-screen bg-white">
      <section
        aria-labelledby="hero-title"
        className="mx-auto flex min-h-screen w-full max-w-[1197px] flex-col items-center justify-center px-6 py-[clamp(3.5rem,7.4vw,5rem)] text-center text-pitch-navy sm:px-10"
      >
        <img
          src="/pitchwise-logo.png"
          alt="PitchWise"
          className="h-7 w-auto sm:h-8"
        />

        <div className="mt-[clamp(4.5rem,9.8vw,11.75rem)] flex w-full flex-col items-center gap-[clamp(2rem,3.18vw,3.8125rem)]">
          <h1
            id="hero-title"
            className="max-w-[1197px] font-display text-[clamp(2.6875rem,5vw,6rem)] font-medium leading-[1.1]"
          >
            Build an Investor-Grade Pitch Deck in 30 Minutes.
          </h1>

          <p className="max-w-[1172px] font-body text-[clamp(1.375rem,2.08vw,2.5rem)] leading-[1.1]">
            We&apos;ve studied hundreds of pitch decks from startups that raised
            $1B+ collectively. The best decks follow clear patterns - and our
            Pitch OS helps you apply those patterns to your own.
          </p>

          <div className="flex w-full max-w-[892px] flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:gap-[clamp(1rem,1.46vw,1.75rem)]">
            <a
              className="flex min-h-[clamp(3.625rem,4.83vw,5.8rem)] w-full items-center justify-center rounded-[64px] bg-pitch-navy px-8 font-display text-[clamp(1.125rem,1.5vw,1.8rem)] font-medium leading-[1.1] text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[clamp(18rem,20.54vw,24.65rem)]"
              href="#"
            >
              {primaryCta}
            </a>
            <a
              className="flex min-h-[clamp(3.625rem,4.83vw,5.8rem)] w-full items-center justify-center rounded-[64px] bg-pitch-mist px-8 font-display text-[clamp(1.125rem,1.5vw,1.8rem)] font-medium leading-[1.1] text-pitch-navy transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[clamp(20rem,24.46vw,29.35rem)]"
              href="#"
            >
              {secondaryCta}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
