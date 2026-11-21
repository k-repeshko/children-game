import './SelectField.scss'

export type SelectFieldOption = {
  value: string
  label: string
}

export type SelectFieldProps = {
  label: string
  value: string
  options: readonly SelectFieldOption[]
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="ui-select-field">
      <span className="ui-select-field__label">{label}</span>
      <select
        className="ui-select-field__input"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
