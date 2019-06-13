import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";


@Component({
    selector: 'login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent{

    formLogin: FormGroup;

    constructor(private httpClient: HttpClient, private router: Router) {
        
        let emailInicial = '';
        let senhaInicial = '';

        if (this.router.getCurrentNavigation().extras.state) {
            emailInicial = this.router.getCurrentNavigation().extras.state.email;
            senhaInicial = this.router.getCurrentNavigation().extras.state.password;
        }

        this.formLogin = new FormGroup({
            email: new FormControl(emailInicial, [Validators.required, Validators.email]),
            senha: new FormControl(senhaInicial, {
                asyncValidators: [this.validaUsuario.bind(this)],
                validators: [Validators.required]
            })
         });  
    } 

    validaUsuario(form: FormGroup) {
        return this.httpClient.get('http://localhost:3200/users').pipe(
            map((resposta: any) => {
                const usuariosFiltrados = resposta.users.filter(user => {
                    return user.email === form.value.email && user.password === form.value.senha ;
                });
                const valido = usuariosFiltrados.length !== 0;
                return !valido ? { loginInvalido: true } : null;
            })
        );
    }

    Login() {
        if (this.formLogin.valid) {
            this.router.navigate(['inbox']);
        }
    }

    Cadastro () {
        this.router.navigate(['cadastro']);
    }
}

