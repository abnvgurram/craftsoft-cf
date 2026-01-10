const fs = require('fs');
const path = require('path');

const coursesDir = 'e:/Craft soft/Website/courses';

// Get all course subdirectories
const courseFolders = fs.readdirSync(coursesDir).filter(f => {
    const fullPath = path.join(coursesDir, f);
    return fs.statSync(fullPath).isDirectory();
});

courseFolders.forEach(folder => {
    const indexPath = path.join(coursesDir, folder, 'index.html');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');

        // Fix related course links (.html -> directory format)
        content = content.replace(/href="graphic-design\.html"/g, 'href="../graphic-design/"');
        content = content.replace(/href="full-stack\.html"/g, 'href="../full-stack/"');
        content = content.replace(/href="resume-interview\.html"/g, 'href="../resume-interview/"');
        content = content.replace(/href="ui-ux\.html"/g, 'href="../ui-ux/"');
        content = content.replace(/href="python\.html"/g, 'href="../python/"');
        content = content.replace(/href="java\.html"/g, 'href="../java/"');
        content = content.replace(/href="react\.html"/g, 'href="../react/"');
        content = content.replace(/href="data-analytics\.html"/g, 'href="../data-analytics/"');
        content = content.replace(/href="devops\.html"/g, 'href="../devops/"');
        content = content.replace(/href="aws\.html"/g, 'href="../aws/"');
        content = content.replace(/href="azure\.html"/g, 'href="../azure/"');
        content = content.replace(/href="salesforce\.html"/g, 'href="../salesforce/"');
        content = content.replace(/href="soft-skills\.html"/g, 'href="../soft-skills/"');
        content = content.replace(/href="spoken-english\.html"/g, 'href="../spoken-english/"');

        // Fix intermediate icon (replace broken character with proper icon)
        // Pattern matches <h3> followed by optional whitespace and non-ASCII char followed by Intermediate
        content = content.replace(/<h3>\s*[^\x00-\x7F]+\s*Intermediate/g, '<h3><i class="fas fa-cogs"></i> Intermediate');

        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`Fixed: ${folder}/index.html`);
    }
});

console.log('All course pages fixed!');
