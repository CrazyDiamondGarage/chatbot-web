import { Button } from 'antd'

import Book from '@/assets/svg/book.svg'
import { useCharacterStore } from '@/stores/character'

import { UpsertForm } from './components/UpsertForm'

export default function Character() {
  const { mode } = useCharacterStore()

  const openGuideline = () => {
    const url =
      'https://clear-raven-bc0.notion.site/JuicyAI-Creation-Guide-cba9403dfe1a45fa96dafcf0884d848d?pvs=4'
    window.open(url, '_blank', 'noreferrer')
  }

  return (
    <div className="h-full w-full py-6">
      <div className="w-580px mx-auto rounded-xl border border-gray-300 p-6">
        <div className="flex">
          <p className="flex-grow text-30px mb-6 font-bold text-pink-500">
            {mode} Your Character
          </p>
          <Button
            onClick={openGuideline}
            className="flex-center from-#E74694 to-#FFCD83 h-6 mt-3 p-3 rounded-2 border-none bg-gradient-to-r"
          >
            <img src={Book} />
            <p className="text-14px ml-1 font-bold italic text-white">
              Creator Guideline
            </p>
          </Button>
        </div>

        <UpsertForm />
      </div>
    </div>
  )
}
