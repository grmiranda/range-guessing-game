import type { ReactNode } from 'react'
import classNames from '../../../utils/classNames'
import styles from './ScreenTemplate.module.scss'

interface ScreenTemplateProps {
  header?: ReactNode
  children: ReactNode
  aside?: ReactNode
  footer?: ReactNode
}

export default function ScreenTemplate({
  header,
  children,
  aside,
  footer,
}: ScreenTemplateProps) {
  const hasAside = aside !== undefined && aside !== null

  return (
    <div
      className={classNames(
        styles['screen-template'],
        hasAside && styles['screen-template--with-aside'],
      )}
    >
      {header && <header className={styles['screen-template__header']}>{header}</header>}
      <div className={styles['screen-template__body']}>
        <main className={styles['screen-template__main']}>{children}</main>
        {hasAside && <aside className={styles['screen-template__aside']}>{aside}</aside>}
      </div>
      {footer && <footer className={styles['screen-template__footer']}>{footer}</footer>}
    </div>
  )
}
