import { Button, Switch } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi'
import { useSearchParams } from 'react-router-dom'
import { useLifecycles } from 'react-use'

import {
  Character,
  Tag,
  listCharacter,
  listCharacterByTag,
  listFavouriteCharacter,
  listMyCharacter,
} from '@/api/character'
import { DataLoading } from '@/components/Lottie/DataLoading'
import { useAppStore } from '@/stores/app'
import { useCharacterStore } from '@/stores/character'
import { KEYS } from '@/utils/constants'
import { LoginModalState } from '@/utils/enums'

import { CharacterCard } from './components/CharacterCard'
import { CreateButton } from './components/CreateButton'
import { RecentlyChatted } from './components/RecentlyChatted'
import { SiteInfo } from './components/SiteInfo'
import { TopCharacters } from './components/TopCharacters'

export default function Home() {
  const [searchParams] = useSearchParams()
  const { setLoginModalState, allTagsRef } = useAppStore()
  const { characterList, setCharacterList } = useCharacterStore()

  const characterListRef = useRef<Character[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tagsRef = useRef<HTMLDivElement | null>(null)
  const shortTagsRef = useRef<Tag[]>([])
  const pageRef = useRef(1)
  const totalRef = useRef(0)
  const tagTypeRef = useRef('all')
  const [tagType, setTagType] = useState('all')
  const [tagList, setTagList] = useState<Tag[]>([])
  const [showAll, setShowAll] = useState(false)
  const [emptyMsg, setEmptyMsg] = useState('')
  const [end, setEnd] = useState(false)
  const [total, setTotal] = useState(-1)

  let wrapIndex = 0
  const moreTag = wrapIndex < allTagsRef.current.length
  let buttons: HTMLDivElement | null = null
  const root = document.getElementById('root')!

  useLifecycles(init, exit)

  function init() {
    fetchData()

    setTimeout(() => {
      const { clientWidth: containerWidth } = containerRef.current!

      buttons = document.createElement('div')
      buttons.style.visibility = 'hidden'
      buttons.style.position = 'absolute'
      buttons.style.top = '0'
      buttons.style.left = '0'
      buttons.style.display = 'inline-block'
      document.body.appendChild(buttons)

      for (; wrapIndex < allTagsRef.current.length; wrapIndex++) {
        const { name, emoji } = allTagsRef.current[wrapIndex]

        const button = document.createElement('button')
        button.style.padding = '0 15px'
        button.style.visibility = 'hidden'
        button.style.fontSize = '12px'
        button.style.marginRight = '0.5rem'
        button.innerText = `${emoji} ${name}`
        buttons.appendChild(button)

        if (buttons.clientWidth + 138 + 332 > containerWidth) {
          break
        }
      }

      if (wrapIndex === allTagsRef.current.length - 1) {
        setTagList(allTagsRef.current)
      } else {
        shortTagsRef.current = allTagsRef.current.slice(0, wrapIndex)
        setTagList(shortTagsRef.current)
      }
    }, 0)

    if (
      searchParams.get('message_type') === 'stripe_callback' &&
      !!searchParams.get('message')
    ) {
      setLoginModalState(LoginModalState.CHECKOUT)
    }

    root.addEventListener('scroll', handleHomeScroll)
  }

  function exit() {
    if (buttons) {
      document.body.removeChild(buttons)
    }
    root.removeEventListener('scroll', handleHomeScroll)
  }

  useEffect(() => {
    characterListRef.current = characterList
  }, [characterList])

  // async function fetchData() {
  //   const { data, total } = await listCharacter()
  //   setCharacterList(data)
  //   totalRef.current = total
  //   setTotal(total)
  // }

  async function fetchData(page?: number) {
    switch (tagTypeRef.current) {
      case 'all':
        const { data: allList, total: allTotal } = await listCharacter(page)

        setCharacterList([...characterListRef.current, ...allList])
        setTotal(allTotal)
        break
      case 'fav':
        const { data: favList, total: favTotal } =
          await listFavouriteCharacter(page)

        setCharacterList([...characterListRef.current, ...favList])
        setTotal(favTotal)
        if (favTotal === 0) {
          setEmptyMsg(`💔 You haven't liked a Character yet.`)
        }
        break
      case 'my':
        const { data: myList, total: myTotal } = await listMyCharacter(page)

        setCharacterList([...characterListRef.current, ...myList])
        setTotal(myTotal)
        if (myTotal === 0) {
          setEmptyMsg(`🤖 You haven't created any Characters yet.`)
        }
        break
      default:
        const { data: tagList, total: tagTotal } = await listCharacterByTag(
          tagTypeRef.current,
          page,
        )

        setCharacterList([...characterListRef.current, ...tagList])
        setTotal(tagTotal)
        if (tagTotal === 0) {
          setEmptyMsg(`🤖 No Characters with current tag`)
        }
        break
    }
  }

  function toggleShowAll() {
    if (showAll) {
      setTagList(shortTagsRef.current)
      setShowAll(false)
      return
    }

    setTagList(allTagsRef.current)
    setShowAll(true)
  }

  async function handleTagClick(type: string) {
    tagTypeRef.current = type
    setTagType(type)
    characterListRef.current = []
    fetchData()
  }

  const handleHomeScroll = async () => {
    if (root.scrollHeight - root.scrollTop !== root.clientHeight) {
      return
    }

    if (characterListRef.current.length === total) {
      setEnd(true)
      return
    }

    pageRef.current += 1
    fetchData(pageRef.current)
  }

  function getClassByTagType(type: string) {
    if (type !== tagType) {
      return ''
    }

    if (['all', 'fav', 'my'].includes(type)) {
      return 'bg-pink-500 text-white! pointer-events-none'
    }

    return 'bg-pink-100 border-1px border-solid border-pink-500 dark:bg-white dark:border-none dark:text-black pointer-events-none'
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-340px min-w-340px mr-4 mt-4 sm:hidden lg:inline">
        <CreateButton />
        <RecentlyChatted />
        <TopCharacters />
        <SiteInfo />
      </div>
      <div className="lg-min-w-636px relative mb-4 w-full">
        <div
          ref={containerRef}
          className="top-18 sticky z-20 flex bg-white dark:bg-gray-800"
        >
          <div ref={tagsRef} className="flex w-0 flex-1 flex-wrap gap-2 py-4">
            <Button
              onClick={() => handleTagClick('all')}
              className={`text-12px rounded-8px hover:text-pink-700! border-none bg-pink-100 text-pink-700 hover:bg-pink-200 ${getClassByTagType(
                'all',
              )}`}
            >
              🔦 Discover
            </Button>
            <Button
              onClick={() => handleTagClick('fav')}
              className={`text-12px rounded-8px hover:text-pink-700! border-none bg-pink-100 text-pink-700 hover:bg-pink-200 ${getClassByTagType(
                'fav',
              )}`}
            >
              💖 Favourite
            </Button>
            <Button
              onClick={() => handleTagClick('my')}
              className={`text-12px rounded-8px hover:text-pink-700! border-none bg-pink-100 text-pink-700 hover:bg-pink-200 ${getClassByTagType(
                'my',
              )}`}
            >
              🤖 My Char.
            </Button>

            {tagList.map(({ id, name, emoji }) => (
              <Button
                key={id}
                onClick={() => handleTagClick(id.toString())}
                className={`text-12px rounded-8px hover:text-black! border-none bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 ${getClassByTagType(
                  id.toString(),
                )}`}
              >
                {emoji} {name}
              </Button>
            ))}

            {moreTag && (
              <Button
                onClick={toggleShowAll}
                className="flex-center h-8 w-8 rounded-full border-none bg-gray-200 p-2 dark:bg-gray-600"
              >
                {showAll ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
              </Button>
            )}
          </div>
          <div className="pt-20px ml-3 flex gap-x-2">
            <span>NSFW</span>
            <Switch
              defaultChecked
              onChange={(value) =>
                localStorage.setItem(KEYS.NSFW, value.toString())
              }
            />
          </div>
        </div>

        {characterList.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {characterList.map((character) => (
              <CharacterCard key={character.id} {...character} />
            ))}
          </div>
        ) : (
          <div className="top-50% left-50% translate--50% text-24px font-700 absolute w-full text-center">
            {emptyMsg}
          </div>
        )}

        {characterList.length !== total && <DataLoading />}
      </div>
    </div>
  )
}
