"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";

export default function Home() {
  useEffect(() => {
    // Scroll reveal animation
    function reveal() {
      const reveals = document.querySelectorAll('.reveal');
      
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Check on load
    
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8">
            <div className="hero-label">Observable Games Network</div>
            <h1>See the <span className="highlight">games</span> you play online</h1>
            <p className="hero-description">
              Most creators lose because they can't see which game they're in. The platforms see it. The AI companies see it. You should too.
            </p>
          </div>
        </section>

        {/* Problem Section */}
        <section className="problem-section">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8">
            <div className="section-label">— The Invisible Games</div>
            
            <div className="games-grid reveal">
              <div className="game-card platform" data-number="01">
                <h3>The Platform's Game</h3>
                <p>Platforms optimize for attention and engagement. They want you scrolling, clicking, reacting.</p>
                <ul>
                  <li>Maximize time on platform</li>
                  <li>Harvest behavioral data</li>
                  <li>Keep you dependent</li>
                </ul>
              </div>

              <div className="game-card ai" data-number="02">
                <h3>The AI Company's Game</h3>
                <p>AI tools promise leverage but optimize for their own metrics, not yours.</p>
                <ul>
                  <li>Extract your creative process</li>
                  <li>Train on your output</li>
                  <li>Commoditize your voice</li>
                </ul>
              </div>

              <div className="game-card creator" data-number="03">
                <h3>Your Game (Maybe)</h3>
                <p>You're trying to build trust, deliver value, create leverage. But are you optimizing for the right signals?</p>
                <ul>
                  <li>Building real relationships?</li>
                  <li>Creating compounding value?</li>
                  <li>Or just feeding algorithms?</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Insight Section */}
        <section className="insight-section">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8">
            <div className="section-label">— The Core Problem</div>
            
            <div className="insight-box reveal">
              <h2>You can't win a game you can't see</h2>
              <p>
                Most creators publish consistently, get decent feedback, and still see no momentum. Not because they lack skill or effort—but because they're playing one game with the rules of another.
              </p>
              <p style={{ marginTop: '1.5rem' }}>
                The platforms know which game you're in. The AI companies know which game you're in. But you're operating blind, mixing rules, breaking leverage, and wondering why nothing compounds.
              </p>
            </div>

            <div className="stats-statement reveal">
              <p className="stat-highlight">
                There are <span className="accent-text">6 core creator games</span>. 
                Most creators unknowingly mix <span className="accent-text">3-4 of them</span>. 
                You only need to master <span className="accent-text">one</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="solution-section">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8">
            <div className="section-label">— MetaSPN Makes Games Observable</div>
            
            <div className="solution-intro reveal">
              <h2>First, you need to see which game you're actually playing</h2>
              <p>
                MetaSPN is building the infrastructure to make online games visible, measurable, and winnable. We're starting with creators—the people most vulnerable to game confusion.
              </p>
            </div>

            <div className="game-audit-card reveal">
              <h3>The Creator Game Audit</h3>
              <div className="subtitle">Powered by MetaSPN</div>
              
              <p>
                A structural diagnostic that identifies which content game you're playing, why it's not working, and what to fix.
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <h4>Game Identification</h4>
                  <p>Which of the 6 creator games are you actually playing?</p>
                </div>
                <div className="feature-item">
                  <h4>Failure Mode Analysis</h4>
                  <p>Why your current strategy isn't creating leverage</p>
                </div>
                <div className="feature-item">
                  <h4>Alignment Guardrails</h4>
                  <p>Constraints your AI and VAs must follow to stay on-game</p>
                </div>
                <div className="feature-item">
                  <h4>Observable Metrics</h4>
                  <p>The actual scoreboard for your specific game</p>
                </div>
              </div>

              <p style={{ marginTop: '2rem', fontSize: '1.05rem', color: 'var(--fg)' }}>
                This is game one. The first observable game in the MetaSPN network.
              </p>
            </div>

            <div className="insight-box reveal">
              <h2>Why this matters now</h2>
              <p>
                AI tools accelerate output. Platforms accelerate distribution. But neither accelerates understanding. When you can't see which game you're in, speed just amplifies confusion.
              </p>
              <p style={{ marginTop: '1.5rem' }}>
                MetaSPN gives you what the platforms and AI companies already have: a clear view of the games being played. Once you see your game, everything else simplifies.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container mx-auto max-w-7xl px-6 sm:px-8">
            <div className="cta-box reveal">
              <h2>Start with the Creator Game Audit</h2>
              <p>
                Limited founding rate: $3,000 for the first 5 clients<br />
                (Regular rate: $5,000)
              </p>
              <div className="button-group">
                <Link href="/intake" className="button">Request Audit</Link>
                <Link href="/quiz" className="button secondary">Take Free Quiz</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container mx-auto max-w-7xl px-6 sm:px-8">
          <div className="footer-content">
            <Link href="/" className="logo">
              <Image
                src="/logo.png"
                alt="MetaSPN"
                width={120}
                height={40}
                className="logo-image"
              />
            </Link>
            <div className="footer-links">
              <Link href="/audit">About</Link>
              <Link href="/demo">Demo</Link>
              <Link href="/quiz">Quiz</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
