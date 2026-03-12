## Always do this,  
-**Include the `frontend-design`  skill** before writing any frontend code , every session, non exceptions.  

## Reference Images  
-	If a reference Image is provided: match layout, spacing, typography, and color exactly.swap in placeholder content ( images via`https://placehold.co/`, generic copy). do not improve or add to the  design.   
-	If no reference Image: design from scratch with high craft ( see guardrails below).  
-	Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparason rounds. stop only wwhen no visible differences remain or user says so. 

## local server  
- **Always serve on localhost** - never screenshot a  `file: ///` URL.  
-	Start the dev Server : `node serve.njs` ( serves the project root at ` http; // localhost:3000`)  
-	`serve.njs` lives in the project root. Start it in the background before taking any screenshots.  
-	If the server is already running, do not start a second instance.  

## Screenshot workflow  
-	Puppeteer is installed at `C:\Users\serge\Desktop\claude code`. 
-	## Alwasys screenshot from localhost: ** `node screenhot.njs http:\\localhost:3000`  
-	Screenshots are saved automatically to `./temporary screenshots / screenshot-N.png `(auto-incremented, never overwritten). 
-	Optional label suffix. `node screenshot.njs http:localhost:3000 label` -> saves as  
-	`screenshot.njs` lives in the project root. Use it as-is  
-	After screenshotting read the png from `temporary screenshots /` with the head tool  
-	When comparing , be specific: “ heading is 32px but reference shows -24px", "card gap is 16px but should be 24 px" 
-	Check: spacing/padding. Font size/ weight/line- height, colors ( exact hex). Alignment, border-radius, shadows, Image sizing  

## Output Defaults  
-	Single ` index.html` file, all styles inline, unless user says otherwise.  
-	Tailwind css via CDN: `<script src=”https:// cdn.tailwindcss.com”></scripts >`  
-	Placeholder image:`https:// placehold.co/ WIDTHxHEIGHT`  
-	Mobile-first responsive  

## Brand assets  
-	Always check in the ` brad_assets/` folder before designing. It may contain logo, color, font  
-	If assets exist there, use them. Do not use placeholders, where real assets are available  
-	If a logo is present, use it . if a color palette is defined, use those exact value  

## Anti – generic Guardrails  
-**colors:** never use default tailwind palette ( indigo-500, blue-600, etc). pick a  
-	** shadows: ** Never use flat `shadow-md`. Use layered, color-tinted shadows with low  
-	**typography:** never use the same font for headings and for body.Pair a display/serif with a clean sans. apply tigh tracking ( `-0.03em` ) on large headings, generous line-height(`1.7`) on body.
-	**Gradients:** Layer multiple radial gradients. Add Grain/ texture via SVG noise filter for dept.
-	**Animation:** only animate `transform` and `opacity` . never `transition- all` .  
-**Interactive states:** Every clickable element needs hover, focus -visible. And actio. No exeptions.  
-	**image:** Add a gradient overlay ( `bg-gradients-to-t from -black / 60`) and a color treatment layer with `mix-blend-multiply`
-**spacing:** use intentional , consistent spacing tokens – not random tailwind steps.  
-	**Depth:** Surfaces should have a layering system ( base -> elevated -> Floating). Not all sit st the same z-plane

## Hard rules  
-	DO not add section, Features or content not in the reference  
-	Do not “improve” a reference design – match it  
-	Do not stop after one screenshot pass  
-	Do not use `transition -all` 
-	Do not use default Tailwind Blue/indigo as primary color  

