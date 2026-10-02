/**
 * All copy in one place. NOPAL is a placeholder concept brand (nopal is the
 * Spanish name for the prickly-pear cactus pad), not a real product.
 */

export const brand = 'NOPAL';

export const nav = {
  links: [
    {label: 'The Fruit', href: '#fruit'},
    {label: 'The Press', href: '#press'},
    {label: 'Desert Farms', href: '#farms'},
    {label: 'Water-Wise', href: '#water'},
  ],
  cta: {label: 'Find a Store', href: '#stores'},
};

/** The split headline: top-left, top-right, bottom-right — read as one line. */
export const headline = ['Drink', 'the', 'Desert'] as const;

export const tagline = [
  'Cold-pressed prickly pear,',
  'picked at first light,',
  'poured over ice for',
  'the hottest hours',
  'of the day',
];

/**
 * Spec callouts that land when the glass settles. `anchor` is a point on the
 * glass in the film's own frame (0–1 of the full 16:9 picture), measured on
 * the clip's resting frames; `side` is where the label sits relative to it.
 */
export const callouts = [
  {label: 'Cold-Pressed Pear', anchor: [0.655, 0.34], side: 'right'},
  {label: 'Sun-Picked at Dawn', anchor: [0.362, 0.54], side: 'left'},
] as const;
