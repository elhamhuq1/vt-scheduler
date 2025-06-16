import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const EmptyState = () => {
  return (
    <div className="text-center border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm">
      <div className="mt-2">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <MagnifyingGlassIcon className="h-full w-full" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses added</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by searching for courses.</p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-vt-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-vt-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-orange"
          >
            <MagnifyingGlassIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Search Courses
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmptyState 