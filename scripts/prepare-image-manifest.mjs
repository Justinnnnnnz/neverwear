import { readFile,writeFile } from 'node:fs/promises';
const products=JSON.parse(await readFile('data/products.json','utf8'));
let manifest={};try{manifest=JSON.parse(await readFile('data/image-manifest.json','utf8'));}catch{}
const cast=[
 'fictional white woman aged 25, tall slim-to-average build, straight shoulder-length blonde hair, blue eyes, oval face',
 'fictional white woman aged 26, tall slim-to-average build, long straight chestnut hair, brown eyes, softly angular face',
 'fictional East Asian woman aged 25, tall slim-to-average build, sleek straight black shoulder-length hair, dark eyes, oval face',
 'fictional white woman aged 24, tall slim-to-average build, loose auburn hair, hazel eyes, defined cheekbones',
 'fictional East Asian woman aged 26, tall slim-to-average build, long dark hair tucked behind ears, dark eyes, softly angular face'
];
const casting=[0,1,2,3,0,1,2,3,0,1,4,3,0,1,2,3,0,1,4,3,0,1,2,3];
const common='Premium minimalist fashion catalogue photography. Seamless warm light-grey backdrop #EEECE8, soft diffused even daylight, gentle natural shadow, true-to-life slightly muted matte colour. No logos, brand marks, text, labels, watermark, props, mannequins, stands, sexualised poses, or real-person likeness. Anatomically correct hands, limbs and footwear.';
for(const [n,p] of products.entries()){
 const c=p.colors[0];const framing=p.category==='tops'?'three-quarter length':'full-length head-to-toe with shoes entirely visible';
 const styling=p.category==='tops'?'simple black tailored trousers':p.category==='outerwear'?'plain white tee, black tailored trousers and plain ankle boots':p.category==='pants'||p.subcategory==='skirts'?'plain white tee and neutral plain shoes':p.sizeType==='shoe'?'plain white tee and simple neutral skirt ending above the footwear, emphasizing the shoes':'simple neutral shoes';
 const prompts=[`Use case: product-mockup. Asset: on-model front product catalogue main image, portrait 2:3, 1024x1536. ${common} Subject: ${cast[casting[n]]}, natural minimal makeup, calm confident slightly serious editorial expression. Wearing a ${c.name} (${c.hex}) ${p.nameEn} — ${p.description}; materials and construction: ${p.details.join('; ')}. Styled with ${styling}. ${framing}, centred, facing camera front, relaxed understated weight-on-one-leg pose, clean negative space, consistent camera height. Product colour closely matches ${c.hex}.`,
 `Use case: product-mockup. Asset: product close-up catalogue detail, portrait 2:3, 1024x1536. ${common} Close-up detail photograph of the same ${c.name} (${c.hex}) ${p.nameEn}. ${p.description}. Materials: ${p.details.join('; ')}. Show ${p.sizeType==='shoe'?'toe shape, heel construction, material grain, stitching and sole edge':'fabric texture, weaving, stitching, seams and relevant buttons or zip'}. Shallow depth of field, realistic material, garment filling frame. No face or people. Product colour closely matches ${c.hex}.`];
 prompts.forEach((prompt,i)=>{const path=`public/products/${p.slug}/c0-${i+1}.webp`;if(!manifest[path])manifest[path]={prompt,status:'pending',productId:p.id,cast:casting[n]};});
}
for(const [i,subject] of ['camel long wool coat over white tee with black trousers and chocolate brown pointed knee-high 9cm stiletto boots','black oversized puffer with high collar over a neutral knit dress and simple black ankle boots'].entries()){
 const path=`public/campaign/hero-${i+1}.webp`;if(!manifest[path])manifest[path]={prompt:`Use case: ads-marketing. Asset: winter fashion lookbook home hero, landscape 3:2, 1536x1024. ${common} ${cast[i]}, natural minimal makeup, calm confident editorial expression, wearing ${subject}. Quiet minimalist pale stone studio, full length front three-quarter stance, model toward the right half, broad clean warm-grey negative space on the left for website headline. Winter lookbook mood.`,status:'pending'};
}
for(const [i,cat] of ['outerwear','tops','skirts-dresses','pants','sneakers','heels'].entries()){
 const p=products.find(p=>p.category===cat),c=p.colors[0],path=`public/campaign/cat-${cat}.webp`;
 if(!manifest[path])manifest[path]={prompt:`Use case: product-mockup. Asset: fashion category cover, portrait 2:3, 1024x1536. ${common} ${cast[[0,2,1,3,0,4][i]]}, natural minimal makeup, calm editorial expression, wearing ${c.name} (${c.hex}) ${p.nameEn}. ${p.description}, ${p.details.join('; ')}. Styled with simple neutral basics, head-to-toe full-length front relaxed pose, product entirely visible, centered with generous negative space.`,status:'pending'};
}
await writeFile('data/image-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`${Object.keys(manifest).length} Phase 1 shots`);
