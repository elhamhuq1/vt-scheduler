import Navbar from './components/Navbar'
import EmptyState from './components/EmptyState'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="mx-auto max-w-3xl py-32">
            <EmptyState />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
