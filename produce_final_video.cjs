const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function produceMasterVideo() {
  const recordingsDir = path.join(__dirname, 'master_recordings');
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  console.log('🎬 [LAUNCH PRODUCTION] Starting 1080x1350 Master Capture...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1080, height: 1350 },
    },
  });

  const page = await context.newPage();
  const stagePath = 'file://' + path.resolve('stage.html');

  console.log('Loading Stage at 1080x1350...');
  await page.goto(stagePath);
  await page.waitForTimeout(2500);

  const frame = page.frameLocator('#app-frame');
  const appFrame = page.frames().find(f => f.url().includes('5173') || f.name() === 'app-frame') || page.frames()[1];

  // -----------------------------------------------------------------
  // SCENE 1: HOOK & LIVE EDITING (00:00 – 00:09)
  // -----------------------------------------------------------------
  console.log('▶ Scene 1 (00:00 – 00:09): Live Markdown Editing');
  await page.evaluate(() => window.setDemoScene(1));
  await page.waitForTimeout(1000);

  const cmContent = frame.locator('.cm-content');
  await cmContent.click();
  await page.keyboard.press('End');
  await page.keyboard.type(' — Apresentações em Código');
  await page.waitForTimeout(2500);

  await page.keyboard.press('Enter');
  await page.keyboard.type('* Desenvolvido com React 19 & Tailwind v4');
  await page.waitForTimeout(3000);

  // -----------------------------------------------------------------
  // SCENE 2: ZERO-FRICTION DRAG & DROP (00:09 – 00:20)
  // -----------------------------------------------------------------
  console.log('▶ Scene 2 (00:09 – 00:20): Drag & Drop Import');
  await page.evaluate(() => window.setDemoScene(2));
  await page.waitForTimeout(1000);

  const keynoteDeck = `# Markdeck Launch Keynote 🚀
O motor moderno de apresentações em Markdown.

* Arquitetura reativa e desacoplada
* Zero instalação • 100% no browser
* Transições cinematográficas nativas
---
## Funcionalidades de Alto Nível ⚡
Tudo o que um orador técnico precisa:

* **Ecrã Inteiro Nativo**: Foco absoluto no palco
* **Reações em Tempo Real**: Celebração com confetti ('C')
* **Exportação para PDF**: 1 slide por página em 16:9
---
## Sucesso Garantido! 🎉
Construa o seu próximo deck em minutos.

🌐 ss20112006.github.io/Markdeck
`;

  // Simulate dragover to illuminate Apple HIG translucent dropzone
  if (appFrame) {
    await appFrame.evaluate(() => {
      const screen = document.querySelector('.screen-only');
      if (screen) {
        screen.dispatchEvent(new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        }));
      }
    });
  }
  await page.waitForTimeout(2200);

  // Simulate file drop
  if (appFrame) {
    await appFrame.evaluate((content) => {
      const file = new File([content], 'keynote-lancamento.md', { type: 'text/markdown' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const screen = document.querySelector('.screen-only');
      if (screen) {
        screen.dispatchEvent(new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }));
      }
    }, keynoteDeck);
  }

  console.log('   Deck dropped successfully! Holding on new preview...');
  await page.waitForTimeout(4000);

  // -----------------------------------------------------------------
  // SCENE 3: IMMERSIVE PRESENTATION MODE (00:20 – 00:36)
  // -----------------------------------------------------------------
  console.log('▶ Scene 3 (00:20 – 00:36): Presentation Mode Navigation');
  await page.evaluate(() => window.setDemoScene(3));
  await page.waitForTimeout(1000);

  // Click Apresentar button
  await frame.locator('button:has-text("Apresentar")').click();
  await page.waitForTimeout(3500);

  // Next Slide (Slide 2: Features)
  console.log('   Advancing to Slide 2 (Features)...');
  await frame.locator('nav[aria-label="Controlos de Apresentação"] button[aria-label="Próximo slide"]').click();
  await page.waitForTimeout(4000);

  // Next Slide (Slide 3: Finale)
  console.log('   Advancing to Slide 3 (Finale)...');
  await frame.locator('nav[aria-label="Controlos de Apresentação"] button[aria-label="Próximo slide"]').click();
  await page.waitForTimeout(4000);

  // -----------------------------------------------------------------
  // SCENE 4: INTERACTIVE CELEBRATION (00:36 – 00:46)
  // -----------------------------------------------------------------
  console.log('▶ Scene 4 (00:36 – 00:46): Confetti Celebration');
  await page.evaluate(() => window.setDemoScene(4));
  await page.waitForTimeout(800);

  // Click Confetti Celebration button
  await frame.locator('nav[aria-label="Controlos de Apresentação"] button[aria-label="Lançar Confetti"]').click();
  console.log('   Confetti exploding! Holding 5.5s...');
  await page.waitForTimeout(5500);

  // -----------------------------------------------------------------
  // SCENE 5: POWER TOOLKIT & SHORTCUTS (00:46 – 00:54)
  // -----------------------------------------------------------------
  console.log('▶ Scene 5 (00:46 – 00:54): Shortcuts & Power Toolkit');
  await page.evaluate(() => window.setDemoScene(5));
  
  // Close presentation mode
  await frame.locator('nav[aria-label="Controlos de Apresentação"] button[aria-label="Sair da apresentação"]').click();
  await page.waitForTimeout(1200);

  // Open Keyboard Shortcuts modal
  await frame.locator('button[aria-label="Atalhos de teclado"]').click();
  await page.waitForTimeout(3800);

  // Close shortcuts modal
  await frame.locator('button[aria-label="Fechar atalhos"]').click();
  await page.waitForTimeout(1200);

  // -----------------------------------------------------------------
  // SCENE 6: BRAND OUTRO & VERIFIED CTA (00:54 – 01:00)
  // -----------------------------------------------------------------
  console.log('▶ Scene 6 (00:54 – 01:00): Brand Outro & Call to Action');
  await page.evaluate(() => window.showOutro());
  await page.waitForTimeout(6000);

  console.log('Closing browser to finalize capture...');
  await page.close();
  await context.close();
  await browser.close();

  const webmFiles = fs.readdirSync(recordingsDir).filter(f => f.endsWith('.webm'));
  if (webmFiles.length === 0) {
    throw new Error('No raw recording file found.');
  }

  const rawWebm = path.join(recordingsDir, webmFiles[webmFiles.length - 1]);
  console.log(`Raw master recording: ${rawWebm}`);

  // -----------------------------------------------------------------
  // FINAL ENCODING: Broadcast-grade MP4 (H.264, 4:5, 30fps)
  // -----------------------------------------------------------------
  console.log('Encoding final 1080x1350 MP4 with FFmpeg...');
  const finalMp4 = path.join(__dirname, 'markdeck_launch_demo.mp4');
  const desktopMp4 = path.join(process.env.HOME, 'Desktop', 'markdeck_launch_demo.mp4');
  const thumbnailPng = path.join(__dirname, 'thumbnail.png');
  const desktopThumbnail = path.join(process.env.HOME, 'Desktop', 'markdeck_thumbnail.png');

  // FFmpeg H.264 transcode with faststart for instantaneous mobile playback
  const encodeCmd = `/opt/homebrew/bin/ffmpeg -y -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p -r 30 -preset medium -crf 20 -movflags +faststart "${finalMp4}"`;
  execSync(encodeCmd, { stdio: 'inherit' });
  fs.copyFileSync(finalMp4, desktopMp4);
  console.log(`✓ Master Video: ${finalMp4}`);
  console.log(`✓ Desktop Copy: ${desktopMp4}`);

  // Generate Thumbnail at t=28s (when presentation Slide 2 is displayed inside the stage)
  console.log('Generating high-res 1080x1350 thumbnail at t=28s...');
  const thumbCmd = `/opt/homebrew/bin/ffmpeg -y -ss 00:00:28 -i "${finalMp4}" -vframes 1 "${thumbnailPng}"`;
  execSync(thumbCmd, { stdio: 'inherit' });
  fs.copyFileSync(thumbnailPng, desktopThumbnail);
  console.log(`✓ Thumbnail: ${thumbnailPng}`);
  console.log(`✓ Desktop Thumbnail: ${desktopThumbnail}`);

  console.log('🎉 [PRODUCTION SUCCESSFUL] Video and artifacts ready for LinkedIn!');
}

produceMasterVideo().catch(err => {
  console.error('Master production error:', err);
  process.exit(1);
});
