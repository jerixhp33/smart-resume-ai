const fs = require('fs');
const path = require('path');
const sectionsDir = path.join(__dirname, 'src/components/builder/sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('Section.tsx'));
const allowedFields = ['position', 'company', 'location', 'name', 'issuer', 'title', 'degree', 'field_of_study', 'institution', 'language', 'role', 'organization', 'full_name'];

for (const file of files) {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match: onChange={e => updateItem(VAR, 'FIELD', e.target.value)}
  const regexItem = /onChange=\{e => updateItem\(([^,]+),\s*'([^']+)',\s*e\.target\.value\)\}/g;
  content = content.replace(regexItem, (match, idVar, field) => {
    if (allowedFields.includes(field) && !match.includes('enableAI')) {
      return `${match}\n                        enableAI\n                        onAIChange={val => updateItem(${idVar}, '${field}', val)}`;
    }
    return match;
  });

  // Match: onChange={e => update('FIELD', e.target.value)}
  const regexUpdate = /onChange=\{e => update\('([^']+)',\s*e\.target\.value\)\}/g;
  content = content.replace(regexUpdate, (match, field) => {
    if (allowedFields.includes(field) && !match.includes('enableAI')) {
      return `${match}\n            enableAI\n            onAIChange={val => update('${field}', val)}`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Done');
