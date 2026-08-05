import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { GENRES, STYLES } from '@/types/review'

interface GenreStyleSelectorProps {
  genre: string
  style: string
  onGenreChange: (v: string) => void
  onStyleChange: (v: string) => void
}

export function GenreStyleSelector({
  genre,
  style,
  onGenreChange,
  onStyleChange,
}: GenreStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Gênero</Label>
        <Select value={genre} onValueChange={onGenreChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Estilo desejado</Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
