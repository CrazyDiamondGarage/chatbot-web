import { CreatorGuideline } from '@/components/CreatorGuideline'
import { useCharacterStore } from '@/stores/character'

import { UpsertForm } from './components/UpsertForm'

export default function Character() {
  const { mode } = useCharacterStore()

  return (
    <div className="h-full w-full py-6">
      <div className="w-580px mx-auto rounded-xl border border-gray-300 p-6">
        <div className="flex">
          <p className="flex-grow text-30px mb-6 font-bold text-pink-500">
            {mode} Your Character
          </p>
          <CreatorGuideline />
        </div>

        <UpsertForm />
      </div>
    </div>
  )
}
