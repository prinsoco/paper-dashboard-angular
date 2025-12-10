
// src/app/shared/directives/solo-numeros.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[soloNumeros]' // mismo selector para reutilizar
})
export class SoloNumerosDirective {
  // Caracteres permitidos por tecla
  private readonly digito = /^[0-9]$/;
  private readonly separadores = /^[\.,]$/;  // punto o coma
  private readonly signoMenos = /^-$/;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const caretPos = input.selectionStart ?? value.length;

    const controlKeys = [
      'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
      'Tab','Home','End','Escape','Enter'
    ];
    if (controlKeys.includes(event.key)) return;

    if (event.ctrlKey || event.metaKey) return;

    // Dígitos (incluye keypad)
    if (this.digito.test(event.key)) return;

    // Permitir un único separador decimal (.,) y que no exista ya
    if (this.separadores.test(event.key)) {
      const yaTieneSeparador = /[.,]/.test(value);
      if (!yaTieneSeparador) return;
      event.preventDefault();
      return;
    }

    // Permitir '-' solo al inicio y que no exista ya
    if (this.signoMenos.test(event.key)) {
      const yaTieneMenos = value.includes('-');
      const enInicio = caretPos === 0;
      if (!yaTieneMenos && enInicio) return;
      event.preventDefault();
      return;
    }

    // Cualquier otro carácter, bloquear
    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const input = event.target as HTMLInputElement;
    const texto = event.clipboardData?.getData('text') ?? '';

    // Permitir: -?  dígitos  [opcional: separador (.,) + dígitos]
    // Ejemplos válidos: "123", "-123", "123.45", "-123,45"
    const numeroValido = /^-?\d+([.,]\d+)?$/;
    if (!numeroValido.test(texto)) {
      event.preventDefault();
      return;
    }

    // Si ya hay separador y el pegado trae otro distinto, bloquear
    const yaTieneSeparador = /[.,]/.test(input.value);
    const pegadoTieneSeparador = /[.,]/.test(texto);
    if (yaTieneSeparador && pegadoTieneSeparador) {
      event.preventDefault();
    }
  }
}
