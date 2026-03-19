'use client'

type VerseDisplayProps = {
  text: string
}

export function VerseDisplay({ text }: VerseDisplayProps) {
  return (
    <p className="verse text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-serif">
      {text}
    </p>
  )
}
