import fs = require('fs');
import path = require('path');
import shelljs = require('shelljs');

const Port = '/dev/tty.SLAB_USBtoUART';

const distDir = path.join(__dirname, 'dist');
const targetDir = 'web';

const files = [...shelljs.find(distDir)].filter(filter);

function filter(file: string) {
  return path.basename(file)[0] !== '.';
}

files.forEach((fileAbsPath) => {
  const fileRelPath = fileAbsPath.substring(distDir.length);

  if (!fileRelPath) { return; }

  const stat = fs.statSync(fileAbsPath);

  const targetFilePath = path.join(targetDir, fileRelPath);

  if (stat.isFile()) {
    console.log(`Uploading ${targetFilePath}`);

    const putResult = shelljs.exec(`ampy --port ${Port} put ${fileAbsPath} ${targetFilePath}`);

    if (putResult.code !== 0) {
      console.error('Put failed!');

      process.exit(1);
    }
  }

  // const tmpCheckFilePath = path.join('/', 'tmp', fileRelPath);

  // const getResult = shelljs.exec(`ampy --port ${Port} get ${targetFilePath} ${tmpCheckFilePath}`);

  // if (getResult.code !== 0) {
  //   console.error('Get failed!');

  //   process.exit(1);
  // }

  // const valid = checkFile(fileAbsPath, tmpCheckFilePath);

  // if (!valid) {
  //   console.error('Check failed!');

  //   process.exit(1);
  // }
});

// function checkFile(orig: string, copied: string) {
//   const buf1 = fs.readFileSync(orig);
//   const buf2 = fs.readFileSync(copied);

//   if (buf1.length !== buf2.length) {
//     return false;
//   }

//   for (let i = 0; i < buf1.length; i++) {
//     if (buf1.readUInt8(i) !== buf2.readUInt8(i)) {
//       return false;
//     }
//   }

//   return true;
// }
