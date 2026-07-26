import type { GlossaryEntry } from '../glossary';

// Chapter 66 — Objects and morphisms (Part XVII: Category Theory I).
// Every key is prefixed `oam66` so it stays unique alongside sibling
// chapters authored in parallel for this part.
const entries: Record<string, GlossaryEntry> = {
  oam66Category: {
    term: 'Category',
    symbol: '\\mathcal{A}',
    definition:
      'A category consists of a class of objects, and for each pair of objects a set of arrows (morphisms) between them, together with an associative composition rule and an identity arrow on each object. Groups, rings, topological spaces, vector spaces, and sets each form a category, with the usual structure-preserving maps as arrows.',
    example: 'Grp, the category of groups and group homomorphisms.',
  },
  oam66Object: {
    term: 'Object of a category',
    symbol: '\\obj(\\mathcal{A})',
    definition:
      'The "things" a category is built from — one of the two kinds of data in a category, alongside arrows. We usually just write A ∈ 𝒜 to mean A is an object of 𝒜.',
  },
  oam66Arrow: {
    term: 'Arrow (morphism)',
    symbol: 'f \\colon A_1 \\to A_2',
    definition:
      'A map between two objects of a category — also called a morphism. Arrows need not be functions in the usual sense (see: posets as categories); all that matters is that they compose associatively and every object has an identity arrow.',
  },
  oam66HomSet: {
    term: 'Hom-set',
    symbol: '\\Hom_{\\mathcal{A}}(A_1, A_2)',
    definition:
      'The set of all arrows from A₁ to A₂ in a category 𝒜. In a "locally small" category this is always a genuine set, even though the objects of 𝒜 may only form a class.',
  },
  oam66Composition: {
    term: 'Composition of arrows',
    symbol: 'g \\circ f',
    definition:
      'Given arrows f: A₁ → A₂ and g: A₂ → A₃, composition produces an arrow g∘f: A₁ → A₃. Composition is required to be associative: (h∘g)∘f = h∘(g∘f). If h = g∘f we say h factors through A₂.',
  },
  oam66Factors: {
    term: 'Factors through',
    symbol: 'h = g \\circ f',
    definition:
      'We say an arrow h: A₁ → A₃ factors through an object A₂ if h can be written as a composite g∘f through A₂, i.e. there are arrows f: A₁ → A₂ and g: A₂ → A₃ with h = g∘f.',
  },
  oam66IdentityArrow: {
    term: 'Identity arrow',
    symbol: '\\id_A',
    definition:
      'Every object A of a category has a distinguished identity arrow id_A: A → A, satisfying id_A ∘ f = f for any arrow f into A, and g ∘ id_A = g for any arrow g out of A.',
  },
  oam66Class: {
    term: 'Class (vs. set)',
    definition:
      'A collection too large to be a set — Cantor’s paradox shows there is no set of all sets, so the objects of a category (e.g. "all groups") are only guaranteed to form a class. You can usually think "class" ≈ "set" and not worry about the distinction.',
  },
  oam66LocallySmall: {
    term: 'Locally small category',
    definition:
      'A category in which, even though the objects may only form a class, the arrows between any two fixed objects always form a genuine set. Every category we work with here is assumed locally small.',
  },
  oam66CatGrp: {
    term: 'Grp — the category of groups',
    symbol: '\\catname{Grp}',
    definition:
      'The category whose objects are groups and whose arrows are group homomorphisms, with composition given by ordinary function composition.',
  },
  oam66CatCRing: {
    term: 'CRing — the category of commutative rings',
    symbol: '\\catname{CRing}',
    definition:
      'The category whose objects are (commutative) rings and whose arrows are ring homomorphisms.',
  },
  oam66CatTop: {
    term: 'Top — the category of topological spaces',
    symbol: '\\catname{Top}',
    definition:
      'The category whose objects are topological spaces and whose arrows are continuous maps.',
  },
  oam66CatTopStar: {
    term: 'Top∗ — pointed topological spaces',
    symbol: '\\catname{Top}_\\ast',
    definition:
      'The category of topological spaces X equipped with a distinguished basepoint x₀ ∈ X, written (X, x₀). Arrows are continuous maps f: X → Y with f(x₀) = y₀ — that is, continuous maps that preserve the basepoint.',
  },
  oam66CatVect: {
    term: 'Vect_k — the category of vector spaces',
    symbol: '\\catname{Vect}_k',
    definition:
      'The category whose objects are (possibly infinite-dimensional) vector spaces over a fixed field k, and whose arrows are k-linear maps. FDVect_k is the sub-category restricted to finite-dimensional spaces.',
  },
  oam66CatFDVect: {
    term: 'FDVect_k — finite-dimensional vector spaces',
    symbol: '\\catname{FDVect}_k',
    definition:
      'The sub-category of Vect_k consisting only of finite-dimensional vector spaces over k, with k-linear maps as arrows.',
  },
  oam66CatSet: {
    term: 'Set — the category of sets',
    symbol: '\\catname{Set}',
    definition:
      'The category whose objects are sets and whose arrows are arbitrary functions between them (no structure to preserve).',
  },
  oam66Poset: {
    term: 'Poset as a category',
    definition:
      'Any partially ordered set 𝒫 becomes a category: the objects are the elements of 𝒫, we add an identity arrow id_p for every p, and a single arrow p → q whenever p ≤ q and p ≠ q. This is a non-concrete category — its arrows are not functions, just instances of the relation ≤.',
  },
  oam66ConcreteCategory: {
    term: 'Concrete category',
    definition:
      'Informally, a category whose arrows really are structure-preserving functions between sets — like Grp, Top, or CRing. Posets and one-object "group" categories are examples of categories that are not concrete.',
  },
  oam66CategoricalIsomorphism: {
    term: 'Isomorphism (categorical)',
    symbol: 'A_1 \\cong A_2',
    definition:
      'An arrow f: A₁ → A₂ is an isomorphism if there is an arrow g: A₂ → A₁ with f∘g = id and g∘f = id. This single arrow-only definition specializes to bijective homomorphism (Grp), homeomorphism (Top), bijective linear map (Vect_k), and so on — recovering every isomorphism notion we met earlier from one categorical template.',
    example: 'In Set, X ≅ Y exactly when |X| = |Y|.',
  },
  oam66InitialObject: {
    term: 'Initial object',
    symbol: 'A_{\\text{init}}',
    definition:
      'An object A_init of 𝒜 such that for every object A ∈ 𝒜 (A_init itself included), there is exactly one arrow A_init → A. Initial objects are unique up to unique isomorphism whenever they exist.',
    example: 'The empty set ∅ is the initial object of Set; the trivial group {1} is initial in Grp; ℤ is initial in CRing.',
  },
  oam66TerminalObject: {
    term: 'Terminal object',
    symbol: 'A_{\\text{final}}',
    definition:
      'An object A_final of 𝒜 such that for every object A ∈ 𝒜 (A_final itself included), there is exactly one arrow A → A_final. The dual notion to an initial object: terminal objects of 𝒜 are initial objects of 𝒜^op.',
    example: 'The singleton set {∗} is terminal in Set; the trivial group {1} is terminal in Grp; the zero ring 0 is terminal in CRing.',
  },
  oam66FreeObject: {
    term: 'Free object',
    definition:
      'In a concrete category, an object F such that arrows out of F correspond exactly to elements of the target: Hom(F, X) is in bijection with the underlying set of X. Elements become "functions from a special object" instead of primitive data.',
    example: 'In Set, arrows {∗} → S correspond to elements of S. In Grp, arrows ℤ → G correspond to elements of G (send 1 to the desired element).',
  },
  oam66OppositeCategory: {
    term: 'Opposite category',
    symbol: '\\mathcal{A}^{\\op}',
    definition:
      'Given a category 𝒜, the opposite category 𝒜^op has the same objects, but every arrow is reversed: an arrow A → B in 𝒜 becomes an arrow B → A in 𝒜^op. Any categorical notion has a "dual" obtained by translating it to 𝒜^op — often signaled by prefixing "co-" (product/coproduct, limit/colimit).',
  },
  oam66ProductCategory: {
    term: 'Product category',
    symbol: '\\mathcal{A} \\times \\mathcal{B}',
    definition:
      'Given categories 𝒜 and ℬ, the product category 𝒜 × ℬ has objects the pairs (A, B) with A ∈ 𝒜, B ∈ ℬ, and arrows (A₁, B₁) → (A₂, B₂) given by pairs of arrows (f: A₁ → A₂, g: B₁ → B₂), composed componentwise.',
  },
  oam66UniversalProperty: {
    term: 'Universal property',
    definition:
      'A way of characterizing an object purely by the arrows into or out of it, in a way that pins the object down up to unique isomorphism — no reference to any internal construction is needed. Initial/terminal objects and products/coproducts are all defined by universal properties.',
  },
  oam66Product: {
    term: 'Product (categorical)',
    symbol: 'X \\times Y',
    definition:
      'The product of objects X, Y in a category 𝒜 is an object X × Y together with projection arrows π_X: X×Y → X and π_Y: X×Y → Y, universal in the sense that for any object A and arrows g: A → X, h: A → Y, there is a unique arrow f: A → X×Y with π_X∘f = g and π_Y∘f = h. Products are unique up to unique isomorphism when they exist.',
    example: 'In Set, X × Y is the Cartesian product. In Grp, it is the direct product group. In a poset, it is the greatest lower bound (meet) of x and y.',
  },
  oam66Cone: {
    term: 'Cone',
    definition:
      'Given a family of objects (Xᵢ)ᵢ∈I in a category, a cone on them is an object A together with a "projection" arrow A → Xᵢ for every i ∈ I.',
  },
  oam66Coproduct: {
    term: 'Coproduct',
    symbol: 'X + Y',
    definition:
      'The dual of the product: an object X+Y together with inclusion arrows ι_X: X → X+Y and ι_Y: Y → X+Y, universal in the sense that for any object A and arrows g: X → A, h: Y → A, there is a unique arrow f: X+Y → A with f∘ι_X = g and f∘ι_Y = h. Equivalently, a coproduct in 𝒜 is a product in 𝒜^op.',
    example: 'In Set, the coproduct is disjoint union. In Vect_k, it agrees with the product: V ⊕ W.',
  },
  oam66Cocone: {
    term: 'Cocone',
    definition:
      'The dual of a cone: an object A together with an "inclusion" arrow Xᵢ → A for every i in a family of objects (Xᵢ)ᵢ∈I. A coproduct is a universal cocone, exactly as a product is a universal cone.',
  },
  oam66Monic: {
    term: 'Monic map (monomorphism)',
    definition:
      'An arrow f: X → Y is monic if it is left-cancellable: whenever f∘g = f∘h for arrows g, h: A → X, we must have g = h. This is the categorical analogue of injective — the two notions agree in "most" concrete categories, but not all.',
    example: 'ℚ → ℚ/ℤ is monic in the category of divisible abelian groups, despite not being injective.',
  },
  oam66Epic: {
    term: 'Epic map (epimorphism)',
    definition:
      'An arrow f: X → Y is epic if it is right-cancellable: whenever g∘f = h∘f for arrows g, h: Y → A, we must have g = h. This is the categorical analogue of surjective, dual to monic (an arrow is epic in 𝒜 exactly when it is monic in 𝒜^op).',
    example: 'The inclusion ℤ ↪ ℚ is epic in CRing despite not being surjective.',
  },
  oam66DivisibleGroup: {
    term: 'Divisible abelian group',
    definition:
      'An additive abelian group G is divisible if for every x ∈ G and integer n > 0 there exists y ∈ G with ny = x — every element has an "nth part" for every n. ℚ and ℚ/ℤ are divisible; ℤ is not (2y = 1 has no integer solution).',
  },
};

export default entries;
