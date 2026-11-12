import type { ReactNode } from 'react'
import classNames from '../../../utils/classNames'
import styles from './Heading.module.scss'

interface HeadingProps {
  level: 1 | 2 | 3
  children: ReactNode
  align?: 'left' | 'center'
}

export default function Heading({ level, children, align = 'left' }: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag
      className={classNames(
        styles.heading,
        styles[`heading--level-${level}`],
        styles[`heading--align-${align}`],
      )}
    >
      {children}
    </Tag>
  )
}
