import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import PropTypes from "prop-types";

export function UserSearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Buscar estudiantes..." 
        className="pl-8" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
UserSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};