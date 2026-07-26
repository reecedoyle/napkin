import type { GlossaryEntry } from '../glossary';

// Chapter 68 — Limits in categories (TO DO in the source).
// Every key is prefixed lim68 so it can never collide with sibling
// part-17 chapters authored in parallel worktrees.
const entries: Record<string, GlossaryEntry> = {
  lim68Equalizer: {
    term: 'Equalizer',
    symbol: 'E \\xrightarrow{e} X',
    definition:
      'Given two parallel arrows f, g: X → Y, the equalizer is an object E with a map e: E → X such that f∘e = g∘e, and which is universal: every other such map factors uniquely through e. In Set it is the subset {x ∈ X : f(x) = g(x)}.',
    example:
      'The equalizer of a homomorphism φ: G → H and the trivial homomorphism G → H is the inclusion of ker φ into G.',
  },
  lim68Cone: {
    term: 'Cone (over a diagram)',
    definition:
      'A cone over a diagram is an object A together with one arrow ("projection") from A to each object of the diagram, chosen so that composing any projection with an arrow of the diagram gives another projection of the cone.',
  },
  lim68Fork: {
    term: 'Fork',
    definition:
      'A cone over a pair of parallel arrows X ⇉ Y: an object A with a map q: A → X such that the two composites A → X → Y agree. Named for the shape of A → X ⇉ Y drawn in a line.',
  },
  lim68UniversalProperty: {
    term: 'Universal cone',
    definition:
      'A cone over a diagram is universal if every other cone over the same diagram factors through it by a unique map. Being defined by a universal property pins an object down up to a unique isomorphism, without referring to what it is "made of".',
  },
  lim68Diagram: {
    term: 'Diagram (in a category)',
    definition:
      'A choice of some objects of a category together with some arrows between them. A discrete diagram has no arrows (just objects); a parallel pair X ⇉ Y is a diagram with two objects and two arrows sharing the same source and target.',
  },
  lim68Limit: {
    term: 'Limit',
    definition:
      'The universal cone over a diagram: an object together with projections to every object of the diagram, through which every other cone over that diagram factors uniquely. Products and equalizers are both special cases, for particular choices of diagram.',
  },
  lim68Colimit: {
    term: 'Colimit',
    definition:
      'The dual notion to a limit: reverse every arrow (a cone becomes a "co-cone" mapping out of the diagram into an object), and ask for the universal such co-cone. Equivalently, a colimit in a category is a limit in the opposite category.',
  },
  lim68Monic: {
    term: 'Monic (monomorphism)',
    definition:
      'An arrow e: E → X is monic if it is left-cancellable: for any object Z and any two arrows u, v: Z → E, e∘u = e∘v forces u = v. This is the categorical generalization of "injective".',
  },
};

export default entries;
