import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth/auth.service";

export function sidebarConfig ( translateService: TranslateService, authService: AuthService ) {
    return [
        {
            caption: translateService.instant('MENU.OPTIONS.SKILLS'),
            customClass: 'btn btn-outline-light mb-3 w-100',
            customStyle: '',
            //action: ()=>{ console.log("To skills") },
            route: 'skills',
            icon:''
        },
        {
            caption: translateService.instant('MENU.OPTIONS.PROJECTS'),
            customClass: 'btn btn-outline-light mb-3 w-100',
            customStyle: '',
            action: ()=>{ return },
            route: '',
            icon:''
        },
        {
            caption: translateService.instant('MENU.OPTIONS.RESOURCES'),
            customClass: 'btn btn-outline-light mb-3 w-100',
            customStyle: '',
            action: ()=>{ return },
            route: '',
            icon:''
        },
        {
            caption: translateService.instant('MENU.OPTIONS.CONTACT'),
            customClass: 'btn btn-outline-light mb-3 w-100',
            customStyle: '',
            action: ()=>{ return },
            route: '',
            icon:''
        },
        {
            caption: translateService.instant('MENU.OPTIONS.LOGOUT'),
            customClass: 'btn btn-danger mb-3 w-100',
            //customStyle: 'background-color: black !important; color: cyan;',
            action: ()=>{ authService.clearAuth(); },
            route: '',
            icon:'fa fa-sign-out exit-btn'
        }
    ];
} 