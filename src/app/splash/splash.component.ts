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
  private leafAnimations: (gsap.core.Tween | gsap.core.Timeline)[] = []; // Changed to accept both Tween and Timeline
  private burstLeaves: HTMLElement[] = [];
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

    for (let i = 0; i < 30; i++) {
      const leaf = document.createElement('img');
      leaf.classList.add('leaf');
      leaf.src = 'assets/leaf.svg';
      leaf.alt = '';
      leaf.setAttribute('aria-hidden', 'true');

      const isLargeLeaf = Math.random() > 0.45;
      const isFastLeaf = Math.random() > 0.5;
      const size = isLargeLeaf ? Math.random() * 22 + 30 : Math.random() * 12 + 16;
      const left = Math.random() * 100;

      // Determine leaf behavior
      const behaviorType = Math.random();
      let willPause = false;
      let pauseDuration = 0;
      let pausePosition = 0;

      if (behaviorType < 0.2) {
        willPause = true;
        pauseDuration = Math.random() * 1 + 1;
        pausePosition = Math.random() * 0.6 + 0.2;
      }

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

      const startY = -80;
      const endY = window.innerHeight + 140;

      if (willPause) {
        const pauseY = startY + (endY - startY) * pausePosition;

        // Create a timeline for the paused animation
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: Math.random() * 1.6,
          delay: Math.random() * 2,
        });

        // First segment: fall to pause position
        tl.to(leaf, {
          y: pauseY,
          x: sway * pausePosition,
          rotate: rotation + 180 * pausePosition,
          opacity: isLargeLeaf ? 0.98 : 0.9,
          duration: duration * pausePosition,
          ease: 'power1.inOut',
        });

        // Pause/hover
        tl.to(leaf, {
          duration: pauseDuration,
          ease: 'none',
        });

        // Continue falling
        tl.to(leaf, {
          y: endY,
          x: sway,
          rotate: rotation + 180,
          opacity: isLargeLeaf ? 0.98 : 0.9,
          duration: duration * (1 - pausePosition),
          ease: 'power1.inOut',
        });

        this.leafAnimations.push(tl); // Push to new array that accepts Timeline
      } else {
        // Normal falling animation
        const tween = gsap.fromTo(
          leaf,
          {
            y: startY,
            x: drift,
            rotate: rotation,
            opacity: 0,
          },
          {
            y: endY,
            x: sway,
            rotate: rotation + 180,
            opacity: isLargeLeaf ? 0.98 : 0.9,
            duration,
            delay: Math.random() * 2,
            ease: 'power1.inOut',
            repeat: -1,
            repeatDelay: Math.random() * 1.6,
          }
        );
        this.leafAnimations.push(tween);
      }
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

  private createBackgroundEffect() {
    const splashContent = document.querySelector('.splash-content');
    if (!splashContent) return;

    // Create a blur overlay for the background
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'absolute';
    blurOverlay.style.inset = '0';
    blurOverlay.style.borderRadius = '8px';
    blurOverlay.style.pointerEvents = 'none';
    blurOverlay.style.zIndex = '5';
    blurOverlay.style.backdropFilter = 'blur(0px)';
    blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    blurOverlay.style.transition = 'all 0.3s ease';

    splashContent.appendChild(blurOverlay);

    // Animate the background scale and blur
    const animation = gsap.timeline();

    // Scale up the content
    animation.to(splashContent, {
      scale: 1.08,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Add blur effect
    animation.to(
      blurOverlay,
      {
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        duration: 0.5,
        ease: 'power2.out',
      },
      0
    );

    // Store the overlay for cleanup
    return { animation, blurOverlay };
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
      leaf.src = 'assets/leaf.svg';
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
      this.burstLeaves.push(leaf);

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
            this.makeLeafFloat(leaf, finalX, finalY);
          },
        }
      );

      // Add fragments
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
              fragment.remove();
            },
          }
        );
      }
    }
  }

  private makeLeafFloat(leaf: HTMLElement, startX: number, startY: number) {
    const floatDuration = Math.random() * 8 + 6;
    const swayX = (Math.random() - 0.5) * 200;
    const swayY = Math.random() * 100 + 50;
    const rotation = Math.random() * 360;

    gsap.to(leaf, {
      x: startX + swayX,
      y: startY + swayY,
      rotation: `+=${rotation}`,
      duration: floatDuration,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      onRepeat: () => {
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

  // openMainPage() {
  //   if (this.isAnimating) return;
  //   this.isAnimating = true;

  //   // Kill all animations (both Tween and Timeline)
  //   this.leafAnimations.forEach((animation) => animation.kill());
  //   this.leaves.forEach((leaf) => leaf.remove());

  //   this.createLeafBurst();

  //   gsap.to('.open-invitation-btn', {
  //     scale: 0.95,
  //     duration: 0.1,
  //     yoyo: true,
  //     repeat: 1,
  //     onComplete: () => {
  //       gsap.to('.open-invitation-btn', {
  //         x: 5,
  //         yoyo: true,
  //         repeat: 3,
  //         duration: 0.05,
  //       });
  //     },
  //   });

  //   gsap.to('.splash-content', {
  //     opacity: 0,
  //     y: -10,
  //     duration: 0.7,
  //     ease: 'power2.inOut',
  //     onComplete: () => {
  //       this.router.navigate(['/main']);
  //       this.isAnimating = false;
  //     },
  //   });
  // }
  // openMainPage() {
  //   if (this.isAnimating) return;
  //   this.isAnimating = true;

  //   // FIRST: Create background scale and blur effect
  //   const effect = this.createBackgroundEffect();

  //   // Animate button press
  //   gsap.to('.open-invitation-btn', {
  //     scale: 0.95,
  //     duration: 0.1,
  //     yoyo: true,
  //     repeat: 1,
  //     onComplete: () => {
  //       gsap.to('.open-invitation-btn', {
  //         x: 5,
  //         yoyo: true,
  //         repeat: 3,
  //         duration: 0.05,
  //       });
  //     },
  //   });

  //   // Wait for background effect to complete, then trigger leaf burst
  //   setTimeout(() => {
  //     // Stop falling leaves
  //     this.leafAnimations.forEach((animation) => animation.kill());
  //     this.leaves.forEach((leaf) => leaf.remove());

  //     // Create leaf burst
  //     this.createLeafBurst();

  //     // Clean up blur overlay if it exists
  //     if (effect && effect.blurOverlay) {
  //       gsap.to(effect.blurOverlay, {
  //         backdropFilter: 'blur(0px)',
  //         backgroundColor: 'rgba(0, 0, 0, 0)',
  //         duration: 0.3,
  //         onComplete: () => {
  //           if (effect.blurOverlay) effect.blurOverlay.remove();
  //         },
  //       });
  //     }

  //     // Smooth disappear for the card
  //     gsap.to('.splash-content', {
  //       opacity: 0,
  //       y: -10,
  //       duration: 0.7,
  //       ease: 'power2.inOut',
  //       onComplete: () => {
  //         this.router.navigate(['/main']);
  //         this.isAnimating = false;
  //       },
  //     });
  //   }, 500); // Wait 500ms for background effect to complete
  // }

  // openMainPage() {
  //   if (this.isAnimating) return;
  //   this.isAnimating = true;

  //   // Add CSS class for background effect
  //   const splashContent = document.querySelector('.splash-content');
  //   if (splashContent) {
  //     splashContent.classList.add('background-effect');
  //   }

  //   // Animate button press
  //   gsap.to('.open-invitation-btn', {
  //     scale: 0.95,
  //     duration: 0.1,
  //     yoyo: true,
  //     repeat: 1,
  //     onComplete: () => {
  //       gsap.to('.open-invitation-btn', {
  //         x: 5,
  //         yoyo: true,
  //         repeat: 3,
  //         duration: 0.05,
  //       });
  //     },
  //   });

  //   // Wait for background effect to complete, then trigger leaf burst
  //   setTimeout(() => {
  //     // Stop falling leaves
  //     this.leafAnimations.forEach((animation) => animation.kill());
  //     this.leaves.forEach((leaf) => leaf.remove());

  //     // Create leaf burst
  //     this.createLeafBurst();

  //     // Smooth disappear for the card
  //     gsap.to('.splash-content', {
  //       opacity: 0,
  //       y: -10,
  //       duration: 0.7,
  //       ease: 'power2.inOut',
  //       onComplete: () => {
  //         this.router.navigate(['/main']);
  //         this.isAnimating = false;
  //       },
  //     });
  //   }, 500);
  // }
  openMainPage() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Get elements with proper typing
    const splashContent = document.querySelector('.splash-content') as HTMLElement;

    if (splashContent) {
      // Create a wrapper for the background image
      const bgWrapper = document.createElement('div');
      bgWrapper.style.position = 'absolute';
      bgWrapper.style.inset = '0';
      bgWrapper.style.borderRadius = '16px';
      bgWrapper.style.backgroundImage = 'url("../../assets/backgrounds/flower_background.jpg")';
      bgWrapper.style.backgroundSize = 'cover';
      bgWrapper.style.backgroundPosition = 'center';
      bgWrapper.style.backgroundRepeat = 'no-repeat';
      bgWrapper.style.zIndex = '0';
      bgWrapper.style.pointerEvents = 'none';

      // Set solid background color
      splashContent.style.background = '#f6efe9';
      splashContent.insertBefore(bgWrapper, splashContent.firstChild);

      // Calculate scale needed to cover the screen
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cardWidth = splashContent.clientWidth;
      const cardHeight = splashContent.clientHeight;

      const scaleX = screenWidth / cardWidth;
      const scaleY = screenHeight / cardHeight;
      const scale = Math.max(scaleX, scaleY) * 1.1;

      // Animate background to expand and cover screen
      gsap.to(bgWrapper, {
        scale: scale,
        borderRadius: 0,
        duration: 0.8,
        ease: 'power2.out',
        transformOrigin: 'center',
        onComplete: () => {
          gsap.to(bgWrapper, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              bgWrapper.remove();
            },
          });
        },
      });
    }

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

    // Wait for background effect, then trigger leaf burst
    setTimeout(() => {
      // Stop falling leaves
      this.leafAnimations.forEach((animation) => animation.kill());
      this.leaves.forEach((leaf) => leaf.remove());

      // Create leaf burst
      this.createLeafBurst();

      // Smooth disappear for the card
      gsap.to('.splash-content', {
        opacity: 0,
        y: -10,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          this.router.navigate(['/main']);
          this.isAnimating = false;
        },
      });
    }, 900);
  }
  ngOnDestroy() {
    this.leaves.forEach((leaf) => leaf.remove());
    this.leafAnimations.forEach((animation) => animation.kill());
  }
}
