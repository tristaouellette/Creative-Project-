import type {CSSProperties} from 'react';

/** Inline CSS custom properties, e.g. `vars({'--d': 300})` for a stagger delay. */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;
