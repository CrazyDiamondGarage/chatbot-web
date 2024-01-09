import { useNavigate, useParams } from 'react-router-dom'
import { useLifecycles } from 'react-use'

import { getCharacter } from '@/api/character'
import { createChatKey, listChatHistory } from '@/api/chat'
import { PlanModal } from '@/components/Layout/Header/PlanModal'
import { useAppStore } from '@/stores/app'
import { useCharacterStore } from '@/stores/character'
import { Message, useChatStore } from '@/stores/chat'

import { Content } from './components/Content'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export default function Chat() {
  const { id, chat_key } = useParams()
  const navigate = useNavigate()

  const { chatKeyRef, setMessages, reset } = useChatStore()
  const { setCharacter } = useCharacterStore()
  const { planOpen, setPlanOpen } = useAppStore()

  useLifecycles(() => init(chat_key, true), exit)

  async function init(chatKey: string = '', needToGetCharacter?: boolean) {
    chatKeyRef.current = chatKey

    if (needToGetCharacter) {
      getCharacter(id!).then((character) => setCharacter(character))
    }

    const historyList = await listChatHistory(chatKeyRef.current)
    const realHistoryList = historyList.data.filter(({ content }) => !!content)
    if (!realHistoryList.length) {
      return
    }
    const messages: Message[] = realHistoryList.reverse().map((item) => ({
      id: item.id,
      message: item.content,
      type: item.type === 'user' ? 'user' : 'chatbot',
    }))
    setMessages(messages)
  }

  function exit() {
    setCharacter({})
    reset()
  }

  async function resetChat() {
    reset()
    const { chat_key } = await createChatKey(id!)
    await init(chat_key)
    navigate(`/character/${id}/chat/${chat_key}`, { replace: true })
  }

  return (
    <div className="h-full w-full">
      <div className="h-72px w-full">
        <Header resetChat={resetChat} />
      </div>
      <div className="max-w-720px mx-auto flex h-[calc(100%-72px)] w-full flex-col justify-center py-6">
        <div className="min-h-0 w-full flex-1">
          <Content />
        </div>
        <div className="max-h-120px min-h-80px w-full">
          <Footer />
        </div>
      </div>

      <PlanModal open={planOpen} close={() => setPlanOpen(false)} />
    </div>
  )
}
