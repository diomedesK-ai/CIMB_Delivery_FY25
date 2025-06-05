import Image from 'next/image'

export function MaybankLogo() {
  return (
    <div className="flex items-center gap-4">
      <Image 
        src="/images/maybank-emblem.png" 
        alt="Maybank" 
        width={80}
        height={80}
        className="h-20 w-20 object-contain"
        priority
      />
      <span className="font-bold text-[#111111] text-xl">Maybank</span>
    </div>
  )
}
