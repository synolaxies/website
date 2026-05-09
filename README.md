# Synolaxies Studio Official Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive, and feature-rich landing page designed to help creators receive financial support for their work. Built with vanilla HTML, CSS, and JavaScript, it's lightweight, easy to customize, and integrated with Razorpay for seamless payments.

**➡️ [View Live Demo](https://synolaxies.github.io/website/)**

![Community Hub Screenshot](src/image/screenshot.png)
*(Note: You should add a screenshot of your project and name it `screenshot.png` inside the `src/image/` folder)*

---

## ✨ Features

- **Clean & Modern UI:** A beautiful and intuitive interface to provide a great user experience.
- **Fully Responsive:** Looks great on all devices, from mobile phones to desktops.
- **Light/Dark Mode:** A theme-switcher that respects user's system preference and saves their choice.
- **Secure Payment Modal:** A sleek modal for accepting payments via Razorpay.
- **Dynamic Testimonial Carousel:** Showcase supporter feedback with a touch-friendly slider (powered by Swiper.js).
- **Interactive Animations:**
  - Engaging particle effect background (powered by Particles.js).
  - Premium rotating gradient animation on logos.
  - Subtle on-scroll animations for a dynamic feel.
- **Interactive Components:**
  - FAQ Accordion for commonly asked questions.
  - Dynamic hero stats counter.
  - Contact form with Netlify integration.
- **PWA Ready:** Includes a manifest and theme color for a native-like app experience on mobile.
- **Easy to Customize:** Built with clean code and CSS variables for easy theming.

---

## 🚀 Tech Stack

- **HTML5**
- **CSS3** (with CSS Variables for theming)
- **JavaScript (ES6+)**
- **Libraries:**
  - Swiper.js for the testimonial carousel.
  - Particles.js for the background animation.
  - Font Awesome for icons.

---

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You just need a modern web browser.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/synolaxies/website.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd website
    ```
3.  Open the `index.html` file in your browser. That's it!

---

## ⚙️ Configuration

- **Razorpay Key:** To accept live payments, open `src/scripts/script.js` and replace the placeholder `RAZORPAY_KEY_ID` with your own live key from your Razorpay dashboard.
- **Contact Form:** To receive messages from the contact form, ensure your repository is linked to a Netlify account and that the form has the `data-netlify="true"` attribute in `index.html`.
- **Testimonials:** To change the testimonials, edit the `testimonials` array in `src/scripts/script.js`.
- **Projects:** To update your projects, modify the `projects-section` in `index.html`.
- **Images & Logo:** Replace the images in the `src/image/` folder with your own.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 📬 Contact

Synolaxies Studio - @synolaxies - synolaxies@gmail.com

Project Link: https://github.com/synolaxies/website

git add .
git commit -m "donation-amount updated"
git push origin main