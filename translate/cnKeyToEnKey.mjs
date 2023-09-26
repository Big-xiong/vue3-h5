import fs from 'fs';
import glob from 'glob';
import th from '../public/language/th.mjs';
import vi from '../public/language/vi.mjs';
import en from '../public/language/en.mjs';

const targetVi = {}
const targetTh = {}
Object.keys(en).map(key => {
    const value = en[key]
    targetVi[value] = vi[key]
    targetTh[value] = th[key]
})

fs.writeFileSync('./en_vi.mjs', `export default ${JSON.stringify(targetVi)}`)
fs.writeFileSync('./en_th.mjs', `export default ${JSON.stringify(targetTh)}`)
