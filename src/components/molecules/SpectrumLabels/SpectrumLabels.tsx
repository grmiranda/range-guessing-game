import type { Spectrum } from '../../../types/game'
import styles from './SpectrumLabels.module.scss'

interface SpectrumLabelsProps {
  spectrum: Spectrum
}

export default function SpectrumLabels({ spectrum }: SpectrumLabelsProps) {
  return (
    <div
      role="group"
      aria-label={`Espectro: ${spectrum.left} a ${spectrum.right}`}
      className={styles['spectrum-labels']}
    >
      <span className={styles['spectrum-labels__left']}>{spectrum.left}</span>
      <span className={styles['spectrum-labels__right']}>{spectrum.right}</span>
    </div>
  )
}
