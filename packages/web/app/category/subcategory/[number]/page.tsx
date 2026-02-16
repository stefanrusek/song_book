import { SubcategoryPageContent } from './content'

type PageProps = {
  params: Promise<{
    number: string
  }>
  searchParams: Promise<{
    current?: string
  }>
}

export default async function SubcategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { number: numberStr } = resolvedParams
  const currentHymnNumberStr = resolvedSearchParams.current

  const subcategoryNumber = parseInt(numberStr, 10)
  const isValidNumber = !isNaN(subcategoryNumber)

  if (!isValidNumber) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Subcategory not found</h1>
        <p className="text-gray-600">Invalid subcategory number.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Home
        </a>
      </div>
    )
  }

  // Return the client component with the resolved values
  return (
    <SubcategoryPageContent
      subcategoryNumber={subcategoryNumber}
      currentHymnNumberStr={currentHymnNumberStr}
    />
  )
}
