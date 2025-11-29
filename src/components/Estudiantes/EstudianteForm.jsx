import PropTypes from "prop-types"

export function UserFormField({ label, value, onChange, readOnly = false }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 mb-2 text-sm font-medium">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full p-3 bg-[#F8F9FA] rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B5B8] focus:border-transparent"
      />
    </div>
  )
}

// Define prop types
UserFormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
}

