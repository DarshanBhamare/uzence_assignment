import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'

const root = createRoot(document.getElementById('app')!)

root.render(
  <StrictMode>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Kanban Component Library</h1>
      <p className="mt-4 text-gray-600">Storybook is ready to use. Run `npm run storybook` to view stories.</p>
    </div>
  </StrictMode>
)

