import React from 'react'
import './FollowInfoModal.css'
import ReactModal from 'react-modal'

export default function FollowInfoModal() {
  return (
    <ReactModal
      isOpen
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      </ReactModal>
  )
}
