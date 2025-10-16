import Image from 'next/image'

export function CimbLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/cimb-emblem.jpg"
        alt="Logo"
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
  )
}


