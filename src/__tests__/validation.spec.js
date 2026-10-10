/*
 * Tests de las reglas de validación de formularios.
 */
import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateMaxLength,
  validateNewPassword,
  validateQuantity,
} from '@/utils/validation'

describe('validation', () => {
  it('validateEmail rechaza vacíos y formatos incorrectos', () => {
    expect(validateEmail('')).toBe('Introduce tu email.')
    expect(validateEmail('ana@')).toBe('Introduce un email válido.')
    expect(validateEmail('ana@test.com')).toBe('')
  })

  it('validateNewPassword exige al menos 8 caracteres', () => {
    expect(validateNewPassword('corta')).toContain('al menos 8 caracteres')
    expect(validateNewPassword('suficiente')).toBe('')
  })

  it('validateQuantity solo acepta enteros de 1 o más', () => {
    expect(validateQuantity(1)).toBe('')
    expect(validateQuantity(0)).not.toBe('')
    expect(validateQuantity(1.5)).not.toBe('')
    /* Campo vacío: v-model.number deja una cadena vacía */
    expect(validateQuantity('')).not.toBe('')
  })

  it('validateMaxLength avisa solo si se supera el límite', () => {
    expect(validateMaxLength('12345', 5, 'Demasiado largo')).toBe('')
    expect(validateMaxLength('123456', 5, 'Demasiado largo')).toBe('Demasiado largo')
  })
})