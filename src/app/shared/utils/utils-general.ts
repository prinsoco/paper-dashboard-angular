import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })

  export class UtilsGeneral {
    constructor(private route: ActivatedRoute) { }

    public soloNumeros(event: KeyboardEvent){
            const pattern = /^[0-9]$/;
        const inputChar = event.key;

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
      }

       /** Valida si solo contiene letras y espacios */
  onlyLetters(value: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    return regex.test(value.trim());
  }

  onlyLettersNoSpaces(event: KeyboardEvent) {
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        const inputChar = event.key;

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
  }

  isValidEmail(email: string): boolean {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email.trim());
  }
  }