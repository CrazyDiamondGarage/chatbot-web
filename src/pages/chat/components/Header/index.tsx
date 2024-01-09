import { useState } from 'react'
import { FiRefreshCcw } from 'react-icons/fi'
import { HiChevronLeft, HiHeart, HiOutlineHeart } from 'react-icons/hi'
import { VscBlank } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

import { dislikeCharacter, likeCharacter } from '@/api/user'
import { useCharacterStore } from '@/stores/character'
import { useChatStore } from '@/stores/chat'

import { ResetChatModal } from './ResetChatModal'

type Props = {
  resetChat: () => Promise<void>
}

export function Header({ resetChat }: Props) {
  const navigate = useNavigate()
  const { character, setCharacter } = useCharacterStore()
  const { reset } = useChatStore()
  const [resetChatModalOpen, setResetChatModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  function toggleStar() {
    if (character.is_liked) {
      setCharacter({ ...character, is_liked: 0 })
      dislikeCharacter(character.id!)
      return
    }

    likeCharacter(character.id!)
    setCharacter({ ...character, is_liked: 1 })
  }

  function toHome() {
    reset()
    navigate(-1)
  }

  async function confirm() {
    setLoading(true)
    await resetChat()
    setLoading(false)
    setResetChatModalOpen(false)
  }

  return (
    <>
      <div className="h-full w-full rounded-tl-xl rounded-tr-xl border-b border-b-gray-200 bg-white px-4 py-2.5 dark:border-b-gray-500 dark:bg-gray-800">
        <div className="flex-between gap-6 max-w-720px mx-auto h-full">
          <HiChevronLeft
            onClick={toHome}
            className="h-7 w-7 text-pink-500 hover:cursor-pointer"
          />
          <VscBlank className="h-7 w-7 opacity-0" />
          <div className="text-center flex-grow-1">
            <div className="font-600">{character.name}</div>
            <div className="font-500 text-12px text-gray-500">
              by {character.creator?.name}
            </div>
          </div>
          <div onClick={toggleStar} className="h-7 w-7 hover:cursor-pointer">
            {character.is_liked ? (
              <HiHeart className="h-full w-full text-pink-500" />
            ) : (
              <HiOutlineHeart className="h-full w-full hover:text-pink-500" />
            )}
          </div>
          <div
            onClick={() => setResetChatModalOpen(true)}
            className="h-6 w-6 hover:cursor-pointer"
          >
            <FiRefreshCcw className="h-full w-full hover:text-pink-500" />
          </div>
        </div>
      </div>

      <ResetChatModal
        characterName={character.name || 'same character'}
        open={resetChatModalOpen}
        loading={loading}
        onCancle={() => setResetChatModalOpen(false)}
        onConfirm={() => confirm()}
      />
    </>
  )
}
