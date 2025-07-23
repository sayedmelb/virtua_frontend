import { useState, useCallback } from "react"
import type { FormErrors, ValidationRules } from "../types"

export function useFormValidation<T extends Record<string, any>>(initialValues: T, validationRules: ValidationRules) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback(
    (name: string, value: any): string => {
      const rule = validationRules[name]
      if (!rule) return ""

      if (rule.required && (!value || value.toString().trim() === "")) {
        return "This field is required"
      }

      if (rule.minLength && value.toString().length < rule.minLength) {
        return `Minimum length is ${rule.minLength} characters`
      }

      if (rule.maxLength && value.toString().length > rule.maxLength) {
        return `Maximum length is ${rule.maxLength} characters`
      }

      if (rule.pattern && !rule.pattern.test(value.toString())) {
        return "Invalid format"
      }

      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) return customError
      }

      return ""
    },
    [validationRules],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField, validationRules])

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    },
    [errors],
  )

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, values[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField, values],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
  }
}
