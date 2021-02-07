const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth')

async function clickElementHandle(handle, {
  selector,
} = {}) {
  return puppeteerErrorRetry(async () => {
    if (!handle) {
      this.logger.warn('clickElementHandle-empty-handle', await this.dump({
        selector,
      }));
      return false;
    }

    const boundingBox = await handle.boundingBox();
    if (!boundingBox) {
      this.logger.warn('clickElementHandle-empty-bounding-box', await this.dump({
        selector,
      }));
      return false;
    }

    if (!await this.page.evaluate(isVisible, handle)) {
      this.logger.warn('clickElementHandle-invisible-handle', await this.dump({
        selector,
      }));
      return false;
    }

    let targetX;
    let targetY;

    for (let i = 0; ; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.page.evaluate(element => element.scrollIntoViewIfNeeded(), handle);
      const {
        x,
        y,
        width,
        height,
        // eslint-disable-next-line no-await-in-loop
      } = await handle.boundingBox();
      targetX = parseInt(x + Math.min(Math.random() * width, width - 2) + 1, 10);
      targetY = parseInt(y + Math.min(Math.random() * height, height - 2) + 1, 10);

      // validate target point
      // eslint-disable-next-line no-await-in-loop
      const result = await this.page.evaluate((e, point) => {
        function contains(parent, child) {
          if (!child || !parent) return false;
          if (child === parent) return true;
          return contains(parent, child.parentElement);
        }

        const el = document.elementFromPoint(point.x, point.y);
        return {
          contains: contains(e, el) || contains(el, e),
          point: el.outerHTML,
          element: e.outerHTML,
        };
      }, handle, {
        x: targetX,
        y: targetY,
      });

      if (result && result.contains) break;

      if (i > 10) {
        this.logger.warn('click-target-covered', {
          result,
          x,
          y,
          width,
          height,
          targetX,
          targetY,
        });

        // eslint-disable-next-line no-await-in-loop
        await handle.click();
        return true;
      }

      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 100));
    }

    // eslint-disable-next-line no-await-in-loop
    await this.page.mouse.move(targetX, targetY, {
      steps: 10 + parseInt(Math.random() * 50, 10),
    });
    // eslint-disable-next-line no-await-in-loop
    await this.page.mouse.click(targetX, targetY, {
      delay: 20 + parseInt(Math.random() * 50, 10),
    });

    return true;
  });
}

const Scraper = (function() {
  let instance = undefined;
  async function Browser() {
    let PUPPETEER = undefined;
    let PAGE = undefined;
  
    if (!PUPPETEER) {
      puppeteer.use(stealthPlugin())
      PUPPETEER = await puppeteer.launch()
    };
    if (!PAGE) {
      PAGE = await PUPPETEER.newPage();
    }
  
    async function open(targetURL) {
      await PAGE.goto(targetURL)
    }
    async function close() {
      await PUPPETEER.close()
      PUPPETEER = undefined;
      PAGE = undefined;
      instance = undefined;
    }
    async function screenshot(title) {
      await PAGE.screenshot({path: `${title || 'example'}.png`})
    }
  
    return Object.freeze({
      ...PAGE, open, close, screenshot, clickElementHandle
    })
  
  }

  return {
    getInstance: async () => {
      if (!instance) instance = await Browser();
      return instance;
    }
  }
})();

module.exports = Scraper
