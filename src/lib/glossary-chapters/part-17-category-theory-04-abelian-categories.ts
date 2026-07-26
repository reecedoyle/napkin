import type { GlossaryEntry } from '../glossary';

// Chapter 69 — Abelian categories. Every key is prefixed `ac69` so it can't
// collide with glossary keys from sibling chapters authored in parallel
// elsewhere in Part XVII (category theory).
const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 — Zero objects, kernels, cokernels, images ──────────────
  ac69ZeroObject: {
    term: 'Zero object',
    symbol: '0',
    definition: 'An object of a category that is both initial (exactly one map out of it, to every object) and terminal (exactly one map into it, from every object). Unique up to unique isomorphism when it exists.',
    example: 'In Grp, the trivial group {1}. In Vect_k, the zero-dimensional vector space {0}.',
  },
  ac69ZeroMorphism: {
    term: 'Zero morphism',
    symbol: 'A \\to 0 \\to B',
    definition: 'In a category with a zero object 0, the distinguished map A → B obtained by composing the unique map A → 0 with the unique map 0 → B. Also just written 0.',
    example: 'In Grp this is the trivial homomorphism sending every element of A to the identity of B.',
  },
  ac69Monic: {
    term: 'Monic morphism',
    symbol: 'A \\injto B',
    definition: 'A categorical generalization of "injective": a map f: A → B such that fg = fh always forces g = h, for any pair of maps g, h into A. Drawn with a hooked arrow ↪.',
    example: 'In Grp and Vect_k, monic coincides with injective as a function.',
  },
  ac69Epic: {
    term: 'Epic morphism',
    symbol: 'A \\surjto B',
    definition: 'A categorical generalization of "surjective": a map f: A → B such that gf = hf always forces g = h, for any pair of maps out of B. Drawn with a two-headed arrow ↠.',
    example: 'In Grp and Vect_k, epic coincides with surjective as a function.',
  },
  ac69Kernel: {
    term: 'Kernel (categorical)',
    symbol: '\\ker f \\colon \\Ker f \\injto A',
    definition: 'For a map A →f B in a category with zero object, the kernel is the equalizer of f and the zero map A → B: a monic map ker f: Ker f ↪ A universal among maps into A that become 0 when composed with f.',
    example: 'In Grp/Ab, Ker f is the ordinary kernel subgroup {a ∈ A : f(a) = 0}, with ker f its inclusion map.',
  },
  ac69Cokernel: {
    term: 'Cokernel (categorical)',
    symbol: '\\coker f \\colon B \\surjto \\Coker f',
    definition: 'For a map A →f B, the dual notion to the kernel: an epic map coker f: B ↠ Coker f universal among maps out of B that vanish when precomposed with f. Think of Coker f as "B modulo the image of f".',
    example: 'The cokernel of ℤ/6ℤ → D₁₂ (sending the generator to r) is D₁₂/⟨r⟩ ≅ ℤ/2ℤ.',
  },
  ac69Image: {
    term: 'Image (categorical)',
    symbol: '\\Img f = \\Ker(\\coker f)',
    definition: 'The image of a map f: A → B, defined as the kernel of its cokernel. This gives a canonical map img f: A → Img f. When it exists, this agrees with the usual set-theoretic image.',
    example: 'For a group homomorphism φ: G → H, Img φ recovers the familiar subgroup φ(G) ≤ H when φ(G) happens to be normal.',
  },

  // ────────────── Category names ──────────────
  ac69Grp: {
    term: 'Category of groups',
    symbol: '\\catname{Grp}',
    definition: 'The category whose objects are groups and whose morphisms are group homomorphisms.',
  },
  ac69Ab: {
    term: 'Category of abelian groups',
    symbol: '\\catname{Ab}',
    definition: 'The category whose objects are abelian groups and whose morphisms are group homomorphisms. A subcategory of Grp; unlike Grp, it is an abelian category.',
  },
  ac69VectK: {
    term: 'Category of k-vector spaces',
    symbol: '\\catname{Vect}_k',
    definition: 'The category whose objects are vector spaces over a fixed field k and whose morphisms are k-linear maps.',
  },
  ac69ModR: {
    term: 'Category of R-modules',
    symbol: '\\catname{Mod}_R',
    definition: 'The category whose objects are (left) modules over a fixed ring R and whose morphisms are R-linear maps. Generalizes both Ab (R = ℤ) and Vect_k (R = k a field).',
  },
  ac69Set: {
    term: 'Category of sets',
    symbol: '\\catname{Set}',
    definition: 'The category whose objects are sets and whose morphisms are arbitrary functions. Has no zero object: the empty set is initial but not terminal (unless we allow no objects at all), and any one-point set is terminal but not initial.',
  },
  ac69Top: {
    term: 'Category of topological spaces',
    symbol: '\\catname{Top}',
    definition: 'The category whose objects are topological spaces and whose morphisms are continuous maps. Like Set, it has no zero object.',
  },

  // ────────────── §2 — Additive and abelian categories ──────────────
  ac69AdditiveCategory: {
    term: 'Additive category',
    definition: 'A category with a zero object, where any two objects have a product, and — the key extra structure — every Hom(A, B) is an abelian group (written additively) such that composition distributes over addition. The zero map is the identity element of each Hom-group.',
    example: 'Ab, Vect_k, and Mod_R are additive: (f+g)(x) := f(x)+g(x) for homomorphisms/linear maps f, g. Grp is not additive — there is no way to add two group homomorphisms and get another homomorphism in general.',
  },
  ac69AbelianCategory: {
    term: 'Abelian category',
    definition: 'An additive category in which every map has a kernel and a cokernel, and every map factors as an epic followed by a monic through its image (equivalently, img f is always epic onto Ker(coker f)). This is exactly the setting where kernels/cokernels/images/exact sequences behave the way you expect from Ab or Mod_R.',
    example: 'Ab, Vect_k, and Mod_R are abelian categories. Grp is not even additive, so it cannot be abelian.',
  },
  ac69CategoricalIso: {
    term: 'Isomorphism (categorical)',
    definition: 'A morphism f: A → B with a two-sided inverse g: B → A (fg = id_B and gf = id_A). In an abelian category, f is an isomorphism if and only if it is both monic and epic — a fact that fails in general categories but holds here thanks to kernels and cokernels.',
  },

  // ────────────── §3 — Exact sequences ──────────────
  ac69ExactAt: {
    term: 'Exact (at an object)',
    symbol: '\\Img f_n \\to \\Ker f_{n+1}',
    definition: 'A sequence …→ A_{n-1} →f_n A_n →f_{n+1} A_{n+1} →… in an abelian category is exact at A_n if the composite f_{n+1}∘f_n = 0 and the resulting canonical map Img f_n → Ker f_{n+1} is an isomorphism. For groups this recovers "the image of f_n equals the kernel of f_{n+1}." The whole sequence is exact if it is exact at every internal object.',
    example: 'The sequence 0 → ℤ/3ℤ → ℤ/15ℤ → ℤ/5ℤ → 0 (inclusion then quotient) is exact at every internal term.',
  },
  ac69ShortExactSequence: {
    term: 'Short exact sequence',
    symbol: '0 \\to A \\to B \\to C \\to 0',
    definition: 'An exact sequence of exactly this shape: the first map is automatically monic (since it follows a 0) and the last is automatically epic (since it precedes a 0). Slogan: it packages the equation C ≅ B/A together with the specific maps realizing A as a "subobject" of B and C as the corresponding quotient.',
    example: '0 → ℤ →(×3) ℤ → ℤ/3ℤ → 0 is short exact; so is 0 → G → G×H → H → 0 for any groups G, H.',
  },
  ac69SmallCategory: {
    term: 'Small category',
    symbol: '\\obj(\\AA)',
    definition: 'A category AA is small if obj(AA), the collection of its objects, forms a set rather than a proper class. Most familiar categories (Set, Grp, Top, …) are not small, since there is no set of all sets/groups/spaces.',
  },
  ac69FreydMitchell: {
    term: 'Freyd–Mitchell embedding theorem',
    definition: 'Every small abelian category AA embeds via a full, faithful, exact functor into Mod_R, the category of left modules over some ring R (with 1, possibly non-commutative). Consequence: any statement provable by chasing elements around a diagram in Mod_R holds in every abelian category.',
  },
  ac69ExactFunctor: {
    term: 'Exact functor',
    definition: 'A functor between abelian categories that sends exact sequences to exact sequences — equivalently, it preserves kernels and cokernels. The functor from Freyd–Mitchell is exact, which is what licenses "diagram chasing" arguments in a general abelian category.',
  },
  ac69DiagramChase: {
    term: 'Diagram chase',
    definition: 'An informal proof technique for statements about abelian categories: invoke Freyd–Mitchell to treat objects as if they were R-modules with actual elements, then argue by picking elements and tracking where various maps send them around a commutative diagram.',
  },
};

export default entries;
