import React from 'react';

interface LatexMathProps {
  formula?: string;
  className?: string;
  inline?: boolean;
}

export const LatexMath: React.FC<LatexMathProps> = ({ formula, className = '', inline = false }) => {
  if (!formula) return null;

  // Format common LaTeX patterns into clean, legible HTML math representations
  const formatted = formula
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\ln/g, 'ln')
    .replace(/\\theta/g, 'θ')
    .replace(/\\int_([^\s^]+)\^([^\s]+)/g, '∫ $1 to $2')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^circ/g, '°');

  if (inline) {
    return (
      <span className={`font-mono text-sm px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 inline-block mx-1 ${className}`}>
        {formatted}
      </span>
    );
  }

  return (
    <div className={`my-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center font-mono text-sm md:text-base text-slate-800 dark:text-slate-200 shadow-xs ${className}`}>
      <span className="text-xs uppercase tracking-wider text-slate-400 block mb-0.5">Formula:</span>
      <span className="font-semibold text-blue-700 dark:text-blue-400">{formatted}</span>
    </div>
  );
};
