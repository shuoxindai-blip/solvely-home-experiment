import {
  WRITING_FILE_ACCEPT,
  WRITING_FILE_CAPABILITIES,
  WRITING_UNSUPPORTED_FILE_TOAST,
  isSupportedWritingFile,
  selectWritingFiles
} from './writingFilePolicy.js';

export function initHomeExperience({ onWorkspaceChange } = {}) {
    const icon = id => `<svg class="icon"><use href="#${id}"/></svg>`;
    const extensionTargets = {
      chrome: {
        label: 'Get the Chrome Extension',
        href: 'https://chromewebstore.google.com/detail/aedglnfjjccpifohekdeoogffomjcikm',
        viewBox: '0 0 24 24',
        icon: '<path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z"/>'
      },
      edge: {
        label: 'Get the Edge Extension',
        href: 'https://microsoftedge.microsoft.com/addons/detail/mmbhhcmacpojimkcgnkkfemajlfhdhoh',
        viewBox: '0 0 16 16',
        icon: '<path d="M9.482 9.341c-.069.062-.17.153-.17.309 0 .162.107.325.3.456.877.613 2.521.54 2.592.538h.002c.667 0 1.32-.18 1.894-.519A3.84 3.84 0 0 0 16 6.819c.018-1.316-.44-2.218-.666-2.664l-.04-.08C13.963 1.487 11.106 0 8 0A8 8 0 0 0 .473 5.29C1.488 4.048 3.183 3.262 5 3.262c2.83 0 5.01 1.885 5.01 4.797h-.004v.002c0 .338-.168.832-.487 1.244l.006-.006z"/><path d="M.01 7.753a8.14 8.14 0 0 0 .753 3.641 8 8 0 0 0 6.495 4.564 5 5 0 0 1-.785-.377h-.01l-.12-.075a5.5 5.5 0 0 1-1.56-1.463A5.543 5.543 0 0 1 6.81 5.8l.01-.004.025-.012c.208-.098.62-.292 1.167-.285q.194.001.384.033a4 4 0 0 0-.993-.698l-.01-.005C6.348 4.282 5.199 4.263 5 4.263c-2.44 0-4.824 1.634-4.99 3.49m10.263 7.912q.133-.04.265-.084-.153.047-.307.086z"/><path d="M10.228 15.667a5 5 0 0 0 .303-.086l.082-.025a8.02 8.02 0 0 0 4.162-3.3.25.25 0 0 0-.331-.35q-.322.168-.663.294a6.4 6.4 0 0 1-2.243.4c-2.957 0-5.532-2.031-5.532-4.644q.003-.203.046-.399a4.54 4.54 0 0 0-.46 5.898l.003.005c.315.441.707.821 1.158 1.121h.003l.144.09c.877.55 1.721 1.078 3.328.996"/>'
      }
    };

    function configureExtensionCta() {
      const override = new URLSearchParams(window.location.search).get('browser');
      const brands = (navigator.userAgentData?.brands || []).map(brand => brand.brand).join(' ');
      const isEdge = override === 'edge' || (override !== 'chrome' && (/Edg\//.test(navigator.userAgent) || /Microsoft Edge/i.test(brands)));
      const target = extensionTargets[isEdge ? 'edge' : 'chrome'];
      const cta = document.getElementById('extensionCta');
      const browserIcon = document.getElementById('extensionBrowserIcon');
      document.getElementById('extensionCtaLabel').textContent = target.label;
      document.getElementById('extensionEntry').setAttribute('aria-label', `Solvely ${isEdge ? 'Edge' : 'Chrome'} extension`);
      cta.href = target.href;
      cta.setAttribute('aria-label', target.label);
      browserIcon.setAttribute('viewBox', target.viewBox);
      browserIcon.innerHTML = target.icon;
    }

    function openHistoryDrawer() {
      document.body.classList.add('history-open');
      document.getElementById('historyEntry').setAttribute('aria-expanded', 'true');
      const drawer = document.getElementById('historyDrawer');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.inert = false;
      setTimeout(() => document.getElementById('historyDrawerClose').focus(), 80);
    }

    function closeHistoryDrawer(returnFocus = true) {
      document.body.classList.remove('history-open');
      document.getElementById('historyEntry').setAttribute('aria-expanded', 'false');
      const drawer = document.getElementById('historyDrawer');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.inert = true;
      if (returnFocus) document.getElementById('historyEntry').focus();
    }

    const capabilityData = {
      solver: {
        label: 'Solver', icon: 'i-solver', action: 'Solve',
        placeholder: 'Type or paste a problem to solve',
        description: 'Get a checked answer with a clear, step-by-step explanation.',
        examples: [
          { tag: 'Geometry', title: 'Step-by-step solution', dialogTitle: 'Solve for r in Parallelogram LMNO', description: 'Follow each angle relationship and algebra step to reach the checked answer.', prompt: 'Given the diagram of parallelogram LMNO, solve for r.', preview: 'solver-step-solution', simulator: 'assets/solver-samples/step-by-step-solution.html', embedMode: 'solver-document', cta: 'View solution' },
          { tag: 'Algebra', title: 'Interactive graph', dialogTitle: 'Parabola & Linear Intersection', description: 'Adjust both functions and track their intersection points.', prompt: 'Graph f(x) = −x² − x + 6 and g(x) = x + 6, then find their intersection points.', preview: 'solver-parabola-line', simulator: 'assets/simulators/parabola-linear-intersection.html', cta: 'Try graphing' },
          { tag: 'Chemistry', title: 'Structure visualization', description: 'Explore solved skeletal and Lewis structure examples.', prompt: 'Draw the skeletal structure of tyrosine.', preview: 'chemistry', simulator: 'assets/solver-samples/chemistry-structure-visualization.html', embedMode: 'chemistry-document', coverImage: 'assets/chemistry-structure.png', cta: 'Use this example', structures: [
            { title:'Tyrosine', question:'Draw the skeletal structure of tyrosine.', summary:'Tyrosine combines a para-hydroxyphenyl side chain with an α-amino acid backbone.', image:'assets/solver-samples/gallery-33-tyrosine.png', questionId:'2026_06_20_2a8e602c266626cb2c52', answerId:'2026_06_20_2a8e602c266626cb2c52#1781977652273', galleryId:'#33', facts:[['Molecular formula','C₉H₁₁NO₃'],['Class','Aromatic amino acid'],['Functional groups','Phenol · amine · carboxyl'],['Stereocenter','C-2 (α-carbon)']] },
            { title:'2,3-Diaminopropanoic acid', question:'Draw the skeletal structure of 2,3-diaminopropanoic acid.', summary:'A three-carbon amino acid with amino groups on both carbon 2 and carbon 3.', image:'assets/solver-samples/gallery-36-diaminopropanoic-acid.png', questionId:'2026_06_15_feceb2703259de408c5a', answerId:'2026_06_15_feceb2703259de408c5a#1781503092952', galleryId:'#36', facts:[['Molecular formula','C₃H₈N₂O₂'],['Amino groups','2'],['IUPAC name','2,3-diaminopropanoic acid'],['Functional groups','2 amines · carboxyl']] },
            { title:'Propionic acid Lewis structure', question:'Draw the Lewis structure of propionic acid.', summary:'The complete Lewis structure shows the CH₃CH₂COOH skeleton and both lone pairs on each oxygen.', image:'assets/solver-samples/gallery-32-propionic-acid-lewis.png', questionId:'2026_06_24_eba609a222da2846e5d4', answerId:'2026_06_24_eba609a222da2846e5d4#1782327492536', galleryId:'#32', facts:[['Molecular formula','C₃H₆O₂'],['Condensed formula','CH₃CH₂COOH'],['Valence electrons','30'],['Oxygen lone pairs','2 on each O']] }
          ] },
          { tag: 'Accounting', title: 'Financial analysis', dialogTitle: 'Vertical Analysis', description: 'Compare cost structure and margins between two companies.', prompt: 'Complete a vertical analysis comparing Voltix and Circuita. Voltix: revenue $500M, COGS $350M, and operating expenses $100M. Circuita: revenue $800M, COGS $480M, and operating expenses $240M. Determine which company manages production costs and overhead more efficiently.', preview: 'accounting', simulator: 'assets/solver-samples/financial-analysis.html', embedMode: 'accounting-document', cta: 'Use this example' }
        ]
      },
      graph: {
        label: 'Graph', icon: 'i-chart', action: 'Graph',
        placeholder: 'Enter an equation, function, table, or graphing question',
        description: 'Turn equations and data into interactive visual explanations.',
        examples: [
          { tag: 'Geometry', title: 'Reflection over y-axis', description: 'Adjust triangle vertices and track their reflected coordinates.', prompt: 'Reflect triangle PQR over the y-axis and write the coordinates of P′, Q′, and R′.', preview: 'graph-reflection', simulator: 'assets/simulators/reflection-over-y-axis.html' },
          { tag: 'Economics', title: 'Negative Externality & Pigouvian Tax', description: 'Compare private and social costs, then test the corrective tax.', prompt: 'Demand is Q = 1,200 − 4P and supply is Q = −240 + 2P. Marginal external damage is $12 per unit. Determine how many more units the free market produces than the social optimum and calculate the deadweight loss.', preview: 'graph-externality', simulator: 'assets/simulators/negative-externality-pigouvian-tax.html' },
          { tag: 'Calculus', title: 'Limits at infinity', description: 'Explore the squeeze theorem and the horizontal asymptote.', prompt: 'For f(x) = sin(2x) / x, find the limits as x approaches positive and negative infinity and identify all horizontal asymptotes.', preview: 'graph-limits', simulator: 'assets/simulators/limits-at-infinity.html' }
        ]
      },
      video: {
        label: 'Video', icon: 'i-play', action: 'Create video',
        placeholder: 'Describe the concept or problem you want explained as a video',
        description: 'Generate a short narrated walkthrough with diagrams and steps.',
        examples: [
          { tag: 'Physics', title: 'Velocity & Distance Analysis', description: 'Turn signed area under a velocity graph into total distance.', prompt: 'A car travels for 8 minutes with velocity shown on the graph. Find the total distance traveled, rounded to the nearest thousandth.', preview: 'video-physics', simulator: 'https://img.justsolvely.com/solvely-solve/html/2025_07_14_fd4e936d9081a1ec45b9g_1768557153773.html', embedMode: 'video-player' },
          { tag: 'Probability & Statistics', title: 'Reading a BMI Dotplot', description: 'Count observations, calculate a percentage, and compare estimates.', prompt: 'The dotplot shows BMI data for 146 people. How many have BMI greater than 40, what percentage is that, and how does it compare with 3%?', preview: 'video-statistics', simulator: 'https://img.justsolvely.com/solvely-solve/html/2026_01_10_dbd6a55ef31baa12ff35_1768795344086.html', embedMode: 'video-player' },
          { tag: 'Geometry', title: '3D Shapes & Nets', description: 'Unfold each solid and calculate its shaded face area.', prompt: 'Sketch a net for each 3D shape, then calculate the area of each shaded face.', preview: 'video-geometry', simulator: 'https://img.justsolvely.com/solvely-solve/html/2026_01_11_bc9d48edb87b30c11777_1768810149374.html', embedMode: 'video-player' }
        ]
      },
      flashcards: {
        label: 'Flashcards', icon: 'i-grid', action: 'Create cards',
        placeholder: 'Paste notes or upload materials to turn into flashcards',
        description: 'Build active-recall cards from the concepts that matter most.',
        examples: [
          {
            tag: 'Anatomy', title: 'Human Anatomy', description: 'Kidney structure, urine pathway, and renal blood flow.',
            prompt: 'Create flashcards about kidney structure and the urinary system.', preview: 'flashcards',
            cards: [
              { id:'85736937', front:'Kidney internal organization', back:'The kidney contains cortex, medulla, pyramids, papillae, and calyces draining to the pelvis.', image:'assets/flashcards/kidney-anatomy.webp', imageAlt:'Labeled cross-section showing the internal anatomy of the kidney' },
              { id:'85736930', front:'Urine pathway', back:'Urine passes from kidney → renal pelvis → ureter → bladder → urethra.' },
              { id:'85736936', front:'Renal blood flow', back:'Renal blood flow is 20 to 25 percent of cardiac output.' }
            ]
          },
          {
            tag: 'Physics', title: 'Gravitational Field', description: 'Gravitational fields, force, and satellite motion.',
            prompt: 'Create flashcards about gravitational fields, universal gravitation, and satellite motion.', preview: 'flashcards',
            cards: [
              { id:'85729678', front:'Radial gravitational field', back:'A radial field has lines directed inward toward the centre of the Earth.', image:'assets/flashcards/radial-gravitational-field.webp', imageAlt:'Earth surrounded by radial gravitational field lines pointing inward' },
              { id:'85729699', front:'Gravitational force formula', back:'The force between point masses is F = Gm₁m₂ / r².' },
              { id:'85729695', front:'Why satellites stay in orbit', back:'Satellites continuously fall toward Earth but have enough forward velocity to keep missing it.' }
            ]
          },
          {
            tag: 'Psychology', title: 'Biological Psychology', description: 'Movement planning, sequencing, and execution across the frontal lobe.',
            prompt: 'Create flashcards about the frontal lobe hierarchy for planning, sequencing, and executing movement.', preview: 'flashcards', deckId:'1707264', originalTitle:'Foundations of Biological Psychology and Neural Mechanisms',
            cards: [
              { id:'83227851', front:'Frontal lobe sequence hierarchy', back:'Prefrontal cortex plans movements, premotor cortex organizes sequences, and motor cortex executes actions.', image:'assets/flashcards/biological-psychology-motor-hierarchy.webp', imageAlt:'Numbered diagram showing the frontal lobe movement hierarchy from prefrontal planning to premotor sequencing and motor cortex execution' },
              { id:'83227847', front:'Prefrontal cortex role', back:'The prefrontal cortex plans behaviour and specifies the goal.' },
              { id:'83227848', front:'Premotor cortex role', back:'The premotor cortex coordinates body parts to produce movement sequences.' }
            ]
          }
        ]
      },
      quiz: {
        label: 'Quiz', icon: 'i-exam', action: 'Create quiz',
        placeholder: 'Enter a topic or upload notes to generate a quiz',
        description: 'Check understanding with adaptive questions and instant feedback.',
        examples: [
          {
            tag:'Biology', title:'Blood Glucose Negative Feedback', description:'Insulin, glucagon, and liver regulation.', preview:'quiz',
            dialogTitle:'Blood Glucose Negative Feedback', image:'assets/quizzes/blood-glucose-feedback.webp', imageAlt:'Diagram showing insulin and glucagon negative feedback control of blood glucose through the pancreas, liver, and tissue cells', imageMaxWidth:420,
            previewQuestion:'How is blood glucose controlled?',
            question:'Using the diagram, which statement best explains how the liver contributes to negative feedback control of blood glucose in both directions?',
            prompt:'Quiz me on how the liver contributes to negative feedback control of blood glucose in both directions.',
            options:[
              { key:'A', text:'The liver detects deviations in blood glucose and directly inhibits pancreatic hormone release.', correct:false, explanation:'The liver is an important effector organ, but it is not the control center that detects blood glucose changes and directly controls hormone release. The pancreas detects the change and releases insulin or glucagon.' },
              { key:'B', text:'The liver stores glucose as glycogen in response to insulin and breaks down glycogen in response to glucagon.', correct:true, explanation:'The diagram shows both directions of regulation: insulin stimulates the liver to convert glucose into glycogen when blood glucose is high, while glucagon stimulates glycogen breakdown when blood glucose is low.' },
              { key:'C', text:'The liver removes both insulin and glucagon from circulation to keep blood glucose constant.', correct:false, explanation:'The diagram does not show the liver maintaining blood glucose by removing insulin and glucagon. It shows the liver changing how glucose is stored or released in response to those hormones.' },
              { key:'D', text:'The liver secretes insulin during low blood sugar and glucagon during high blood sugar.', correct:false, explanation:'Insulin and glucagon are secreted by the pancreas, not the liver. The direction is also reversed: insulin is released during high blood sugar, while glucagon is released during low blood sugar.' }
            ],
            overallExplanation:'The liver is an effector in two opposing pathways. Insulin promotes glycogen formation and lowers blood glucose, while glucagon promotes glycogen breakdown and raises blood glucose. The pancreas acts as the control center by releasing the appropriate hormone.'
          },
          {
            tag:'Physics', title:'Refraction & Apparent Depth', description:'Why a fish appears shallower from above.', preview:'quiz',
            dialogTitle:'Refraction & Apparent Depth', image:'assets/quizzes/fish-apparent-depth.webp', imageAlt:'Diagram showing light rays refracting from a fish underwater toward an observer above the surface', imageMaxWidth:360,
            previewQuestion:'Why does the fish look shallow?',
            question:'A fish is viewed from above the water surface. In the diagram, the fish appears at a depth shallower than its real position. What best explains this apparent depth effect?',
            prompt:'Quiz me on why a fish appears shallower than its real position when viewed from above water.',
            options:[
              { key:'A', text:'Light from the fish slows down as it passes from water into air and refracts toward the normal.', correct:false, explanation:'When light travels from water into air, it enters a less optically dense medium and speeds up rather than slowing down. It bends away from the normal, not toward it.' },
              { key:'B', text:'Light from the fish stays in a straight line because its frequency remains unchanged.', correct:false, explanation:'The frequency remains unchanged at the boundary, but speed and wavelength change. Because its speed changes, the ray changes direction rather than continuing in a straight line.' },
              { key:'C', text:'Light from the fish reflects completely at the water surface and does not enter the air.', correct:false, explanation:'If the light were completely reflected, it would not reach the observer’s eyes and the fish could not be seen from above. The diagram shows light passing into the air.' },
              { key:'D', text:'Light from the fish speeds up as it passes from water into air and refracts away from the normal.', correct:true, explanation:'Light travels faster in air than in water and bends away from the normal. The observer traces the refracted rays backward, placing the fish’s virtual image closer to the surface than its real position.' }
            ],
            overallExplanation:'The fish appears shallower because of refraction at the water–air boundary. Light speeds up and bends away from the normal when moving from water to air, and the backward extensions of the refracted rays form a virtual image above the real fish.'
          },
          {
            tag:'Chemistry', title:'Ionic Crystal Lattice', description:'How opposite charges form an ordered solid.', preview:'quiz',
            dialogTitle:'Ionic Crystal Lattice', image:'assets/quizzes/ionic-crystal-lattice.webp', imageAlt:'Two-dimensional and three-dimensional diagrams of alternating sodium and chloride ions in a crystal lattice', imageMaxWidth:420,
            previewQuestion:'Why do ionic lattices form?',
            question:'Why do ionic compounds form a crystalline lattice?',
            prompt:'Quiz me on why ionic compounds form a crystalline lattice.',
            options:[
              { key:'A', text:'Shared electron pairs lock molecules into layers.', correct:false, explanation:'Shared electron pairs describe covalent bonding. Ionic compounds consist of positively and negatively charged ions rather than discrete molecules held together by shared electron pairs.' },
              { key:'B', text:'Metal cations and non-metal anions attract and organize into a 3D arrangement.', correct:true, explanation:'Metal atoms form positively charged cations and non-metal atoms form negatively charged anions. Electrostatic attraction organizes them into a regular three-dimensional lattice that maximizes attraction and minimizes repulsion.' },
              { key:'C', text:'Delocalized electrons pull all nuclei together into one large atom.', correct:false, explanation:'Delocalized electrons are characteristic of metallic bonding. An ionic lattice is stabilized by attraction between cations and anions, not by a shared sea of electrons.' },
              { key:'D', text:'Neutral atoms stack because they have full valence shells.', correct:false, explanation:'The particles in the diagram are charged ions, not neutral atoms. Full outer shells may help explain stability after electron transfer, but neutral atoms stacking does not explain the lattice.' }
            ],
            overallExplanation:'Ionic compounds form crystalline lattices because oppositely charged ions attract in every direction. Each cation is surrounded by anions and each anion by cations, producing a stable, ordered three-dimensional structure.'
          }
        ]
      },
      guide: {
        label: 'Study Guide', icon: 'i-book', action: 'Create study guide',
        placeholder: 'Add a topic or materials to organize into a study guide',
        description: 'Turn scattered material into a structured, reviewable guide.',
        examples: [
          {
            tag:'Genetics', title:'Mitochondrial DNA notes', description:'Repeat mutations, genomic imprinting, and mitochondrial inheritance.',
            prompt:'Create a study guide from my notes on repeat mutations, genomic imprinting, and mitochondrial inheritance.', preview:'guide',
            coverImage:'assets/study-guides/mitochondrial-dna/prader-willi-mechanisms.webp', coverAlt:'Prader–Willi syndrome mechanisms including deletion, maternal uniparental disomy, and a methylation defect',
            markdown:'assets/study-guides/mitochondrial-dna/study_guide.md',
            sections:[
              { title:'Stable and Dynamic Mutations', summary:'Understand why repeat variants can expand or contract during transmission and how slippage changes disease severity.', image:'assets/study-guides/mitochondrial-dna/repeat-replication.webp', alt:'Normal trinucleotide repeat replication diagram', bullets:['Stable mutations remain unchanged across generations, while dynamic mutations can expand or contract.','Forward slippage deletes a repeat unit; backward slippage inserts repeats and can cause expansion.','Anticipation describes earlier onset or greater severity after successive repeat expansions.'], terms:['Repeat disease','Strand slippage','Anticipation'] },
              { title:'Genomic Imprinting', summary:'Connect parent-of-origin expression with epigenetic methylation, imprint resetting, and disease risk.', image:'assets/study-guides/mitochondrial-dna/imprinting-reset.webp', alt:'Imprint erasure and sex-specific resetting diagram', bullets:['An imprinted allele is expressed according to whether it came from the mother or father.','Imprints are established during gametogenesis, maintained through replication, and reset in germ cells.','Loss of the functional paternal region on chromosome 15 can cause Prader–Willi syndrome.'], terms:['CpG methylation','Allele-specific expression','Prader–Willi'] },
              { title:'Maternal Mitochondrial Inheritance', summary:'Review mitochondrial genome structure, copy number, and why mitochondrial DNA is transmitted through the mother.', image:'assets/study-guides/mitochondrial-dna/maternal-inheritance.svg', alt:'Maternal mitochondrial DNA inheritance diagram', bullets:['The circular mitochondrial chromosome encodes 37 genes: 13 proteins, 2 rRNAs, and 22 tRNAs.','Each cell can contain thousands of mitochondrial genome copies across many mitochondria.','The sperm tail does not enter the ovum, so a child inherits mitochondrial DNA from the mother.'], terms:['mtDNA','Maternal inheritance','Heteroplasmy'] }
            ]
          },
          {
            tag:'Art History', title:'Unit 1 Prehistoric Art Study Guide', description:'Periods, landmark works, materials, and high-yield analysis terms.',
            prompt:'Create a study guide for Unit 1 Prehistoric Art with landmark works, materials, and analysis vocabulary.', preview:'guide',
            markdown:'assets/study-guides/prehistoric-art/study_guide.md',
            sections:[
              { title:'Prehistoric Art Context', summary:'Place Paleolithic, Mesolithic, and Neolithic art in a global context before written records.', image:'assets/study-guides/prehistoric-art/lascaux.webp', alt:'Great Hall of the Bulls at Lascaux', bullets:['Paleolithic art reflects hunter-gatherer life; Mesolithic societies were transitioning; Neolithic communities settled and farmed.','Carbon-14 dating and stratigraphy provide evidence when written records do not exist.','Prehistoric art appeared worldwide through ritual objects, ceramics, figurines, cave paintings, and sacred imagery.'], terms:['Paleolithic','Neolithic','Context'] },
              { title:'Major Works and Materials', summary:'Compare landmark works by location, date, material, technique, and possible ritual function.', image:'assets/study-guides/prehistoric-art/stonehenge.webp', alt:'Stonehenge prehistoric monument', bullets:['Lascaux and Tassili n’Ajjer demonstrate pigment-based rock painting and superimposed imagery.','Jade Cong, Stonehenge, the Ambum stone, and funerary steles use durable carved materials.','Ceramic traditions include the Susa beaker, Tlatilco figurines, and incised Lapita fragments.'], terms:['Megalith','Incised','Terra cotta'] },
              { title:'Key Concepts and Test Themes', summary:'Use form, function, content, and context to analyze prehistoric objects with appropriate vocabulary.', image:'assets/study-guides/prehistoric-art/terra-cotta.webp', alt:'Incised prehistoric terra cotta fragment', bullets:['Form, function, content, and context organize an art-historical interpretation.','Stonehenge combines megalithic construction, solar alignment, burial evidence, and ceremonial movement.','Interpretations remain provisional because meaning depends on archaeological context and comparison.'], terms:['Form','Function','Content','Context'] }
            ]
          },
          {
            tag:'Law', title:'Defining Crime & Criminal Justice', description:'Crime definitions, legal responsibility, data sources, and victimization.',
            prompt:'Create a law study guide covering definitions of crime, criminal responsibility, crime statistics, and victimization.', preview:'guide',
            markdown:'assets/study-guides/law-crime/study_guide.md',
            sections:[
              { title:'Defining Crime & Criminal Responsibility', summary:'Compare social and legal definitions of crime, then connect actus reus, mens rea, causation, concurrence, and punishment.', image:'assets/study-guides/law-crime/image_01.webp', alt:'Dark figure of crime diagram', bullets:['Social definitions depend on changing norms, while legal definitions focus on intentional penal-code violations.','A complete crime connects harm, legality, actus reus, mens rea, causation, concurrence, and punishment.','Defenses and excuses can reduce or remove criminal responsibility.'], terms:['Actus reus','Mens rea','Legality'] },
              { title:'Crime Statistics & the Dark Figure', summary:'Understand why official crime statistics miss some offenses and how accuracy changes from commission to imprisonment.', image:'assets/study-guides/law-crime/image_01.webp', alt:'Dark figure of crime diagram', bullets:['Undetected, unreported, and unrecorded crime creates the dark figure.','Crime indexes become less accurate farther from the original offense.','Rates make comparisons more meaningful across populations and time.'], terms:['Dark figure','Crime rate','Crime index'] },
              { title:'Official Data, Victims & Consequences', summary:'Compare UCR, NIBRS, NCVS, and self-report surveys while reviewing crime rates, victimization, and social costs.', image:'assets/study-guides/law-crime/image_02.webp', alt:'Violent and property crime rates chart', bullets:['UCR and NIBRS use law-enforcement data; NCVS uses victim interviews.','Different sources capture different slices of crime and produce different totals.','Victimization creates direct economic loss, broader social cost, and lasting fear.'], terms:['UCR','NIBRS','NCVS'] }
            ]
          }
        ]
      },
      podcast: {
        label: 'Podcast', icon: 'i-mic', action: 'Create podcast',
        placeholder: 'Enter a topic or upload materials for an audio lesson',
        description: 'Listen to a conversational lesson generated from your materials.',
        examples: [
          { tag:'Math', title:'Defining and Calculating Unit Rates', description:'Compare prices, speeds, and ratios with unit rates.', prompt:'Create a conversational podcast explaining how to define and calculate unit rates.', preview:'podcast', theme:'math', duration:'2:48', durationSeconds:167.962, platform:'iOS', language:'English', podcastId:'76608', deckId:'1743856', speakers:['Lexie','Noah'], speakerAvatars:['assets/podcasts/hosts/lexie.webp','assets/podcasts/hosts/noah.webp'], audio:'assets/podcasts/01_defining_and_calculating_unit_rates.mp3', transcriptKey:'unitRates', topics:['Unit-rate definition','Denominator of 1','Price and speed comparisons','Everyday budgeting'] },
          { tag:'Biology', title:'Photosynthesis: Crash Course Biology #8', description:'Follow light energy from chloroplasts to glucose.', prompt:'Create a conversational podcast explaining photosynthesis from light capture through the Calvin Cycle.', preview:'podcast', theme:'biology', duration:'3:25', durationSeconds:205.339, platform:'Web', language:'English', podcastId:'76598', deckId:'1743820', speakers:['Cardi C','Lexie'], speakerAvatars:['assets/podcasts/hosts/cardi-c.webp','assets/podcasts/hosts/lexie.webp'], audio:'assets/podcasts/02_photosynthesis_crash_course_biology_8.mp3', transcriptKey:'photosynthesis', topics:['Chloroplasts and thylakoids','Photosystem II','ATP Synthase','Calvin Cycle and G3P'] },
          { tag:'History', title:'Foundations of Early Human Civilization', description:'How farming, writing, and institutions built civilization.', prompt:'Create a conversational podcast about the foundations of early human civilization.', preview:'podcast', theme:'history', duration:'2:40', durationSeconds:159.634, platform:'Web', language:'English', podcastId:'76600', deckId:'1743875', speakers:['David Duck','Cardi C'], speakerAvatars:['assets/podcasts/hosts/david-duck.webp','assets/podcasts/hosts/cardi-c.webp'], audio:'assets/podcasts/03_foundations_of_early_human_civilization.mp3', transcriptKey:'civilization', topics:['Neolithic Revolution','Agriculture and settlement','Writing and recordkeeping','City-states, empires, and dynasties'] }
        ]
      },
      mock: {
        label: 'Exam Prep', icon: 'i-target', action: 'Create plan',
        placeholder: 'Choose an exam or describe what you are preparing for',
        description: 'Plan, practice, and track your exam progress.',
        examples: [
          { tag: 'Plan', title: 'Daily study plan', description: 'A focused schedule that adapts to your exam date.', prompt: 'Build a daily study plan for my upcoming exam.', preview: 'exam-plan', cta: 'View my plan' },
          { tag: 'Review', title: 'Core topics', description: 'See readiness and prioritize weak topics.', prompt: 'Review my core exam topics and identify the biggest gaps.', preview: 'exam-review', cta: 'Review topics' },
          { tag: 'Practice', title: 'Mock exams', description: 'Timed sections with performance scoring.', prompt: 'Create a timed full-length mock exam with score insights.', preview: 'exam-mock', cta: 'Take a mock exam' },
          { tag: 'Assess', title: 'Progress tracking', description: 'Follow score trends and projected readiness.', prompt: 'Create an exam readiness and score progress tracker.', preview: 'exam-progress', cta: 'Track progress' }
        ]
      },
      essay: {
        label: 'Essay Writer', icon: 'i-file', action: 'Start writing',
        placeholder: 'Describe your essay topic, assignment, or argument',
        description: 'Build a clear thesis, outline, and polished draft from one prompt.',
        examples: [
          { tag: 'Argument', title: 'Climate policy essay', description: 'Develop a position with evidence and counterarguments.', prompt: 'Write an argumentative essay outline about carbon pricing policies.', preview: 'guide' },
          { tag: 'Literature', title: 'Character analysis', description: 'Turn textual evidence into a focused interpretation.', prompt: 'Help me write a character analysis of Lady Macbeth with a strong thesis.', preview: 'guide' },
          { tag: 'Personal', title: 'College application story', description: 'Shape an authentic narrative with a memorable arc.', prompt: 'Help me outline a college essay about learning resilience through a team project.', preview: 'guide' }
        ]
      },
      rewrite: {
        label: 'Rewrite', icon: 'i-wand', action: 'Rewrite',
        placeholder: 'Paste text to improve its clarity, tone, or structure',
        description: 'Rewrite existing text while preserving meaning and your preferred voice.',
        examples: [
          { tag: 'Clarity', title: 'Simplify a dense paragraph', description: 'Make complex writing direct and readable.', prompt: 'Rewrite this academic paragraph in clear, concise language.', preview: 'guide' },
          { tag: 'Tone', title: 'Make an email professional', description: 'Improve confidence, warmth, and precision.', prompt: 'Rewrite my email in a concise and professional tone.', preview: 'guide' },
          { tag: 'Style', title: 'Strengthen an introduction', description: 'Create a sharper hook and logical flow.', prompt: 'Rewrite my essay introduction with a stronger hook and thesis transition.', preview: 'guide' }
        ]
      },
      grammar: {
        label: 'Grammar', icon: 'i-exam', action: 'Check grammar',
        placeholder: 'Paste writing to check grammar, spelling, and punctuation',
        description: 'Find errors, explain the rule, and suggest a corrected version.',
        examples: [
          { tag: 'Editing', title: 'Fix grammar and punctuation', description: 'Review every correction with a short explanation.', prompt: 'Check this paragraph for grammar and punctuation, then explain each correction.', preview: 'quiz' },
          { tag: 'Academic', title: 'Improve sentence structure', description: 'Repair fragments, run-ons, and unclear clauses.', prompt: 'Check my academic writing for sentence structure and clarity issues.', preview: 'quiz' },
          { tag: 'English', title: 'Practice common mistakes', description: 'Learn from targeted examples and feedback.', prompt: 'Create a short grammar practice set based on common ESL writing mistakes.', preview: 'quiz' }
        ]
      },
      citation: {
        label: 'Citations', icon: 'i-book', action: 'Create citations',
        placeholder: 'Paste a source link, title, DOI, or publication details',
        description: 'Format sources consistently and build a clean bibliography.',
        examples: [
          { tag: 'APA', title: 'Format an APA source', description: 'Generate an in-text citation and reference entry.', prompt: 'Create an APA 7 citation for my source and show the correct in-text format.', preview: 'guide' },
          { tag: 'MLA', title: 'Build an MLA bibliography', description: 'Turn source details into Works Cited entries.', prompt: 'Format these sources as an MLA 9 Works Cited list.', preview: 'guide' },
          { tag: 'Chicago', title: 'Create footnotes', description: 'Produce notes and bibliography formatting.', prompt: 'Convert my source details into Chicago notes and bibliography style.', preview: 'guide' }
        ]
      }
    };

    const writingToolData = {
      research: { label:'Research', icon:'i-search', action:'Search', placeholder:'Enter your topic, research question, or assignment prompt to start searching for credible sources.', description:'Run AI research to see a structured result here.', examples:[] },
      paraphraser: { label:'Paraphraser', icon:'i-edit', action:'Paraphrase', placeholder:'Paste text to rewrite while preserving its meaning', description:'Rewrite text with clearer phrasing while preserving its meaning.', examples:[] },
      plagiarism: { label:'Plagiarism Checker', icon:'i-search', action:'Scan for plagiarism', placeholder:'Paste text to scan for possible matching sources', description:'Check text for possible matching passages and sources.', examples:[] },
      detector: { label:'Detector', icon:'i-exam', action:'Check for AI', placeholder:'Paste text to check whether it may be AI-generated', description:'Run AI detection to see the analysis here.', examples:[] },
      aiCitation: { label:'Citation', icon:'i-book', action:'Generate citation', placeholder:'Enter a URL, page title, DOI, or keywords', description:'Generate a formatted citation and in-text reference.', examples:[] },
      humanizer: { label:'Humanizer', icon:'i-wand', action:'Humanize', placeholder:'Paste AI-generated text to make it sound more natural', description:'Humanize your text to see the result here.', examples:[] }
    };
    Object.assign(capabilityData, writingToolData);

    const researchSuggestions = [
      { label:'Topic', icon:'i-search', prompt:'Educational data science in higher education' },
      { label:'Assignment', icon:'i-book', prompt:'Write a literature review examining the relationship between social media use and student wellbeing.' },
      { label:'Question', icon:'i-chat', prompt:'How does sleep paralysis affect mental wellbeing?' }
    ];

    const examCoursePackages = [
      {family:'sat',label:'SAT',title:'SAT Prep 2026',topics:'100+',videos:'100+',questions:'4,800+',search:'digital college admissions math reading writing'},
      {family:'act',label:'ACT',title:'ACT Prep 2026',topics:'230+',videos:'230+',questions:'6,600+',search:'college admissions english math reading science'},
      {family:'ap',label:'AP',title:'AP Calculus AB',topics:'42+',videos:'42+',questions:'1,200+',search:'advanced placement math calculus'},
      {family:'ap',label:'AP',title:'AP Biology',topics:'55+',videos:'55+',questions:'1,600+',search:'advanced placement biology science'},
      {family:'ap',label:'AP',title:'AP United States History',topics:'45+',videos:'45+',questions:'1,400+',search:'advanced placement us history'},
      {family:'ap',label:'AP',title:'AP World History: Modern',topics:'42+',videos:'42+',questions:'1,300+',search:'advanced placement world history modern'},
      {family:'ap',label:'AP',title:'AP Psychology',topics:'40+',videos:'40+',questions:'1,200+',search:'advanced placement psychology'},
      {family:'ap',label:'AP',title:'AP Chemistry',topics:'50+',videos:'50+',questions:'1,500+',search:'advanced placement chemistry science'},
      {family:'ap',label:'AP',title:'AP Statistics',topics:'38+',videos:'38+',questions:'1,100+',search:'advanced placement statistics math data'},
      {family:'ap',label:'AP',title:'AP Human Geography',topics:'35+',videos:'35+',questions:'1,000+',search:'advanced placement human geography'},
      {family:'ap',label:'AP',title:'AP English Language and Composition',topics:'32+',videos:'32+',questions:'900+',search:'advanced placement english language composition'},
      {family:'ap',label:'AP',title:'AP Computer Science A',topics:'40+',videos:'40+',questions:'1,000+',search:'advanced placement computer science programming'},
      {family:'abitur',label:'ABITUR',title:'Abitur Deutsch',topics:'26',videos:'26',questions:'1,100+',search:'german deutsch germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Mathematik',topics:'32',videos:'32',questions:'1,200+',search:'german mathematik mathematics math germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Englisch',topics:'24',videos:'24',questions:'950+',search:'german englisch english germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Französisch',topics:'21',videos:'21',questions:'850+',search:'german french französisch germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Biologie',topics:'25',videos:'25',questions:'1,100+',search:'german biology biologie germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Chemie',topics:'22',videos:'22',questions:'950+',search:'german chemistry chemie germany'},
      {family:'abitur',label:'ABITUR',title:'Abitur Physik',topics:'20',videos:'20',questions:'850+',search:'german physics physik germany'}
    ];
    const diagnosticScoreOptions = {
      sat: ['1000','1100','1200','1300','1400','1500','1550+'],
      act: ['20','24','28','30','32','34','36'],
      ap: ['3','4','5'],
      abitur: ['6','8','10','12','13','14','15']
    };
    let diagnosticPreviewView = 'score';
    let diagnosticTopicFilter = 'all';
    let diagnosticQuestionFilter = 'all';

    const diagnosticQuestionSamples = [
      {status:'incorrect',type:'Multiple choice',title:'Which expression is equivalent to (x + 3)(x − 3)?',choices:['x² − 6x + 9','x² − 9','x² + 9','x² + 6x − 9'],selected:0,correct:1,explanation:'This is a difference of squares: (a + b)(a − b) = a² − b², so the equivalent expression is x² − 9.'},
      {status:'correct',type:'Multiple choice',title:'Which transition best signals a contrast with the previous sentence?',choices:['Therefore','For example','However','Similarly'],selected:2,correct:2,explanation:'“However” introduces a contrast, which matches the relationship between the two ideas.'}
    ];

    function diagnosticPreviewProfile(course) {
      if (course.family === 'sat') return {
        exam:'SAT® Prep 2026', total:'1350', scale:'/1600', range:'1310–1390', average:'1050', percentile:'90th percentile',
        sections:[['Reading & Writing','640','/800','Range 610–670'],['Mathematics','710','/800','Range 680–740']],
        overview:'Reading & Writing is your stronger section. Focus next on Advanced Math and Standard English Conventions.',
        skills:[['Reading & Writing','640 / 800',[['Information and Ideas',3],['Craft and Structure',2],['Expression of Ideas',3],['Standard English Conventions',2]]],['Mathematics','710 / 800',[['Algebra',4],['Advanced Math',2],['Problem-Solving & Data Analysis',3],['Geometry and Trigonometry',3]]]],
        topics:[['Advanced Math','92% · Core','core','Nonlinear equations, equivalent expressions, and functions.','Review','MATHEMATICS'],['Standard English Conventions','89% · Likely','likely','Sentence boundaries, punctuation, and agreement.','Continue','READING & WRITING'],['Problem-Solving & Data Analysis','78% · Possible','possible','Ratios, percentages, tables, and scatterplots.','Practice','MATHEMATICS']]
      };
      if (course.family === 'act') return {
        exam:'ACT Prep 2026', total:'29', scale:'/36', range:'28–30', average:'20.7', percentile:'91st percentile',
        sections:[['English','30','/36','Range 29–32'],['Mathematics','27','/36','Range 25–29'],['Science','28','/36','Range 27–30'],['Reading','31','/36','Range 30–32']],
        overview:'English is your stronger section. Prioritize functions, modeling, and multi-step mathematics under time pressure.',
        skills:[['STEM','27 / 36',[['Algebra',2],['Functions',3],['Geometry',2],['Statistics & Probability',3]]],['LANGUAGE','30 / 36',[['Production of Writing',4],['Knowledge of Language',3],['Conventions of English',4],['Integration of Knowledge',3]]]],
        topics:[['Functions & Modeling','93% · Core','core','Interpret functions, models, and multi-step relationships.','Review','MATHEMATICS'],['Integrating Essential Skills','87% · Likely','likely','Combine number, algebra, and geometry skills efficiently.','Continue','MATHEMATICS'],['Production of Writing','78% · Possible','possible','Organization, cohesion, and precise word choice.','Practice','ENGLISH']]
      };
      if (course.family === 'ap') {
        let topics = [['Core concepts & applications','91% · Core','core','Apply essential concepts across unfamiliar contexts.','Review','CORE CONTENT'],['Evidence-based reasoning','86% · Likely','likely','Connect claims, evidence, and defensible reasoning.','Continue','SKILLS'],['Timed free response','79% · Possible','possible','Plan and complete responses under exam timing.','Practice','FREE RESPONSE']];
        if (course.title.includes('Calculus')) topics = [['Applications of Derivatives','94% · Core','core','Analyze motion, rates, extrema, and optimization.','Review','UNIT 5'],['Integration Techniques','88% · Likely','likely','Choose and apply appropriate integration methods.','Continue','UNIT 6'],['Differential Equations','81% · Possible','possible','Model change with separable differential equations.','Practice','UNIT 7']];
        else if (course.title.includes('Biology')) topics = [['Cellular Energetics','93% · Core','core','Photosynthesis, respiration, and energy coupling.','Review','UNIT 3'],['Gene Expression','86% · Likely','likely','Transcription, translation, and gene regulation.','Continue','UNIT 6'],['Natural Selection','80% · Possible','possible','Connect variation, selection, and population change.','Practice','UNIT 7']];
        else if (course.title.includes('History')) topics = [['Contextualization','92% · Core','core','Situate developments in broader historical context.','Review','HISTORICAL REASONING'],['Evidence in DBQs','87% · Likely','likely','Use documents and outside evidence to support claims.','Continue','DOCUMENT ANALYSIS'],['Causation & Continuity','79% · Possible','possible','Explain causes, effects, change, and continuity.','Practice','HISTORICAL REASONING']];
        return {
          reportType:'ap', exam:course.title.replace(/^AP /,'AP® '), total:'4', scale:'/5', percentile:'70th percentile',
          overviewTitle:'AP overview ✦', overviewHeadline:'Your highest-impact next step',
          overview:'Your score shows strong command of the core concepts. Focus next on free-response precision and applying concepts in unfamiliar contexts.',
          skills:[['CONTENT','Strong',[['Foundational knowledge',4],['Concept application',3],['Data interpretation',3],['Cross-topic connections',2]]],['REASONING','Developing',[['Claim development',3],['Evidence selection',2],['Explanation',3],['Time management',2]]]], topics
        };
      }
      return {
        reportType:'abitur', exam:course.title, total:'13', scale:'/15', hitRate:'87%', rating:'Sehr gut',
        overviewTitle:'Abitur-Übersicht ✦', overviewHeadline:'Ihre nächsten Schwerpunkte',
        overview:'Um beim nächsten Mal die volle Punktzahl (15/15) zu erreichen, sollten Sie sich auf folgende Bereiche konzentrieren:',
        overviewBullets:['Höhere Mathematik: quadratische Gleichungen und Wahrscheinlichkeitsrechnung weiter vertiefen.','Englische Standardkonventionen: Zeichensetzung und komplexe Satzstrukturen gezielt üben.'],
        skills:[['SCHRIFTLICHE PRÜFUNG','13 / 15',[['Grundwissen',4],['Transferaufgaben',3],['Begründungen',3],['Darstellung',4]]]],
        topics:[['Transferaufgaben','92% · Core','core','Bekannte Konzepte auf neue Aufgaben übertragen.','Review','SCHRIFTLICH'],['Begründungen & Lösungswege','86% · Likely','likely','Lösungswege präzise und nachvollziehbar erklären.','Continue','SCHRIFTLICH'],['Prüfungstempo','78% · Possible','possible','Aufgaben sicher unter Zeitdruck bearbeiten.','Practice','PRÜFUNGSSTRATEGIE']]
      };
    }

    function diagnosticSkillMeter(level) {
      return `<span class="diag-skill-meter" aria-label="${level} of 5 mastery">${[1,2,3,4,5].map(value => `<i class="${value <= level ? 'active' : ''}"></i>`).join('')}</span>`;
    }

    function diagnosticScoreCardMarkup(profile) {
      if (profile.reportType === 'ap') return `<section class="diag-score-card" aria-label="${profile.exam} score summary"><div class="diag-score-banner"><strong>${profile.exam}</strong><span>SAMPLE RESULT</span></div><div class="diag-ap-score-body"><span class="diag-ap-percentile">${profile.percentile}</span><div class="diag-ap-score-ring"><span>Your score</span><strong>${profile.total}</strong></div></div></section>`;
      if (profile.reportType === 'abitur') return `<section class="diag-score-card" aria-label="${profile.exam} Ergebnis"><div class="diag-abitur-score-body"><span class="diag-abitur-course">${profile.exam} · Schriftliche Prüfung</span><span class="diag-score-label">Gesamtpunktzahl</span><div class="diag-abitur-score-row"><div class="diag-abitur-total"><strong>${profile.total}</strong><em>${profile.scale}</em></div><span class="diag-abitur-rating">${profile.rating}</span></div><div class="diag-abitur-progress" aria-label="${profile.hitRate} Trefferquote"><i></i></div><span class="diag-abitur-hit-rate">${profile.hitRate} Trefferquote</span></div></section>`;
      return `<section class="diag-score-card" aria-label="${profile.exam} score summary"><div class="diag-score-banner"><strong>${profile.exam}</strong><span>SAMPLE RESULT</span></div><div class="diag-score-body"><span class="diag-score-label">Total score</span><div class="diag-total-row"><div class="diag-total-score"><strong>${profile.total}</strong><em>${profile.scale}</em></div><div class="diag-total-meta">Score range: ${profile.range}<br>Average: ${profile.average}<br><b>${profile.percentile}</b></div></div><div class="diag-section-list">${profile.sections.map(section => `<div class="diag-section-score"><span>${section[0]}</span><strong>${section[1]}</strong><em>${section[2]}</em><small>${section[3]}</small></div>`).join('')}</div></div></section>`;
    }

    function renderDiagnosticPreview(course) {
      const profile = diagnosticPreviewProfile(course);
      const topicFilters = ['all','core','likely','possible'];
      const filteredTopics = profile.topics.filter(topic => diagnosticTopicFilter === 'all' || topic[2] === diagnosticTopicFilter);
      const topicSections = [...new Set(filteredTopics.map(topic => topic[5]))];
      const visibleQuestions = diagnosticQuestionSamples.filter(question => diagnosticQuestionFilter === 'all' || question.status === diagnosticQuestionFilter);
      const scoreActive = diagnosticPreviewView === 'score';
      const isAbitur = course.family === 'abitur';
      const scoreTabLabel = isAbitur ? 'Ergebnis' : 'Score Report';
      const questionTabLabel = isAbitur ? 'Lösungen' : 'Question Review';
      const practiceTabLabel = isAbitur ? 'Gezieltes Üben' : 'Focused Practice';
      const overviewList = profile.overviewBullets ? `<ul>${profile.overviewBullets.map(item => `<li>${item}</li>`).join('')}</ul>` : '';
      const reportValueLabels = profile.reportType === 'ap' ? ['AP score','Percentile','Skill feedback'] : profile.reportType === 'abitur' ? ['Schriftliche Prüfung','Trefferquote','Lernempfehlungen'] : ['Predicted score','Section breakdown','Skill mastery'];
      document.getElementById('diagnosticPreviewPane').innerHTML = `
        <div class="diagnostic-preview-head"><div><span>What you’ll get</span><strong>Interactive sample report</strong></div><div class="diag-report-tabs" role="tablist" aria-label="Sample report views"><button class="diag-report-tab${scoreActive ? ' active' : ''}" type="button" role="tab" aria-selected="${scoreActive}" data-diagnostic-preview-view="score">${scoreTabLabel}</button><button class="diag-report-tab${diagnosticPreviewView === 'questions' ? ' active' : ''}" type="button" role="tab" aria-selected="${diagnosticPreviewView === 'questions'}" data-diagnostic-preview-view="questions">${questionTabLabel}</button><button class="diag-report-tab${diagnosticPreviewView === 'topics' ? ' active' : ''}" type="button" role="tab" aria-selected="${diagnosticPreviewView === 'topics'}" data-diagnostic-preview-view="topics">${practiceTabLabel}</button></div></div>
        <section class="diag-report-screen" data-diagnostic-screen="score"${diagnosticPreviewView !== 'score' ? ' hidden' : ''}>
          <div class="diag-report-score-grid">
            <div class="diag-report-column">
              ${diagnosticScoreCardMarkup(profile)}
              <section class="diag-ai-card"><span class="diag-card-kicker">${profile.overviewTitle || `${course.label} overview ✦`}</span><strong>${profile.overviewHeadline || 'Your highest-impact next step'}</strong><p>${profile.overview}</p>${overviewList}</section>
            </div>
            <section class="diag-skills-card"><div class="diag-card-head"><div><strong>${isAbitur ? 'Kenntnisse & Fähigkeiten' : 'Knowledge & Skills'}</strong><br><span>${isAbitur ? 'Leistung in den geprüften Bereichen' : 'Performance across tested domains'}</span></div><span>${isAbitur ? 'Fortschritt' : 'Mastery'}</span></div>${profile.skills.map(group => `<div class="diag-skill-group"><div class="diag-skill-group-head"><span>${group[0]}</span><b>${group[1]}</b></div>${group[2].map(skill => `<div class="diag-skill-row"><span>${skill[0]}</span>${diagnosticSkillMeter(skill[1])}</div>`).join('')}</div>`).join('')}</section>
          </div>
          <div class="diagnostic-preview-value">${reportValueLabels.map(label => `<span>${label}</span>`).join('')}</div>
        </section>
        <section class="diag-report-screen" data-diagnostic-screen="topics"${diagnosticPreviewView !== 'topics' ? ' hidden' : ''}>
          <div class="diag-card-head"><div><strong>Topics to Improve</strong><br><span>Ranked by exam importance and current progress</span></div><span>${filteredTopics.length} topics</span></div>
          <div class="diag-topics-toolbar">${topicFilters.map(filter => `<button class="diag-filter-chip${diagnosticTopicFilter === filter ? ' active' : ''}" type="button" data-diagnostic-topic-filter="${filter}">${filter[0].toUpperCase() + filter.slice(1)}</button>`).join('')}</div>
          ${topicSections.map(section => `<section class="diag-topics-section"><h4>${section}</h4>${filteredTopics.filter(topic => topic[5] === section).map(topic => `<article class="diag-topic-row"><div class="diag-topic-copy"><strong>${topic[0]}</strong><span>${topic[3]}</span><b class="${topic[2]}">${topic[1]}</b></div><button class="diag-topic-action" type="button" data-diagnostic-topic-action="${topic[4]} ${topic[0]}">${topic[4]} ›</button></article>`).join('')}</section>`).join('')}
        </section>
        <section class="diag-report-screen" data-diagnostic-screen="questions"${diagnosticPreviewView !== 'questions' ? ' hidden' : ''}>
          <div class="diag-question-filter">${['all','incorrect','correct'].map(filter => `<button class="diag-filter-chip${diagnosticQuestionFilter === filter ? ' active' : ''}" type="button" data-diagnostic-question-filter="${filter}">${filter === 'all' ? 'All Questions' : filter[0].toUpperCase() + filter.slice(1)} (${diagnosticQuestionSamples.filter(item => filter === 'all' || item.status === filter).length})</button>`).join('')}</div>
          <div class="diag-report-column">${visibleQuestions.map((question,index) => `<article class="diag-question-card"><div class="diag-question-meta"><span>${question.type}</span><span>${index + 1}/${visibleQuestions.length}</span></div><h4>${question.title}</h4>${question.choices.map((choice,choiceIndex) => `<div class="diag-answer-choice${choiceIndex === question.correct ? ' correct' : choiceIndex === question.selected ? ' selected-wrong' : ''}"><i></i><span>${String.fromCharCode(65 + choiceIndex)}. ${choice}</span></div>`).join('')}<div class="diag-answer-note"><strong>${question.status === 'correct' ? 'Correct' : 'Explanation'}</strong>${question.explanation}</div></article>`).join('')}</div>
        </section>`;

      document.querySelectorAll('[data-diagnostic-preview-view]').forEach(button => button.addEventListener('click', () => { diagnosticPreviewView = button.dataset.diagnosticPreviewView; renderDiagnosticPreview(course); }));
      document.querySelectorAll('[data-diagnostic-topic-filter]').forEach(button => button.addEventListener('click', () => { diagnosticTopicFilter = button.dataset.diagnosticTopicFilter; renderDiagnosticPreview(course); }));
      document.querySelectorAll('[data-diagnostic-question-filter]').forEach(button => button.addEventListener('click', () => { diagnosticQuestionFilter = button.dataset.diagnosticQuestionFilter; renderDiagnosticPreview(course); }));
      document.querySelectorAll('[data-diagnostic-topic-action]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.diagnosticTopicAction + ' opened')));
    }

    const capabilityGroups = {
      study: ['solver', 'graph', 'video', 'flashcards', 'quiz', 'guide', 'podcast'],
      exam: ['mock'],
      writing: ['research', 'paraphraser', 'plagiarism', 'detector', 'aiCitation', 'humanizer']
    };
    const writingWordLimitedCapabilities = new Set(['humanizer', 'detector', 'paraphraser']);
    const writingMinimumWordCapabilities = new Set(['humanizer', 'detector', 'paraphraser', 'plagiarism']);
    const writingWordCountCapabilities = new Set(['research', 'paraphraser', 'plagiarism', 'detector', 'humanizer']);
    const writingWordLimit = 4000;
    const writingMinimumWords = 30;
    const writingCharacterLimit = 300;
    const writingWordLimitToast = 'You can enter up to 4,000 words. Extra pasted text was removed.';
    const writingMinimumWordsToast = 'Please enter at least 30 words.';
    const citationCharacterLimitToast = 'Source input is limited to 300 characters.';
    const researchCharacterLimitToast = 'Only the first 300 characters were searched - shorten your query for better results.';
    const paraphraserCustomInstructionToast = 'Please enter a custom instruction';
    let selectedCitationFormat = 'APA 7th';
    let selectedCitationSourceType = 'Website';
    const multiSourceCapabilities = new Set(['flashcards', 'quiz', 'guide', 'podcast', 'mock']);
    const creationSourceLimit = 10;
    const creationSourceLimitToast = 'You can add up to 10 sources to each creation.';
    const problemSourceLimitToast = 'You can upload either one document or up to 5 images per problem.';
    let workspaceMode = 'study';
    const app = document.getElementById('solvelyApp');
    const sidebar = document.querySelector('.sidebar');
    const capabilityStrip = document.getElementById('capabilityStrip');
    const promptInput = document.getElementById('promptInput');
    const homeWorkspace = document.getElementById('homeWorkspace');
    const courseWorkspace = document.getElementById('courseWorkspace');
    const examPredictorWorkspace = document.getElementById('examPredictorWorkspace');
    const predictorTopicsList = document.getElementById('predictorTopicsList');
    const coursePackagePanel = document.getElementById('coursePackagePanel');
    const sendButton = document.getElementById('sendButton');
    const sendLabel = document.getElementById('sendLabel');
    const writingWordCount = document.getElementById('writingWordCount');
    const citationSelectors = document.getElementById('citationSelectors');
    const examplesGrid = document.getElementById('examplesGrid');
    const examplesHeading = document.getElementById('examplesHeading');
    const examplesTitle = document.getElementById('examplesTitle');
    const examplesDescription = document.getElementById('examplesDescription');
    const multiModelProof = document.getElementById('multiModelProof');
    const attachmentRow = document.getElementById('attachmentRow');
    const calculatorPanel = document.getElementById('calculatorPanel');
    const linkPopover = document.getElementById('linkPopover');
    const linkInput = document.getElementById('linkInput');
    const writingEditor = document.getElementById('writingEditor');
    const writingActionButton = document.getElementById('writingActionButton');
    const writingResultContent = document.getElementById('writingResultContent');
    const researchInput = document.getElementById('researchInput');
    const researchActionButton = document.getElementById('researchActionButton');
    const researchResultContent = document.getElementById('researchResultContent');
    const workspaceStatus = document.getElementById('workspaceStatus');
    const toast = document.getElementById('toast');
    const dialog = document.getElementById('exampleDialog');
    const cropDialog = document.getElementById('cropDialog');
    const cropStage = document.getElementById('cropStage');
    const cropImageFrame = document.getElementById('cropImageFrame');
    const cropEditorImage = document.getElementById('cropEditorImage');
    const cropSelection = document.getElementById('cropSelection');
    const cropThumbnails = document.getElementById('cropThumbnails');
    const cropDone = document.getElementById('cropDone');
    let selectedCapability = null;
    let toastTimer;
    let dragDepth = 0;
    let calcExpression = '';
    let geogebraApplet = null;
    let geogebraApi = null;
    let geogebraInitPromise = null;
    let calculatorRestorePosition = null;
    let mediaTimer = null;
    let cropImageChips = [];
    let activeCropIndex = 0;
    let cropWorkingStates = new Map();
    let cropGesture = null;
    let activeCoursePackageIndex = null;
    let activeCoursePackageTab = 'overview';
    let studyPriorityFilter = 'all';
    let studySectionFilter = 'all';
    let collapsedStudySections = new Set();
    let mockExamPreviewState = 'continue';
    let courseMockSessionOpen = false;
    let courseQuestionIndex = 0;
    let courseAnswers = {0:2,2:1};
    let courseResultsFilter = 'all';
    let activeExamPredictorFeatureIndex = 0;

    function graphPreview() {
      return `<div class="example-preview preview-graph"><svg viewBox="0 0 320 104" role="img" aria-label="Parabola graph"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="var(--line)" stroke-width="1"/></pattern></defs><rect width="320" height="104" fill="url(#grid)"/><path d="M18 76H305M150 7V96" stroke="var(--line-strong)" stroke-width="1.2"/><path d="M58 17 C92 92 119 94 151 53 S212 19 268 83" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/><g fill="var(--surface)" stroke="var(--accent)" stroke-width="2"><circle cx="89" cy="76" r="4"/><circle cx="222" cy="76" r="4"/><circle cx="151" cy="53" r="4"/></g></svg></div>`;
    }

    function graphScreenshotPreview(type) {
      const previews = {
        'graph-reflection': { src: 'assets/graph-reflection-over-y-axis.png', alt: 'Reflection over the y-axis simulator' },
        'graph-externality': { src: 'assets/graph-negative-externality.png', alt: 'Negative externality and Pigouvian tax simulator' },
        'graph-limits': { src: 'assets/graph-limits-at-infinity.png', alt: 'Limits at infinity simulator' }
      };
      const preview = previews[type];
      return `<div class="example-preview preview-graph-image ${type}"><img src="${preview.src}" alt="${preview.alt}" /></div>`;
    }

    function parabolaLinePreview() {
      return `<div class="example-preview preview-solver-intersection">
        <div class="solver-intersection-sheet">
          <div class="solver-intersection-chart">
            <svg viewBox="0 0 220 136" preserveAspectRatio="none" role="img" aria-label="Parabola f of x and line g of x intersect at negative two comma four and zero comma six">
              <defs><clipPath id="solverIntersectionCoverPlot"><rect x="20" y="8" width="190" height="120" rx="2"/></clipPath></defs>
              <g class="solver-intersection-grid"><path d="M20 8H210M20 32H210M20 56H210M20 80H210M20 104H210M20 128H210"/><path d="M20 8V128M67.5 8V128M115 8V128M162.5 8V128M210 8V128"/></g>
              <path class="solver-intersection-axis" d="M20 104H210M115 8V128"/>
              <g clip-path="url(#solverIntersectionCoverPlot)" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path class="solver-intersection-symmetry" d="M103.1 8V128"/>
                <path class="solver-intersection-parabola" d="M35 128C48 91 58 66 67.5 56C79 42 92 29 103.1 29C127 29 151 73 171.3 128"/>
                <path class="solver-intersection-line" d="M20 80L162.5 8"/>
              </g>
              <g class="solver-intersection-ticks"><text x="3" y="11">8</text><text x="3" y="35">6</text><text x="3" y="59">4</text><text x="3" y="83">2</text><text x="5" y="107">0</text><text x="1" y="131">−2</text><text x="15" y="135">−4</text><text x="63" y="135">−2</text><text x="113" y="135">0</text><text x="161" y="135">2</text><text x="207" y="135">4</text></g>
              <g class="solver-intersection-points"><circle cx="67.5" cy="56" r="4.2"/><circle cx="115" cy="32" r="4.2"/></g>
              <g class="solver-intersection-labels"><text x="43" y="50">(−2.0, 4.0)</text><text x="117" y="26">(0.0, 6.0)</text></g>
            </svg>
            <div class="solver-intersection-legend" aria-hidden="true"><span><i class="parabola"></i>f(x)</span><span><i class="line"></i>g(x)</span><span><i class="point"></i>Intersections</span><span><i class="symmetry"></i>Axis of Symmetry</span></div>
          </div>
          <div class="solver-intersection-controls" aria-hidden="true">
            <strong class="solver-intersection-controls-title">Parameters</strong>
            <div class="solver-intersection-control"><span><b>Parabola Coeff (a)</b><em>−1.0</em></span><i class="solver-intersection-track" style="--solver-preview-value:68%"><b></b></i></div>
            <div class="solver-intersection-control"><span><b>Line Gradient (m)</b><em>1.0</em></span><i class="solver-intersection-track" style="--solver-preview-value:59%"><b></b></i></div>
            <div class="solver-intersection-control"><span><b>Line Y-Intercept (c)</b><em>6.0</em></span><i class="solver-intersection-track" style="--solver-preview-value:65%"><b></b></i></div>
            <p>Adjust <b>a</b> to change curvature, <b>m</b> for line slope, and <b>c</b> for the y-intercept.</p>
          </div>
        </div>
      </div>`;
    }

    function reflectionGraphPreview() {
      return `<div class="example-preview preview-graph"><svg viewBox="0 0 320 104" role="img" aria-label="Triangle reflected over the y-axis"><defs><pattern id="reflectionGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="var(--line)" stroke-width="1"/></pattern></defs><rect width="320" height="104" fill="url(#reflectionGrid)"/><path d="M18 78H302M160 8V96" stroke="var(--line-strong)" stroke-width="1.3"/><path d="M60 70 126 70 60 24Z" fill="rgba(100,116,139,.10)" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/><path d="M260 70 194 70 260 24Z" fill="rgba(35,104,240,.15)" stroke="#2368f0" stroke-width="2.5"/><g fill="#fff" stroke="#2368f0" stroke-width="2"><circle cx="260" cy="70" r="3.5"/><circle cx="194" cy="70" r="3.5"/><circle cx="260" cy="24" r="3.5"/></g><path d="M145 18 155 18M150 13V23" stroke="#2368f0" stroke-width="1.5"/></svg></div>`;
    }

    function externalityGraphPreview() {
      return `<div class="example-preview preview-graph"><svg viewBox="0 0 320 104" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Negative externality and Pigouvian tax graph"><defs><pattern id="externalityGrid" width="28" height="20" patternUnits="userSpaceOnUse"><path d="M28 0H0V20" fill="none" stroke="var(--line)" stroke-width=".8"/></pattern><clipPath id="externalityPlot"><rect x="36" y="10" width="250" height="78" rx="2"/></clipPath></defs><rect width="320" height="104" fill="var(--surface-soft)"/><rect x="36" y="10" width="250" height="78" rx="6" fill="url(#externalityGrid)"/><path d="M36 88H292M36 8V88" fill="none" stroke="var(--line-strong)" stroke-width="1.2"/><g clip-path="url(#externalityPlot)" fill="none" stroke-linecap="round"><path d="M50 18 276 82" stroke="#2368f0" stroke-width="2.5"/><path d="M52 83 264 34" stroke="#16a36a" stroke-width="2.2"/><path d="M52 65 264 16" stroke="#ef5b5b" stroke-width="2.2"/><path d="M154 47 204 62 204 36Z" fill="rgba(239,91,91,.18)" stroke="#ef5b5b" stroke-width="1"/><path d="M176 36V55" stroke="#8b5cf6" stroke-width="1.6" stroke-dasharray="3 2"/></g><g font-family="system-ui,sans-serif" font-size="7" font-weight="700"><text x="267" y="79" fill="#2368f0">D</text><text x="246" y="37" fill="#16855b">PMC</text><text x="246" y="19" fill="#ef5b5b">SMC</text><text x="181" y="45" fill="#8b5cf6">Tax</text></g><circle cx="154" cy="47" r="3.2" fill="#ef5b5b" stroke="#fff" stroke-width="1.2"/><circle cx="204" cy="62" r="3.2" fill="#111827" stroke="#fff" stroke-width="1.2"/></svg></div>`;
    }

    function limitsGraphPreview() {
      return `<div class="example-preview preview-graph"><svg viewBox="0 0 320 104" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Limits at infinity graph"><defs><pattern id="limitsGrid" width="28" height="20" patternUnits="userSpaceOnUse"><path d="M28 0H0V20" fill="none" stroke="var(--line)" stroke-width=".8"/></pattern><clipPath id="limitsPlot"><rect x="32" y="9" width="256" height="80" rx="2"/></clipPath></defs><rect width="320" height="104" fill="var(--surface-soft)"/><rect x="32" y="9" width="256" height="80" rx="6" fill="url(#limitsGrid)"/><path d="M32 54H294M160 7V91" fill="none" stroke="var(--line-strong)" stroke-width="1.2"/><g clip-path="url(#limitsPlot)" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M34 47 C76 46 112 42 142 17M178 17 C208 42 244 46 286 47M34 61 C76 62 112 66 142 91M178 91 C208 66 244 62 286 61" stroke="#9aabc2" stroke-width="1.2" stroke-dasharray="4 3"/><path d="M32 54H288" stroke="#ef5b5b" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M34 55 C45 50 54 58 64 53 S84 60 95 51 S115 64 126 45 S145 29 151 20 C155 14 165 14 169 20 S194 65 205 45 S225 63 236 51 S256 59 267 53 S278 58 286 55" stroke="#2368f0" stroke-width="2.4"/></g><g font-family="system-ui,sans-serif" font-size="7" font-weight="700"><text x="273" y="50" fill="#ef5b5b">y = 0</text><text x="39" y="43" fill="#2368f0">f(x)</text><text x="151" y="15" fill="#64748b">2</text></g></svg></div>`;
    }

    function videoPreview(type) {
      const previews = {
        'video-solver-circles': { src: 'assets/solver-video-intersecting-circles.png', alt: 'Intersecting circles geometry video explanation', className: 'circles' },
        'video-geometry': { src: 'assets/video-geometry.png', alt: '3D shapes and cube net video explanation', className: 'geometry' },
        'video-statistics': { src: 'assets/video-statistics.png', alt: 'BMI dotplot threshold video explanation', className: 'statistics' },
        'video-physics': { src: 'assets/video-physics.png', alt: 'Velocity and distance graph video explanation', className: 'physics' }
      };
      const preview = previews[type];
      const playBadge = '<span class="play-badge" aria-hidden="true"><svg viewBox="0 0 17 20"><path d="M2.9 1.1C1.6.3 0 .3 0 2.3v15.4c0 2 1.6 2 2.9 1.2l12.7-7.7c1.4-.8 1.4-1.6 0-2.4L2.9 1.1Z" fill="currentColor"/></svg></span>';
      if (!preview) return `<div class="example-preview preview-video"><svg viewBox="0 0 320 104" role="img" aria-label="Geometry video preview"><rect width="320" height="104" fill="var(--surface-soft)"/><path d="M89 84 160 15l75 69Z" fill="rgba(var(--accent-rgb),.07)" stroke="var(--text)" stroke-width="2"/><path d="M119 55a28 28 0 0 1 22 16M189 57a26 26 0 0 0-21 14" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="104" y="55" fill="var(--muted)" font-size="11">60°</text><text x="197" y="56" fill="var(--muted)" font-size="11">x°</text></svg>${playBadge}</div>`;
      return `<div class="example-preview preview-video ${preview.className}"><img src="${preview.src}" alt="${preview.alt}"/>${playBadge}</div>`;
    }

    function accountingPreview() {
      return `<div class="example-preview preview-accounting" role="img" aria-label="Complete vertical analysis comparing Voltix and Circuita">
        <div class="accounting-preview-table" aria-hidden="true">
          <span class="accounting-preview-heading">Item</span><span class="accounting-preview-heading" title="Voltix ($M)">V $M</span><span class="accounting-preview-heading" title="Voltix (%)">V %</span><span class="accounting-preview-heading" title="Circuita ($M)">C $M</span><span class="accounting-preview-heading" title="Circuita (%)">C %</span>
          <span>Revenue</span><span>500</span><span>100%</span><span>800</span><span>100%</span>
          <span>COGS</span><span>350</span><strong class="accounting-preview-voltix">70%</strong><span>480</span><strong class="accounting-preview-circuita">60%</strong>
          <span>Gross Profit</span><span>150</span><span>30%</span><span>320</span><span>40%</span>
          <span title="Operating Expenses">Op. Exp.</span><span>100</span><span>20%</span><span>240</span><span>30%</span>
          <strong class="accounting-preview-total">Net Income</strong><strong class="accounting-preview-total">50</strong><strong class="accounting-preview-total">10%</strong><strong class="accounting-preview-total">80</strong><strong class="accounting-preview-total">10%</strong>
        </div>
      </div>`;
    }

    function accountingDialogPreview() {
      return `<div class="preview-accounting-full"><table class="accounting-full-table"><caption>Complete vertical analysis · $M and % of revenue</caption><thead><tr><th scope="col">Item</th><th scope="col">Voltix ($M)</th><th scope="col">Voltix (%)</th><th scope="col">Circuita ($M)</th><th scope="col">Circuita (%)</th></tr></thead><tbody><tr><td>Revenue</td><td>500</td><td>100%</td><td>800</td><td>100%</td></tr><tr><td>COGS</td><td>350</td><td class="is-highlighted" data-accounting-cell="COGS">70%</td><td>480</td><td class="is-highlighted" data-accounting-cell="COGS" data-better="true">60%</td></tr><tr><td>Gross Profit</td><td>150</td><td>30%</td><td>320</td><td>40%</td></tr><tr><td>Operating Expenses</td><td>100</td><td data-accounting-cell="Operating expenses" data-better="true">20%</td><td>240</td><td data-accounting-cell="Operating expenses">30%</td></tr><tr><td>Net Income</td><td>50</td><td data-accounting-cell="Net margin">10%</td><td>80</td><td data-accounting-cell="Net margin">10%</td></tr></tbody></table></div>`;
    }

    function examPlanPreview(detail = false) {
      const days = [['MON','24'],['TUE','25'],['WED','26'],['THU','27'],['FRI','28'],['SAT','29'],['SUN','30'],['','31'],['','1'],['','2'],['','3'],['','4'],['','5'],['','6']];
      const tasks = [['Model Selection',false],['Stationarity Testing',true],['ARIMA Modeling',true]];
      const visibleTasks = detail ? tasks : tasks.slice(0,2);
      return `<div class="example-preview exam-feature-visual exam-plan-visual${detail ? ' is-detail' : ''}"><h3 class="exam-visual-heading">Cram Mode</h3><section class="exam-visual-panel"><header class="exam-plan-header"><div><strong>Study Plan</strong><span class="exam-plan-meta"><span class="exam-calendar-glyph"></span>Exam: Aug 31, 2026<i></i>6-day plan</span></div><span class="exam-settings-glyph" aria-hidden="true"></span></header><div class="exam-plan-calendar">${days.map(([label,date],index) => `<span class="exam-plan-day${index === 1 ? ' active' : ''}${index === 7 ? ' exam' : ''}">${label}<b>${date}</b></span>`).join('')}</div><div class="exam-plan-task-area"><div class="exam-plan-task-head"><span>6 days until exam</span><span>3 tasks</span></div>${visibleTasks.map(([label,done]) => `<div class="exam-plan-task${done ? ' done' : ''}"><span class="exam-plan-check">${done ? '✓' : ''}</span><span>${label}</span></div>`).join('')}</div></section></div>`;
    }

    function examTopicsPreview(detail = false) {
      const topics = [
        ['Model Selection',98,30],['Stationarity Testing',96,0],['ARIMA Modeling',94,0],['SARIMA Modeling',92,0],
        ['Dynamic Regression',91,0],['Panel Data',89,0],['Logistic Regression',87,0],['Heteroscedasticity WLS',85,0],['Regression Diagnostics',83,0]
      ];
      const visibleTopics = detail ? topics : topics.slice(0,5);
      return `<div class="example-preview exam-feature-visual exam-topics-visual${detail ? ' is-detail' : ''}"><h3 class="exam-visual-heading">Predicted Exam Topics</h3><div class="exam-topics-table"><div class="exam-topics-head"><span>Topic</span><span>Likelihood</span><span>Mastery</span></div>${visibleTopics.map(([label,likelihood,mastery]) => `<div class="exam-topic-row"><span>${label}</span><strong class="exam-likelihood${likelihood < 95 ? ' mid' : ''}">${likelihood}%</strong><span class="exam-mastery"><strong>${mastery}%</strong><span class="exam-mastery-track"><i style="width:${mastery}%"></i></span></span></div>`).join('')}</div></div>`;
    }

    function examMockPreview(detail = false) {
      const exams = [
        { title:'Mock Exam 1', badge:'≥90% likely', icon:'i-target', copy:'The must-know questions. Nail these first', meta:'34 mins · 25 Questions · Predicted likelihood: ≥90%', tone:'' },
        { title:'Mock Exam 2', badge:'80–90% likely', icon:'i-spark', copy:'Highly likely questions. Practice makes perfect', meta:'42 mins · 25 Questions · Predicted likelihood: 80–90%', tone:' blue' }
      ];
      const visibleExams = detail ? exams : exams.slice(0,1);
      return `<div class="example-preview exam-feature-visual exam-mock-visual${detail ? ' is-detail' : ''}"><h3 class="exam-visual-heading">Mock Exams</h3><div class="exam-mock-visual-grid">${visibleExams.map(exam => `<section class="exam-mock-visual-card"><span class="exam-mock-visual-icon">${icon(exam.icon)}</span><div class="exam-mock-title-row"><strong>${exam.title}</strong><span class="exam-mock-badge${exam.tone}">${exam.badge}</span></div><p>${exam.copy}</p><p class="exam-mock-meta">${exam.meta}</p>${detail ? `<span class="exam-mock-state">Not started</span><span class="exam-mock-button">Start exam →</span>` : `<div class="exam-mock-progress"><strong>1</strong><span>/25</span><small>Questions</small></div><span class="exam-mock-progress-meta">In progress · Sep 1, 2026</span><span class="exam-mock-button">Continue&nbsp;&nbsp;→</span>`}</section>`).join('')}</div></div>`;
    }

    function examProgressPreview(detail = false) {
      const secondQuestion = detail
        ? `<section class="exam-result-question"><small>Short Answer · 2/26</small><h5>State one key difference between mitosis and meiosis.</h5><div class="exam-result-answer wrong">Mitosis makes four genetically different cells.</div><div class="exam-result-answer correct">Mitosis produces two genetically identical diploid cells, while meiosis produces four genetically varied haploid cells.</div></section>`
        : `<section class="exam-result-question"><small>Multiple Choice · 2/26</small><h5>Which organelle produces most cellular ATP?</h5><div class="exam-result-answer wrong">A. Nucleus</div><div class="exam-result-answer correct">B. Mitochondrion</div></section>`;
      const resultFilters = detail
        ? `<div class="exam-result-tabs"><strong>All questions</strong><span>21 Correct</span><span>5 Incorrect</span><span>0 Unanswered</span></div>`
        : `<div class="exam-result-tabs"><strong>All</strong><span class="is-correct">Correct 21</span><span class="is-incorrect">Incorrect 5</span></div>`;
      const resultContent = `<section class="exam-result-summary"><h4>FINAL Exam: Biology 101</h4><div class="exam-result-stats"><span>Points: <strong>21 / 26</strong></span><span>Percentage: <strong>81%</strong></span></div><div class="exam-result-analysis"><strong>Final exam analysis</strong><span>You demonstrated strong understanding of cell structure, genetics, and ecology. Review cellular respiration and meiosis before the next assessment.</span></div></section>${resultFilters}<section class="exam-result-question"><small>Multiple Choice · 1/26</small><h5>Where does the electron transport chain occur in a eukaryotic cell?</h5><div class="exam-result-answer wrong">A. Cytoplasm</div><div class="exam-result-answer correct">D. Inner mitochondrial membrane</div><div class="exam-result-feedback"><strong>Feedback</strong><br>The electron transport chain is embedded in the inner mitochondrial membrane, where it creates the proton gradient used to produce ATP.</div></section>${secondQuestion}${detail ? `<div class="exam-result-actions"><span>Retake exam</span><span>Result breakdown</span></div>` : ''}`;
      return `<div class="example-preview exam-feature-visual exam-result-shell${detail ? ' is-detail' : ''}">${detail ? resultContent : `<section class="exam-result-panel">${resultContent}</section>`}</div>`;
    }

    function flashcardPreview(example) {
      const cards = example && example.cards ? example.cards : [];
      const imageCard = cards.find(card => card.image) || cards[0] || { back:'Active recall answer' };
      const answerContent = imageCard.image
        ? `<div class="flash-preview-answer-content"><span class="flash-preview-answer-media"><img src="${imageCard.image}" alt="${imageCard.imageAlt || ''}" loading="lazy"></span><strong>${imageCard.back}</strong></div>`
        : `<strong>${imageCard.back}</strong>`;
      return `<div class="example-preview preview-flashcards"><div class="flash-preview-stack"><div class="flash-preview-card"><span class="flash-preview-header"><small>Answer</small></span>${answerContent}<small class="flash-preview-hint">Click to see the question</small></div></div></div>`;
    }

    function chemistryPreview(example) {
      if (example && example.coverImage) return `<div class="example-preview preview-chemistry cover"><div class="chemistry-preview-sheet"><img src="${example.coverImage}" alt="Chemistry structure visualization" /></div></div>`;
      const structures = example && Array.isArray(example.structures) ? example.structures : [];
      return `<div class="example-preview preview-chemistry">${structures.slice(0,3).map(structure => `<span class="chemistry-preview-item"><img src="${structure.image}" alt="${structure.title} structure" loading="lazy" /></span>`).join('')}</div>`;
    }

    function chemistryDialogPreview(example) {
      const firstStructure = example && Array.isArray(example.structures) ? example.structures[0] : null;
      return `<div class="chemistry-dialog-preview"><img data-chemistry-image src="${firstStructure ? firstStructure.image : ''}" alt="${firstStructure ? firstStructure.title : 'Chemistry structure'}" /></div>`;
    }

    function chemistryInteractionMarkup(example) {
      const structures = example && Array.isArray(example.structures) ? example.structures : [];
      const firstStructure = structures[0] || { summary:'', facts:[] };
      return `<div class="chemistry-case-selector" role="tablist" aria-label="Chemistry structure examples">${structures.map((structure,index) => `<button class="chemistry-case-tab${index === 0 ? ' active' : ''}" type="button" role="tab" aria-selected="${index === 0}" data-chemistry-index="${index}">${structure.title}</button>`).join('')}</div><div class="chemistry-answer" data-chemistry-answer><p class="chemistry-answer-summary" data-chemistry-summary>${firstStructure.summary}</p><div class="chemistry-facts" data-chemistry-facts>${firstStructure.facts.map(([label,value]) => `<div class="chemistry-fact"><small>${label}</small><strong>${value}</strong></div>`).join('')}</div></div>`;
    }

    function formatMediaTime(seconds) {
      const safeSeconds = Number.isFinite(seconds) ? Math.max(0,Math.round(seconds)) : 0;
      return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2,'0')}`;
    }

    function podcastHostsMarkup(example, compact = false) {
      const speakers = Array.isArray(example && example.speakers) ? example.speakers.slice(0,2) : ['Host 1','Host 2'];
      const avatars = Array.isArray(example && example.speakerAvatars) ? example.speakerAvatars : [];
      return `<div class="podcast-host-stack${compact ? ' compact' : ''}" aria-label="Podcast hosts: ${speakers.join(' and ')}">${speakers.map((speaker,index) => `<span class="podcast-host-avatar">${avatars[index] ? `<img src="${avatars[index]}" alt="${speaker}">` : `<span class="podcast-avatar-placeholder" role="img" aria-label="${speaker} placeholder avatar"></span>`}</span>`).join('')}</div>`;
    }

    function podcastPreview(example) {
      return `<div class="example-preview preview-podcast">${podcastHostsMarkup(example,true)}<div class="podcast-preview-copy"><div class="podcast-preview-meta"><span>${example.speakers.length} voices</span><span>${example.duration}</span></div><div class="podcast-preview-wave">${'<i></i>'.repeat(12)}</div><div class="podcast-preview-footer"><span class="podcast-preview-play">${icon('i-play')}</span><span>Listen to demo</span></div></div></div>`;
    }

    function podcastDialogPreview(example) {
      return `<div class="podcast-dialog-hero">${podcastHostsMarkup(example)}<div class="podcast-dialog-copy"><span>Generated study podcast · ${example.duration}</span><h3>${example.title}</h3><p>${example.description}</p><div class="podcast-dialog-speakers">${example.speakers.map(speaker => `<b>${speaker}</b>`).join('')}</div></div></div>`;
    }

    function podcastInteractionMarkup(example) {
      return `<div class="podcast-player" data-podcast-player><audio data-podcast-audio preload="metadata" src="${example.audio}"></audio><div class="podcast-player-main"><button class="podcast-play-toggle" type="button" data-podcast-toggle aria-label="Play podcast">${icon('i-play')}</button><div class="podcast-player-title"><strong>${example.title}</strong><span>${example.language} · ${example.platform} · ${example.speakers.join(' & ')}</span></div><time class="podcast-player-time" data-podcast-time>0:00 / ${example.duration}</time></div><input class="podcast-scrubber" type="range" min="0" max="${example.durationSeconds}" step="0.1" value="0" aria-label="Podcast progress" data-podcast-scrubber><div class="podcast-player-tools"><button class="podcast-tool" type="button" data-podcast-skip="-15" aria-label="Rewind 15 seconds">↶ 15s</button><button class="podcast-tool" type="button" data-podcast-speed aria-label="Playback speed 1 times">1×</button><button class="podcast-tool" type="button" data-podcast-skip="15" aria-label="Forward 15 seconds">15s ↷</button></div><div class="podcast-transcript"><div class="podcast-transcript-head"><strong>Transcript</strong><span>Synced · click a line to jump</span></div><div class="podcast-transcript-list" data-podcast-transcript><p class="podcast-transcript-loading">Loading full transcript…</p></div></div></div>`;
    }

    function quizPreview(example) {
      const question = example && example.question ? example.question : 'Check your understanding';
      const previewQuestion = example && example.previewQuestion ? example.previewQuestion : question;
      const options = example && Array.isArray(example.options) ? example.options : [{key:'A'},{key:'B'},{key:'C'},{key:'D'}];
      const answerList = `<div class="quiz-preview-options">${options.map(option => `<div class="quiz-option">${option.key}</div>`).join('')}</div>`;
      if (example && example.image) return `<div class="example-preview preview-quiz has-image"><div class="quiz-preview-image"><img src="${example.image}" alt="${example.imageAlt || ''}" loading="lazy"></div><div class="quiz-preview-side"><strong class="quiz-preview-question">${previewQuestion}</strong>${answerList}</div></div>`;
      return `<div class="example-preview preview-quiz"><div class="quiz-preview-side"><strong class="quiz-preview-question">${previewQuestion}</strong>${answerList}</div></div>`;
    }

    function quizInteractionMarkup(example) {
      const options = example && Array.isArray(example.options) ? example.options : [];
      return `<div class="quiz-session" data-quiz-session>
        <div class="quiz-session-meta"><strong>Question 1 of 1</strong></div>
        <h3 class="quiz-question">${example.question}</h3>
        ${example.image ? `<figure class="quiz-question-figure" style="--quiz-image-max:${example.imageMaxWidth || 420}px"><img src="${example.image}" alt="${example.imageAlt || ''}"></figure>` : ''}
        <div class="quiz-options">${options.map(option => `<button class="quiz-choice" type="button" data-quiz-option="${option.key}" data-correct="${option.correct}" data-explanation="${option.explanation}" aria-label="Option ${option.key}: ${option.text}"><span class="quiz-choice-letter">${option.key}</span><span class="quiz-choice-text">${option.text}</span></button>`).join('')}</div>
        <section class="quiz-result" data-quiz-result hidden aria-live="polite">
          <div class="quiz-explanations"><div class="quiz-explanation" data-quiz-selected-explanation><b data-quiz-explanation-key></b><div><strong data-quiz-explanation-status></strong><span data-quiz-explanation-copy></span></div></div></div>
          <div class="quiz-overall"><strong>Overall explanation</strong><p>${example.overallExplanation}</p></div>
          <button class="quiz-retry" type="button" data-quiz-retry>Try again</button>
        </section>
      </div>`;
    }

    function guidePreview(example) {
      const sections = example && Array.isArray(example.sections) ? example.sections : [];
      const firstSection = sections[0] || { image:'', alt:'Study guide cover' };
      const coverImage = example && example.coverImage ? example.coverImage : firstSection.image;
      const coverAlt = example && example.coverAlt ? example.coverAlt : firstSection.alt;
      const containCover = Boolean(example && example.coverImage);
      return `<div class="example-preview preview-guide"><div class="guide-preview-image${containCover ? ' is-contain' : ''}"><img src="${coverImage}" alt="${coverAlt}" loading="lazy" /></div><div class="guide-preview-outline"><div class="guide-preview-meta"><span>Structured guide</span><span>${sections.length} chapters</span></div>${sections.slice(0,3).map((section,index) => `<div class="guide-line"><b>${index + 1}</b><span>${section.title}</span></div>`).join('')}</div></div>`;
    }

    function guideDialogPreview(example) {
      const sections = example && Array.isArray(example.sections) ? example.sections : [];
      const firstSection = sections[0] || { title:'Study guide', summary:example.description, image:'', alt:'Study guide cover' };
      return `<div class="guide-dialog-hero" data-guide-hero><div class="guide-dialog-figure"><img src="${firstSection.image}" alt="${firstSection.alt}" data-guide-image /></div><div class="guide-dialog-summary"><small>Generated from study materials</small><strong data-guide-hero-title>${firstSection.title}</strong><p data-guide-hero-summary>${firstSection.summary}</p></div></div>`;
    }

    function escapeMarkdownHtml(value = '') {
      return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    }

    function readableMarkdownMath(value = '') {
      return value
        .replace(/\\mathrm\{([^{}]+)\}/g,'$1')
        .replace(/\\text\{([^{}]+)\}/g,'$1')
        .replace(/\\times/g,'×')
        .replace(/\\rightarrow/g,'→')
        .replace(/\\rightleftharpoons/g,'⇌')
        .replace(/\\ll/g,'≪')
        .replace(/\\pm/g,'±')
        .replace(/\\circ/g,'°')
        .replace(/\\,/g,' ');
    }

    function renderMarkdownInline(value = '') {
      return escapeMarkdownHtml(value)
        .replace(/`([^`]+)`/g,'<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g,'<em>$1</em>')
        .replace(/\$([^$\n]+)\$/g,(_,formula) => `<span class="markdown-math-inline">${readableMarkdownMath(formula)}</span>`);
    }

    function markdownTableCells(line = '') {
      return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(cell => cell.trim());
    }

    function isMarkdownTableDivider(line = '') {
      const cells = markdownTableCells(line);
      return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
    }

    function renderStudyGuideMarkdown(markdown = '', markdownUrl = '') {
      const lines = markdown.replace(/\r/g,'').split('\n');
      const assetBase = new URL('.', new URL(markdownUrl, window.location.href));
      const blocks = [];
      let index = 0;
      const isBlockStart = position => {
        const line = lines[position] || '';
        return !line.trim() || /^#{1,3}\s+/.test(line) || /^\s*---+\s*$/.test(line) || /^\s*-\s+/.test(line) || /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line) || /^\s*\$\$/.test(line) || (line.includes('|') && isMarkdownTableDivider(lines[position + 1] || ''));
      };
      while (index < lines.length) {
        const line = lines[index];
        const trimmed = line.trim();
        if (!trimmed) { index += 1; continue; }
        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          const level = heading[1].length;
          blocks.push(`<h${level}>${renderMarkdownInline(heading[2])}</h${level}>`);
          index += 1;
          continue;
        }
        if (/^---+$/.test(trimmed)) {
          blocks.push('<hr>');
          index += 1;
          continue;
        }
        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          const imageUrl = new URL(imageMatch[2], assetBase).href;
          blocks.push(`<figure class="markdown-figure"><img src="${escapeMarkdownHtml(imageUrl)}" alt="${escapeMarkdownHtml(imageMatch[1])}" loading="lazy"><figcaption>${renderMarkdownInline(imageMatch[1])}</figcaption></figure>`);
          index += 1;
          continue;
        }
        if (/^\$\$/.test(trimmed)) {
          const formula = [];
          let current = trimmed.replace(/^\$\$/,'');
          let closed = current.endsWith('$$');
          if (closed) current = current.slice(0,-2);
          if (current) formula.push(current);
          index += 1;
          while (!closed && index < lines.length) {
            current = lines[index].trim();
            closed = current.endsWith('$$');
            formula.push(closed ? current.slice(0,-2) : current);
            index += 1;
          }
          blocks.push(`<div class="markdown-math-block">${readableMarkdownMath(escapeMarkdownHtml(formula.join('\n')))}</div>`);
          continue;
        }
        if (line.includes('|') && isMarkdownTableDivider(lines[index + 1] || '')) {
          const headers = markdownTableCells(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
            rows.push(markdownTableCells(lines[index]));
            index += 1;
          }
          blocks.push(`<div class="markdown-table-wrap"><table><thead><tr>${headers.map(cell => `<th>${renderMarkdownInline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((_,cellIndex) => `<td>${renderMarkdownInline(row[cellIndex] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
          continue;
        }
        if (/^\s*-\s+/.test(line)) {
          const items = [];
          while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
            const match = lines[index].match(/^(\s*)-\s+(.+)$/);
            const depth = Math.min(3,Math.floor((match[1] || '').length / 2));
            items.push(`<li style="--md-depth:${depth}">${renderMarkdownInline(match[2])}</li>`);
            index += 1;
          }
          blocks.push(`<ul class="markdown-list">${items.join('')}</ul>`);
          continue;
        }
        const paragraph = [trimmed];
        index += 1;
        while (index < lines.length && !isBlockStart(index)) {
          paragraph.push(lines[index].trim());
          index += 1;
        }
        blocks.push(`<p>${renderMarkdownInline(paragraph.join(' '))}</p>`);
      }
      return `<article class="markdown-document">${blocks.join('')}</article>`;
    }

    function guideInteractionMarkup(example) {
      return `<div class="study-guide-markdown-shell" data-guide-markdown data-markdown-src="${example.markdown || ''}"><div class="study-guide-markdown-loading">Rendering the original study guide…</div></div>`;
    }

    function solverStepSolutionPreview() {
      return `<div class="example-preview preview-step-solution preview-cover-fill">
        <div class="preview-solution-sheet">
          <div class="preview-solution-answer-row"><span>Final Answer</span><strong>C. 30</strong></div>
          <div class="preview-step-flow" aria-hidden="true">
            <article class="preview-step-item active"><b>2</b><div><strong>Solving for the variable <i>t</i></strong><span>2t + 10 = 3t − 15<br>25 = t</span></div></article>
            <article class="preview-step-item"><b>3</b><div><strong>Calculating the measure of angle <i>O</i></strong><span>m∠O = 2(25) + 10<br>= 60°</span></div></article>
          </div>
        </div>
      </div>`;
    }

    function solverStepSolutionDialogPreview() {
      return `<div class="recording-answer-page" data-solver-answer>
        <div class="recording-question-bubble"><img class="recording-question-image" src="assets/solver-parallelogram-question.png" alt="Geometry problem asking to solve for r in parallelogram LMNO" /></div>
        <h3 class="recording-final-title">Final Answer</h3>
        <section class="recording-final-card"><strong>1.</strong><span>A. 15</span><span>B. 25</span><b>✓ C. 30</b><span>D. 120</span></section>
        <section class="recording-video-card">
          <div class="recording-video-thumb"><img src="assets/solver-parallelogram-video.png" alt="Mathematics video thumbnail with a blue cat and parabola graph" /></div>
          <div><strong>Video Explanation: Solve Parallelogram Angle Properties...</strong><p>Observe how consecutive interior angles sum to 180 degrees in this geometric breakdown. Watch the algebraic relationship between variables unfold as we isolate r.</p></div>
          <span class="recording-video-action">▶ Watch Now</span>
        </section>
        <section class="recording-helpful"><div><strong>Was this answer helpful?</strong><span>Your feedback helps me learn and get smarter for you 🙏</span></div><span class="recording-feedback-action">👍 Yes</span><span class="recording-feedback-action">👎 No</span></section>
      </div>`;
    }

    function solverStepSolutionInteraction() {
      return `<section class="recording-explanation" data-solver-explanation>
        <h3>Explanation</h3><h4>Solving for <i>r</i> in parallelogram <i>LMNO</i></h4>
        <article class="recording-step"><span>1</span><div><h5>Understanding parallelogram properties</h5><p>In a parallelogram, opposite angles are equal, and consecutive angles are supplementary (they add up to 180°). We can use these properties to set up equations for the variables <i>t</i> and <i>r</i>. From the diagram, we have:</p><ul><li>m∠L = (4r)°</li><li>m∠M = (3t − 15)°</li><li>m∠O = (2t + 10)°</li></ul></div></article>
        <article class="recording-step"><span>2</span><div><h5>Solving for the variable <i>t</i></h5><p>Since ∠O and ∠M are opposite angles, they must be equal. We set their expressions equal to each other to solve for <i>t</i>:</p><div class="recording-equations"><span>2t + 10 = 3t − 15</span><span>10 + 15 = 3t − 2t</span><span>25 = t</span></div></div></article>
        <article class="recording-step"><span>3</span><div><h5>Calculating the measure of angle <i>O</i></h5><p>Now that we know t = 25, we can substitute this value back into the expression for m∠O to find its numerical measure:</p><div class="recording-equations"><span>m∠O = 2(25) + 10</span><span>= 50 + 10</span><span>= 60°</span></div></div></article>
        <article class="recording-step"><span>4</span><div><h5>Solving for <i>r</i></h5><p>Angles L and O are consecutive angles, meaning they are supplementary. We set their sum to 180° and solve for r:</p><div class="recording-equations"><span>4r + 60 = 180</span><span>4r = 180 − 60</span><span>4r = 120</span><span>r = 120 / 4</span><span>r = 30</span></div></div></article>
        <article class="recording-step"><span>5</span><div><h5>Answer</h5><p><strong>The correct answer is C. 30.</strong></p></div></article>
      </section>`;
    }

    function previewMarkup(type, example = null) {
      if (type === 'solver-parabola-line') return parabolaLinePreview();
      if (['graph-reflection','graph-externality','graph-limits'].includes(type)) return graphScreenshotPreview(type);
      if (type === 'solver-step-solution') return solverStepSolutionPreview();
      if (type === 'graph') return graphPreview();
      if (type.startsWith('video')) return videoPreview(type);
      if (type === 'chemistry') return chemistryPreview(example);
      if (type === 'accounting') return accountingPreview();
      if (type === 'exam-plan') return examPlanPreview();
      if (type === 'exam-review') return examTopicsPreview();
      if (type === 'exam-mock') return examMockPreview();
      if (type === 'exam-progress') return examProgressPreview();
      if (type === 'equation') return `<div class="example-preview preview-equation"><div class="equation-main">x² − 5x + 6</div><div class="equation-steps"><i></i><i></i><i></i></div></div>`;
      if (type === 'flashcards') return flashcardPreview(example);
      if (type === 'quiz') return quizPreview(example);
      if (type === 'guide') return guidePreview(example);
      if (type === 'podcast') return podcastPreview(example);
      return `<div class="example-preview preview-exam"><div class="exam-sheet"><i></i><i></i><i></i><i></i></div><div class="exam-score"><strong>84</strong><span>Score</span></div></div>`;
    }

    function dialogPreviewMarkup(type, example = null) {
      if (type === 'solver-step-solution') return solverStepSolutionDialogPreview();
      if (type === 'accounting') return accountingDialogPreview();
      if (type === 'chemistry') return chemistryDialogPreview(example);
      if (type === 'podcast') return podcastDialogPreview(example);
      if (type === 'guide') return guideDialogPreview(example);
      return previewMarkup(type, example);
    }

    function renderCapabilities() {
      capabilityStrip.innerHTML = capabilityGroups[workspaceMode].map(key => {
        const capability = capabilityData[key];
        return `<button class="capability-button" role="tab" aria-selected="${key === selectedCapability}" data-capability="${key}">${icon(capability.icon)}<span>${capability.label}</span></button>`;
      }).join('');
      capabilityStrip.querySelectorAll('[data-capability]').forEach(button => button.addEventListener('click', () => selectCapability(button.dataset.capability)));
    }

    function resetStudyWorkspace() {
      selectCapability('solver', false);
    }

    function selectWorkspaceMode(mode, announce = true) {
      if (!capabilityGroups[mode]) return;
      workspaceMode = mode;
      onWorkspaceChange?.(mode);
      document.getElementById('composerShell').classList.remove('writing-layout');
      capabilityStrip.hidden = mode === 'exam';
      document.querySelectorAll('[data-workspace-mode]').forEach(button => {
        button.setAttribute('aria-selected', String(button.dataset.workspaceMode === mode));
      });
      if (mode === 'study') resetStudyWorkspace();
      else selectCapability(capabilityGroups[mode][0], false);
      if (announce) workspaceStatus.textContent = mode === 'study' ? 'Study workspace selected' : mode === 'exam' ? 'Exam Prep workspace selected' : 'Writing workspace selected';
    }

    function updateWritingEditorState() {
      writingActionButton.disabled = !writingEditor.value.trim();
      researchActionButton.disabled = !researchInput.value.trim();
    }

    function updateWritingTool(key, resetResult = true) {
      const tool = writingToolData[key];
      if (!tool) return;
      const isResearch = key === 'research';
      document.getElementById('writingTextScreen').hidden = isResearch;
      document.getElementById('researchToolScreen').hidden = !isResearch;
      const draftTitles = {
        paraphraser: 'Original text',
        plagiarism: 'Original text',
        detector: 'Text to analyze',
        aiCitation: 'Source details',
        humanizer: 'Original text'
      };
      const resultTitles = {
        paraphraser: 'Paraphrased text',
        plagiarism: 'Plagiarism scan',
        detector: 'AI detection analysis',
        aiCitation: 'Generated citation',
        humanizer: 'Humanized text'
      };
      document.getElementById('writingDraftTitle').textContent = draftTitles[key] || 'Original text';
      writingEditor.placeholder = tool.placeholder;
      writingActionButton.querySelector('span').textContent = tool.action;
      document.getElementById('writingResultTitle').textContent = resultTitles[key] || 'Result';
      const writingToolOptions = document.getElementById('writingToolOptions');
      if (key === 'paraphraser') {
        writingToolOptions.hidden = false;
        writingToolOptions.innerHTML = `<span class="writing-option-label">Style</span>${['Standard','Fluent','Academic','Shorter','Custom'].map((style, index) => `<button class="writing-option-chip" type="button" data-paraphrase-style="${style}" aria-pressed="${index === 0}">${style}</button>`).join('')}<input class="writing-custom-instruction" id="paraphraseCustomInstruction" type="text" aria-label="Custom paraphrasing instructions" placeholder="Enter your custom instructions" hidden>`;
      } else {
        writingToolOptions.hidden = true;
        writingToolOptions.innerHTML = '';
      }
      if (resetResult) {
        document.getElementById('writingResultPanel').hidden = true;
        document.getElementById('researchResult').hidden = true;
        writingResultContent.textContent = '';
        writingResultContent.classList.remove('has-result');
        researchResultContent.textContent = '';
        researchResultContent.classList.remove('has-result');
      }
      updateWritingEditorState();
    }

    function processWritingText(key, value) {
      if (key === 'detector') {
        const score = Math.max(18, Math.min(86, 26 + value.split(/\s+/).length % 53));
        return `AI likelihood: ${score}%\n\nThis demo analysis found a mix of predictable and natural sentence patterns. Review repeated transitions and uniform sentence length for a more human voice.`;
      }
      if (key === 'paraphraser') return value
        .replace(/\bbeautiful\b/gi, 'refreshing')
        .replace(/\bimportant\b/gi, 'essential')
        .replace(/\bOverall,?\b/g, 'Taken together,')
        .replace(/During this time/gi, 'As the season unfolds');
      if (key === 'plagiarism') return `No matching passages found in this demo check.\n\nOriginality estimate: 98%\nChecked ${value.trim().split(/\s+/).length} words.`;
      if (key === 'aiCitation') {
        return `${selectedCitationFormat} · ${selectedCitationSourceType}\nAuthor, A. A. (2026). ${value.trim().slice(0,72)}${value.trim().length > 72 ? '…' : ''}. Publisher or Website.\n\nIn-text citation: (Author, 2026)`;
      }
      if (key === 'research') return `Research outline\n\n1. Define the central question\n2. Review credible primary and secondary sources\n3. Compare the strongest claims and evidence\n4. Identify open questions\n5. Summarize practical conclusions\n\nTopic: ${value.trim()}`;
      return value
        .replace(/\bMany individuals\b/g, 'A lot of people')
        .replace(/\bDuring this time\b/g, 'Around this time')
        .replace(/\bOverall, it is\b/g, 'All in all, spring is')
        .replace(/\bhas a positive impact on\b/g, 'can lift')
        .replace(/\bnew opportunities for growth and development\b/g, 'new chances to grow and begin again');
    }

    function renderExamples() {
      const capability = capabilityData[selectedCapability];
      const examplesSection = document.querySelector('.examples-section');

      if (workspaceMode === 'writing') {
        const isResearch = selectedCapability === 'research';
        examplesSection.hidden = !isResearch;
        examplesSection.classList.toggle('research-suggestions', isResearch);
        if (!isResearch) {
          examplesGrid.innerHTML = '';
          return;
        }
        examplesHeading.hidden = false;
        examplesTitle.hidden = false;
        examplesTitle.textContent = 'Or, try searching for:';
        examplesDescription.hidden = true;
        multiModelProof.hidden = true;
        examplesGrid.className = 'examples-grid';
        examplesGrid.innerHTML = researchSuggestions.map((suggestion, index) => `
          <button class="research-sample-card" type="button" data-research-suggestion="${index}" aria-label="Use research suggestion: ${suggestion.prompt}">
            ${icon(suggestion.icon)}<strong>${suggestion.label}</strong><span>${suggestion.prompt}</span>
          </button>`).join('');
        examplesGrid.querySelectorAll('[data-research-suggestion]').forEach(button => button.addEventListener('click', () => {
          promptInput.value = researchSuggestions[Number(button.dataset.researchSuggestion)].prompt;
          promptInput.dispatchEvent(new Event('input', { bubbles:true }));
          promptInput.focus();
        }));
        return;
      }

      examplesSection.hidden = false;
      examplesSection.classList.remove('research-suggestions');
      const isExamPrepOverview = selectedCapability === 'mock';
      examplesHeading.hidden = false;
      examplesTitle.hidden = false;
      examplesTitle.textContent = selectedCapability === 'mock' ? 'Exam prep plan' : `${capability.label} examples`;
      examplesDescription.textContent = capability.description;
      multiModelProof.hidden = selectedCapability !== 'solver';
      examplesDescription.hidden = selectedCapability === 'solver';
      examplesGrid.classList.remove('study-overview-grid');
      examplesGrid.classList.toggle('four-up', capability.examples.length === 4);
      examplesGrid.classList.toggle('solver-grid', selectedCapability === 'solver');
      examplesGrid.classList.toggle('exam-prep-grid', selectedCapability === 'mock');
      examplesGrid.innerHTML = capability.examples.map((example, index) => `
        <button class="example-card${isExamPrepOverview ? ' feature-card' : ''}"${isExamPrepOverview ? ` data-feature-index="${index}" aria-label="Learn about ${example.title}"` : ` data-example-index="${index}" aria-label="Preview ${example.title}"`}>
          <span class="example-meta"><span>${example.tag}</span>${icon(capability.icon)}</span>
          <h3>${example.title}</h3>
          ${previewMarkup(example.preview, example)}
        </button>`).join('');
      if (isExamPrepOverview) examplesGrid.querySelectorAll('[data-feature-index]').forEach(card => card.addEventListener('click', () => openExamPrepFeature(Number(card.dataset.featureIndex))));
      else examplesGrid.querySelectorAll('[data-example-index]').forEach(card => card.addEventListener('click', () => openExample(Number(card.dataset.exampleIndex))));
    }

    function renderCourseCatalog() {
      const grid = document.getElementById('courseGrid');
      const query = document.getElementById('examCourseSearch').value.trim().toLowerCase();
      const family = document.getElementById('examCourseFilter').value;
      const terms = query.split(/\s+/).filter(Boolean);
      const courses = examCoursePackages.filter(course => {
        const haystack = (course.title + ' ' + course.search).toLowerCase();
        return (family === 'all' || course.family === family) && terms.every(term => haystack.includes(term));
      });
      grid.innerHTML = courses.map((course,index) =>
        '<button class="course-card" data-course-index="' + examCoursePackages.indexOf(course) + '" aria-label="Open ' + course.title + ' course"><span class="course-family">' + course.label + '</span><h3>' + course.title + '</h3><p>' + course.topics + ' topics · ' + course.videos + ' video lessons<br>' + course.questions + ' practice questions</p><span class="course-stats"><span>Full test</span><span>Score insights</span></span></button>'
      ).join('');
      document.getElementById('courseEmpty').hidden = courses.length !== 0;
      grid.querySelectorAll('[data-course-index]').forEach(card => card.addEventListener('click', () => openCoursePackage(Number(card.dataset.courseIndex))));
    }

    function diagnosticDateValue(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2,'0');
      const day = String(date.getDate()).padStart(2,'0');
      return `${year}-${month}-${day}`;
    }

    function populateDiagnosticExams() {
      const examSelect = document.getElementById('diagnosticExam');
      if (examSelect.options.length) return;
      const groups = [
        ['College admissions',['sat','act']],
        ['AP exams',['ap']],
        ['Abitur exams',['abitur']]
      ];
      examSelect.innerHTML = groups.map(([label,families]) => `<optgroup label="${label}">${examCoursePackages.map((course,index) => families.includes(course.family) ? `<option value="${index}">${course.title}</option>` : '').join('')}</optgroup>`).join('');
    }

    function populateDiagnosticScores() {
      const examIndex = Number(document.getElementById('diagnosticExam').value) || 0;
      const course = examCoursePackages[examIndex];
      const family = course.family;
      const targetSelect = document.getElementById('diagnosticTargetScore');
      const previousValue = targetSelect.value;
      targetSelect.innerHTML = diagnosticScoreOptions[family].map(score => `<option value="${score}">${score}</option>`).join('');
      if ([...targetSelect.options].some(option => option.value === previousValue)) targetSelect.value = previousValue;
      else targetSelect.selectedIndex = Math.floor((targetSelect.options.length - 1) * .66);
      renderDiagnosticPreview(course);
    }

    function openDiagnosticDialog() {
      const diagnosticDialog = document.getElementById('diagnosticDialog');
      const diagnosticDate = document.getElementById('diagnosticTestDate');
      diagnosticPreviewView = 'score';
      diagnosticTopicFilter = 'all';
      diagnosticQuestionFilter = 'all';
      populateDiagnosticExams();
      populateDiagnosticScores();
      const today = new Date();
      diagnosticDate.min = diagnosticDateValue(today);
      if (!diagnosticDate.value) {
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() + 42);
        diagnosticDate.value = diagnosticDateValue(defaultDate);
      }
      document.getElementById('diagnosticSetupForm').hidden = false;
      document.getElementById('diagnosticReady').hidden = true;
      if (!diagnosticDialog.open) diagnosticDialog.showModal();
    }

    function showDiagnosticReady() {
      const examIndex = Number(document.getElementById('diagnosticExam').value) || 0;
      const course = examCoursePackages[examIndex];
      const score = document.getElementById('diagnosticTargetScore').value;
      const dateValue = document.getElementById('diagnosticTestDate').value;
      const date = new Date(`${dateValue}T12:00:00`);
      document.getElementById('diagnosticReadyTitle').textContent = `Your ${course.label === 'ABITUR' ? course.title : course.label} diagnostic is ready`;
      document.getElementById('diagnosticReadyExam').textContent = course.title;
      document.getElementById('diagnosticReadyScore').textContent = score;
      document.getElementById('diagnosticReadyDate').textContent = date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      document.getElementById('diagnosticSetupForm').hidden = true;
      document.getElementById('diagnosticReady').hidden = false;
    }

    function courseSubject(course) {
      if (course.family === 'sat') return 'Digital SAT foundations';
      if (course.family === 'act') return 'ACT core skills';
      return course.title.replace(/^AP\s+|^Abitur\s+/, '');
    }

    function courseModules(course) {
      const subject = courseSubject(course);
      return [
        {title:`${subject}: core concepts`, meta:'12 lessons · 1 hr 45 min', state:'Complete', icon:'i-book'},
        {title:`Guided ${subject} practice`, meta:'8 lessons · 52 min remaining', state:'Continue', icon:'i-play'},
        {title:'Strategies and common traps', meta:'10 lessons · 75 practice questions', state:'Not started', icon:'i-target'},
        {title:'Pacing under exam conditions', meta:'6 lessons · 3 timed sets', state:'Not started', icon:'i-history'},
        {title:'Weak-area review and recovery', meta:'Adaptive · Based on recent answers', state:'Not started', icon:'i-chart'}
      ];
    }

    function courseTopics(course) {
      const subject = courseSubject(course);
      const base = course.family === 'sat' ? [
        ['Reading comprehension','Information & Ideas','Find central ideas, evidence, and logical inferences in short passages.','98% · Core'],
        ['Language analysis','Craft & Structure','Interpret words in context and evaluate how a text is organized.','96% · Core'],
        ['Algebra','Linear equations & systems','Solve, interpret, and compare linear relationships.','92% · Likely'],
        ['Advanced Math','Nonlinear equations','Work with quadratics, exponentials, and systems.','89% · Likely'],
        ['Geometry','Geometry & trigonometry','Use angle, length, area, similarity, and trigonometric relationships.','84% · Possible'],
        ['Data Analysis','Problem-solving & data analysis','Model ratios, rates, statistics, and two-variable data.','81% · Possible']
      ] : [
        [`${subject} foundations`,'Core concepts & models','Build the concepts most often tested in this exam.','98% · Core'],
        ['Applied reasoning','Multi-step problem solving','Translate unfamiliar prompts into a reliable solution path.','95% · Core'],
        ['Data interpretation','Tables, graphs & evidence','Read evidence accurately and compare competing claims.','92% · Likely'],
        ['Exam strategy','Timing & common traps','Recognize distractors and choose the fastest valid method.','88% · Likely'],
        ['Mixed review','Cross-topic connections','Combine concepts under realistic exam conditions.','84% · Possible']
      ];
      const progress = [67,33,33,0,0,0];
      const progressLabels = ['2 of 3 tools complete','1 of 3 tools complete','1 of 3 tools complete','0 of 3 tools complete','0 of 3 tools complete','0 of 3 tools complete'];
      const sectionFor = index => {
        if (course.family === 'sat') return index < 2 ? 'Reading & Writing' : 'Math';
        if (course.family === 'act') return index < 2 ? 'English & Reading' : 'Math & Science';
        return index < 3 ? 'Core Concepts' : 'Applied Practice';
      };
      return base.map((item,index) => ({
        group:item[0], title:item[1], description:item[2], priority:item[3],
        priorityKey:item[3].split(' · ')[1].toLowerCase(), priorityScore:Number.parseInt(item[3],10),
        section:sectionFor(index), sectionKey:sectionFor(index).toLowerCase().replace(/[^a-z0-9]+/g,'-'),
        progress:progress[index] ?? 0, progressLabel:progressLabels[index] || 'Not started',
        objectives:[
          `Identify the tested concept and select an efficient approach.`,
          `Apply the method accurately in both direct and contextual questions.`,
          `Explain why common distractors fail and check the final result.`
        ],
        tools:[
          {name:'Study Guide',icon:'i-book',state:index === 0 ? 'Continue' : 'Start',copy:index === 0 ? '2 of 6 sections complete' : 'Concepts, examples, and quick practice'},
          {name:'Flashcards',icon:'i-grid',state:index === 1 ? 'Review' : 'Start',copy:index === 1 ? '36 cards reviewed' : 'Key terms and formulas'},
          {name:'Quiz',icon:'i-exam',state:index === 2 ? 'Continue' : 'Start',copy:index === 2 ? '6 of 12 questions answered' : '12 exam-style questions'}
        ]
      }));
    }

    const courseMockQuestions = [
      {section:'Reading & Writing',question:'Which choice most effectively states the main idea of the passage?',options:['A detail about the study methods','A contrast between two explanations','The author’s central claim and its support','An unrelated historical example']},
      {section:'Reading & Writing',question:'Which transition best completes the text?',options:['Nevertheless,','For example,','Similarly,','In conclusion,']},
      {section:'Math',question:'A linear function passes through (2, 7) and (6, 19). What is its slope?',options:['2','3','4','6']},
      {section:'Math',question:'If x² − 5x + 6 = 0, what are the possible values of x?',options:['1 and 6','2 and 3','−2 and −3','3 and 5']},
      {section:'Math',question:'A circle has radius 6. What is its area?',options:['6π','12π','18π','36π']},
      {section:'Math',question:'Which expression is equivalent to 3(x + 4) − 2x?',options:['x + 4','x + 12','5x + 12','x + 7']}
    ];

    function courseOverviewMarkup(course) {
      const score = course.family === 'sat' ? '1280' : course.family === 'act' ? '28' : '4';
      const scale = course.family === 'sat' ? '/1600' : course.family === 'act' ? '/36' : '/5';
      return `<div class="course-overview-grid">
        <div>
          <section class="course-hub-card">
            <header class="course-hub-head"><div><span class="course-hub-eyebrow">Continue learning</span><h2>Pick up where you left off</h2><p>Your next study action is ready.</p></div><button class="course-link-button" type="button" data-course-switch="study">View plan</button></header>
            <div class="course-next-task"><span class="course-next-icon">${icon('i-book')}</span><div class="course-next-copy"><strong>Linear equations & systems</strong><span>Study Guide · Section 3 of 6</span><div class="course-progress-inline"><i></i></div></div><button class="course-primary-small" type="button" data-course-switch="study">Continue</button></div>
          </section>
          <section class="course-hub-card">
            <header class="course-hub-head"><div><span class="course-hub-eyebrow">Needs attention</span><h2>Topics to improve</h2><p>Based on your latest quiz and mock exam.</p></div><button class="course-link-button" type="button" data-course-switch="results">View all</button></header>
            <div class="course-weak-list"><div class="course-weak-row"><strong>Nonlinear equations</strong><span>92% likely</span></div><div class="course-weak-row"><strong>Ratios, rates & proportions</strong><span>89% likely</span></div><div class="course-weak-row"><strong>Two-variable data</strong><span>81% likely</span></div></div>
          </section>
        </div>
        <div class="course-hub-stats">
          <button class="course-hub-stat" type="button" data-course-switch="mock"><span>Mock Exam</span><strong>14 / 54</strong><p>Attempt in progress · answers saved</p><em>Continue exam →</em></button>
          <button class="course-hub-stat" type="button" data-course-switch="results"><span>Latest score</span><strong>${score}<small>${scale}</small></strong><p>70th percentile · completed Aug 21</p><em>View report →</em></button>
          <button class="course-hub-stat" type="button" data-course-switch="study"><span>Study Plan</span><strong>18%</strong><p>3 of ${course.topics} topics in progress</p><em>Open plan →</em></button>
          <button class="course-hub-stat" type="button" data-course-switch="results"><span>Weak topics</span><strong>3</strong><p>Prioritized by recent performance and exam importance</p><em>Start improving →</em></button>
        </div>
      </div>`;
    }

    function courseStudyPlanMarkup(course) {
      const allTopics = courseTopics(course);
      const visibleTopics = allTopics
        .filter(topic => studyPriorityFilter === 'all' || topic.priorityKey === studyPriorityFilter)
        .filter(topic => studySectionFilter === 'all' || topic.sectionKey === studySectionFilter)
        .sort((a,b) => b.priorityScore - a.priorityScore);
      const sections = [...new Set(allTopics.map(topic => topic.section))]
        .map(section => ({section,topics:visibleTopics.filter(topic => topic.section === section)}))
        .filter(group => group.topics.length);
      const sectionOptions = [['all','Section: All'],...[...new Map(allTopics.map(topic => [topic.sectionKey,topic.section])).entries()].map(([key,label]) => [key,`Section: ${label}`])];
      const priorityOptions = [['all','Importance: All'],['core','Importance: Core'],['likely','Importance: Likely'],['possible','Importance: Possible']];
      const optionsMarkup = (items,value) => items.map(([key,label]) => `<option value="${key}"${key === value ? ' selected' : ''}>${label}</option>`).join('');
      return `<section class="study-breakdown" aria-labelledby="studyBreakdownTitle">
        <header class="study-breakdown-toolbar">
          <h2 id="studyBreakdownTitle">Topic Breakdown</h2>
          <div class="study-breakdown-filters" aria-label="Topic filters">
            <label class="study-filter-control section"><span class="sr-only">Filter by section</span><select data-study-section-filter>${optionsMarkup(sectionOptions,studySectionFilter)}</select></label>
            <label class="study-filter-control importance"><span class="sr-only">Filter by importance</span><select data-study-priority-filter>${optionsMarkup(priorityOptions,studyPriorityFilter)}</select></label>
          </div>
        </header>
        <div class="study-priority-note">${icon('i-target')}<span>Solvely prioritizes exam topics from your materials and the exam format. Importance and study progress are tracked separately.</span></div>
        <div class="study-topic-sections">${sections.length ? sections.map(({section,topics}) => {
          const sectionId = section.replace(/[^a-z0-9]+/gi,'-').toLowerCase();
          const collapsed = collapsedStudySections.has(section);
          return `<section class="study-topic-section${collapsed ? ' collapsed' : ''}" aria-labelledby="${sectionId}">
          <button class="study-section-head" type="button" data-study-section-toggle="${section}" aria-expanded="${!collapsed}" aria-controls="${sectionId}-topics"><h3 id="${sectionId}">${section}</h3><span class="study-section-meta"><span>${topics.length} ${topics.length === 1 ? 'Topic' : 'Topics'}</span>${icon('i-chevron')}</span></button>
          ${collapsed ? '' : `<div id="${sectionId}-topics" role="table" aria-label="${section} topics">
            <div class="study-topic-table-head" role="row"><span role="columnheader">Topic Area</span><span role="columnheader">Progress</span></div>
            ${topics.map(topic => `<article class="study-topic-row" role="row" tabindex="0" aria-label="${topic.title}. ${topic.priority}. ${topic.progressLabel}. ${topic.progress} percent complete">
              <div class="study-topic-copy" role="cell"><strong>${topic.title}</strong><span>${topic.description}</span><div class="study-topic-meta"><span class="study-topic-importance ${topic.priorityKey}">${topic.priority}</span><span>${topic.group}</span></div></div>
              <div class="study-topic-progress" role="cell"><span class="study-topic-progress-copy"><strong>${topic.progress ? 'In progress' : 'Not started'}</strong><span>${topic.progressLabel}</span></span><span class="study-topic-progress-meter"><strong>${topic.progress}%</strong><span class="study-topic-progress-track"><i class="${topic.progress === 100 ? 'complete' : ''}" style="width:${topic.progress}%"></i></span></span></div>
              <aside class="study-topic-popover" aria-label="${topic.title} summary and study tools">
                <div class="study-topic-popover-head"><h4>${topic.title}</h4><span class="${topic.priorityKey}">${topic.priority}</span></div>
                <p>${topic.description}</p>
                <small>Study with</small>
                <div class="study-topic-actions">${topic.tools.map(tool => `<button class="study-topic-tool" type="button" data-tool-state="${tool.state} ${tool.name} for ${topic.title}">${icon(tool.icon)}<span>${tool.name}</span></button>`).join('')}</div>
              </aside>
            </article>`).join('')}
          </div>`}
        </section>`;
        }).join('') : '<div class="study-topic-empty">No topics match these section and importance filters.</div>'}</div>
      </section>`;
    }

    function mockStateCopy(course) {
      const score = course.family === 'sat' ? '1280 / 1600' : course.family === 'act' ? '28 / 36' : '4 / 5';
      if (mockExamPreviewState === 'start') return {label:'Not started',title:`${course.label} Mock Exam`,copy:'Simulate the real test, reveal your current score level, and find the topics that need the most attention.',metrics:[['Questions','54'],['Time','2 hr 14 min'],['Sections','2']],primary:'Start Exam'};
      if (mockExamPreviewState === 'processing') return {label:'Processing',title:'Scoring your exam',copy:'Your answers were submitted. Solvely is calculating the official-scale score and building your improvement report.',metrics:[],primary:'Processing'};
      if (mockExamPreviewState === 'finish') return {label:'Finish',title:'Your report is ready',copy:'Review the official-scale score, section performance, question explanations, and personalized topics to improve.',metrics:[['Total score',score],['Percentile','70th'],['Answered','54 / 54']],primary:'View Results'};
      return {label:'In progress',title:`Continue ${course.label} Mock Exam`,copy:'Resume the same attempt with your answers, current section, timer, and flagged questions exactly where you stopped.',metrics:[['Answered','14 / 54'],['Time left','1 hr 36 min'],['Current section','Math']],primary:'Continue'};
    }

    function courseMockSessionMarkup(course) {
      const question = courseMockQuestions[courseQuestionIndex];
      const sections = [...new Set(courseMockQuestions.map(item => item.section))];
      return `<div class="mock-session-layout">
        <aside class="question-navigator" aria-label="Question Navigator"><h2>Question Navigator</h2><p>${Object.keys(courseAnswers).length} of ${courseMockQuestions.length} answered · answers saved</p>${sections.map(section => `<div class="question-nav-section"><strong>${section}</strong><div class="question-number-grid">${courseMockQuestions.map((item,index) => item.section === section ? `<button class="question-number${index === courseQuestionIndex ? ' current' : ''}${courseAnswers[index] !== undefined ? ' answered' : ''}" type="button" data-question-index="${index}" aria-label="Question ${index + 1}">${index + 1}</button>` : '').join('')}</div></div>`).join('')}<button class="mock-secondary-action" style="width:100%;margin-top:15px" type="button" data-mock-session="exit">Save & exit</button></aside>
        <section class="mock-question-card"><div class="mock-question-top"><span>${question.section}</span><span>Question ${courseQuestionIndex + 1} of ${courseMockQuestions.length}</span></div><h2>${question.question}</h2><div class="mock-choice-list">${question.options.map((option,index) => `<button class="mock-choice${courseAnswers[courseQuestionIndex] === index ? ' selected' : ''}" type="button" data-choice-index="${index}"><i>${String.fromCharCode(65 + index)}</i><span>${option}</span></button>`).join('')}</div><div class="mock-session-actions"><button class="mock-secondary-action" type="button" data-question-move="prev"${courseQuestionIndex === 0 ? ' disabled' : ''}>Previous</button><div>${courseQuestionIndex === courseMockQuestions.length - 1 ? `<button class="mock-primary-action" type="button" data-mock-session="submit">Submit exam</button>` : `<button class="mock-primary-action" type="button" data-question-move="next">Save & next</button>`}</div></div></section>
      </div>`;
    }

    function courseMockExamMarkup(course) {
      if (courseMockSessionOpen) return courseMockSessionMarkup(course);
      const view = mockStateCopy(course);
      const processing = mockExamPreviewState === 'processing';
      return `<div class="mock-state-shell">
        <div class="mock-state-nav" role="tablist" aria-label="Mock exam attempt states">${['start','continue','processing','finish'].map(state => `<button class="mock-state-button${mockExamPreviewState === state ? ' active' : ''}" type="button" data-mock-state="${state}">${state === 'start' ? 'Start' : state === 'continue' ? 'Continue' : state === 'processing' ? 'Processing' : 'Finish'}</button>`).join('')}</div>
        <div class="mock-exam-stage"><section class="mock-exam-card">${processing ? `<div class="mock-processing"><div><div class="mock-spinner"></div><span class="mock-exam-status processing">Processing</span><h2>${view.title}</h2><p>${view.copy}</p></div></div>` : `<span class="mock-exam-status">${view.label}</span><h2>${view.title}</h2><p>${view.copy}</p><div class="mock-exam-metrics">${view.metrics.map(([label,value]) => `<div class="mock-exam-metric"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div><div class="mock-exam-actions"><button class="mock-primary-action" type="button" data-mock-primary>${view.primary}</button>${mockExamPreviewState === 'finish' ? '<button class="mock-secondary-action" type="button" data-course-switch="results">Practice Weak Topics</button>' : ''}</div>`}</section>
          <aside class="mock-benefit-card"><h3>What this exam gives you</h3><div class="mock-benefit-list"><div class="mock-benefit-item"><i>1</i><span><strong>Real exam simulation</strong><span>Official structure, timing, and score scale.</span></span></div><div class="mock-benefit-item"><i>2</i><span><strong>Saved progress</strong><span>Resume the same attempt without losing answers or flags.</span></span></div><div class="mock-benefit-item"><i>3</i><span><strong>Actionable report</strong><span>Section scores, explanations, and targeted improvement.</span></span></div></div></aside></div>
      </div>`;
    }

    const courseReviewQuestions = [
      {status:'incorrect',title:'Where should the comma be placed in the sentence?',user:'Your answer: No comma',correct:'Correct answer: After the introductory phrase',explanation:'Introductory phrases are followed by a comma before the independent clause.'},
      {status:'correct',title:'What is the slope between (2, 7) and (6, 19)?',user:'Your answer: 3',correct:'Correct answer: 3',explanation:'The change in y is 12 and the change in x is 4, so the slope is 3.'},
      {status:'incorrect',title:'Which model best represents the nonlinear relationship?',user:'Your answer: Linear model',correct:'Correct answer: Quadratic model',explanation:'The constant second differences indicate a quadratic rather than linear relationship.'}
    ];

    function courseResultsMarkup(course) {
      const score = course.family === 'sat' ? '1280' : course.family === 'act' ? '28' : '4';
      const scale = course.family === 'sat' ? '/1600' : course.family === 'act' ? '/36' : '/5';
      const sectionScores = course.family === 'sat' ? [['Reading & Writing',650,81],['Math',630,79]] : [['Core knowledge',82,82],['Applied reasoning',74,74]];
      const skills = [['Algebra',88],['Advanced Math',62],['Problem Solving & Data',71],['Geometry',77]];
      const visibleQuestions = courseReviewQuestions.filter(item => courseResultsFilter === 'all' || item.status === courseResultsFilter);
      return `<div class="results-layout">
        <div class="results-summary-grid"><section class="results-score-card"><span>Latest Mock Exam</span><strong>${score}<small>${scale}</small></strong><p>70th percentile · Aug 21</p></section><section class="results-ai-card"><span class="course-hub-eyebrow">AI Overview</span><h2>Strong foundation, with two high-impact gaps</h2><p>You are consistent in core algebra and reading evidence. Focus next on nonlinear equations and proportional reasoning; improving those likely topics should raise both accuracy and pacing before the next full mock.</p></section></div>
        <div class="results-two-column"><div><section class="results-section-card"><header class="results-card-head"><h2>Section performance</h2><span>Official score scale</span></header>${sectionScores.map(([label,value,percent]) => `<div class="results-performance-row"><strong>${label}</strong><i><b style="width:${percent}%"></b></i><em>${value}</em></div>`).join('')}</section><section class="results-section-card" style="margin-top:14px"><header class="results-card-head"><h2>Knowledge & Skills</h2><span>Relative strength</span></header>${skills.map(([label,value]) => `<div class="results-performance-row"><strong>${label}</strong><i><b style="width:${value}%"></b></i><em>${value}%</em></div>`).join('')}</section></div><aside class="improve-card" id="topicsToImprove"><h2>Topics to Improve</h2><p>Ordered by recent performance and exam importance.</p><div class="improve-topic-list"><div class="improve-topic"><span><strong>Nonlinear equations</strong><span>92% likely · Not started</span></span><button type="button" data-course-action="Practice nonlinear equations">Practice</button></div><div class="improve-topic"><span><strong>Ratios, rates & proportions</strong><span>89% likely · 6 of 12 answered</span></span><button type="button" data-course-action="Continue ratios practice">Continue</button></div><div class="improve-topic"><span><strong>Two-variable data</strong><span>81% likely · Completed</span></span><button type="button" data-course-action="Review two-variable data">Review</button></div></div></aside></div>
        <section class="results-review-card"><header class="results-card-head"><h2>Question Review</h2><span>Answers and explanations</span></header><div class="results-filter-tabs">${['all','incorrect','correct'].map(filter => `<button class="results-filter-button${courseResultsFilter === filter ? ' active' : ''}" type="button" data-results-filter="${filter}">${filter === 'all' ? 'All Questions' : filter[0].toUpperCase() + filter.slice(1)}</button>`).join('')}</div><div>${visibleQuestions.map((item,index) => `<article class="review-question"><span>${item.status} · Question ${index + 1}</span><h3>${item.title}</h3>${item.status === 'incorrect' ? `<div class="review-answer incorrect">${item.user}</div>` : ''}<div class="review-answer correct">${item.correct}</div><p class="review-explanation">${item.explanation}</p></article>`).join('')}</div></section>
        <div class="results-footer-actions"><button class="mock-secondary-action" type="button" data-results-action="retake">Retake</button><button class="mock-primary-action" type="button" data-results-action="improve">Practice Weak Topics</button></div>
      </div>`;
    }

    function wireCoursePackageInteractions(course) {
      coursePackagePanel.querySelectorAll('[data-course-switch]').forEach(button => button.addEventListener('click', () => { activeCoursePackageTab = button.dataset.courseSwitch; courseMockSessionOpen = false; renderCoursePackage(); window.scrollTo({top:courseWorkspace.offsetTop,behavior:'smooth'}); }));
      coursePackagePanel.querySelectorAll('[data-course-action]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.courseAction + ' opened')));
      coursePackagePanel.querySelectorAll('[data-study-priority-filter]').forEach(select => select.addEventListener('change', () => { studyPriorityFilter = select.value; renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-study-section-filter]').forEach(select => select.addEventListener('change', () => { studySectionFilter = select.value; renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-study-section-toggle]').forEach(button => button.addEventListener('click', () => { const section = button.dataset.studySectionToggle; if (collapsedStudySections.has(section)) collapsedStudySections.delete(section); else collapsedStudySections.add(section); renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-tool-state]').forEach(button => button.addEventListener('click', () => showToast(`${button.dataset.toolState} opened`)));
      coursePackagePanel.querySelectorAll('[data-mock-state]').forEach(button => button.addEventListener('click', () => { mockExamPreviewState = button.dataset.mockState; courseMockSessionOpen = false; renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-mock-primary]').forEach(button => button.addEventListener('click', () => {
        if (mockExamPreviewState === 'finish') { activeCoursePackageTab = 'results'; renderCoursePackage(); return; }
        if (mockExamPreviewState === 'processing') return;
        courseMockSessionOpen = true; renderCoursePackage();
      }));
      coursePackagePanel.querySelectorAll('[data-question-index]').forEach(button => button.addEventListener('click', () => { courseQuestionIndex = Number(button.dataset.questionIndex); renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-choice-index]').forEach(button => button.addEventListener('click', () => { courseAnswers[courseQuestionIndex] = Number(button.dataset.choiceIndex); renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-question-move]').forEach(button => button.addEventListener('click', () => { courseQuestionIndex = Math.max(0,Math.min(courseMockQuestions.length - 1,courseQuestionIndex + (button.dataset.questionMove === 'next' ? 1 : -1))); renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-mock-session]').forEach(button => button.addEventListener('click', () => {
        if (button.dataset.mockSession === 'exit') { courseMockSessionOpen = false; mockExamPreviewState = 'continue'; renderCoursePackage(); showToast('Exam progress saved'); return; }
        courseMockSessionOpen = false; mockExamPreviewState = 'processing'; renderCoursePackage(); showToast('Exam submitted. Scoring in progress.');
        setTimeout(() => { if (activeCoursePackageTab === 'mock' && mockExamPreviewState === 'processing') { mockExamPreviewState = 'finish'; renderCoursePackage(); showToast('Your score report is ready'); } }, 1500);
      }));
      coursePackagePanel.querySelectorAll('[data-results-filter]').forEach(button => button.addEventListener('click', () => { courseResultsFilter = button.dataset.resultsFilter; renderCoursePackage(); }));
      coursePackagePanel.querySelectorAll('[data-results-action]').forEach(button => button.addEventListener('click', () => {
        if (button.dataset.resultsAction === 'retake') { mockExamPreviewState = 'start'; courseMockSessionOpen = false; activeCoursePackageTab = 'mock'; renderCoursePackage(); return; }
        document.getElementById('topicsToImprove')?.scrollIntoView({behavior:'smooth',block:'center'});
      }));
    }

    function renderCoursePackage() {
      const course = examCoursePackages[activeCoursePackageIndex];
      if (!course) return;
      document.getElementById('courseWorkspaceFamily').textContent = course.label;
      document.getElementById('courseWorkspaceTitle').textContent = course.title;
      document.getElementById('courseWorkspaceDescription').textContent = `A focused ${course.title} plan with topic study tools, realistic mock exams, score reports, and targeted improvement.`;
      document.getElementById('courseWorkspaceMetrics').innerHTML = `<span class="course-package-metric">${icon('i-book')}<span><strong>${course.topics}</strong> topics</span></span><span class="course-package-metric">${icon('i-grid')}<span><strong>3</strong> study tools</span></span><span class="course-package-metric">${icon('i-exam')}<span><strong>2</strong> full mock exams</span></span>`;
      document.querySelectorAll('[data-course-tab]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.courseTab === activeCoursePackageTab)));
      if (activeCoursePackageTab === 'study') coursePackagePanel.innerHTML = courseStudyPlanMarkup(course);
      else if (activeCoursePackageTab === 'mock') coursePackagePanel.innerHTML = courseMockExamMarkup(course);
      else if (activeCoursePackageTab === 'results') coursePackagePanel.innerHTML = courseResultsMarkup(course);
      else coursePackagePanel.innerHTML = courseOverviewMarkup(course);
      wireCoursePackageInteractions(course);
    }

    const examPredictorTopics = [
      ['Model Selection',98,30],
      ['Stationarity Testing',96,0],
      ['ARIMA Modeling',94,0],
      ['SARIMA Modeling',92,0],
      ['Dynamic Regression',91,0],
      ['Panel Data',89,0],
      ['Logistic Regression',87,0],
      ['Heteroscedasticity WLS',85,0],
      ['Regression Diagnostics',83,0],
      ['Sample Testing',78,0]
    ];

    function renderExamPredictorSample() {
      predictorTopicsList.innerHTML = examPredictorTopics.map(([topic,likelihood,mastery]) => `
        <div class="predictor-topic-row" role="row" tabindex="0">
          <span class="predictor-topic-name" role="cell">${topic}</span>
          <span class="predictor-topic-likelihood${likelihood >= 95 ? ' high' : ''}" role="cell">${likelihood}%</span>
          <span class="predictor-topic-mastery" role="cell"><strong>${mastery}%</strong><i class="predictor-topic-bar"><i style="width:${mastery}%"></i></i></span>
          <aside class="predictor-topic-popover" aria-label="${topic} practice options">
            <div class="predictor-topic-popover-head"><h4>${topic}</h4><span>${mastery}% mastered</span></div>
            <p>${likelihood}% likely to appear</p>
            <small>Practice with</small>
            <div class="predictor-topic-actions">
              <button type="button" data-predictor-action="${topic} exam questions opened">☷　Exam Questions</button>
              <button type="button" data-predictor-action="${topic} flashcards opened">◆　Flashcards</button>
            </div>
          </aside>
        </div>`).join('');
      examPredictorWorkspace.querySelectorAll('[data-predictor-action]').forEach(button => {
        button.onclick = () => showToast(button.dataset.predictorAction);
      });
    }

    function openExamPredictorSample(index = 0, pushRoute = true) {
      activeExamPredictorFeatureIndex = Math.max(0, Math.min(capabilityData.mock.examples.length - 1, Number(index) || 0));
      activeCoursePackageIndex = null;
      homeWorkspace.hidden = true;
      courseWorkspace.hidden = true;
      examPredictorWorkspace.hidden = false;
      document.body.classList.add('exam-predictor-open');
      document.getElementById('homeNav').classList.remove('active');
      document.getElementById('examPredictorNav').classList.add('active');
      document.documentElement.style.setProperty('--accent', '#2368f0');
      document.documentElement.style.setProperty('--accent-rgb', '35, 104, 240');
      renderExamPredictorSample();
      document.title = 'BOLD 5042 Final Exam — Solvely';
      if (pushRoute && location.hash !== '#exam-predictor-sample') history.pushState({examPredictorSample:true}, '', '#exam-predictor-sample');
      window.scrollTo({top:0,behavior:'smooth'});
    }

    function showExamPredictorHome() {
      examPredictorWorkspace.hidden = true;
      courseWorkspace.hidden = true;
      homeWorkspace.hidden = false;
      document.body.classList.remove('exam-predictor-open');
      document.getElementById('examPredictorNav').classList.remove('active');
      document.getElementById('homeNav').classList.add('active');
      document.title = 'Solvely — One place to learn anything';
      selectWorkspaceMode('exam', false);
      window.scrollTo({top:0,behavior:'smooth'});
    }

    function closeExamPredictorSample() {
      if (/^#exam-predictor-/.test(location.hash) && history.state?.examPredictorSample) history.back();
      else {
        history.replaceState(null, '', location.pathname + location.search);
        showExamPredictorHome();
      }
    }

    function openCoursePackage(index, pushRoute = true) {
      const course = examCoursePackages[index];
      if (!course) return;
      activeCoursePackageIndex = index;
      activeCoursePackageTab = 'overview';
      studyPriorityFilter = 'all';
      studySectionFilter = 'all';
      collapsedStudySections = new Set();
      mockExamPreviewState = 'continue';
      courseMockSessionOpen = false;
      courseQuestionIndex = 0;
      courseAnswers = {0:2,2:1};
      courseResultsFilter = 'all';
      homeWorkspace.hidden = true;
      examPredictorWorkspace.hidden = true;
      courseWorkspace.hidden = false;
      document.body.classList.remove('exam-predictor-open');
      document.getElementById('examPredictorNav').classList.remove('active');
      document.getElementById('homeNav').classList.add('active');
      document.documentElement.style.setProperty('--accent', '#2368f0');
      document.documentElement.style.setProperty('--accent-rgb', '35, 104, 240');
      renderCoursePackage();
      document.title = `${course.title} — Solvely`;
      if (pushRoute && location.hash !== `#course-${index}`) history.pushState({courseIndex:index}, '', `#course-${index}`);
      window.scrollTo({top:0, behavior:'smooth'});
    }

    function showExamCatalogHome() {
      activeCoursePackageIndex = null;
      courseWorkspace.hidden = true;
      examPredictorWorkspace.hidden = true;
      homeWorkspace.hidden = false;
      document.body.classList.remove('exam-predictor-open');
      document.getElementById('examPredictorNav').classList.remove('active');
      document.getElementById('homeNav').classList.add('active');
      document.title = 'Solvely — One place to learn anything';
      selectWorkspaceMode('exam', false);
      window.scrollTo({top:0, behavior:'smooth'});
    }

    function closeCoursePackage() {
      if (/^#course-\d+$/.test(location.hash) && Number(history.state?.courseIndex) === activeCoursePackageIndex) history.back();
      else {
        history.replaceState(null, '', location.pathname + location.search);
        showExamCatalogHome();
      }
    }

    function syncCourseRoute() {
      if (/^#exam-predictor-/.test(location.hash)) {
        openExamPredictorSample(0, false);
        return;
      }
      if (!examPredictorWorkspace.hidden) {
        showExamPredictorHome();
        return;
      }
      const match = location.hash.match(/^#course-(\d+)$/);
      if (match && examCoursePackages[Number(match[1])]) openCoursePackage(Number(match[1]), false);
      else if (activeCoursePackageIndex !== null) showExamCatalogHome();
    }

    function updateComposerTools(key) {
      const attachButton = document.getElementById('attachButton');
      const imageButton = document.getElementById('imageButton');
      const fileInput = document.getElementById('fileInput');
      const linkButton = document.getElementById('linkButton');
      const calculatorButton = document.getElementById('calculatorButton');
      const modelButton = document.getElementById('modelButton');
      const youtubeCapabilities = ['guide', 'flashcards', 'quiz', 'podcast'];
      const writingCapability = capabilityGroups.writing.includes(key);
      const supportsFileUpload = capabilitySupportsFileUpload(key);
      const linkKind = youtubeCapabilities.includes(key) ? 'youtube' : 'none';
      const supportsMultipleSources = multiSourceCapabilities.has(key);

      attachButton.hidden = !supportsFileUpload;
      attachButton.setAttribute('aria-label', writingCapability ? 'Upload PDF, Word, or TXT' : supportsMultipleSources ? 'Attach images or files' : 'Attach a file');
      attachButton.title = writingCapability ? 'Upload PDF, Word, or TXT' : supportsMultipleSources ? 'Attach images or files · up to 10 sources' : 'Attach a file';
      fileInput.accept = writingCapability ? WRITING_FILE_ACCEPT : '';
      fileInput.multiple = !writingCapability;
      imageButton.hidden = writingCapability;
      // Phase 1: preserve the calculator implementation while hiding its homepage entry.
      calculatorButton.hidden = true;
      modelButton.hidden = key !== 'solver';
      linkButton.hidden = linkKind === 'none';
      linkButton.dataset.linkKind = linkKind;
      linkButton.querySelector('use').setAttribute('href', linkKind === 'youtube' ? '#i-youtube' : '#i-link');
      linkButton.setAttribute('aria-label', linkKind === 'youtube' ? 'Paste a YouTube link' : 'Paste a reference link');
      linkButton.title = linkKind === 'youtube' ? 'Paste YouTube link' : 'Paste link';
      linkInput.placeholder = linkKind === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/reference';
      linkInput.setAttribute('aria-label', linkKind === 'youtube' ? 'YouTube URL' : 'Reference URL');
      document.getElementById('linkPopoverHelp').textContent = linkKind === 'youtube'
        ? 'Paste a public YouTube video to turn it into study material.'
        : 'Public webpages and document links are supported.';

      if (modelButton.hidden) {
        document.getElementById('modelPopover').hidden = true;
        modelButton.setAttribute('aria-expanded', 'false');
      }
    }

    function selectCapability(key, preservePrompt = true) {
      if (!capabilityData[key]) return;
      selectedCapability = key;
      const capability = capabilityData[key];
      linkPopover.hidden = true;
      document.getElementById('linkButton').classList.remove('active');
      document.getElementById('linkButton').setAttribute('aria-expanded','false');
      if (!calculatorPanel.hidden) closeAdvancedCalculator(document.getElementById('calculatorButton'));
      document.documentElement.style.setProperty('--accent', key === 'podcast' ? '#7458df' : '#2368f0');
      document.documentElement.style.setProperty('--accent-rgb', key === 'podcast' ? '116, 88, 223' : '35, 104, 240');
      promptInput.placeholder = capability.placeholder;
      sendLabel.textContent = capability.action;
      if (!preservePrompt) promptInput.value = '';
      updateComposerTools(key);
      citationSelectors.hidden = key !== 'aiCitation';
      if (key === 'aiCitation') syncCitationSelectors();
      else closeCitationMenus();
      if (writingToolData[key]) updateWritingTool(key);
      else {
        const writingToolOptions = document.getElementById('writingToolOptions');
        writingToolOptions.hidden = true;
        writingToolOptions.innerHTML = '';
      }
      enforceWritingInputLimit();
      renderCapabilities();
      renderExamples();
      const catalog = document.getElementById('examCatalog');
      catalog.hidden = key !== 'mock';
      if (key === 'mock') renderCourseCatalog();
      updateSubmit();
    }

    function flashcardStudyMarkup(example) {
      const cards = example && example.cards ? example.cards : [];
      const firstCard = cards[0] || { front:'Active recall question', back:'Active recall answer' };
      const firstCardHasImage = Boolean(firstCard.image);
      return `<div class="flash-study" data-flash-study>
        <div class="flash-study-status"><strong data-flash-counter>Card 1 of ${cards.length || 1}</strong><span data-flash-side>Question</span></div>
        <div class="flash-study-progress" aria-hidden="true"><span data-flash-progress style="width:${100 / Math.max(cards.length,1)}%"></span></div>
        <div class="flash-card-stage">
          <button class="flash-interactive" type="button" data-flashcard aria-label="Flip flashcard 1">
            <span class="flash-interactive-inner">
              <span class="flash-face front"><small>QUESTION</small><strong data-flash-front>${firstCard.front}</strong><small>Click to reveal the answer</small></span>
              <span class="flash-face back${firstCardHasImage ? ' has-image' : ''}" data-flash-back-face><small>ANSWER</small><span class="flash-back-content${firstCardHasImage ? ' has-image' : ''}" data-flash-back-content><img class="flash-back-image" data-flash-image${firstCardHasImage ? ` src="${firstCard.image}" alt="${firstCard.imageAlt || ''}"` : ' hidden alt=""'} /><strong data-flash-back>${firstCard.back}</strong></span><small>Click to see the question</small></span>
            </span>
          </button>
        </div>
        <div class="flash-study-controls">
          <button class="flash-nav" type="button" data-flash-prev aria-label="Previous flashcard">‹</button>
          <div class="flash-study-dots" data-flash-dots>${cards.map((_,index) => `<button class="flash-study-dot${index === 0 ? ' active' : ''}" type="button" data-flash-index="${index}" aria-label="Go to flashcard ${index + 1}"></button>`).join('')}</div>
          <button class="flash-nav" type="button" data-flash-next aria-label="Next flashcard">›</button>
        </div>
        <p class="flash-study-hint">Click to flip · Swipe or use the arrows to move through the deck</p>
      </div>`;
    }

    function interactionMarkup(type, example = null) {
      if (type.startsWith('exam-')) type = 'exam';
      if (type === 'solver-step-solution') return solverStepSolutionInteraction();
      if (type === 'graph') return '<div class="graph-control"><label for="exampleGraphRange"><span>Move along the curve</span><output data-graph-x>2.0</output></label><input id="exampleGraphRange" type="range" min="-4" max="6" value="2" step="0.1" data-graph-slider><p class="graph-readout" data-graph-readout>At x = 2.0, y = −1.00</p></div>';
      if (type === 'video') return '<div class="media-control-row"><button class="media-toggle" type="button" data-media-toggle aria-label="Play explanation">' + icon('i-play') + '</button><span class="media-copy"><strong>Generated explanation</strong><span>Geometry walkthrough</span></span><span class="interaction-time" data-media-time>0:05 / 1:18</span></div><div class="interaction-progress"><span data-media-progress></span></div>';
      if (type === 'chemistry') return chemistryInteractionMarkup(example);
      if (type === 'accounting') return '<h3>Key insights</h3><div class="insight-selector"><button class="insight-chip active" type="button" data-accounting-metric="COGS">COGS</button><button class="insight-chip" type="button" data-accounting-metric="Operating expenses">Operating expenses</button><button class="insight-chip" type="button" data-accounting-metric="Net margin">Net margin</button></div><p class="insight-readout" data-accounting-readout>Circuita manages production costs more efficiently: COGS is 60% of revenue versus 70% for Voltix.</p>';
      if (type === 'flashcards') return flashcardStudyMarkup(example);
      if (type === 'quiz') return quizInteractionMarkup(example);
      if (type === 'guide') return guideInteractionMarkup(example);
      if (type === 'podcast') return podcastInteractionMarkup(example);
      if (type === 'exam') return '<h3>Sample question</h3><div class="quiz-interactive"><button class="quiz-answer" data-answer="wrong">A. 18</button><button class="quiz-answer" data-answer="correct">B. 24</button><button class="quiz-answer" data-answer="wrong">C. 30</button><button class="quiz-answer" data-answer="wrong">D. 36</button><p class="quiz-feedback" data-quiz-feedback>Choose an answer to preview instant scoring.</p></div>';
      return '<h3>Step-by-step solution</h3><div class="solution-stepper"><button class="solution-step active" type="button" data-solution-step="1"><span>1</span><small>Factor the expression.</small></button><button class="solution-step" type="button" data-solution-step="2"><span>2</span><small>Set each factor equal to zero.</small></button><button class="solution-step" type="button" data-solution-step="3"><span>3</span><small>Verify both roots.</small></button></div>';
    }
    function bindDialogInteraction(type, example = null) {
      const interaction = document.getElementById('dialogInteraction');
      const graphSlider = interaction.querySelector('[data-graph-slider]');
      if (graphSlider) graphSlider.addEventListener('input', () => {
        const x = Number(graphSlider.value);
        const y = x * x - 4 * x + 3;
        interaction.querySelector('[data-graph-x]').textContent = x.toFixed(1);
        interaction.querySelector('[data-graph-readout]').textContent = `At x = ${x.toFixed(1)}, y = ${y.toFixed(2).replace('-', '−')}`;
      });
      const chemistryStructures = example && Array.isArray(example.structures) ? example.structures : [];
      const renderChemistryStructure = index => {
        const structure = chemistryStructures[index];
        if (!structure) return;
        const chemistryImage = document.querySelector('#dialogPreview [data-chemistry-image]');
        if (chemistryImage) {
          chemistryImage.src = structure.image;
          chemistryImage.alt = structure.title;
        }
        interaction.querySelectorAll('[data-chemistry-index]').forEach(tab => {
          const active = Number(tab.dataset.chemistryIndex) === index;
          tab.classList.toggle('active', active);
          tab.setAttribute('aria-selected', String(active));
        });
        const summary = interaction.querySelector('[data-chemistry-summary]');
        const facts = interaction.querySelector('[data-chemistry-facts]');
        if (summary) summary.textContent = structure.summary;
        if (facts) facts.innerHTML = structure.facts.map(([label,value]) => `<div class="chemistry-fact"><small>${label}</small><strong>${value}</strong></div>`).join('');
        document.getElementById('dialogTitle').textContent = structure.title;
        document.getElementById('dialogDescription').textContent = structure.summary;
      };
      interaction.querySelectorAll('[data-chemistry-index]').forEach(tab => tab.addEventListener('click', () => renderChemistryStructure(Number(tab.dataset.chemistryIndex))));
      if (chemistryStructures.length) renderChemistryStructure(0);
      const accountingNotes = {
        'COGS':'Circuita manages production costs more efficiently: COGS is 60% of revenue versus 70% for Voltix.',
        'Operating expenses':'Voltix controls overhead better: operating expenses are 20% of revenue versus 30% for Circuita.',
        'Net margin':'Both companies reach a 10% net margin; Circuita’s lower COGS is offset by its higher overhead.'
      };
      interaction.querySelectorAll('[data-accounting-metric]').forEach(metric => metric.addEventListener('click', () => {
        const selectedMetric = metric.dataset.accountingMetric;
        interaction.querySelectorAll('[data-accounting-metric]').forEach(item => item.classList.toggle('active', item === metric));
        document.querySelectorAll('#dialogPreview [data-accounting-cell]').forEach(cell => cell.classList.toggle('is-highlighted', cell.dataset.accountingCell === selectedMetric));
        interaction.querySelector('[data-accounting-readout]').textContent = accountingNotes[selectedMetric];
      }));
      const flashStudy = interaction.querySelector('[data-flash-study]');
      if (flashStudy) {
        const cards = example && example.cards ? example.cards : [];
        const flashcard = flashStudy.querySelector('[data-flashcard]');
        const flashBackFace = flashStudy.querySelector('[data-flash-back-face]');
        const flashBackContent = flashStudy.querySelector('[data-flash-back-content]');
        const flashBackImage = flashStudy.querySelector('[data-flash-image]');
        const previousButton = flashStudy.querySelector('[data-flash-prev]');
        const nextButton = flashStudy.querySelector('[data-flash-next]');
        let cardIndex = 0;
        let pointerStartX = null;
        let pointerDeltaX = 0;
        let suppressClick = false;
        let changingCard = false;

        const renderFlashcard = () => {
          const card = cards[cardIndex];
          if (!card) return;
          flashcard.classList.remove('flipped','swipe-left','swipe-right','dragging');
          flashcard.style.transform = '';
          flashcard.style.opacity = '';
          flashStudy.querySelector('[data-flash-front]').textContent = card.front;
          flashStudy.querySelector('[data-flash-back]').textContent = card.back;
          const hasImage = Boolean(card.image);
          flashBackFace.classList.toggle('has-image', hasImage);
          flashBackContent.classList.toggle('has-image', hasImage);
          flashBackImage.hidden = !hasImage;
          if (hasImage) {
            flashBackImage.src = card.image;
            flashBackImage.alt = card.imageAlt || '';
          } else {
            flashBackImage.removeAttribute('src');
            flashBackImage.alt = '';
          }
          flashStudy.querySelector('[data-flash-counter]').textContent = `Card ${cardIndex + 1} of ${cards.length}`;
          flashStudy.querySelector('[data-flash-side]').textContent = 'Question';
          flashStudy.querySelector('[data-flash-progress]').style.width = `${((cardIndex + 1) / cards.length) * 100}%`;
          flashcard.setAttribute('aria-label', `Flip flashcard ${cardIndex + 1}`);
          previousButton.disabled = cardIndex === 0;
          nextButton.disabled = cardIndex === cards.length - 1;
          flashStudy.querySelectorAll('[data-flash-index]').forEach(dot => dot.classList.toggle('active', Number(dot.dataset.flashIndex) === cardIndex));
        };

        const moveToCard = (nextIndex, direction) => {
          if (changingCard || nextIndex < 0 || nextIndex >= cards.length || nextIndex === cardIndex) return;
          changingCard = true;
          flashcard.classList.remove('flipped');
          flashcard.classList.add(direction > 0 ? 'swipe-left' : 'swipe-right');
          setTimeout(() => {
            cardIndex = nextIndex;
            renderFlashcard();
            changingCard = false;
          }, 190);
        };

        flashcard.addEventListener('click', () => {
          if (suppressClick || changingCard) { suppressClick = false; return; }
          flashcard.classList.toggle('flipped');
          flashStudy.querySelector('[data-flash-side]').textContent = flashcard.classList.contains('flipped') ? 'Answer' : 'Question';
        });
        flashcard.addEventListener('keydown', event => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); moveToCard(cardIndex - 1, -1); }
          if (event.key === 'ArrowRight') { event.preventDefault(); moveToCard(cardIndex + 1, 1); }
        });
        flashcard.addEventListener('pointerdown', event => {
          if (changingCard) return;
          pointerStartX = event.clientX;
          pointerDeltaX = 0;
          flashcard.classList.add('dragging');
          flashcard.setPointerCapture(event.pointerId);
        });
        flashcard.addEventListener('pointermove', event => {
          if (pointerStartX === null) return;
          pointerDeltaX = event.clientX - pointerStartX;
          flashcard.style.transform = `translateX(${pointerDeltaX * .42}px) rotate(${pointerDeltaX * .012}deg)`;
          flashcard.style.opacity = String(Math.max(.72, 1 - Math.abs(pointerDeltaX) / 500));
          if (Math.abs(pointerDeltaX) > 8) suppressClick = true;
        });
        const finishSwipe = event => {
          if (pointerStartX === null) return;
          if (flashcard.hasPointerCapture(event.pointerId)) flashcard.releasePointerCapture(event.pointerId);
          flashcard.classList.remove('dragging');
          flashcard.style.transform = '';
          flashcard.style.opacity = '';
          const delta = pointerDeltaX;
          pointerStartX = null;
          pointerDeltaX = 0;
          if (delta < -64) moveToCard(cardIndex + 1, 1);
          else if (delta > 64) moveToCard(cardIndex - 1, -1);
        };
        flashcard.addEventListener('pointerup', finishSwipe);
        flashcard.addEventListener('pointercancel', finishSwipe);
        previousButton.addEventListener('click', () => moveToCard(cardIndex - 1, -1));
        nextButton.addEventListener('click', () => moveToCard(cardIndex + 1, 1));
        flashStudy.querySelectorAll('[data-flash-index]').forEach(dot => dot.addEventListener('click', () => moveToCard(Number(dot.dataset.flashIndex), Number(dot.dataset.flashIndex) > cardIndex ? 1 : -1)));
        renderFlashcard();
      }
      interaction.querySelectorAll('[data-answer]').forEach(answer => answer.addEventListener('click', () => {
        interaction.querySelectorAll('[data-answer]').forEach(option => option.classList.remove('correct','wrong'));
        const correct = answer.dataset.answer === 'correct';
        answer.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) interaction.querySelector('[data-answer="correct"]').classList.add('correct');
        interaction.querySelector('[data-quiz-feedback]').textContent = correct ? '✓ Correct — the answer has been checked.' : 'Not quite — the correct answer is highlighted.';
      }));
      interaction.querySelectorAll('[data-guide-check]').forEach((section,index) => section.addEventListener('click', () => {
        section.classList.toggle('done');
        section.querySelector('span').textContent = section.classList.contains('done') ? '✓' : String(index + 1);
      }));
      const guideMarkdown = interaction.querySelector('[data-guide-markdown]');
      if (guideMarkdown && example.markdown) {
        fetch(example.markdown)
          .then(response => {
            if (!response.ok) throw new Error(`Unable to load study guide (${response.status})`);
            return response.text();
          })
          .then(markdown => { guideMarkdown.innerHTML = renderStudyGuideMarkdown(markdown, example.markdown); })
          .catch(error => {
            console.error(error);
            guideMarkdown.innerHTML = '<div class="study-guide-markdown-error">The original study guide could not be loaded. Please try again.</div>';
          });
      }
      const quizSession = interaction.querySelector('[data-quiz-session]');
      if (quizSession) {
        const choices = [...quizSession.querySelectorAll('[data-quiz-option]')];
        const result = quizSession.querySelector('[data-quiz-result]');
        const selectedExplanation = quizSession.querySelector('[data-quiz-selected-explanation]');
        const explanationKey = quizSession.querySelector('[data-quiz-explanation-key]');
        const explanationStatus = quizSession.querySelector('[data-quiz-explanation-status]');
        const explanationCopy = quizSession.querySelector('[data-quiz-explanation-copy]');
        const retry = quizSession.querySelector('[data-quiz-retry]');
        const resetQuiz = () => {
          choices.forEach(choice => {
            choice.disabled = false;
            choice.classList.remove('correct','wrong');
            choice.removeAttribute('aria-pressed');
          });
          selectedExplanation.classList.remove('correct','incorrect');
          explanationKey.textContent = '';
          explanationStatus.textContent = '';
          explanationCopy.textContent = '';
          result.hidden = true;
        };
        choices.forEach(choice => choice.addEventListener('click', () => {
          if (choice.disabled) return;
          const isCorrect = choice.dataset.correct === 'true';
          const correctChoice = choices.find(option => option.dataset.correct === 'true');
          choices.forEach(option => {
            option.disabled = true;
            option.setAttribute('aria-pressed', String(option === choice));
          });
          choice.classList.add(isCorrect ? 'correct' : 'wrong');
          if (!isCorrect && correctChoice) correctChoice.classList.add('correct');
          selectedExplanation.classList.toggle('correct', isCorrect);
          selectedExplanation.classList.toggle('incorrect', !isCorrect);
          explanationKey.textContent = choice.dataset.quizOption;
          explanationStatus.textContent = isCorrect ? 'Correct' : 'Incorrect';
          explanationCopy.textContent = choice.dataset.explanation;
          result.hidden = false;
        }));
        retry.addEventListener('click', resetQuiz);
      }
      const podcastPlayer = interaction.querySelector('[data-podcast-player]');
      if (podcastPlayer) {
        const audio = podcastPlayer.querySelector('[data-podcast-audio]');
        const toggle = podcastPlayer.querySelector('[data-podcast-toggle]');
        const scrubber = podcastPlayer.querySelector('[data-podcast-scrubber]');
        const time = podcastPlayer.querySelector('[data-podcast-time]');
        const transcript = podcastPlayer.querySelector('[data-podcast-transcript]');
        const speedButton = podcastPlayer.querySelector('[data-podcast-speed]');
        const fallbackDuration = example && example.durationSeconds ? example.durationSeconds : 0;
        let transcriptSegments = [];
        let activeTranscriptIndex = -1;
        let speedIndex = 0;
        const speeds = [1,1.25,1.5,.75];

        const setPlayingState = playing => {
          toggle.innerHTML = playing ? '<span class="pause-glyph" aria-hidden="true">Ⅱ</span>' : icon('i-play');
          toggle.setAttribute('aria-label', playing ? 'Pause podcast' : 'Play podcast');
        };
        const updatePodcastProgress = () => {
          const duration = Number.isFinite(audio.duration) ? audio.duration : fallbackDuration;
          scrubber.max = String(duration || fallbackDuration);
          scrubber.value = String(audio.currentTime || 0);
          time.textContent = `${formatMediaTime(audio.currentTime)} / ${formatMediaTime(duration || fallbackDuration)}`;
          const nextIndex = transcriptSegments.findIndex(segment => audio.currentTime >= segment.start && audio.currentTime < segment.end);
          if (nextIndex !== activeTranscriptIndex) {
            activeTranscriptIndex = nextIndex;
            transcript.querySelectorAll('[data-transcript-index]').forEach((line,index) => line.classList.toggle('active', index === nextIndex));
            const activeLine = transcript.querySelector(`[data-transcript-index="${nextIndex}"]`);
            if (activeLine && !scrubber.matches(':active')) activeLine.scrollIntoView({ block:'nearest' });
          }
        };
        toggle.addEventListener('click', () => {
          if (audio.paused) audio.play().catch(() => showToast('Audio playback is unavailable in this browser.'));
          else audio.pause();
        });
        audio.addEventListener('play', () => setPlayingState(true));
        audio.addEventListener('pause', () => setPlayingState(false));
        audio.addEventListener('ended', () => setPlayingState(false));
        audio.addEventListener('loadedmetadata', updatePodcastProgress);
        audio.addEventListener('timeupdate', updatePodcastProgress);
        scrubber.addEventListener('input', () => { audio.currentTime = Number(scrubber.value); updatePodcastProgress(); });
        podcastPlayer.querySelectorAll('[data-podcast-skip]').forEach(button => button.addEventListener('click', () => {
          const duration = Number.isFinite(audio.duration) ? audio.duration : fallbackDuration;
          audio.currentTime = Math.max(0,Math.min(duration,audio.currentTime + Number(button.dataset.podcastSkip)));
          updatePodcastProgress();
        }));
        speedButton.addEventListener('click', () => {
          speedIndex = (speedIndex + 1) % speeds.length;
          audio.playbackRate = speeds[speedIndex];
          speedButton.textContent = `${speeds[speedIndex]}×`;
          speedButton.setAttribute('aria-label', `Playback speed ${speeds[speedIndex]} times`);
        });
        const renderPodcastTranscript = segments => {
          transcriptSegments = Array.isArray(segments) ? segments : [];
          transcript.innerHTML = '';
          transcriptSegments.forEach((segment,index) => {
            const line = document.createElement('button');
            line.className = 'podcast-transcript-line';
            line.type = 'button';
            line.dataset.transcriptIndex = String(index);
            const lineTime = document.createElement('time');
            lineTime.textContent = formatMediaTime(segment.start);
            const copy = document.createElement('p');
            const speaker = document.createElement('strong');
            speaker.textContent = `${segment.speaker}: `;
            copy.append(speaker,document.createTextNode(segment.text));
            line.append(lineTime,copy);
            line.addEventListener('click', () => {
              audio.currentTime = segment.start;
              updatePodcastProgress();
              audio.play().catch(() => showToast('Audio playback is unavailable in this browser.'));
            });
            transcript.append(line);
          });
          updatePodcastProgress();
        };
        const storedTranscript = window.SOLVELY_PODCAST_TRANSCRIPTS && window.SOLVELY_PODCAST_TRANSCRIPTS[example.transcriptKey];
        if (storedTranscript) renderPodcastTranscript(storedTranscript);
        else transcript.innerHTML = '<p class="podcast-transcript-loading">Transcript could not be loaded.</p>';
        setPlayingState(false);
        updatePodcastProgress();
      }
      const mediaToggle = interaction.querySelector('[data-media-toggle]');
      if (mediaToggle) {
        let playing = false;
        let progress = type === 'podcast' ? 9 : 7;
        mediaToggle.addEventListener('click', () => {
          playing = !playing;
          mediaToggle.innerHTML = playing ? '<span class="pause-glyph" aria-hidden="true">Ⅱ</span>' : icon('i-play');
          mediaToggle.setAttribute('aria-label', playing ? (type === 'podcast' ? 'Pause podcast' : 'Pause explanation') : (type === 'podcast' ? 'Play podcast' : 'Play explanation'));
          clearInterval(mediaTimer);
          if (!playing) return;
          mediaTimer = setInterval(() => {
            progress = Math.min(100,progress + 1.2);
            interaction.querySelector('[data-media-progress]').style.width = progress + '%';
            const seconds = type === 'podcast' ? Math.round(progress * 4.8) : Math.round(progress * .78);
            interaction.querySelector('[data-media-time]').textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2,'0') + (type === 'podcast' ? ' / 8:00' : ' / 1:18');
            if (progress >= 100) clearInterval(mediaTimer);
          },220);
        });
      }
      interaction.querySelectorAll('[data-solution-step]').forEach(step => step.addEventListener('click', () => {
        interaction.querySelectorAll('[data-solution-step]').forEach(item => item.classList.toggle('active', item === step));
      }));
    }

    const examPrepFeatureDetails = [
      [
        ['Personalized timeline','Builds a realistic schedule around the exam date and available study time.'],
        ['Daily focus','Turns the plan into clear, manageable tasks for every study session.'],
        ['Automatic adjustment','Rebalances upcoming work when progress, scores, or priorities change.']
      ],
      [
        ['Readiness map','Shows which topics are ready, developing, or need immediate review.'],
        ['Weak-topic priority','Ranks study gaps by likely score impact instead of treating every topic equally.'],
        ['Targeted review','Connects each gap to the right lesson, explanation, and practice set.']
      ],
      [
        ['Real exam timing','Recreates full-length and section-level timing for realistic practice.'],
        ['Adaptive difficulty','Adjusts question selection using recent accuracy and confidence.'],
        ['Actionable review','Explains mistakes and turns them into the next recommended practice task.']
      ],
      [
        ['Score trend','Tracks how performance changes across practice sets and mock exams.'],
        ['Readiness projection','Estimates likely exam performance from mastery, pacing, and consistency.'],
        ['Next-best action','Highlights the most valuable task to complete before the next checkpoint.']
      ]
    ];

    function examFeatureDetailVisual(type) {
      if (type === 'exam-plan') return examPlanPreview(true);
      if (type === 'exam-review') return examTopicsPreview(true);
      if (type === 'exam-mock') return examMockPreview(true);
      return examProgressPreview(true);
    }

    function featureDetailMarkup(index) {
      return `<h3>What this feature includes</h3><div class="feature-detail-list">${examPrepFeatureDetails[index].map((item,itemIndex) => `<div class="feature-detail-item"><span>${itemIndex + 1}</span><div><strong>${item[0]}</strong><small>${item[1]}</small></div></div>`).join('')}</div>`;
    }

    function openExamPrepFeature(index) {
      const feature = capabilityData.mock.examples[index];
      if (!feature) return;
      dialog.dataset.mode = 'exam-feature';
      document.getElementById('dialogIcon').innerHTML = icon('i-target');
      document.getElementById('dialogKicker').textContent = `Exam Prep feature · ${feature.tag}`;
      document.getElementById('dialogTitle').textContent = feature.title;
      document.getElementById('dialogDescription').textContent = feature.description;
      document.getElementById('dialogPreview').hidden = false;
      document.getElementById('dialogPreview').innerHTML = examFeatureDetailVisual(feature.preview);
      document.getElementById('dialogInteraction').innerHTML = featureDetailMarkup(index);
      document.getElementById('dialogInteraction').hidden = false;
      dialog.showModal();
    }

    function openExample(index, capabilityKey = selectedCapability) {
      const capability = capabilityData[capabilityKey];
      if (!capability) return;
      const example = capability.examples[index];
      if (!example) return;
      openExampleData(example, capabilityKey);
    }

    function openExampleData(example, capabilityKey) {
      const capability = capabilityData[capabilityKey];
      if (!capability || !example) return;
      const hasSimulator = Boolean(example.simulator);
      const hasInteractiveFlashcards = capabilityKey === 'flashcards' && Array.isArray(example.cards);
      const hasInteractiveQuiz = capabilityKey === 'quiz' && Array.isArray(example.options);
      const hasChemistryCases = example.preview === 'chemistry' && Array.isArray(example.structures);
      const hasPodcastAudio = example.preview === 'podcast' && Boolean(example.audio);
      const hasStudyGuide = example.preview === 'guide' && Array.isArray(example.sections);
      const displayTitle = example.dialogTitle || example.title;
      dialog.dataset.mode = hasSimulator ? (example.embedMode || 'simulator') : example.preview === 'solver-step-solution' ? 'step-solution' : hasInteractiveFlashcards ? 'flashcard-study' : hasInteractiveQuiz ? 'quiz-player' : hasChemistryCases ? 'chemistry' : hasPodcastAudio ? 'podcast-player' : hasStudyGuide ? 'study-guide' : 'example';
      dialog.removeAttribute('data-feature-index');
      document.getElementById('dialogIcon').innerHTML = icon(capability.icon);
      document.getElementById('dialogKicker').textContent = `${capability.label} · ${example.tag}`;
      document.getElementById('dialogTitle').textContent = displayTitle;
      document.getElementById('dialogDescription').textContent = example.description;
      document.getElementById('dialogPreview').hidden = hasInteractiveFlashcards || hasInteractiveQuiz || hasStudyGuide;
      document.getElementById('dialogPreview').innerHTML = hasSimulator
        ? `<iframe class="simulator-frame" src="${example.simulator}" title="${displayTitle} interactive simulator" loading="eager" sandbox="allow-scripts"></iframe>`
        : dialogPreviewMarkup(example.preview, example);
      document.getElementById('dialogInteraction').innerHTML = hasSimulator ? '' : interactionMarkup(example.preview, example);
      document.getElementById('dialogInteraction').hidden = hasSimulator;
      dialog.showModal();
      if (!hasSimulator) bindDialogInteraction(example.preview, example);
    }

    function pauseDialogAudio() { document.querySelectorAll('#exampleDialog audio').forEach(audio => audio.pause()); }
    function closeDialog() { clearInterval(mediaTimer); mediaTimer = null; pauseDialogAudio(); if (dialog.open) dialog.close(); }
    function updateSubmit() {
      sendButton.disabled = !promptInput.value.trim() && attachedSourceCount() === 0;
      updateWritingWordCount();
    }
    function closeCitationMenus() {
      document.querySelectorAll('.citation-dropdown-menu').forEach(menu => { menu.hidden = true; });
      document.querySelectorAll('[data-citation-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    }
    function syncCitationSelectors() {
      document.getElementById('citationFormatLabel').textContent = selectedCitationFormat;
      document.getElementById('citationSourceTypeLabel').textContent = selectedCitationSourceType;
      document.getElementById('citationFormatButton').setAttribute('aria-label', `Citation format: ${selectedCitationFormat}`);
      document.getElementById('citationSourceTypeButton').setAttribute('aria-label', `Citation source type: ${selectedCitationSourceType}`);
      document.querySelectorAll('[data-citation-option]').forEach(option => {
        const selectedValue = option.dataset.citationOption === 'format' ? selectedCitationFormat : selectedCitationSourceType;
        const active = option.dataset.citationValue === selectedValue;
        option.classList.toggle('active', active);
        option.setAttribute('aria-checked', String(active));
      });
    }
    function countWords(value) { return value.trim() ? (value.match(/\S+/g) || []).length : 0; }
    function updateWritingWordCount() {
      const shouldShow = workspaceMode === 'writing' && writingWordCountCapabilities.has(selectedCapability);
      writingWordCount.hidden = !shouldShow;
      if (!shouldShow) return;
      const count = countWords(promptInput.value);
      writingWordCount.textContent = `${count.toLocaleString('en-US')} ${count === 1 ? 'word' : 'words'}`;
    }
    function truncateToWordLimit(value, limit) {
      const words = [...value.matchAll(/\S+/g)];
      if (words.length <= limit) return value;
      const lastWord = words[limit - 1];
      return value.slice(0, lastWord.index + lastWord[0].length);
    }
    function enforceWritingInputLimit() {
      if (workspaceMode !== 'writing') return false;
      if (writingWordLimitedCapabilities.has(selectedCapability) && countWords(promptInput.value) > writingWordLimit) {
        promptInput.value = truncateToWordLimit(promptInput.value, writingWordLimit);
        showToast(writingWordLimitToast);
        return true;
      }
      if (selectedCapability === 'aiCitation' && promptInput.value.length > writingCharacterLimit) {
        promptInput.value = promptInput.value.slice(0, writingCharacterLimit);
        showToast(citationCharacterLimitToast);
        return true;
      }
      return false;
    }
    function validateWritingSubmission() {
      const value = promptInput.value.trim();
      if (selectedCapability === 'paraphraser') {
        const customStyleSelected = document.querySelector('[data-paraphrase-style="Custom"][aria-pressed="true"]');
        const customInstruction = document.getElementById('paraphraseCustomInstruction');
        if (customStyleSelected && customInstruction && !customInstruction.value.trim()) {
          showToast(paraphraserCustomInstructionToast);
          customInstruction.focus();
          return false;
        }
      }
      if (writingMinimumWordCapabilities.has(selectedCapability) && countWords(value) < writingMinimumWords) {
        showToast(writingMinimumWordsToast);
        return false;
      }
      if (selectedCapability === 'research' && value.length > writingCharacterLimit) {
        promptInput.dataset.lastSubmittedValue = value.slice(0, writingCharacterLimit);
        showToast(researchCharacterLimitToast);
        return false;
      }
      promptInput.dataset.lastSubmittedValue = value;
      return true;
    }
    function showToast(message) {
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('show');
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function isImageFile(file) {
      return file.type.startsWith('image/') || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/i.test(file.name);
    }

    function fileTypeLabel(file) {
      if (isImageFile(file)) return 'Image';
      const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
      return extension ? extension.toUpperCase() : 'File';
    }

    function attachedSourceCount() {
      return attachmentRow.querySelectorAll('[data-source-kind]').length;
    }

    async function fetchYouTubeTitle(url) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      try {
        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, { signal:controller.signal });
        if (!response.ok) throw new Error('YouTube metadata request failed');
        const metadata = await response.json();
        const title = typeof metadata.title === 'string' ? metadata.title.trim() : '';
        if (!title) throw new Error('YouTube title unavailable');
        return title;
      } finally {
        clearTimeout(timeout);
      }
    }

    function removeAttachmentChip(chip) {
      if (chip.dataset.objectUrl) URL.revokeObjectURL(chip.dataset.objectUrl);
      chip.remove();
      updateSubmit();
    }

    function cropStateForChip(chip) {
      const state = chip._cropState || { x:0, y:0, width:1, height:1 };
      return { x:state.x, y:state.y, width:state.width, height:state.height };
    }

    function cropClamp(value,min,max) {
      return Math.min(max,Math.max(min,value));
    }

    function syncCropSelection() {
      const chip = cropImageChips[activeCropIndex];
      if (!chip) return;
      const state = cropWorkingStates.get(chip) || cropStateForChip(chip);
      cropSelection.style.left = `${state.x * 100}%`;
      cropSelection.style.top = `${state.y * 100}%`;
      cropSelection.style.width = `${state.width * 100}%`;
      cropSelection.style.height = `${state.height * 100}%`;
    }

    function resizeCropEditor() {
      if (!cropDialog.open || !cropEditorImage.naturalWidth || !cropEditorImage.naturalHeight) return;
      const maxWidth = Math.max(120,cropStage.clientWidth - 52);
      const maxHeight = Math.max(120,cropStage.clientHeight - 42);
      const ratio = cropEditorImage.naturalWidth / cropEditorImage.naturalHeight;
      let width = maxWidth;
      let height = width / ratio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
      cropImageFrame.style.width = `${Math.round(width)}px`;
      cropImageFrame.style.height = `${Math.round(height)}px`;
      syncCropSelection();
    }

    function renderCropThumbnails() {
      cropThumbnails.replaceChildren();
      cropImageChips.forEach((chip,index) => {
        const button = document.createElement('button');
        const image = document.createElement('img');
        button.type = 'button';
        button.className = `crop-thumbnail-button${index === activeCropIndex ? ' active' : ''}`;
        button.setAttribute('aria-label', `Edit image ${index + 1}: ${chip.title}`);
        button.setAttribute('aria-pressed', String(index === activeCropIndex));
        image.alt = '';
        image.src = chip.dataset.objectUrl;
        button.appendChild(image);
        button.addEventListener('click', () => selectCropImage(index));
        cropThumbnails.appendChild(button);
      });
    }

    function selectCropImage(index) {
      if (!cropImageChips[index]) return;
      activeCropIndex = index;
      cropThumbnails.querySelectorAll('.crop-thumbnail-button').forEach((button,buttonIndex) => {
        const selected = buttonIndex === activeCropIndex;
        button.classList.toggle('active',selected);
        button.setAttribute('aria-pressed',String(selected));
      });
      const chip = cropImageChips[activeCropIndex];
      cropEditorImage.alt = `Cropping ${chip.title}`;
      cropEditorImage.onload = resizeCropEditor;
      cropEditorImage.src = chip.dataset.objectUrl;
      if (cropEditorImage.complete) requestAnimationFrame(resizeCropEditor);
      syncCropSelection();
    }

    function openCropDialog(chip) {
      cropImageChips = [...attachmentRow.querySelectorAll('.attachment-image')];
      if (!cropImageChips.length) return;
      activeCropIndex = Math.max(0,cropImageChips.indexOf(chip));
      cropWorkingStates = new Map(cropImageChips.map(imageChip => [imageChip,cropStateForChip(imageChip)]));
      renderCropThumbnails();
      cropDialog.showModal();
      selectCropImage(activeCropIndex);
    }

    function closeCropDialog() {
      cropGesture = null;
      if (cropDialog.open) cropDialog.close();
    }

    function startCropGesture(event) {
      if (!cropImageChips[activeCropIndex]) return;
      event.preventDefault();
      const handle = event.target.closest('[data-crop-handle]')?.dataset.cropHandle || 'move';
      const frameRect = cropImageFrame.getBoundingClientRect();
      const chip = cropImageChips[activeCropIndex];
      cropGesture = {
        chip,
        handle,
        startX:event.clientX,
        startY:event.clientY,
        frameRect,
        state:{ ...(cropWorkingStates.get(chip) || cropStateForChip(chip)) }
      };
      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove',moveCropGesture);
      window.addEventListener('pointerup',endCropGesture,{ once:true });
    }

    function moveCropGesture(event) {
      if (!cropGesture) return;
      const { chip,handle,startX,startY,frameRect,state } = cropGesture;
      const dx = (event.clientX - startX) / frameRect.width;
      const dy = (event.clientY - startY) / frameRect.height;
      const minWidth = Math.min(.18,48 / frameRect.width);
      const minHeight = Math.min(.18,48 / frameRect.height);
      let left = state.x;
      let top = state.y;
      let right = state.x + state.width;
      let bottom = state.y + state.height;

      if (handle === 'move') {
        left = cropClamp(state.x + dx,0,1 - state.width);
        top = cropClamp(state.y + dy,0,1 - state.height);
        right = left + state.width;
        bottom = top + state.height;
      } else {
        if (handle.includes('w')) left = cropClamp(state.x + dx,0,right - minWidth);
        if (handle.includes('e')) right = cropClamp(state.x + state.width + dx,left + minWidth,1);
        if (handle.includes('n')) top = cropClamp(state.y + dy,0,bottom - minHeight);
        if (handle.includes('s')) bottom = cropClamp(state.y + state.height + dy,top + minHeight,1);
      }

      cropWorkingStates.set(chip,{ x:left, y:top, width:right - left, height:bottom - top });
      syncCropSelection();
    }

    function endCropGesture() {
      cropGesture = null;
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove',moveCropGesture);
      window.removeEventListener('pointerup',endCropGesture);
    }

    function applyCropToChip(chip,state) {
      return new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
          const sourceWidth = Math.max(1,Math.round(image.naturalWidth * state.width));
          const sourceHeight = Math.max(1,Math.round(image.naturalHeight * state.height));
          const scale = Math.min(1,1600 / Math.max(sourceWidth,sourceHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1,Math.round(sourceWidth * scale));
          canvas.height = Math.max(1,Math.round(sourceHeight * scale));
          const context = canvas.getContext('2d');
          context.drawImage(
            image,
            Math.round(image.naturalWidth * state.x),Math.round(image.naturalHeight * state.y),sourceWidth,sourceHeight,
            0,0,canvas.width,canvas.height
          );
          const outputType = chip._sourceFile?.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
          chip._cropState = { ...state };
          chip._croppedDataUrl = canvas.toDataURL(outputType,.92);
          chip.querySelector('.attachment-thumbnail').src = chip._croppedDataUrl;
          resolve();
        };
        image.onerror = resolve;
        image.src = chip.dataset.objectUrl;
      });
    }

    async function applyAllCrops() {
      cropDone.disabled = true;
      cropDone.textContent = 'Applying…';
      await Promise.all(cropImageChips.map(chip => applyCropToChip(chip,cropWorkingStates.get(chip) || cropStateForChip(chip))));
      cropDone.disabled = false;
      cropDone.textContent = 'Done';
      closeCropDialog();
      showToast('Image crops updated');
    }

    function createFileChip(file) {
      const imageFile = isImageFile(file);
      const chip = document.createElement('span');
      chip.className = `attachment-chip ${imageFile ? 'attachment-image' : 'attachment-document'}`;
      chip.dataset.sourceKind = imageFile ? 'image' : 'file';
      chip.setAttribute('role', 'listitem');
      chip.title = file.name;
      if (imageFile) {
        const objectUrl = URL.createObjectURL(file);
        chip.dataset.objectUrl = objectUrl;
        chip._sourceFile = file;
        chip._cropState = { x:0, y:0, width:1, height:1 };
        chip.innerHTML = `<img class="attachment-thumbnail" alt="" /><button class="attachment-crop-action" type="button">${icon('i-crop')}<span>Crop</span></button><button class="attachment-remove" type="button">${icon('i-close')}</button>`;
        chip.querySelector('img').src = objectUrl;
        const cropButton = chip.querySelector('.attachment-crop-action');
        cropButton.setAttribute('aria-label',`Crop ${file.name}`);
        cropButton.addEventListener('click',() => openCropDialog(chip));
      } else {
        chip.innerHTML = `<span class="attachment-type-badge">${icon('i-file')}</span><span class="attachment-copy"><strong></strong><small></small></span><button class="attachment-remove" type="button">${icon('i-close')}</button>`;
        chip.querySelector('strong').textContent = file.name;
        chip.querySelector('small').textContent = fileTypeLabel(file);
      }
      const removeButton = chip.querySelector('.attachment-remove');
      removeButton.setAttribute('aria-label', `Remove ${file.name}`);
      removeButton.addEventListener('click', () => removeAttachmentChip(chip));
      return chip;
    }

    function filterFilesForCurrentCapability(files) {
      const incoming = [...files];
      if (capabilityGroups.writing.includes(selectedCapability)) {
        const existingFiles = attachmentRow.querySelectorAll('[data-source-kind="file"]').length;
        const result = selectWritingFiles(incoming, {
          enabled: WRITING_FILE_CAPABILITIES.has(selectedCapability),
          hasExistingFile: existingFiles > 0
        });
        return {
          accepted: result.accepted,
          limited: Boolean(result.toast),
          limitMessage: result.toast || '',
          suppressToast: !result.toast && (incoming.length > 1 || !result.accepted.length)
        };
      }
      if (multiSourceCapabilities.has(selectedCapability)) {
        const available = Math.max(0, creationSourceLimit - attachedSourceCount());
        return { accepted: incoming.slice(0, available), limited: incoming.length > available, limitMessage: creationSourceLimitToast };
      }

      const existingImages = attachmentRow.querySelectorAll('[data-source-kind="image"]').length;
      const existingFiles = attachmentRow.querySelectorAll('[data-source-kind="file"]').length;
      const firstIsImage = incoming[0] ? isImageFile(incoming[0]) : false;
      if (firstIsImage && existingFiles === 0) {
        const imageFiles = incoming.filter(isImageFile);
        const available = Math.max(0, 5 - existingImages);
        return { accepted: imageFiles.slice(0, available), limited: imageFiles.length < incoming.length || imageFiles.length > available, limitMessage: problemSourceLimitToast };
      }
      if (!firstIsImage && existingImages === 0 && existingFiles === 0) {
        return { accepted: incoming.slice(0, 1), limited: incoming.length > 1, limitMessage: problemSourceLimitToast };
      }
      return { accepted: [], limited: incoming.length > 0, limitMessage: problemSourceLimitToast };
    }

    function capabilitySupportsFileUpload(key = selectedCapability) {
      return !capabilityGroups.writing.includes(key) || WRITING_FILE_CAPABILITIES.has(key);
    }

    function addFiles(files) {
      const { accepted, limited, limitMessage, suppressToast = false } = filterFilesForCurrentCapability(files);
      accepted.forEach(file => attachmentRow.appendChild(createFileChip(file)));
      if (accepted.length && !promptInput.value.trim()) promptInput.value = selectedCapability
        ? `Use my uploaded material to ${capabilityData[selectedCapability].action.toLowerCase()} this.`
        : 'Help me learn from my uploaded material.';
      updateSubmit();
      if (!suppressToast) {
        if (limited) showToast(limitMessage);
        else if (accepted.length) showToast(`${accepted.length} source${accepted.length === 1 ? '' : 's'} added`);
      }
    }

    function insertAtCursor(value) {
      const start = promptInput.selectionStart;
      const end = promptInput.selectionEnd;
      promptInput.value = promptInput.value.slice(0, start) + value + promptInput.value.slice(end);
      promptInput.selectionStart = promptInput.selectionEnd = start + value.length;
      promptInput.focus();
      updateSubmit();
    }

    function handleCalculator(key) {
      if (key === 'C') calcExpression = '';
      else if (key === '⌫') calcExpression = calcExpression.slice(0, -1);
      else if (key === '=') {
        const safe = calcExpression.replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-');
        if (/^[0-9+*/().\-\s]+$/.test(safe)) {
          try { calcExpression = String(Function(`"use strict";return (${safe})`)()); } catch { calcExpression = 'Error'; }
        }
      } else calcExpression = calcExpression === 'Error' ? key : calcExpression + key;
      document.getElementById('calculatorDisplay').textContent = calcExpression || '0';
    }

    promptInput.addEventListener('input', () => {
      enforceWritingInputLimit();
      promptInput.style.height = 'auto';
      promptInput.style.height = `${Math.min(promptInput.scrollHeight, 160)}px`;
      updateSubmit();
    });
    function inferStudyCapability(value) {
      const prompt = value.toLowerCase();
      if (/\b(graph|plot|chart|visuali[sz]e|coordinate|parabola)\b/.test(prompt)) return 'graph';
      if (/\b(video|animate|animation|visual explainer|watch)\b/.test(prompt)) return 'video';
      if (/\b(flash ?cards?|memorize|active recall)\b/.test(prompt)) return 'flashcards';
      if (/\b(quiz|test me|practice questions?|knowledge check)\b/.test(prompt)) return 'quiz';
      if (/\b(study guide|review guide|summary|organize notes?|revision plan)\b/.test(prompt)) return 'guide';
      if (/\b(podcast|audio|listen|spoken lesson)\b/.test(prompt)) return 'podcast';
      return 'solver';
    }

    promptInput.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !sendButton.disabled) sendButton.click(); });
    sendButton.addEventListener('click', () => {
      if (sendButton.disabled) return;
      if (workspaceMode === 'writing') {
        if (!validateWritingSubmission()) return;
        showToast(`${capabilityData[selectedCapability].action} started with Solvely AI`);
        return;
      }
      if (!selectedCapability) {
        const inferredCapability = inferStudyCapability(promptInput.value);
        selectCapability(inferredCapability, true);
        showToast(`Using ${capabilityData[inferredCapability].label} for this request`);
      } else showToast(`${capabilityData[selectedCapability].action} started with Solvely AI`);
      setTimeout(() => openExample(0), 420);
    });

    function calculatorMarkup() {
      const keys = [['⌫','back'],['AC','clear'],['^','^'],['÷','÷'],['7','7'],['8','8'],['9','9'],['×','×'],['4','4'],['5','5'],['6','6'],['−','−'],['1','1'],['2','2'],['3','3'],['+','+'],['(−)','neg'],['0','0'],['.','.'],['=','=']];
      const keyMarkup = keys.map(([label,value]) => '<button class="calc-key ' + (['÷','×','−','+','='].includes(value) ? 'operator' : '') + '" data-calc-value="' + value + '">' + label + '</button>').join('');
      return '<div class="calc-head" data-calculator-drag-handle><span class="calc-grip">⠿</span><strong style="font-size:13px">Calculator</strong><div class="calc-head-actions"><button class="calc-head-btn calc-expand" data-toggle-calculator-size aria-label="Expand graphing calculator" title="Expand graphing calculator"><svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg></button><button class="calc-head-btn" data-close-calculator aria-label="Close calculator">' + icon('i-close') + '</button></div></div><div class="calc-tabs"><button class="calc-tab active" data-calc-tab="basic">Basic</button><button class="calc-tab" data-calc-tab="graph">Graphing</button></div><div class="calc-basic" data-calc-view="basic"><div class="calc-display" id="calcDisplay">0</div><div class="calc-grid">' + keyMarkup + '</div></div><div class="calc-graph" data-calc-view="graph" hidden><div class="geogebra-status" data-geogebra-status>Loading GeoGebra Graphing Calculator…</div><div id="ggb-element" class="geogebra-host" aria-label="GeoGebra Graphing Calculator"></div></div><div class="geogebra-attribution" data-geogebra-attribution hidden><a href="https://www.geogebra.org/" target="_blank" rel="noreferrer">Made with GeoGebra®</a></div>';
    }
    function waitForGeoGebraLibrary(timeout = 20000) {
      if (typeof window.GGBApplet === 'function') return Promise.resolve();
      return new Promise((resolve,reject) => {
        const started = Date.now();
        const check = () => {
          if (typeof window.GGBApplet === 'function') resolve();
          else if (Date.now() - started >= timeout) reject(new Error('GeoGebra library timed out'));
          else setTimeout(check,120);
        };
        check();
      });
    }
    function initializeGeoGebraGraphing() {
      if (geogebraInitPromise) return geogebraInitPromise;
      const host = calculatorPanel.querySelector('#ggb-element');
      const status = calculatorPanel.querySelector('[data-geogebra-status]');
      if (!host) return Promise.resolve();
      geogebraInitPromise = waitForGeoGebraLibrary().then(() => {
        const bounds = host.getBoundingClientRect();
        geogebraApplet = new window.GGBApplet({
          id:'solvelyGraphingApi', appName:'graphing', width:Math.max(280,Math.round(bounds.width)), height:Math.max(300,Math.round(bounds.height)),
          showToolBar:true, showAlgebraInput:true, showMenuBar:false, showResetIcon:false, enableShiftDragZoom:true,
          appletOnLoad(api) {
            geogebraApi = api;
            window.solvelyGeoGebraApi = api;
            api.evalCommand('f(x)=sin(x)');
            api.setGridVisible(1,true);
            api.showAlgebraInput(true);
            if (status) status.hidden = true;
          }
        },true);
        geogebraApplet.inject('ggb-element');
      }).catch(error => {
        console.error(error);
        if (status) {
          status.textContent = 'GeoGebra could not load. Check the network connection and try again.';
          status.classList.add('error');
        }
      });
      return geogebraInitPromise;
    }
    function getGeoGebraApi() {
      return [geogebraApi,window.solvelyGraphingApi,window.ggbApplet].find(api => api && typeof api.setSize === 'function') || null;
    }
    function resizeGeoGebra(attempt = 0) {
      const host = calculatorPanel.querySelector('#ggb-element');
      if (!host || host.closest('[hidden]')) return;
      const api = getGeoGebraApi();
      if (!api) {
        if (attempt < 20) setTimeout(() => resizeGeoGebra(attempt + 1),100);
        return;
      }
      const bounds = host.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) api.setSize(Math.round(bounds.width),Math.round(bounds.height));
    }
    function clampCalculatorPosition(left,top) {
      const rect = calculatorPanel.getBoundingClientRect();
      return { left:Math.min(Math.max(8,left),Math.max(8,window.innerWidth - rect.width - 8)), top:Math.min(Math.max(8,top),Math.max(8,window.innerHeight - rect.height - 8)) };
    }
    function positionCalculator(left,top) {
      const next = clampCalculatorPosition(left,top);
      calculatorPanel.style.left = next.left + 'px';
      calculatorPanel.style.top = next.top + 'px';
    }
    function placeCalculatorNear(button) {
      const trigger = button.getBoundingClientRect();
      const panel = calculatorPanel.getBoundingClientRect();
      positionCalculator(trigger.right - panel.width,trigger.bottom + 10);
    }
    function updateCalculatorSizeButton() {
      const button = calculatorPanel.querySelector('[data-toggle-calculator-size]');
      if (!button) return;
      const expanded = calculatorPanel.classList.contains('expanded');
      button.setAttribute('aria-label',expanded ? 'Restore graphing calculator size' : 'Expand graphing calculator');
      button.title = expanded ? 'Restore size' : 'Expand graphing calculator';
    }
    function setCalculatorExpanded(expanded) {
      if (expanded === calculatorPanel.classList.contains('expanded')) return;
      if (expanded) {
        const rect = calculatorPanel.getBoundingClientRect();
        calculatorRestorePosition = {left:rect.left,top:rect.top};
        calculatorPanel.classList.add('expanded');
        setTimeout(() => {
          const next = calculatorPanel.getBoundingClientRect();
          positionCalculator((window.innerWidth - next.width) / 2,(window.innerHeight - next.height) / 2);
          resizeGeoGebra();
        },220);
      } else {
        calculatorPanel.classList.remove('expanded');
        setTimeout(() => {
          const restore = calculatorRestorePosition || {left:16,top:16};
          positionCalculator(restore.left,restore.top);
          resizeGeoGebra();
        },220);
      }
      updateCalculatorSizeButton();
    }
    function initializeCalculatorDrag() {
      const handle = calculatorPanel.querySelector('[data-calculator-drag-handle]');
      if (!handle) return;
      handle.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target.closest('button')) return;
        const rect = calculatorPanel.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        handle.classList.add('dragging');
        const move = moveEvent => positionCalculator(moveEvent.clientX - offsetX,moveEvent.clientY - offsetY);
        const end = () => {
          handle.classList.remove('dragging');
          window.removeEventListener('pointermove',move);
          window.removeEventListener('pointerup',end);
          window.removeEventListener('pointercancel',end);
        };
        window.addEventListener('pointermove',move);
        window.addEventListener('pointerup',end);
        window.addEventListener('pointercancel',end);
      });
    }
    function closeAdvancedCalculator(button) {
      calculatorPanel.hidden = true;
      calculatorPanel.classList.remove('graph-mode','expanded');
      calculatorRestorePosition = null;
      button.classList.remove('active');
      button.setAttribute('aria-expanded','false');
    }
    function toggleAdvancedCalculator(event) {
      const button = event.currentTarget;
      const opening = calculatorPanel.hidden;
      if (!opening) {
        closeAdvancedCalculator(button);
        return;
      }
      calculatorPanel.hidden = false;
      button.classList.add('active');
      button.setAttribute('aria-expanded','true');
      calculatorPanel.classList.remove('graph-mode','expanded');
      geogebraApplet = null;
      geogebraApi = null;
      geogebraInitPromise = null;
      calculatorPanel.innerHTML = calculatorMarkup();
      calcExpression = '';
      updateAdvancedCalculatorDisplay();
      placeCalculatorNear(button);
      initializeCalculatorDrag();
      calculatorPanel.querySelector('[data-close-calculator]').addEventListener('click', () => closeAdvancedCalculator(button));
      calculatorPanel.querySelector('[data-toggle-calculator-size]').addEventListener('click', () => setCalculatorExpanded(!calculatorPanel.classList.contains('expanded')));
      calculatorPanel.querySelectorAll('[data-calc-value]').forEach(key => key.addEventListener('click', () => handleAdvancedCalculatorKey(key.dataset.calcValue)));
      calculatorPanel.querySelectorAll('[data-calc-tab]').forEach(tab => tab.addEventListener('click', () => {
        const graphing = tab.dataset.calcTab === 'graph';
        calculatorPanel.querySelectorAll('[data-calc-tab]').forEach(item => item.classList.toggle('active',item === tab));
        calculatorPanel.querySelectorAll('[data-calc-view]').forEach(view => view.hidden = view.dataset.calcView !== tab.dataset.calcTab);
        calculatorPanel.classList.toggle('graph-mode',graphing);
        if (!graphing) setCalculatorExpanded(false);
        calculatorPanel.querySelector('[data-geogebra-attribution]').hidden = !graphing;
        updateCalculatorSizeButton();
        if (graphing) requestAnimationFrame(() => initializeGeoGebraGraphing().then(() => setTimeout(resizeGeoGebra,80)));
      }));
    }
    function updateAdvancedCalculatorDisplay(value = calcExpression || '0') {
      const display = document.getElementById('calcDisplay');
      if (display) display.textContent = value;
    }
    function handleAdvancedCalculatorKey(value) {
      if (value === 'clear') calcExpression = '';
      else if (value === 'back') calcExpression = calcExpression.slice(0,-1);
      else if (value === 'neg') calcExpression = calcExpression.startsWith('−') ? calcExpression.slice(1) : '−' + calcExpression;
      else if (value === '=') {
        const safe = calcExpression.replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replaceAll('^','**');
        if (/^[0-9+*/().\-\s*]+$/.test(safe)) {
          try { calcExpression = String(Function('"use strict";return (' + safe + ')')()); }
          catch { updateAdvancedCalculatorDisplay('Error'); return; }
        }
      } else calcExpression += value;
      updateAdvancedCalculatorDisplay();
    }

    document.getElementById('attachButton').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('imageButton').addEventListener('click', () => document.getElementById('imageInput').click());
    document.getElementById('linkButton').addEventListener('click', event => {
      const opening = linkPopover.hidden;
      linkPopover.hidden = !opening;
      event.currentTarget.classList.toggle('active', opening);
      event.currentTarget.setAttribute('aria-expanded', String(opening));
      document.getElementById('modelPopover').hidden = true;
      document.getElementById('modelButton').setAttribute('aria-expanded','false');
      if (opening) setTimeout(() => linkInput.focus(), 0);
    });
    document.getElementById('addLinkButton').addEventListener('click', () => {
      const value = linkInput.value.trim();
      let normalized = value;
      if (normalized && !/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;
      try {
        const parsed = new URL(normalized);
        if (!/^https?:$/.test(parsed.protocol)) throw new Error('Unsupported protocol');
        const linkKind = document.getElementById('linkButton').dataset.linkKind;
        const isYouTube = linkKind === 'youtube';
        if (isYouTube && !/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(parsed.hostname.toLowerCase())) throw new Error('Not a YouTube URL');
        if (multiSourceCapabilities.has(selectedCapability) && attachedSourceCount() >= creationSourceLimit) {
          showToast(creationSourceLimitToast);
          return;
        }
        const chip = document.createElement('span');
        chip.className = 'attachment-chip attachment-document';
        chip.dataset.sourceKind = isYouTube ? 'youtube' : 'link';
        chip.setAttribute('role', 'listitem');
        chip.innerHTML = `<span class="attachment-type-badge">${icon(isYouTube ? 'i-youtube' : 'i-link')}</span><span class="attachment-copy"><strong></strong><small>${isYouTube ? 'YouTube source' : 'Web source'}</small></span><button class="attachment-remove" type="button">${icon('i-close')}</button>`;
        const sourceTitle = chip.querySelector('strong');
        sourceTitle.textContent = isYouTube ? 'Loading video title…' : parsed.hostname.replace(/^www\./,'');
        chip.title = isYouTube ? 'Loading YouTube video title' : parsed.href;
        chip.dataset.url = parsed.href;
        if (isYouTube) {
          chip.dataset.metadataStatus = 'loading';
          chip.setAttribute('aria-busy','true');
        }
        const removeButton = chip.querySelector('button');
        removeButton.setAttribute('aria-label', isYouTube ? 'Remove YouTube video' : 'Remove web source');
        removeButton.addEventListener('click', () => removeAttachmentChip(chip));
        attachmentRow.appendChild(chip);
        if (isYouTube) void fetchYouTubeTitle(parsed.href)
          .then(title => {
            if (!chip.isConnected) return;
            sourceTitle.textContent = title;
            chip.title = title;
            chip.dataset.metadataStatus = 'resolved';
          })
          .catch(() => {
            if (!chip.isConnected) return;
            sourceTitle.textContent = 'YouTube video';
            chip.title = 'YouTube video title unavailable';
            chip.dataset.metadataStatus = 'fallback';
          })
          .finally(() => {
            if (chip.isConnected) chip.removeAttribute('aria-busy');
          });
        if (!isYouTube && !promptInput.value.trim()) promptInput.value = selectedCapability
          ? `Use the material at ${parsed.href} to ${capabilityData[selectedCapability].action.toLowerCase()} this.`
          : `Help me learn from the material at ${parsed.href}.`;
        updateSubmit();
        linkInput.value = '';
        linkPopover.hidden = true;
        document.getElementById('linkButton').classList.remove('active');
        document.getElementById('linkButton').setAttribute('aria-expanded','false');
        showToast(isYouTube ? 'YouTube source added' : 'Study material link added');
      } catch {
        linkInput.setCustomValidity(document.getElementById('linkButton').dataset.linkKind === 'youtube' ? 'Enter a valid YouTube URL.' : 'Enter a valid public web address.');
        linkInput.reportValidity();
        linkInput.addEventListener('input', () => linkInput.setCustomValidity(''), {once:true});
      }
    });
    linkInput.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); document.getElementById('addLinkButton').click(); } });
    writingEditor.addEventListener('input', updateWritingEditorState);
    researchInput.addEventListener('input', updateWritingEditorState);
    writingEditor.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !writingActionButton.disabled) writingActionButton.click();
    });
    researchInput.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !researchActionButton.disabled) researchActionButton.click();
    });
    document.getElementById('writingToolOptions').addEventListener('click', event => {
      const option = event.target.closest('[data-paraphrase-style]');
      if (!option) return;
      document.querySelectorAll('[data-paraphrase-style]').forEach(button => button.setAttribute('aria-pressed', String(button === option)));
      const customInstruction = document.getElementById('paraphraseCustomInstruction');
      if (!customInstruction) return;
      const customSelected = option.dataset.paraphraseStyle === 'Custom';
      customInstruction.hidden = !customSelected;
      if (customSelected) customInstruction.focus();
    });
    citationSelectors.addEventListener('click', event => {
      const trigger = event.target.closest('[data-citation-trigger]');
      if (trigger) {
        const type = trigger.dataset.citationTrigger;
        const menu = document.getElementById(type === 'format' ? 'citationFormatMenu' : 'citationSourceTypeMenu');
        const opening = menu.hidden;
        closeCitationMenus();
        menu.hidden = !opening;
        trigger.setAttribute('aria-expanded', String(opening));
        return;
      }
      const option = event.target.closest('[data-citation-option]');
      if (!option) return;
      if (option.dataset.citationOption === 'format') selectedCitationFormat = option.dataset.citationValue;
      else selectedCitationSourceType = option.dataset.citationValue;
      syncCitationSelectors();
      closeCitationMenus();
      document.getElementById(option.dataset.citationOption === 'format' ? 'citationFormatButton' : 'citationSourceTypeButton').focus();
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('#citationSelectors')) closeCitationMenus();
    });
    document.getElementById('writingPasteButton').addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return showToast('Clipboard is empty');
        writingEditor.value = text;
        updateWritingEditorState();
        writingEditor.focus();
      } catch (error) {
        showToast('Paste permission is unavailable. Use ⌘V or Ctrl+V.');
      }
    });
    document.getElementById('writingSampleButton').addEventListener('click', () => {
      writingEditor.value = 'Spring is a beautiful season that brings warmth and new life to the environment. During this time, flowers begin to bloom and trees turn green again. The weather becomes more pleasant, and people often spend more time outdoors. Many individuals feel happier and more energetic as the days grow longer. Spring also represents a fresh start and new opportunities for growth and development. Overall, it is a season that has a positive impact on both nature and human emotions.';
      updateWritingEditorState();
      writingEditor.focus();
    });
    document.getElementById('writingUploadButton').addEventListener('click', () => document.getElementById('writingFileInput').click());
    document.getElementById('writingFileInput').addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;
      if (!isSupportedWritingFile(file)) {
        event.target.value = '';
        showToast(WRITING_UNSUPPORTED_FILE_TOAST);
        return;
      }
      const targetEditor = writingEditor;
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        const reader = new FileReader();
        reader.addEventListener('load', () => { targetEditor.value = String(reader.result || ''); updateWritingEditorState(); showToast(file.name + ' uploaded'); });
        reader.readAsText(file);
      } else {
        targetEditor.value = `Uploaded file: ${file.name}\n\nPaste or review the extracted text here before processing.`;
        updateWritingEditorState();
        showToast(file.name + ' uploaded');
      }
      event.target.value = '';
    });
    document.querySelectorAll('[data-research-sample]').forEach(button => button.addEventListener('click', () => {
      researchInput.value = button.dataset.researchSample;
      updateWritingEditorState();
      researchInput.focus();
    }));
    writingActionButton.addEventListener('click', () => {
      const value = writingEditor.value.trim();
      if (!value) return;
      const toolKey = selectedCapability;
      writingActionButton.disabled = true;
      const label = writingActionButton.querySelector('span');
      const originalLabel = writingToolData[toolKey].action;
      label.textContent = 'Processing…';
      setTimeout(() => {
        writingResultContent.textContent = processWritingText(toolKey, value);
        writingResultContent.classList.add('has-result');
        document.getElementById('writingResultPanel').hidden = false;
        label.textContent = originalLabel;
        writingActionButton.disabled = false;
        showToast(originalLabel + ' complete');
      }, 420);
    });
    researchActionButton.addEventListener('click', () => {
      const value = researchInput.value.trim();
      if (!value) return;
      researchActionButton.disabled = true;
      researchActionButton.querySelector('span').textContent = 'Searching…';
      setTimeout(() => {
        researchResultContent.textContent = processWritingText('research', value);
        researchResultContent.classList.add('has-result');
        document.getElementById('researchResult').hidden = false;
        researchActionButton.querySelector('span').textContent = 'Search';
        researchActionButton.disabled = false;
        showToast('Research ready');
      }, 420);
    });
    document.getElementById('fileInput').addEventListener('change', event => { addFiles(event.target.files); event.target.value = ''; });
    document.getElementById('imageInput').addEventListener('change', event => { addFiles(event.target.files); event.target.value = ''; });
    document.getElementById('calculatorButton').addEventListener('click', toggleAdvancedCalculator);

    document.getElementById('modelButton').addEventListener('click', event => {
      const popover = document.getElementById('modelPopover');
      popover.hidden = !popover.hidden;
      event.currentTarget.setAttribute('aria-expanded', String(!popover.hidden));
    });
    document.querySelectorAll('[data-model]').forEach(option => option.addEventListener('click', () => {
      document.getElementById('modelLabel').textContent = option.dataset.model;
      document.querySelectorAll('[data-model]').forEach(item => item.classList.toggle('active', item === option));
      document.querySelectorAll('[data-model] .model-check').forEach(check => check.textContent = '');
      option.querySelector('.model-check').textContent = '✓';
      document.getElementById('modelPopover').hidden = true;
      document.getElementById('modelButton').setAttribute('aria-expanded','false');
      showToast(`${option.dataset.model} selected`);
    }));
    document.getElementById('voiceButton').addEventListener('click', event => {
      const listening = event.currentTarget.getAttribute('aria-pressed') !== 'true';
      event.currentTarget.setAttribute('aria-pressed', String(listening));
      event.currentTarget.classList.toggle('active', listening);
      showToast(listening ? 'Voice input is listening' : 'Voice input stopped');
    });

    const composerShell = document.getElementById('composerShell');
    composerShell.addEventListener('dragenter', event => {
      event.preventDefault();
      if (!capabilitySupportsFileUpload()) return;
      dragDepth += 1;
      composerShell.classList.add('dragging');
    });
    composerShell.addEventListener('dragover', event => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = capabilitySupportsFileUpload() ? 'copy' : 'none';
    });
    composerShell.addEventListener('dragleave', event => {
      event.preventDefault();
      if (!capabilitySupportsFileUpload()) {
        dragDepth = 0;
        composerShell.classList.remove('dragging');
        return;
      }
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) composerShell.classList.remove('dragging');
    });
    composerShell.addEventListener('drop', event => {
      event.preventDefault();
      dragDepth = 0;
      composerShell.classList.remove('dragging');
      if (!capabilitySupportsFileUpload()) return;
      addFiles(event.dataTransfer.files);
    });

    document.getElementById('sidebarCollapse').addEventListener('click', () => app.classList.toggle('sidebar-collapsed'));
    sidebar.addEventListener('mouseenter', () => {
      if (app.classList.contains('sidebar-collapsed')) app.classList.remove('sidebar-collapsed');
    });
    document.getElementById('mobileMenu').addEventListener('click', () => app.classList.toggle('mobile-sidebar-open'));
    document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
    document.getElementById('historyEntry').addEventListener('click', () => {
      if (document.body.classList.contains('history-open')) closeHistoryDrawer();
      else openHistoryDrawer();
    });
    document.getElementById('historyDrawerClose').addEventListener('click', () => closeHistoryDrawer());
    document.getElementById('historyBackdrop').addEventListener('click', () => closeHistoryDrawer());
    document.getElementById('homeNav').addEventListener('click', () => {
      app.classList.remove('mobile-sidebar-open');
      homeWorkspace.hidden = false;
      courseWorkspace.hidden = true;
      examPredictorWorkspace.hidden = true;
      activeCoursePackageIndex = null;
      document.body.classList.remove('exam-predictor-open');
      document.getElementById('examPredictorNav').classList.remove('active');
      document.getElementById('homeNav').classList.add('active');
      history.replaceState(null, '', location.pathname + location.search);
      document.title = 'Solvely — One place to learn anything';
      selectWorkspaceMode('study', false);
      window.scrollTo({top:0, behavior:'smooth'});
    });
    document.getElementById('examPredictorNav').addEventListener('click', () => {
      app.classList.remove('mobile-sidebar-open');
      openExamPredictorSample(0);
    });
    document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));
    document.querySelectorAll('[data-recent-capability]').forEach(button => button.addEventListener('click', () => {
      homeWorkspace.hidden = false;
      courseWorkspace.hidden = true;
      examPredictorWorkspace.hidden = true;
      activeCoursePackageIndex = null;
      history.replaceState(null, '', location.pathname + location.search);
      const capabilityKey = button.dataset.recentCapability;
      selectWorkspaceMode(capabilityKey === 'mock' ? 'exam' : 'study', false);
      if (capabilityKey !== 'mock') selectCapability(capabilityKey, false);
      promptInput.value = button.dataset.recentPrompt;
      updateSubmit();
      closeHistoryDrawer(false);
      promptInput.focus();
      document.getElementById('composerShell').scrollIntoView({ behavior:'smooth', block:'center' });
    }));
    document.getElementById('chatButton').addEventListener('click', () => showToast('Solvely support is ready'));
    document.getElementById('dialogClose').addEventListener('click', closeDialog);
    document.getElementById('diagnosticEntryButton').addEventListener('click', openDiagnosticDialog);
    document.getElementById('diagnosticDialogClose').addEventListener('click', () => document.getElementById('diagnosticDialog').close());
    document.getElementById('diagnosticExam').addEventListener('change', populateDiagnosticScores);
    document.getElementById('diagnosticSetupForm').addEventListener('submit', event => {
      event.preventDefault();
      showDiagnosticReady();
    });
    document.getElementById('diagnosticEdit').addEventListener('click', () => {
      document.getElementById('diagnosticSetupForm').hidden = false;
      document.getElementById('diagnosticReady').hidden = true;
    });
    document.getElementById('diagnosticStart').addEventListener('click', () => {
      document.getElementById('diagnosticDialog').close();
      showToast('Diagnostic started · 10 adaptive questions');
    });
    document.getElementById('diagnosticDialog').addEventListener('click', event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });
    document.getElementById('cropDialogClose').addEventListener('click', closeCropDialog);
    cropDone.addEventListener('click',applyAllCrops);
    cropSelection.addEventListener('pointerdown',startCropGesture);
    document.getElementById('examCourseSearch').addEventListener('input', renderCourseCatalog);
    document.getElementById('examCourseFilter').addEventListener('change', renderCourseCatalog);
    document.getElementById('courseBackButton').addEventListener('click', closeCoursePackage);
    document.querySelector('[data-predictor-task]').addEventListener('click', event => {
      const task = event.currentTarget;
      const completed = task.getAttribute('aria-pressed') === 'true';
      task.setAttribute('aria-pressed', String(!completed));
      showToast(completed ? 'Cheat Sheet moved back to your plan' : 'Cheat Sheet completed');
    });
    document.querySelectorAll('[data-course-tab]').forEach(button => button.addEventListener('click', () => {
      activeCoursePackageTab = button.dataset.courseTab;
      renderCoursePackage();
    }));
    document.querySelectorAll('[data-workspace-mode]').forEach(button => button.addEventListener('click', () => selectWorkspaceMode(button.dataset.workspaceMode)));
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener('close', () => { clearInterval(mediaTimer); mediaTimer = null; pauseDialogAudio(); });
    cropDialog.addEventListener('click',event => { if (event.target === cropDialog) closeCropDialog(); });
    cropDialog.addEventListener('close',() => {
      endCropGesture();
      cropImageChips = [];
      cropWorkingStates.clear();
      cropEditorImage.removeAttribute('src');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        document.getElementById('modelPopover').hidden = true;
        closeCitationMenus();
        if (document.body.classList.contains('history-open')) closeHistoryDrawer(false);
        if (app.classList.contains('mobile-sidebar-open')) app.classList.remove('mobile-sidebar-open');
      }
    });
    window.addEventListener('resize', () => {
      if (cropDialog.open) resizeCropEditor();
      if (calculatorPanel.hidden) return;
      const rect = calculatorPanel.getBoundingClientRect();
      positionCalculator(rect.left, rect.top);
      setTimeout(resizeGeoGebra, 230);
    });
    window.addEventListener('popstate', syncCourseRoute);

    const solverSampleMessageHandler = event => {
      const frame = document.querySelector('#dialogPreview iframe');
      if (!frame || event.source !== frame.contentWindow) return;
      if (event.data?.type === 'solvely-solver-sample-title') {
        if (typeof event.data.title === 'string') document.getElementById('dialogTitle').textContent = event.data.title;
        if (typeof event.data.description === 'string') document.getElementById('dialogDescription').textContent = event.data.description;
        return;
      }
      if (event.data?.type !== 'solvely-solver-sample-size') return;
      if (!['chemistry-document', 'accounting-document'].includes(dialog.dataset.mode)) return;
      const contentHeight = Math.ceil(Number(event.data.height));
      if (!Number.isFinite(contentHeight) || contentHeight <= 0) return;
      frame.style.height = `${Math.min(1600, Math.max(240, contentHeight))}px`;
    };
    window.addEventListener('message', solverSampleMessageHandler);

    configureExtensionCta();
    selectWorkspaceMode('study', false);
    syncCourseRoute();

  return () => {
    window.removeEventListener('message', solverSampleMessageHandler)
    clearInterval(mediaTimer)
    pauseDialogAudio()
  }
}
