import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
})
export class SplashComponent implements OnInit, AfterViewInit, OnDestroy {
  private leaves: HTMLElement[] = [];
  private leafTweens: gsap.core.Tween[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createFallingLeaves();
    this.animateContent();
  }

  private createFallingLeaves() {
    const leafContainer = document.querySelector('.petals-container');
    if (!leafContainer) return;

    // Create SVG leaves that gently drift down with GSAP
    for (let i = 0; i < 20; i++) {
      const leaf = document.createElement('img');
      leaf.classList.add('leaf');
      leaf.src = '/leaf-1531.svg';
      leaf.alt = '';
      leaf.setAttribute('aria-hidden', 'true');

      const isLargeLeaf = Math.random() > 0.45;
      const isFastLeaf = Math.random() > 0.5;
      const size = isLargeLeaf ? Math.random() * 22 + 30 : Math.random() * 12 + 16;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = isFastLeaf ? Math.random() * 3 + 6 : Math.random() * 5 + 12;
      const rotation = Math.random() * 360;
      const sway = Math.random() * 120 - 60;
      const drift = Math.random() * 90 - 45;

      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${left}%`;
      leaf.style.top = `-${size + 30}px`;
      leaf.style.opacity = (Math.random() * 0.15 + 0.85).toString();
      leaf.style.transform = `rotate(${rotation}deg)`;
      leaf.style.position = 'absolute';
      leaf.style.display = 'block';
      leaf.style.zIndex = '1';
      leaf.style.filter =
        'brightness(0) saturate(100%) invert(78%) sepia(22%) saturate(360%) hue-rotate(340deg) brightness(96%) contrast(90%) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12))';

      leafContainer.appendChild(leaf);
      this.leaves.push(leaf);

      const tween = gsap.fromTo(
        leaf,
        {
          y: -80,
          x: drift,
          rotate: rotation,
          opacity: 0,
        },
        {
          y: window.innerHeight + 140,
          x: sway,
          rotate: rotation + 180,
          opacity: isLargeLeaf ? 0.98 : 0.9,
          duration,
          delay,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: Math.random() * 1.6,
        }
      );

      this.leafTweens.push(tween);
    }
  }

  private animateContent() {
    // Animate the invitation card
    gsap.from('.splash-content', {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.2)',
    });

    // Animate couple names
    gsap.from('.couple-names', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });

    gsap.from('.heart-badge', {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      delay: 0.5,
      ease: 'back.out(1.5)',
    });

    gsap.from('.ornament-divider', {
      width: 0,
      opacity: 0,
      duration: 0.7,
      delay: 0.6,
      ease: 'power2.out',
    });

    gsap.from('.date-text', {
      y: 18,
      opacity: 0,
      duration: 0.6,
      delay: 0.75,
      ease: 'power2.out',
    });

    // Animate invitation text
    gsap.from('.invitation-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.85,
      ease: 'power2.out',
    });

    // Animate button
    gsap.from('.open-invitation-btn', {
      // y: 30,
      // opacity: 0,
      // duration: 0.6,
      // delay: 1.0,
      // ease: 'power2.out',
    });

    // Add pulse animation to button
    gsap.to('.open-invitation-btn', {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 1.5,
    });
  }

  openMainPage() {
    // Add exit animation before navigation
    gsap.to('.splash-content', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.in(1)',
      onComplete: () => {
        this.router.navigate(['/main']);
      },
    });
  }

  ngOnDestroy() {
    // Clean up leaves
    this.leaves.forEach((leaf) => leaf.remove());
    this.leafTweens.forEach((tween) => tween.kill());
  }
}
