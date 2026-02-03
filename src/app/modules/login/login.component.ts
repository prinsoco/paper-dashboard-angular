
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginAut, LoginFiltro } from '../../interfaces/login.interface';
import { AutorizacionServices } from '../../services/autorizacion.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  invalidLogin: boolean;
  emailRequerido: boolean;
  emailError: number;
  passRequerido: boolean;
  passMinLen: boolean;
  passError: number;
  textSpinner = "Cargando...";

  constructor(private fb: FormBuilder,
    private apiService: AutorizacionServices,
    private router: Router,
    private toastr: ToastrService,
    private spinner : NgxSpinnerService
  ) {
    this.emailRequerido = false;
    this.emailError = 0;
    this.passMinLen = false;
    this.passError = 0;
    this.passRequerido = false;
  }

  ngOnInit(): void {
    this.textSpinner = "Cargando...";
      this.iniciaForm();
  }

  iniciaForm(){
     this.loginForm = this.fb.group({
      emailuser: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validarFrom() {
    const emailPass = this.loginForm.controls["emailuser"].errors;
    const errorPass = this.loginForm.controls["password"].errors;

    if(emailPass != null && emailPass != undefined){
      this.emailError = 1;

      if(emailPass.required != undefined && emailPass.required){
        this.emailRequerido = true;
      }
      else{
        this.emailRequerido = false;
      }
    }
    else{
      this.emailError = 0;
    }

    if(errorPass != null && errorPass != undefined){
      this.passError = 1;
      
      if(errorPass.required != undefined && errorPass.required){
        this.passRequerido = true;
      }
      else{
        this.passRequerido = false;
      }

      if(errorPass.minlength != undefined && errorPass.minlength.actualLength < 6){
        this.passMinLen = true;
      }
      else{
        this.passMinLen = false;
      }
    }
    else{
      this.passError = 0;
    }
  }

  async onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (!this.loginForm.invalid) {
      var filtro: LoginFiltro = {
        clave: this.loginForm.controls["password"].value,
        usuarioEmail: this.loginForm.controls["emailuser"].value,
        tipoUsuario: "P"
      }

      var resp = await this.apiService.login(filtro, "Paciente").toPromise()
      .then(res => {
        this.invalidLogin = false;
        const infoLogin = (<LoginAut>res);
        const tipoUsuario = (<LoginAut>res).loginPerfil;
        const code = (<LoginAut>res).codigo;
        const mensaje = (<LoginAut>res).mensaje;
              
        if(code && code === 9999){
          this.spinner.hide();
          this.showNotification(4, "top","right", "Usuario o clave incorrecto");
        }
        else{
          localStorage.setItem("jwt", infoLogin.token);
          localStorage.setItem("loginApellidos", infoLogin.loginApellidos);
          localStorage.setItem("loginNombre", infoLogin.loginNombre);
          localStorage.setItem("loginIdentificacion", infoLogin.loginIdentificacion);
          localStorage.setItem("loginUsuario", infoLogin.loginUsuario);
          localStorage.setItem("loginId", infoLogin.loginId?.toString() ?? "");
          localStorage.setItem("loginPerfilId", infoLogin.loginPerfilId?.toString() ?? "");
          localStorage.setItem("loginPerfil", infoLogin.loginPerfil);
          localStorage.setItem("loginDescPerfil", infoLogin.loginDescPerfil);
          localStorage.setItem("loginExpToken", infoLogin.loginExpToken?.toString() ?? "");
          localStorage.setItem("loginFecUltLogin", infoLogin.loginFecUltLogin?.toString() ?? "");
          localStorage.setItem("time", infoLogin.time);
          localStorage.setItem("lastLogin", infoLogin.lastLogin);
          this.spinner.hide();
          this.router.navigate(["/agendamiento"]);
        }
      })
      .catch((err) => {
        this.invalidLogin = true;
        this.spinner.hide();
        if(err.status == '504'){
          this.showNotification(4, "top","right", "Sistema no disponible");
        }else if(err.status == 0){
          this.showNotification(3, "top","right", "Credenciales no válidas");
        }
        else{
          this.showNotification(3, "top","right", "Error en autenticacion");
        }
      });
      return;
    }
    else{
      this.spinner.hide();
      this.validarFrom();
    }

    console.log('Login data:', this.loginForm.value);
  }

  reiniciarVariables(){

  }

  showNotification(color: number, from, align, mensaje: string) {

    switch (color) {
      case 1:
        this.toastr.info(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + mensaje + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }

}
}
