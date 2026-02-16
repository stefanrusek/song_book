import { SongPageContent } from './content'

type PageProps = {
  params: Promise<{
    number: string
  }>
}

export default async function SongPage({ params }: PageProps) {
  const resolvedParams = await params
  const { number: numberStr } = resolvedParams

  // Validate the number parameter
  const number = parseInt(numberStr, 10)
  const isValidNumber = !isNaN(number) && number >= 1 && number <= 700

  if (!isValidNumber) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Song not found</h1>
        <p className="text-gray-600">
          {`The song number "${numberStr}" is invalid. Please enter a number between 1 and 700.`}
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Home
        </a>
      </div>
    )
  }

  // Return the client component with the resolved number
  return <SongPageContent number={number} numberStr={numberStr} />
}
