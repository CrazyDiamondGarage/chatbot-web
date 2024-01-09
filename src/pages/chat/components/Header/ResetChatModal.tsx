import { Button, Modal } from 'antd'

type Props = {
  characterName: string
  open: boolean
  loading: boolean
  onCancle: () => void
  onConfirm: () => void
}

export function ResetChatModal({
  characterName,
  open,
  loading,
  onCancle,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} footer={null} closable={false} width={416} centered>
      <div className="my-2 text-center">
        <div className="text-18px font-600">
          Start a new chat with {characterName} ?
        </div>
        <div className="mt-6">
          <Button size="large" onClick={onCancle}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="ml-3"
            loading={loading}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
