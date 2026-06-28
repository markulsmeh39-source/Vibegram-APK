const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'node_modules', 'capacitor-plugin-send-intent', 'android', 'src', 'main', 'AndroidManifest.xml');

if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');
  content = content.replace(/package="[^"]+"/, '');
  fs.writeFileSync(manifestPath, content);
  console.log('Successfully patched capacitor-plugin-send-intent AndroidManifest.xml');
} else {
  console.log('capacitor-plugin-send-intent AndroidManifest.xml not found, skipping patch.');
}
