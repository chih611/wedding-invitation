import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MainComponent implements OnInit, AfterViewInit {
  rsvpData = {
    name: '',
    guests: '',
    attendance: '',
  };

  ngOnInit() {}

  ngAfterViewInit() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero section on load
    gsap.from('.hero-text h1', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: 'back.out(1.7)',
    });

    // Scroll-triggered animations for sections
    gsap.from('.story-section', {
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      duration: 1,
    });

    gsap.from('.detail-card', {
      scrollTrigger: {
        trigger: '.details-section',
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
    });

    // Floating animation for decorations
    gsap.to('.flower-decoration', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  copyAccountNumber() {
    const accountNumber = '123456789';
    navigator.clipboard.writeText(accountNumber).then(() => {
      alert('Đã sao chép số tài khoản!');
    });
  }

  submitRSVP() {
    if (this.rsvpData.name && this.rsvpData.guests && this.rsvpData.attendance) {
      console.log('RSVP submitted:', this.rsvpData);
      alert(`Cảm ơn ${this.rsvpData.name} đã xác nhận tham dự!`);
      this.rsvpData = { name: '', guests: '', attendance: '' };
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}
