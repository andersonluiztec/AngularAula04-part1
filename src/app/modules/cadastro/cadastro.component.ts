import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';



function marcaCamposDoFormComoTouched(form: FormGroup) {
    const controlKeys = Object.keys(form.controls);
     controlKeys.forEach(controlKeyAtual => {
        form.get(controlKeyAtual).markAsTouched({ onlySelf: true });
    }) 
}

@Component({
    selector: 'cadastro-page',
    templateUrl: './cadastro.component.html'
})

export class CadastroComponent{

    isLoading = false;

    formCadastro: FormGroup = new FormGroup({
        nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
        usuario: new FormControl('', {
            asyncValidators: [this.validaUsuario.bind(this)],
            validators: [Validators.required, Validators.maxLength(10)]
            // updateOn: 'blur'     
        }),
        telefone: new FormControl('',[Validators.required, 
                                      Validators.minLength(8), 
                                      Validators.maxLength(9),
                                      Validators.pattern('[0-9]{8}([0-9])?')])                      
    });

    handleCadastroUsuario() {
          if (this.formCadastro.invalid) {
             marcaCamposDoFormComoTouched(this.formCadastro);
         } else {

         this.httpClient
                .post('http://localhost:3200/users', 
                {
                    name: this.formCadastro.get('nome').value,
                    username: this.formCadastro.value.usuario,
                    phone: this.formCadastro.value.telefone
                })
                .subscribe(
                    (resposta: any) => {
                        console.log('Resposta', resposta);
                        if (resposta) {
                            //alert('Usuário salvo com sucesso');
                            this.isLoading = true;
                            setTimeout(() => {
                                this.router.navigate(['login'], {
                                    state: { email: resposta.email, password: resposta.password}
                                });
                            }, 3000);
                        }
                    },
                    err => {
                        console.log('Erro', err);
                    },
                    () => {
                        console.log('Terminou');
                    }
                )
            }
    }

    validaUsuario(campo: FormControl) {
        return this.httpClient.get('http://localhost:3200/users').pipe(
            map((resposta: any) => {
                const usuariosFiltrados = resposta.users.filter(user => {
                    return user.username === campo.value;
                });
                const usernameEhInvalido = usuariosFiltrados.length !== 0;
                return usernameEhInvalido ? { usernameEmUso: true } : null;
            })
        );
    }

    constructor(private httpClient: HttpClient, private router: Router) {
    /* fetch('http://localhost:3200/users')
        .then(resposta => {
            if (resposta.ok)
                return resposta.json();
        })
        .then(resposta => {
            console.log(resposta.users);
        })
        .catch(err => {
            console.log('Erro', err.message);
        }) */


/*         httpClient
            .get('http://localhost:3200/users')
            .subscribe(
                resposta => {
                    console.log('Resposta', resposta);
                },
                err => {
                    console.log('Erro', err);
                },
                () => {
                    console.log('Terminou');
                }
            ) */

           /*  httpClient
            .post('http://localhost:3200/users', 
            {
                name: "Anderson2",
                username: "anderson2",
                phone: "12341234"
            })
            .subscribe(
                resposta => {
                    console.log('Resposta', resposta);
                },
                err => {
                    console.log('Erro', err);
                },
                () => {
                    console.log('Terminou');
                }
            ) */
    }
}

