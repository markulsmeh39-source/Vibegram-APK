import * as fs from 'fs';
import * as glob from 'glob';

const files = glob.sync('src/**/*.ts');
files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    const original = text;

    // Add referrerpolicy="no-referrer" to all dynamic <img> tags generating avatars or images
    text = text.replace(/<img src="([^"]+)" class/g, '<img src="$1" referrerpolicy="no-referrer" class');
    text = text.replace(/<img src='\$\{([^}]+)\}' class/g, '<img src="\\${$1}" referrerpolicy="no-referrer" class');
    text = text.replace(/<img src="\$\{([^}]+)\}" class/g, '<img src="\\${$1}" referrerpolicy="no-referrer" class');

    if (original !== text) {
        fs.writeFileSync(f, text);
        console.log('Updated ' + f);
    }
});
