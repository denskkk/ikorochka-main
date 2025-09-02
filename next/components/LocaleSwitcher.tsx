'use client'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import useHydrated from './hooks/useHydrated'

export default function LocaleSwitcher(){
  const pathname = usePathname() || '/'
  const parts = pathname.split('/')
  const current = parts[1] === 'uk' || parts[1] === 'ru' ? parts[1] : 'uk'

  const switchTo = current === 'uk' ? 'ru' : 'uk'

  // Build new path: replace leading locale if present
  if(parts[1] === 'uk' || parts[1] === 'ru'){
    parts[1] = switchTo
  }else{
    parts.splice(1,0,switchTo)
  }
  const newPath = parts.join('/') || '/' + switchTo

  const router = useRouter()
  const hydrated = useHydrated()

  function onClick(e: any){
    e.preventDefault()
    // set cookie for 1 year
    document.cookie = `lang=${switchTo}; path=/; max-age=${60*60*24*365}`
  try{ localStorage.setItem('lang', switchTo) }catch(err){ console.warn('localStorage not available', err) }
  router.push(newPath as any)
  }

  return (
    <a onClick={onClick} href={newPath} className="text-sm text-white/70 hover:text-white transition">{hydrated ? switchTo.toUpperCase() : 'UK'}</a>
  )
}
