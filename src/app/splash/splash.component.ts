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
  private burstLeaves: HTMLElement[] = []; // Store burst leaves
  private isAnimating = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createFallingLeaves();
    this.animateContent();
  }

  private createFallingLeaves() {
    const leafContainer = document.querySelector('.petals-container');
    if (!leafContainer) return;

    for (let i = 0; i < 20; i++) {
      const leaf = document.createElement('img');
      leaf.classList.add('leaf');
      leaf.src = 'assets/leaf-1531.svg';
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
    gsap.from('.splash-content', {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.2)',
    });

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

    gsap.from('.invitation-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.85,
      ease: 'power2.out',
    });

    gsap.to('.open-invitation-btn', {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 1.5,
    });
  }

  private createLeafBurst() {
    const button = document.querySelector('.open-invitation-btn');
    const container = document.querySelector('.petals-container');
    if (!button || !container) return;

    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const leafCount = Math.floor(Math.random() * 15) + 25;

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('img');
      leaf.classList.add('burst-leaf');
      leaf.src = 'assets/leaf-1531.svg';
      leaf.alt = '';
      leaf.setAttribute('aria-hidden', 'true');

      const size = Math.random() * 30 + 12;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 1000 + 300;
      const distance = Math.random() * 600 + 200;
      const rotation = Math.random() * 1080 - 540;
      const delay = Math.random() * 1;

      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.position = 'fixed';
      leaf.style.left = `${centerX - size / 2}px`;
      leaf.style.top = `${centerY - size / 2}px`;
      leaf.style.zIndex = '1000';
      leaf.style.pointerEvents = 'none';
      leaf.style.opacity = '1';
      leaf.style.filter =
        'brightness(0) saturate(100%) invert(78%) sepia(22%) saturate(360%) hue-rotate(340deg) brightness(96%) contrast(90%) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))';

      container.appendChild(leaf);
      this.burstLeaves.push(leaf); // Store for persistence

      // Calculate final position
      const finalX = targetX;
      const finalY = targetY;

      gsap.fromTo(
        leaf,
        {
          scale: 0,
          rotation: 0,
          opacity: 1,
        },
        {
          scale: 1.2,
          rotation: rotation,
          x: finalX,
          y: finalY,
          opacity: 0.8,
          duration: velocity / 1000,
          delay: delay,
          ease: 'power2.out',
          onComplete: () => {
            // Don't remove - keep the leaf floating
            // Change to continuous floating animation
            this.makeLeafFloat(leaf, finalX, finalY);
          },
        }
      );

      // Add fragments (small particles)
      if (Math.random() > 0.5) {
        const fragment = document.createElement('div');
        fragment.classList.add('burst-fragment');
        fragment.style.width = `${size / 2.5}px`;
        fragment.style.height = `${size / 2.5}px`;
        fragment.style.position = 'fixed';
        fragment.style.left = `${centerX - size / 5}px`;
        fragment.style.top = `${centerY - size / 5}px`;
        fragment.style.zIndex = '1000';
        fragment.style.pointerEvents = 'none';
        fragment.style.backgroundColor = '#ffb7c5';
        fragment.style.borderRadius = '50%';

        container.appendChild(fragment);

        const fragAngle = angle + (Math.random() - 0.5) * 0.8;
        const fragDistance = distance * 0.7;
        const fragX = Math.cos(fragAngle) * fragDistance;
        const fragY = Math.sin(fragAngle) * fragDistance;

        gsap.fromTo(
          fragment,
          {
            scale: 0,
            opacity: 0.9,
          },
          {
            scale: 1,
            x: fragX,
            y: fragY,
            opacity: 0,
            duration: velocity / 1400,
            delay: delay + 0.08,
            ease: 'power1.out',
            onComplete: () => {
              fragment.remove(); // Fragments disappear (they're small)
            },
          }
        );
      }
    }
  }

  // Make leaves float continuously after burst
  private makeLeafFloat(leaf: HTMLElement, startX: number, startY: number) {
    // Random floating parameters
    const floatDuration = Math.random() * 8 + 6; // 6-14 seconds
    const swayX = (Math.random() - 0.5) * 200; // Random horizontal sway
    const swayY = Math.random() * 100 + 50; // Continue falling slowly
    const rotation = Math.random() * 360;

    // Continue floating animation
    gsap.to(leaf, {
      x: startX + swayX,
      y: startY + swayY,
      rotation: `+=${rotation}`,
      duration: floatDuration,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      onRepeat: () => {
        // Randomize movement on each repeat
        const newSwayX = (Math.random() - 0.5) * 150;
        const newSwayY = Math.random() * 80 + 30;
        gsap.to(leaf, {
          x: startX + newSwayX,
          y: startY + newSwayY,
          duration: floatDuration,
          overwrite: true,
        });
      },
    });
  }

  openMainPage() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Stop ONLY the original falling leaves, NOT the burst leaves
    this.leafTweens.forEach((tween) => tween.kill());

    // Remove original falling leaves (they will be replaced by burst leaves)
    this.leaves.forEach((leaf) => leaf.remove());

    // Create leaf burst (burst leaves will persist)
    this.createLeafBurst();

    // Animate button press
    gsap.to('.open-invitation-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to('.open-invitation-btn', {
          x: 5,
          yoyo: true,
          repeat: 3,
          duration: 0.05,
        });
      },
    });

    // Smooth disappear for the card
    gsap.to('.splash-content', {
      opacity: 0,
      y: -10,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        // Navigate to main page (burst leaves will persist because they're on the body)
        this.router.navigate(['/main']);
        this.isAnimating = false;
      },
    });
  }

  ngOnDestroy() {
    // Clean up original leaves
    this.leaves.forEach((leaf) => leaf.remove());
    this.leafTweens.forEach((tween) => tween.kill());
    // Don't remove burst leaves - they should persist
  }
}
