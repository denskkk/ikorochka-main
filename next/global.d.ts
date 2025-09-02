// Temporary augmentation to satisfy className prop inference issues for motion components
import 'framer-motion'
import { HTMLAttributes } from 'react'
declare module 'framer-motion' {
  interface HTMLMotionProps<T> extends HTMLAttributes<T> {}
}

// Telegram MTProto library fallback declarations (if real types not resolved)
declare module 'telegram' {
  export const TelegramClient: any
}
declare module 'telegram/sessions' {
  export const StringSession: any
}