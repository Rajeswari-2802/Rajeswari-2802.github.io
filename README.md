# Rajeswari T · Portfolio

Personal portfolio: embedded systems, IoT and VLSI projects.

**Live:** https://Rajeswari-2802.github.io

## Structure

```
index.html                 Home (hero, about, projects, skills, journey, contact)
projects/vector-aid.html   V2V ambulance alert (Raspberry Pi 4 + nRF24L01)
projects/suma-tex.html     Textile predictive maintenance (ESP32-S3)
projects/gas-shutdown.html Gas detection + emergency shutdown (Arduino)
projects/stm32-fault.html  Machine fault monitoring (STM32 ADC)
assets/css/style.css       Styles and animations
assets/js/main.js          Starfield, scroll reveals, typing, counters, card tilt
assets/logo.svg            Logo / favicon
assets/Rajeswari_T_Resume.pdf
```

Pure HTML, CSS and JavaScript. No build step.

## Deploy on GitHub Pages

1. Create a public repo named exactly **`Rajeswari-2802.github.io`**.
2. Upload everything in this folder to the repo root, including the hidden `.nojekyll` file. `index.html` must sit at the top level, not inside a subfolder.
3. Open **Settings → Pages**, set Source to *Deploy from a branch*, then pick branch `main` and folder `/ (root)`.
4. Wait 1–2 minutes. The site will be live at https://rajeswari-2802.github.io

To update the resume, replace `assets/Rajeswari_T_Resume.pdf` and keep the same file name.
