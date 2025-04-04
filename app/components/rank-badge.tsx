import { Rank } from "@/app/types";

enum RankColor {
  Junior = 'bg-green-100 text-green-800 border-green-400',
  Middle = 'bg-yellow-100 text-yellow-800 border-yellow-400',
  Senior = 'bg-red-100 text-red-800 border-red-400'
}

export function RankBadge({rank}: { rank: Rank }) {
  return (
    <span className={`${RankColor[rank as keyof typeof RankColor]} text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm`}>
      {rank}
    </span>
  )
}
