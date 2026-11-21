import './NumberField.scss'

export type NumberFieldProps = {
  label: string
  value: string
  min?: number
  max?: number
  step?: number
  onChange: (value: string) => void
}

export function NumberField({ label, value, min, max, step = 1, onChange }: NumberFieldProps) {
  return (
    <label className="ui-number-field">
      <span className="ui-number-field__label">{label}</span>
      <input
        className="ui-number-field__input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    </label>
  )
}
