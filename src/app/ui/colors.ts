export const uiColors = {
  /**
   * Cor principal da marca / ações primárias
   */
  primary: {
    solid: 'bg-emerald-500 text-slate-950',
    hover: 'bg-emerald-400 text-slate-950',
    pressed: 'bg-emerald-600 text-slate-50',
    subtle: 'bg-emerald-500/10 text-emerald-200',
    border: 'border-emerald-500',
    borderOpacity: 'border-emerald-500/20',
  },

  /**
   * Fundo da aplicação e superfícies
   */
  background: {
    app: 'bg-slate-950 text-slate-100',
    appShell:
      'min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50',
    surface: 'bg-slate-900',
    surfaceOpacity: 'bg-slate-900/80',
    surfaceElevated: 'bg-slate-900/60',
    surfaceLight: 'bg-white',
    surfaceLightAlt: 'bg-slate-50',
  },

  /**
   * Cores de texto
   */
  text: {
    primary: 'text-slate-100',
    secondary: 'text-slate-400',
    muted: 'text-slate-500',
    primaryLight: 'text-slate-900',
    secondaryLight: 'text-slate-700',
    mutedLight: 'text-slate-500',
  },

  /**
   * Bordas / divisores
   */
  border: {
    subtle: 'border-slate-800',
    subtleOpacity: 'border-slate-800/80',
    strong: 'border-slate-700',
    strongOpacity: 'border-slate-700/80',
    primary: 'border-emerald-500',
    subtleLight: 'border-slate-200',
  },

  /**
   * Cores de acento (detalhes, links, glow)
   */
  accent: {
    sky: 'text-sky-400',
    skyBorder: 'border-sky-500',
    cyanBorder: 'border-cyan-400',
  },

  /**
   * Botões (combinação de fundo + texto)
   */
  button: {
    neutral:
      'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
  },

  /**
   * Cores semânticas
   */
  semantic: {
    success: {
      text: 'text-emerald-400',
      subtle: 'bg-emerald-500/15 text-emerald-200',
    },
    warning: {
      text: 'text-amber-300',
      subtle: 'bg-amber-400/20 text-amber-200',
    },
    error: {
      text: 'text-rose-300',
      subtle: 'bg-rose-500/20 text-rose-200',
    },
  },
} as const;

export type UiColors = typeof uiColors;

