import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[soloLetras]',
  standalone: true
})

export class SoloLetrasDirective {
  // Letras (mayúsc/minúsc) con acentos y ñ
  private readonly letraRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/u;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const selStart = input.selectionStart ?? value.length;
    const selEnd = input.selectionEnd ?? value.length;
    const hasSelection = selEnd > selStart;

    // Teclas de control / navegación permitidas
    const controlKeys = [
      'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
      'Tab','Home','End','Escape','Enter'
    ];
    if (controlKeys.includes(event.key)) return;

    // Permitir combinaciones comunes (Ctrl/Cmd)
    if (event.ctrlKey || event.metaKey) return;

    // Permitir letras con acentos/ñ (tecla por tecla)
    if (this.letraRegex.test(event.key)) return;

    // Manejo específico del espacio
    if (event.key === ' ') {
      // Valor actual sin la selección (si la hay)
      const before = value.slice(0, selStart);
      const selected = value.slice(selStart, selEnd);
      const after = value.slice(selEnd);

      const currentSpaces = (value.match(/ /g) ?? []).length;
      const selectedSpaces = (selected.match(/ /g) ?? []).length;
      const spacesAfterInsert = currentSpaces - selectedSpaces + 1; // se insertará 1 espacio

      const leadingSpace = selStart === 0;             // no permitir espacio al inicio
      const prevIsSpace = before.endsWith(' ');        // no permitir doble espacio
      const nextIsSpace = after.startsWith(' ');       // no permitir doble espacio

      // Permitir SOLO si:
      // - no genera más de 1 espacio total
      // - no es al inicio
      // - no crea espacios consecutivos
      if (
        spacesAfterInsert <= 1 &&
        !leadingSpace &&
        !prevIsSpace &&
        !nextIsSpace
      ) {
        return; // permitir
      }

      event.preventDefault();
      return;
    }

    // Cualquier otro carácter, bloquear
    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const input = event.target as HTMLInputElement;
    const pasted = event.clipboardData?.getData('text') ?? '';

    // Permitir vacío
    if (pasted === '') return;

    // Regla: solo letras + opcionalmente un único espacio intermedio
    // Ejemplos válidos: "Andrea", "Andrea Sanchez"
    // Inválidos: " Andrea", "Andrea  Sanchez", "Andrea Sanchez Vega", "Andr3a"
    const patron = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)?$/u;

    if (!patron.test(pasted)) {
      event.preventDefault();
      return;
    }

    // Si el input ya contiene un espacio y el pegado trae otro, bloquear (para no exceder 1)
    const yaTieneEspacio = / /.test(input.value);
    const pegadoTieneEspacio = / /.test(pasted);
    if (yaTieneEspacio && pegadoTieneEspacio) {
      event.preventDefault();
      return;
    }
  }
}
