const Telegram = require('./lib/telegram');
const Checker = require('./lib/checker')
const Storage = require('./lib/storage')

Telegram.onCommand('watch', async (msg, arg) => {
  const { uri, processor } = Checker.parseWatch(arg[1]);
  const CurrentUserStorage = Storage(ms.from.id)
})