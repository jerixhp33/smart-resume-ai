const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'src/lib/supabase/types.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Replace Insert and Update with any
content = content.replace(/Insert: Omit<Database\['public'\]\['Tables'\]\['.*?'\]\['Row'\].*?>/g, 'Insert: any')
content = content.replace(/Update: Partial<Database\['public'\]\['Tables'\]\['.*?'\]\['Insert'\]>/g, 'Update: any')

fs.writeFileSync(filePath, content)
console.log('Fixed types.ts Insert/Update')
