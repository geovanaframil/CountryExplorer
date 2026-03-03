export const uiTypography = {
  /**
   * Títulos principais da aplicação
   */
  heading: {
    h1: 'text-3xl md:text-4xl font-semibold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-lg font-medium tracking-tight',
  },

  /**
   * Texto de parágrafo e descrições
   */
  body: {
    base: 'text-sm md:text-base leading-relaxed',
    muted: 'text-xs md:text-sm leading-relaxed text-slate-400',
  },

  /**
   * Pequenos rótulos / chips / meta-informações
   */
  label: {
    upperMuted:
      'text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400',
  },

  /**
   * Texto usado em botões e elementos clicáveis
   */
  actions: {
    primary: 'text-sm font-semibold',
    secondary: 'text-sm font-medium',
    link: 'text-sm font-medium',
  },
} as const;

export type UiTypography = typeof uiTypography;

