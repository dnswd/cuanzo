const SCRAPER = require('./lib/browser');
const { Tokopedia } = require('./processors')

function parseWatch(uri) {
  const {hostname, href} = new URL(uri)
  let parser = undefined;
  switch (hostname) {
    case "www.tokopedia.com":
      parser = Tokopedia;
      break;
  }

  return {href, parser}
}

module.exports = { parseWatch }