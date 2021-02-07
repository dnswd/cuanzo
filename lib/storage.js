const fs, { constants } = require('fs');
const { F_OK, W_OK } = constants;
const { readFile, writeFile } = require('jsonfile');

const WRITE_OPS = {
  spaces: 2,
  EOL: '\r\n'
}

// const EMPTY_ENTRY_DB = {
//   title: '',
//   uri: '',
//   isavailable: true,
//   price: 0,
//   history: {
//     '':0
//   } 
// }

function DBPath(id) {
  return `../db/${id}.json`
}

async function STORAGE(id) {
  const PATH = DBPath(id);
  const data = null;

  await fs.access(PATH, F_OK | W_OK, (error) => {
    if (error) { // file is unreadable or doesn't exist
    await writeFile(PATH, [], WRITE_OPS)
    }
    data =  await readFile(PATH);
  })

  return {
    PATH,
    data,
    close: async () => {
      await writeFile(PATH, data, WRITE_OPS);
    }
  }
}

module.exports = STORAGE;
