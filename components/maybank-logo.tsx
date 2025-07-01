import Image from 'next/image'

export function MaybankLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/maybank-emblem.png"
        alt="Logo"
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
  )
}
