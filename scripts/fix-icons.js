const fs = require('fs');
const path = require('path');

const coursesDir = 'e:/Craft soft/Website/courses';

// Correct icon mappings based on main.js
const courseIcons = {
    'Graphic Design': { icon: 'fas fa-palette', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
    'UI/UX Design': { icon: 'fas fa-window-maximize', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
    'Full Stack Development': { icon: 'fas fa-layer-group', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
    'Full Stack': { icon: 'fas fa-layer-group', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
    'DevOps Engineering': { icon: 'fas fa-server', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
    'DevOps': { icon: 'fas fa-server', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
    'AWS Cloud': { icon: 'fab fa-aws', gradient: 'linear-gradient(135deg, #ff7675, #fd79a8)' },
    'Python Programming': { icon: 'fab fa-python', gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
    'Resume & Interview': { icon: 'fas fa-file-invoice', gradient: 'linear-gradient(135deg, #00cec9, #81ecec)' },
    'Resume &amp; Interview': { icon: 'fas fa-file-invoice', gradient: 'linear-gradient(135deg, #00cec9, #81ecec)' },
    'Spoken English': { icon: 'fas fa-microphone', gradient: 'linear-gradient(135deg, #a29bfe, #dfe6e9)' },
    'Soft Skills': { icon: 'fas fa-users', gradient: 'linear-gradient(135deg, #55efc4, #00b894)' },
    'Data Analytics': { icon: 'fas fa-chart-bar', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
    'Java Programming': { icon: 'fab fa-java', gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)' },
    'React Development': { icon: 'fab fa-react', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
    'Azure Cloud': { icon: 'fab fa-microsoft', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
    'Salesforce': { icon: 'fab fa-salesforce', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
    'DSA': { icon: 'fas fa-code', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
    'Git & GitHub': { icon: 'fab fa-github', gradient: 'linear-gradient(135deg, #2d3436, #636e72)' },
    'Handwriting': { icon: 'fas fa-pen-fancy', gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
    'DevSecOps': { icon: 'fas fa-shield-alt', gradient: 'linear-gradient(135deg, #e17055, #fd79a8)' },
    'Automation Python': { icon: 'fab fa-python', gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
    'Python': { icon: 'fab fa-python', gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)' }
};

// Get all course subdirectories
const courseFolders = fs.readdirSync(coursesDir).filter(f => {
    const fullPath = path.join(coursesDir, f);
    return fs.statSync(fullPath).isDirectory();
});

courseFolders.forEach(folder => {
    const indexPath = path.join(coursesDir, folder, 'index.html');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        let modified = false;

        // Fix each course's related card icons with more flexible pattern
        for (const [courseName, data] of Object.entries(courseIcons)) {
            // More flexible pattern that handles multiline and varying whitespace
            const escName = courseName.replace(/[&]/g, '&amp;').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const cardPattern = new RegExp(
                `<div[^>]*class="related-course-icon"[^>]*>[\\s\\S]*?<i class="[^"]*"></i>[\\s\\S]*?</div>[\\s\\S]*?<h4>${escName}</h4>`,
                'g'
            );

            const replacement = `<div class="related-course-icon" style="background: ${data.gradient}">
            <i class="${data.icon}"></i> </div>
          <h4>${courseName}</h4>`;

            if (cardPattern.test(content)) {
                content = content.replace(cardPattern, replacement);
                modified = true;
            }
        }

        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`Processed: ${folder}/index.html ${modified ? '(modified)' : '(no changes)'}`);
    }
});

console.log('Icon fix complete!');
