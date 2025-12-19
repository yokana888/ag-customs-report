import { inject, computedFrom } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";

@inject(AuthService)
export class NavBar {
    constructor(authService) {
        this.authService = authService;
    }

    @computedFrom('authService.authenticated')
    get isAuthenticated() {
        return this.authService.authenticated;
    }

    attached() {
         if (this.authService.authenticated) {
            this.authService.getMe()
                .then((result) => {
                    this.me = result.data;
                })
                .catch((err) => {
                    if (err.status == 401) {
                        alert("Sesi anda telah habis, silahkan login kembali.");
                        this.logout();
                    }
                });
        } else {
            this.me = null;
        }
    }

    logout() {
        this.authService.logout("#/login");
    }
}
