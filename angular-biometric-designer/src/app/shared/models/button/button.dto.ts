export class ButtonDto {
    sceenCode: string = '';
    screenUrl: string = '';
    buttons: ButtonByScreenDto = new ButtonByScreenDto();
}
export class ButtonByScreenDto {
    buttonCode: string = '';
    buttonName: string = '';
    visibility: boolean = true;
    disable: boolean = false;
    position?: string = 'right'; // 'left' | 'right' | 'center'
}
export class ButtonCustom {
    code: string = '';
    name: string = '';
    isICon: string = '';
    classIcon: string = '';
    visibility: boolean = true;
}
